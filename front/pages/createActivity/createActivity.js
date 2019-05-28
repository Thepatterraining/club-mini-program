const util = require("../../utils/util.js");

Page({
  data: {
    imgs: [],
    update: false,
    activity: {
      approval: false
    }
  },

  onLoad: function(options) {
    const user = wx.getStorageSync("login");
    this.setData({
      user_id: user.id
    });

    console.log(options.id);
    if (options.id) {
      const $this = this;
      //查询活动信息
      util.request(
        "/activity",
        {
          id: options.id,
          user_id: user.id
        },
        "GET",
        function(res) {
          console.log(typeof res.data);
          res.data.startDate = new Date(
            res.data.startDate
          ).toLocaleDateString();
          res.data.endDate = new Date(res.data.endDate).toLocaleDateString();
          $this.setData({
            activity: res.data,
            update: "ture"
          });
        }
      );

      //查询图片信息
      util.request("/activity_imgs/" + options.id, {}, "GET", function(res) {
        console.log(res.data);
        $this.setData({
          imgs: res.data
        });
      });
    }
  },

  updateHandle: function() {
    const $this = this;
    util.request(
      "/activity/" + $this.data.activity.id,
      {
        ...$this.data.activity,
        imgs: $this.data.imgs
      },
      "PUT",
      function(res) {
        console.log(res.data);
        wx.showToast({
          title: "修改成功"
        });
      }
    );
  },

  upload: function() {
    const $this = this;
    wx.chooseImage({
      success: function(res) {
        const paths = res.tempFilePaths;

        const user = wx.getStorageSync("login");

        if (!user) {
          return wx.showToast({
            title: "请登录",
            icon: "none"
          });
        }

        //上传
        for (let i in paths) {
          wx.uploadFile({
            url: "http://localhost:3000/uploadActivity",
            filePath: paths[i],
            name: "activity",
            success: function(res) {
              console.log(res.data);
              console.log(typeof res.data);
              $this.setData({
                imgs: [...$this.data.imgs, JSON.parse(res.data).data]
              });
              //刷新页面
              if (getCurrentPages().length != 0) {
                getCurrentPages()[getCurrentPages().length - 1].onShow();
              }
            }
          });
        }
      }
    });
  },

  changeStartDate: function(e) {
    this.setData({
      activity: { ...this.data.activity, startDate: e.detail.value }
    });
  },

  changeEndDate: function(e) {
    this.setData({
      activity: { ...this.data.activity, endDate: e.detail.value }
    });
  },

  create: function() {
    const $this = this;
    util.request(
      "/activity",
      {
        ...$this.data.activity,
        imgs: $this.data.imgs,
        user_id: $this.data.user_id
      },
      "POST",
      function(res) {
        console.log(res.data);
        wx.showToast({
          title: "申请成功"
        });
      }
    );
  },

  inputName: function(e) {
    this.setData({
      activity: { ...this.data.activity, name: e.detail.value }
    });
  },

  inputContent: function(e) {
    this.setData({
      activity: { ...this.data.activity, content: e.detail.value }
    });
  },

  inputPlace: function(e) {
    this.setData({
      activity: { ...this.data.activity, place: e.detail.value }
    });
  },

  inputAmount: function(e) {
    this.setData({
      activity: { ...this.data.activity, amount: e.detail.value }
    });
  },

  inputNumber: function(e) {
    this.setData({
      activity: { ...this.data.activity, number: e.detail.value }
    });
  }
});
