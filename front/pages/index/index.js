//index.js
//获取应用实例
const util = require("../../utils/util.js");

const app = getApp();

Page({
  data: {
    motto: "Hello World",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    //首页轮播图
    banners: [],
    news: [],
    hiddenmodalput: true,
    user: 0
  },
  comment: function(e) {
    //评论
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      activity_id: e.currentTarget.dataset.activity
    });
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
          pid: 0,
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

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: "../logs/logs"
    });
  },
  onLoad: function() {
    const user = wx.getStorageSync("login");
    if (user) {
      this.setData({
        user: user.id
      });
    }
  },

  onShow: function() {
    const user = wx.getStorageSync("login");
    if (user) {
      this.setData({
        user: user.id
      });
    }

    const $this = this;
    //获取轮播图
    util.request(
      "/banners",
      {
        pageIndex: 1,
        pageSize: 10
      },
      "GET",
      function(res) {
        $this.setData({
          banners: res.data
        });
      }
    );

    //获取文章
    this.setData({
      newIndex: 1
    });
    util.request(
      "/news",
      {
        pageIndex: $this.data.newIndex,
        pageSize: 5
      },
      "GET",
      function(res) {
        console.log(res.data);
        for (let i in res.data) {
          res.data[i].created_at = new Date(
            res.data[i].created_at
          ).toLocaleString();
        }
        $this.setData({
          news: res.data,
          newIndex: $this.data.newIndex + 1
        });
      }
    );

    //加载列表
    this.setData({
      pageIndex: 1
    });
    util.request(
      "/activities",
      {
        pageSize: 10,
        pageIndex: $this.data.pageIndex,
        user_id: $this.data.user,
        filter: {
          push: true
        }
      },
      "GET",
      function(res) {
        for (let i in res.data) {
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

  onReachBottom: function() {
    //下拉请求更多数据
    const $this = this;
    util.request(
      "/activities",
      {
        pageSize: 10,
        pageIndex: $this.data.pageIndex,
        user_id: $this.data.user,
        filter: {
          push: true
        }
      },
      "GET",
      function(res) {
        for (let i in res.data) {
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

  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      hasUserInfo: true
    });
  }
  // right: function() {
  //   console.log(123);
  //   const $this = this;
  //   util.request(
  //     "/news",
  //     {
  //       pageIndex: $this.data.newIndex,
  //       pageSize: 5
  //     },
  //     "GET",
  //     function(res) {
  //       console.log(res.data);
  //       for (let i in res.data) {
  //         res.data[i].created_at = new Date(
  //           res.data[i].created_at
  //         ).toLocaleString();
  //       }
  //       $this.setData({
  //         news: [...$this.data.news, ...res.data],
  //         newIndex: $this.data.newIndex + 1
  //       });
  //     }
  //   );
  // }
});
