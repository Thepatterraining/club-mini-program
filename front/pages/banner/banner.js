const util = require('../../utils/util.js')

Page({
    data: {
        listData: []
    },

    upload: function() {
        wx.chooseImage({
            success: function(res) {
                const paths = res.tempFilePaths
                console.log(paths[0])

                const user = wx.getStorageSync("login")

                if (!user) {
                    return wx.showToast({
                        title: "请登录",
                        icon: "none"
                    })
                }

                //上传
                wx.uploadFile({
                    url: "http://localhost:3000/upload",
                    filePath: paths[0],
                    name: "banner",
                    formData: {
                        user: user.id
                    },
                    success: function(res) {
                        //刷新页面
                        if (getCurrentPages().length != 0) {
                            getCurrentPages()[getCurrentPages().length - 1].onShow()
                        }
                    }
                })
            }
        })
    },

    onReachBottom: function() {
        //下拉请求更多数据
        const $this = this
        util.request("/banners", {
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
        util.request("/banners", {
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

    delete: function(e) {
        console.log(e.currentTarget.dataset.url)

        //删除社团
        util.request("/banner", {
            url: e.currentTarget.dataset.url
        }, "DELETE", function(res) {
            //删除成功
            if (res.code == 0) {
                wx.showToast({
                    title: "删除成功"
                })

                //刷新页面
                console.log(getCurrentPages())
                if (getCurrentPages().length != 0) {
                    getCurrentPages()[getCurrentPages().length - 1].onShow()
                }
            }
        })
    }

})