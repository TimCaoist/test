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
        }

        return min;
    };

    var builderMinNumberMissReport = function (storeDatas) {
        var indexex = $("#tbFourType").val() == '1' ? [1, 2, 3, 4] : [0, 1, 2, 3];
        var fiveIndex = $("#tbFourType").val() == '1' ? 0 : 4;

        var str = "<div>";
        for (var i = storeDatas.length - 15; i < storeDatas.length - 1; i++) {
            var min = getMinNum(storeDatas, i);
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
                var nmin = parseInt(min, 10);
                str += (fiveNum >= nmin && fiveNum <= nmin + 4) ? "O" : "X";
            }
        }

        var cmin = getMinNum(storeDatas, storeDatas.length - 1);
        str += ":" + cmin;
        str += "</div>";
        return str;
    };

    fourWatchUtil.reports.push(builderMinNumberMissReport);
})();

(function () {
    var getDistNum = function (storeDatas, i) {
        var nums = [];
        for (var a = 0; a < 5; a++) {
            var n = fetchHistroy(storeDatas, i, a);
            if (nums.indexOf(n) > -1) {
                continue;
            }

            nums.push(n);
        }

        var disNums = [];
        for (var d = 0; d < 10; d++) {
            var cn = d + '';
            if (nums.indexOf(cn) > -1) {
                continue;
            }

            disNums.push(cn);
        }

        return disNums;
    };

    var builderDistNumberMissReport = function (storeDatas) {
        var indexex = $("#tbFourType").val() == '1' ? [1, 2, 3, 4] : [0, 1, 2, 3];
        var fiveIndex = $("#tbFourType").val() == '1' ? 0 : 4;

        var str = "<div>";
        for (var i = storeDatas.length - 15; i < storeDatas.length - 1; i++) {
            var nums = getDistNum(storeDatas, i);
            if (nums.length != 5) {
                continue;
            }

            var isFound = false;
            for (var ni in nums) {
                for (var index in indexex) {
                    var num = fetchHistroy(storeDatas, i + 1, indexex[index]);
                    if (nums[ni] == num) {
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
                str += "X";
                var fiveNum = fetchHistroy(storeDatas, i + 1, fiveIndex);
                str += nums.indexOf(fiveNum) > -1 ? "O" : "X";
            }
        }

        var cmin = getDistNum(storeDatas, storeDatas.length - 1);
        var subStr = "";
        if (cmin.length == 5) {
            for (var ni in cmin) {
                subStr += cmin[ni];
            }
        }
        
        str += ":" + subStr;
        str += "</div>";
        return str;
    };

    fourWatchUtil.reports.push(builderDistNumberMissReport);
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