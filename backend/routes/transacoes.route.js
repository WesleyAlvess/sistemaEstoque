const express = require('express')
const router = express.Router()

const { listarTransacoes, adicionarTransacoes, retirarTransacoes, deletarTodasTransacoes, } = require('../controllers/transacoes.controller')
const validaCamposTransacoes = require('../middlewares/validaCamposTrasacoes')

router.get('/transacoes', listarTransacoes)
router.post('/transacoes/adicionar', validaCamposTransacoes, adicionarTransacoes)
router.post('/transacoes/retirar', validaCamposTransacoes, retirarTransacoes)
router.delete('/transacoes/deletar/all', deletarTodasTransacoes)

module.exports = router