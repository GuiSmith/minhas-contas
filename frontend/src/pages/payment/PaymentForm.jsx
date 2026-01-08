// Libraries
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

// UI
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

// Services
import { apiUrl, apiOptions } from '@services/API';

// Personalized UI
import Loading from '@components/Loading';

// Styles
import '@styles/form.css';

// Constants
import { paymentMethods } from '@constants/paymentConstants';

const PaymentForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const valor = location.state && location.state.valor ? location.state.valor : 0.00;
    const id_conta = location.state && location.state.id_conta ? location.state.id_conta : 0;

    const defaultValues = {
        id_conta: id_conta,
        forma_pagamento: 'D',
        valor: valor,
        juros: '0.00',
        multa: '0.00',
        desconto: '0.00',
        observacoes: '',
        data: dayjs().format('YYYY-MM-DD'),
    };

    const { register, handleSubmit, watch, reset, setValue } = useForm({ defaultValues });
    const [isLoading, setIsLoading] = useState(false);
    const [bill, setBill] = useState({});

    // Buscando conta
    useEffect(() => {
        if (isLoading) return;
        if (id_conta == 0) {
            navigate('/');
        }

        const fetchBill = async () => {
            setIsLoading(true);
            const completeUrl = `${apiUrl}bill/${id_conta}`;
            const res = await fetch(completeUrl, apiOptions('GET'));
            const resData = await res.json();
            setIsLoading(false);

            if (!res.ok) {
                toast.error("Erro ao buscar conta");
                return;
            }

            setBill(resData);
        }
        fetchBill();
    }, []);

    const validations = (data) => {
        // valor > 0
        if (!(data.valor > 0)) {
            toast.warning('Valor precisa ser maior que 0!');
            return false;
        }

        // juros, multa, desconto >= 0
        if (data.juros < 0) {
            toast.warning('Juros não pode ser negativo!');
            return false;
        }
        if (data.multa < 0) {
            toast.warning('Multa não pode ser negativa!');
            return false;
        }
        if (data.desconto < 0) {
            toast.warning('Desconto não pode ser negativo!');
            return false;
        }

        // id_conta (se não foi passado por state, valida o campo)
        if (!(data.id_conta > 0)) {
            toast.warning('Selecione a conta relacionada!');
            return false;
        }

        return true;
    };

    const create = async (data) => {
        try {
            setIsLoading(true);

            // Ajuste o endpoint abaixo conforme sua API
            const endpoint = 'payment'; // <-- preencher endpoint de criação de pagamento
            const completeUrl = `${apiUrl}${endpoint}`;

            // Preparar payload convertendo campos numéricos
            const payload = {
                id_conta: data.id_conta,
                forma_pagamento: data.forma_pagamento,
                valor: data.valor,
                juros: data.juros,
                multa: data.multa,
                desconto: data.desconto,
                observacoes: data.observacoes,
                data: data.data
            };

            const res = await fetch(completeUrl, apiOptions('POST', payload));
            const resData = await res.json();

            if (res.ok) {
                toast.success('Pagamento registrado!');
                navigate(`/bill/form/${id_conta}`);
            } else {
                toast.warning(resData.message || 'Erro ao registrar pagamento');
            }
        } catch (error) {
            toast.error('Erro ao criar pagamento. Contate o suporte!');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const isValid = validations(data);
            if (!isValid) return;

            await create(data);
        } catch (error) {
            toast.error('Erro ao salvar pagamento. Contate o suporte!');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <article>
            {/* Título */}
            <div className='text-center'>
                <h1 className='fw-bold'>Pagamento recorrente</h1>
                <p>Registre um novo pagamento para uma conta recorrente</p>
            </div>
            {/* Formulário */}
            <form action="#" className='card shadow-sm p-3' onSubmit={handleSubmit(onSubmit)}>
                {/* Botões */}
                <div className='form-line'>
                    <button type='submit' className='btn btn-success'>Salvar</button>
                </div>
                {/* Conta e Forma de pagamento */}
                <div className='form-line'>
                    {/* Conta */}
                    <div className='mb-3'>
                        <label htmlFor="id-conta" className='form-label'>Conta</label>
                        <input type="tel" disabled className='form-control' id='id-conta' value={bill.descricao ?? ''} />
                    </div>
                    {/* Forma de pagamento */}
                    <div className='mb-3'>
                        <label htmlFor="forma-pagamento" className='form-label'>Forma de Pagamento</label>
                        <select id="forma-pagamento" className='form-select' {...register('forma_pagamento')}>
                            {Object.entries(paymentMethods).map(([value,text]) => (
                                <option key={`method-${value}`} value={value} >{text}</option>
                            ))}
                            {/* <option value="P">Pix</option>
                            <option value="D">Dinheiro</option>
                            <option value="CC">Cartão de Crédito</option>
                            <option value="CD">Cartão de Débito</option>
                            <option value="B">Boleto</option>
                            <option value="T">Transferência Bancária</option> */}
                        </select>
                    </div>
                </div>
                {/* Valor e Júros */}
                <div className='form-line'>
                    {/* Valor */}
                    <div className='mb-3'>
                        <label htmlFor="valor" className='form-label'>Valor</label>
                        <input type="tel" className='form-control' id='valor' {...register('valor')} placeholder='0.00' />
                    </div>
                    {/* Júros */}
                    <div className='mb-3'>
                        <label htmlFor="juros" className='form-label'>Juros</label>
                        <input type="tel" className='form-control' id='juros' {...register('juros')} placeholder='0.00' />
                    </div>
                </div>
                {/* Multa e Descontos */}
                <div className='form-line'>
                    {/* Multa */}
                    <div className='mb-3'>
                        <label htmlFor="multa" className='form-label'>Multa</label>
                        <input type="tel" className='form-control' id='multa' {...register('multa')} placeholder='0.00' />
                    </div>
                    {/* Descontos */}
                    <div className='mb-3'>
                        <label htmlFor="desconto" className='form-label'>Desconto</label>
                        <input type="tel" className='form-control' id='desconto' {...register('desconto')} placeholder='0.00' />
                    </div>
                </div>
                {/* Data de pagamento */}
                <div className='form-line'>
                    <div className='mb-3'>
                        <label htmlFor="data" className='form-label'>Data de Pagamento</label>
                        <input type="date" className='form-control' {...register('data')} />
                    </div>
                </div>
                {/* Observações */}
                <div className='form-line'>
                    <label htmlFor="observacoes" className='form-label'>Observações</label>
                    <textarea id='observacoes' className='form-control' {...register('observacoes')} placeholder='Observações do pagamento'></textarea>
                </div>
            </form>

            <ToastContainer position='bottom-right' />
            {isLoading ? <Loading /> : null}
        </article>
    );
};

export default PaymentForm;