// Libraries
import { useState, useEffect } from 'react';

// UI
import { ToastContainer, toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import { fixedDate } from '@utils/formats.jsx';

// Services
import { apiUrl, apiOptions } from '@services/API';

// Personalized UI
import Loading from '@components/Loading';
import DashCard from '@ui/DashCard';
import { floatToBRL } from '../../utils/formats';
import '@styles/billList.css';

const BillList = () => {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({});
    const [bills, setBills] = useState([]);
    const [billStatus, setBillStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Buscar Dashboard
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const endpoint = 'bill/dash';
                const completeUrl = `${apiUrl}${endpoint}`;

                setIsLoading(true);

                const res = await fetch(completeUrl, apiOptions('GET'));
                const resData = await res.json();

                if (res.ok) {
                    setDashboard(resData);
                } else {
                    toast.warning("Erro ao buscar dados da dashboard!");
                }
            } catch (error) {
                console.log(error);
                toast.error("Erro ao buscar dados da dashboard!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    // Buscar Contas
    useEffect(() => {
        const fetchBills = async () => {
            try {
                const endpoint = 'bill';
                const completeUrl = `${apiUrl}${endpoint}`;

                setIsLoading(true);

                const res = await fetch(completeUrl, apiOptions('GET'));
                const resData = await res.json();

                if (res.ok) {
                    setBills(resData);
                } else {
                    toast.warning("Erro ao buscar listar contas!");
                }
            } catch (error) {
                console.log(error);
                toast.error("Erro ao listar contas!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBills();
    }, []);

    const handleBillStatus = (e) => {
        setBillStatus(e.target.textContent == billStatus ? '' : e.target.textContent);
    };

    const status = {
        danger: 'Atrasado',
        warning: 'Pendente',
        success: 'Pago'
    };

    return (
        <section className='container'>
            {/* Cards */}
            <article className='d-flex flex-wrap justify-content-center gap-3'>
                <DashCard
                    title='Total a pagar'
                    iconClass='bi-exclamation-circle'
                    amount={dashboard.pagar_neste_mes?.total}
                    text='Total de contas pendentes'
                    textClass='text-warning'
                />
                <DashCard
                    title='Total pago'
                    iconClass='bi-currency-dollar'
                    amount={dashboard.pago_neste_mes?.total}
                    text='Pagamentos realizados este mês'
                    textClass='text-success'
                />
                <DashCard
                    title='Total atrasado'
                    iconClass='bi-clock-history'
                    amount={dashboard.atrasado?.total}
                    text='Contas com vencimento passado'
                    textClass='text-danger'
                />
                <DashCard
                    title='Próximo mês'
                    iconClass='bi-calendar-date'
                    amount={dashboard.pagar_proximo_mes?.total}
                    text='Vencimentos no próximo mês'
                    textClass='text-primary'
                />
            </article>
            {/* Contas */}
            <article className='mt-3 container card shadow-sm rounded-3 p-3'>
                {/* Título */}
                <div className='mb-3 d-flex flex-wrap justify-content-between'>
                    <h4>Contas ativas</h4>
                    <div>
                        {Object.entries(status).map(([className, text]) => (
                            <button
                                key={`button-${text}`}
                                className={`ms-1 btn btn-sm ${billStatus == text ? 'btn-' + className : 'btn-outline-' + className}`}
                                onClick={handleBillStatus}
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Contas */}
                <div>
                    {bills.map((bill) => {
                        let localStatus = '';
                        if (bill.valor_atrasado > 0) {
                            localStatus = 'danger';
                        } else if (bill.valor_pago > 0) {
                            localStatus = 'success';
                        } else {
                            localStatus = 'warning';
                        }

                        return (
                            <div
                                key={`bill-${bill.id}`}
                                className={`${(billStatus != '' && billStatus != status[localStatus]) ? 'd-none' : 'd-block'} card card-highlight border-${localStatus} shadow-sm rounded-3 mb-2 bill-card`}
                                title='Clique duas vezes para visualizar a conta'
                            >
                                <div className='card-body d-flex flex-wrap justify-content-between'>
                                    <div className='d-flex flex-column justify-content-center bill-card-link' onClick={() => navigate(`/bill/form/${bill.id}`)} >
                                        <div className='mb-1'>
                                            <span className='fw-bold'>{bill.descricao}</span>
                                            <span className={`ms-2 align-middle badge bg-${localStatus}`}>{status[localStatus]}</span>
                                        </div>
                                        <small className='text-muted'>{fixedDate(bill.mes_inicial)}</small>
                                    </div>
                                    <div className='d-flex flex-column justify-content-center'>
                                        <span className='fw-bold'>R$ {floatToBRL(bill.valor_base)} <NavLink to='/payment/form' className={'ms-2 btn btn-outline-dark'} state={{ id_conta: bill.id, valor: bill.valor_base }} >Pagar</NavLink></span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </article>
            {isLoading ? <Loading /> : <></>}
            <ToastContainer position='bottom-right' />
        </section>
    );
};

export default BillList;