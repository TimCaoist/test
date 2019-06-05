window.watchers = [];

(function () {
    var getNums = function (a, si, histroyDatas, len) {
        var nums = [];
        for (var i = si - 1; i >= si - len; i--) {
            if (i >= histroyDatas.length) {
                return [];
            }

            var data = histroyDatas[i].ZJHM.split(',')[a];
            nums.push(data);
        }

        return nums;
    }

    var compare = function (na, nb, isBig) {
        for (var i = 0; i < na.length; i++) {
            if (na[i] !== nb[i]) {
                return false;
            }
        }

        return true;
    }

    var findGuy = function (nums, a, si, histroyDatas, takeLen) {
        var len = histroyDatas.length;
        for (var i = si; i >= len - 1900; i--) {
            var matchNums = getNums(a, i, histroyDatas, takeLen);
            if (matchNums.length === 0) {
                return null;
            }

            var isMatch = compare(matchNums, nums);
            if (isMatch === false) {
                continue;
            }

            return {
                numIndex: a,
                matchNums: matchNums,
                matchIndex: i,
                nums: nums,
                compareLen: takeLen,
                prevNum: getNums(a, i + 1, histroyDatas, 1)[0],
            };
        }

        return null;
    };

    var watch = {
        name: "haven",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var guys = [];
            var len = histroyDatas.length;
            
            for (var a = 0; a < 5; a++) {
                for (var i = 7; i >= 4; i--) {
                    var nums = getNums(a, histroyDatas.length, histroyDatas, i);
                    var guy = findGuy(nums, a, histroyDatas.length - 1, histroyDatas, i);
                    if (guy == null) {
                        continue;
                    }

                    var match = false;
                    switch (i) {
                        case 7:
                            {
                                guys.push(guy);
                                match = true;
                                break;
                            }
                        case 6:
                        case 5:
                            {
                                for (var b = histroyDatas.length - 1; b >= histroyDatas.length - 100; b--) {
                                    var prevNums = getNums(a, b, histroyDatas, 6);
                                    var prevGuy = findGuy(prevNums, a, b - 1, histroyDatas, 6);
                                    if (prevGuy === null) {
                                        continue;
                                    }

                                    guys.push(guy);
                                    match = true;
                                    break;
                                }
                            }

                            break;
                        case 4:
                            {
                                for (var b = histroyDatas.length - 2; b >= histroyDatas.length - 5; b--) {
                                    var prevNums = getNums(a, b, histroyDatas, 5);
                                    var prevGuy = findGuy(prevNums, a, b - 1, histroyDatas, 5);
                                    if (prevGuy === null) {
                                        continue;
                                    }

                                    if ((histroyDatas.length - 3) != b) {
                                        guys.push(guy);
                                        match = true;
                                    }
                                    else {
                                        var prevNum = getNums(a, b, histroyDatas, 1)[0];
                                        if (prevNum !== prevGuy.prevNum) {
                                            guys.push(guy);
                                            match = true;
                                        }
                                    }

                                    
                                    break;
                                }
                            }

                            break;
                    }

                    if (match) {
                        break;
                    }
                }
            }

            if (guys.length === 0) {
                watch.matchGuy = null;
                return;
            }

            guys.sort(function (a, b) {
                return b.matchIndex - a.matchIndex;
            });

            console.log(guys);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, guys[0], newData);
            }
        }
    };

    window.watchers.push(watch);
})();


var getMissMatch = function (si, n, histroyDatas, len) {
    if (histroyDatas[len - 1][si] == n) {
        return [];
    }

    var ns = [];
    var firstIndex = len - 1;
    var lastIndex = firstIndex;
    for (var i = firstIndex; i >= 0; i--) {
        var data = histroyDatas[i][si];
        if (data == n) {
            if (lastIndex !== -1) {
                var miss = lastIndex - i;
                if (lastIndex !== firstIndex) {
                    miss = miss - 1;
                }

                if (miss !== 0) {
                    ns.push(miss);
                }
            }

            lastIndex = i;
        }
    }

    for (var i = 1; i < 4; i++) {
        if (ns[i] > 6) {
            return [];
        }
    }

    var s = ns.length;
    var ccc = [];
    var splitNs = [];
    var lastMax = -1;
    for (var a = 0; a < s; a++) {
        var n = ns[a];
        if (n <= 6) {
            splitNs.push(n);
        }
        else {
            if (splitNs.length > 2) {
                splitNs.reverse();
                if (lastMax > -1) {
                    splitNs.push(lastMax);
                }

                splitNs.index = a;
                splitNs.si = si;
                splitNs.n = n;
                ccc.push(splitNs);
            }

            if (ccc.length > 9) {
                break;
            }

            splitNs = [];
            lastMax = n;
        }
    }

    return ccc;
};

var finPrevNumIndex = function (i, a, nums, matchNum) {
    for (var si = i; si >= 0; si--) {
        var num = nums[si].nums[a];
        if (num == matchNum) {
            return i - si;
        }
    }

    return 99;
};

var getMissNumIndex = function (i, a, nums) {
    var misses = [];
    var currentMiss = 99;
    var cns = nums[i + 1].nums[a];
    for (var n = 0; n < 10; n++) {
        var miss = finPrevNumIndex(i, a, nums, n);
        if (cns == n) {
            currentMiss = miss;
        }

        misses.push(miss);
    }

    misses.sort(function (a, b) { return b - a; });
    return misses.indexOf(currentMiss);
};

var getCurrentMisses = function (histroyDatas) {
    var currentMisses = [];
    var len = histroyDatas.length - 1;
    for (var a = 0; a < 5; a++) {
        var perMiss = [];
        for (var n = 0; n < 10; n++) {
            var miss = finPrevNumIndex(len, a, histroyDatas, n);
            perMiss.push({
                n: n,
                miss: miss
            });
        }

        perMiss.sort(function (a, b) { return b.miss - a.miss; });
        currentMisses.push(perMiss);
    }

    return currentMisses;
};

var pattArray = [/^XVX{1,}/];

var brotherFind = function (histroyDatas, subIndex, isMatch, isSplit) {
    var datas = histroyDatas;
    var len = datas.length - 1;
    var matchAs = [];
    for (var a = 0; a < 5; a++) {
        if (isMatch(len, datas, a)) {
            matchAs.push(a);
        }
    }

    var matchArry = [];
    for (var index in matchAs) {
        var a = matchAs[index];
        for (var i = 0; i < subIndex; i++) {
            var str = "";
            for (var dl = len - 1; dl >= 2; dl--) {
                if (isMatch(dl, datas, a)) {
                    var compareNum = datas[dl - i].ZJHM.split(',')[a];
                    var num = datas[dl + 1].ZJHM.split(',')[a];
                    if (num === compareNum) {
                        str += "X";
                    }
                    else {
                        str += "V";
                    }

                    if (str.length >= 25) {
                        break;
                    }
                }
            }

            for (var pi = 0; pi < pattArray.length; pi++) {
                if (str.match(pattArray[pi]) != null) {
                    matchArry.push({
                        index: a,
                        loopIndex: i,
                        mtype: pi > 0 ? 1 : 0,
                        num: datas[len - i].ZJHM.split(',')[a]
                    });

                    return matchArry;
                }
            }
        }

        if (matchArry.length > 0) {
            break;
        }
    }

    return matchArry;
};

(function () {
    var isLoop = function (index, datas, a) {
        var na = datas[index].ZJHM.split(',')[a];
        var nb = datas[index - 1].ZJHM.split(',')[a];
        var nc = datas[index - 2].ZJHM.split(',')[a];
        if (na - nb == nb - nc) {
            return true;
        }

        return false;
    }

    var watch = {
        name: "loops",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = brotherFind(histroyDatas, 3, isLoop);
            if (matchArry.length === 0) {
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
    var isDouble = function (index, datas, a) {
        var na = datas[index].ZJHM.split(',')[a];
        var nb = datas[index - 1].ZJHM.split(',')[a];
		var nc = datas[index - 2].ZJHM.split(',')[a];
        if (nb == nc && nb != na) {
            return true;
        }

        return false;
    }

    var watch = {
        name: "double",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = brotherFind(histroyDatas, 1, isDouble);
            if (matchArry.length === 0) {
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
    var isSplit = function (index, datas, a) {
        var na = datas[index].ZJHM.split(',')[a];
        var nb = datas[index - 1].ZJHM.split(',')[a];
        var nc = datas[index - 2].ZJHM.split(',')[a];
        if (na === nc && na !== nb) {
            return true;
        }

        return false;
    }
    
    var watch = {
        name: "split",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = brotherFind(histroyDatas, 1, isSplit, true);
            if (matchArry.length === 0) {
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


var missBrotherFind = function (histroyDatas, subIndex, isMatch, isSplit) {
    var convertDatas = function (histroyDatas) {
        var len = histroyDatas.length;
        var datas = [];
        for (var i = 0; i < len; i++) {
            if (typeof histroyDatas[i].nums === "undefined") {
                histroyDatas[i].nums = histroyDatas[i].ZJHM.split(',');
            }
        }

        for (var i = 100; i < len; i++) {
            var perDatas = [];
            for (var a = 0; a < 5; a++) {
                var miss = getMissNumIndex(i - 1, a, histroyDatas);
                perDatas.push(miss);
            }

            datas.push(perDatas);
        }

        return datas;
    }

    var datas = convertDatas(histroyDatas);
    var len = datas.length - 1;
    var matchAs = [];
    for (var a = 0; a < 5; a++) {
        if (isMatch(len, datas, a)) {
            matchAs.push(a);
        }
    }

    var matchArry = [];
    for (var index in matchAs) {
        var a = matchAs[index];
        for (var i = 0; i < subIndex; i++) {
            var str = "";
            var wrongCount = 0;
            for (var dl = len - 1; dl >= 2; dl--) {
                if (isMatch(dl, datas, a)) {
                    var compareNum = datas[dl - i][a];
                    var num = datas[dl + 1][a];
                    if (num === compareNum) {
                        str += "X";
                        wrongCount++;
                    }
                    else {
                        str += "V";
                    }

                    if (str.length >= 25) {
                        break;
                    }
                }
            }
            
            for (var pi = 0; pi < pattArray.length; pi++) {
                if (str.match(pattArray[pi]) != null) {
                    matchArry.push({
                        index: a,
                        loopIndex: i,
                        mtype: pi > 0 ? 1 : 0,
                        num: datas[len - i][a]
                    });

                    return matchArry;
                }
            }
        }

        if (matchArry.length > 0) {
            break;
        }
    }

    return matchArry;
};


(function () {
    var isLoop = function (index, datas, a) {
        var na = datas[index][a];
        var nb = datas[index - 1][a];
        var nc = datas[index - 2][a];
        if (na - nb == nb - nc) {
            return true;
        }

        return false;
    }

    var watch = {
        name: "missloops",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = missBrotherFind(histroyDatas, 3, isLoop);
            if (matchArry.length === 0) {
                return;
            }

            console.log(matchArry);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, matchArry, newData, getCurrentMisses(histroyDatas));
            }
        }
    };

    window.watchers.push(watch);
})();

(function () {
    var isDouble = function (index, datas, a) {
        var na = datas[index][a];
        var nb = datas[index - 1][a];
        var nc = datas[index - 2][a];
        if (nb == nc && nb != na) {
            return true;
        }

        return false;
    }

    var watch = {
        name: "missdouble",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = missBrotherFind(histroyDatas, 1, isDouble);
            if (matchArry.length === 0) {
                return;
            }

            console.log(matchArry);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, matchArry, newData, getCurrentMisses(histroyDatas));
            }
        }
    };

    window.watchers.push(watch);
})();

(function () {
    var isSplit = function (index, datas, a) {
        var na = datas[index][a];
        var nb = datas[index - 1][a];
        var nc = datas[index - 2][a];
        if (na === nc && na !== nb) {
            return true;
        }

        return false;
    }

    var watch = {
        name: "misssplit",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = missBrotherFind(histroyDatas, 1, isSplit, true);
            if (matchArry.length === 0) {
                return;
            }

            console.log(matchArry);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, matchArry, newData, getCurrentMisses(histroyDatas));
            }
        }
    };

    window.watchers.push(watch);
})();

var addBrotherFind = function (histroyDatas, subIndex, isMatch, isSplit) {
    var convertDatas = function (histroyDatas) {
        var len = histroyDatas.length;
        var datas = [];
        for (var i = 1; i < len; i++) {
            var pNum = histroyDatas[i - 1].ZJHM.split(',');
            var cNum = histroyDatas[i].ZJHM.split(',');

            var perDatas = [];
            for (var a = 0; a < pNum.length; a++) {
                var miss = parseInt(cNum[a], 10) - parseInt(pNum[a], 10);
                if (cNum[a] < pNum[a]) {
                    miss += 10;
                }

                perDatas.push(miss);
            }

            datas.push(perDatas);
        }

        return datas;
    }

    var datas = convertDatas(histroyDatas);
    var len = datas.length - 1;
    var matchAs = [];
    for (var a = 0; a < 5; a++) {
        if (isMatch(len, datas, a)) {
            matchAs.push(a);
        }
    }

    var matchArry = [];
    for (var index in matchAs) {
        var a = matchAs[index];
        for (var i = 0; i < subIndex; i++) {
            var str = "";
            var wrongCount = 0;
            for (var dl = len - 1; dl >= 2; dl--) {
                if (isMatch(dl, datas, a)) {
                    var compareNum = datas[dl - i][a];
                    var num = datas[dl + 1][a];
                    if (num === compareNum) {
                        str += "X";
                        wrongCount++;
                    }
                    else {
                        str += "V";
                    }

                    if (str.length >= 25) {
                        break;
                    }
                }
            }
            
            for (var pi = 0; pi < pattArray.length; pi++) {
                if (str.match(pattArray[pi]) != null) {
                    matchArry.push({
                        index: a,
                        loopIndex: i,
                        mtype: pi > 0 ? 1 : 0,
                        num: datas[len - i][a]
                    });

                    return matchArry;
                }
            }
        }

        if (matchArry.length > 0) {
            break;
        }
    }

    return matchArry;
};


(function () {
    var isLoop = function (index, datas, a) {
        var na = datas[index][a];
        var nb = datas[index - 1][a];
        var nc = datas[index - 2][a];
        if (na - nb == nb - nc) {
            return true;
        }

        return false;
    }

    var watch = {
        name: "addloops",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = addBrotherFind(histroyDatas, 3, isLoop);
            if (matchArry.length === 0) {
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
    var isDouble = function (index, datas, a) {
        var na = datas[index][a];
        var nb = datas[index - 1][a];
        var nc = datas[index - 2][a];
        if (nb == nc && nb != na) {
            return true;
        }

        return false;
    }

    var watch = {
        name: "adddouble",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = addBrotherFind(histroyDatas, 1, isDouble);
            if (matchArry.length === 0) {
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
    var isSplit = function (index, datas, a) {
        var na = datas[index][a];
        var nb = datas[index - 1][a];
        var nc = datas[index - 2][a];
        if (na === nc && na !== nb) {
            return true;
        }

        return false;
    }

    var watch = {
        name: "addsplit",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = addBrotherFind(histroyDatas, 1, isSplit, true);
            if (matchArry.length === 0) {
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
    var find = function (histroyDatas, isMatch, compareIndex, patt1, miss) {
        var datas = histroyDatas;
        var len = datas.length - 1;
        var matchAs = [];
        for (var a = 0; a < 5; a++) {
            if (isMatch(len, datas, a, miss)) {
                matchAs.push(a);
            }
        }

        var matchArry = [];
        for (var index in matchAs) {
            var a = matchAs[index];
            var str = "";
            for (var dl = len - 1; dl >= (compareIndex + 1); dl--) {
                if (isMatch(dl, datas, a, miss)) {
                    var compareNum = datas[dl - compareIndex].ZJHM.split(',')[a];
                    var num = datas[dl + 1].ZJHM.split(',')[a];
                    if ((parseInt(num, 10) - parseInt(compareNum, 10)) == miss) {
                        str += "X";
                    }
                    else {
                        str += "V";
                    }

                    if (str.length >= 20) {
                        break;
                    }
                }
            }

            console.logex(str + "_r" + compareIndex);
            var cn = parseInt(datas[len - compareIndex].ZJHM.split(',')[a], 10) + miss;
            if (cn < 0 || cn > 9) {
                continue;
            }

            if (str.match(patt1) != null) {
                matchArry.push({
                    index: a,
                    num: cn,
                    miss: miss
                });

                console.logex(miss);
                break;
            }

            if (matchArry.length > 0) {
                break;
            }
        }

        return matchArry;
    }

    var findMore = function (histroyDatas, isMatch, compareIndex, patt1) {
        for (var i = 6; i >= 0; i--) {
            var matchArry = find(histroyDatas, isMatch, compareIndex, patt1, i);
            if (matchArry.length > 0) {
                return matchArry;
            }
        }

        for (var i = -6; i < 0; i++) {
            var matchArry = find(histroyDatas, isMatch, compareIndex, patt1, i);
            if (matchArry.length > 0) {
                return matchArry;
            }
        }

        return [];
    }

    var isReverse = function (index, datas, a, miss) {
        var na = datas[index].ZJHM.split(',')[a];
        var nb = datas[index - 1].ZJHM.split(',')[a];
        var nc = datas[index - 2].ZJHM.split(',')[a];
        var nd = datas[index - 3].ZJHM.split(',')[a];

        if ((parseInt(na, 10) - parseInt(nd, 10)) == miss &&
            (parseInt(nb, 10) - parseInt(nc, 10)) == miss) {
            return true;
        }

        return false;
    }

    var watch = {
        name: "reverse",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = findMore(histroyDatas, isReverse, 4, /^V{0,1}X{1,}/);
            if (matchArry.length === 0) {
                return;
            }

            console.logex("reverse");
            console.log(matchArry);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, matchArry, newData);
            }
        }
    };

    window.watchers.push(watch);

    var isReverse4 = function (index, datas, a, miss) {
        var na = datas[index].ZJHM.split(',')[a];
        var nb = datas[index - 1].ZJHM.split(',')[a];
        var nc = datas[index - 2].ZJHM.split(',')[a];
        var nd = datas[index - 3].ZJHM.split(',')[a];
        var ne = datas[index - 4].ZJHM.split(',')[a];
        var nf = datas[index - 5].ZJHM.split(',')[a];

        if ((parseInt(na, 10) - parseInt(nf, 10)) == miss &&
            (parseInt(nb, 10) - parseInt(ne, 10)) == miss &&
            (parseInt(nc, 10) - parseInt(nd, 10)) == miss) {
            return true;
        }

        return false;
    }


    var watch1 = {
        name: "reverse4",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = findMore(histroyDatas, isReverse4, 6, /^X{1,}/);
            if (matchArry.length === 0) {
                return;
            }

            console.logex("reverse4");
            console.log(matchArry);
            for (var a = 0; a < watch1.policies.length; a++) {
                watch1.policies[a].tryStart(watch1, matchArry, newData);
            }
        }
    };

    window.watchers.push(watch1);

    var isReverse6 = function (index, datas, a, miss) {
        var na = datas[index].ZJHM.split(',')[a];
        var nb = datas[index - 1].ZJHM.split(',')[a];
        var nc = datas[index - 2].ZJHM.split(',')[a];
        var nd = datas[index - 3].ZJHM.split(',')[a];
        var ne = datas[index - 4].ZJHM.split(',')[a];
        var nf = datas[index - 5].ZJHM.split(',')[a];
        var ng = datas[index - 6].ZJHM.split(',')[a];
        var nh = datas[index - 7].ZJHM.split(',')[a];
        var ni = datas[index - 8].ZJHM.split(',')[a];
        var nj = datas[index - 9].ZJHM.split(',')[a];

        if ((parseInt(na, 10) - parseInt(nj, 10)) == miss &&
            (parseInt(nb, 10) - parseInt(ni, 10)) == miss &&
            (parseInt(nc, 10) - parseInt(nh, 10)) == miss &&
            (parseInt(nd, 10) - parseInt(ng, 10)) == miss &&
            (parseInt(ne, 10) - parseInt(nf, 10)) == miss) {
            return true;
        }

        return false;
    }

    var watch2 = {
        name: "reverse6",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = findMore(histroyDatas, isReverse6, 10, /^X{0,}/);
            if (matchArry.length === 0) {
                return;
            }

            console.logex("reverse6");
            console.log(matchArry);
            for (var a = 0; a < watch2.policies.length; a++) {
                watch2.policies[a].tryStart(watch2, matchArry, newData);
            }
        }
    };

    window.watchers.push(watch2);

    var watch3 = {
        name: "reverse3",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = findMore(histroyDatas, isReverse, 4, /^X{3,}/);
            if (matchArry.length === 0) {
                return;
            }

            console.logex("reverse3");
            console.log(matchArry);
            for (var a = 0; a < watch3.policies.length; a++) {
                watch3.policies[a].tryStart(watch3, matchArry, newData);
            }
        }
    };

    window.watchers.push(watch3);
})();

(function () {
    var findPrev = function (histroyDatas, index, a) {
        var missArray = getMissArray(histroyDatas, index, a);
        var compareMiss = getLastMissArray(missArray, histroyDatas, index, a);
        if (compareMiss == null) {
            return null;
        }

        return missArray[0] === compareMiss;
    }

    var getLastMissArray = function (missArray, histroyDatas, index, a) {
        var compareMissArray = [];
        for (var i = index - 1; i >= index - 50; i--) {
            compareMissArray = getMissArray(histroyDatas, i, a);
            if (missArray[1] === compareMissArray[1] &&
                missArray[2] === compareMissArray[2] &&
                missArray[3] === compareMissArray[3]) {
                return compareMissArray[0];
            }
        }

        return null;
    }

    var getMissArray = function (datas, index, a) {
        var na = datas[index].ZJHM.split(',')[a];
        var nb = datas[index - 1].ZJHM.split(',')[a];
        var nc = datas[index - 2].ZJHM.split(',')[a];
        var nd = datas[index - 3].ZJHM.split(',')[a];
        var ne = datas[index - 4].ZJHM.split(',')[a];
        var nf = datas[index - 5].ZJHM.split(',')[a];
        var ng = datas[index - 6].ZJHM.split(',')[a];
        var nh = datas[index - 7].ZJHM.split(',')[a];
        return [parseInt(na - nh, 10), parseInt(nb - ng, 10), parseInt(nc - nf, 10), parseInt(nd - ne, 10)];
    };

    var find = function (histroyDatas) {
        var datas = histroyDatas;
        var index = histroyDatas.length - 1;

        var matchAs = [];
        for (var a = 0; a < 5; a++) {
            var na = datas[index].ZJHM.split(',')[a];
            var nb = datas[index - 1].ZJHM.split(',')[a];
            var nc = datas[index - 2].ZJHM.split(',')[a];
            var nd = datas[index - 3].ZJHM.split(',')[a];
            var ne = datas[index - 4].ZJHM.split(',')[a];
            var nf = datas[index - 5].ZJHM.split(',')[a];
            var missArray = [-1, parseInt(na - nf, 10), parseInt(nb - ne, 10), parseInt(nc - nd, 10)];
            var lastMiss = getLastMissArray(missArray, histroyDatas, index, a);
            if (lastMiss === null) {
                continue;
            }

            var num = parseInt(datas[index - 6].ZJHM.split(',')[a], 10) + lastMiss;
            if (num < 0 || num > 9) {
                continue;
            }

            matchAs.push({
                index: a,
                miss: lastMiss,
                num: num
            });
        }

        for (var mi in matchAs) {
            var a = matchAs[mi].index;
            var str = "";
            for (var dl = index - 1; dl >= 100; dl--) {
                var result = findPrev(histroyDatas, dl, a);
                if (result === null) {
                    continue;
                }

                if (result === true) {
                    str += "X";
                }
                else if (result === false) {
                    str += "V";
                }

                if (str.length > 15) {
                    break;
                }
            }

            console.logex(str + "_adv");
            if (str.match(/^V{0,1}XV{0,3}XV{0,3}X|^V{0,2}XX/)) {
                return matchAs[mi];
            }

            var m1 = str.match(/^X/);
            if (m1 == null) {
                continue;
            }

            var m2 = str.match(/X{2,}/);
            if (m2 == null || m2.index === m1.index) {
                continue;
            }

            return matchAs[mi];
        }

        return null;
    }
    
    var watch1 = {
        name: "reverseAdv",
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
            for (var a = 0; a < watch1.policies.length; a++) {
                watch1.policies[a].tryStart(watch1, [matchArry], newData);
            }
        }
    };

    window.watchers.push(watch1);
})();

(function () {
    var findPrev = function (histroyDatas, index, a) {
        var missArray = getMissArray(histroyDatas, index, a);
        var compareMiss = getLastMissArray(missArray, histroyDatas, index, a);
        if (compareMiss == null) {
            return null;
        }

        return missArray[0] === compareMiss;
    }

    var getLastMissArray = function (missArray, histroyDatas, index, a) {
        var compareMissArray = [];
        for (var i = index - 1; i >= index - 50; i--) {
            compareMissArray = getMissArray(histroyDatas, i, a);
            if (missArray[1] === compareMissArray[1] &&
                missArray[2] === compareMissArray[2] &&
                missArray[3] === compareMissArray[3] &&
                missArray[4] === compareMissArray[4]) {
                return compareMissArray[0];
            }
        }

        return null;
    }

    var getMissArray = function (datas, index, a) {
        var na = datas[index].ZJHM.split(',')[a];
        var nb = datas[index - 1].ZJHM.split(',')[a];
        var nc = datas[index - 2].ZJHM.split(',')[a];
        var nd = datas[index - 3].ZJHM.split(',')[a];
        var ne = datas[index - 4].ZJHM.split(',')[a];
        var nf = datas[index - 5].ZJHM.split(',')[a];
        var ng = datas[index - 6].ZJHM.split(',')[a];
        var nh = datas[index - 7].ZJHM.split(',')[a];
        var ni = datas[index - 8].ZJHM.split(',')[a];
        var nj = datas[index - 9].ZJHM.split(',')[a];
        return [parseInt(na - nj, 10), parseInt(nb - ni, 10), parseInt(nc - nh, 10), parseInt(nd - ng, 10), parseInt(ne - nf, 10)];
    };

    var find = function (histroyDatas) {
        var datas = histroyDatas;
        var index = histroyDatas.length - 1;

        var matchAs = [];
        for (var a = 0; a < 5; a++) {
            var na = datas[index].ZJHM.split(',')[a];
            var nb = datas[index - 1].ZJHM.split(',')[a];
            var nc = datas[index - 2].ZJHM.split(',')[a];
            var nd = datas[index - 3].ZJHM.split(',')[a];
            var ne = datas[index - 4].ZJHM.split(',')[a];
            var nf = datas[index - 5].ZJHM.split(',')[a];
            var ng = datas[index - 6].ZJHM.split(',')[a];
            var nh = datas[index - 7].ZJHM.split(',')[a];

            var missArray = [-1, parseInt(na - nh, 10), parseInt(nb - ng, 10), parseInt(nc - nf, 10), parseInt(nd - ne, 10)];
            var lastMiss = getLastMissArray(missArray, histroyDatas, index, a);
            if (lastMiss === null) {
                continue;
            }

            var num = parseInt(datas[index - 8].ZJHM.split(',')[a], 10) + lastMiss;
            if (num < 0 || num > 9) {
                continue;
            }

            matchAs.push({
                index: a,
                miss: lastMiss,
                num: num
            });
        }

        for (var mi in matchAs) {
            var a = matchAs[mi].index;
            var str = "";
            for (var dl = index - 1; dl >= 100; dl--) {
                var result = findPrev(histroyDatas, dl, a);
                if (result === null) {
                    continue;
                }

                if (result === true) {
                    str += "X";
                }
                else if (result === false) {
                    str += "V";
                }

                if (str.length > 15) {
                    break;
                }
            }

            console.logex(str + "_adv5");
            if (str.match(/^V{0,}/)) {
                return matchAs[mi];
            }
        }

        return null;
    }

    var watch1 = {
        name: "reverseAdv5",
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
            for (var a = 0; a < watch1.policies.length; a++) {
                watch1.policies[a].tryStart(watch1, [matchArry], newData);
            }
        }
    };

    window.watchers.push(watch1);
})();

(function () {
    var findPrev = function (histroyDatas, index, a, n, miss) {
        var na = histroyDatas[index].ZJHM.split(',')[a];
        var nb = histroyDatas[index - miss - 1].ZJHM.split(',')[a];
        if (nb != n || na != n) {
            return false;
        }

        for (var i = index - 1; i >= index - miss; i--) {
            var nb = histroyDatas[i].ZJHM.split(',')[a];
            if (nb === n) {
                return false;
            }
        }

        return true;
    };

    var find = function (histroyDatas) {
        var len = histroyDatas.length - 1;
        var matchAs = [];
        for (var a = 0; a < 5; a++) {
            var na = histroyDatas[len].ZJHM.split(',')[a];
            var miss = 0;
            var isFound = false;
            for (var i = len - 1; i >= len - 7; i--) {
                var nb = histroyDatas[i].ZJHM.split(',')[a];
                if (na === nb) {
                    isFound = true;
                    break;
                }

                miss++;
            }

            if (miss < 4 || isFound === false) {
                continue;
            }

            matchAs.push({
                miss: miss,
                num: na,
                index: a
            });
        }

        if (matchAs.length <= 0) {
            return [];
        }

        for (var mi in matchAs) {
            var a = matchAs[mi].index;
            var str = "";
            for (var dl = len - matchAs[mi].miss; dl >= 100; dl--) {
                var match = findPrev(histroyDatas, dl, a, matchAs[mi].num, matchAs[mi].miss);
                if (match === false) {
                    continue;
                }

                var result = histroyDatas[dl + 1].ZJHM.split(',')[a] == matchAs[mi].num;
                if (result === true) {
                    str += "X";
                }
                else if (result === false) {
                    str += "V";
                }

                if (str.length > 15) {
                    break;
                }
            }

            console.logex(str + "_drag");
            if (str.match(/^VX{1,}V{0,3}X{1,}V{0,3}X{1,}/)) {
                return matchAs[mi];
            }
        }

        return [];
    }

    var watch = {
        name: "drag",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var matchArry = find(histroyDatas);
            if (matchArry.length === 0) {
                return;
            }

            console.log(matchArry);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, [matchArry], newData);
            }
        }
    };

    window.watchers.push(watch);
})();
