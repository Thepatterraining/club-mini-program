'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('banners', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false,
          comment: 'url',
          unique: true,
        },
        author: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: '上传人',
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
          comment: '轮播图表',
    indexes: [{
      unique: true,
      fields: ['url'],
    }],
        },
      )
  },
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.dropTable('news'),
    ]
  }
};