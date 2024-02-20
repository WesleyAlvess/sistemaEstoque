import React, { useState } from 'react';
import { Link, } from 'react-router-dom';
import axios from 'axios';
import { Alert } from 'flowbite-react'
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            // Envia dados para logar
            const response = await axios.post('http://localhost:3000/login', {
                email,
                password
            })
            // verificar login
            if (response.status === 200) {
                // Armazenda token jwt
                const token = response.data.token
                // salvando no local storage
                localStorage.setItem('token', token)
                onLogin() // chamando a função login do componente pai
                setSuccess(true) // msg de sucesso
                navigate('/produtos') // redirecionando para produtos
            } else {
                setError('Credenciais inválidas')
            }

        } catch (err) {
            setError('Erro ao fazer login')
            console.error("Erro ao fazer login", err);
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-12 pb-8 mb-4 w-96 relative">
                {success && <Alert color='success' className='absolute top-1 left-1/3 transform -translate-x-1/4'>Login realizado com sucesso</Alert>}
                <h1 className="text-center text-2xl font-semibold mb-4 mt-6">Login</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="text"
                        name='email'
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Senha
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        name='password'
                        placeholder="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={handleLogin}
                    >
                        Entrar
                    </button>
                    <Link to="/register" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        Não tem uma conta? Criar
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
