// Form
import { useForm } from 'react-hook-form';
import { useState } from 'react';

// Services
import { apiUrl, apiOptions } from '@services/API';

// Contextos
import { useAuth } from '@contexts/AuthContext';

// Components or UI
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

// Personalized UI
import Loading from '@components/Loading';

// Styles
import '@styles/form.css';

const Login = () => {

    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { checkSession } = useAuth();

    const onSubmit = async (data) => {
        try {
            const endpoint = 'user/login';
            const completeUrl = `${apiUrl}${endpoint}`;

            setIsLoading(true);

            const response = await fetch(completeUrl, apiOptions('POST', data));
            const responseData = await response.json();

            if (response.ok) {
                toast.success('Login realizado com sucesso!');
                await checkSession();
                navigate('/minhas-contas');
            } else {
                toast.warning(responseData.message);
            }
        } catch (error) {
            toast.error("Erro desconhecido, contate o suporte!");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <article className='d-flex align-items-top justify-content-center'>
            <div>
                {/* Título */}
                <div className="text-center">
                    <h1 className='fw-bold'>Entrar</h1>
                    <p>Entre suas credenciais para continuar</p>
                </div>
                {/* Formulário */}
                <form action="#" className="card shadow-sm p-3" onSubmit={handleSubmit(onSubmit)}>
                    {/* E-mail */}
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label ms-2 fw-bold">E-mail</label>
                        <input type="email" className="form-control shadow-sm" id="email" name="email" placeholder="email@gmail.com.br" {...register("email")} autoFocus required />
                    </div>
                    {/* Senha */}
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label ms-2 fw-bold">Senha</label>
                        <input type="password" className="form-control shadow-sm" id="password" name="password" placeholder='Digite sua senha...' {...register("password")} required />
                    </div>
                    {/* Botão de Criar conta */}
                    <div>
                        <button className="btn btn-dark w-100 shadow-sm" type='submit'>
                            Entrar
                        </button>
                    </div>
                </form>
                <p className="text-center mt-3">
                    <span>Não tem uma conta? </span>
                    <NavLink to='/register' className='fw-bold text-decoration-none'>
                        Crie sua conta
                    </NavLink>
                </p>
            </div>

            <ToastContainer position='bottom-right' />
            {isLoading ? <Loading /> : <></>}
        </article>
    )
};

export default Login;
