import dayjs from 'dayjs';

const floatToBRL = (amount) => {
    const value = Number(amount);

    if (isNaN(value)) return "0,00";

    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const fixedDate = (dbDate) => {
    const today = dayjs();
    const day = dayjs(dbDate).date();

    const fixedDate = today.date(day).format('DD/MM/YYYY');

    return fixedDate;
};

export { floatToBRL, fixedDate };
