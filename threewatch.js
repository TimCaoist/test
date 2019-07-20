(function () {
    var find = function (storeDatas, indexes) {
        var i = storeDatas.length - 1;
        var pppPrevNums = fourWatchUtil.getNums(storeDatas, i - 4, indexes);
        var ppPrevNums = fourWatchUtil.getNums(storeDatas, i - 3, indexes);
        var pPrevNums = fourWatchUtil.getNums(storeDatas, i - 2, indexes);
        var prevNums = fourWatchUtil.getNums(storeDatas, i - 1, indexes);
        var nums = fourWatchUtil.getNums(storeDatas, i, indexes);

        var mn = null;

        for (var n = 0; n <= 9; n++) {
            if (pppPrevNums.indexOf(n + '') < 0 &&
                ppPrevNums.indexOf(n + '') > -1 &&
                nums.indexOf(n + '') > -1 &&
                prevNums.indexOf(n + '') > -1 &&
                pPrevNums.indexOf(n + '') > -1) {
                mn = n;
                break;
            }
        }

        if (mn === null) {
            return null;
        }

        var numbers = [];
        if (mn <= 2) {
            numbers = ["0", "1", "2", "3", "4"];
        }
        else if (mn >= 7) {
            numbers = ["5", "6", "7", "8", "9"];
        }
        else {
            for (var a = mn - 2; a <= mn + 2; a++) {
                numbers.push(a + '');
            }
        }

        return {
            index: indexes[0],
            nums: numbers,
            t: 1
        }
    }

    var watch1 = {
        name: "threeBaoZi1",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var match = find(histroyDatas, [0, 1, 2]);

            if (match == null) {
                return;
            }

            console.log(match);
            for (var a = 0; a < watch1.policies.length; a++) {
                watch1.policies[a].tryStart(watch1, match, newData);
            }
        }
    };

    window.watchers.push(watch1);

    var watch2 = {
        name: "threeBaoZi2",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var match = find(histroyDatas, [1, 2, 3]);

            if (match == null) {
                return;
            }

            console.log(match);
            for (var a = 0; a < watch2.policies.length; a++) {
                watch2.policies[a].tryStart(watch2, match, newData);
            }
        }
    };

    window.watchers.push(watch2);

    var watch3 = {
        name: "threeBaoZi3",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var match = find(histroyDatas, [2, 3, 4]);

            if (match == null) {
                return;
            }

            console.log(match);
            for (var a = 0; a < watch3.policies.length; a++) {
                watch3.policies[a].tryStart(watch3, match, newData);
            }
        }
    };

    window.watchers.push(watch3);
})();