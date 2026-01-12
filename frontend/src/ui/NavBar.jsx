
// Bibliotecas
import { NavLink } from 'react-router-dom';

// Contextos
import { useAuth } from '@contexts/AuthContext';

const NavBar = () => {

    const { isAuthenticated, authLoading } = useAuth();

    const Item = (key, to, text) => {

        const handleClick = () => {
            const navbar = document.getElementById('navbarNav');
            if (navbar.classList.contains('show')) {
                navbar.classList.remove('show');
            }
        };

        return (
            <li className='nav-item' onClick={handleClick} key={key} >
                <NavLink to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {text}
                </NavLink>
            </li>
        )
    };

    const links = [
        {
            to: '/bill/form',
            text: 'Nova Conta',
        },
        {
            to: '/bill/list',
            text: 'Contas'
        },
        {
            to: '/category/form',
            text: 'Categorias'
        },
    ];

    const renderAuthLinks = () => {
        if (authLoading === true) {
            return (<span>...</span>);
        }

        if (isAuthenticated) {
            return (
                <>{Item('logout', '/logout', 'Sair')}</>
            )
        } else {
            return (
                <>
                    {Item('cadastro', '/register', 'Registrar-se')}
                    {Item('login', '/login', 'Entrar')}
                </>
            )
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">M Contas</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav" >
                    <ul className="navbar-nav me-auto">
                        {links.map((link, index) => Item(index, link.to, link.text))}
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {renderAuthLinks()}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;