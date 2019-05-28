import { INTEGER } from 'sequelize'
import { defineModel } from '../framework/database'


export const Likes = defineModel(
  'likes',
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
      defaultValue: 0,
      comment: '活动id',
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "用户"
    },
  },
  {
    comment: '点赞表',
    timestamps: false,
    paranoid: false,
  },
)

