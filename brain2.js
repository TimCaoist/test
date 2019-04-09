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
    var doubledoubleLoss = {
        isMatch: function (n, loss, indexs) {
            var index4 = indexs[indexs.length - 4];
            var index3 = indexs[indexs.length - 3];
            var index2 = indexs[indexs.length - 2];
            var index1 = indexs[indexs.length - 1];
            if (index4 !== index3 || index2 !== index1 || index1 !== loss) {
                return false;
            }

            return true;
        },
        color: "#8B0000",
    };

    var splitValueEqulsLoss = {
        isMatch: function (n, loss, indexs) {
            var index2 = indexs[indexs.length - 2];
            var index1 = indexs[indexs.length - 1];
            var v = index1 - index2;
            var target = index1 + v;
            if (target === loss) {
                return true;
            }

            return false;
        },
        color: "blue",
    };

    var tensValueEqulsLoss = {
        isMatch: function (n, loss, indexs) {
            var index3 = indexs[indexs.length - 3];
            var index2 = indexs[indexs.length - 2];
            var index1 = indexs[indexs.length - 1];
            if (index3 > 10 && index2 > 10 && index1 > 10 && loss >= 10) {
                return true;
            }

            return false;
        },
        color: "red",
    };


    var lossFuncs = [tensValueEqulsLoss, splitValueEqulsLoss, doubledoubleLoss];

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

    var getMaxCountData = function (nums, compareLength, max) {
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
            if (cloneNums[a].count === 1 && Math.abs(cloneNums[a].num) < 15) {
                continue;
            }

            outNumbers.push(cloneNums[a]);
            if (a > max) {
                break;
            }
        }

        return outNumbers;
    }

    var showCount = function (n, num) {
        var val = Math.abs(num);
        var isGreed = false;

        if (val < 4 && n > 7) {
            isGreed = true;
        }
        else if (val >= 4 && val <= 12 && n > 6) {
            isGreed = true;
        }
        else if (val > 12 && val < 21 && n > 2) {
            isGreed = true;
        }
        else if (val > 20 && val < 41 && n > 1) {
            isGreed = true;
        }
        else if (val >= 41) {
            isGreed = true;
        }

        if (isGreed === false) {
            return "<font style='color:#218868'>" + num + "</font>_" + n;
        }

        return "<font style='color:#218868'>" + num + "</font>_<font style='color:red'>" + n + "</font>";
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
        var loopNum = 200 + startIndex;
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
            for (var i = 1; i <= 200; i++) {
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
                var nums = getMaxCountData(indexs[a], s, 3);
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

                nums = getMaxCountData(missIndexs[a], s, 10);
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
            missIndexs: missIndexs,
            currentIndexs: currentIndexs
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

        return "<font style='color:#218868'>√</font>";
    };

    var printResult = function (reports, index, isLoss, result) {
        var str = "";
        for (var i = reports.length - 1; i >= 0; i--) {
            str += wasright(result[i].ZJHM.split(','), index, reports[i].details[index], isLoss, result);
        }

        return str;
    };

    var printSpecial = function (n, loss, indexs) {
        for (var i in lossFuncs) {
            var lossFunc = lossFuncs[i];
            if (lossFunc.isMatch(n, loss, indexs)) {
                return "<font color='" + lossFunc.color + "'>" + n + "_" + loss + "</font>,";
            }
        }

        return n + "_" + loss + ",";
    };

    var hanlderData = function (result) {
        var reports = [];
        for (var i = 1; i <= 10; i++) {
            reports.push(getReport(result, i));
        }

        var r1 = reports[0];
        var prevIndexs = r1.currentIndexs;

        var report = getReport(result, 0);
        var details = report.details;
        var indexs = report.indexs;
        var missIndexs = report.missIndexs;
        var currentIndexs = report.currentIndexs;

        var currentNum = result[0].ZJHM;
        var str = "当前号码：" + currentNum + "<br/><hr/>";
        currentNum = currentNum.split(',');

        for (var a = 0; a < 5; a++) {
            str += "当前指针:" + (a + 1) + "开" + currentNum[a]+"<br/>";
            var detail = details[a];
            var loss = detail.loss;
            str += "遗出现:" + printResult(reports, a, true, result);
            if (loss.length > 0) {
                var currentS = -1;
                for (var index in loss) {
                    var item = loss[index];
                    if (item.staticNum != currentS) {
                        str += "<br/>" + item.staticNum + "回合:";
                        currentS = item.staticNum;
                    }

                    str += item.num + "(" + showCount(item.count, item.currentNum) + ")";
                }
            }

            str += "<br/>";

            loss = detail.lossR;
            str += "差出现:" + printResult(reports, a, false, result);
            if (loss.length > 0) {
                var currentS = -1;
                for (var index in loss) {
                    var item = loss[index];
                    if (item.staticNum != currentS) {
                        str += "<br/>" + item.staticNum + "回合:";
                        currentS = item.staticNum;
                    }

                    str += item.num + "(" + showCount(item.count, item.currentNum) + ")";
                }
            }

            str += "<br/>";

            str += "当前遗:<br/>";
            for (var i = 0; i < currentIndexs[a].length; i++) {
                str += printSpecial(i, currentIndexs[a][i], indexs[a]);
            }

            str += "<br/>";

            str += "遗详情:<br/>";

            var prevIndex = prevIndexs[a];
            prevIndex.sort(function (a, b) {
                return b - a; 
            });

            for (var i = 0; i < indexs[a].length; i++) {
                var s = indexs[a][i];
                //str += (parseInt(s, 10) <= 5 && parseInt(s, 10) != 0) + ",";
                str += s + ",";
            }

            str += "<br/>";

            str += "当前差:<br/>";
            var lastIndex = indexs[a][indexs[a].length - 1];
            for (var i = 0; i < currentIndexs[a].length; i++) {
                var s = parseInt(currentIndexs[a][i], 10) - parseInt(lastIndex, 10);
                str += i + "_" + s + ",";
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

    window.betUtil.getBetDatas(betUtil.jndBetId, 300, hanlderData);

   
})();