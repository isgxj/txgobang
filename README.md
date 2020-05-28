# txgobang  五子棋 

  支持dom渲染和canvas渲染切换  
  支持悔棋、撤销悔棋  


  [线上体验地址](https://www.isgxj.com/txgobang/)  
  
  
## 使用方式  
  一、引入base.css  
  二、引入三个js  
    1、dom方式实现的五子棋类 GobangBoardDom.js  
    2、canvas方式实现的五子棋类 GobangBoardCanvas.js  
    3、游戏控制的类 Gobang.js  
      
## 初始化  
```javascript  
  // 配置参数  
  const ops = {  
    el: document.getElementById('app'),  
    config: {  
      // 方格大小  
      size: 40,  
      // 行数  
      row: 16,  
      // 列数  
      col: 16,  
      // 几子棋  
      number: 5  
    }  
  }  
  // 实例化游戏控制器  
  const ctl = new Gobang({  
    ops,  
    timeEl: document.getElementById('time')  
  })  
  // 开始游戏  
  ctl.start()  
 ```

## 判断输赢的算法  
```javascript  
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
