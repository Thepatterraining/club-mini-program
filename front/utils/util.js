const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const host = "http://localhost:3000"

const request = function (url, data, method, cb) {
  var header = {
    'content-type': 'application/json; charset=utf-8',
    'cookie': wx.getStorageSync("sessionid")
  };
  return wx.request({
    header: header,
    url: host + url,
    data: data,
    method: method,
    success: function(res) {
      if (res.statusCode == 200 && res.data.code == 0) {
        var cookie = res.header["Set-Cookie"];
        if (cookie != null) {
          wx.setStorageSync("sessionid", res.header["Set-Cookie"]);
        }
        return typeof cb == "function" && cb(res.data)
      } else {
        if (typeof res.data == 'string') {
          wx.showToast({
            title: '服务器错误',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        
        // return typeof cb == "function" && cb(false)
      }
    },
    fail: function(res) {
      console.log("fail")
      console.log(res)
      return res
    }
  })
}

module.exports = {
  formatTime: formatTime,
  request: request
}
