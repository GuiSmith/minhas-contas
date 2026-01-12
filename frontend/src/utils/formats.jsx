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

const normalizeCurrencyToDecimal = (value) => {

    // number já é number, não inventa regra nova
    if (typeof value === 'number' && !Number.isNaN(value)) {
        return value;
    }

    if (typeof value !== 'string') {
        return null;
    }

    const hasComma = value.includes(',');

    const numeric = value.replace(/\D/g, '');
    if (!numeric) return null;

    const intValue = parseInt(numeric, 10);

    if (hasComma) {
        return parseFloat((intValue / 100).toFixed(2));
    }

    return parseFloat(intValue.toFixed(2));
};

export { floatToBRL, fixedDate, normalizeCurrencyToDecimal };
