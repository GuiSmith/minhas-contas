// Libraries
import { useState, useEffect } from 'react';

// UI
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'

// Services
import { apiUrl, apiOptions } from '@services/API';

// Personalized UI
import Loading from '@components/Loading';
import BillCard from '@ui/BillCard';

const BillList = () => {

    const [dashboard, setDashboard] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const endpoint = 'bill/dash';
                const completeUrl = `${apiUrl}${endpoint}`;

                setIsLoading(true);

                const res = await fetch(completeUrl, apiOptions('GET'));
                const resData = await res.json();
                console.log(res);
                console.log(resData);

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
    },[]);

    return (
        <section className='container'>
            {/* Cards */}
            <article className='d-flex flex-wrap justify-content-center gap-3'>
                <BillCard
                    title='Total a pagar'
                    iconClass='bi-exclamation-circle'
                    amount={dashboard.pagar_neste_mes?.total}
                    text='Total de contas pendentes'
                    textClass='text-warning'
                />
                <BillCard
                    title='Total pago'
                    iconClass='bi-currency-dollar'
                    amount={dashboard.pago_neste_mes?.total}
                    text='Pagamentos realizados este mês'
                    textClass='text-success'
                />
                <BillCard
                    title='Total atrasado'
                    iconClass='bi-clock-history'
                    amount={dashboard.atrasado?.total}
                    text='Contas com vencimento passado'
                    textClass='text-danger'
                />
                <BillCard
                    title='Próximo mês'
                    iconClass='bi-calendar-date'
                    amount={dashboard.pagar_proximo_mes?.total}
                    text='Vencimentos no próximo mês'
                    textClass='text-primary'
                />
            </article>
            {isLoading ? <Loading /> : <></>}
            <ToastContainer position='bottom-right' />
        </section>
    );
};

export default BillList;