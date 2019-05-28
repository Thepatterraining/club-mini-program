const util = require('../../utils/util.js')

Page({

    onLoad: function(options) {
        this.setData({
            new_id: options.id
        })

        const $this = this

        //查询信息
        util.request('/new', {
            id: options.id
        }, "GET", function(res) {
            $this.setData({
                new: res.data
            })
        })
    },

})