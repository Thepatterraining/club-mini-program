'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('news', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
          comment: '标题',
          unique: true,
        },
        content: {
          type: Sequelize.STRING,
          allowNull: false,
          comment: '内容',
        },
        author: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: '作者',
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
          comment: '文章表',
    indexes: [{
      unique: true,
      fields: ['title'],
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