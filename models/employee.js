const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Role = require('./role');

class Employee extends Model { }

// Employee model
Employee.init(
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //equates to department
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    //equates to manager in charge of department (self if manager)
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'employee',
    tableName: 'employee',
  }
);

Employee.belongsTo(Role, { foreignKey: 'role_id' });
//set manager_id to employee's superior
Employee.belongsTo(Employee, {
  as: 'manager',
  foreignKey: 'manager_id',
  constraints: false,
});


// Export the Employee model
module.exports = Employee;
