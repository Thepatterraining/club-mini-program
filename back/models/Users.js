import { STRING, DATE, INTEGER, ENUM } from 'sequelize'
import { defineModel } from '../framework/database'

export const Users = defineModel(
  'users',
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING,
      allowNull: false,
      comment: '用户名',
      unique: true,
    },
    pwd: {
      type: STRING,
      allowNull: false,
      comment: '密码',
    },
    avatar: {
        type: STRING,
        allowNull: false,
        comment: '头像',
    },
    level: {
        type: ENUM('ADMIN', 'MINISTER', 'COMMON'),
        allowNull: false,
        comment: '等级',
    },
    created_at: {
      allowNull: false,
      type: DATE,
    },
    updated_at: {
      allowNull: false,
      type: DATE,
    },
    deleted_at: {
      type: DATE,
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



