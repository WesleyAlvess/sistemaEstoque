import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";


// Pages
import Produtos from './pages/Pordutos'
import Entrada from './pages/Entrada'
import Saida from './pages/Saida'
import Tansacoes from './pages/Transacoes'
import Register from './pages/Register'
import Login from './pages/Login'


// Components
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    // Verificar se o token está presente no localStorage
    const token = localStorage.getItem('token')
    if (token) {
      // Decodificar o token para obter as informações do usuário
      const decodedToken = jwtDecode(token)
      // define as informações do usuario no estado
      setUser(decodedToken)
      setIsLoggedIn(true)
    }
  }, [])
  console.log(user);
  // função para lidar com login
  const handleLogin = () => {
    setIsLoggedIn(true) // atualiza o estado de autenticação
    
  }
  
  // função para lidar com logout
  const handleLogout = () => {
    setIsLoggedIn(false) // atualiza o estado de autenticação
    setUser(null) //Limpa as informações do usuário
    localStorage.removeItem('token')// Remove o token do armazenamento local
    window.location.href = '/login'// Redireciona para a página de login
  }

  return (
    <BrowserRouter>
      {/* Se o usuário estiver autenticado, mostra o cabeçalho */}
      {isLoggedIn && <Header onLogout={handleLogout} />}
      <Routes>
        {/* Se o usuário não estiver autenticado mostra login e register */}\
        {!isLoggedIn && (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        {/* Se o usuário estiver logado mostra páginas */}
        {isLoggedIn && (
          <>
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/Entrada" element={<Entrada />} />
            <Route path="/Saida" element={<Saida />} />
            <Route path="/transacoes" element={<Tansacoes />} />
          </>
        )}
      </Routes>
      {/* <Footer /> */}
      {/* {isLoggedIn && <Footer />} */}
    </BrowserRouter>
  )
}

export default App
