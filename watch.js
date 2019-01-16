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

    var findAllGuys = function (nums, a, si, histroyDatas, takeLen) {
        var i = si;
        var guys = [];
        while (i > -1) {
            var guy = findGuys(nums, a, i, histroyDatas, takeLen);
            if (guy === null) {
                i = - 1;
            }
            else {
                guys.push(guy);
                i = guy.matchIndex - takeLen;
            }
        }

        return guys;
    };

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
                    var macthguys = findAllGuys(nums, a, len - takenlen, histroyDatas, takenlen);
                    if (macthguys.length === 0) {
                        continue;
                    }

                    var mgl = macthguys.length;
                    var haveFound = false;
                    for (var b = 0; b < mgl; b++) {
                        var mg = macthguys[b];
                        var mgNum = getNums(a, mg.matchIndex + 4, histroyDatas, takenlen + 4);
                        var guy = findGuys(mgNum, a, mg.matchIndex - 8 - takenlen, histroyDatas, takenlen + 4, mg.isBig);
                        if (guy === null) {
                            continue;
                        }

                        haveFound = true;
                        guys.push(mg);
                    }

                    if (haveFound) {
                        break;
                    }
                }

                if (guy === null || typeof guy === "undefined") {
                    continue;
                }

                guys.push(guy);
            }

            if (guys.length === 0) {
                watch.matchGuy = null;
                return;
            }

            guys.sort(function (a, b) {
                if (b.compareLen != a.compareLen) { return b.compareLen - a.compareLen; }
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

