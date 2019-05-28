
const util = require('../../utils/util.js')

Page({
    onReachBottom: function() {
        //下拉请求更多数据
        const $this = this
        util.request("/apply", {
            pageSize: 10,
            pageIndex: $this.data.pageIndex,
            club: $this.data.club_id,
        }, "GET", function(res) {
            $this.setData({
                listData: [...$this.data.listData,...res.data],
                pageIndex: $this.data.pageIndex + 1
            })
            console.log(res)
        })
    },

    onLoad: function() {
        //查询学生列表
        const $this = this
        const user = wx.getStorageSync("login")
        this.setData({
            club_id: user.club,
            pageIndex: 1,
        })
        util.request("/apply", {
            pageSize: 10,
            pageIndex: $this.data.pageIndex,
            club: user.club,
        }, "GET", function(res) {
            $this.setData({
                listData: res.data,
                pageIndex: $this.data.pageIndex + 1
            })
        })
    },

    check: function(e) {
        util.request('/checkItem', {
            id: e.currentTarget.dataset.id
        }, "POST", function(res) {
            wx.showToast({
                title: "审核成功"
            })

            if (getCurrentPages().length != 0) {
                getCurrentPages()[getCurrentPages().length - 1].onLoad()
            }
        })
    }
})
