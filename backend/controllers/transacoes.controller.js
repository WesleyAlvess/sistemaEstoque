const Transacao = require('../models/Transacao.model')
const Produto = require('../models/Produto.model')
const mongoose = require('mongoose')

const listarTransacoes = async (req, res) => {
    try {
        // Obtem todas as transações que estão no banco
        const transacoes = await Transacao.find()
        if (transacoes.length > 0) {
            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Lista de transações',
                data: transacoes
            })
        } else {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Nenhuma transação encontrada'
            })
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Erro ao listar transações',
            err: err.message
        })
    }
}

const adicionarTransacoes = async (req, res) => {
    try {
        // Obtem os dados do corpo da requisição
        const { produto_id, tipo, quantidade, nome } = req.body

        // Cria uma nova instância do modelo de Transacao
        const novaTransacao = new Transacao({
            produto_id,
            nome,
            tipo,
            quantidade
        })

        // Salva a nova transação no banco
        await novaTransacao.save()

        // Resposta ao cliente
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Transação adicionada com sucesso',
            data: novaTransacao
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Erro ao adicionar transação',
            err: err.message
        })
    }
}

const retirarTransacoes = async (req, res) => {
    try {
        // Obter os dados do corpo da requisição
        const { produto_id, tipo, quantidade, nome } = req.body

        // Obter o produto correspondente 
        const produto = await Produto.findById(produto_id)

        // Verifica se o produto foi encontrado
        if (!produto) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Produto não encontrado"
            })
        }

        // Verifica se há quantidade suficiente do produto em estoque para a saída
        if (quantidade > produto.quantidade) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Quantidade insuficiente do produto em estoque"
            })
        }

        // Cria uma nova instância do modelo de Transacao
        const novaTransacao = new Transacao({
            produto_id,
            nome,
            tipo,
            quantidade,
        })

        // Salva a nova transação no banco
        await novaTransacao.save()

        // Resposta ao cliente
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Transação retirada com sucesso',
            data: novaTransacao
        })

    } catch (err) {
        console.error("Erro ao retirar transação:", err);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Erro ao retirar transação',
            err: err.message
        })
    }
}

const deletarTodasTransacoes = async (req, res) => {
    try {
        // Deletar todas as transações
        const resultado = await Transacao.deleteMany();

        // Verificando se alguma transação foi deletada
        if (resultado.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Nenhuma transação encontrada para deletar"
            });
        }

        // Resposta ao cliente
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Todas as transações foram deletadas com sucesso'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Erro ao deletar todas as transações',
            err: err.message
        });
    }
};


module.exports = {
    listarTransacoes,
    adicionarTransacoes,
    retirarTransacoes,
    deletarTodasTransacoes,
}