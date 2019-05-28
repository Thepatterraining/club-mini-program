
const util = require('../../utils/util.js')

Page({

    onLoad: function(options) {
        //接收参数 社团id
        this.setData({
            club_id: options.club
        })
    },

    onShow: function() {
        //获取社团信息
        const $this = this
        util.request("/club", {
            id: $this.data.club_id,
        }, "GET", function(res) {
            if (res.code == 0) {
                res.data.created_at = new Date(res.data.created_at).toLocaleString()
                console.log(new Date(res.data.created_at).toLocaleString())
                $this.setData({
                    club: res.data
                })
                console.log($this.data.club)
            }
        })
    },

    inputName: function(e) {
        this.setData({
            club: {...this.data.club, name: e.detail.value}
        })
        console.log(this.data.club)
    },

    inputDesc: function(e) {
        this.setData({
            club: {...this.data.club, desc: e.detail.value}
        })
        console.log(this.data.club)
    },

    update: function() {
        const {name, desc, id} = this.data.club
        util.request("/club/" + id, {
            name: name,
            desc: desc
        }, "PUT", function(res) {
            if (res.code == 0) {
                wx.showToast({
                    title: "修改成功"
                })
                 //刷新页面
                 if (getCurrentPages().length != 0) {
                    getCurrentPages()[getCurrentPages().length - 1].onShow()
                }
            }
        })
    },

    upload: function() {
        const $this = this
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
                    url: "http://localhost:3000/uploadClubAvatar",
                    filePath: paths[0],
                    name: "club_avatar",
                    formData: {
                        club: $this.data.club.id
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
})