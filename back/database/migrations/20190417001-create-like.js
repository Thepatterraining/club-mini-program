'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('likes', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        activity_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: '活动id',
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: '用户id',
        },
      },
        {
          comment: '用户点赞表',
        },
      )
  },
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.dropTable('likes'),
    ]
  }
};