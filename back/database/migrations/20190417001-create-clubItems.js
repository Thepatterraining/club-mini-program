'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('club_items', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      club: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '社团id',
        defaultValue: 0,
      },
      user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "用户id"
      },
      level: {
        type: Sequelize.ENUM('MINISTER', 'VICE_MINISTER', 'COMMON', 'APPLY'),
        allowNull: false,
        comment: '等级',
        defaultValue: 'APPLY',
    },
      },
        {
          comment: '社团详情表',
        },
      )
  },
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.dropTable('club_items'),
    ]
  }
};