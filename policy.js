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
                return 100;
            case 2:
                return 400;
            case 3:
                return 1500;
            case 4:
                return 3000;
        }
    }

    var betNumber = "";
    var createBetInfo = function (guy, bias) {
        var curNumber = guy.prevNums[4 - bias];
        if (guy.isBig) {
            if (curNumber >= 5) {
                betNumber = "56789";
            }
            else {
                betNumber = "01234";
            }
        }
        else {
            if (curNumber % 2 != 0) {
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

    var isRealStart = false;

    var doBet = function (guy, bias, issueNumber) {
        var betInfo = [createBetInfo(guy, bias)];
        console.log("下注信息:");
        console.log(betInfo);
        if (isRealStart) {
            window.betUtil.builderOrderParams(betInfo, issueNumber);
        }
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
                policy.wins++;
                console.log("策略fuckyourmom正确盈利一次。当前获利次数：" + policy.wins);
                policy.isRunning = false;
                //if (policy.wins >= 4) {
                //    policy.stop = true;
                //    console.log("策略fuckyourmom已达到最大获利次数。");
                //}

                isRealStart = false;

                return;
            }
            else {
                policy.bias++;
                console.log("策略fuckyourmom错误失败一次，当前倍数" + policy.bias);
                if (policy.bias > 4) {
                    policy.isRunning = false;
                    if (isRealStart === false) {
                        console.log("策略fuckyourmom真正开始。");
                        isRealStart = true;
                    }
                    else {
                        policy.stop = true;
                        console.log("策略fuckyourmom被终结。");
                    }

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

   // window.policies.push(policy);
})();

(function () {
    var register = function () {
        var watch = findWatch("haven");
        watch.policies.push(policy);
    };

    var getMutil = function (b) {
        return 2777;
    }

    var betNumber = "";
    var createBetInfo = function (guy, bias) {
        var curNumber = parseInt(guy.prevNum, 10);

        betNumber = "";
        for (var i = 0; i < 10; i++) {
            if (i != curNumber) {
                betNumber += i;
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
        if (realGoTimes > 0) {
            window.betUtil.builderOrderParams(betInfo, issueNumber);
        }
    }

    var realGoTimes = 0;

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

            policy.isRunning = false;
            var zjhm = newData.ZJHM.split(',')[policy.guy.numIndex];
            var isRight = betNumber.indexOf(zjhm) > -1;
            if (isRight) {
                policy.guy = null;
                policy.wins++;
                console.log("策略haven正确盈利一次。当前获利次数：" + policy.wins);
                if (realGoTimes > 0) {
                    realGoTimes--;
                    if (realGoTimes === 0) {
                        //policy.stop = true;
                        console.log("策略haven已达到最大获利次数。");
                    }
                }
            }
            else {
                if (realGoTimes === 0) {
                    realGoTimes = 2;
                    console.log("策略haven被触发。");
                }
                else {
                    policy.stop = true;
                    console.log("策略haven被终结。");
                    return;
                }
            }
        },
        tryStart: function (watch, guy, newData) {
            if (policy.isRunning) {
                return;
            }

            policy.bias = 1;
            policy.CP_QS = newData.CP_QS;
            policy.isRunning = true;
            policy.guy = guy;
            console.log("策略haven符合条件！当前倍数:" + policy.bias);
            doBet(guy, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

   // window.policies.push(policy);
})();

(function () {
    var register = function () {
        var watch = findWatch("altgo");
        watch.policies.push(policy);
    };

    var getMutil = function (b) {
        return 2777;
    }

    var betNumber = "";
    var createBetInfo = function (index, a, bias) {
        var curNumber = a;

        betNumber = "";
        for (var i = 0; i < 10; i++) {
            if (i != curNumber) {
                betNumber += i;
            }
        }

        var numIndex = index;
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

    var doBet = function (i, a, bias, issueNumber) {
        var betInfo = [createBetInfo(i, a, bias)];
        console.log("下注信息:");
        console.log(betInfo);
        //window.betUtil.builderOrderParams(betInfo, issueNumber);
    }

    var realGoTimes = 0;

    var isMatchOne = function (arrary) {
        var prevItem = arrary[1];
        var max = 0;
        var isMatchPrev = false;
        for (var i = 0; i < prevItem.length; i++) {
            var n = prevItem[i];
            if (i >= 3) {
                if (n == (max + 1)) {
                    isMatchPrev = true;
                    break;
                }
            }

            if (n > max) {
                max = n;
            }
        }

        if (isMatchPrev) {
            var item = arrary[0];
            max = 0;
            for (var i = 0; i < item.length - 1; i++) {
                var n = item[i];
                if (n > max) {
                    max = n;
                }
            }

            max = max + 1;
            if (max === item[item.length - 1]) {
                return true;
            }
        }

        return false;
    }

    var isMatchTwo = function (arrary) {
        var prevItem = arrary[1];
        var lastItem = arrary[2];
        var prevN = prevItem[prevItem.length - 1];
        var lastN = lastItem[lastItem.length - 1];
        var miss = Math.abs(prevN - lastN);
        if (miss > 2 || (miss === 0 && prevN <= 10)) {
            return false;
        }

        var item = arrary[0];
        var n = item[item.length - 1];
        var v = -1;
        if (lastN > prevN) {
            v = prevN - miss;
        }
        else {
            v = prevN + miss;
        }

        if (v === n) {
            return true;
        }

        return false;
    }

    var isMatchThree = function (arrary) {
        var item = arrary[0];
        var n = item[item.length - 1];
        if (n !== 6 && n !== 4 && n !== 5) {
            return false;
        }

        var count = 0;
        var fiveCount = 0;
        var fourCount = 0;
        for (var i = 0; i < item.length - 1; i++) {
            var n = item[i];
            if (n === 6) {
                count++;
            }

            if (n === 5) {
                fiveCount++;
            }

            if (n === 4) {
                fourCount++;
            }
        }

        if ((count >= 3 && n === 6) || (fiveCount >= 4 && n === 5) || (fourCount >= 4 && n === 4)) {
            return true;
        }

        return false;
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

            policy.isRunning = false;
            var zjhm = newData.ZJHM.split(',')[policy.i];
            var isRight = policy.a != zjhm;
            if (isRight) {
                policy.wins++;
                console.log("策略altgo正确盈利一次。当前获利次数：" + policy.wins);
                //if (policy.wins >= 4) {
                //    policy.stop = true;
                //    console.log("策略altgo已达到最大获利次数。");
                //}
            }
            else {
                console.log("策略altgo被终结。");
            }
        },
        tryStart: function (watch, arrary, newData) {
            if (policy.isRunning) {
                return;
            }

            console.log(arrary);
            var isFound = false;
            var i = 0;
            var a = 0;
            for (i = 0; i < arrary.length; i++) {
                for (a = 0; a < arrary[i].length; a++) {
                    var item = arrary[i][a];
                    if (item.length === 0) {
                        continue;
                    }


                    if (isMatchOne(item)) {
                        isFound = true;
                        console.log("A:");
                        console.log(item);
                        break;
                    }

                    if (isMatchTwo(item)) {
                        isFound = true;
                        console.log("B:");
                        console.log(item);
                        break;
                    }

                    if (isMatchThree(item)) {
                        isFound = true;
                        console.log("C:");
                        console.log(item);
                        break;
                    }
                }

                if (isFound) {
                    break;
                }
            }

            if (isFound === false) {
                return;
            }

            policy.bias = 1;
            policy.CP_QS = newData.CP_QS;
            policy.isRunning = true;
            policy.i = i;
            policy.a = a;

            console.log("策略altgo符合条件！当前倍数:" + policy.bias + "位置：" + (i + 1) + "数字：" + a);
            doBet(i, a, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
})();