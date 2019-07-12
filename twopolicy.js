sessionStorage["bet_multiple_2"] = 2;

var filterNumbers = function (n, numberArray) {
    if (n[0] == n[1]) {
        return true;
    }


    return numberArray.indexOf(n[0]) == - 1 || numberArray.indexOf(n[1]) == -1;
};


var filterAnyMatchNumbers = function (n, numberArray) {
    for (var ni in numberArray) {
        if (n.indexOf(numberArray[ni]) > - 1) {
            return true;
        }
    }

    return false;
};


var doTwoBet = function (betIndex, nums, bias, issueNumber, type) {

    var betNumberA = "";
    var betNumberB = "";
    var ca = 0;
    var cb = 0;

    var filters = [];
    if (typeof type == "undefined") {
        filters.push(filterFourNumbers);
    }
    else {
        filters.push(filterAnyMatchNumbers);
    }

    for (var i = 0; i < 100; i++) {
        var n = (i + '').padLeft('0', 2);
        var isMatch = true;
        for (var fi in filters) {
            var filter = filters[fi];
            if (filter(n, nums) === false) {
                isMatch = false;
                break;
            }
        }

        if (isMatch === false) {
            continue;
        }

        if (i < 50) {
            ca++;
            betNumberA += n + "$";
        }
        else {
            cb++;
            betNumberB += n + "$";
        }
    }

    var datas = [];
    var multiple = parseInt(sessionStorage["bet_multiple_2"], 10);
    var perMoney = multiple * 0.002;
    var indexes = getIndex(betIndex);
    var index = indexes[0] + "," + indexes[1];

    datas.push({
        "method_id": "120001",
        "number": index + "@" + betNumberA.substr(0, betNumberA.length - 1),
        "rebate_count": 80,
        "multiple": multiple + "",
        "mode": 3,
        "bet_money": (perMoney * ca).toFixed(3),
        "calc_type": "0"
    });

    datas.push({
        "method_id": "120001",
        "number": index + "@" + betNumberB.substr(0, betNumberB.length - 1),
        "rebate_count": 80,
        "multiple": multiple + "",
        "mode": 3,
        "bet_money": (perMoney * cb).toFixed(3),
        "calc_type": "0"
    });

    console.log("下注信息:");
    console.log(datas);
    window.betUtil.builderOrderParams(datas, issueNumber, 'twobet');

    //betInfo = [createBetInfo2(i, a, bias)];
    //console.log("下注信息:");
    //console.log(betInfo);
    //window.betUtil.builderOrderParams(betInfo, issueNumber);
};

var createTwoPolicy = function (name, cacheName) {
    var register = function () {
        var watch = findWatch(name);
        watch.policies.push(policy);
    };

    var compare = function (n1, n2, fiveNumber) {
        if (n1 == n2) {
            return true;
        }

        var isRight1 = fiveNumber.indexOf(n1) > -1;
        var isRight2 = fiveNumber.indexOf(n2) > -1;
        return (!isRight1 && isRight2) || (isRight1 && !isRight2) || (!isRight1 && !isRight2);
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
            var indexes = getIndex(policy.i);
            var n1 = newData.ZJHM.split(',')[indexes[0]];
            var n2 = newData.ZJHM.split(',')[indexes[1]];
            var isRight = compare(n1, n2, policy.nums);

            if (isRight) {
                policy.wins++;
                batchWins++;
                console.logex("策略" + name + "正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
            }
            else {
                sessionStorage[cacheName] = "1";
                console.logex("策略" + name + "被终结。");
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

            console.logex("策略" + name + "符合条件！当前倍数:" + policy.bias + "位置：" + matchItem.index );
            if (policy.stop === true || policy.stoping === true) {
                console.logex("策略" + name + "未下注！");
                return;
            }

            if (sessionStorage[cacheName] != "1") {
                console.logex("策略" + name + "未下注！");
                return;
            }

            doTwoBet(matchItem.index, matchItem.nums, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
};

(function () {
    createTwoPolicy("twolike", "twolike_start");
    createTwoPolicy("twomatch", "twomatch_start");
    createTwoPolicy("twomatch3", "twomatch3_start");
})();