// 棋类 canvas实现
class GobangBoardCanvas {
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
      // 线框颜色
      borderColor: '#333'
    }, options.config)
    // 背景画布
    this.bgCanvas = null
    // 棋子画布
    this.chessCanvas = null
  }

  // 初始化
  init () {
    this.initMatrix()
    this.initCanvas()
    this.createBox()
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
    let { row, col } = this.config
    for(let x = 0; x < col; x++) {
        matrix[x] = []
        for(let y = 0; y < row; y++) {
            // 虚拟棋盘
            matrix[x][y] = 0
        }
    }
    this.matrix = matrix
  }

  // 创建所需画布
  initCanvas () {
    const { size, row, col } = this.config
    // 创建棋盘画布
    let bgCanvas = document.createElement('canvas')
    bgCanvas.setAttribute('width', size * col)
    bgCanvas.setAttribute('height', size * row)
    this.el.appendChild(bgCanvas)
    this.bgCanvas = bgCanvas.getContext("2d")

    // 创建棋子画布
    let chessCanvas = document.createElement('canvas')
    chessCanvas.setAttribute('width', size * col + size / 2)
    chessCanvas.setAttribute('height', size * row + size / 2)
    chessCanvas.className = 'absolute'
    this.el.appendChild(chessCanvas)
    this.chessCanvas = chessCanvas.getContext("2d")
  }

  // 绘制棋盘
  createBox () {
    const { size, row, col, borderColor } = this.config
    let context = this.bgCanvas
    context.lineWidth = 1
    context.strokeStyle  = borderColor
    context.beginPath()
    for (let i = 0; i < row; i++) {
      // 横线绘制
      context.moveTo(size, size + i * size)
      context.lineTo(size * row, size + i * size)
    }
    for (let i = 0; i < col; i++) {
      // 竖线绘制
      context.moveTo(size + i * size, size)
      context.lineTo(size + i * size, size * row)
    }
    context.stroke()
  }

  // 绑定点击事件
  listenOnClick () {
    this.el.onclick = e => {
      const { offsetX, offsetY } = e
      const { size } = this.config
      // console.log(Math.round(offsetX / size), Math.round(offsetY / size))
      const x = Math.round(offsetX / size) - 1
      const y = Math.round(offsetY / size) - 1
      // 当前位置已经有子，不可再落
      if(this.matrix[x][y] !== 0) {
        return false
      }
      // 保证落子时历史记录与当前步数相同
      this.history.length = this.currStep
      this.setMatrix(x, y)
      // 存储历史记录
      this.history.push({
        x: x,
        y: y,
        role: this.role
      })
    }
  }

  // 解绑点击事件
  unsintenOnClick () {
    this.el.onclick = null
  }

  // 设置棋子
  setMatrix (x, y, isback = false) {
    // 虚拟棋盘落子
    this.matrix[x][y] = this.role
    // ui棋盘落子
    this.drawChess(x, y, isback)
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
      this.matrix[x][y] = 0
      this.currStep--
    }
    // 切换角色
    this.role = this.role === 1 ? 2 : 1
  }

  // 绘制一个棋子
  drawChess (x, y, isback) {
    const {size} = this.config
    // 计算绘制棋子位置
    const arcPosX = size + x * size
    const arcPosY = size + y * size

    // 获取上下文
    const context = this.chessCanvas
    if (isback) {
      context.clearRect(arcPosX - (size / 2), arcPosY - (size / 2), size, size)
      return
    }
    context.beginPath()

    // 设置颜色
    context.fillStyle = 'black'
    if (this.role != 1) {
      context.fillStyle = 'white'
    }

    // 开始绘制并填充
    context.arc(arcPosX, arcPosY, size / 2 - 4, 0, Math.PI * 2, true)
    context.stroke()
    context.fill()
  }

  // 悔棋
  goback () {
    const prev = this.history[this.currStep - 1]
    if (!prev) {
      return false
    }
    const { x, y, role } = prev
    this.setMatrix(x, y, true)
  }

  // 撤销悔棋
  unGoback () {
    const next = this.history[this.currStep]
    if(!next) {
      return false
    }
    const { x, y, role } = next
    this.setMatrix(x, y)
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