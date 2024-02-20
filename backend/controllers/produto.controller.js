const mongoose = require('mongoose')
const Produto = require('../models/Produto.model.js')
const fs = require('fs')
const path = require('path')

const TransacaoController = require('./transacoes.controller.js')

const listarProdutos = async (req, res) => {
    try {
        // Buscando por todos os produtos
        const produtos = await Produto.find()
        // Verificando se há produtos
        if (produtos.length === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Nenhum produto encontrado',
            })
        }

        //resposta ao cliente 
        return res.status(200).json({
            success: true,
            statusCode: 200,
            produtos
        })
    } catch (err) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            message: 'Nenhum produto encontrado',
            err: err.message
        })
    }
}

const pesquisarProduto = async (req, res) => {
    try {
        const { query } = req.query
        const produtos = await Produto.find({
            nome: {
                $regex: query,
                $options: 'i'
            }
        })

        res.json(produtos)

    } catch (err) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            message: 'Erro ao pesquisar produtos',
            err: err.message
        })
    }
}

const criarProduto = async (req, res) => {
    try {
        // Obtendo os dados do corpo da requisicão
        const { nome, descricao, preco, quantidade } = req.body

        // Pegando o arquivo que vem da requisição
        const file = req.file
        const baseURL = 'http://localhost:3000'

        // Crindo uma nova instância de produtos
        const novoProduto = new Produto({
            nome,
            descricao,
            preco,
            quantidade,
            src: baseURL + `/${file.filename}` //Montei o caminho absoluto para o navegador encontar corretamente
        })

        // Salvando o produto e img no banco
        await novoProduto.save()

        // Adicionando uma transação de saída para o produto
        await TransacaoController.adicionarTransacoes({
            body: {
                produto_id: novoProduto._id, // ID do produto
                nome: novoProduto.nome, // Nome do produto
                tipo: 'entrada', // Tipo de transação (saída)
                quantidade: novoProduto.quantidade // Quantidade a ser retirada como quantidade da transação
            }
        }, res);

    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Erro ao criar produto',
            err: err.message
        })
    }
}

const atualizarProduto = async (req, res) => {
    try {
        // Obtendo os dados do corpo da requisição e dos parâmetros.
        const { id } = req.params
        const { nome, descricao, preco, quantidade } = req.body
        const file = req.file
        const baseURL = 'http://localhost:3000'

        // Verificando se o ID é válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "ID de produto inválido"
            })
        }

        // Buscando o produto pelo ID
        const produto = await Produto.findById(id)

        // verificando se o tem o produto
        if (!produto) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Produto não encontrado",
            })
        }


        // Atualizando com os novos dados
        produto.nome = nome
        produto.descricao = descricao
        produto.preco = preco
        produto.quantidade = quantidade

        // Se uma nova imagem foi enviada, atualiza o caminho da imagem
        if (file) {
            // Se existir uma imagem antiga, apagar ela primeiro
            if (produto.src) {
                const url = produto.src;
                const nomeArquivo = url.substring(url.lastIndexOf('/') + 1);
                const caminhoCompleto = path.join(__dirname, '..', 'uploads', nomeArquivo);
                fs.unlinkSync(caminhoCompleto);
            }

            // Atualiza o caminho da imagem para o novo arquivo
            produto.src = baseURL + `/${file.filename}`
        }

        // Salvando o produto
        await produto.save()

        // Resposta ao cliente
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Produto atualizado com sucesso',
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Erro ao atualizar o produto',
            err: {
                message: err.message,
                stack: err.stack
            }
        })
    }
}


const atualizarQuantidadeProduto = async (req, res) => {
    try {
        // Obtendo os dados do corpo da requisição e dos parâmetros.
        const { id } = req.params
        const { quantidade } = req.body

        // Verifica se o ID é válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "ID de produto inválido"
            });
        }

        // Buscando o produto pelo ID
        const produto = await Produto.findById(id)

        // Verifica se o produto existe
        if (!produto) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Produto não encontrado",
            });
        }

        // Verificando se o tipo de transação é uma saída
        if (quantidade > produto.quantidade) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Desculpe, não é possível adicionar produtos na saída."
            })
        }

        if ((parseInt(quantidade) === 1 && produto.quantidade === 1) || parseInt(quantidade) === 0) {
            await Produto.findByIdAndDelete(id);
            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Estoque acabado"
            });
        }
        
        // Atualiza apenas a quantidade do produto
        produto.quantidade -= quantidade


        // Salva produto atualizado
        await produto.save()

        // Adicionando uma transação de saída para o produto
        await TransacaoController.retirarTransacoes({
            body: {
                produto_id: produto._id, // ID do produto
                nome: produto.nome, // Nome do produto
                tipo: 'saida', // Tipo de transação (saída)
                quantidade: quantidade // Quantidade a ser retirada como quantidade da transação
            }
        }, res);

    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Erro ao atualizar a quantidade do produto',
            err: err.message
        })
    }
}


const deletarProduto = async (req, res) => {
    try {
        // Obtendo o ID do produto a ser excluído
        const { id } = req.params

        // Verificando se o ID é válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "ID inválido"
            })
        }

        // Buscando o produto pelo ID para deletar
        const produto = await Produto.findByIdAndDelete(id)

        // Verificando se o produto existe
        if (!produto) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Produto não encontrado",
            })
        }

        // Extraindo o nome do arquivo do campo 'src'
        const url = produto.src;
        const nomeArquivo = url.substring(url.lastIndexOf('/') + 1);

        // Montando o caminho absoluto do arquivo
        const caminhoCompleto = path.join(__dirname, '..', 'uploads', nomeArquivo);

        // Deletando o arquivo img
        fs.unlinkSync(caminhoCompleto);

        // Resposta ao cliente
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Produto deletado com sucesso',
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Erro ao deletar o produto',
            err: err.message
        });
    }
};



module.exports = {
    listarProdutos,
    criarProduto,
    atualizarProduto,
    pesquisarProduto,
    atualizarQuantidadeProduto,
    deletarProduto,
}