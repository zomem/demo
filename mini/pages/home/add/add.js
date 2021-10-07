
const app = getApp()


Page({
  data: {
    title: '',
    coverUrl: '',
    coverPath: '',
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    html: '',
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)
    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.uploadFile({
          filePath: res.tempFilePaths[0],
          name: 'file',
          url: app.config.api + '/upload/articles',
          success: ({data}) => {
            let coverData = JSON.parse(data)
            that.editorCtx.insertImage({
              src: coverData.url,
              data: {
                id: 'abcd',
                role: 'god'
              },
              width: '80%',
              success: function () {
                console.log('insert image success')
              }
            })
          }
        })
      }
    })
  },

  editor_input(e){
    this.setData({
      html: e.detail.html
    })
  },

  onTitleChange(e){
    this.setData({
      title: e.detail.value
    })
  },

  uploadCoverimg(){
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.uploadFile({
          filePath: res.tempFilePaths[0],
          name: 'file',
          url: app.config.api + '/upload/articles',
          success: ({data}) => {
            let coverData = JSON.parse(data)
            console.log('封面上传：', coverData)
            that.setData({
              coverPath: coverData.path,
              coverUrl: coverData.url
            })
          }
        })
      }
    })
  },

  addOne(){
    let {title, coverPath, html} = this.data
    console.log('title, c, f', title, coverPath, html)

    wx.request({
      url: app.config.api + '/articles/add',
      method: 'POST',
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('TOKEN')}`
      },
      data: {
        title: title,
        cover_url: coverPath,
        html: html
      },
      success: ({data}) => {
        console.log('dddddddd', data)
      }
    })
  }
})
