'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('activities', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          comment: '活动名称',
          unique: true,
        },
        content: {
          type: Sequelize.STRING,
          allowNull: false,
          comment: '活动内容',
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false,
          comment: '开始时间',
        },
        endDate: {
            type: Sequelize.DATE,
            allowNull: false,
            comment: '结束时间',
          },
        place: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: '地点',
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: '预计经费',
        },
        number: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: '人数',
        },
        approval: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "是否审批"
        },
        push: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: "是否发布"
      },
      status: {
        type: Sequelize.ENUM('NO_BEGIN','BEGINING','END'),
        allowNull: false,
        defaultValue: 'NO_BEGIN',
        comment: "状态 未开始 进行中 已结束"
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "用户"
  },
  club_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "社团"
  },
  like: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '点赞数',
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
          comment: '活动表',
    indexes: [{
      unique: true,
      fields: ['name'],
    }],
        },
      )
  },
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.dropTable('activities'),
    ]
  }
};