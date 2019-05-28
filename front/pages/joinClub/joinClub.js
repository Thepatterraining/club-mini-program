const util = require('../../utils/util.js')

Page({
    onLoad: function() {
        const user = wx.getStorageSync("login")

        this.setData({
            user: user.id
        })


    },
    onReachBottom: function() {
        //下拉请求更多数据
        const $this = this
        util.request("/clubs", {
            pageSize: 10,
            pageIndex: $this.data.pageIndex,
        }, "GET", function(res) {
            $this.setData({
                listData: [...$this.data.listData,...res.data],
                pageIndex: $this.data.pageIndex + 1
            })
            console.log(res)
        })
    },
    onShow: function () {
        //加载列表
        const $this = this
        this.setData({
            pageIndex: 1,
        })
        util.request("/clubs", {
            pageSize: 10,
            pageIndex: $this.data.pageIndex,
        }, "GET", function(res) {
            $this.setData({
                listData: res.data,
                pageIndex: $this.data.pageIndex + 1
            })
            console.log(res)
        })
    },

    apply: function(e) {
        const $this = this
        util.request("/clubItem", {
            user_id: $this.data.user,
            club_id: e.currentTarget.dataset.id,
        }, "POST", function(res) {
            wx.showToast({
                title: "申请成功，等待审核",
            })
        })
    }
})