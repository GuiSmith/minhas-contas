// Libraries
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

// UI
import { ToastContainer, toast } from 'react-toastify';
import { NavLink, useLocation, useParams, useNavigate } from 'react-router-dom';

// Services
import { apiUrl, apiOptions } from '@services/API';

// Personalized UI
import Loading from '@components/Loading';

// Styles
import '@styles/form.css';

const BillForm = () => {

    const { register, handleSubmit, watch, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isWaitingResponse, setIsWaitingResponse] = useState(false);
    const [categories, setCategories] = useState([]);
    const [bill, setBill] = useState({});

    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const defaultValues = {
        descricao: '',
        id_categoria: '',
        valor_base: '',
        tipo_recorrencia: 'M',
        dia_fixo: '',
        mes_inicial: '',
        observacoes: ''
    };

    // Listar categorias
    useEffect(() => {
        const getCategories = async () => {
            try {
                setIsLoading(true);

                const res = await fetch(`${apiUrl}category/list`, apiOptions('GET'));
                const resData = await res.json();

                if (!res.ok) {
                    toast.warning(resData.message);
                    console.log('Erro ao listar categorias');
                    console.error(resData);
                    return;
                }

                if (resData.length === 0) {
                    toast.warning('Nenhuma categoria cadastrada. Cadastre uma categoria antes de continuar!');
                    setCategories([]);
                    return;
                }

                setCategories(resData);
            } catch (error) {
                toast.error('Erro ao listar categorias. Contate o suporte!');
                console.log('Erro ao listar categorias');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        getCategories();
    }, []);

    // Selecionar Conta
    useEffect(() => {
        if (!params.id) return;

        const fetchBill = async () => {
            try {

                setIsLoading(true);

                const endpoint = `bill/${params.id}`;
                const completeUrl = `${apiUrl}${endpoint}`;

                const res = await fetch(completeUrl, apiOptions('GET'));
                const resData = await res.json();

                if (!res.ok) {
                    toast.warning(resData.message);
                    return;
                }

                setBill({ ...resData });

                const newFormObj = {};
                for (const key in resData) {
                    if (Object.keys(defaultValues).includes(key)) {
                        newFormObj[key] = resData[key];
                    }
                }
                reset({ ...newFormObj });
            } catch (error) {
                toast.error('Erro ao selecionar conta');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBill();
    }, [location.pathname]);

    // Validações
    const validations = async (data) => {
        try {

            // Categoria não pode estar vazia
            if (!(data.id_categoria > 0)) {
                toast.warning('Preencha uma categoria!');
                return false;
            }

            // valor_base não pode ser negativo ou vazio
            if (!(data.valor_base > 0)) {
                toast.warning('valor base precisa ser maior que 0!');
                return false;
            }

            // Mês de início
            if (!data.mes_inicial) {
                toast.warning('Preencha mês de início');
                return false;
            }

            // Dia fixo
            if (!data.dia_fixo) {
                toast.warning('Preencha dia fixo!');
                return false;
            }

            return true;
        } catch (error) {
            toast.error('Erro ao realizar validações. Contate o suporte!');
            console.log('Erro ao realizar validações');
            console.error(error);
            return false;
        }
    };

    const handleNewButton = () => {
        setIsLoading(true);
        navigate('/bill/form');
        reset({ ...defaultValues });
        setBill({});
        setIsLoading(false);
    };

    const create = async (data) => {
        try {
            setIsLoading(true);

            const endpoint = 'bill';
            const completeUrl = `${apiUrl}${endpoint}`;

            const res = await fetch(completeUrl, apiOptions('POST', data));
            console.table(res);
            const resData = await res.json();
            console.table(resData);

            if (res.ok) {
                toast.success('Conta cadastrada!');
                navigate(`/bill/form/${resData.id}`);
            } else {
                toast.warning(resData.message);
            }
        } catch (error) {
            toast.error('Erro ao criar conta, contate o suporte!');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const update = async (data) => {
        try {
            setIsLoading(true);

            const endpoint = `bill/${params.id}`;
            const completeUrl = `${apiUrl}${endpoint}`;

            const res = await fetch(completeUrl, apiOptions('PUT', data));
            console.table(res);
            const resData = await res.json();
            console.table(resData);

            if (res.ok) {
                toast.success('Conta atualizada!!');
                navigate(`/bill/form/${params.id}`);
            } else {
                toast.warning(resData.message);
            }
        } catch (error) {
            toast.error('Erro ao atualizar conta, contate o suporte!');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const onSubmit = async (data) => {
        try {
            if (isWaitingResponse === true) {
                toast.warning('Responda antes de continuar!');
                return;
            }

            setIsLoading(true);

            const isValid = await validations(data);
            if (!isValid) {
                return;
            }

            if (Object.keys(bill).length > 0) {
                await update(data);
            } else {
                await create(data);
            }

        } catch (error) {
            toast.error('Erro ao salvar conta. Contate o suporte!');
            console.log('Erro ao salvar conta');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <article>
            {/* Título */}
            <div className='text-center'>
                <h1 className='fw-bold'>Contas recorrentes</h1>
                <p>Gerencia sua contas recorrentes</p>
            </div>
            <section className='form-line'>
                {/* Formulário */}
                <form action="#" className='card shadow-sm p-3' onSubmit={handleSubmit(onSubmit)} >
                    {/* Título */}
                    <div className='text-center'>
                        <h2>Formulário</h2>
                        <p>Altere sua conta a pagar aqui</p>
                    </div>
                    {/* Botões */}
                    <div className='form-line'>
                        <button type='button' onClick={handleNewButton} className='btn btn-primary' >Novo</button>
                        <button type='submit' disabled={isWaitingResponse || isLoading} className='btn btn-success'>Salvar</button>
                        <NavLink to='/bill/list' className={'btn btn-secondary'} >Listar</NavLink>
                        <NavLink to='/payment/form' className={`btn btn-dark ${Object.keys(bill).length > 0 ? '' : 'disabled'}`} state={{id_conta: bill.id, valor: bill.valor_base }} >Pagar</NavLink>
                    </div>
                    {/* Campos */}
                    <div>
                        {/* Descrição e Categoria */}
                        <div className='form-line'>
                            {/* Descrição */}
                            <div className='mb-3'>
                                <label htmlFor="descricao" className='form-label'>Descrição</label>
                                <input type="text" className='form-control ' id='descricao' {...register('descricao')} placeholder='Conta de Energia' />
                            </div>
                            {/* Categoria */}
                            <div className='mb-3'>
                                <label htmlFor="id-categoria" className='form-label'>Categoria</label>
                                <select id="id-categoria" className='form-select' {...register('id_categoria')} disabled={categories.length == 0}>
                                    <option value="" >{categories.length === 0 ? 'Nenhuma categoria cadastrada' : 'Escolha uma categoria'}</option>
                                    {categories.length > 0 && categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.descricao_visual}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Valor base e Ativo */}
                        <div className='form-line'>
                            {/* valor_base */}
                            <div className='mb-3'>
                                <label htmlFor="valor_base" className='form-label'>Valor base</label>
                                <input type="tel" step='0.01' min='0' className='form-control' id='valor_base' {...register('valor_base')} placeholder='R$ 0,00' />
                            </div>
                            {/* Ativo */}
                            <div className='mb-3'>
                                <label htmlFor="ativo" className='form-label'>Ativo</label>
                                <select id="ativo" className='form-select' {...register('ativo')}>
                                    <option value="S">Sim</option>
                                    <option value="N">Não</option>
                                </select>
                            </div>
                        </div>
                        {/* Recorrência, Dia fixo e Mês de início */}
                        <div className='form-line'>
                            {/* Recorrência */}
                            <div className='mb-3'>
                                <label htmlFor="recorrencia" className='form-label'>Recorrência</label>
                                <select id='recorrencia' className='form-select small' {...register('tipo_recorrencia')} >
                                    <option value="M">Mensal</option>
                                    <option value="A">Anual</option>
                                </select>
                            </div>
                            {/* Dia fixo */}
                            <div className='mb-3'>
                                <label htmlFor="dia-fixo" className='form-label'>Dia fixo</label>
                                <input type="tel" className='form-control small' id='dia-fixo' {...register('dia_fixo')} />
                            </div>
                            {/* Mês de início */}
                            <div className='mb-3'>
                                <label htmlFor="data-inicio" className='form-label'>
                                    Data de Início
                                </label>
                                <input type="date" className='form-control' id='data-inicio' {...register('mes_inicial')} />
                                <small className='ms-2 text-muted'>Usaremos apenas mês e ano</small>
                            </div>
                        </div>
                        {/* Observações */}
                        <div className='mb-3'>
                            <label htmlFor="observacoes" className='form-label'>Observações</label>
                            <textarea id='observacoes' className='form-control' placeholder='Ex: pagar só depois do dia 10' {...register('observacoes')}></textarea>
                        </div>
                    </div>
                </form>
                {/* Pagamentos */}
                <div className='card shadow-sm p-3 table-container'>
                    <table>
                        
                    </table>
                </div>
            </section>
            <ToastContainer position='bottom-right' />
            {isLoading ? <Loading /> : <></>}
        </article>
    )
};

export default BillForm;