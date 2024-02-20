import { useEffect, useState } from "react";
import axios from "axios"
import { Alert, Spinner, Table } from 'flowbite-react'

import ModalEdit from "../../components/ModalEdit";

const Produtos = () => {
    const [produtos, setProdutos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    //Modal
    const [isOpenModal, setOpenModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [successEdit, setSuccessEdit] = useState(false)
    const [successDel, setSuccessDel] = useState(false)



    const fetchProdutos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/produtos')
            const data = response.data
            if (data && data.produtos.length > 0) {
                setProdutos(data.produtos)
            } else {
                setProdutos([]) // Define a lista de produtos como vazia
            }
            setLoading(false)
            setError(null)

        } catch (err) {
            if (err.response && err.response.status === 404) {
                // Se a rota /produtos não for encontrada, define a lista de produtos como vazia
                setProdutos([])
                setLoading(false)
                setError(null)
            }
            // Se ocorrer outro erro, define o erro no estado
            console.error("Erro ao obter a lista de produtos", err)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProdutos()
    }, [])

    // Exibindo mensagem de sucesso após atualizar produto
    const handleSuccess = async () => {
        await fetchProdutos() // Espera pela conclusão da busca antes de definir success como verdadeiro
        setSuccessEdit(true)
        // Esconde a mensagem de sucesso após 3 segundos
        setTimeout(() => {
            setSuccessEdit(false)
        }, 3000)
    }

    // Fechamento do modal
    const handleCloseModal = () => {
        setOpenModal(false)
    }

    // Pasando os dados para o componente filho para edição
    const handleEdite = (produto) => {
        setOpenModal(true)
        setSelectedProduct(produto)

    }

    // Deletando produto
    const handleDelete = async (produtoId) => {
        try {
            await axios.delete(`http://localhost:3000/produtos/deletar/${produtoId}`);
            // Atualiza a lista de produtos após a exclusão
            await fetchProdutos(produtoId);
            // Define a mensagem de sucesso
            setSuccessDel(true);
            // Esconde a mensagem de sucesso após 3 segundos
            setTimeout(() => {
                setSuccessDel(false);
            }, 3000);
        } catch (err) {
            console.error("Erro ao excluir o produto", err);
        }
    };


    return (
        <div className="container mx-auto p-3">

            {successEdit && <Alert className="mt-5" color='success'>Produto atualizado com sucesso</Alert>}
            {successDel && <Alert className="mt-5" color='success'>Produto excluído com sucesso</Alert>}

            <h2 className="text-3xl font-bold mb-6 mt-2">Mercadorias</h2>
            {loading ? (
                <div className="flex items-center justify-center">
                    <Spinner size='xl' />
                    <span className="pl-3 text-xl font-semibold">Carregando Produtos...</span>
                </div>
            ) : (
                <div>
                    {error ? (
                        <Alert className="mt-5" color='failure'>
                            {error}
                        </Alert>
                    ) : (produtos.length === 0 ? (
                        <Alert className="mt-5" color='warning'>
                            Nenhum produto cadastrado no estoque
                        </Alert>
                    ) : (
                        <div className="overflow-x-auto overflow-y-auto">
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
                                    {produtos.map((produto, index) => (
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
                                                <button onClick={() => handleEdite(produto)} className="bg-blue-500 text-white px-4 py-1 rounded-lg mr-2" >Editar</button>
                                                <button onClick={() => handleDelete(produto._id)} className="bg-orange-500 text-white px-4 py-1 rounded-lg" >Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {isOpenModal && <ModalEdit selectedProduct={selectedProduct} closeModal={handleCloseModal} onSuccess={handleSuccess} />}
                        </div>
                    )
                    )}
                </div>
            )}
        </div>
    )
}

export default Produtos;