const multer = require('multer')
const path = require('path') // Ele da acesso as pastas de uma maneira mais simples

// Configurando multer para lidar com upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) { //cb significa call back 
        cb(null, "uploads/") //O diretório onde as imagens serão armazendas
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Nome do arquivo
    }
})

const upload = multer({storage})

module.exports = upload

// C:\Users\walve\OneDrive\Área de Trabalho\sistema-estoque\backend\uploads
// backend\uploads