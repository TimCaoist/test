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
            return 100;
        default:
            return 100;
    }
};

sessionStorage.bet_money_1 = 5600;

var getMutil1 = function (b) {
    return parseInt(sessionStorage.bet_money_1, 10);
    //switch (b) {
    //    case 2:
    //        return 400;
    //    default:
    //        return 250;
    //}
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
    var betInfo = [createBetInfo1(i, a, bias), createBetInfo2(i, a, bias)];
    console.log("下注信息:");
    console.log(betInfo);
    window.betUtil.builderOrderParams(betInfo, issueNumber);

    //betInfo = [createBetInfo2(i, a, bias)];
    //console.log("下注信息:");
    //console.log(betInfo);
    //window.betUtil.builderOrderParams(betInfo, issueNumber);
};

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

sessionStorage["brother_bet_start"] = "0";
var checkBrotherStr = function () {
    if (sessionStorage["brother_bet_start"] == "1") {
        var patt2 = /X{2,}V{1,}X{1,}$/;
        if (allBrotherTryStr.match(patt2) !== null) {
            sessionStorage["brotherTry"] = 1;
        }
    }
    else if (sessionStorage["brother_bet_start"] == "2") {
        var patt2 = /X{1,}$/;
        if (allBrotherTryStr.match(patt2) !== null) {
            sessionStorage["brotherTry"] = 1;
        }
    }
};

var openBrother = function (index, num, newData, type) {
    if (type === 1) {
        doBet1(index, num, 1, (parseInt(newData.CP_QS) + 1) + "");
        return;
    }

    if (parseInt(sessionStorage.brotherTry, 10) > 0) {
        sessionStorage.brotherTry = 0;
        doBet1(index, num, 1, (parseInt(newData.CP_QS) + 1) + "");
        return;
    }

    if (sessionStorage["brother_start"] != "1") {
        return;
    }

    if (allBrotherTryStr.match(/V{10,}$/) !== null) {
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
                if (policy.type === 0) {
                    brotherTryStr += "V";
                    allBrotherTryStr += "V";
                }

                console.logex("策略br_" + name + "正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
            }
            else {
                if (policy.type === 0) {
                    brotherTryStr += "X";
                    allBrotherTryStr += "X";
                }

                console.logex("策略br_" + name + "被终结。");
            }

            checkBrotherStr();
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
            policy.type = matchItem.mtype;

            console.logex("策略br_" + name + "符合条件！当前倍数:" + policy.bias);

            openBrother(matchItem.index, matchItem.num, newData, matchItem.mtype);
            //var brotherTry = parseInt(sessionStorage.brotherTry, 10);
            //if (policy.stop === true || policy.stoping === true || brotherTry <= 0) {
            //    console.logex("策略br_" + name + "未下注！");
            //    return;
            //}

            //brotherTry--;
            //sessionStorage.brotherTry = brotherTry
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
                if (policy.type === 0) {
                    missBrotherTryStr += "V";
                    allBrotherTryStr += "V";
                }

                console.logex("策略mbr_" + name + "正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
            }
            else {
                if (policy.type === 0) {
                    missBrotherTryStr += "X";
                    allBrotherTryStr += "X";
                }

                console.logex("策略mbr_" + name + "被终结。");
            }

            checkBrotherStr();
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
            policy.type = matchItem.mtype;

            var cn = currentMisses[matchItem.index][matchItem.num].n;
            policy.a = cn;

            console.logex("策略mbr_" + name + "符合条件！当前倍数:" + policy.bias);

            var brotherTry = parseInt(sessionStorage.missBrotherTry, 10);
            openBrother(matchItem.index, cn, newData, matchItem.mtype);

            //if (policy.stop === true || policy.stoping === true || brotherTry <= 0) {
            //    console.logex("策略mbr_" + name + "未下注！");
            //    return;
            //}

            //brotherTry--;
            //sessionStorage.missBrotherTry = brotherTry;
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
                if (policy.type === 0) {
                    addBrotherTryStr += "V";
                    allBrotherTryStr += "V";
                }

                console.logex("策略abr_" + name + "正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
            }
            else {
                if (policy.type === 0) {
                    addBrotherTryStr += "X";
                    allBrotherTryStr += "X";
                }

                console.logex("策略abr_" + name + "被终结。");
            }

            checkBrotherStr();
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
            policy.type = matchItem.mtype;

            var cn = parseInt(newData.ZJHM.split(',')[matchItem.index], 10) + matchItem.num;
            if (cn > 9) {
                cn = cn - 10;
            }

            policy.a = cn;

            console.logex("策略abr_" + name + "符合条件！当前倍数:" + policy.bias);
            openBrother(matchItem.index, cn, newData, matchItem.mtype);

            //var brotherTry = parseInt(sessionStorage.addBrotherTry, 10);
            //if (policy.stop === true || policy.stoping === true || brotherTry <= 0) {
            //    console.log("策略abr_" + name + "未下注！");
            //    return;
            //}

            //brotherTry--;
            //sessionStorage.addBrotherTry = brotherTry;
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

sessionStorage.havenStart = "0";
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

            if (policy.stop === true || policy.stoping === true || (sessionStorage.havenStart != "1" && sessionStorage.havenStart != "2")) {
                console.log("策略haven未下注！");
                return;
            }

            var patt2 = /V{2,}X{1,}V{1,}$/;
            if (sessionStorage.havenStart == "2") {
                patt2 = /V{1,}$/;
            }

            if (havenStr.match(patt2) === null) {
                console.log("策略haven未下注！");
                return;
            }

            doBet1(matchItem.numIndex, matchItem.prevNum, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
})();

var reverseStr = "";

setInterval(function () {
    var str = reverseStr;
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
    $.get("http://127.0.0.1:1500?workId=" + workId + "&content=" + msg + "&reportName=reverse&id=" + timetamp, {}, function () {

    });

    $("#msg").html(msg);
}, 30000);

sessionStorage["reverseStart"] = "0";

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
                if (name === "reverse") {
                    reverseStr += "X";
                }
                
                policy.wins++;
                batchWins++;
                console.logex("策略" + name + "正确盈利一次。当前获利次数：" + policy.wins + "总盈利: " + batchWins);
            }
            else {
                if (name === "reverse") {
                    reverseStr += "V";
                }

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

            if ((name === "reverseAdv5" && sessionStorage["reverse5Start"] != "1") || name === "kongmin" || name === "kongmax") {
                console.logex("策略" + name + "未下注！");
                return;
            }

            if (name === "reverse") {
                if (sessionStorage["reverseStart"] != "1" && sessionStorage["reverseStart"] != "2") {
                    console.logex("策略" + name + "未下注！");
                    return;
                }

                var patt2 = /V{2,}X{1,}V{1,}$/;
                if (sessionStorage["reverseStart"] == "2") {
                    patt2 = /V{1,}$/;
                }

                if (reverseStr.match(patt2) === null) {
                    console.logex("策略" + name + "未下注！");
                    return;
                }
            }

            doBet1(matchItem.index, matchItem.num, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
};

(function () {
    createReverse("reverse");
})();

(function () {
    createReverse("reverse3");
})();

(function () {
    createReverse("reverse4");
})();

(function () {
    createReverse("reverse6");
})();

(function () {
    createReverse("reverseAdv");
})();

(function () {
    createReverse("reverseAdv5");
})();

(function () {
    createReverse("kongmin");
    createReverse("kongmax");
})();