import { DataTypes } from 'sequelize';
import database from '../database.js';

const BillModel = database.define('contas_recorrentes', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    ativo: {
        type: DataTypes.ENUM('S', 'N'),
        allowNull: false,
        defaultValue: 'S',
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
    },
    valor_base: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    tipo_recorrencia: {
        type: DataTypes.ENUM('M', 'A'),
        allowNull: false,
    },
    mes_inicial: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    dia_fixo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

BillModel.associate = (models) => {
    BillModel.belongsTo(models.categoria, {
        foreignKey: {
            name: 'id_categoria',
            allowNull: false,
        }
    });

    BillModel.belongsTo(models.user, {
        foreignKey: {
            name: 'id_user',
            allowNull: false,
        }
    });
};

export default BillModel;