const util = require('../../utils/util.js')

Page({
    onLoad: function() {
        const user = wx.getStorageSync("login")

        this.setData({
            user: user
        })


    },

    inputUser: function(e) {
        this.setData({
            userName: e.detail.value
        })
    },

    update: function() {
        const $this = this
        util.request('/user/' + $this.data.user.id, {
            name: $this.data.userName
        }, "PUT", function(res) {
            wx.setStorageSync("login", {
                ...$this.data.user,
                name: $this.data.userName
            })

            //刷新页面
            if (getCurrentPages().length != 0) {
                getCurrentPages()[getCurrentPages().length - 1].onLoad()
            }
            wx.showToast({
                title:"修改成功"
            })
        })
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
                    url: "http://localhost:3000/uploadUserAvatar",
                    filePath: paths[0],
                    name: "user_avatar",
                    formData: {
                        user: user.id
                    },
                    success: function(res) {
                        
                        let avatar = JSON.parse(res.data)
                        console.log(avatar)
                        //修改Storage
                        wx.setStorageSync("login", {
                            ...user,
                            avatar: avatar.data
                        })

                        //刷新页面
                        if (getCurrentPages().length != 0) {
                            getCurrentPages()[getCurrentPages().length - 1].onLoad()
                        }
                    }
                })
            }
        })
    },
})