'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('clubs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '社团名称',
      },
      desc: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comment: "社团简介"
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comment: "社团头像"
      },
      minister: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '部长',
        defaultValue: 0,
      },
      vice_minister: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: '副部长1',
          defaultValue: 0,
      },
      vice_minister_two: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: '副部长2',
          defaultValue: 0,
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
          comment: '社团表',
        },
      )
  },
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.dropTable('clubs'),
    ]
  }
};