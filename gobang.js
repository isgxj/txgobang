// 控制器类
class Gobang {
  constructor (options) {
    this.gobang = null
    this.time = 0
    this.timeId = null
    this.timeEl = options.timeEl
    this.init(options.ops)
  }
  init (ops) {
    this.dom = new GobangBoardDom(ops)
    this.canvas = new GobangBoardCanvas(ops)
    this.gobang = this.dom
  }
  start () {
    this.stop()
    this.timeStart()
    this.gobang.init()
  }
  stop () {
    // 清除定时器
    this.time = 0
    this.timeId && clearInterval(this.timeId)
    this.gobang.stop()
  }
  goback () {
    this.gobang.goback()
  }
  unGoback () {
    this.gobang.unGoback()
  }
  toogleCtl () {
    this.gobang = this.gobang == this.dom ? this.canvas : this.dom
    this.start()
  }
  // 开始计时
  timeStart () {
    this.timeId = setInterval(() => {
      if (this.gobang.el.onclick === null) {
        clearInterval(this.timeId)
        return
      }
      this.time++
      this.timeEl.innerText = this.time
    }, 1000)
  }
  getRole () {
    const roleName = this.gobang.role === 1 ? '黑棋' : '白棋'
    return roleName
  }
}
