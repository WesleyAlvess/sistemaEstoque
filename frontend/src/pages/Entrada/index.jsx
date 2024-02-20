import { useState } from "react"
import axios from 'axios'
import { Label, TextInput, Spinner, Button, Alert, FileInput } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

const Entrada = () => {
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectFile, setSelectFile] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formDataToSend = new FormData()
            formDataToSend.append("nome", formData.nome)
            formDataToSend.append("descricao", formData.descricao)
            formDataToSend.append("preco", formData.preco)
            formDataToSend.append("quantidade", formData.quantidade)
            formDataToSend.append("file", selectFile)
    
            const dados = await axios.post('http://localhost:3000/produtos/criar', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (dados.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false)
                    navigate("/produtos")
                },2000)
            }

        } catch (err) {
            setError("Erro ao adicionar o produto");
        }
    
        setLoading(false);
    }
    

    return (
        <div className="flex items-center justify-center w-full h-full ">
            <div className="p-5 mt-5 bg-gray-200 rounded-xl ">
                <h2 className="text-2xl font-semibold mb-4 mt-4 text-gray-700">Adicionar Produto</h2>
                <form className="mt-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <Label  className="text-gray-700 mt-3" value="Nome do produto" />
                        <TextInput
                            type="text"
                            placeholder="Nome"
                            id="nome"
                            onChange={e => setFormData({ ...formData, [e.target.id]: e.target.value.trim() })}
                            required
                        />

                        <Label  className="text-gray-700 mt-3" value="Descrição" />
                        <TextInput
                            type="text"
                            placeholder="Descrição"
                            id="descricao"
                            onChange={e => setFormData({ ...formData, [e.target.id]: e.target.value.trim() })}
                            required
                        />

                        <Label  className="text-gray-700 mt-3" value="Preço" />
                        <TextInput
                            type="text"
                            placeholder="Preço"
                            id="preco"
                            onChange={e => setFormData({ ...formData, [e.target.id]: e.target.value.replace(",", ".") })}
                            required
                        />

                        <Label  className="text-gray-700 mt-3" value="Quantidade" />
                        <TextInput
                            type="number"
                            step="0.01"
                            placeholder="Quantidade"
                            id="quantidade"
                            onChange={e => setFormData({ ...formData, [e.target.id]: e.target.value.trim() })}
                            required
                        />

                        <Label className="text-gray-700 mt-3" value="Imagem do produto" />
                        <FileInput
                            type="file"
                            accept="image/*"
                            id="src"
                            onChange={e => setSelectFile(e.target.files[0])}
                            required
                        />

                        <Button type="submit" className="mt-4 transition " disabled={loading} >
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="pl-2 text-gray-700">Adicionando...</span>
                                </>
                            ) : "Adicionar Produto"}
                        </Button>

                        {error ? <Alert className="mt-5" color='failure'>{error}</Alert> : null}
                        {success ? <Alert className="mt-5" color='success'>Produto adicionado com sucesso!</Alert> : null}

                    </div>
                </form>

            </div>
        </div>
    )
}

export default Entrada