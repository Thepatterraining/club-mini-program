Page({
    data: {
        isLogin: false,
        user: {}
    },

    onShow: function () {
        const user = wx.getStorageSync("login")
        if (user) {
            this.setData({
                user: user,
                isLogin: true,
            })
        }

        console.log(this.data.isLogin)
        console.log(this.data.user)
    },
    logout: function() {
        wx.removeStorageSync("login")

        this.setData({
            isLogin: false,
            user: {},
        })

        wx.showToast({
            title: "退出成功"
        })

        //刷新页面
        if (getCurrentPages().length != 0) {
            getCurrentPages()[getCurrentPages().length - 1].onShow()
        }
    }
})