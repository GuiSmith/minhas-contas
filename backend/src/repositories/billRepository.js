import database from '../database/database.js';
import { QueryTypes } from 'sequelize';

import dayjs from 'dayjs';

const getTotalDueByUser = async (idUser, startDate, endDate) => {
    const [row] = await database.query(
        `SELECT SUM(GREATEST((TIMESTAMPDIFF(MONTH,IF(:startDate > cr.mes_inicial,:startDate,cr.mes_inicial),:endDate) + 1) - IFNULL(p.meses_pago,0),0) * cr.valor_base) AS total
        FROM contas_recorrentes cr
        LEFT JOIN (
            SELECT p.id_conta, IFNULL(COUNT(DISTINCT DATE_FORMAT(data,'%Y-%m')),0) AS meses_pago
            FROM pagamento p
            WHERE p.id_user = :idUser AND p.data BETWEEN :startDate AND :endDate
            GROUP BY p.id_conta
        ) p ON p.id_conta = cr.id
        WHERE cr.id_user = :idUser`,
        {
            replacements: { idUser, startDate, endDate },
            type: QueryTypes.SELECT,
        }
    );

    return row;
}

const getTotalPaidByUser = async (idUser, startDate, endDate) => {

    const [row] = await database.query(
        `SELECT IFNULL(SUM(p.valor),0) AS total
        FROM contas_recorrentes cr
        JOIN pagamento p ON p.id_conta = cr.id
        WHERE cr.id_user = 1 AND p.DATA BETWEEN :startDate AND :endDate`,
        {
            replacements: { idUser, startDate, endDate },
            type: QueryTypes.SELECT,
        }
    );

    return row;
}

const getCategoryTotalByUser = async (idUser, startDate, endDate) => {
    
    const rows = await database.query(
        `SELECT c.id, c.descricao, IFNULL(SUM(p.valor),0) AS total
        FROM pagamento p
        JOIN contas_recorrentes cr ON cr.id = p.id_conta
        JOIN categoria c ON c.id = cr.id_categoria
        WHERE cr.id_user = :idUser AND p.data BETWEEN :startDate AND :endDate
        GROUP BY c.id;`,
        {
            replacements: { idUser, startDate, endDate },
            type: QueryTypes.SELECT,
        }
    );
    
    return rows;
};

export default { getTotalDueByUser, getTotalPaidByUser, getCategoryTotalByUser };