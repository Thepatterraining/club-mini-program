import { STRING, DATE, INTEGER } from 'sequelize'
import { defineModel } from '../framework/database'

export const News = defineModel(
  'news',
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: STRING,
      allowNull: false,
      comment: '标题',
      unique: true,
    },
    content: {
      type: STRING,
      allowNull: false,
      comment: '内容',
    },
    author: {
      type: INTEGER,
      allowNull: false,
      comment: '作者',
      defaultValue: 0,
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
    comment: '文章表',
    indexes: [{
      unique: true,
      fields: ['title'],
    }],
  },
)

