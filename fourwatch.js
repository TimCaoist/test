
var filterThreeNumber = function (n) {
    var array = [];
    for (var i = 0; i < n.length; i++) {
        array.push(n[i]);
    }

    array.sort(function (a, b) { return a - b });
    return !(array[0] == array[1] && array[2] == array[1]) && !(array[1] == array[2] && array[2] == array[3]) ;
};

var filterDoubleNumber = function (n) {
    var array = [];
    for (var i = 0; i < n.length; i++) {
        array.push(n[i]);
    }

    array.sort(function (a, b) { return a - b });
    return !(array[0] == array[1] && array[2] == array[3]);
};

var filterLoop = function (n, limit) {
    var count = 0;
    var array = [];
    for (var i = 0; i < n.length; i++) {
        array.push(n[i]);
    }

    array.sort(function (a, b) { return a - b });
    for (var i = 1; i < array.length; i++) {
        var prev = array[i - 1];
        var current = array[i];
        if (current - prev == 1) {
            count++;
        }
    }

    return count < limit;
};


var filterFourLoop = function (n) {
    return filterLoop(n, 3);
};

var filterThreeLoop = function (n) {
    return filterLoop(n, 2);
};


var fourWatchUtil = {
    reports: []
};

(function () {
    var sortFunc = function (a, b) {
        return a - b;
    }

    var getNums = function (storeDatas, i, indexex, sort) {
        var nums = [];
        for (var ii in indexex) {
            var n = fetchHistroy(storeDatas, i, indexex[ii]);
            nums.push(n);
        }

        if (typeof sort == "function") {
            nums.sort(sort);
        }
        else{
            nums.sort(sortFunc);
        }

        return nums;
    };

    fourWatchUtil.getNums = getNums;
})();

(function () {
    var builderMissReport = function (storeDatas) {
        var indexex = $("#tbFourType").val() == '1' ? [1, 2, 3, 4] : [0, 1, 2, 3];
        var fiveIndex = $("#tbFourType").val() == '1' ? 0 : 4;
        var str = "";
        for (var i = storeDatas.length - 10; i <= storeDatas.length - 1; i++) {
            str += "<div>";
            for (var n = 0; n < 10; n++) {
                var isFound = false;
                for (var index in indexex) {
                    var num = fetchHistroy(storeDatas, i, indexex[index]);
                    if (n == num) {
                        isFound = true;
                        break;
                    }
                }

                if (isFound) {
                    str += "<span style='display:block;float:left;width:20px;'>" + n + "</span>";
                }
                else {
                    var fiveNum = fetchHistroy(storeDatas, i, fiveIndex);
                    str += "<span style='display:block;float:left;width:20px;color:green'>" + (fiveNum == n ? "O" : "X") + "</span>";
                }
            }

            str += "</div>";
            str += "<div style='clear: left'></div>";
        }

        return str;
    };

    fourWatchUtil.reports.push(builderMissReport);
})();

var onMinMaxClick = function () {
    var m = $(this).attr("method");
    var v = parseInt($(this).attr("val"), 10);

    $("#tbFourType").val($(this).attr("index"));
    var betStr = "";
    if (m == '0') {
        for (var i = v; i < v + 5; i++) {
            betStr += i;
        }
    }
    else {
        for (var i = v - 4; i <= v; i ++) {
            betStr += i;
        }
    }

    $("#tbFourNum").val(betStr);
};

(function () {
    var getLoopCount = function (storeDatas, i, indexex) {
        var nums = fourWatchUtil.getNums(storeDatas, i, indexex);
        var max = 0;
        var lasMatchNumbers = [];
        for (var a = 1; a < nums.length; a++) {
            var na = nums[a - 1];
            var nb = nums[a];
            var cc = 0;
            if (nb - na == 1) {
                cc = 1;
                var start = parseInt(nb, 10);
                var startA = (start + 1) + '';
                var startB = (start + 2) + '';
                for (var b = i + 1; b < storeDatas.length; b++) {
                    var bNums = fourWatchUtil.getNums(storeDatas, b, indexex);
                    if (bNums.indexOf(startA) > -1 && bNums.indexOf(startB) > -1) {
                        cc++;
                        start = parseInt(startB, 10);
                        startA = (start + 1) + '';
                        startB = (start + 2) + '';
                    }
                    else {
                        break;
                    }
                }

                if (max < cc) {
                    max = cc;
                    lasMatchNumbers = [startA, startB];
                }
            }
        }

        return {
            max: max,
            numbers: lasMatchNumbers
        };
    };

    fourWatchUtil.getLoopCount = getLoopCount;

    var getMinLoopCount = function (storeDatas, i, indexex) {
        var nums = fourWatchUtil.getNums(storeDatas, i, indexex);
        var max = 0;
        var lasMatchNumbers = [];
        for (var a = 1; a < nums.length; a++) {
            var na = nums[a - 1];
            var nb = nums[a];
            var cc = 0;
            if (nb - na == 1) {
                cc = 1;
                var start = parseInt(na, 10);
                var startA = (start - 2) + '';
                var startB = (start - 1) + '';
                for (var b = i + 1; b < storeDatas.length; b++) {
                    var bNums = fourWatchUtil.getNums(storeDatas, b, indexex);
                    if (bNums.indexOf(startA) > -1 && bNums.indexOf(startB) > -1) {
                        
                        cc++;
                        start = parseInt(startA, 10);
                        startA = (start - 2) + '';
                        startB = (start - 1) + '';
                    }
                    else {
                        break;
                    }
                }

                if (max < cc) {
                    max = cc;
                    lasMatchNumbers = [startA, startB];
                }
            }
        }

        return {
            max: max,
            numbers: lasMatchNumbers
        };
    };

    fourWatchUtil.getMinLoopCount = getMinLoopCount;
})();

(function () {
    var show = function (storeDatas, type) {
        var indexex = type == '1' ? [1, 2, 3, 4] : [0, 1, 2, 3];
        var str = "<div method='0' index='" + type + "'>>_" + type + ":";
        var i = storeDatas.length - 20;
        while (i < storeDatas.length - 1) {
            var max = fourWatchUtil.getLoopCount(storeDatas, i, indexex).max;
            if (max == 0) {
                i++;
            }
            else {
                i += max;
            }

            str += max;
        }

        str += "</div>";
        return str;
    }

    var builderMinNumberMissReport = function (storeDatas) {
        var str = "";
        str += show(storeDatas, '1');
        str += show(storeDatas, '0');
        return str;
    };

    fourWatchUtil.reports.push(builderMinNumberMissReport);
})();

(function () {
    var print = function (storeDatas, indexex) {
        var str = "";
        for (var a = 0; a < 7; a++) {
            for (var b = a + 1; b <8; b++) {
                for (var c = b + 1; c < 9; c++) {
                    for (var d = c + 1; d < 10; d++) {
                        str += "<div> " + a + "," + b + "," + c + "," + d + ":";
                        for (var i = 0; i < storeDatas.length; i++) {
                            var bNums = fourWatchUtil.getNums(storeDatas, i, indexex);
                            if (bNums.indexOf(a + '') > -1 || bNums.indexOf(b + '') > -1 || bNums.indexOf(c + '') > -1 || bNums.indexOf(d + '') > -1) {
                                str += "V";
                            }
                            else {
                                str += "X";
                            }
                        }

                        str += "</div>";
                    }
                }
            }
        }

        return str;
    };

    

    var show = function (storeDatas, type) {
        var indexex = type == '1' ? [1, 2, 3, 4] : [0, 1, 2, 3];
        var str = print(storeDatas, indexex);
        return str;
    }

    var builderMinNumberMissReport = function (storeDatas) {
        var str = "";
        str += show(storeDatas, '1');
        str += show(storeDatas, '0');
        return str;
    };

    //fourWatchUtil.reports.push(builderMinNumberMissReport);
})();

(function () {
    var show = function (storeDatas, type) {
        var indexex = type == '1' ? [1, 2, 3, 4] : [0, 1, 2, 3];
        var str = "<div method='0' index='" + type + "'><_" + type + ":";
        var i = storeDatas.length - 20;
        while (i < storeDatas.length - 1) {
            var max = fourWatchUtil.getMinLoopCount(storeDatas, i, indexex).max;
            if (max == 0) {
                i++;
            }
            else {
                i += max;
            }

            str += max;
        }

        str += "</div>";
        return str;
    }

    var builderMinNumberMissReport = function (storeDatas) {
        var str = "";
        str += show(storeDatas, '1');
        str += show(storeDatas, '0');
        return str;
    };

    fourWatchUtil.reports.push(builderMinNumberMissReport);
})();

(function () {
    var getmaxnums = function (ns) {
        if (ns[0] <= 7) {
            var p = parseInt(ns[0], 10);
            return [(p + 1) + '', (p + 2) + ''];
        }

        var p = ns[0];
        var isFound = false;
        for (var a = 1; a < ns.length; a++) {
            if (p - ns[a] <= 2) {
                p = ns[a];
                continue;
            }

            p = ns[a];
            isFound = true;
            break;
        }

        if (isFound == false) {
            return null;
        }

        p = parseInt(p, 10);
        return [(p + 1) + '', (p + 2) + ''];
    };

    var sort = function (a, b) {
        return b - a;
    };

    var show = function (storeDatas, type) {
        var indexex = type == '1' ? [1, 2, 3, 4] : [0, 1, 2, 3];
        var str = "<div method='0' index='" + type + "'>max_" + type + ":";
        for (var i = storeDatas.length - 20; i < storeDatas.length - 1; i++) {
            var ns = fourWatchUtil.getNums(storeDatas, i, indexex, sort);
            var pNs = getmaxnums(ns);
            if (pNs == null) {
                continue;
            }

            var nNs = fourWatchUtil.getNums(storeDatas, i + 1, indexex, sort);
            if (nNs.indexOf(pNs[0]) > -1 && nNs.indexOf(pNs[1]) > -1) {
                str += "X";
            }
            else {
                str += "V";
            }
        }

        var ccNs = fourWatchUtil.getNums(storeDatas, storeDatas.length - 1, indexex, sort);
        var ccMax = getmaxnums(ccNs);
        if (ccMax !== null) {
            str += '|' + ccMax[0] + ',' + ccMax[1];
        }

        str += "</div>";
        return str;
    }

    var builderMinNumberMissReport = function (storeDatas) {
        var str = "";
        str += show(storeDatas, '1');
        str += show(storeDatas, '0');
        return str;
    };

    fourWatchUtil.reports.push(builderMinNumberMissReport);
})();

(function () {
    var numbers = [];

    for (var a = 0; a < 8; a++) {
        var str = '';
        for (var b = a; b < a + 3; b++) {
            str += b;
        }

        numbers.push(str);
    }

    var find = function (histroyDatas, indexes) {
        for (var item in numbers) {
            var isFound = false;
            for (var i = histroyDatas.length - 1; i >= histroyDatas.length - 4; i--) {
                for (var subItem in numbers[item]) {
                    for (var index in indexes) {
                        var n = fetchHistroy(histroyDatas, i, indexes[index]);
                        if (numbers[item][subItem] == n) {
                            isFound = true;
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

            if (isFound == false) {
                return numbers[item];
            }
        }

        return null;
    }

    var watch = {
        name: "fourwatch",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var match = find(histroyDatas, [0, 1, 2, 3]);
            if (match == null) {
                match = find(histroyDatas, [1, 2, 3, 4]);
                if (match != null) {
                    //console.logex("策略fourwatch符合条件！");
                    $("#tbFourType").val('1');
                    $("#tbFourNum").val(match);
                }
            }
            else {
                //console.logex("策略fourwatch符合条件！");
                $("#tbFourType").val('0');
                $("#tbFourNum").val(match);
            }
        }
    };

    window.watchers.push(watch);
})();

(function () {
    sessionStorage["fourright_0"] = 0;
    sessionStorage["fourright_1"] = 0;

    var find = function (histroyDatas, indexes) {
        var pi = histroyDatas.length - 2;
        var loopInfo = fourWatchUtil.getLoopCount(storeDatas, pi, indexes);
        var max = loopInfo.max;
        if (max < 2) {
            return null;
        }

        var numbers = loopInfo.numbers;
        if (numbers[1] > 9) {
            return null;
        }

        return {
            index: indexes[0],
            nums: numbers,
            t: 1
        }

        return null;
    }

    var watch = {
        name: "fourright",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var nameKey = "fourright_0";
            var fh = parseInt(sessionStorage[nameKey], 10);
            var match = null;
            if (fh == 1) {
                match = find(histroyDatas, [0, 1, 2, 3]);
            }
            else {
                nameKey = "fourright_1";
                fh = parseInt(sessionStorage[nameKey], 10);
                if (fh == 1) {
                    match = find(histroyDatas, [1, 2, 3, 4]);
                }
                else {
                    return;
                }
            }

            if (match == null) {
                return;
            }

            sessionStorage[nameKey] = 0;
            console.log(match);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, match, newData);
            }
        }
    };

    window.watchers.push(watch);
})();

(function () {
    sessionStorage["fourleft_0"] = 0;
    sessionStorage["fourleft_1"] = 0;

    var find = function (histroyDatas, indexex) {
        var pi = histroyDatas.length - 2;
        var loopInfo = fourWatchUtil.getMinLoopCount(storeDatas, pi, indexex);
        var max = loopInfo.max;
        if (max < 2) {
            return null;
        }

        var numbers = loopInfo.numbers;
        if (numbers[0] < 0 || numbers[1] < 0) {
            return null;
        }

        return {
            index: indexex[0],
            nums: loopInfo.numbers,
            t: 1
        }

        return null;
    }

    var watch = {
        name: "fourleft",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var nameKey = "fourleft_0";
            var fh = parseInt(sessionStorage[nameKey], 10);
            var match = null;
            if (fh == 1) {
                match = find(histroyDatas, [0, 1, 2, 3]);
            }
            else {
                nameKey = "fourleft_1";
                fh = parseInt(sessionStorage[nameKey], 10);
                if (fh == 1) {
                    match = find(histroyDatas, [1, 2, 3, 4]);
                }
                else {
                    return;
                }
            }

            if (match == null) {
                return;
            }

            sessionStorage[nameKey] = 0;
            console.log(match);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, match, newData);
            }
        }
    };

    window.watchers.push(watch);
})();

(function () {
    var find = function (storeDatas, indexex) {
        var pi = storeDatas.length - 3;
        var loopInfo = fourWatchUtil.getMinLoopCount(storeDatas, pi, indexex);
        var max = loopInfo.max;
        if (max < 3) {
            return null;
        }

        var numbers = loopInfo.numbers;
        var numbers = loopInfo.numbers;
        if (numbers[0] < 0 || numbers[1] < 0) {
            return null;
        }

        return {
            index: indexex[0],
            nums: loopInfo.numbers,
            t: 1
        }

        return null;
    }

    var watch = {
        name: "fourleft3",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var match = find(histroyDatas, [0, 1, 2, 3]);
            if (match == null) {
                match = find(histroyDatas, [1, 2, 3, 4]);
            }

            if (match == null) {
                return;
            }

            console.log(match);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, match, newData);
            }
        }
    };

    window.watchers.push(watch);
})();

(function () {
    var find = function (storeDatas, indexes) {
        var pi = storeDatas.length - 3;
        var loopInfo = fourWatchUtil.getLoopCount(storeDatas, pi, indexes);
        var max = loopInfo.max;
        if (max < 3) {
            return null;
        }

        var numbers = loopInfo.numbers;
        if (numbers[1] > 9) {
            return null;
        }

        return {
            index: indexes[0],
            nums: numbers,
            t: 1
        }

        return null;
    }

    var watch = {
        name: "fourright3",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var match = find(histroyDatas, [0, 1, 2, 3]);
            if (match == null) {
                match = find(histroyDatas, [1, 2, 3, 4]);
            }

            if (match == null) {
                return;
            }

            console.log(match);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, match, newData);
            }
        }
    };

    window.watchers.push(watch);
})();

(function () {
    var find = function (storeDatas, indexex) {
        var pi = storeDatas.length - 3;
        var loopInfo = fourWatchUtil.getLoopCount(storeDatas, pi, indexex);
        if (loopInfo.max == 3) {
            return null;
        }

        loopInfo = fourWatchUtil.getLoopCount(storeDatas, pi + 1, indexex);
        if (loopInfo.max != 2) {
            return null;
        }

        var c = 0;
        var i = pi;
        while (i >= storeDatas.length - 103) {
            var info = fourWatchUtil.getLoopCount(storeDatas, i - 3, indexex);
            if (info.max == 3) {
                c++;
                i -= 3;
                if (c >= 2) {
                    break;
                }
            }
            else {
                info = fourWatchUtil.getLoopCount(storeDatas, i - 2, indexex);
                if (info.max == 2) {
                    break;
                }

                i--;
            }
        }

        if (c < 2) {
            return null;
        }

        var numbers = loopInfo.numbers;
        if (numbers[1] > 9) {
            return null;
        }

        return {
            index: indexex[0],
            nums: numbers,
            t: 1
        }

    }

    var watch = {
        name: "fourdoubleright",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var match = find(histroyDatas, [0, 1, 2, 3]);
            if (match == null) {
                match = find(histroyDatas, [1, 2, 3, 4]);
            }

            if (match == null) {
                return;
            }

            console.log(match);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, match, newData);
            }
        }
    };

    window.watchers.push(watch);
})();

(function () {
    var find = function (storeDatas, indexex) {
        var pi = storeDatas.length - 3;
        var loopInfo = fourWatchUtil.getMinLoopCount(storeDatas, pi, indexex);
        if (loopInfo.max == 3) {
            return null;
        }

        loopInfo = fourWatchUtil.getMinLoopCount(storeDatas, pi + 1, indexex);
        if (loopInfo.max != 2) {
            return null;
        }

        var c = 0;
        var i = pi;
        while (i >= storeDatas.length - 103) {
            var info = fourWatchUtil.getMinLoopCount(storeDatas, i - 3, indexex);
            if (info.max == 3) {
                c++;
                i -= 3;
                if (c >= 2) {
                    break;
                }
            }
            else {
                info = fourWatchUtil.getMinLoopCount(storeDatas, i - 2, indexex);
                if (info.max == 2) {
                    break;
                }

                i--;
            }
        }

        if (c < 2) {
            return null;
        }

        var numbers = loopInfo.numbers;
        if (numbers[0] < 0 || numbers[1] < 0) {
            return null;
        }

        return {
            index: indexex[0],
            nums: numbers,
            t: 1
        }
    }

    var watch = {
        name: "fourdoubleleft",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var match = find(histroyDatas, [0, 1, 2, 3]);
            if (match == null) {
                match = find(histroyDatas, [1, 2, 3, 4]);
            }

            if (match == null) {
                return;
            }

            console.log(match);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, match, newData);
            }
        }
    };

    window.watchers.push(watch);
})();