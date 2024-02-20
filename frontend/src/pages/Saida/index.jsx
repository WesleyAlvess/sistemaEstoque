import { Button, TextInput, Alert } from "flowbite-react"
import { useState } from "react";
import axios from "axios";

import ModalSaida from "../../components/ModalSaida";

const Saida = () => {
    const [searchQuery, setSearchQuery] = useState("") // Estado para armazenar a consulta de pesquisa
    const [searchResults, setSearchResults] = useState([]) // Estado para armazenar os resultados da pesquisa
    // Modal
    const [isOpenModal, setIsOpenModal] = useState(false) //Abrir modal de saida
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [success, setSuccess] = useState(false)

    // lida com a alteração da consulta de pesquisa
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
        searchProducts(e.target.value)// Chama a função para pesquisar produtos com a consulta atual
    }


    // lida com a pesquisa de produtos
    const searchProducts = async (query) => {
        try {
            const response = await axios.get(`http://localhost:3000/produtos/pesquisar?query=${query}`) // Envia uma solicitação GET para a rota de pesquisa com a consulta de pesquisa
            setSearchResults(response.data) // Atualiza o estado com os resultados da pesquisa
        } catch (err) {
            console.error("Erro ao pesquisar produtos:", err)
        }
    }

    // lida com o envio do formulário de pesquisa
    const handleSeachSubmit = (e) => {
        e.preventDefault()
        searchProducts(searchQuery)
    }

    // Abre o Modal e envia os dados do produto 
    const handleSaida = (produto) => {
        try {
            setIsOpenModal(true)
            setSelectedProduct(produto)

            setSearchResults(searchResults.filter((item) => item._id !== produto._id))
        } catch (err) {
            console.error("Erro ao realizar saída do estoque:", err)
        }
    }

    // Fechamento do modal
    const handleCloseModal = () => {
        setIsOpenModal(false)
    }

    // Exibindo mensagem de sucesso após atualizar produto
    const handleSuccess = async () => {
        setSuccess(true)
        // Recarregar os dados do produto após a conclusão bem-sucedida da operação
        searchProducts(searchQuery);
        // Esconde a mensagem de sucesso após 3 segundos
        setTimeout(() => {
            setSuccess(false)
        }, 3000)
    }

    return (
        <div className="container mx-auto">
            {success && <Alert className="mt-5" color='success'>Produto atualizado com sucesso</Alert>}
            <div className="px-5">
                <h2 className="text-3xl font-bold mb-6 mt-3">Saida de estoque</h2>
                <form className="flex items-center" onSubmit={handleSeachSubmit}>
                    <div className="relative">
                        <TextInput
                            onChange={handleSearchChange}
                            className=" rounded-lg"
                            type="text"
                            placeholder="Pesquisar produto"
                        />
                    </div>
                    <Button className="ml-3 px-6  rounded-lg text-white" type="submit">Pesquisar</Button>
                </form>
                {/* Renderize os resultados da pesquisa aqui */}
                <div>
                    <div className="overflow-x-auto overflow-y-auto mt-3">
                        <table className="w-full table-auto border-collapse border">
                            <thead>
                                <tr>
                                    <th className="px-2 py-2 border text-left text-slate-600">Imagem</th>
                                    <th className="px-2 py-2 border text-left text-slate-600">Nº</th>
                                    <th className="px-2 py-2 border text-left text-slate-600">Nome</th>
                                    <th className="px-2 py-2 border text-left text-slate-600">Descrição</th>
                                    <th className="px-2 py-2 border text-left text-slate-600">Preço</th>
                                    <th className="px-2 py-2 border text-left text-slate-600">Quantidade</th>
                                    <th className="px-2 py-2 border text-left text-slate-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((produto, index) => (
                                    <tr key={produto._id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                        <td className="px-4 py-2 border">
                                            <img src={produto.src} alt={produto.nome} className="h-8 object-cover rounded-xl" />
                                        </td>
                                        <td className="px-4 py-2 border">{index + 1}</td>
                                        <td className="px-4 py-2 border">{produto.nome}</td>
                                        <td className="px-4 py-2 border whitespace-nowrap">{produto.descricao}</td>
                                        <td className="px-4 py-2 border">{produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td className="px-4 py-2 border">{produto.quantidade}</td>
                                        <td className="px-4 py-2 border flex justify-start">
                                            <button onClick={() => handleSaida(produto)} className="bg-blue-500 text-white px-4 py-1 rounded-lg mr-2" >saida</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {isOpenModal && <ModalSaida selectedProduct={selectedProduct} closeModal={handleCloseModal} onSuccess={handleSuccess} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Saida;