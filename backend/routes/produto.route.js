const express = require('express')
const router = express.Router()

const {
    listarProdutos, 
    atualizarProduto,
    deletarProduto,
    criarProduto,
    pesquisarProduto,
    atualizarQuantidadeProduto,

} = require('../controllers/produto.controller.js')
const validaCamposProduto = require('../middlewares/validaCamposProduto.js')
const upload = require("../middlewares/multer.js")


// Listar todos os produtos
router.get('/produtos', listarProdutos)

// Criar produto
router.post('/produtos/criar', upload.single('file'), validaCamposProduto, criarProduto)

// Atualizar Produto
router.put('/produtos/atualizar/:id',upload.single('file'),atualizarProduto)

// Deletar produto
router.delete('/produtos/deletar/:id',upload.single('file'), deletarProduto)

// Pesquisar produto
router.get('/produtos/pesquisar', pesquisarProduto)

// Atualizar quantidade
router.put('/produtos/atualizar-quantidade/:id', atualizarQuantidadeProduto)


module.exports = router