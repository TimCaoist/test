window.betUtil = {
    jndBetId: '96',
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
    var builderOrderParams = function (betInfo, issueNumber) {
        var betInfo = {
            "command_id": 521,
            "lottery_id": window.betUtil.jndBetId,
            "count": 2,
            "issue": issueNumber,
            "bet_info": betInfo
        }
        
        var model = {
            command: 'lottery_logon_request_transmit_v2',
            param: JSON.stringify(betInfo)
        };

        $.post("/controller/lottery/943848", model,
            function (data) {
                // console.log(data.data.detail[0].remark);
            });
    }

    window.betUtil.builderOrderParams = builderOrderParams;

    var builderBetInfos = function (index, betInfos, perMoney, multiple) {
        var datas = [];
        //"0.004"
        for (var i = 0; i < betInfos.length; i++) {
            datas.push({
                "method_id": "130001",
                "number": index + "@" + betInfos[i].number,
                "rebate_count": 80,
                "multiple": multiple + "",
                "mode": 3,
                "bet_money": (perMoney * betInfos[i].count).toFixed(3),
                "calc_type": "0"
            });
        }

        return datas;
    }

    window.betUtil.builderBetInfos = builderBetInfos;

    var buildBetStr = function () {
        var nstr = "";
        for (var i = 1; i < 1000; i++) {
            if (i % 111 === 0) {
                continue;
            }

            var n = i + "";
            while (n.length < 3) {
                n = "0" + n;
            }

            var matchCount = 0;
            for (var a = 0; a < numbers.length; a++) {
                var d = numbers[a];
                if (n.indexOf(d) > -1) {
                    matchCount++;
                }
            }

            if (matchCount === 0 || matchCount === 3) {
                continue;
            }

            nstr += n + "$";
        }

        return nstr.substring(0, nstr.length - 1);;
    };
})();

(function () {
    var storeDatas = [];
    var isFirst = true;
    var handlerResult = function (result) {
        if (betUtil.currentBetInfo !== null && result.CP_QS == betUtil.currentBetInfo.CP_QS) {
            return;
        }

        console.log("开奖期号:" + result.CP_QS + "开奖号码:" + result.ZJHM);

        if (isFirst === false) {
            storeDatas.push(result);
            for (var i = 0; i < window.watchers.length; i++) {
                var watcher = window.watchers[i];
                for (var a = 0; a < watcher.policies.length; a++) {
                    watcher.policies[a].check(watcher, result);
                }
            }

            for (var i = 0; i < window.watchers.length; i++) {
                var watcher = window.watchers[i];
                watcher.newBetData(betUtil.currentBetInfo, result, storeDatas);
            }
        }
        else {
            isFirst = false;
        }

        betUtil.currentBetInfo = result;
    };

    var loopGetBet = function () {
        betUtil.getCurrentBetData(betUtil.jndBetId, handlerResult);
    };

    var init = function () {
        for (var i = 0; i < window.policies.length; i++) {
            window.policies[i].register();
        }

        $("body").html("<button id='start'>开始</button><button id='stop'>停止</button>");
        $("#start").click(function () {
            window.betUtil.getBetDatas(betUtil.jndBetId, 2000, function (result) {
                storeDatas = result.reverse();
                handlerResult(storeDatas[storeDatas.length - 1]);
                console.log("开始抽奖");
                setInterval(loopGetBet, 15000);
            });
        });

        $("#stop").click(function () {
            console.log("开始停止");
            for (var i = 0; i < window.policies.length; i++) {
                window.policies[i].tryStop();
            }
        });
    };

    init();
})();