const util = require('../../utils/util.js')

Page({
    onLoad: function() {
        const user = wx.getStorageSync("login")

        this.setData({
            user: user.id,
        })

    },

    onReachBottom: function() {
        //下拉请求更多数据
        const $this = this
        util.request("/activities", {
            pageSize: 10,
            pageIndex: $this.data.pageIndex,
            user_id: $this.data.user_id
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
        util.request("/activities", {
            pageSize: 10,
            pageIndex: $this.data.pageIndex,
            user_id: $this.data.user_id
        }, "GET", function(res) {
            $this.setData({
                listData: res.data,
                pageIndex: $this.data.pageIndex + 1
            })
            console.log(res)
        })
    },

    update:function(e) {
        wx.navigateTo({
            url: "/pages/createActivity/createActivity?approval=" + e.currentTarget.dataset.approval + "&id=" + e.currentTarget.dataset.id 
        })
    }

})