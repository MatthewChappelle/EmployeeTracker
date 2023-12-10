const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Department = require('./department');

class Role extends Model { }

// Role model
Role.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'role',
    tableName: 'roles',
  }
);

// Export the Role model with Department as foreign key
Role.belongsTo(Department, { foreignKey: 'department_id' });


// Export the Role model
module.exports = Role;
