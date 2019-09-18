sessionStorage["bet_multiple_4"] = 3;
var filterFourNumbers = function (n, numberArray) {
	var cc = 0;
	for(var ni in numberArray)
	{
		if (n.indexOf(numberArray[ni]) > - 1)
		{
			cc++;
		}
	}
	
    return cc < numberArray.length;
};


var getFourIndex = function (index) {
    switch (index + "") {
        case "0":
            return [0, 1, 2, 3];
        case "1":
            return [1, 2, 3, 4];
    }
};

var doFourBet = function (betIndex, nums, bias, issueNumber, type) {
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

    for (var i = 0; i < 10000; i++) {
        var n = (i + '').padLeft('0', 4);
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

        if (i < 5000) {
            ca++;
            betNumberA += n + "$";
        }
        else {
            cb++;
            betNumberB += n + "$";
        }
    }

    var datas = [];
    var multiple = parseInt(sessionStorage["bet_multiple_4"], 10);
    var perMoney = multiple * 0.002;
    var indexes = getFourIndex(betIndex);
    var index = indexes[0] + "," + indexes[1] + "," + indexes[2] + "," + indexes[3];

    datas.push({
        "method_id": "140001",
        "number": index + "@" + betNumberA.substr(0, betNumberA.length - 1),
        "rebate_count": 80,
        "multiple": multiple + "",
        "mode": 3,
        "bet_money": (perMoney * ca).toFixed(3),
        "calc_type": "0"
    });

    datas.push({
        "method_id": "140001",
        "number": index + "@" + betNumberB.substr(0, betNumberB.length - 1),
        "rebate_count": 80,
        "multiple": multiple + "",
        "mode": 3,
        "bet_money": (perMoney * cb).toFixed(3),
        "calc_type": "0"
    });

    console.log("下注信息:");
    console.log(datas);
    window.betUtil.builderOrderParams(datas, issueNumber, 'fourbet');
};

var createFourPolicy = function (name, cacheName, type) {
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
            for (var s = policy.i; s < policy.i + 4; s++) {
                var n1 = newData.ZJHM.split(',')[s];
                ns.push(n1);
            }

            var isRight = false;
            if (typeof type == "undefined") {
                isRight = compare(ns, policy.nums);
            }
            else {
                isRight = compareAny(ns, policy.nums);
            }
            
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

            console.logex("策略" + name + "符合条件！当前倍数:" + policy.bias + "位置：" + matchItem.index);
            if (policy.stop === true || policy.stoping === true) {
                console.logex("策略" + name + "未下注！");
                return;
            }

            if (sessionStorage[cacheName] != "1") {
                console.logex("策略" + name + "未下注！");
                return;
            }

           // doFourBet(matchItem.index, matchItem.nums, 1, (parseInt(newData.CP_QS) + 1) + "", type);
        }
    };

    window.policies.push(policy);
};

var createRegPolicy = function (name, regs, type) {
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
            for (var s = policy.i; s < policy.i + 4; s++) {
                var n1 = newData.ZJHM.split(',')[s];
                ns.push(n1);
            }

            var isRight = false;
            if (typeof type == "undefined") {
                isRight = compare(ns, policy.nums);
            }
            else {
                isRight = compareAny(ns, policy.nums);
            }
            
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
			
			if (sessionStorage[cacheName].length > 20)
			{
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
			for(var idx in regs)
			{
			    if (strs.match(regs[idx]) != null){
                    console.logex("策略" + name + "满足条件" + regs[idx]);
                    doFourBet(matchItem.index, matchItem.nums, 1, (parseInt(newData.CP_QS) + 1) + "", type);
				    break;
				} 	
			}
			
            
        }
    };

    window.policies.push(policy);
};

var createFourNormalPolicy = function (name) {
    var register = function () {
        var watch = findWatch(name);
        watch.policies.push(policy);
    };

    var compare = function (ns, fiveNumber) {
        return !(ns.indexOf(fiveNumber[0]) > -1 && ns.indexOf(fiveNumber[1]) > -1);
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
            for (var s = policy.i; s < policy.i + 4; s++) {
                var n1 = newData.ZJHM.split(',')[s];
                ns.push(n1);
            }

            var isRight = compare(ns, policy.nums);

            if (isRight) {
                policy.wins++;
                batchWins++;
                console.logex("策略" + name + "正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
            }
            else {
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

            console.logex("策略" + name + "符合条件！当前倍数:" + policy.bias + "位置：" + matchItem.index);
            if (policy.stop === true || policy.stoping === true) {
                console.logex("策略" + name + "未下注！");
                return;
            }

            doFourBet(matchItem.index, matchItem.nums, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
};

(function () {
    createFourNormalPolicy("fourright");
    createFourNormalPolicy("fourleft");
})();

(function () {
	var reges = ["VX{3,3}$", "VXVX$", "VX{2,2}VX{2,2}$"];
	createRegPolicy("fourright3", reges);
	createRegPolicy("fourleft3", reges);
	
	var reges1 = ["VX{3,3}$", "VXVXVX$", "VX{2,2}VX{2,2}VX{2,2}$"];
    createRegPolicy("foursplit", reges1, 1);
	createRegPolicy("fourmissRightTwo", reges1, 1);
	createRegPolicy("fourmissleftTwo", reges1, 1);
	createRegPolicy("fourmissRightOne", reges1, 1);
	createRegPolicy("fourmissleftOne", reges1, 1);
	
	var reges2 = ["VX{1,1}$"];
	createRegPolicy("fourdoubleright", reges2);
	createRegPolicy("fourdoubleleft", reges2);
})();