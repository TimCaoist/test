window.policies = [];
var timetamp = Number(new Date());

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
    switch (b) {
        case 2:
            return 50;
        default:
            return 50;
    }
};

var getMutil1 = function (b) {
    switch (b) {
        case 2:
            return 550;
        default:
            return 550;
    }
};

var getMutil2 = function (b) {
    return getMutil1(b) / 10;
};

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
    for (var i = 0; i <= 5; i++) {
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

var createBetInfo2 = function (index, a, bias) {
    var head = "";
    var cIndex = 0;
    var str = "";
    if (index === 4) {
        cIndex = 1;
        head = "3,4";
    }
    else {
        head = index + "," + (index + 1);
    }

    var str = head + "@" + str;
    for (var i = 0; i < 100; i++) {
        var num = (i + "").padLeft('0', 2);
        if (num[cIndex] != a && num[cIndex] > 5) {
            str += num;
            if (i !== 99) {
                str += "$";
            }
        }
    }

    if (str[str.length - 1] === '$') {
        str = str.substr(0, str.length - 1);
    }

    //{"command_id":521,"lottery_id":"91","issue":"20190428634","count":1,"bet_info":[{"method_id":"120001","number":"3,4@01$02","rebate_count":80,"multiple":"1","mode":3,"bet_money":"0.004","calc_type":"0"}]}

    var beInfo = {
        "method_id": "120001",
        "number": str,
        "rebate_count": 80,
        "multiple": getMutil2(bias),
        "mode": 3,
        "bet_money": (getMutil2(bias) * 0.01) + "",
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

    betInfo = [createBetInfo2(i, a, bias)];
    console.log("下注信息:");
    console.log(betInfo);
    window.betUtil.builderOrderParams(betInfo, issueNumber);
};

var altgoStr = "";

var checkAltgoStr = function (i, cn, newData) {
	if (altgoStr.match(/X{54,}$/) != null) {
        //doBet(i, cn, 2, (parseInt(newData.CP_QS) + 1) + "");
    }
    else if (altgoStr.match(/X{31,40}$/) != null) {
        //doBet(i, cn, 1, (parseInt(newData.CP_QS) + 1) + "");
    }
	
	//var str = altgoStr;
 //   var lastWrong = 0;
	
 //   for (var index = str.length - 1; index >= 0; index--) {
 //       if (str[index] === "X") {
 //           lastWrong++;
 //       }
 //       else {
 //           break;
 //       }
 //   }
	
	//if (altgoStr.match("VX{"+ lastWrong+","+lastWrong+"}VX{"+ lastWrong+","+lastWrong+"}VX{"+ lastWrong+","+lastWrong+"}$") != null){
	//	doBet1(i, cn, 1, (parseInt(newData.CP_QS) + 1) + "");
	//}
};

setInterval(function () {
    var str = altgoStr;
    var wrong = 0;
    var right = 0;
    var lastWrong = 0;

    var perWrongStr = "";
    var perWrong = 0;
    for (var index = 0; index < str.length; index++) {
        if (str[index] === "X") {
            wrong++;
            perWrong++;
        }
        else {
            right++;
            perWrongStr += perWrong + ",";
            perWrong = 0;
        }
    }

    for (var index = str.length - 1; index >= 0; index--) {
        if (str[index] === "X") {
            lastWrong++;
        }
        else {
            break;
        }
    }

    var msg = "V:" + right + "X:" + wrong + "LX:" + lastWrong + "<br/>" + perWrongStr;
    $("#msg").html(msg);

    var workId = window.betUtil.workId();
    $.get("http://127.0.0.1:1500?workId=" + workId + "&content=" + msg + "&reportName=altgo&id=" + timetamp, { }, function () {

    });

}, 30000);

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

                console.logex("策略altgo正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
                altgoStr += "X";
            }
            else {
                isWronging = true;
                console.logex("策略altgo被终结。");
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

            console.logex("策略altgo符合条件！当前倍数:" + policy.bias + "位置：" + (i + 1) + "数字：" + a);
            if (policy.stop === true || policy.stoping === true) {
                console.logex("策略altgo停止，未下注!");
                return;
            }

            checkAltgoStr(i, a, newData);
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

                console.logex("策略dissaltgo正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
                altgoStr += "X";
            }
            else {
                isWronging = true;
                console.logex("策略dissaltgo被终结。");
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

            console.logex("策略dissaltgo符合条件！当前倍数:" + policy.bias + "位置：" + (i + 1) + "数字：" + cn + "加数：" + a);
            if (policy.stop === true || policy.stoping === true) {
                console.logex("策略dissaltgo停止，未下注!");
                return;
            }

            checkAltgoStr(i, cn, newData);
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

                console.logex("策略missaltgo正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
                altgoStr += "X";
            }
            else {
                isWronging = true;
                console.logex("策略missaltgo被终结。");
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

            console.logex("策略missaltgo符合条件！当前倍数:" + policy.bias + "位置：" + (i + 1) + "数字：" + cn + "遗漏位置：" + a);
            if (policy.stop === true || policy.stoping === true) {
                console.logex("策略missaltgo停止，未下注!");
                return;
            }

            checkAltgoStr(i, cn, newData);
        }
    };

    window.policies.push(policy);
})();

var allBrotherTryStr = "";

setInterval(function () {
    var str = allBrotherTryStr;
    var wrong = 0;
    var right = 0;
    var lastWrong = 0;

    var perWrongStr = "";
    var perWrong = 0;
    for (var index = 0; index < str.length; index++) {
        if (str[index] === "V") {
            wrong++;
            perWrong++;
        }
        else {
            right++;
            perWrongStr += perWrong + ",";
            perWrong = 0;
        }
    }

    for (var index = str.length - 1; index >= 0; index--) {
        if (str[index] === "V") {
            lastWrong++;
        }
        else {
            break;
        }
    }

    var msg = "V:" + right + "X:" + wrong + "LX:" + lastWrong + "<br/>" + perWrongStr;
    var workId = window.betUtil.workId();
    $.get("http://127.0.0.1:1500?workId=" + workId + "&content=" + msg + "&reportName=brother&id=" + timetamp, {}, function () {

    });

    $("#brothermsg").html(msg);
}, 30000);

sessionStorage.brotherTry = 0;
var brotherTryStr = "";

var checkBrotherStr = function (tryStr, key) {
    var patt3 = /X{1,}VX{1,}V{0,1}$/;
    var patt1 = /X{2,}V$/;
    var patt2 = /X{1,}V$/;

    if (tryStr.match(patt3) !== null) {
        sessionStorage[key] = 0;
    }
    else if (tryStr.match(patt1) !== null) {
        sessionStorage[key] = 2;
    }
    else if (tryStr.match(patt2) !== null) {
        sessionStorage[key] = 1;
    }
};

var openBrother = function (index, num, newData) {
    if (sessionStorage["brother_start"] != "1") {
        return;
    }

    doBet(index, num, 1, (parseInt(newData.CP_QS) + 1) + "");
};

var createBrother = function (name) {
    var register = function () {
        var watch = findWatch(name);
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
                brotherTryStr += "V";
                allBrotherTryStr += "V";
                console.logex("策略br_" + name + "正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
            }
            else {
                brotherTryStr += "X";
                allBrotherTryStr += "X";
                console.logex("策略br_" + name + "被终结。");
            }

            checkBrotherStr(brotherTryStr, "brotherTry");
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

            console.logex("策略br_" + name + "符合条件！当前倍数:" + policy.bias);

            openBrother(matchItem.index, matchItem.num, newData);
            var brotherTry = parseInt(sessionStorage.brotherTry, 10);
            if (policy.stop === true || policy.stoping === true || brotherTry <= 0 || window.betUtil.workId() == 67) {
                console.logex("策略br_" + name + "未下注！");
                return;
            }

            brotherTry--;
            sessionStorage.brotherTry = brotherTry
            //doBet1(matchItem.index, matchItem.num, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
};

(function () {
    createBrother("loops");
})();

(function () {
    createBrother("double");
})();

(function () {
    createBrother("split");
})();

sessionStorage.missBrotherTry = 0;
var missBrotherTryStr = "";

var createMissBrother = function (name) {
    var register = function () {
        var watch = findWatch(name);
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
                missBrotherTryStr += "V";
                allBrotherTryStr += "V";
                console.logex("策略mbr_" + name + "正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
            }
            else {
                missBrotherTryStr += "X";
                allBrotherTryStr += "X";
                console.logex("策略mbr_" + name + "被终结。");
            }

            checkBrotherStr(missBrotherTryStr, "missBrotherTry");
        },
        tryStart: function (watch, array, newData, currentMisses) {
            if (policy.isRunning) {
                return;
            }

            
            var matchItem = array[0];
            policy.bias = 1;
            policy.CP_QS = newData.CP_QS;
            policy.isRunning = true;
            policy.i = matchItem.index;

            var cn = currentMisses[matchItem.index][matchItem.num].n;
            policy.a = cn;

            console.logex("策略mbr_" + name + "符合条件！当前倍数:" + policy.bias);

            var brotherTry = parseInt(sessionStorage.missBrotherTry, 10);
            openBrother(matchItem.index, cn, newData);

            if (policy.stop === true || policy.stoping === true || brotherTry <= 0 || window.betUtil.workId() == 67) {
                console.logex("策略mbr_" + name + "未下注！");
                return;
            }

            brotherTry--;
            sessionStorage.missBrotherTry = brotherTry;
            //doBet1(matchItem.index, cn, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
};

(function () {
    createMissBrother("missloops");
})();

(function () {
    createMissBrother("missdouble");
})();

(function () {
    createMissBrother("misssplit");
})();

sessionStorage.addBrotherTry = 0;
var addBrotherTryStr = "";
var createAddBrother = function (name) {
    var register = function () {
        var watch = findWatch(name);
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
                addBrotherTryStr += "V";
                allBrotherTryStr += "V";
                console.logex("策略abr_" + name + "正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
            }
            else {
                addBrotherTryStr += "X";
                allBrotherTryStr += "X";
                console.logex("策略abr_" + name + "被终结。");
            }

            checkBrotherStr(addBrotherTryStr, "addBrotherTry");
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

            var cn = parseInt(newData.ZJHM.split(',')[matchItem.index], 10) + matchItem.num;
            if (cn > 9) {
                cn = cn - 10;
            }

            policy.a = cn;

            console.logex("策略abr_" + name + "符合条件！当前倍数:" + policy.bias);
            openBrother(matchItem.index, cn, newData);

            var brotherTry = parseInt(sessionStorage.addBrotherTry, 10);
            if (policy.stop === true || policy.stoping === true || brotherTry <= 0 || window.betUtil.workId() == 67) {
                console.log("策略abr_" + name + "未下注！");
                return;
            }

            brotherTry--;
            sessionStorage.addBrotherTry = brotherTry;
            //doBet1(matchItem.index, cn, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
};

(function () {
    createAddBrother("addloops");
})();

(function () {
    createAddBrother("adddouble");
})();

(function () {
    createAddBrother("addsplit");
})();

var havenStr = "";

setInterval(function () {
    var str = havenStr;
    var wrong = 0;
    var right = 0;
    var lastWrong = 0;

    var perWrongStr = "";
    var perWrong = 0;
    for (var index = 0; index < str.length; index++) {
        if (str[index] === "X") {
            wrong++;
            perWrong++;
        }
        else {
            right++;
            perWrongStr += perWrong + ",";
            perWrong = 0;
        }
    }

    for (var index = str.length - 1; index >= 0; index--) {
        if (str[index] === "X") {
            lastWrong++;
        }
        else {
            break;
        }
    }

    var msg = "V:" + right + "X:" + wrong + "LX:" + lastWrong + "<br/>" + perWrongStr;
    var workId = window.betUtil.workId();
    $.get("http://127.0.0.1:1500?workId=" + workId + "&content=" + msg + "&reportName=haven&id=" + timetamp, {}, function () {

    });

    $("#havenmsg").html(msg);
}, 30000);

(function () {
    var register = function () {
        var watch = findWatch("haven");
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
                havenStr += "X";
                console.logex("策略haven正确盈利一次。当前获利次数：" + policy.wins);
            }
            else {
                havenStr += "V";
                sessionStorage.havenStart = "1";
                console.logex("策略haven被终结。");
            }
        },
        tryStart: function (watch, guy, newData) {
            if (policy.isRunning) {
                return;
            }

            var matchItem = guy;
            policy.bias = 1;
            policy.CP_QS = newData.CP_QS;
            policy.isRunning = true;
            policy.i = matchItem.numIndex;
            policy.a = matchItem.prevNum;

            console.logex("策略haven符合条件！当前倍数:" + policy.bias);

            if (policy.stop === true || policy.stoping === true) {
                console.log("策略" + name + "未下注！");
                return;
            }

            if (sessionStorage.havenStart != "0") {
                return;
            }

            doBet(matchItem.numIndex, matchItem.prevNum, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
})();

var createReverse = function (name) {
    var register = function () {
        var watch = findWatch(name);
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

            var matchItem = array[0];
            policy.bias = 1;
            policy.CP_QS = newData.CP_QS;
            policy.isRunning = true;
            policy.i = matchItem.index;
            policy.a = matchItem.num;

            console.logex("策略" + name + "符合条件！当前倍数:" + policy.bias);
            if (policy.stop === true || policy.stoping === true) {
                console.logex("策略" + name + "未下注！");
                return;
            }
            
            //doBet1(matchItem.index, matchItem.num, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
};

(function () {
    createReverse("reverse");
})();

(function () {
    createReverse("reverse4");
})();

(function () {
    createReverse("reverse5");
})();