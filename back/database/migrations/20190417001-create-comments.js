'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comments', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        content: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 0,
          comment: '评论内容',
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
        pid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: '上级id',
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
          comment: '评论表',
        },
      )
  },
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.dropTable('comments'),
    ]
  }
};