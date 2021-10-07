// pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    list: [],
    basefile: app.config.file,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: app.config.api + '/articles/list',
      success: ({data}) => {
        console.log('list:::', data)
        this.setData({list: data})
      }
    })
  },

  navToDetail(e){
    wx.navigateTo({
      url: '/pages/home/detail/detail?aid=' + e.currentTarget.dataset.aid,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },


  login() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    let that = this
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: ({userInfo}) => {
        wx.login({
          success ({code}) {
            if (code) {
              wx.request({
                url: app.config.api + '/login/wechat',
                method: 'POST',
                data: {
                  code: code,
                  userInfo: {
                    nickName: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl,  
                  }
                },
                success: ({data}) => {
                  console.log('登录成功：', data)
                  wx.setStorageSync('TOKEN', data.token)
                  that.setData({
                    userInfo: data,
                    hasUserInfo: true
                  })
                }
              })
            }
          }
        })
      }
    })
    
    
  },

  navToAdd(){
    wx.navigateTo({
      url: '/pages/home/add/add',
    })
  },
})