const validaCamposTrasacoes = (req, res, next) => {
    // Obter os dados do corpo da requisição
    const { produto_id, tipo, quantidade } = req.body

    // Verificar se todos os campos foram fornecidos e se a quantidade é positiva
    if (!produto_id || !tipo || !quantidade) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Por favor, preencha todos os campos corretamente"
        })
    }
    // Verifica se o tipo e valido(entrada ou saida)
    if (tipo !== "entrada" && tipo !== "saida") {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Por favor, escreva somente entrada ou saida no campo tipo"
        })
    }
    // Verifica se a quantidade é um número positivo
    if (isNaN(quantidade) || quantidade <= 0) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "A quantidade deve ser um número positivo"
        })
    }

    next()
}

module.exports = validaCamposTrasacoes