// Libraries
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

// UI
import { ToastContainer, toast } from 'react-toastify';
import { NavLink, useLocation, useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Services
import { apiUrl, apiOptions } from '@services/API';

// Personalized UI
import Loading from '@components/Loading';
import { paymentMethods, acceptableMarginPercentage } from '@constants/paymentConstants.jsx';
import { floatToBRL, normalizeCurrencyToDecimal } from '@utils/formats';

// Styles
import '@styles/form.css';
import '@styles/billForm.css';

const BillForm = () => {

    const { register, handleSubmit, watch, reset } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [bill, setBill] = useState({});
    const [payments, setPayments] = useState([]);

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

    // Listar pagamentos
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                if (!bill.id) return;

                setIsLoading(true);

                const res = await fetch(`${apiUrl}payment/${bill.id}`, apiOptions('GET'));
                const resData = await res.json();

                if (!res.ok) {
                    toast.warning(resData.message);
                    console.error(resData);
                    return;
                }

                setPayments(resData);
            } catch (error) {
                toast.error('Erro ao listar pagamentos. Contate o suporte!');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPayments();
    }, [bill]);

    // Validações
    const validations = async (data) => {
        try {

            // Categoria não pode estar vazia
            if (!(data.id_categoria > 0)) {
                toast.warning('Preencha uma categoria!');
                return false;
            }

            // valor_base não pode ser negativo ou vazio
            data.valor_base = normalizeCurrencyToDecimal(data.valor_base);
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
            console.error(error);
            return false;
        }
    };

    const handleNewButton = () => {
        setIsLoading(true);
        navigate('/bill/form');
        reset({ ...defaultValues });
        setBill({});
        setPayments([]);
        setIsLoading(false);
    };

    const create = async (data) => {
        try {
            setIsLoading(true);

            const endpoint = 'bill';
            const completeUrl = `${apiUrl}${endpoint}`;

            const res = await fetch(completeUrl, apiOptions('POST', data));
            const resData = await res.json();

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
            const resData = await res.json();

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
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async (id) => {
        try {
            const completeUrl = `${apiUrl}payment/${id}`;

            setIsLoading(true);

            const res = await fetch(completeUrl, apiOptions('DELETE'));
            const resData = await res.json();

            if (res.ok) {
                toast.success('Pagamento deletado!');
                setPayments(prev => prev.filter(payment => payment.id !== id));
            } else {
                toast.warning('Pagamento não deletado. Contate o suporte!');
            }
        } catch (error) {
            toast.error('Erro ao deletar pagamento!');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderGraph = () => {
        if (isLoading || payments.length === 0) {
            return (
                <p className='text-center'>...</p>
            );
        }

        const graphPayments = payments.reduce((acc, payment) => {
            const [year, month] = payment.data.split('-');
            const formattedDate = `${month}/${year}`;

            const index = acc.findIndex(item => item.data === formattedDate);

            if (index === -1) {
                acc.push({
                    data: formattedDate,
                    valor: payment.valor,
                });
            } else {
                acc[index].valor += payment.valor;
            }

            return acc;
        }, []);

        console.log(graphPayments);

        return (
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={graphPayments}>
                        <XAxis dataKey="data" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="valor" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <article>
            {/* Título */}
            <div className='text-center'>
                <h1 className='fw-bold'>Contas recorrentes</h1>
                <p>Gerencia sua contas recorrentes</p>
            </div>
            {/* Formulário */}
            <div className='d-flex align-items-top justify-content-center mb-3'>
                <form action="#" className='card shadow-sm p-3' onSubmit={handleSubmit(onSubmit)} >
                    {/* Título */}
                    <div className='text-center'>
                        <h2>Cadastro</h2>
                        <p>Cadastre ou registre sua conta recorrente</p>
                    </div>
                    {/* Botões */}
                    <div className='form-line'>
                        <button type='button' onClick={handleNewButton} className='btn btn-primary' >Novo</button>
                        <button type='submit' disabled={isLoading} className='btn btn-success'>Salvar</button>
                        <NavLink to='/bill/list' className={'btn btn-secondary'} >Listar</NavLink>
                        <NavLink to='/payment/form' className={`btn btn-dark ${Object.keys(bill).length > 0 ? '' : 'disabled'}`} state={{ id_conta: bill.id, valor: bill.valor_base }} >Pagar</NavLink>
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
            </div>
            {/* Gráfico */}
            <div className='container card shadow-sm p-3 container-fluid mb-3'>
                {/* Título */}
                <div className='text-center'>
                    <h2>Gráfico</h2>
                    <p>Veja a os valores de seus pagamentos</p>
                </div>
                {/* Gráfico */}
                {renderGraph()}
            </div>
            {/* Pagamentos */}
            <div className='container card shadow-sm p-3 mb-3'>
                {/* Título */}
                <div className='text-center'>
                    <h2>Pagamentos</h2>
                    <p>Pagamentos realizados</p>
                </div>
                {/* Pagamentos */}
                {!isLoading && payments.length == 0 ? <p className='text-center'>...</p> : <></>}
                {!isLoading && payments.map(payment => {
                    const status = {};

                    if (payment.valor < (acceptableMarginPercentage * bill.valor_base)) {
                        status.className = 'warning';
                        status.text = 'Barato demais';
                    } else if (payment.valor > ((1 + acceptableMarginPercentage) * bill.valor_base)) {
                        status.className = 'danger';
                        status.text = 'Caro';
                    } else {
                        status.className = 'success';
                        status.text = 'Normal';
                    }

                    return (
                        <div key={`payment-${payment.id}`} className={`card card-highlight shadow-sm rounded-3 border-${status.className} mb-2`} style={{ borderLeftWidth: '4px' }}>
                            <div className='card-body d-flex flex-wrap justify-content-between'>
                                <div className='d-flex flex-column justify-content-center'>
                                    <div className='mb-1'>
                                        <span className='fw-bold'>{paymentMethods[payment.forma_pagamento]}</span>
                                        <span className={`ms-2 badge bg-${status.className}`}>{status.text}</span>
                                    </div>
                                    <span>
                                        <i className={`bi bi-calendar-date text-info`}></i>
                                        <span className='ms-2'>{dayjs(payment.data).format('DD/MM/YYYY')}</span>
                                    </span>
                                </div>
                                <div className='d-flex flex-column justify-content-center'>
                                    <span className='fw-bold' >
                                        R$ {floatToBRL(payment.valor)}
                                        <button className='ms-2 btn btn-outline-danger' onClick={() => onDelete(payment.id)}>Deletar</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <ToastContainer position='bottom-right' />
            {isLoading ? <Loading /> : <></>}
        </article>
    )
};

export default BillForm;