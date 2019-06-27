var twoWatchUtil = {
    reports: []
};

var getIndex = function (index) {
    switch (index + "") {
        case "1":
            return [1, 2];
        case "2":
            return [2, 3];
        case "3":
            return [3, 4];
        case "0":
        default:
            return [0, 1];
    }
};

(function () {
    var builderMissReport = function (storeDatas) {
        var indexex = getIndex($("#tbTwoType").val());
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
                    str += "<span style='display:block;float:left;width:20px;color:green'>X</span>";
                }
            }

            str += "</div>";
            str += "<div style='clear: left'></div>";
        }

        return str;
    };

    twoWatchUtil.reports.push(builderMissReport);
})();

(function () {
    var getFiveNumber = function (n1, n2) {
        var ns = [parseInt(n1, 10), parseInt(n2, 10)];
        ns.sort(function (a, b) { return a - b; });
        var min = 0;
        var max = 0;
        if (ns[0] <= ns[1]) {
            min = ns[0];
            max = ns[1];
        }
        else {
            min = ns[1];
            max = ns[0];
        }

        if (min > 4) {
            return [0, 1, 2, 3, 4];
        }
        else if (((max - min) >= 5 || min == max) && min <= 4) {
            return [min + 1, min + 2, min + 3, min + 4, min + 5];
        }
        else if (max < 5) {
            return [max + 1, max + 2, max + 3, max + 4, max + 5];
        }

        return [];
    }


    var compare = function (storeDatas, index, indexex, fiveNumber) {
        var n1 = parseInt(fetchHistroy(storeDatas, index + 1, indexex[0]), 10);
        var n2 = parseInt(fetchHistroy(storeDatas, index + 1, indexex[1]), 10);

        if (n1 == n2) {
            return true;
        }

        var isRight1 = fiveNumber.indexOf(n1) > -1;
        var isRight2 = fiveNumber.indexOf(n2) > -1;
        return (!isRight1 && isRight2) || (isRight1 && !isRight2) || (!isRight1 && !isRight2);
    };

    var builderMissReport = function (storeDatas) {
        var indexex = getIndex($("#tbTwoType").val());
        var str = "<div>";
        for (var i = storeDatas.length - 3; i >= 0; i--) {

            var ns = [];
            for (var a = 0; a < 5; a++) {
                var n1 = parseInt(fetchHistroy(storeDatas, i, a), 10);
                if (ns.indexOf(n1) > -1) {
                    continue;
                }

                ns.push(n1);

                if (ns.length == 4) {

                    break;
                }
            }

            if (ns.length != 4) {
                continue;
            }

            var isRight = compare(storeDatas, i, indexex, ns);
            if (isRight) {
                str += "V";
            }
            else {
                str += "X";
            }

        }

        str += "</div>";
        return str;
    };

    //twoWatchUtil.reports.push(builderMissReport);
})();

var onMinMaxClick = function () {
    //var m = $(this).attr("method");
    //var v = parseInt($(this).attr("val"), 10);

    //$("#tbFourType").val($(this).attr("index"));
    //var betStr = "";
    //if (m == '0') {
    //    for (var i = v; i < v + 5; i++) {
    //        betStr += i;
    //    }
    //}
    //else {
    //    for (var i = v - 4; i <= v; i ++) {
    //        betStr += i;
    //    }
    //}

    //$("#tbFourNum").val(betStr);
};

(function () {
    var compare = function (storeDatas, index, indexex, fiveNumber) {
        var n1 = fetchHistroy(storeDatas, index + 1, indexex[0]);
        var n2 = fetchHistroy(storeDatas, index + 1, indexex[1]);

        if (n1 == n2) {
            return true;
        }

        var isRight1 = fiveNumber.indexOf(n1) > -1;
        var isRight2 = fiveNumber.indexOf(n2) > -1;
        return (!isRight1 && isRight2) || (isRight1 && !isRight2) || (!isRight1 && !isRight2);
    };

    var findPrev = function (histroyDatas, index) {
        var ns = [];
        for (var a = 0; a < 5; a++) {
            var n1 = fetchHistroy(histroyDatas, index, a);
            if (ns.indexOf(n1) > -1) {
                continue;
            }

            ns.push(n1);
            if (ns.length == 4) {
                return ns;
            }
        }

        return [];
    }

    var find = function (histroyDatas) {
        var len = histroyDatas.length - 1;
        var ns = findPrev(histroyDatas, len);
        if (ns.length != 4) {
            return null;
        }

        for (var a = 0; a < 4; a++) {
            var str = "";
            for (var i = len - 1; i >= 0; i--) {
                var cns = findPrev(histroyDatas, i);
                if (cns.length != 4) {
                    continue;
                }

                var c = compare(histroyDatas, i, [a, a + 1], cns);
                if (c == true) {
                    str += "V";
                }
                else {
                    str += "X";
                }

                if (str.length > 15) {
                    break;
                }
            }

            if (str.match(/^X{3,3}V/) || str.match(/^XVX{4,}/)) {
                console.logex(str + "_tl");
                return {
                    index: a,
                    nums: ns,
                    t: 1
                }
            }
        }

        return null;
    }

    var watch = {
        name: "twolike",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = find(histroyDatas);
            if (matchArry === null) {
                return;
            }

            console.log(matchArry);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, matchArry, newData);
            }
        }
    };

    window.watchers.push(watch);
})();

(function () {
    var numbers = [];
    for (var a = 0; a < 6; a++) {
        var ns = [];
        for (var b = a; b < 4; b++) {
            ns.push((b + 1) + '');
        }

        numbers.push(ns);
    }
    
    var compare = function (storeDatas, index, indexex, fiveNumber) {
        var n1 = fetchHistroy(storeDatas, index + 1, indexex[0]);
        var n2 = fetchHistroy(storeDatas, index + 1, indexex[1]);

        if (n1 == n2) {
            return true;
        }

        var isRight1 = fiveNumber.indexOf(n1) > -1;
        var isRight2 = fiveNumber.indexOf(n2) > -1;
        return (!isRight1 && isRight2) || (isRight1 && !isRight2) || (!isRight1 && !isRight2);
    };

    var find = function (histroyDatas) {
        var len = histroyDatas.length - 1;
        for (var a = 0; a < 4; a++) {
            for (var ni in numbers) {
                var str = "";
                var cns = numbers[ni];
                for (var i = len - 1; i >= 0; i--) {
                    var c = compare(histroyDatas, i, [a, a + 1], cns);
                    if (c == true) {
                        str += "V";
                    }
                    else {
                        str += "X";
                    }

                    if (str.length > 15) {
                        break;
                    }
                }

                if (str.match(/^X{3,3}V/) || str.match(/^XVX{4,}/)) {
                    console.logex(str + "_tm");
                    return {
                        index: a,
                        nums: cns,
                        t: 1
                    }
                }
            }
        }

        return null;
    }

    var watch = {
        name: "twomatch",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = find(histroyDatas);
            if (matchArry === null) {
                return;
            }

            console.log(matchArry);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, matchArry, newData);
            }
        }
    };

    window.watchers.push(watch);
})();

(function () {
    var numbers = [];
    for (var a = 0; a < 7; a++) {
        var ns = [];
        for (var b = a; b < 3; b++) {
            ns.push((b + 1) + '');
        }

        numbers.push(ns);
    }

    var compare = function (storeDatas, index, indexex, fiveNumber) {
        var n1 = fetchHistroy(storeDatas, index + 1, indexex[0]);
        var n2 = fetchHistroy(storeDatas, index + 1, indexex[1]);

        if (n1 == n2) {
            return true;
        }

        var isRight1 = fiveNumber.indexOf(n1) > -1;
        var isRight2 = fiveNumber.indexOf(n2) > -1;
        return (!isRight1 && isRight2) || (isRight1 && !isRight2) || (!isRight1 && !isRight2);
    };

    var find = function (histroyDatas) {
        var len = histroyDatas.length - 1;
        for (var a = 0; a < 4; a++) {
            for (var ni in numbers) {
                var str = "";
                var cns = numbers[ni];
                for (var i = len - 1; i >= 0; i--) {
                    var c = compare(histroyDatas, i, [a, a + 1], cns);
                    if (c == true) {
                        str += "V";
                    }
                    else {
                        str += "X";
                    }

                    if (str.length > 15) {
                        break;
                    }
                }

                if (str.match(/^X{4,}/) || str.match(/^XVX{3,}/)) {
                    console.logex(str + "_tm3");
                    return {
                        index: a,
                        nums: cns,
                        t: 1
                    }
                }
            }
        }

        return null;
    }

    var watch = {
        name: "twomatch3",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = find(histroyDatas);
            if (matchArry === null) {
                return;
            }

            console.log(matchArry);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, matchArry, newData);
            }
        }
    };

    window.watchers.push(watch);
})();


