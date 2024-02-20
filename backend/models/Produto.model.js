const mongoose = require('mongoose')

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    descricao: String,
    preco: {
        type: Number,
        required: true,
    },
    quantidade: {
        type: Number,
        required: true
    },
    src: {
        type: String,
        required: true
    }
})

const Produto = mongoose.model('Produto', produtoSchema)

module.exports = Produto