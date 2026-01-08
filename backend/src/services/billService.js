import billRepository from "../repositories/billRepository.js";

import dayjs from 'dayjs';

const dateFormatDB = 'YYYY-MM-DD';

const getDashboardTotals = async (idUser) => {
    const today = dayjs().format(dateFormatDB);
    const firstDayMonth = dayjs().startOf('month').format(dateFormatDB);
    const lastDayMonth = dayjs().endOf('month').format(dateFormatDB);
    const firstDayNextMonth = dayjs().add(1,'month').startOf('month').format(dateFormatDB);
    const lastDayNextMonth = dayjs().add(1,'month').endOf('month').format(dateFormatDB);
    const maxStartDate = '1900-01-01';
    const maxEndDate = '3500-12-31';

    const dash = {};
    
    // A pagar neste mês
    dash.dueThisMonth = await billRepository.getMonthlyDueByUser(idUser, today);

    // Pago neste mês
    dash.paidThisMonth = await billRepository.getTotalPaidByUser(idUser, firstDayMonth, lastDayMonth);

    // Atrasado
    dash.overDue = await billRepository.getTotalOverdueByUser(idUser);

    // Próximo mês
    dash.dueNextMonth = await billRepository.getMonthlyDueByUser(idUser, firstDayNextMonth);

    // Total por categoria
    dash.categoryTotal = await billRepository.getCategoryTotalByUser(idUser, maxStartDate,maxEndDate);

    // Total por categoria neste mês
    dash.categoryTotalThisMonth = await billRepository.getCategoryTotalByUser(idUser, firstDayMonth, lastDayMonth);

    return dash;

}

const getBills = async (idUser) => {
    const bills = await billRepository.getBillsByUser(idUser);

    return bills;
}

export { getDashboardTotals, getBills };