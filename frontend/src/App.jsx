import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Pages
import Produtos from './pages/Pordutos'
import Entrada from './pages/Entrada'
import Saida from './pages/Saida'
import Tansacoes from './pages/Transacoes'


// Components
import Header from './components/Header'
import Footer from './components/Footer'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/Entrada" element={<Entrada />} />
        <Route path="/Saida" element={<Saida />} />
        <Route path="/transacoes" element={<Tansacoes />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  )
}

export default App
