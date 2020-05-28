// 棋类 dom实现
class GobangBoardDom {
  constructor (options) {
    // 棋盘dom
    this.el = options.el
    // 当前角色
    this.role = options.role || 1
    // 是否输赢
    this.winner = 0
    // 棋盘矩阵
    this.matrix = []
    // 历史记录
    this.history = []
    // 当前步数
    this.currStep = 0
    // 棋盘配置
    this.config = Object.assign({
      // 棋盘行数
      row: 20,
      // 棋盘列数
      col: 20,
      // 每格大小，单位px
      size: 40,
      // 几子棋
      number: 5,
      // 线类名
      lineClassName: 'line',
      // 棋子类名
      spanClassName: 'chess',
      // 黑棋类名
      balckClassName: 'black-chess',
      // 白棋类名
      whiteClassName: 'white-chess',
      // 已经下子类名
      activeClassName: 'checked'
    }, options.config)
  }

  // 初始化
  init () {
    this.initMatrix()
    this.listenOnClick()
  }

  // 停止
  stop () {
    this.unsintenOnClick()
    this.el.innerHTML = ''
  }

  // 初始化虚拟棋盘、ui棋盘
  initMatrix () {
    let matrix = []
    let boards = document.createElement('div')
    let { row, col, size } = this.config
    for(let x = 0; x < row; x++) {
        matrix[x] = []
        for(let y = 0; y < col; y++) {
            // 虚拟棋盘
            matrix[x][y] = 0
            // ul dom棋盘
            boards.appendChild(this.createBox(x, y))
        }
    }
    this.matrix = matrix
    boards.style.paddingTop = size + 'px'
    boards.style.paddingLeft = size + 'px'
    this.el.appendChild(boards)
  }

  // 绘制棋盘一个dom对象
  createBox (x, y) {
    // 边框线dom
    let line = document.createElement('div')
    line.className = this.config.lineClassName
    line.style.width = this.config.size + 'px'
    line.style.height = this.config.size + 'px'
    if (y == 0) {
      line.style.clear = 'both'
    }
    if (y == this.config.col - 1) {
      line.className += ' clearx'
    }
    if (x == this.config.row - 1) {
      line.className += ' cleary'
    }

    // 棋子dom
    let span = document.createElement('span')
    span.className = this.config.spanClassName
    span.innerText = x + ',' + y

    // 组合边框和棋子
    line.appendChild(span)
    return line
  }

  // 绑定点击事件
  listenOnClick () {
    this.el.onclick = e => {
      const { className, innerText} = e.target
      // 当前位置已经有子，不可再落
      if(className.includes(this.config.activeClassName) || !className.includes(this.config.spanClassName)) {
        return false
      }
      // 取出保存在dom中的坐标位置
      const [x, y] = innerText.split(',').map(i => Number(i))
      // 保证落子时历史记录与当前步数相同
      this.history.length = this.currStep
      this.setMatrix(e.target, x, y)
      // 存储历史记录
      this.history.push({
        x: x,
        y: y,
        role: this.role,
        el: e.target
      })
    }
  }

  // 解绑点击事件
  unsintenOnClick () {
    this.el.onclick = null
  }

  // 设置棋子
  setMatrix (el, x, y, isback = false) {
    // 虚拟棋盘落子
    this.matrix[x][y] = this.role
    // ui棋盘落子
    const { balckClassName, whiteClassName, activeClassName, spanClassName } = this.config
    let curClass = this.role === 1 ? balckClassName : whiteClassName
    el.className += ` ${activeClassName} ` + curClass
    // 判断是否有人胜出
    if (this.isWin(x, y)) {
      this.winner = this.role
      this.unsintenOnClick()
      const msg = this.role === 1 ? '黑棋赢了' : '白棋赢了'
      setTimeout(() => alert(msg), 1)
      console.log(msg)
      return
    }
    // 是否悔棋
    if (!isback) {
      // 不是悔棋，步数加
      this.currStep++
    } else {
      // 悔棋，修改ui，步数减
      el.className = spanClassName
      this.matrix[x][y] = 0
      this.currStep--
    }
    // 切换角色
    this.role = this.role === 1 ? 2 : 1
  }

  // 悔棋
  goback () {
    const prev = this.history[this.currStep - 1]
    if (!prev) {
      return false
    }
    const { x, y, role, el } = prev
    this.setMatrix(el, x, y, true)
  }

  // 撤销悔棋
  unGoback () {
    const next = this.history[this.currStep]
    if(!next) {
      return false
    }
    const { x, y, role, el } = next
    this.setMatrix(el, x, y)
  }

  // 判断输赢
  isWin (x, y) {
    let flag = false
    let res = []
    // 把四个方向的棋子收集起来，统一判断是否输赢
    res.push(this.matrix.map(item => item[y]))
    res.push(this.matrix[x])
    res.push(this.matrix.map((item, i) => {
      return item[y - (x - i)]
    }))
    res.push(this.matrix.map((item, i) => {
      return item[y + (x - i)]
    }))
    // 逐个判断是否输赢
    res.forEach(item => {
      if (this.isCount(item, this.role)) {
        flag = true
      }
    })
    return flag
  }

  // 判断一个数组中是否已经存在可以输赢的棋子数
  isCount (arr, role) {
    let count = 0
    let flag = false
    arr.forEach(item => {
      if (item === role && item !== undefined) {
        count++
        if (count >= this.config.number) {
          flag = true
        }
      } else {
        count = 0
      }
    })
    return flag
  }
}