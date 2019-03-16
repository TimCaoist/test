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

    var getReport = function (result, startIndex) {
        var indexs = [[], [], [], [], []];
        var loopNum = 30 + startIndex;
        var len = 5;
        for (var i = loopNum; i >= startIndex; i--) {
            var nums = result[i].ZJHM.split(',');
            for (var a = 0; a < len; a++) {
                var num = nums[a];
                var missNum = finPrevNumIndex(i, a, result, num) - i;
                indexs[a].push(missNum);
            }
        }

        var missIndexs = [[], [], [], [], []];
        for (var a = 0; a < len; a++) {
            for (var i = 1; i <= 30; i++) {
                var pervIndex = indexs[a][i - 1];
                var currentIndex = indexs[a][i];

                var data = currentIndex - pervIndex;
                missIndexs[a].push(data);
            }
        }

        var currentIndexs = [[], [], [], [], []];
        for (var a = 0; a < len; a++) {
            for (var i = 0; i < 10; i++) {
                var missNum = finPrevNumIndex(-1 + startIndex, a, result, i) + 1 - startIndex;
                currentIndexs[a].push(missNum);
            }
        }

        var staticNumbers = [5, 10, 15, 30];

        var reportDetails = [{}, {}, {}, {}, {}];
        for (var a = 0; a < 5; a++) {
            reportDetails[a].loss = [];
            reportDetails[a].lossR = [];

            for (var i = 0; i < staticNumbers.length; i++) {
                var s = staticNumbers[i];
                var nums = getMaxCountData(indexs[a], s);
                for (var b = 0; b < nums.length; b++) {
                    var currentNum = getMatchNum(currentIndexs[a], nums[b].num);
                    if (currentNum === null) {
                        continue;
                    }

                    reportDetails[a].loss.push({
                        num: nums[b].num,
                        count: nums[b].count,
                        currentNum: currentNum,
                        staticNum: s,
                    });
                }

                nums = getMaxCountData(missIndexs[a], s);
                for (var b = 0; b < nums.length; b++) {
                    var currentNum = getMissMatchNum(currentIndexs[a], indexs[a], nums[b].num);
                    if (currentNum === null) {
                        continue;
                    }

                    reportDetails[a].lossR.push({
                        num: nums[b].num,
                        count: nums[b].count,
                        currentNum: currentNum,
                        staticNum: s,
                    });
                }
            }
        }

        return {
            details: reportDetails,
            indexs: indexs,
            missIndexs: missIndexs
        }
    };

    var wasright = function (nums, index, report, isLoss) {
        var num = nums[index];
        var loss = isLoss ? report.loss : report.lossR;

        for (var i in loss) {
            var item = loss[i];
            if (item.currentNum == num) {
                return "<font style='color:red'>X" + item.num + "(" + item.count + "_" + item.staticNum +")</font>";
            }
        }

        return "<font style='color:green'>√</font>";
    };

    var printResult = function (report1, report2, report3, index, isLoss, result) {
        var r3 = wasright(result[2].ZJHM.split(','), index, report3, isLoss, result);
        var r2 = wasright(result[1].ZJHM.split(','), index, report2, isLoss, result);
        var r1 = wasright(result[0].ZJHM.split(','), index, report1, isLoss, result);
        return r3 + "" + r2 + "" + r1;
    };

    var hanlderData = function (result) {
        var report3 = getReport(result, 3).details;
        var report2 = getReport(result, 2).details;
        var report1 = getReport(result, 1).details;


        var report = getReport(result, 0);
        var details = report.details;
        var indexs = report.indexs;
        var missIndexs = report.missIndexs;

        var str = "当前号码：" + result[0].ZJHM + "<br/><hr/>";

        for (var a = 0; a < 5; a++) {
            str += "当前指针:" + a + "<br/>";
            var detail = details[a];
            var loss = detail.loss;
            if (loss.length > 0) {
                str += "遗出现:" + printResult(report1[a], report2[a], report3[a], a, true, result);
                var currentS = -1;
                for (var index in loss) {
                    var item = loss[index];
                    if (item.staticNum != currentS) {
                        str += "<br/>" + item.staticNum + "回合:";
                        currentS = item.staticNum;
                    }

                    str += item.num + "(" + showCount(item.count, item.currentNum) + ")";
                }

                str += "<br/>";
            }

            loss = detail.lossR;
            if (loss.length > 0) {
                str += "差出现:" + printResult(report1[a], report2[a], report3[a], a, false, result);
                var currentS = -1;
                for (var index in loss) {
                    var item = loss[index];
                    if (item.staticNum != currentS) {
                        str += "<br/>" + item.staticNum + "回合:";
                        currentS = item.staticNum;
                    }

                    str += item.num + "(" + showCount(item.count, item.currentNum) + ")";
                }

                str += "<br/>";
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