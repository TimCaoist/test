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

    //window.watchers.push(watch);
})();

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
            if (isBig) {
                if (na[i] < 5 && nb[i] >= 5) {
                    return false;
                }

                if (na[i] >= 5 && nb[i] < 5) {
                    return false;
                }
            }
            else {
                if (na[i] % 2 !== nb[i] % 2) {
                    return false;
                }
            }
        }

        return true;
    }

    var findGuys = function (nums, a, si, histroyDatas, takeLen, compareType) {
        var len = histroyDatas.length;
        for (var i = si; i >= len - 90; i--) {
            var matchNums = getNums(a, i, histroyDatas, takeLen);
            if (matchNums.length === 0) {
                return null;
            }

            var isMatch = false;
            if (typeof compareType === "undefined") {
                var isBig = false;
                isMatch = compare(nums, matchNums, isBig);
                if (!isMatch) {
                    isBig = true;
                    isMatch = compare(nums, matchNums, true);
                }
            }
            else {
                var isBig = compareType;
                isMatch = compare(nums, matchNums, isBig);
            }

            if (!isMatch) {
                continue;
            }

            return {
                numIndex: a,
                isBig: isBig,
                matchNums: matchNums,
                matchIndex: i,
                nums: nums,
                compareLen: takeLen,
                prevNums: getNums(a, i + 4, histroyDatas, 4),
            };
        }

        return null;
    };

    var findAllGuys = function (nums, a, si, histroyDatas, takeLen, matchTimes) {
        var i = si;
        var guys = [];
        while (i > -1) {
            var guy = findGuys(nums, a, i, histroyDatas, takeLen);
            if (guy === null) {
                i = - 1;
            }
            else {
                var mgNum = getNums(a, guy.matchIndex + 4, histroyDatas, takeLen + 4);
                var isMatch = findMatchGuy(mgNum, guy.isBig, guy.matchIndex + 4, a, histroyDatas, takeLen + 4, matchTimes);
                if (isMatch) {
                    guys.push(guy);
                }
                
                i = guy.matchIndex - takeLen;
            }
        }

        return guys;
    };

    var findMatchGuy = function (mgNum, isBig, si, a, histroyDatas, takenlen, matchTimes) {
        var guy = findGuys(mgNum, a, si, histroyDatas, takenlen, isBig);
        if (guy === null) {
            return false;
        }

        if (matchTimes === 1) {
            return true;
        }

        return findMatchGuy(guy.matchNums, isBig, guy.matchIndex - takenlen, a, histroyDatas, takenlen, --matchTimes);
    }

	var watch = {
        name: "fuckyourmom",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var guys = [];
            var len = histroyDatas.length;
            for (var a = 0; a < 5; a++) {
                for (var takenlen = 12; takenlen >= 6; takenlen--) {
                    var nums = getNums(a, len, histroyDatas, takenlen);
                    var mt = 2;
                    if (takenlen === 7) {
                        mt = 2;
                    }
                    else if (takenlen <= 7) {
                        mt = 3;
                    }
                    else if (takenlen > 7 && takenlen < 10) {
                        mt = 2;
                    }

                    var macthguys = findAllGuys(nums, a, len - takenlen, histroyDatas, takenlen, mt);
                    if (macthguys.length === 0) {
                        continue;
                    }

                    var mgl = macthguys.length;
                    for (var b = 0; b < mgl; b++) {
                        guys.push(macthguys[b]);
                    }

                    break;
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
	
	//window.watchers.push(watch);
})();

(function () {
    var compare = function (aArray, bArray) {
        var rights = [];
        for (var i = 0; i < 3; i++) {
            if (aArray[i] == bArray[i]) {
                rights.push(true);
            }
        }

        return rights.length >= 2;
    };

    var isMatch = function (datas, ns, index, a, b, c) {
        for (var i = index; i < index + 4; i++) {
            var num = datas[i].ZJHM.split(',');
            if (compare([num[a], num[b], num[c]], ns)) {
                return true;
            }
        }

        return false;
    }

    var getGuessData = function (datas) {
        var d1 = datas[0].ZJHM.split(',');
        var d2 = datas[1].ZJHM.split(',');
        var d3 = datas[2].ZJHM.split(',');
        var d4 = datas[3].ZJHM.split(',');
        var len = datas.length;

        var matchGuesses = [];
        for (var a = 0; a < 2; a++) {
            for (var b = a + 1; b < 3; b++) {
                for (var c = b + 1; c < 5; c++) {
                    var nums1 = [d1[a], d1[b], d1[c]];
                    var nums2 = [d2[a], d2[b], d2[c]];
                    var nums3 = [d3[a], d3[b], d3[c]];
                    var nums4 = [d4[a], d4[b], d4[c]];

                    for (var i = 1; i < len - 6; i++) {
                        var a1 = isMatch(datas, nums1, i, a, b, c);
                        var a2 = isMatch(datas, nums2, i + 1, a, b, c);
                        if (a1 === false || a2 === false) {
                            continue;
                        }

                        var a3 = isMatch(datas, nums3, i + 2, a, b, c);
                        var a4 = isMatch(datas, nums4, i + 3, a, b, c);

                        var matchGuess = {
                            index: i - 1,
                            count: 2,
                            a: a,
                            b: b,
                            c: c
                        };

                        if (a3) {
                            matchGuess.count++;
                            if (a4) {
                                matchGuess.count++;
                            }
                        }

                        matchGuesses.push(matchGuess);
                    }
                }
            }
        }

        matchGuesses.sort(function (a, b) {
            if (b.count != a.count) {
                return b.count - a.count;
            }
            else {
                return a.index - b.index;
            }
        });

        var firstMatchGuess = matchGuesses[0];
        var betDatas = [];
        for (var i = firstMatchGuess.index; i < firstMatchGuess.index + 4; i++) {
            var d = datas[i].ZJHM.split(',');
            betDatas.push([d[firstMatchGuess.a], d[firstMatchGuess.b], d[firstMatchGuess.c]]);
        }

        firstMatchGuess.betDatas = betDatas;
        console.log(firstMatchGuess);
        return firstMatchGuess;
    };

    var lastGuess = null;

    var watch = {
        name: "dolu",
        txt: "",
        prevWrong: false,
        policies:[],
        newBetData: function (oldData, newData) {
            if (lastGuess !== null) {
                var d = newData.ZJHM.split(',');
                var isWrong = false;
                for (var i = 0; i < lastGuess.betDatas.length; i++) {
                    if (compare(lastGuess.betDatas[i], [d[lastGuess.a], d[lastGuess.b], d[lastGuess.c]])) {
                        isWrong = true;
                        break;
                    }
                };

                watch.prevWrong = isWrong;
                if (isWrong) {
                    console.log("Watch -- dolu错了!");
                    watch.txt += "x";
                }
                else {
                    watch.txt += "o";
                }
            }

            window.betUtil.getBetDatas(betUtil.jndBetId, 1000, function (result) {
                lastGuess = getGuessData(result);
                for (var a = 0; a < watch.policies.length; a++) {
                    watch.policies[a].tryStart(watch, lastGuess, compare, newData);
                }
            });
        }
    };

    //watchers.push(watch);
    //console.log("加载Watch -- dolu成功");
})();


(function () {
    var getMissMatch = function (a, n, histroyDatas, len) {
        if (histroyDatas[len - 1].ZJHM.split(',')[a] == n) {
            return [];
        }

        var ns = [];
        var firstIndex = len - 1;
        var lastIndex = firstIndex ;
        for (var i = firstIndex ; i >= 0; i--) {
            var data = histroyDatas[i].ZJHM.split(',')[a];
            if (data == n) {
                if (lastIndex !== -1) {
                    var miss = lastIndex - i;
                    miss = miss - 1;
                    ns.push(miss);
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

                    ccc.push(splitNs);
                }

                if (ccc.length > 2) {
                    break;
                }

                splitNs = [];
                lastMax = n;
            }
        }

        return ccc;
    }

    var find = function (histroyDatas) {
        var len = histroyDatas.length;
        var arrary = [];
        for (var a = 0; a < 5; a++) {
            var ns = [];
            for (var n = 0; n < 10; n++) {
                ns.push(getMissMatch(a, n, histroyDatas, len));
            }

            arrary.push(ns);
        }

        return arrary;
    }

    var watch = {
        name: "altgo",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var arrary = find(histroyDatas);
            for (var a = 0; a < watch.policies.length; a++) {
                watch.policies[a].tryStart(watch, arrary, newData);
            }
        }
    };

    window.watchers.push(watch);
})();
