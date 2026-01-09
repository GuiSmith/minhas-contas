// Bibliotecas
import { Routes, Route } from 'react-router-dom';

// UI
import NavBar from '@ui/NavBar';
import PaginaInexistente from '@ui/PaginaInexistente';

// Rotas
import routes from './routes/routes.jsx';
import ProtectedRoute from '@routes/protectedRoute.jsx';

function App() {

  return (
    <>
      <section className='app-container'>
        <NavBar />
        <div className='mt-3 page-wrapper'>
          <Routes>
            {routes.map(({ path, element, auth }, index) => (
              <Route
                key={`route-${index}`}
                path={path}
                element={<ProtectedRoute auth={auth} element={element} />}
              />
            ))}
            <Route key={'inexistente'} path='*' element={<PaginaInexistente />} />
          </Routes>
        </div>
      </section>
    </>
  )
}

export default App;