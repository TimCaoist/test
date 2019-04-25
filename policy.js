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

var getMutil = function (b) {
    return 700;
}

var getMutil1 = function (b) {
    return 800;
}

var batchWins = 0;

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

var altgoCheck = function () {

};

//
var isMatchFive = function (arrary) {
    var item = arrary[0];
    var n = item[item.length - 1];
    var str = "";
    var wrongCount = 0;
    for (var i = 1; i < arrary.length; i++) {
        var cItem = arrary[i];
        var cN = cItem[cItem.length - 1];
        if (cN === n) {
            str += "V";
            wrongCount++;
        }
        else {
            str += "X";
        }
    }

    return str.startsWith("VX") && wrongCount >= 4;
};

var isMatchSeven = function (arrary) {
    if (arrary.length < 5) {
        return false;
    }

    var item = arrary[0];
    var len = item.length;
    if (item[len - 1] < 7) {
        return false;
    }

    var oneItem = item;
    var twoItem = arrary[2];
    var threeItem = arrary[4];

    var oneN = oneItem[oneItem.length - 1];
    var twoN = twoItem[twoItem.length - 1];
    var threeN = threeItem[threeItem.length - 1];

    if (oneN === twoN) {
        return false;
    }

    if (oneN - twoN != twoN - threeN) {
        return false;
    }

    return true;
};

var isMatchEight = function (arrary) {
    if (arrary.length < 7) {
        return false;
    }

    var item = arrary[0];
    var len = item.length;
    if (item[len - 1] < 7) {
        return false;
    }

    var oneItem = item;
    var twoItem = arrary[3];
    var threeItem = arrary[6];

    var oneN = oneItem[oneItem.length - 1];
    var twoN = twoItem[twoItem.length - 1];
    var threeN = threeItem[threeItem.length - 1];

    if (oneN === twoN) {
        return false;
    }

    if (oneN - twoN != twoN - threeN) {
        return false;
    }

    return true;
};

var betNumber = "";
var createBetInfo = function (index, a, bias) {
    var curNumber = a;

    betNumber = curNumber;
    //for (var i = 0; i < 10; i++) {
    //    if (i != curNumber) {
    //        betNumber += i;
    //    }
    //}

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
};

var createBetInfo1 = function (index, a, bias) {
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
        "multiple": getMutil1(bias),
        "mode": 3,
        "bet_money": (getMutil1(bias) * 0.01) + "",
        "calc_type": "0"
    };

    return beInfo;
};

var doBet = function (i, a, bias, issueNumber) {
    var betInfo = [createBetInfo(i, a, bias)];
    console.log("下注信息:");
    console.log(betInfo);
    window.betUtil.builderOrderParams(betInfo, issueNumber);
};

var doBet1 = function (i, a, bias, issueNumber) {
    var betInfo = [createBetInfo1(i, a, bias)];
    console.log("下注信息:");
    console.log(betInfo);
    window.betUtil.builderOrderParams(betInfo, issueNumber);
};

var altgoStr = "";
(function () {
    var register = function () {
        var watch = findWatch("altgo");
        watch.policies.push(policy);
    };

    var matchedOnes = [];
    var isOneRight = function (item) {
        var max = 4;
        var isMatchPrev = false;
        for (var i = 0; i < item.length; i++) {
            var n = item[i];
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

        return isMatchPrev;
    }

    var getLastN = function (array, index) {
        var item = array[index];
        return item[item.length - 1];
    }

    //上一轮出错
    var isMatchOne = function (arrary) {

        return false;
    }

    //三个以上等差
    var isMatchTwo = function (arrary) {
        if (arrary.length < 4) {
            return false;
        }

        var n = getLastN(arrary, 0);
        if (n <= 6) {
            return false;
        }

        var miss = n - getLastN(arrary, 1);
        var matchCount = 0;

        for (var i = 2; i < arrary.length; i++) {
            var prevN = getLastN(arrary, i - 1);
            var cN = getLastN(arrary, i);
            var cMiss = prevN - cN;
            if (cMiss != miss) {
                break;
            }

            matchCount++;
        }
        
        if (Math.abs(miss) < 2) {
            return matchCount >= 4;
        }
        else if (Math.abs(miss) < 4)
        {
            return matchCount >= 3;
        }

        return matchCount >= 2;
    }

    //出现4个以上
    var isMatchThree = function (arrary) {
        var item = arrary[0];
        var ns = [0, 0, 0, 0, 0, 0];
        var lastN = item[item.length - 1];
        for (var i = 0; i < item.length - 2; i++) {
            var n = item[i];
            ns[n - 1] = ns[n - 1] + 1;
        }

        var index = lastN - 1;
        var count = ns[index];
        if (index <= 2) {
            return count >= 5;
        }
        else if (index > 2) {
            return count >= 4;
        }

        return false;
    }

    //连出三个
    var isMatchFour = function (arrary) {
        return false;

        var item = arrary[0];
        var n = item[item.length - 1];
        if (n < 2) {
            return false;
        }

        var c = 0;
        for (var i = item.length - 2; i >= item.length - 4; i--) {
            var d = item[i];
            if (d !== n) {
                break;
            }

            c++;
        }

        if (n === 2) {
            return c >= 5;
        }
        else if (n === 3) {
            return c >= 4;
        }

        return n > 3 && c >= 3;
    }
        
    var matchSixArray = [];

    //与上轮三个相同
    var isMatchSix = function (arrary) {

        var oneItem = arrary[1];
        var twoItem = arrary[2];
        if (twoItem[2] === oneItem[2] && twoItem[3] === oneItem[3]) {
            matchSixArray.push(oneItem);
        }

        var item = arrary[0];
        var len = item.length;
        if (len != 4) {
            return false;
        }

        for (var mi = 0; mi < matchSixArray.length; mi++) {
            var matchedItem = matchSixArray[mi];
            if (matchedItem.index === item.index && matchedItem.n === item.n) {
                if (item[2] === oneItem[2] && item[3] === oneItem[3]) {
                    return true;
                }

                break;
            }
        }

        return false;
    }

    
    var isMatchNine = function (arrary) {
        if (arrary.length < 4) {
            return false;
        }

        var n = getLastN(arrary, 0);
        if (n <= 6) {
            return false;
        }

        var prevN = getLastN(arrary, 1);
        var miss = n - prevN;

        var str = "";
        for (var i = 2; i < arrary.length; i++) {
            var prevN = getLastN(arrary, i - 1);
            var cN = getLastN(arrary, i);
            var cMiss = prevN - cN;
            if (cMiss === miss) {
                str += "V";
            }
            else {
                str += "X";
            }
        }

        var patt1 = /^XV{1,}X{0,2}V{1,}/;
        var result1 = str.match(patt1);
        return result1 !== null;
    }

    var matchers = [isMatchTwo, isMatchThree, isMatchFour, isMatchFive, isMatchSix, isMatchSeven, isMatchEight, isMatchNine];
    var isWronging = false;
    var joinCount = 0;

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

            if (watch === null) {
                return;
            }

            if (policy.isRunning === false) {
                return;
            }

            policy.isRunning = false;
            var zjhm = newData.ZJHM.split(',')[policy.i];
            var isRight = policy.a != zjhm;
            var isBet = false;
            if (joinCount > 0) {
                joinCount--;
                isBet = true;
            }

            if (isRight) {
                policy.wins++;
                if (isWronging === true) {
                    isWronging = false;
                    joinCount = 2;
                }

                if (isBet) {
                    batchWins++;
                }

                console.log("策略altgo正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
                altgoStr += "X";
            }
            else {
                isWronging = true;
                console.log("策略altgo被终结。");
                altgoStr += "V";
            }
        },
        tryStart: function (watch, arrary, newData) {
            if (policy.isRunning) {
                return;
            }

            var isFound = false;
            var i = 0;
            var a = 0;
            for (i = 0; i < arrary.length; i++) {
                for (a = 0; a < arrary[i].length; a++) {
                    var item = arrary[i][a];
                    if (item.length === 0) {
                        continue;
                    }

                    for (var m = 0; m < matchers.length; m++) {
                        var match = matchers[m];
                        if (match(item)) {
                            isFound = true;
                            console.log(m + ":");
                            console.log(item);
                            break;
                        }
                    }

                    if (isFound) {
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
            if (policy.stop === true ) {
                console.log("策略altgo停止，未下注!");
                return;
            }

            if (altgoStr.match(/X{10,}$/) != null) {
                doBet(i, a, 1, (parseInt(newData.CP_QS) + 1) + "");
            }
            else if (altgoStr.match(/V{1,}XV{1,}X$/) != null || altgoStr.match(/V{3,}$/) != null) {
                doBet1(i, a, 1, (parseInt(newData.CP_QS) + 1) + "");
            }
        }
    };

    window.policies.push(policy);
})();

(function () {
    var register = function () {
        var watch = findWatch("dissaltgo");
        watch.policies.push(policy);
    };

    var matchedOnes = [];
    var isOneRight = function (item) {
        var max = 4;
        var isMatchPrev = false;
        for (var i = 0; i < item.length; i++) {
            var n = item[i];
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

        return isMatchPrev;
    }

    var getLastN = function (array, index) {
        var item = array[index];
        return item[item.length - 1];
    }
    

    //三个以上等差
    var isMatchTwo = function (arrary) {
        if (arrary.length < 4) {
            return false;
        }

        var n = getLastN(arrary, 0);
        if (n <= 6) {
            return false;
        }

        var miss = n - getLastN(arrary, 1);
        var matchCount = 0;

        for (var i = 2; i < arrary.length; i++) {
            var prevN = getLastN(arrary, i - 1);
            var cN = getLastN(arrary, i);
            var cMiss = prevN - cN;
            if (cMiss != miss) {
                break;
            }

            matchCount++;
        }

        if (Math.abs(miss) < 2) {
            return matchCount >= 4;
        }
        else if (Math.abs(miss) < 4) {
            return matchCount >= 3;
        }

        return matchCount >= 2;
    }

    //出现4个以上
    var isMatchThree = function (arrary) {
        var item = arrary[0];
        var ns = [0, 0, 0, 0, 0, 0];
        var lastN = item[item.length - 1];
        for (var i = 0; i < item.length - 2; i++) {
            var n = item[i];
            ns[n - 1] = ns[n - 1] + 1;
        }

        var index = lastN - 1;
        var count = ns[index];
        if (index <= 2) {
            return count >= 5;
        }
        else if (index > 2) {
            return count >= 4;
        }

        return false;
    }

    //连出三个
    var isMatchFour = function (arrary) {
        return false;
    }
    
    //与上轮三个相同
    var isMatchSix = function (arrary) {
        return false;
    }

    var isMatchNine = function (arrary) {
        if (arrary.length < 4) {
            return false;
        }

        var n = getLastN(arrary, 0);
        if (n <= 6) {
            return false;
        }

        var prevN = getLastN(arrary, 1);
        var miss = n - prevN;

        var str = "";
        for (var i = 2; i < arrary.length; i++) {
            var prevN = getLastN(arrary, i - 1);
            var cN = getLastN(arrary, i);
            var cMiss = prevN - cN;
            if (cMiss === miss) {
                str += "V";
            }
            else {
                str += "X";
            }
        }

        var patt1 = /^XV{1,}X{0,2}V{1,}/;
        var result1 = str.match(patt1);
        return result1 !== null;
    }

    var matchers = [isMatchTwo, isMatchThree, isMatchFour, isMatchFive, isMatchSix, isMatchSeven, isMatchEight, isMatchNine];

    var isWronging = false;
    var joinCount = 0;

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

            if (watch === null) {
                return;
            }

            if (policy.isRunning === false) {
                return;
            }

            policy.isRunning = false;
            var zjhm = newData.ZJHM.split(',')[policy.i];
            var isRight = policy.a != zjhm;
            var isBet = false;
            if (joinCount > 0) {
                joinCount--;
                isBet = true;
            }

            if (isRight) {
                policy.wins++;
                if (isWronging === true) {
                    isWronging = false;
                    joinCount = 2;
                }

                if (isBet) {
                    batchWins++;
                }

                console.log("策略dissaltgo正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
                altgoStr += "X";
            }
            else {
                isWronging = true;
                console.log("策略dissaltgo被终结。");
                altgoStr += "V";
            }
        },
        tryStart: function (watch, arrary, newData) {
            if (policy.isRunning) {
                return;
            }

            var isFound = false;
            var i = 0;
            var a = 0;
            for (i = 0; i < arrary.length; i++) {
                for (a = 0; a < arrary[i].length; a++) {
                    var item = arrary[i][a];
                    if (item.length === 0) {
                        continue;
                    }

                    for (var m = 0; m < matchers.length; m++) {
                        var match = matchers[m];
                        if (match(item)) {
                            isFound = true;
                            console.log(m + ":");
                            console.log(item);
                            break;
                        }
                    }

                    if (isFound) {
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

            var cn = parseInt(newData.ZJHM.split(',')[i], 10) + a;
            if (cn > 9) {
                cn = cn - 10;
            }

            policy.a = cn;

            console.log("策略dissaltgo符合条件！当前倍数:" + policy.bias + "位置：" + (i + 1) + "数字：" + cn + "加数：" + a);
            if (policy.stop === true) {
                console.log("策略dissaltgo停止，未下注!");
                return;
            }

            if (altgoStr.match(/X{10,}$/) != null) {
                doBet(i, cn, 1, (parseInt(newData.CP_QS) + 1) + "");
            }
            else if (altgoStr.match(/V{1,}XV{1,}X$/) != null || altgoStr.match(/V{3,}$/) != null) {
                doBet1(i, cn, 1, (parseInt(newData.CP_QS) + 1) + "");
            }
        }
    };

    window.policies.push(policy);
})();

(function () {
    var register = function () {
        var watch = findWatch("missaltgo");
        watch.policies.push(policy);
    };

    var matchedOnes = [];
    var isOneRight = function (item) {
        var max = 4;
        var isMatchPrev = false;
        for (var i = 0; i < item.length; i++) {
            var n = item[i];
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

        return isMatchPrev;
    }

    var getLastN = function (array, index) {
        var item = array[index];
        return item[item.length - 1];
    }

    

    //三个以上等差
    var isMatchTwo = function (arrary) {
        if (arrary.length < 4) {
            return false;
        }

        var n = getLastN(arrary, 0);
        if (n <= 6) {
            return false;
        }

        var miss = n - getLastN(arrary, 1);
        var matchCount = 0;

        for (var i = 2; i < arrary.length; i++) {
            var prevN = getLastN(arrary, i - 1);
            var cN = getLastN(arrary, i);
            var cMiss = prevN - cN;
            if (cMiss != miss) {
                break;
            }

            matchCount++;
        }

        if (Math.abs(miss) < 2) {
            return matchCount >= 4;
        }
        else if (Math.abs(miss) < 4) {
            return matchCount >= 3;
        }

        return matchCount >= 2;
    }

    //出现4个以上
    var isMatchThree = function (arrary) {
        var item = arrary[0];
        var ns = [0, 0, 0, 0, 0, 0];
        var lastN = item[item.length - 1];
        for (var i = 0; i < item.length - 2; i++) {
            var n = item[i];
            ns[n - 1] = ns[n - 1] + 1;
        }

        var index = lastN - 1;
        var count = ns[index];
        if (index <= 2) {
            return count >= 5;
        }
        else if (index > 2) {
            return count >= 4;
        }

        return false;
    }

    //连出三个
    var isMatchFour = function (arrary) {
        return false;
    }
    
    //与上轮三个相同
    var isMatchSix = function (arrary) {
        return false;
    }
   
    var isMatchNine = function (arrary) {
        if (arrary.length < 4) {
            return false;
        }

        var n = getLastN(arrary, 0);
        if (n <= 6) { 
            return false;
        }

        var prevN = getLastN(arrary, 1);
        var miss = n - prevN;

        var str = "";
        for (var i = 2; i < arrary.length; i++) {
            var prevN = getLastN(arrary, i - 1);
            var cN = getLastN(arrary, i);
            var cMiss = prevN - cN;
            if (cMiss === miss) {
                str += "V";
            }
            else {
                str += "X";
            }
        }

        var patt1 = /^XV{1,}X{0,2}V{1,}/;
        var result1 = str.match(patt1);
        return result1 !== null;
    }

    var matchers = [isMatchTwo, isMatchThree, isMatchFour, isMatchFive, isMatchSix, isMatchSeven, isMatchEight, isMatchNine];
    var isWronging = false;
    var joinCount = 0;

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

            if (watch === null) {
                return;
            }

            if (policy.isRunning === false) {
                return;
            }

            policy.isRunning = false;
            var zjhm = newData.ZJHM.split(',')[policy.i];
            var isRight = policy.a != zjhm;
            var isBet = false;
            if (joinCount > 0) {
                joinCount--;
                isBet = true;
            }

            if (isRight) {
                policy.wins++;
                if (isWronging === true) {
                    isWronging = false;
                    joinCount = 2;
                }

                if (isBet) {
                    batchWins++;
                }

                console.log("策略missaltgo正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
                altgoStr += "X";
            }
            else {
                isWronging = true;
                console.log("策略missaltgo被终结。");
                altgoStr += "V";
            }
        },
        tryStart: function (watch, arrary, newData, currentMisses) {
            if (policy.isRunning) {
                return;
            }

            var isFound = false;
            var i = 0;
            var a = 0;
            for (i = 0; i < arrary.length; i++) {
                for (a = 0; a < arrary[i].length; a++) {
                    var item = arrary[i][a];
                    if (item.length === 0) {
                        continue;
                    }

                    for (var m = 0; m < matchers.length; m++) {
                        var match = matchers[m];
                        if (match(item)) {
                            isFound = true;
                            console.log(m + ":");
                            console.log(item);
                            break;
                        }
                    }

                    if (isFound) {
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

            var cn = currentMisses[i][a].n;
            policy.a = cn;

            console.log("策略missaltgo符合条件！当前倍数:" + policy.bias + "位置：" + (i + 1) + "数字：" + cn + "遗漏位置：" + a);
            if (policy.stop === true) {
                console.log("策略missaltgo停止，未下注!");
                return;
            }

            if (altgoStr.match(/X{10,}$/) != null) {
                doBet(i, cn, 1, (parseInt(newData.CP_QS) + 1) + "");
            }
            else if (altgoStr.match(/V{1,}XV{1,}X$/) != null || altgoStr.match(/V{3,}$/) != null) {
                doBet1(i, cn, 1, (parseInt(newData.CP_QS) + 1) + "");
            }
        }
    };

    window.policies.push(policy);
})();

(function () {
    var register = function () {
        var watch = findWatch("loops");
        watch.policies.push(policy);
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
            var zjhm = newData.ZJHM.split(',')[policy.i];
            var isRight = policy.a != zjhm;

            if (isRight) {
                policy.wins++;
                batchWins++;
                console.log("策略loops正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
            }
            else {
                console.log("策略loops被终结。");
            }
        },
        tryStart: function (watch, array, newData) {
            if (policy.isRunning) {
                return;
            }

            var matchItem = array[0];
            policy.bias = 1;
            policy.CP_QS = newData.CP_QS;
            policy.isRunning = true;
            policy.i = matchItem.index;
            policy.a = matchItem.num;

            console.log("策略loops符合条件！当前倍数:" + policy.bias);

            if (policy.stop === true || policy.stoping === true) {
                console.log("策略loops未下注！");
                return;
            }

            //doBet1(matchItem.index, matchItem.num, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
})();

(function () {
    var register = function () {
        var watch = findWatch("double");
        watch.policies.push(policy);
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
            var zjhm = newData.ZJHM.split(',')[policy.i];
            var isRight = policy.a != zjhm;

            if (isRight) {
                policy.wins++;
                batchWins++;
                console.log("策略double正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
            }
            else {
                console.log("策略double被终结。");
            }
        },
        tryStart: function (watch, array, newData) {
            if (policy.isRunning) {
                return;
            }

            var matchItem = array[0];
            policy.bias = 1;
            policy.CP_QS = newData.CP_QS;
            policy.isRunning = true;
            policy.i = matchItem.index;
            policy.a = matchItem.num;

            console.log("策略double符合条件！当前倍数:" + policy.bias);

            if (policy.stop === true || policy.stoping === true) {
                console.log("策略double未下注！");
                return;
            }

            //doBet1(matchItem.index, matchItem.num, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
})();

(function () {
    var register = function () {
        var watch = findWatch("split");
        watch.policies.push(policy);
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
            var zjhm = newData.ZJHM.split(',')[policy.i];
            var isRight = policy.a != zjhm;

            if (isRight) {
                policy.wins++;
                batchWins++;
                console.log("策略split正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
            }
            else {
                console.log("策略split被终结。");
            }
        },
        tryStart: function (watch, array, newData) {
            if (policy.isRunning) {
                return;
            }

            var matchItem = array[0];
            policy.bias = 1;
            policy.CP_QS = newData.CP_QS;
            policy.isRunning = true;
            policy.i = matchItem.index;
            policy.a = matchItem.num;

            console.log("策略split符合条件！当前倍数:" + policy.bias);

            if (policy.stop === true || policy.stoping === true) {
                console.log("策略split未下注！");
                return;
            }

            //doBet1(matchItem.index, matchItem.num, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
})();