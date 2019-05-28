const util = require("../../utils/util.js");

Page({
  register: function() {
    console.log(this.data);
    //判断是否输入
    if (!this.data.userName) {
      return wx.showToast({
        title: "请输入用户名",
        icon: "none"
      });
    }

    if (!this.data.pwd) {
      return wx.showToast({
        title: "请输入密码",
        icon: "none"
      });
    }

    if (!this.data.newPwd) {
      return wx.showToast({
        title: "请再次输入密码",
        icon: "none"
      });
    }

    //判断两次密码是否一致
    if (this.data.pwd !== this.data.newPwd) {
      return wx.showToast({
        title: "两次密码不一致",
        icon: "none"
      });
    }

    console.log(123);

    let { userName, pwd } = this.data;

    const res = util.request(
      "/register",
      {
        name: userName,
        pwd: pwd
      },
      "POST",
      function(res) {
        console.log(res.data);
        if (res) {
          //用户注册成功
          //跳转到登陆页面
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
      }
    );

    console.log("tttt");
  },

  inputUser: function(e) {
    this.setData({
      userName: e.detail.value
    });
  },

  inputPwd: function(e) {
    this.setData({
      pwd: e.detail.value
    });
  },

  inputNewPwd: function(e) {
    this.setData({
      newPwd: e.detail.value
    });
  }
});
