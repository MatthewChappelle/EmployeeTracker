const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


class Department extends Model { }

// Department model
Department.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'department',
    tableName: 'department',
  }
);

// Export the Department model
module.exports = Department;
