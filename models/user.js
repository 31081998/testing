const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Model = Sequelize.Model
class User extends Model {}

User.init(
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: { type: Sequelize.STRING(50), allowNull: false },
        email: { type: Sequelize.STRING(100), allowNull: false },
        password: { type: Sequelize.STRING(200), allowNull: false },
        contact_number: { type: Sequelize.INTEGER, allowNull: true },
        is_active: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1 },
        is_verified: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 0 }
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false
    }
)

module.exports = User
