'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('activity_imgs', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        activity_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: '活动id',
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false,
          comment: '活动内容图片的url',
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
          comment: '活动图片表',
        },
      )
  },
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.dropTable('activity_imgs'),
    ]
  }
};