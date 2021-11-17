// 入口文件
require("./lib/zepto.js");
require("./lib/grid.js");

// 加载蚂蚁行为规则与蚂蚁所处环境的交互行为规则
var Ant = require("./entity/Ant.js");
var World = require("./entity/World.js");
// var Position = require("./entity/Position.js");

// 匿名函数自执行
(function () {
    // 初始化画布
    function initGridBg() {
        var canvas = document.getElementById('gridBg');
        var ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(canvas.width, canvas.height, window.innerWidth, window.innerHeight);
        var opts = {
            distance: 20,
            lineWidth: 0.1,
            gridColor: "#fff",
            caption: false
        };
        new Grid(opts).draw(ctx);
    }

    // 执行仿真--蚂蚁开始活动
    function start() {
        // 初始化蚂蚁所在环境
        var world = new World(window.innerWidth, window.innerHeight, 20);
        var antList = [];
        var isRun = false;
        window.world = world;

        // 开始执行仿真
        function _run() {
            if (!isRun) {
                isRun = true;
                // 渲染环境信息素
                world.volatitlePheromone();
                // 不断的渲染蚂蚁，直到达到设置的数量
                if (antList.length < World.ANT_NUMBER) {
                    // 初始化蚂蚁
                    antList.push(new Ant(world));
                }
                // 渲染蚂蚁的运动
                for (var i = 0; i < antList.length; i++) {
                    antList[i].move();
                }
                isRun = false;
            }

            // 800毫秒执行一次仿真，或者说渲染
            var delay = 800;
            setTimeout(function () {
                _run();
            }, delay);
        }

        // 执行仿真
        _run();
    }

    // 初始化画布
    initGridBg();

    /*
     点击开始后，隐藏开始界面，直接展示画布，并开启仿真
     */
    $("#start").click(function () {
        $("#welcome").hide();
        start();
    });

})();