require('dotenv').config()
const express = require('express');
const port = process.env.PORT || 3000
const db = require('./db/db.js')
const cors = require('cors')
const path = require('path');
const productsRoute = require('./routes/produto.route.js')
const transacoesRoute = require('./routes/transacoes.route.js')
const userRoute = require('./routes/user.route.js')



const app = express()

// Database connection
db()

// Middlerwares
// app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static('uploads/'))
app.use(express.json())
app.use(cors())

// Routes
app.use('/', productsRoute)
app.use('/', transacoesRoute)
app.use('/', userRoute)

app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}...`)
})

