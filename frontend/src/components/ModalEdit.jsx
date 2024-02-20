import { useEffect, useState } from 'react';
import { Label, TextInput, Spinner, Button, Alert, FileInput } from 'flowbite-react'
import axios from 'axios';

const ModalEdit = ({ selectedProduct, closeModal, onSuccess }) => {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        quantidade: '',
    })
    const [selectFile, setSelectFile] = useState(null)

    useEffect(() => {
        // Preencher o formulário com os dados do produto selecionado quando o componente é montado
        if (selectedProduct) {
            setFormData({
                nome: selectedProduct.nome,
                descricao: selectedProduct.descricao,
                preco: selectedProduct.preco,
                quantidade: selectedProduct.quantidade,
            })
        }
    }, [selectedProduct])


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData()
            formDataToSend.append("nome", formData.nome)
            formDataToSend.append("descricao", formData.descricao)
            formDataToSend.append("preco", formData.preco)
            formDataToSend.append("quantidade", formData.quantidade)
            formDataToSend.append("file", selectFile)

            await axios.put(`http://localhost:3000/produtos/atualizar/${selectedProduct._id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            onSuccess() //Dispara mensagem de sucesso
            closeModal() //Fecha modal
        } catch (err) {
            console.error('Erro ao atualizar o produto:', err);
        }
    }

    return (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
            <div className=' bg-white p-8 rounded-xl' >
                <h2 className='text-2xl font-semibold mb-4 mt-4 text-slate-500'>Editar Produto</h2>
                <form className="mt-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <Label className="text-white" value="Nome do produto" />
                        <TextInput
                            type="text"
                            placeholder="Nome"
                            id="nome"
                            value={formData.nome}
                            onChange={e => setFormData({ ...formData, [e.target.id]: e.target.value })}
                            required
                        />

                        <Label className="text-white" value="Descrição" />
                        <TextInput
                            type="text"
                            placeholder="Descrição"
                            id="descricao"
                            value={formData.descricao}
                            onChange={e => setFormData({ ...formData, [e.target.id]: e.target.value })}
                            required
                        />

                        <Label className="text-white" value="Preço" />
                        <TextInput
                            addon="R$"
                            type="text"
                            placeholder="Preço"
                            id="preco"
                            value={formData.preco}
                            onChange={e => setFormData({ ...formData, [e.target.id]: e.target.value.replace(",", ".") })}
                            required
                        />

                        <Label className="text-white" value="Quantidade" />
                        <TextInput
                            addon="Quant."
                            type="number"
                            step="0.01"
                            placeholder="Quantidade"
                            id="quantidade"
                            value={formData.quantidade}
                            onChange={e => setFormData({ ...formData, [e.target.id]: e.target.value })}
                            required
                        />

                        <Label className="text-white" value="Imagem do produto" />
                        <FileInput
                            type="file"
                            accept="image/*"
                            id="src"
                            onChange={e => setSelectFile(e.target.files[0])}
                            required
                        />
                        <Button color='success' type='submit' className=" text-white px-4 py-1 rounded-lg mr-2 mt-4 w-full" >Salvar</Button>
                        <Button color='failure' onClick={closeModal} className=" text-white px-4 py-1 rounded-lg mt-1 w-full" >Cancelar</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalEdit;