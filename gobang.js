// 控制器类
class Gobang {
  constructor (options) {
    // 当前游戏实例
    this.gobang = null
    // 游戏时间
    this.time = 0
    // 游戏时间定时器id
    this.timeId = null
    // 游戏时间显示dom
    this.timeEl = options.timeEl
    // 初始化
    this.init(options.ops)
  }
  init (ops) {
    // 分别实例化两个对象并储存起来
    this.dom = new GobangBoardDom(ops)
    this.canvas = new GobangBoardCanvas(ops)
    this.gobang = this.dom
  }
  // 开始游戏
  start () {
    // 先停止并清空之前的数据
    this.stop()
    // 开始计时
    this.timeStart()
    this.gobang.init()
  }
  // 停止游戏
  stop () {
    // 清除定时器
    this.time = 0
    this.timeId && clearInterval(this.timeId)
    this.gobang.stop()
  }
  // 悔棋
  goback () {
    this.gobang.goback()
  }
  // 撤销悔棋
  unGoback () {
    this.gobang.unGoback()
  }
  // 切换渲染方式
  toogleCtl () {
    this.gobang = this.gobang == this.dom ? this.canvas : this.dom
    this.start()
  }
  // 计时
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
  // 获取下一步角色
  getRole () {
    const roleName = this.gobang.role === 1 ? '黑棋' : '白棋'
    return roleName
  }
}
