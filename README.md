# txgobang  
##腾讯面试五子棋 
  支持dom渲染和canvas渲染切换  
  支持悔棋和撤销悔棋  
  
  
使用方式  
  一、引入css  
  二、引入三个js  
    1、dom方式实现的五子棋类GobangBoardDom.js  
    2、canvas方式实现的五子棋类GobangBoardCanvas.js  
    3、游戏控制的类Gobang.js  
      
游戏控制器初始化  
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
