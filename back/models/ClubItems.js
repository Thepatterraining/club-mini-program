import { DATE, INTEGER, ENUM } from 'sequelize'
import { defineModel } from '../framework/database'

import {Users} from './Users'
import {Clubs} from './Club'

export const ClubItems = defineModel(
  'club_items',
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    club: {
      type: INTEGER,
      allowNull: false,
      comment: '社团id',
      defaultValue: 0,
    },
    user: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "用户id"
    },
    level: {
      type: ENUM('MINISTER', 'VICE_MINISTER', 'COMMON','APPLY'),
      allowNull: false,
      comment: '等级',
      defaultValue: 'APPLY',
  },
  },
  {
    comment: '社团详情表',
    timestamps: false,
    paranoid: false,
  },
)

ClubItems.belongsTo(Users, {
  foreignKey: 'user',
  targetKey: 'id',
  as:'user_info',
  foreignKeyConstraint: false,
  constraints: false,
})

ClubItems.belongsTo(Clubs, {
  foreignKey: 'club',
  targetKey: 'id',
  as:'club_info',
  foreignKeyConstraint: false,
  constraints: false,
})