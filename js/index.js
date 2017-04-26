/** 难点：
 * 赢法数组：记录了五子棋所有的赢法，三维数组
 * 每一种赢法的统计数组，一维数组
 * 如何判断胜负
 * 计算机落子规则
 */

// 对手是谁？
var rival;
var localAI = localStorage.getItem("rival");
if (localAI) {
  rival = localAI;
} else {
  rival = "people";
}

var chessBoard = [];
var me = true; // 初始为黑棋
var over = false; // 判断当前棋局是否结束

// 赢法数组
var wins = [];

// 赢法的统计数组
var myWin = [], computerWin = [];

// 将棋盘上所有的索引点初始值规划为0
for (let i = 0; i < 15; i++) {
  chessBoard[i] = [];
  for (let j = 0; j < 15; j++) {
    chessBoard[i][j] = 0;
  }
}

for (let i = 0; i < 15; i++) {
  wins[i] = [];
  for (let j = 0; j < 15; j++) {
    wins[i][j] = [];
  }
}

var count = 0; // 赢法种类的索引
// 所有横线的赢法
for (let i = 0; i < 15; i++) {
  for (let j = 0; j < 11; j++) {
    // wins[0][0][0] = true
    for (let k = 0; k < 5; k++) {
      wins[i][j + k][count] = true;
    }
    count++;
  }
}
// 所有竖线的赢法
for (let i = 0; i < 15; i++) {
  for (let j = 0; j < 11; j++) {
    // wins[0][0][0] = true
    for (let k = 0; k < 5; k++) {
      wins[j + k][i][count] = true;
    }
    count++;
  }
}
// 所有斜线的赢法
for (let i = 0; i < 11; i++) {
  for (let j = 0; j < 11; j++) {
    // wins[0][0][0] = true
    for (let k = 0; k < 5; k++) {
      wins[i + k][j + k][count] = true;
    }
    count++;
  }
}
// 所有反斜线的赢法
for (let i = 0; i < 11; i++) {
  for (let j = 14; j > 3; j--) {
    // wins[0][0][0] = true
    for (let k = 0; k < 5; k++) {
      wins[i + k][j - k][count] = true;
    }
    count++;
  }
}

// 初始化统计数组
for (let i = 0; i < count; i++) {
  myWin[i] = 0;
  computerWin[i] = 0;
}

var chess = document.getElementById("chess");
// getContext返回一个用于在画布上绘图的环境对象，该对象导出一个二维绘图的API，其中2d（二维绘图）是唯一的参数
var context = chess.getContext("2d");
// console.log(context);

// 设置画笔颜色
context.strokeStyle = "#444";

var logo = new Image();
// 该路径为绝对路径，默认为当前文件夹下
logo.src = "img/wood.jpg";
// 需要图片加载完成之后再操作
logo.onload = function() {
  // drawImage(img, [sx, sy, swidth, sheight,] x轴, Y轴, [width], [height]), 带s的表示开始剪切的XX
  context.drawImage(logo, 0, 0, 450, 450);
  drawChessBoard();
};

var drawChessBoard = function() {
  // 绘制一个27*27的方格棋盘
  for (let i = 0; i < 15; i++) {
    // 画竖线
    context.moveTo(15 + 30 * i, 15);
    context.lineTo(15 + 30 * i, 435);
    context.stroke();
    // 画横线
    context.moveTo(15, 15 + 30 * i);
    context.lineTo(435, 15 + 30 * i);
    context.stroke();
  }
};

// i,j为索引，me表示白棋/黑棋(false/true)
var oneStep = function(i, j, me) {
  // 开始路径
  context.beginPath();
  // arc(x, y, r, 起始角度(三点钟方向为0°), 结束角度, false/true(顺时针/逆时针)) 方法创建弧/曲线（用于创建圆或部分圆）
  context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
  context.closePath();
  // 创建放射状/圆形渐变对象
  // createLinearGradient(开始圆的x坐标, 开始圆的y坐标, 开始圆的半径, 结束圆的x坐标, 结束圆的y坐标, 结束圆的半径)
  var gradient = context.createRadialGradient(
    15 + i * 30 + 2, // 棋子的光滑面向右上偏移2px
    15 + j * 30 - 2,
    13,
    15 + i * 30 + 2,
    15 + j * 30 - 2,
    0
  );
  if (me) {
    gradient.addColorStop(0, "#0a0a0a");
    gradient.addColorStop(1, "#636766");
  } else {
    gradient.addColorStop(0, "#d1d1d1");
    gradient.addColorStop(1, "#f9f9f9");
  }

  context.fillStyle = gradient;
  context.fill();
};

chess.onclick = function(e) {
  if (over || (!me && rival === "ai")) return;
  var x = e.offsetX, y = e.offsetY;
  var i = Math.floor(x / 30), j = Math.floor(y / 30);

  // 判断点击的索引点是否为0(用户是否点击过)
  if (chessBoard[i][j] === 0) {
    oneStep(i, j, me);
    if (rival === "ai") {
      chessBoard[i][j] = 1;
    } else {
      if (me) {
        chessBoard[i][j] = 1;
      } else {
        chessBoard[i][j] = 2;
      }
      me = !me;
    }
    // 判断棋子是否在同一个赢法上积累了5次，先累积5次的赢
    for (let k = 0; k < count; k++) {
      if (wins[i][j][k]) {
        if (rival === "ai") {
          myWin[k]++;
        } else {
          if (chessBoard[i][j] === 1) {
            myWin[k]++;
          } else {
            computerWin[k]++;
          }
        }
        computerWin[k] = 6;
        if (myWin[k] === 5) {
          setTimeout(function() {
            if (window.confirm("黑子赢了！")) {
              clear();
            }
            over = true;
          }, 100);
        }

        if (rival === "people") {
          if (computerWin[k] === 5) {
            setTimeout(function() {
              if (window.confirm("白子赢了！")) {
                clear();
              }
              over = true;
            }, 100);
          }
        }
      }
    }

    if (rival === "ai") {
      // 调用AI
      if (!over) {
        me = !me;
        computerAI();
      }
    }
  }
};

var computerAI = function() {
  var myScore = [];
  var computerScore = [];
  var max = 0;
  var u = 0, v = 0;

  for (let i = 0; i < 15; i++) {
    myScore[i] = [];
    computerScore[i] = [];
    for (let j = 0; j < 15; j++) {
      myScore[i][j] = 0;
      computerScore[i][j] = 0;
    }
  }

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (chessBoard[i][j] === 0) {
        for (let k = 0; k < count; k++) {
          if (wins[i][j][k]) {
            if (myWin[k] === 1) {
              myScore[i][j] += 200;
            } else if (myWin[k] === 2) {
              myScore[i][j] += 400;
            } else if (myWin[k] === 3) {
              myScore[i][j] += 2000;
            } else if (myWin[k] === 4) {
              myScore[i][j] += 10000;
            }
            if (computerWin[k] === 1) {
              computerScore[i][j] += 220;
            } else if (computerWin[k] === 2) {
              computerScore[i][j] += 420;
            } else if (computerWin[k] === 3) {
              computerScore[i][j] += 2100;
            } else if (computerWin[k] === 4) {
              computerScore[i][j] += 20000;
            }
          }
        }

        if (myScore[i][j] > max) {
          max = myScore[i][j];
          u = i;
          v = j;
        } else if (myScore[i][j] === max) {
          if (computerScore[i][j] > computerScore[u][v]) {
            u = i;
            v = j;
          }
        }

        if (computerScore[i][j] > max) {
          max = computerScore[i][j];
          u = i;
          v = j;
        } else if (computerScore[i][j] === max) {
          if (myScore[i][j] > myScore[u][v]) {
            u = i;
            v = j;
          }
        }
      }
    }
  }
  oneStep(u, v, false);
  chessBoard[u][v] = 2;

  for (let k = 0; k < count; k++) {
    if (wins[u][v][k]) {
      computerWin[k]++;
      myWin[k] = 6;
      if (computerWin[k] === 5) {
        setTimeout(function() {
          if (window.confirm("白子赢了！")) {
            clear();
          }
          over = true;
        }, 100);
      }
    }
  }

  if (!over) {
    me = !me;
  }
};

var clear = function() {
  context.restore();
  location.reload();
};

var people = document.getElementsByClassName("people")[0];
var AI = document.getElementsByClassName("ai")[0];
var restart = document.getElementsByClassName("restart")[0];
var changeFace = document.getElementsByClassName("changeFace")[0];

people.onclick = function() {
  if (rival === "ai") {
    localStorage.setItem("rival", "people");
    clear();
  }
};

AI.onclick = function() {
  if (rival === "people") {
    localStorage.setItem("rival", "ai");
    clear();
  }
};

restart.onclick = function() {
  clear();
};

// changeFace.onclick = function() {
//   var imgArr = ["wood.jpg", "he.jpg"];
//   logo.src = "img/" + imgArr[Math.floor(Math.random() * 3)];
// 需要图片加载完成之后再操作
// logo.onload = function() {
// drawImage(img, [sx, sy, swidth, sheight,] x轴, Y轴, [width], [height]), 带s的表示开始剪切的XX
//     context.drawImage(logo, 0, 0, 450, 450);
//     drawChessBoard();
//   };
// };
