var app = getApp()

/**
 * url：地址
 * data：请求数据，json对象
 * callBack：回调函数
 * authorize：是否验证授权
 */
function apiGet(url, data, callBack, authorize = true) {
  request(url, data, callBack, authorize, 'GET')
}

function apiPost(url, data, callBack, authorize = true) {
  request(url, data, callBack, authorize, 'POST')
}

function request(url, data, callBack, authorize = true, method) {
  wx.showLoading()
  if (authorize) {
    var access_token = app.globalData.token ? app.globalData.token : wx.getStorageSync('access_token');
    if (!access_token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
      return
    }
    var req_url = app.globalData.host + url + '?access-token=' + access_token
  } else {
    var req_url = app.globalData.host + url
  }

  wx.request({
    url: req_url,
    data: data,
    method: method,
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      wx.hideLoading()

      if (res.data.code == 0 && res.data.status == 401) {
        wx.showToast({
          title: '请先授权登录',
          icon: 'none'
        })
        setTimeout(function() {
          wx.navigateTo({
            url: '/pages/auth/auth',
          })
        }, 800)
      } else {
        return typeof callBack == "function" && callBack(res)
      }
    },
    fail: function(res) {
      wx.hideLoading()
      // console.log(res)
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 1000
      });
    },
  })
}

module.exports = {
  apiGet: apiGet,
  apiPost: apiPost,
}

/*
使用方法
var http = require('../../utils/http.js')

http.apiPost('wxs/user/info', {}, function(res) {
  console.log(res)
  if (res.code == 0) {
    
  } else {
    wx.showToast({
      title: '请求错误',
      icon: 'none',
      duration: 1000
    });
  }
},true)

http.apiGet('coupons/my-coupons', {}, function(res) {
  console.log(res)
  if (res.code == 0) {
    
  } else {
    wx.showToast({
      title: '请求错误',
      icon: 'none',
      duration: 1000
    });
  }
},true)
 */