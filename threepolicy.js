var createThreePolicy = function (name, regs, type) {
    var cacheName = name + "_reg";
    sessionStorage[cacheName] = "";

    var register = function () {
        var watch = findWatch(name);
        watch.policies.push(policy);
    };

    var compare = function (ns, fiveNumber) {
        return !(ns.indexOf(fiveNumber[0]) > -1 && ns.indexOf(fiveNumber[1]) > -1);
    };

    var compareAny = function (ns, fiveNumber) {
        for (var index in fiveNumber) {
            if (ns.indexOf(fiveNumber[index]) > -1) {
                return true;
            }
        }

        return false;
    };

    var policy = {
        register: register,
        isRunning: false,
        stoping: false,
        bias: 1,
        stopping: false,
        right: 0,
        wins: 0,
        tryStop: function () {
            if (policy.bias === 1 && policy.isRunning === false) {
                policy.stop = true;
                return;
            }

            policy.stopping = true;
        },
        check: function (watch, newData) {
            if (watch === null) {
                return;
            }

            if (policy.isRunning === false) {
                return;
            }

            policy.isRunning = false;
            var ns = [];
            for (var s = policy.i; s < policy.i + 3; s++) {
                var n1 = newData.ZJHM.split(',')[s];
                ns.push(n1);
            }

            var isRight = compareAny(ns, policy.nums);

            if (isRight) {
                policy.wins++;
                batchWins++;
                console.logex("策略" + name + "正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
                sessionStorage[cacheName] = sessionStorage[cacheName] + "V";
            }
            else {
                console.logex("策略" + name + "被终结。");
                sessionStorage[cacheName] = sessionStorage[cacheName] + "X";
            }

            if (sessionStorage[cacheName].length > 20) {
                var temp = sessionStorage[cacheName];
                sessionStorage[cacheName] = temp.substr(temp.length - 20, 20);
            }
        },
        tryStart: function (watch, array, newData) {
            if (policy.isRunning) {
                return;
            }

            var matchItem = array;
            policy.bias = 1;
            policy.CP_QS = newData.CP_QS;
            policy.isRunning = true;
            policy.i = matchItem.index;
            policy.nums = matchItem.nums;

            console.logex("策略" + name + "符合条件！当前倍数:" + policy.bias + "位置：" + matchItem.index);
            if (policy.stop === true || policy.stoping === true) {
                console.logex("策略" + name + "未下注！");
                return;
            }

            var strs = sessionStorage[cacheName];
            for (var idx in regs) {
                if (strs.match(regs[idx]) != null) {
                    console.logex("策略" + name + "满足条件" + regs[idx]);
                    break;
                }
            }

            // doFourBet(matchItem.index, matchItem.nums, 1, (parseInt(newData.CP_QS) + 1) + "", type);
        }
    };

    window.policies.push(policy);
};

(function () {
    var reges1 = ["VX{3,3}$", "VXVXVX$", "VX{2,2}VX{2,2}VX{2,2}$"];

    createThreePolicy("threeBaoZi1", reges1);
    createThreePolicy("threeBaoZi2", reges1);
    createThreePolicy("threeBaoZi3", reges1);
})();