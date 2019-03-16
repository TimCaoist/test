window.betUtil = {
    jndBetId: '91',
    getCurrentBetData: function (lotId, func) {
        return window.betUtil.getBetDatas(lotId, 1, function (result) {
            func(result[0]);
        });
    },
    getBetDatas: function (lotId, count, func) {
        $.ajax({
            type: "POST",
            url: "/controller/lottery/chart",
            data: {
                command: "lottery_request_transmit_v2",
                content: "{\"command_id\":23,\"lottery_id\":\"" + lotId + "\",\"issue_status\":\"1\",\"count\":\"" + count + "\"}"
            },
            success: function (data) {
                func(data.data.detail.LIST);
            },
            error: function (data) {
                console.log(data);
            }
        });
    },
    currentBetInfo: null,
};

(function () {
    var finPrevNumIndex = function (i, a, nums, matchNum) {
        var length = nums.length;
        for (var si = i + 1; si < length; si++) {
            var num = nums[si].ZJHM.split(',')[a];
            if (num == matchNum) {
                return si - 1;
            }
        }

        return 70;
    }

    var getMaxCountData = function (nums, compareLength) {
        var cloneNums = [];
        for (var a = nums.length - 1; a >= (nums.length - compareLength); a--) {
            var n = nums[a];
            var cn = null;
            for (var i = 0; i < cloneNums.length; i++) {
                if (cloneNums[i].num === n) {
                    cn = cloneNums[i];
                    break;
                }
            }

            if (cn === null) {
                cloneNums.push({
                    num: n,
                    count: 1
                })
            }
            else {
                cn.count = cn.count + 1;
            }
        }

        cloneNums.sort(function (a, b) {
            return b.count - a.count;
        });

        var outNumbers = [];
        for (var a = 0; a < cloneNums.length; a++) {
            if (cloneNums[a].count === 1) {
                break;
            }

            outNumbers.push(cloneNums[a]);
            if (a > 3) {
                break;
            }
        }

        return outNumbers;
    }

    var showCount = function (n, num) {
        if (n < 3) {
            return n + "_<font style='color:green'>" + num + "</font>";
        }

        return "<font style='color:red'>" + n + "</font>_<font style='color:green'>" + num + "</font>";
    }

    var getMatchNum = function (currentIndex, num) {
        for (var i = 0; i < currentIndex.length; i++) {
            if (currentIndex[i] === num) {
                return i;
            }
        }

        return null;
    };

    var getMissMatchNum = function (currentIndex, indexs, num) {
        var index = indexs[indexs.length - 1];
        var rIndex = index + num;
        return getMatchNum(currentIndex, rIndex);
    };

    var hanlderData = function (result) {
        var indexs = [[], [], [], [], []];
        var loopNum = 30;
        var len = 5;
        for (var i = loopNum; i >= 0; i--) {
           var nums = result[i].ZJHM.split(',');
            for (var a = 0; a < len; a++) {
               var num = nums[a];
               var missNum = finPrevNumIndex(i, a, result, num) - i;
               indexs[a].push(missNum);
           }
        }

        var missIndexs = [[], [], [], [], []];
        for (var a = 0; a < len; a++) {
            for (var i = 1; i <= loopNum; i++) {
                var pervIndex = indexs[a][i - 1];
                var currentIndex = indexs[a][i];

                var data = currentIndex - pervIndex;
                missIndexs[a].push(data);
            }
        }

        var currentIndexs = [[], [], [], [], []];
        for (var a = 0; a < len; a++) {
            for (var i = 0; i < 10; i++) {
                var missNum = finPrevNumIndex(-1, a, result, i) + 1;
                currentIndexs[a].push(missNum);
            }
        }

        var str = "当前号码：" + result[0].ZJHM + "<br/><hr/>";
        var staticNumbers = [5, 10, 15, 30]
        for (var a = 0; a < 5; a++) {
            str += "当前指针:" + a + "<br/>";
            for (var i = 0; i < staticNumbers.length; i++) {
                var s = staticNumbers[i];
                var huiheStr = "";
                var nums = getMaxCountData(indexs[a], s);
                var subStr = "遗出现:";
                var c = 0;
                for (var b = 0; b < nums.length; b++) {
                    var currentNum = getMatchNum(currentIndexs[a], nums[b].num);
                    if (currentNum === null) {
                        continue;
                    }

                    c++;
                    subStr += nums[b].num + "(" + showCount(nums[b].count, currentNum) +")"
                }

                subStr += "<br/>";
                if (c > 0) {
                    huiheStr += subStr;
                }

                nums = getMaxCountData(missIndexs[a], s);
                var subStr = "差出现:";
                var c = 0;
                for (var b = 0; b < nums.length; b++) {
                    var currentNum = getMissMatchNum(currentIndexs[a], indexs[a], nums[b].num);
                    if (currentNum === null) {
                        continue;
                    }

                    c++;
                    subStr += nums[b].num + "(" + showCount(nums[b].count, currentNum) + ")"
                }

                subStr += "<br/>";
                if (c > 0) {
                    huiheStr += subStr;
                }

                if (huiheStr.length === 0) {
                    continue;
                }

                str += s + "回合内统计：<br/>" + huiheStr;
            }

            str += "遗详情:<br/>";
            for (var i = 0; i < indexs[a].length; i++) {
                var s = indexs[a][i];
                str += s + ",";
            }

            str += "<br/>";

            str += "差详情:<br/>";
            for (var i = 0; i < missIndexs[a].length; i++) {
                var s = missIndexs[a][i];
                str += s + ",";
            }

            str += "<br/>";
            str += "<hr/>";
        }

        $("body").html(str);
    };

    window.betUtil.getBetDatas(betUtil.jndBetId, 100, hanlderData);

   
})();