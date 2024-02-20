const validaCamposProduto = (req, res, next) => {
    // Obtendo os dados do corpo da requisicão
    const { nome, descricao, preco, quantidade } = req.body

    // Verificando se os campos foram fornecidos
    if (!nome || !descricao || !preco || !quantidade) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Por favor, preencha todos os campos"
        })
    }
    next()
}

module.exports = validaCamposProduto