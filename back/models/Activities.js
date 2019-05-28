import { STRING, DATE, INTEGER, BOOLEAN, ENUM } from 'sequelize'
import moment from 'moment'
import { defineModel } from '../framework/database'
import {ActivityImgs} from './ActivityImgs'
import {Users} from './Users'
import {Clubs} from './Club'
import {Likes} from './likes'

export const Activities = defineModel(
  'activities',
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
      comment: '活动名称',
      unique: true,
    },
    content: {
      type: STRING,
      allowNull: false,
      comment: '活动内容',
    },
    startDate: {
      type: DATE,
      allowNull: false,
      comment: '开始时间',
      get() {
        return moment(this.getDataValue('startDate')).format('YYYY-MM-DD')
      }
    },
    endDate: {
        type: DATE,
        allowNull: false,
        comment: '结束时间',
        get() {
          return moment(this.getDataValue('endDate')).format('YYYY-MM-DD')
        }
      },
    place: {
        type: STRING,
        allowNull: false,
        comment: '地点',
    },
    amount: {
        type: INTEGER,
        allowNull: false,
        comment: '预计经费',
    },
    number: {
        type: INTEGER,
        allowNull: false,
        comment: '人数',
    },
    approval: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "是否审批"
    },
    push: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "是否发布"
  },
  user_id: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "用户"
},
club_id: {
  type: INTEGER,
  allowNull: false,
  defaultValue: 0,
  comment: "社团"
},
  status: {
    type: ENUM('NO_BEGIN','BEGINING','END'),
    allowNull: false,
    defaultValue: 'NO_BEGIN',
    comment: "状态 未开始 进行中 已结束"
},
like: {
  type: INTEGER,
  allowNull: false,
  defaultValue: 0,
  comment: '点赞数',
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
    comment: '活动表',
    indexes: [{
      unique: true,
      fields: ['name'],
    }],
  },
)

Activities.hasMany(ActivityImgs, {
  foreignKey: 'activity_id',
  sourceKey: 'id',
  foreignKeyConstraint: false,
  constraints: false,
})

Activities.belongsTo(Users, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: false,
  constraints: false,
})

Activities.belongsTo(Clubs, {
  foreignKey: 'club_id',
  targetKey: 'id',
  foreignKeyConstraint: false,
  constraints: false,
})

Activities.belongsTo(Likes, {
  foreignKey: 'id',
  as: 'isLike',
  targetKey: 'activity_id',
  foreignKeyConstraint: false,
  constraints: false,
})

