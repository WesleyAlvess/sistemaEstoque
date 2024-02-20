import { Button, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'

const Header = () => {
    const path = useLocation().pathname

    return (
        <Navbar className='border-b-2'>
            <Link to="/produtos" className='self-center whitespace-nowrap text-sm
            sm:text-xl font-semibold dark:text-white
            '>
                <span className='px-2 py-1 bg-cyan-700  rounded-lg text-white'>Controle</span>
                Estoque
            </Link>
            <Navbar.Toggle className='text-cyan-700' />
            <Navbar.Collapse>
                <Navbar.Link className='rounded-lg' active={path === '/produtos'} as={"div"}>
                    <Link to='/produtos'>Produtos</Link>
                </Navbar.Link>
                <Navbar.Link className='rounded-lg' active={path === '/entrada'} as={"div"}>
                    <Link to='/entrada'>Entrada</Link>
                </Navbar.Link>
                <Navbar.Link className='rounded-lg' active={path === '/saida'} as={"div"}>
                    <Link to='/saida'>Saida</Link>
                </Navbar.Link>
                <Navbar.Link className='rounded-lg' active={path === '/transacoes'} as={"div"}>
                    <Link to='/transacoes'>Transações</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header;




{/* <form>
<TextInput 
    type='text'
    placeholder='Pesquisar produto'
    rightIcon={AiOutlineSearch}
/>
</form> */}