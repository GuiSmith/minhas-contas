import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// UI
import { ToastContainer, toast } from 'react-toastify';
import Loading from '@components/Loading';

// Contexts
import { useAuth } from '@contexts/AuthContext';


const Logout = () => {

    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const userLogout = async () => {
            try {
                if (isAuthenticated) {
                    setIsLoading(true);
                    const loggedOut = await logout();
                    if(loggedOut === true){
                        navigate('/login');
                    }else{
                        toast.error('Erro ao sair. Contate o suporte...');
                        setIsLoading(false);
                        setTimeout(() => {
                            navigate('/minhas-contas');
                        },3000);
                    }
                }else{
                    navigate('/login');
                }
            } catch (error) {

            } finally {
                setIsLoading(false);
            }
        }

        userLogout();
    }, []);

    return (
        <section>
            <h1 className="text-center">Saindo...</h1>
            {isLoading ? <Loading /> : <></>}
            <ToastContainer position='bottom-right' />
        </section>
    )
};

export default Logout;