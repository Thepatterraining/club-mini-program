import { STRING, DATE, INTEGER, ENUM } from 'sequelize'
import { defineModel } from '../framework/database'

export const Clubs = defineModel(
  'clubs',
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
      comment: '社团名称',
    },
    desc: {
      type: STRING,
      allowNull: false,
      defaultValue: '',
      comment: "社团简介"
    },
    avatar: {
      type: STRING,
      allowNull: false,
      defaultValue: '',
      comment: "社团头像"
    },
    minister: {
      type: INTEGER,
      allowNull: false,
      comment: '部长',
      defaultValue: 0,
    },
    vice_minister: {
        type: INTEGER,
        allowNull: false,
        comment: '副部长1',
        defaultValue: 0,
    },
    vice_minister_two: {
        type: INTEGER,
        allowNull: false,
        comment: '副部长2',
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
    comment: '社团表',
  },
)

