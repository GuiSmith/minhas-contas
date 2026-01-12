// Models
import BillModel from '../database/models/billModel.js';
import CategoryModel from '../database/models/categoryModel.js';

// Utils
import { parseNumber } from '../utils/format.js';
import { Op } from 'sequelize';

// Services
import { getDashboardTotals, getBills } from '../services/billService.js';

const dashboard = async (req, res) => {
    try {
        const dash = await getDashboardTotals(req.user.id);

        const dashboardData = {
            pagar_neste_mes: dash.dueThisMonth,
            pago_neste_mes: dash.paidThisMonth,
            atrasado: dash.overDue,
            pagar_proximo_mes: dash.dueNextMonth,
            total_por_categoria: dash.categoryTotal,
            total_por_categoria_neste_mes: dash.categoryTotalThisMonth
        };

        return res.status(200).json(dashboardData);

    } catch (error) {
        console.error('Erro ao buscar dashboard', error);
        return res.status(500).json({ message: 'Erro desconhecido. Contate o suporte!' });
    }
};

const list = async (req, res) => {
    try {
        const bills = await getBills(req.user.id);

        return res.status(200).json(bills);
    } catch (error) {
        console.error('Erro ao buscar contas', error);
        return res.status(500).json({ message: 'Erro desconhecido. Contate o suporte!' });
    }
};

const select = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        if (!id) return res.status(400).json({ message: 'Informe o ID para continuar' });

        const bill = await BillModel.findOne({
            where: { id, id_user: req.user.id }
        });
        if (!bill) return res.status(400).json({ message: 'Conta não encontrada' });

        const result = bill.toJSON();
        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro ao selecionar conta', error);
        return res.status(500).json({ message: 'Erro desconhecido. Contate o suporte!' });
    }
};

const create = async (req, res) => {
    try {
        const body = req.body ?? {};

        // Colunas permitidas/obrigatórias
        const requiredColumns = ['descricao', 'id_categoria', 'valor_base', 'tipo_recorrencia', 'mes_inicial', 'dia_fixo'];

        const permittedColumns = [...requiredColumns, 'ativo', 'observacoes'];

        // Rejeitar chaves desnecessárias
        for (const key of Object.keys(body)) {
            if (!permittedColumns.includes(key)) {
                return res.status(400).json({ message: `Dado desnecessário informado: ${key}` });
            }
        }

        // Validar todos os campos obrigatórios
        for (const column of requiredColumns) {
            if (!body.hasOwnProperty(column)) {
                return res.status(400).json({ message: `Preencha todos os dados obrigatórios!` });
            }
        }

        const data = body;

        // Definindo pertencimento
        data.id_user = req.user.id;

        // Coerção de tipos
        data.valor_base = parseNumber(body.valor_base);

        if (data.valor_base === null || data.valor_base <= 0) {
            return res.status(400).json({ message: 'Valor inválido' });
        }

        // Categoria
        const category = await CategoryModel.findOne({
            where: { id: data.id_categoria, id_user: data.id_user }
        });
        if (!category) {
            return res.status(400).json({ message: 'Categoria não encontrada' });
        }

        // Descrição não pode ser vazia
        if (!data.descricao || data.descricao.trim() === '') {
            return res.status(400).json({ message: 'Descrição inválida' });
        } else {
            data.descricao = data.descricao.trim();
        }

        // Descrição única por categoria
        const existingBill = await BillModel.findOne({
            where: { descricao: data.descricao, id_categoria: data.id_categoria, id_user: data.id_user }
        });
        if (existingBill) {
            return res.status(400).json({ message: 'Já existe uma conta com essa descrição nessa categoria' });
        }

        // Recorrência
        if (!BillModel.getAttributes().tipo_recorrencia.type.values.includes(data.tipo_recorrencia)) {
            return res.status(400).json({ message: "Tipo de recorrência inválida" });
        }

        // Data de início
        if (!data.mes_inicial) {
            return res.status(400).json({ message: "Data de início inválida ou não informada" });
        }

        // Dia fixo
        if (!data.dia_fixo || (data.dia_fixo < 0 || data.dia_fixo > 25)) {
            return res.status(400).json({ message: "Dia fixo deve ser entre 1 e 25" });
        }

        // Ativo
        if (data.ativo) {
            if (BillModel.getAttributes().ativo.type.values.includes(data.ativo) === false) {
                return res.status(400).json('Status inválido');
            }
        }

        const createdBill = await BillModel.create(data);
        const createdBillObj = createdBill.toJSON();
        return res.status(201).json(createdBillObj);

    } catch (error) {
        console.error('Erro ao criar conta', error);
        return res.status(500).json({ message: 'Erro ao criar conta. Contate o suporte!' });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params ?? {};

        const body = req.body ?? {};

        if (!id) {
            return res.status(400).json({ message: 'Informe o ID para continuar' });
        }

        // Ver se conta existe mesmo
        const existingBill = await BillModel.findOne({
            where: { id, id_user: req.user.id }
        });
        if (!existingBill) {
            return res.status(400).json({ message: 'Conta não encontrada' });
        }

        // Colunas permitidas
        const permittedColumns = ['descricao', 'id_categoria', 'valor_base', 'tipo_recorrencia', 'mes_inicial', 'dia_fixo', 'ativo', 'observacoes'];

        // Rejeitar chaves desnecessárias
        for (const key of Object.keys(body)) {
            if (!permittedColumns.includes(key)) {
                return res.status(400).json({ message: `Dado desnecessário informado: ${key}` });
            }
        }

        const data = body;

        // Descrição única por categoria
        const duplicateDescriptionBill = await BillModel.findOne({
            where: {
                descricao: data.descricao,
                id_categoria: data.id_categoria,
                id_user: req.user.id,
                id: { [Op.ne]: id },
            }
        });
        if (duplicateDescriptionBill) {
            return res.status(400).json({ message: 'Já existe uma conta com essa descrição nessa categoria' });
        }

        // Coerção de tipos
        if (data.valor_base) {
            data.valor_base = parseNumber(body.valor_base);

            if (data.valor_base === null || data.valor_base <= 0) {
                return res.status(400).json({ message: 'Valor inválido' });
            }
        }

        // Categoria
        if (data.id_categoria) {
            const category = await CategoryModel.findOne({
                where: { id: data.id_categoria, id_user: req.user.id }
            });
            if (!category) {
                return res.status(400).json({ message: 'Categoria não encontrada' });
            }
        }

        // Recorrência
        if (data.tipo_recorrencia) {
            if (!BillModel.getAttributes().tipo_recorrencia.type.values.includes(data.tipo_recorrencia)) {
                return res.status(400).json({ message: "Tipo de recorrência inválida" });
            }
        }

        // Dia fixo
        if (data.dia_fixo) {
            if (data.dia_fixo < 0 || data.dia_fixo > 25) {
                return res.status(400).json({ message: "Dia fixo deve ser entre 1 e 25" });
            }
        }

        // Ativo
        if (data.ativo) {
            if (BillModel.getAttributes().ativo.type.values.includes(data.ativo) === false) {
                return res.status(400).json('Status inválido');
            }
        }

        await existingBill.update(data);

        return res.status(200).json({ message: 'Conta atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar conta', error);
        return res.status(500).json({ message: 'Erro desconhecido. Contate o suporte!' });
    }
}

export default { dashboard, select, create, update, list };