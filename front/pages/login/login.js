const util = require('../../utils/util.js')

Page({
    
    login: function() {
        //先判断有没有登陆
        wx.removeStorageSync("login")
        const user = wx.getStorageSync("login")
        console.log("用户信息")
        console.log(user)
        if (user) {
            return wx.showToast({
                title: "已经登陆了",
                icon: "none"
            })
        }

        let url = "/login"
        const res = util.request(url, {
            name: this.data.userName,
            pwd: this.data.pwd
        }, "POST", function (res) {
            if (res) {
                //用户登陆成功
                wx.setStorage({
                    key: "login",
                    data: res.data
                })

                //跳转到首页
                wx.switchTab({
                    url: "/pages/index/index"
                })
            }
        })
    },

    inputUser: function(e) {
        this.setData({
            userName: e.detail.value
        })
    },

    inputPwd: function(e) {
        this.setData({
            pwd: e.detail.value
        })
    },

    goRegister: function() {
        wx.redirectTo({
            url: "/pages/register/register"
        })
    },
})