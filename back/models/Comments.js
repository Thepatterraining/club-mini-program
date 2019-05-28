import { STRING, DATE, INTEGER } from 'sequelize'
import { defineModel } from '../framework/database'
import {Users} from './Users'

export const Comments = defineModel(
  'comments',
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: STRING,
      allowNull: false,
      comment: '评论内容',
      defaultValue: '',
    },
  user_id: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "用户"
},
activity_id: {
  type: INTEGER,
  allowNull: false,
  defaultValue: 0,
  comment: "活动"
},
pid: {
  type: INTEGER,
  allowNull: false,
  defaultValue: 0,
  comment: "上级"
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
    comment: '评论表',
  },
)

Comments.belongsTo(Users, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: false,
  constraints: false,
})

