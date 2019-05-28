const util = require("../../utils/util.js");

Page({
  data: {
    hiddenmodalput: true,
    //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
    listData: []
  },
  //取消按钮
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认
  confirm: function(e) {
    const $this = this;

    if ($this.data.activity_id && $this.data.comment) {
      util.request(
        "/comment",
        {
          activity_id: $this.data.activity_id,
          content: $this.data.comment,
          pid: $this.data.pid,
          user_id: $this.data.user
        },
        "POST",
        function(res) {
          wx.showToast({
            title: "评论成功"
          });
          $this.setData({
            hiddenmodalput: true
          });

          if (getCurrentPages().length != 0) {
            getCurrentPages()[getCurrentPages().length - 1].onShow();
          }
        }
      );
    } else {
      wx.showToast({
        title: "请输入评论内容",
        icon: "none"
      });
    }
  },

  inputComment: function(e) {
    this.setData({
      comment: e.detail.value
    });
  },

  like: function(e) {
    //点赞
    const $this = this;
    util.request(
      "/like_activity",
      {
        activity_id: e.currentTarget.dataset.activity,
        user_id: $this.data.user
      },
      "POST",
      function(res) {
        console.log(res.data);
        if (res.data === true) {
          wx.showToast({
            title: "点赞成功"
          });
        } else {
          wx.showToast({
            title: "取消点赞成功",
            icon: "none"
          });
        }

        //刷新页面
        if (getCurrentPages().length != 0) {
          getCurrentPages()[getCurrentPages().length - 1].onShow();
        }
      }
    );
  },

  reply: function(e) {
    //评论
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      activity_id: e.currentTarget.dataset.activity,
      pid: e.currentTarget.dataset.pid
    });
  },

  delete: function(e) {
    const $this = this;
    util.request(
      "/comment",
      {
        id: e.currentTarget.dataset.id,
        user_id: $this.data.user
      },
      "DELETE",
      function(res) {
        wx.showToast({
          title: "删除成功"
        });

        if (getCurrentPages().length != 0) {
          getCurrentPages()[getCurrentPages().length - 1].onShow();
        }
      }
    );
  },

  onLoad: function(options) {
    const user = wx.getStorageSync("login");

    this.setData({
      user: user.id,
      activity_id: options.id
    });
  },

  onReachBottom: function() {
    //下拉请求更多数据
    const $this = this;
    util.request(
      "/comments",
      {
        pageSize: 10,
        pageIndex: $this.data.pageIndex,
        activity_id: $this.data.activity_id
      },
      "GET",
      function(res) {
        for (let i in res.data) {
          //查询是不是自己的评论
          if (res.data[i].user_id == $this.data.user) {
            res.data[i].delete = true;
          }
          res.data[i].created_at = new Date(
            res.data[i].created_at
          ).toLocaleString();
        }
        $this.setData({
          listData: [...$this.data.listData, ...res.data],
          pageIndex: $this.data.pageIndex + 1
        });
        console.log(res);
      }
    );
  },
  onShow: function() {
    //加载内容
    const $this = this;
    this.setData({
      pageIndex: 1
    });
    util.request(
      "/activity",
      {
        id: $this.data.activity_id,
        user_id: $this.data.user
      },
      "GET",
      function(res) {
        res.data.created_at = new Date(res.data.created_at).toLocaleString();
        $this.setData({
          item: res.data
        });
        console.log(res.data);
      }
    );

    //加载评论
    util.request(
      "/comments",
      {
        pageSize: 10,
        pageIndex: $this.data.pageIndex,
        activity_id: $this.data.activity_id
      },
      "GET",
      function(res) {
        for (let i in res.data) {
          //查询是不是自己的评论
          if (res.data[i].user_id == $this.data.user) {
            res.data[i].delete = true;
          }
          res.data[i].created_at = new Date(
            res.data[i].created_at
          ).toLocaleString();
        }
        $this.setData({
          listData: res.data,
          pageIndex: $this.data.pageIndex + 1
        });
        console.log(res);
      }
    );
  }
});
