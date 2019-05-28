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
        util.request("/join", {
            pageSize: 10,
            pageIndex: $this.data.pageIndex,
            user: $this.data.user,
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
        util.request("/join", {
            pageSize: 10,
            pageIndex: $this.data.pageIndex,
            user: $this.data.user,
        }, "GET", function(res) {
            $this.setData({
                listData: res.data,
                pageIndex: $this.data.pageIndex + 1
            })
            console.log(res)
        })
    },

    apply: function() {
        wx.navigateTo({
            url: '/pages/joinClub/joinClub'
        })
    },

    delete: function(e) {
        util.request('/clubItem', {
            id: e.currentTarget.dataset.id
        }, "DELETE", function(res) {
            wx.showToast({
                title: "退出成功"
            })

            //刷新页面
         if (getCurrentPages().length != 0) {
            getCurrentPages()[getCurrentPages().length - 1].onShow()
        }
        })
    }
})