import React, { useState } from 'react';
import { Label, TextInput, Button, Alert } from 'flowbite-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ModalSaida = ({ selectedProduct, closeModal, onSuccess }) => {
    const [formData, setFormData] = useState({
        quantidade: ''
    });
    const [errorQuant, setErrorQuant] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const novaQuantidade = selectedProduct.quantidade - parseInt(formData.quantidade);

            // Verificar se a quantidade inserida é maior do que a disponível no estoque
            if (novaQuantidade < 0) {
                setErrorQuant(true);
                return;
            }

            // Atualizar a quantidade do produto
            await axios.put(`http://localhost:3000/produtos/atualizar-quantidade/${selectedProduct._id}`, {
                quantidade: novaQuantidade
            });

            onSuccess(); // Dispara mensagem de sucesso
            closeModal(); // Fecha modal
        } catch (err) {
            console.error('Erro ao atualizar o produto:', err);
        }
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            quantidade: value,
        });
        setErrorQuant(false); // Resetar o erro quando o valor é alterado
    };

    return (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>

            <div className='bg-white p-12 py-19 px-15 rounded-xl relative'>
                {errorQuant && <Alert color='failure' className='absolute top-0 left-7 mt-6'>Erro: Quantidade em estoque insuficiente.</Alert>}

                <h2 className='text-2xl font-semibold mt-10 text-slate-500'>Saida de Produto</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <Label className="text-white" value="Quantidade" />
                        <TextInput
                            addon="Quant."
                            type="number"
                            placeholder="Quantidade"
                            id="quantidade"
                            value={formData.quantidade}
                            onChange={handleChange}
                            required
                        />
                        <Button color='success' type='submit' className="text-white px-4 py-1 rounded-lg mr-2 mt-4 w-full">Salvar</Button>
                        <Button color='failure' onClick={closeModal} className="text-white px-4 py-1 rounded-lg mt-1 w-full">Cancelar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalSaida;
