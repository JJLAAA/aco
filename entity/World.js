// 环境
var Position = require("./Position.js");

// 构造函数
function World(width, height, distance) {
    this.map = [];
    this.width = width;
    this.height = height;
    this.distance = distance;
    this.checkList = [];
    this.selectedPosition = null;
    this.xl = parseInt(width / distance);
    this.yl = parseInt(height / distance);
    // 执行环境初始化
    this._init();

}

// 静态变量
World.BASE_PHEROMONE = 1; // 基础信息素
World.CHANGE_MAX_VALUE = 0.02; // 蚂蚁下一步方向的突变概率
World.ANT_NUMBER = 50; // 蚂蚁数量


// 可调参数--在_init函数中配置
World.volatile = 0; // 挥发参数
World.baseHomePheromone = 0; // 家相关信息素起始值
World.baseFoodPheromone = 0; // 食物相关信息素起始值

World.minPheromone = 0; // 最小信息素值
World.maxPheromoneValue = 0; // 最大信息素值
// TODO:?
World.showPheromoneType = 0; // 显示那种信息素的分布

// 环境初始化
World.prototype._init = function () {

    var maxLength = parseInt(Math.sqrt(this.xl * this.xl + this.yl * this.yl));

    World.baseHomePheromone = maxLength * World.BASE_PHEROMONE;
    World.baseFoodPheromone = maxLength * World.BASE_PHEROMONE;
    World.minPheromone = World.BASE_PHEROMONE;
    World.volatile = World.BASE_PHEROMONE / 2;
    World.maxPheromoneValue = World.baseHomePheromone;
    // TODO:?
    World.showPheromoneType = Position.P_TYPE_HOME;

    console.log("World.volatile", World.volatile);
    console.log("World.baseHomePheromone", World.baseHomePheromone);
    console.log("World.baseFoodPheromone", World.baseFoodPheromone);
    console.log("World.minPheromone", World.minPheromone);
    console.log("World.minPheromone", World.showPheromoneType);

    // 初始化格子
    for (var i = 0; i < this.xl; i++) {
        this.map[i] = [];
        for (var j = 0; j < this.yl; j++) {
            this.map[i][j] = new Position(this, i, j);
        }
    }

    // var foodX=2;
    // var foodY=5;
    // this.map[foodX][foodY]=new Position(this,foodX,foodY,Number.MAX_VALUE,0,Position.TYPE_FOOD);
    // this.map[foodX][foodY].showFood();

    // foodX=4;
    // foodY=12;
    // this.map[foodX][foodY]=new Position(foodX,foodY,Number.MAX_VALUE,0,Position.TYPE_FOOD);
    // this.map[foodX][foodY].showFood();

    // foodX=parseInt(this.xl/2);
    // foodY=0;
    // this.map[foodX][foodY]=new Position(this,foodX,foodY,Number.MAX_VALUE,0,Position.TYPE_FOOD);
    // this.map[foodX][foodY].showFood();

    // 初始化蚂蚁巢穴的位置所在的格子（正中央）
    var homeX = parseInt(this.xl / 2);
    var homeY = parseInt(this.yl / 2);
    this.map[homeX][homeY] = new Position(this, homeX, homeY, 0, Number.MAX_VALUE, Position.TYPE_HOME);
    // 显示蚁穴
    this.map[homeX][homeY].showHome();

    var that = this;

    // 点击格子，设置格子类型的效果
    $("#selectPlane").click(function () {
        $("#innerSelectPlane").removeClass("scaleOutAnim");
        $("#selectPlane").css({
            display: "none"
        });
    });
    $("#innerSelectPlane .food").click(function () {
        if (that.selectedPosition != null) {
            // 设置当前格子为食物格子
            that.selectedPosition.changeType(Position.TYPE_FOOD);
        }
    });
    $("#innerSelectPlane .barrier").click(function () {
        if (that.selectedPosition != null) {
            // 设置当前格子为障碍物格子
            that.selectedPosition.changeType(Position.TYPE_BARRIER);
        }
    });
}


World.prototype.clickPosition = function (position) {
    this.selectedPosition = position;
    var height = 30;
    var width = 60;
    var left = 0;
    var top = 0;
    if (position.y * 20 > height * 1.5) {
        top = position.y * 20 - height;
    } else {
        top = position.y * 20 + height;
    }
    if (position.x * 20 > width / 2) {
        left = position.x * 20 - width / 2 + 10;
    } else if ((this.xl - position.x) * 20 < width / 2) {
        left = position.x * 20 - width;
    } else {
        left = 0;
    }
    $("#selectPlane").css({
        display: "block"
    });
    $("#innerSelectPlane").css({
        top: top,
        left: left
    });
    $("#innerSelectPlane").addClass("scaleOutAnim");
}

World.prototype.addCheckList = function (position) {
    var insertIndex = this._getCheckedIndex(position);
    if (insertIndex >= 0) {
        this.checkList.splice(insertIndex, 1);
    }
    this.checkList.push(position);
};

World.prototype._getCheckedIndex = function (position) {
    for (var i = 0; i < this.checkList.length; i++) {
        if (position == this.checkList[i]) {
            return i;
        }
    }
    return -1;
};

// 环境信息素的渲染
World.prototype.volatitlePheromone = function () {
    var max = 0;
    for (var i = 0; i < this.checkList.length; i++) {
        var position = this.map[this.checkList[i].x][this.checkList[i].y];
        if (position.type == Position.TYPE_NORMAL && position.getP(World.showPheromoneType) > max) {
            max = position.getP(World.showPheromoneType);
        }
        position.volatitlePheromone(World.volatile);
        position.showPheromone(World.maxPheromoneValue, World.showPheromoneType);
    }
}

World.prototype.getPosition = function (x, y) {
    return this.map[x][y];
}

module.exports = World;
