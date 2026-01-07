// Models
import PaymentModel from '../database/models/paymentModel.js';
import BillModel from '../database/models/billModel.js';

// Utils
import { parseNumber } from '../utils/format.js';

const list = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        if (!id) return res.status(400).json({ message: 'Informe o ID da conta para continuar' });

        const payments = await PaymentModel.findAll({
            where: { id_conta: id, id_user: req.user.id }
        });

        return res.status(200).json(payments.map(p => p.toJSON()));
    } catch (error) {
        console.error('Erro ao selecionar pagamentos', error);
        return res.status(500).json({ message: 'Erro desconhecido. Contate o suporte!' });
    }
};

const create = async (req, res) => {
    try {
        const body = req.body ?? {};

        // Colunas permitidas/obrigatórias
        const requiredColumns = ['id_conta', 'forma_pagamento', 'valor', 'data'];
        const permittedColumns = [...requiredColumns, 'juros', 'multa', 'desconto', 'observacoes'];

        // Rejeitar chaves desnecessárias
        for (const key of Object.keys(body)) {
            if (!permittedColumns.includes(key)) {
                return res.status(400).json({ message: `Dado desnecessário informado: ${key}` });
            }
        }

        // Validar campos obrigatórios
        for (const column of requiredColumns) {
            if (!body.hasOwnProperty(column)) {
                return res.status(400).json({ message: `Preencha todos os dados obrigatórios!` });
            }
        }

        const data = { ...body };

        // Definindo pertencimento
        data.id_user = req.user.id;

        // Validar conta existe e pertence ao usuário
        const bill = await BillModel.findOne({ where: { id: data.id_conta, id_user: data.id_user } });
        if (!bill) {
            return res.status(400).json({ message: 'Conta não encontrada' });
        }

        // Coerção de tipos numéricos
        data.valor = parseNumber(body.valor);
        data.juros = body.juros ? parseNumber(body.juros) : 0;
        data.multa = body.multa ? parseNumber(body.multa) : 0;
        data.desconto = body.desconto ? parseNumber(body.desconto) : 0;

        if (data.valor === null || data.valor <= 0) {
            return res.status(400).json({ message: 'Valor inválido' });
        }
        if (data.juros === null || data.juros < 0) {
            return res.status(400).json({ message: 'Juros inválido' });
        }
        if (data.multa === null || data.multa < 0) {
            return res.status(400).json({ message: 'Multa inválida' });
        }
        if (data.desconto === null || data.desconto < 0) {
            return res.status(400).json({ message: 'Desconto inválido' });
        }

        // Validar forma_pagamento está entre os valores definidos no model
        const enumValues = PaymentModel.getAttributes().forma_pagamento.type.values;
        if (!enumValues.includes(data.forma_pagamento)) {
            return res.status(400).json({ message: 'Forma de pagamento inválida' });
        }

        const created = await PaymentModel.create(data);
        return res.status(201).json(created.toJSON());
    } catch (error) {
        console.error('Erro ao criar pagamento', error);
        return res.status(500).json({ message: 'Erro ao criar pagamento. Contate o suporte!' });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params ?? {};
        if (!id) return res.status(400).json({ message: 'Informe o ID para continuar' });

        const existingPayment = await PaymentModel.findOne({ where: { id, id_user: req.user.id } });
        if (!existingPayment) return res.status(400).json({ message: 'Pagamento não encontrado' });

        await existingPayment.destroy();

        return res.status(200).json({ message: 'Pagamento removido com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover pagamento', error);
        return res.status(500).json({ message: 'Erro desconhecido. Contate o suporte!' });
    }
};

export default { list, create, remove };