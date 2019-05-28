const util = require('../../utils/util.js')

Page({
    data: {
      listData:[
        {"name":"01","text":"text1","type":"type1"},
        {"name":"02","text":"text2","type":"type2"},
        {"name":"03","text":"text3","type":"type3"},
        {"name":"04","text":"text4","type":"type4"},
        {"name":"05","text":"text5","type":"type5"},
        {"name":"06","text":"text6","type":"type6"},
        {"name":"07","text":"text7","type":"type7"}
      ],
      hiddenmodalput: true,
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

    inputClub: function(e) {
        this.setData({
            name: e.detail.value
        })
    },

    setting: function(e) {
        //跳转页面
        wx.navigateTo({
            url: `/pages/setMinister/setMinister?club=${e.currentTarget.dataset.id}`
        })
    },

    delete: function(e) {
        console.log(e.currentTarget.dataset.name)

        //删除社团
        util.request("/club", {
            name: e.currentTarget.dataset.name
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
    },

    create: function() {

        //判断社团名称
        if (!this.data.name) {
            return wx.showToast({
                title: "请输入社团名称",
                icon: "none"
            })
        }
        
        util.request("/club", {
            name: this.data.name,
        }, "POST", function(res) {
            if (res.code == 0) {
                wx.showToast({
                    title: "创建成功"
                })
                //刷新页面
                console.log(getCurrentPages())
                if (getCurrentPages().length != 0) {
                    getCurrentPages()[getCurrentPages().length - 1].onShow()
                }
            }
        })
    },

  })