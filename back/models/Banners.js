import { STRING, DATE, INTEGER } from 'sequelize'
import { defineModel } from '../framework/database'

export const Banners = defineModel(
  'banners',
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: STRING,
      allowNull: false,
      comment: 'url',
      unique: true,
    },
    author: {
      type: INTEGER,
      allowNull: false,
      comment: '上传人',
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
    comment: '轮播图表',
    indexes: [{
      unique: true,
      fields: ['url'],
    }],
  },
)

