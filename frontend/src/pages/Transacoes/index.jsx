import React, { useEffect, useState } from 'react';
import axios from "axios"
import { Button } from 'flowbite-react'


const Transactions = () => {
    const [transacoes, setTransacoes] = useState([])

    const fetchtransacoes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/transacoes')
            const data = response.data
            setTransacoes(data.data)
        } catch (err) {
            console.error("Erro ao exibir transações", err)
        }
    }

    useEffect(() => {
        fetchtransacoes()
    }, [])

    const handleDeleteTransacoes = async () => {
        try {
            await axios.delete('http://localhost:3000/transacoes/deletar/all')
            // Atualizar as transações após a exclusão
            setTransacoes([]);
        } catch (err) {
            console.error("Erro ao apagar o histórico", err);
        }
    }

    return (
        <div className="container mx-auto py-6 w-full h-full ">
            <div className='flex flex-col md:flex-row justify-between p-3'>
                <h1 className="text-3xl font-bold mb-6 md:mb-0">Histórico de Transações</h1>
                <Button onClick={handleDeleteTransacoes} className='mb-4' size="md" >Apagar Histórico</Button>
            </div>
            <div className=" shadow-md rounded-lg overflow-hidden overflow-x-auto overflow-y-auto p-2">
                <table className="min-w-full  overflow-x-auto">
                    <thead>
                        <tr className='text-left'>
                            <th className="px-4 py-2 border text-slate-600">Produto</th>
                            <th className="px-4 py-2 border text-slate-600">Tipo</th>
                            <th className="px-4 py-2 border text-slate-600">Quantidade</th>
                            <th className="px-4 py-2 border text-slate-600">Data</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {transacoes.map((transacao, index) => (
                            <tr key={transacao._id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <td className="py-2 border px-4">{transacao.nome}</td>
                                <td className="py-2 border px-4">{transacao.tipo}</td>
                                <td className="py-2 border px-4">{transacao.quantidade}</td>
                                <td className="px-4 border py-2">{new Date(transacao.data).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Transactions;
