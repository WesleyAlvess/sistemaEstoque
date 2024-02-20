const mongoose = require('mongoose');

const transacaoSchema = new mongoose.Schema({
    produto_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto', // Referência ao modelo Produto
        required: true,
    },
    nome: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        enum: ['entrada', 'saida'], 
        required: true,
    },
    quantidade: {
        type: Number,
        required: true,
        min: 1,
    },
    data: {
        type: Date,
        default: Date.now,
    },
})

const Transacao = mongoose.model('Transacao', transacaoSchema)

module.exports = Transacao