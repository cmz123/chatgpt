// index.ts
// 获取应用实例
const API_KEY = "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"
Page({
  data: {
    chatRecords: [] , //聊天记录的数组
    inputValue: '',
    scrollIntoView : 0 , //滚动到记录的id
    code:''
  },
  onQuestionInput(e: any) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  onQuestionSubmit() {
    const inputValue = this.data.inputValue
    if (!inputValue) {
      return
    }
    const chatRecords = this.data.chatRecords
    const newRecord = {
      id: chatRecords.length,
      //avatarUrl: '', // 发送者的头像
      type: 'send', // 消息类型，1 表示发送 2 表示接收
      message: inputValue // 消息内容
    }
    chatRecords.push(newRecord)
    this.setData({
      chatRecords,
      inputValue: '',
      scrollIntoView: newRecord.id
    })

    //以下为从chatgpt返回的数据
    wx.request({
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + API_KEY
      },
      data: {
        "model": "gpt-3.5-turbo",
        "messages": [{ "role": "user", "content": inputValue }]
      },
      success: (res: any) => {
        const newRecord = {
          id: chatRecords.length,
          //avatarUrl: 'images/chatgpt.jpeg', // 机器人头像
          type: 'receive', // 消息类型，'1' 表示发送，'2' 表示接收
          message: res.data.choices[0].message.content // 消息内容
          //message: res.data.choices[0].message
          //message: highlightedCode
        }
        chatRecords.push(newRecord)
        this.setData({
          chatRecords,
          scrollIntoView: newRecord.id
        })
      },
      fail: (res) => {
        console.log(res)
      }
    })
  }
})