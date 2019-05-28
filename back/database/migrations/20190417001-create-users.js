'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '用户名',
        unique: true,
      },
      pwd: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '密码',
      },
      avatar: {
          type: Sequelize.STRING,
          allowNull: false,
          comment: '头像',
      },
      level: {
          type: Sequelize.ENUM('ADMIN', 'MINISTER', 'COMMON'),
          allowNull: false,
          comment: '等级',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
      },
        {
          comment: '用户表',
    indexes: [{
      unique: true,
      fields: ['name'],
    }],
        },
      )
  },
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.dropTable('users'),
    ]
  }
};