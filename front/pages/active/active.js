const util = require('../../utils/util.js')

Page({

    data: {
        hiddenmodalput: true,
        //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框  
        user: 0,
        club: true,
      },
      //取消按钮  
      cancel: function () {
        this.setData({
          hiddenmodalput: true
        });
      },
      //确认  
      confirm: function (e) {
        const $this = this

        if ($this.data.activity_id && $this.data.comment) {
            util.request("/comment", {
                activity_id: $this.data.activity_id,
                content: $this.data.comment,
                pid: 0,
                user_id: $this.data.user
            }, "POST", function(res) {
                wx.showToast({
                    title: "评论成功",
                })
                $this.setData({
                    hiddenmodalput: true
                  })
            })
        } else {
            wx.showToast({
                title: "请输入评论内容",
                icon: "none"
            })
        }
        
        
      },

      inputComment: function(e) {
        this.setData({
            comment: e.detail.value
        })
      },

    onLoad: function() {
        const user = wx.getStorageSync("login")
        if (user) {
            this.setData({
                club: user.club == 0? true : false,
                user: user.id
            })
        }
    },

    onReachBottom: function() {
        //下拉请求更多数据
        const $this = this
        util.request("/activities", {
            pageSize: 10,
            pageIndex: $this.data.pageIndex,
            user_id: $this.data.user,
            filter: {
                user_id: $this.data.user,
                push: true,
            }
        }, "GET", function(res) {
            for (let i in res.data) {
                res.data[i].created_at = new Date(res.data[i].created_at).toLocaleString()
            }
            $this.setData({
                listData: [...$this.data.listData,...res.data],
                pageIndex: $this.data.pageIndex + 1
            })
            console.log(res)
        })
    },
    onShow: function () {
        const user = wx.getStorageSync("login")
        if (user) {
            this.setData({
                club: user.club == 0? true : false,
                user: user.id
            })
        }
        //加载列表
        const $this = this
        this.setData({
            pageIndex: 1,
        })
        util.request("/activities", {
            pageSize: 10,
            pageIndex: $this.data.pageIndex,
            user_id: $this.data.user,
            filter: {
                user_id: $this.data.user,
                push: true,
            }
        }, "GET", function(res) {
            for (let i in res.data) {
                res.data[i].created_at = new Date(res.data[i].created_at).toLocaleString()
            }
            
            $this.setData({
                listData: res.data,
                pageIndex: $this.data.pageIndex + 1
            })
            console.log(res)
        })
    },

    like: function(e) {
        //点赞
        const $this = this
        util.request('/like_activity', {
            activity_id: e.currentTarget.dataset.activity,
            user_id: $this.data.user,
        }, "POST", function(res) {
            console.log(res.data)
            if (res.data === true) {
                wx.showToast({
                    title: '点赞成功'
                })
            } else{
                wx.showToast({
                    title: '取消点赞成功',
                    icon:"none"
                })
            }
            
             //刷新页面
         if (getCurrentPages().length != 0) {
            getCurrentPages()[getCurrentPages().length - 1].onShow()
        }
        })

    },

    comment: function(e) {
        //评论
        this.setData({
            hiddenmodalput: !this.data.hiddenmodalput,
            activity_id: e.currentTarget.dataset.activity
          })
    }
})