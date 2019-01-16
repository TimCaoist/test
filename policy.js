window.policies = [];
var findWatch = function (name)
{
    for (var i = 0; i < window.watchers.length; i++) {
        if (window.watchers[i].name === name) {
            return window.watchers[i];
        }
    }

    return null;
}

String.prototype.endWith = function (str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substring(this.length - str.length) == str)
        return true;
    else
        return false;
    return true;
};

String.prototype.padLeft = function (c, length) {
    var str = this;
    while (str.length < length) {
        str = c + str;
    }

    return str;
};

(function () {
    var buildNumber = function (guess, compare) {
        var betDatas = guess.betDatas;
        var lenBetDatas = betDatas.length;
        var betArray = [];
        for (var i = 0; i < lenBetDatas; i++) {
            betArray.push(betDatas[i][0] + betDatas[i][1] + betDatas[i][2]);
        }

        var numbers = "";
        var numbers1 = "";
        var count = 0;
        var count1 = 0;

        for (var i = 0; i < 1000; i++) {
            var str = (i + "").padLeft('0', 3);
            var isMatch = true;
            for (var a = 0; a < lenBetDatas; a++) {
                var compareStr = betArray[a];
                if (compare(compareStr, str)) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch === false) {
                continue;
            }

            if (count < 700) {
                numbers += str + "$";
                count++;
            }
            else {
                numbers1 += str + "$";
                count1++;
            }
        }

        return {
            datas: [
                {
                    number: numbers.substring(0, numbers.length - 1),
                    count: count
                },
                {
                    number: numbers1.substring(0, numbers1.length - 1),
                    count: count1
                }
            ],
            count: count + count1
        }
    };

    var register = function () {
        var watch = findWatch("dolu");
        watch.policies.push(policy);
    };

    var policy = {
        register: register,
        isRunning: false,
        stoping: false,
        bias: 1,
        stopping: false,
        right: 0,
        tryStop: function () {
            if (policy.bias === 1 && policy.isRunning === false) {
                policy.stop = true;
                return;
            }

            policy.stopping = true;
        },
        doJudge: function (watch) {
            if (watch.prevWrong === true) {
                console.log("策略dolu错了！");
                policy.bias++;
                if (policy.bias > 2) {
                    policy.stop = true;
                    console.log("策略dolu失败过多终止！");
                }
            }
            else {
                policy.right++;
                console.log("策略dolu对了！当前获利" + policy.right + "次。");
                policy.bias = 1;
                if (policy.stopping === true) {
                    policy.stop = true;
                }
            }

            policy.isRunning = false;
        },
        check: function (watch) {
            if (policy.stop === true) {
                return;
            }

			if (watch === null) {
                return;
            }
			
            if (policy.isRunning === false) {
                return;
            }

            policy.doJudge(watch);
        },
        tryStart: function (watch, guess, compare, newData) {
            if (policy.isRunning || watch.txt.endWith("xoooo") === false) {
                return;
            }

            policy.isRunning = true;
            console.log("策略dolu符合条件！当前倍数:" + policy.bias);
            var betInfos = buildNumber(guess, compare);
            var b = policy.bias === 1 ? 4 : 49;
            var datas = window.betUtil.builderBetInfos(guess.a + "," + guess.b + "," + guess.c, betInfos.datas, b * 0.002, b);
            //betUtil.builderOrderParams(datas, (parseInt(newData.CP_QS) + 1) + "");
            console.log("下注成功！");
        }
    };

    //window.policies.push(policy);
})();

(function () {
    var register = function () {
        var watch = findWatch("fuckyourmom");
        watch.policies.push(policy);
    };

    var getMutil = function (b) {
        switch (b) {
            case 1:
                return 1;
            case 2:
                return 2;
            case 3:
                return 4;
            case 4:
                return 8;
        }
    }

    var betNumber = "";
    var createBetInfo = function (guy, bias) {
        var curNumber = guy.prevNums[bias - 1];
        if (guy.isBig) {
            if (curNumber < 5) {
                betNumber = "56789";
            }
            else {
                betNumber = "01234";
            }
        }
        else {
            if (curNumber % 2 == 0) {
                betNumber = "13579";
            }
            else {
                betNumber = "02468";
            }
        }

        var numIndex = guy.numIndex;
        var str = "";
        for (var i = 0; i < numIndex; i++) {
            str += ",";
        }

        str += betNumber;
        for (var i = numIndex + 1; i < 5; i++) {
            str += ",";
        }

        var beInfo = {
            "method_id": "9",
            "number": str,
            "rebate_count": 80,
            "multiple": getMutil(bias),
            "mode": 3,
            "bet_money": (getMutil(bias) * 0.01) + "",
            "calc_type": "0"
        };

        return beInfo;
    }

    var doBet = function (guy, bias, issueNumber) {
        var betInfo = [createBetInfo(guy, bias)];
        console.log("下注信息:");
        console.log(betInfo);
        //window.betUtil.builderOrderParams(betInfo, issueNumber);
    }

    var policy = {
        register: register,
        isRunning: false,
        stoping: false,
        bias: 1,
        stopping: false,
        right: 0,
        guy: null,
        wins: 0,
        tryStop: function () {
            if (policy.bias === 1 && policy.isRunning === false) {
                policy.stop = true;
                return;
            }

            policy.stopping = true;
        },
        doJudge: function (watch) {
        },
        check: function (watch, newData) {
            if (policy.CP_QS === newData.CP_QS) {
                return;
            }

            if (policy.stop === true) {
                return;
            }

            if (watch === null) {
                return;
            }

            if (policy.isRunning === false) {
                return;
            }

            if (policy.guy === null) {
                return;
            }

            var zjhm = newData.ZJHM.split(',')[policy.guy.numIndex];
            var isRight = betNumber.indexOf(zjhm) > -1;
            if (isRight) {
                policy.guy = null;
                console.log("策略fuckyourmom正确盈利一次。");
                policy.wins++;
                policy.isRunning = false;
                if (policy.wins >= 4) {
                    policy.stop = true;
                }

                return;
            }
            else {
                policy.bias++;
                console.log("策略fuckyourmom错误失败一次，当前倍数" + policy.bias);
                if (policy.bias > 4) {
                    policy.stop = true;
                    console.log("策略fuckyourmom被终结。");
                    return;
                }
            }

            doBet(policy.guy, policy.bias, (parseInt(newData.CP_QS) + 1) + "");
        },
        tryStart: function (watch, guy, newData) {
            if (policy.isRunning) {
                return;
            }

            policy.bias = 1;
            policy.CP_QS = newData.CP_QS;
            policy.isRunning = true;
            policy.guy = guy;
            console.log("策略fuckyourmom符合条件！当前倍数:" + policy.bias);
            doBet(guy, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
})();