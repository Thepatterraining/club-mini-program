const util = require('../../utils/util.js')

Page({

    onReachBottom: function() {
        //下拉请求更多数据
        const $this = this
        util.request("/activities", {
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
    
    onShow: function() {
        //加载列表
        const $this = this
        this.setData({
            pageIndex: 1,
        })
        util.request("/activities", {
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

    check: function(e) {
        util.request('/check_activity', {
            id: e.currentTarget.dataset.id,
        }, "POST", function(res) {
            wx.showToast({
                title: "审核成功"
            })

            //刷新页面
            if (getCurrentPages().length != 0) {
                getCurrentPages()[getCurrentPages().length - 1].onShow()
            }
        })
    }
})