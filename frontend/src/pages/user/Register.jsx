// Form
import { useForm } from 'react-hook-form';
import { useState } from 'react';

// UI
import { ToastContainer, toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';

// Personalized UI
import Loading from '@components/Loading';
import '@styles/form.css';

// Services
import { apiUrl, apiOptions } from '@services/API';

const Register = () => {

    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            const endpoint = 'user/register';
            const completeUrl = `${apiUrl}${endpoint}`;

            setIsLoading(true);

            const res = await fetch(completeUrl, apiOptions('POST', data));
            const resData = await res.json();

            console.log(res.ok);
            if (res.ok) {
                toast.success('Conta criada com sucesso');
                navigate('/login');
            } else {
                toast.warning(resData.message);
            }

        } catch (error) {
            toast.error('Erro desconhecido, contate o suporte!');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <article className='d-flex align-items-top justify-content-center'>
            <div>
                {/* Título */}
                <div className="text-center">
                    <h1 className='fw-bold'>Criar Conta</h1>
                    <p>Preencha seus dados para continuar</p>
                </div>
                {/* Formulário */}
                <form action="#" className="card shadow-sm p-3" onSubmit={handleSubmit(onSubmit)}>
                    {/* E-mail */}
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label ms-2 fw-bold">E-mail</label>
                        <input type="email" className="form-control shadow-sm" id="email" name="email" placeholder="email@gmail.com.br" {...register('email')} autoFocus required />
                    </div>
                    {/* Nome */}
                    <div className="mb-4">
                        <label htmlFor="name" className="form-label ms-2 fw-bold">Nome</label>
                        <input type="text" className="form-control shadow-sm" id="name" name="name" placeholder='John Doe' {...register('name')} required />
                    </div>
                    {/* Senha */}
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label ms-2 fw-bold">Senha</label>
                        <input type="password" className="form-control shadow-sm" id="password" name="password" placeholder='Digite sua senha...' {...register('password')} required />
                    </div>
                    {/* Botão de Criar conta */}
                    <div>
                        <button className="btn btn-dark w-100 shadow-sm" type='submit'>
                            Criar conta
                        </button>
                    </div>
                </form>
                <p className="text-center mt-3">
                    <span>Já tem uma conta? </span>
                    <NavLink to='/login' className='fw-bold text-decoration-none'>
                        Faça login
                    </NavLink>
                </p>
            </div>
            <ToastContainer position='bottom-right' />
            {isLoading ? <Loading /> : <></>}
        </article>
    )
};

export default Register;
