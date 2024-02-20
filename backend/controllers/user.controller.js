const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const register = async (req, res) => {
    try {
        // Obtendo dados do body
        const { email, password, name } = req.body

        // Verifica se o usuário ja existe
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Usuário já cadastrado"
            })
        }

        // Cria um hash da senha antes de salvar no banco de dados
        const hashPassword = await bcrypt.hash(password, 10);

        // Cria um novo usuário 
        const newUser = new User({
            name,
            email,
            password: hashPassword,
        })
        
        // Salva o usuário no banco de dados
        await newUser.save()
        
        
        // Retorna o usuário criado
        return res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Usuário criado com sucesso",
            user: {
                name: newUser.name,
                email: newUser.email,
                id: newUser._id,
                cretedAt: newUser.createdAt
            }
        })
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: err.message
        })
    }
}

const login = async (req, res) => {
    try {
        // Obtendo dados do body
        const { email, password } = req.body

        // Verifica campos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Por favor, preencha todos os campos"
            })
        }

        // Verifica se o usuário existe
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Usuário não encontrado"
            })
        }

        // Verifica se a senha está correta
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Senha incorreta"
            });
        }

        // Gera um token JWT
        const token = jwt.sign({
            userId: user._id,
        }, process.env.jwtSecret, { expiresIn: '2h'})


        // Retorna o usuário autenticado
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Login bem-sucedido",
            token: token
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: err.message
        })
    }
}

module.exports = {
    register,
    login,
}