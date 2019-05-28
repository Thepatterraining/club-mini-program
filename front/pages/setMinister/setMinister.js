const util = require("../../utils/util.js");

Page({
  data: {
    listData: []
  },
  onReachBottom: function() {
    //下拉请求更多数据
    const $this = this;
    util.request(
      "/clubUser",
      {
        club: $this.data.club_id,
        pageSize: 10,
        pageIndex: $this.data.pageIndex
      },
      "GET",
      function(res) {
        $this.setData({
          listData: [...$this.data.listData, ...res.data],
          pageIndex: $this.data.pageIndex + 1
        });
        console.log(res);
      }
    );
  },

  onLoad: function(options) {
    //接收参数 社团名称
    this.setData({
      club_id: options.club
    });
  },
  onShow: function() {
    //加载列表
    const $this = this;
    this.setData({
      pageIndex: 1
    });
    util.request(
      "/clubUser",
      {
        club: $this.data.club_id,
        pageSize: 10,
        pageIndex: $this.data.pageIndex
      },
      "GET",
      function(res) {
        $this.setData({
          listData: res.data,
          pageIndex: $this.data.pageIndex + 1
        });
        console.log(res);
      }
    );
  },

  inputUser: function(e) {
    this.setData({
      name: e.detail.value
    });
  },

  search: function(e) {
    if (!this.data.name) {
      return wx.showToast({
        title: "请输入学生名称",
        icon: "none"
      });
    }

    //搜索用户
    const $this = this;
    util.request(
      "/clubUser",
      {
        filters: {
          user: $this.data.name
        },
        club: $this.data.club_id,
        pageIndex: 1,
        pageSize: 10
      },
      "GET",
      function(res) {
        if (res.code == 0) {
          $this.setData({
            listData: res.data,
            filter: {
              name: $this.data.name
            },
            pageIndex: 1
          });
          console.log(res.data);
        }
      }
    );
  },

  delete: function(e) {
    util.request(
      "/clubItem",
      {
        id: e.currentTarget.dataset.id
      },
      "PUT",
      function(res) {
        wx.showToast({
          title: "删除成功"
        });

        //刷新页面
        if (getCurrentPages().length != 0) {
          getCurrentPages()[getCurrentPages().length - 1].onShow();
        }
      }
    );
  },

  setMinister: function(e) {
    //设置部长
    util.request(
      "/setMinister",
      {
        user_id: e.currentTarget.dataset.id,
        club_id: this.data.club_id
      },
      "POST",
      function(res) {
        //设置成功
        if (res.code == 0) {
          return wx.showToast({
            title: "设置成功"
          });
        }
      }
    );
  },

  setViceMinister: function(e) {
    //设置部长
    util.request(
      "/setViceMinister",
      {
        user_id: e.currentTarget.dataset.id,
        club_id: this.data.club_id
      },
      "POST",
      function(res) {
        if (res.code == 0) {
          return wx.showToast({
            title: "设置成功"
          });
        }
      }
    );
  }
});
