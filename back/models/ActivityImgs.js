import { STRING, DATE, INTEGER } from 'sequelize'
import { defineModel } from '../framework/database'

export const ActivityImgs = defineModel(
  'activity_imgs',
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    activity_id: {
      type: INTEGER,
      allowNull: false,
      comment: '活动id',
    },
    url: {
      type: STRING,
      allowNull: false,
      comment: '活动内容图片的url',
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
    comment: '活动图片表',
  },
)

