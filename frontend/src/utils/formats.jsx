const floatToBRL = (amount) => {
    const value = Number(amount);

    if (isNaN(value)) return "0,00";

    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export { floatToBRL };
