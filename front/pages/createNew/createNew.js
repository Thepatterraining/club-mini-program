const util = require("../../utils/util.js");

Page({
  title: function(e) {
    this.setData({
      title: e.detail.value
    });
  },

  content: function(e) {
    this.setData({
      content: e.detail.value
    });
  },

  create: function() {
    const $this = this;
    const user = wx.getStorageSync("login");
    if (!user) {
      return wx.showToast({
        title: "请登录",
        icon: "none"
      });
    }
    util.request(
      "/new",
      {
        title: $this.data.title,
        content: $this.data.content,
        author: user.id
      },
      "POST",
      function(res) {
        console.log(res);
        if (res.code == 0) {
          wx.showToast({
            title: "发布成功"
          });

          wx.navigateBack({
            delta: 1
          });
        }
      }
    );
  }
});
