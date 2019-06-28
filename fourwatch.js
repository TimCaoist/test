
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
    var getMinNum = function (storeDatas, i) {
        var nums = [];
        for (var a = 0; a < 5; a++) {
            var n = fetchHistroy(storeDatas, i, a);
            if (nums.indexOf(n) > -1) {
                continue;
            }

            nums.push(n);
        }

        nums.sort(function (a, b) { return a - b });

        var min = 0;
        for (var ni = 1; ni < nums.length; ni++) {
            var prevn = nums[ni - 1];
            var cn = nums[ni];
            if (cn - prevn != 1) {
                min = prevn;
                break;
            }

            if (ni === nums.length - 1 && cn - prevn == 1) {
                min = cn;
            }
        }

        return min;
    };

    var show = function (storeDatas, type) {
        var indexex = type == '1' ? [1, 2, 3, 4] : [0, 1, 2, 3];
        var fiveIndex = type == '1' ? 0 : 4;

        var cmin = getMinNum(storeDatas, storeDatas.length - 1);
        var str = "<div class='minmax' method='0' val='" + cmin + "'  index='" + type + "'>Min_" + type + ":";
        for (var i = storeDatas.length - 15; i < storeDatas.length - 1; i++) {
            var min = parseInt(getMinNum(storeDatas, i), 10);
            if (min > 5) {
                str += "P";
                continue;
            }

            var isFound = false;
            for (var d = min; d < min + 5; d++) {
                for (var index in indexex) {
                    var num = fetchHistroy(storeDatas, i + 1, indexex[index]);
                    if (d == num) {
                        isFound = true;
                        break;
                    }
                }

                if (isFound) {
                    break;
                }
            }

            if (isFound) {
                str += "V";
            }
            else {
                var fiveNum = parseInt(fetchHistroy(storeDatas, i + 1, fiveIndex), 10);
                str += (fiveNum >= min && fiveNum <= min + 4) ? "O" : "X";
            }
        }

        str += ":" + cmin;
        str += "</div>";
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
    var getMinNum = function (storeDatas, i) {
        var nums = [];
        for (var a = 0; a < 5; a++) {
            var n = fetchHistroy(storeDatas, i, a);
            if (nums.indexOf(n) > -1) {
                continue;
            }

            nums.push(n);
        }

        nums.sort(function (a, b) { return a - b });

        var min = 0;
        for (var ni = nums.length - 2; ni >= 0; ni--) {
            var prevn = nums[ni + 1];
            var cn = nums[ni];
            if (prevn - cn != 1) {
                min = prevn;
                break;
            }

            if (ni === 0 && prevn - cn == 1) {
                min = cn;
            }
        }

        return min;
    };

    var show = function (storeDatas, type) {
        var indexex = type == '1' ? [1, 2, 3, 4] : [0, 1, 2, 3];
        var fiveIndex = type == '1' ? 0 : 4;

        var cmin = getMinNum(storeDatas, storeDatas.length - 1);
        var str = "<div class='minmax' method='1' val='" + cmin + "' index='" + type + "' >Max_" + type + ":";
        for (var i = storeDatas.length - 15; i < storeDatas.length - 1; i++) {
            var min = parseInt(getMinNum(storeDatas, i), 10);
            if (min < 5) {
                str += "P";
                continue;
            }

            var isFound = false;
            for (var d = min; d > min - 5; d--) {
                for (var index in indexex) {
                    var num = fetchHistroy(storeDatas, i + 1, indexex[index]);
                    if (d == num) {
                        isFound = true;
                        break;
                    }
                }

                if (isFound) {
                    break;
                }
            }

            if (isFound) {
                str += "V";
            }
            else {
                var fiveNum = parseInt(fetchHistroy(storeDatas, i + 1, fiveIndex), 10);
                str += (fiveNum <= min && fiveNum >= min - 4) ? "O" : "X";
            }
        }

        str += ":" + cmin;
        str += "</div>";
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
    var numbers = [];
    for (var a = 0; a < 5; a++) {
        var str = '';
        for (var b = a; b < a + 6; b++) {
            str += b;
        }

        numbers.push(str);
    }

    var builderDistNumberMissReport = function (storeDatas) {
        var indexex = $("#tbFourType").val() == '1' ? [1, 2, 3, 4] : [0, 1, 2, 3];
        var fiveIndex = $("#tbFourType").val() == '1' ? 0 : 4;

        var str = "";
        for (var ni in numbers) {
            str += "<div>" + numbers[ni] + ":";
            for (var i = storeDatas.length - 1; i >= 0; i--) {
                var isFound = false;
                for (var index in indexex) {
                    var num = fetchHistroy(storeDatas, i, indexex[index]);
                    if (numbers[ni].indexOf(num) > -1) {
                        isFound = true;
                        break;
                    }
                }

                if (isFound == true) {
                    str += "V";
                }
                else {
                    str += "X";
                }
            }

            str += "</div>";
        }

        return str;
    };

   //fourWatchUtil.reports.push(builderDistNumberMissReport);
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
                    console.logex("策略fourwatch符合条件！");
                    $("#tbFourType").val('1');
                    $("#tbFourNum").val(match);
                }
            }
            else {
                console.logex("策略fourwatch符合条件！");
                $("#tbFourType").val('0');
                $("#tbFourNum").val(match);
            }
        }
    };

    window.watchers.push(watch);
})();

(function () {
    var getMinNumbers = function (indexes, i, histroyDatas) {
        var prevNs = [];
        for (var index in indexes) {
            var pn = fetchHistroy(histroyDatas, i, indexes[index]);
            prevNs.push(pn);
        }

        prevNs.sort(function (a, b) { return a - b });

        var min = prevNs[0];
        for (var pi = 1; pi < prevNs.length; pi++) {
            if (prevNs[pi] - min == 0) {
                continue;
            }

            if (prevNs[pi] - min <= 1) {
                min = prevNs[pi];
            }
            else {
                break;
            }
        }

        if (min > 7) {
            return []
        }

        var m = parseInt(min, 10);
        return [m + 1, m + 2];
    };

    var find = function (histroyDatas, indexes) {
        var str = "";
        for (var i = histroyDatas.length - 1; i >= 1; i--) {
            var ns = [];
            for (var index in indexes) {
                var n = fetchHistroy(histroyDatas, i, indexes[index]);
                ns.push(n);
            }

            var cNums = getMinNumbers(indexes, i - 1, histroyDatas);
            if (cNums.length < 2) {
                continue;
            }

            if (ns.indexOf(cNums[0]) > -1 && ns.indexOf(cNums[1]) > -1) {
                str += "X";
            }
            else {
                str += "V";
            }

            if (str.length > 15) {
                break;
            }
        }

        if (str.match(/X{3,}/) != null || str.match(/XVX{2,}/) != null) {
            console.logex(str);
            var cNs = getMinNumbers(indexes, histroyDatas.length - 1, histroyDatas);
            if (cNs.length < 2) {
                return null;
            }

            return {
                index: indexes[0],
                nums: cNs,
                t: 1
            };
        }

        return null;
    }

    var watch = {
        name: "fourmin2",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = find(histroyDatas, [0, 1, 2, 3]);
            if (matchArry == null) {
                matchArry = find(histroyDatas, [1, 2, 3, 4]);
                if (matchArry != null) {
                    console.log(matchArry);
                    for (var a = 0; a < watch.policies.length; a++) {
                        watch.policies[a].tryStart(watch, matchArry, newData);
                    }
                }
            }
            else {
                console.log(matchArry);
                for (var a = 0; a < watch.policies.length; a++) {
                    watch.policies[a].tryStart(watch, matchArry, newData);
                }
            }
        }
    };

    window.watchers.push(watch);
})();

(function () {
    var getMinNumbers = function (indexes, i, histroyDatas) {
        var prevNs = [];
        for (var index in indexes) {
            var pn = fetchHistroy(histroyDatas, i, indexes[index]);
            prevNs.push(pn);
        }

        prevNs.sort(function (a, b) { return a - b });

        var ms = [];
        for (var pi = 0; pi < prevNs.length; pi++) {
            if (ms.indexOf(prevNs[pi]) > -1) {
                continue;
            }

            ms.push(prevNs[pi]);
            if (ms.length == 2) {
                break;
            }
        }

        return ms;
    };

    var find = function (histroyDatas, indexes) {
        var str = "";
        for (var i = histroyDatas.length - 1; i >= 1; i--) {
            var ns = [];
            for (var index in indexes) {
                var n = fetchHistroy(histroyDatas, i, indexes[index]);
                ns.push(n);
            }

            var cNums = getMinNumbers(indexes, i - 1, histroyDatas);
            if (cNums.length < 2) {
                continue;
            }

            if (ns.indexOf(cNums[0]) > -1 && ns.indexOf(cNums[1]) > -1) {
                str += "X";
            }
            else {
                str += "V";
            }

            if (str.length > 15) {
                break;
            }
        }

        if (str.match(/X{3,}/) != null || str.match(/XVX{2,}/) != null) {
            console.logex(str);
            var cNs = getMinNumbers(indexes, histroyDatas.length - 1, histroyDatas);
            if (cNs.length < 2) {
                return null;
            }

            return {
                index: indexes[0],
                nums: cNs,
                t: 1
            };
        }

        return null;
    }

    var watch = {
        name: "fourpaiwei",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var match = find(histroyDatas, [0, 1, 2, 3]);
            if (match == null) {
                match = find(histroyDatas, [1, 2, 3, 4]);
                if (match != null) {
                    console.log(match);
                    for (var a = 0; a < watch.policies.length; a++) {
                        watch.policies[a].tryStart(watch, match, newData);
                    }
                }
            }
            else {
                console.log(match);
                for (var a = 0; a < watch.policies.length; a++) {
                    watch.policies[a].tryStart(watch, match, newData);
                }
            }
        }
    };

    window.watchers.push(watch);
})();