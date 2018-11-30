(function () {
    var hanlderLotIds = ['96', '49'];
    var betInfos = {
        openDatas: [],
        betInfos: [],
        maxBetCount: 1,
        curBetCount: 0,
        winCount: 6,
        betMoney: 132
    }

    var getBetDatas = function (lotId) {
        var result;
        $.ajax({
            type: "POST",
            url: "/controller/lottery/chart",
            async: false,
            data: {
                command: "lottery_request_transmit_v2",
                content: "{\"command_id\":23,\"lottery_id\":\"" + lotId + "\",\"issue_status\":\"1\",\"count\":\"300\"}"
            },
            success: function (data) {
                result = data
            }
        });

        return result;
    };

    var builderOrderParams = function (betInfo, issueNumber, needFlow) {
        var index = "";
        for (var i = 0; i < betInfo.arry.length; i++) {
            index += betInfo.arry[i];
            if (i !== (betInfo.arry.length - 1)) {
                index += ","
            }
        }

        console.log("下注" + betInfo.lotId + "位置:" + index);
        var mId = betInfo.methodId;
        var perCount = betInfo.perCount;
        var betInfo = {
            "command_id": 527,
            "lottery_id": betInfo.lotId,
            "win_stop": "1",
            "bet_info": [
                {
                    "method_id": mId,
                    "number": index + "@" + betInfo.nStr,
                    "rebate_count": 83,
                    "trace_info": [
                        {
                            "issue": (issueNumber + 1) + "",
                            "multiple": perCount + "",
                            "mode": mId === '120001' ? 2 : 3,
                            "bet_money": ""
                        }
                    ]
                }
            ]
        }

        if (needFlow === false) {
            betInfo.bet_info[0].trace_info.push(
            {
                "issue": (issueNumber + 2) + "",
                "multiple": (perCount * 4) + "",
                "mode": mId === '120001' ? 2 : 3,
                "bet_money": ""
            });
        }

        var model = {
            command: 'lottery_logon_request_transmit_v2',
            param: JSON.stringify(betInfo)
        };

        $.post("/controller/lottery/949335", model,
            function (data) {
               // console.log(data.data.detail[0].remark);
            });
    }

    var notifyChanged = function (lotId) {
        var betInfoCount = betInfos.betInfos.length;
        var openData;
        for (var i = 0; i < betInfos.openDatas.length; i++) {
            var oData = betInfos.openDatas[i];
            if (oData.lotId === lotId) {
                openData = oData;
                break;
            }
        }

        var lastIssueNumber = openData.lastIssuember;
        for (var i = betInfoCount - 1; i >= 0; i --) {
            var betInfo = betInfos.betInfos[i];
            if (betInfo.lotId === lotId) {
                var curStr = "";
                for (var a = 0; a < betInfo.arry.length; a ++) {
                    curStr += openData.datas[0][betInfo.arry[a]];
                }

                if (betInfo.nStr.indexOf(curStr) > -1) {
                    betInfos.winCount--;
                    betInfos.betInfos.splice(i, 1);
                    console.log("盈利一局！");
                }
                else if (betInfo.step === 1) {
                    console.log("第二轮!");
                    betInfo.step = 2;
                    if (typeof betInfo.step2 !== "function") {
                        return;
                    }

                    var nStr = "";
                    var betNumber = betInfo.step2(betInfo.arry, openData.datas[0]);
                    switch (betInfo.arry.length) {
                    case 2:
                        nStr = window.tu.two.builderNstr(betNumber);
                        break;
                    case 3:
                        nStr = window.tu.three.builderNstr(betNumber);
                        break;
                    case 4:
                        nStr = window.tu.four.builderNstr(betNumber);
                        break;
                    }

                    betInfo.nStr = nStr;
                    betInfo.perCount = betInfo.perCount * 4;
                    builderOrderParams(betInfo, lastIssueNumber, true);
                    console.log("下注号码:" + betNumber);
                }
                else {
                    betInfos.betInfos.splice(i, 1);
                    betInfos.winCount = 0;
                    console.log("失败了!");
                }
            }
        }

        if (betInfos.betInfos.length >= betInfos.maxBetCount || betInfos.winCount <= 0) {
            if (betInfos.winCount <= 0) {
                console.log("已达到最大获利次数！");
            }

            return;
        }

        var matchInfos = window.tu.handlerDatas(openData.datas);
        if (matchInfos.length > 0) {
            console.log("有合适的触发器了!");
            matchInfos.sort(function (a, b) { return b.rate - a.rate });
            betInfos.curBetCount++;
            var matchInfo = matchInfos[0];
            matchInfo.step = 1;
            betInfos.betInfos.push(matchInfo);
            var nStr = "";
            var methodId = "";
            var perMoney = 0;
            switch (matchInfo.arry.length) {
                case 2:
                    methodId = "120001";
                    perMoney = 1.5;
                    nStr = window.tu.two.builderNstr(matchInfo.step1);
                   break;
                case 3:
                    methodId = "130001";
                    perMoney = 1.512;
                    nStr = window.tu.three.builderNstr(matchInfo.step1);
                   break;
                case 4:
                    methodId = "140001";
                    perMoney = 14.808;
                    nStr = window.tu.four.builderNstr(matchInfo.step1);
                   break;
            }

            if (nStr === "") {
                return;
            }

            var total = parseInt(betInfos.betMoney / perMoney);
            var perCount = parseInt(total / 5);
            matchInfo.betStr = nStr;
            matchInfo.lotId = lotId;
            matchInfo.methodId = methodId;
            matchInfo.perCount = perCount;
            matchInfo.nStr = nStr;
            if (matchInfo.step2) {
                builderOrderParams(matchInfo, lastIssueNumber, true);
                console.log("下注号码:" + matchInfo.step1);
            }
            else {
                builderOrderParams(matchInfo, lastIssueNumber, false);
                console.log("下注号码:" + matchInfo.step1);
            }
        }
    }

    var handlerResult = function (data, lotId) {
        if (typeof data.data === "undefined" || typeof data.data.detail === "undefined") {
		    return false;
		}

        var openDatas = data.data.detail.LIST;
        var curIssueNum;
        var datas = [];
        for (var i = 0; i < openDatas.length; i++) {
            if (i === 0) {
                curIssueNum = parseInt(openDatas[i].CP_QS);
            }

            datas.push(openDatas[i].ZJHM.split(","));
        }

        var isFound = false;
        for (var i = 0; i < betInfos.openDatas.length; i++) {
            var openData = betInfos.openDatas[i];
            if (openData.lotId === lotId) {
                isFound = true;
                if (openData.lastIssuember !== curIssueNum) {
                    openData.datas = datas;
                    openData.lastIssuember = curIssueNum;
                    console.log("当前" + lotId + "期号为：" + curIssueNum + "开奖号码:" + datas[0]);
                    return true;
                }
            }
        }

        if (isFound === false) {
            betInfos.openDatas.push({
                lotId: lotId,
                datas: datas,
                lastIssuember: curIssueNum
            });

            return true;
        }

        return false;
    }

    var loopQuery = function (lotId, times) {
        if (betInfos.winCount <= 0) {
            return;
        }

        setTimeout(function() {
            var betData = getBetDatas(lotId);
            var isChanged = handlerResult(betData, lotId);
            if (isChanged) {
                notifyChanged(lotId);
                var s = getOpenSeconds(lotId);
                loopQuery(lotId, (s + 5) * 1000);
            }
            else {
                loopQuery(lotId, 5000);
            }
        }, times);
    };

    var getDateText = function (n) {
        n = n + "";
        if (n.length < 2) {
            n = "0" + n;
        }

        return n;
    }

    var getOpenSeconds = function (lotId) {
       var date = new Date();
       var clientStr = date.getFullYear() + "" + getDateText(date.getMonth() + 1) + getDateText(date.getDate()) + getDateText(date.getHours()) + getDateText(date.getMinutes()) + getDateText(date.getSeconds());
       var s = 0;
       $.ajax({
            type: "POST",
            url: "/controller/lottery/949335",
            async:false,
            data: {
                command: "lottery_request_transmit_v2",
                content: "{\"command_id\":550,\"lottery_id\":\"" +
                    lotId +
                    "\",\"client_time\":\"" +
                    clientStr +
                    "\",\"rand_key\":\"1482309207152\"}"
            },
            dataType: "json",
            success: function(data) {
                s = data.data.issue_info.KJSJ;
            }
       });

       return handlerTimes(s);
    }

    var getDateByStr = function (str) {
        var dStr = str.split("");
        var dateStr = dStr[0] +
            dStr[1] +
            dStr[2] +
            dStr[3] +
            "-" +
            dStr[4] +
            dStr[5] +
            "-" +
            dStr[6] +
            dStr[7] +
            " " +
            dStr[8] +
            dStr[9] +
            ":" +
            dStr[10] +
            dStr[11] +
            ":" +
            dStr[12] +
            dStr[13];

        return new Date(dateStr);
    };

    var handlerTimes = function (sj) {
        var date = new Date();
        var sdTime = getDateByStr(sj);
        var date3 = sdTime.getTime() - date.getTime();
        var leave1 = date3 % (24 * 3600 * 1000);
        var leave2 = leave1 % (3600 * 1000);
        var leave3 = leave2 % (60 * 1000);
        var minutes = Math.floor(leave2 / (60 * 1000))
        var seconds = Math.round(leave3 / 1000);
        return minutes * 60 + seconds;
    }

    var init = function () {
        $("body").html('');
        for (var i = 0; i < hanlderLotIds.length; i++) {
            var lotId = hanlderLotIds[i];
            var betData = getBetDatas(lotId);
            handlerResult(betData, lotId);
            var s = getOpenSeconds(lotId);
            loopQuery(lotId, (s + 5)* 1000);
        }
    };

    init();
})();