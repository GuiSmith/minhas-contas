import database from '../database/database.js';
import { QueryTypes } from 'sequelize';

const getMonthlyDueByUser = async (idUser, date) => {
    const [row] = await database.query(
        `SELECT SUM(IF(p.valor > 0,0,cr.valor_base)) AS total
        FROM contas_recorrentes cr
        LEFT JOIN (
            SELECT p.id_conta, p.valor
            FROM pagamento p
            WHERE p.id_user = :idUser AND p.data BETWEEN DATE_FORMAT(:date, '%Y-%m-01') AND LAST_DAY(:date)
            GROUP BY p.id_conta
        ) p ON p.id_conta = cr.id
        WHERE cr.ativo = 'S' AND cr.id_user = :idUser`,
        {
            replacements: { idUser, date },
            type: QueryTypes.SELECT,
        }
    );

    return row; 
}

const getTotalOverdueByUser = async (idUser) => {
    const [row] = await database.query(
        `SELECT SUM(GREATEST(TIMESTAMPDIFF(MONTH,DATE_FORMAT(mes_inicial,'%Y-%m-01'),DATE_FORMAT(CURDATE(), '%Y-%m-01')) - IFNULL(p.meses_pago,0),0) * cr.valor_base) AS total
        FROM contas_recorrentes cr
        LEFT JOIN (
            SELECT p.id_conta, IFNULL(COUNT(DISTINCT DATE_FORMAT(data,'%Y-%m')),0) AS meses_pago
            FROM pagamento p
            WHERE p.id_user = :idUser AND p.data <= LAST_DAY(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
            GROUP BY p.id_conta
        ) p ON p.id_conta = cr.id
        WHERE cr.ativo = 'S' AND cr.id_user = :idUser`,
        {
            replacements: { idUser },
            type: QueryTypes.SELECT,
        }
    );

    return row;
};

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

const getBillsByUser = async (idUser) => {
    const rows = await database.query(
        `SELECT
            cr.id,
            cr.descricao,
            cr.mes_inicial,
            cr.valor_base,
            cr.dia_fixo,
            c.descricao as categoria,
            ((TIMESTAMPDIFF(MONTH,cr.mes_inicial,DATE_FORMAT(CURDATE(), '%Y-%m-01')) + IF(DATE_FORMAT(cr.mes_inicial, '%Y-%m-01') = DATE_FORMAT(CURDATE(), '%Y-%m-01'),0,1)) - IFNULL(pa.meses_anteriores_pagos,0) * cr.valor_base) AS valor_atrasado,
            IFNULL(SUM(p.valor),0) AS valor_pago
        FROM contas_recorrentes cr
        JOIN categoria c ON c.id = cr.id_categoria AND cr.id_user = c.id_user
        LEFT JOIN (
            SELECT p.id_conta, COUNT(DISTINCT DATE_FORMAT(p.data, '%Y-%m')) AS meses_anteriores_pagos
            FROM pagamento p
            WHERE p.data < DATE_FORMAT(CURDATE(), '%Y-%m-01') AND p.id_user = :idUser
            GROUP BY p.id_conta
        ) AS pa ON pa.id_conta = cr.id
        LEFT JOIN (
            SELECT p.id_conta, p.valor
            FROM pagamento p
            WHERE p.id_user = :idUser AND p.data BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND LAST_DAY(CURDATE())
        ) p ON p.id_conta = cr.id
        WHERE cr.ativo = 'S' AND cr.id_user = :idUser
        GROUP BY cr.id`,
        {
            replacements: { idUser },
            type: QueryTypes.SELECT
        },
    );

    return rows;
}

export default { getMonthlyDueByUser, getTotalPaidByUser, getCategoryTotalByUser, getBillsByUser, getTotalOverdueByUser};