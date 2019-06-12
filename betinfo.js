window.betUtil = {
    xxnBetId: '96',
    jndBetId: '91',
    txBetId: '67',
    workId: function () {
        return $("#betId").val();
    },
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

window.console.logex = function (str) {
    var workId = window.betUtil.workId();
    console.log(str);
    $.get("http://127.0.0.1:1500?workId=" + workId + "&content=" + str, { }, function () {

    });
};

(function () {
    var builderOrderParams = function (betInfo, issueNumber) {
        var realBet = function () {
            var betInfos = {
                "command_id": 521,
                "lottery_id": window.betUtil.workId(),
                "count": betInfo.length,
                "issue": issueNumber,
                "bet_info": betInfo
            }

            var model = {
                command: 'lottery_logon_request_transmit_v2',
                param: JSON.stringify(betInfos)
            };

            $.post("/controller/lottery/943848", model,
                function (data) {
                    // console.log(data.data.detail[0].remark);
                });
        };

        $.post("/controller/user/get/get_user_balance/943848", {},
            function (data) {
                var money = data.data.money;

                var totalMoney = 0;
                for (var i = 0; i < betInfo.length; i++) {
                    totalMoney += parseFloat(betInfo[i].bet_money);
                }

                if (parseFloat(money) <= totalMoney) {
                    console.log("余额不足！");
                    return;
                }

                realBet();
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
    var lastCPQS = "";
    var handlerResult = function (result) {
        if (betUtil.currentBetInfo !== null && result.CP_QS == betUtil.currentBetInfo.CP_QS) {
            return;
        }

        var lastCP = storeDatas[storeDatas.length - 1];
        if (lastCP.CP_QS === result.CP_QS) {
            console.log("重复期号");
            return;
        }

        lastCPQS = result.CP_QS;
        console.logex("开奖期号:" + result.CP_QS + "开奖号码:" + result.ZJHM);
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

        betUtil.currentBetInfo = result;
    };

    var loopGetBet = function () {
        betUtil.getCurrentBetData(window.betUtil.workId(), handlerResult);
    };

    var init = function () {
        for (var i = 0; i < window.policies.length; i++) {
            window.policies[i].register();
        }

        var str = "<button id='start'>开始</button><button id='restart'>c开</button><button id='stop'>停止</button><div id='msg'></div><div id='havenmsg'></div><div id='brothermsg'></div>";
        str += "<div><input id='betId' type='text' value='" + window.betUtil.xxnBetId + "' ></div>";

        var ids = [96,91,67,65,47];
        str += "<div>"
        for (var i = 0; i < ids.length; i++) {
            str += "<button class='idButton' bet_id='" + ids[i] + "' >" + ids[i]+"</button>";
        }

        str += "</div>"

        str += "<div><button id='btnBrother'>brother</button></div>";
        str += "<div><button id='btnBrotherBet1'>brotherBet1</button></div>";
        str += "<div><button id='btnHavenBet1'>havenBet1</button></div>";
        str += "<div><button id='btnReverse1'>reverseBet1</button></div>";
        str += "<button id='dobet'>do</button>";
        str += "<div><input type='text' id='tbIndex' value='0'/></div>";
        str += "<div><input type='text' id='tbNum' value='0'/></div>";
        $("body").html(str);

        $(".idButton").click(function () {
            $("#betId").val($(this).attr("bet_id"));
        });

        $("#btnBrother").click(function () {
            if (sessionStorage["brother_start"] == "1") {
                sessionStorage["brother_start"] = "0";
            }
            else {
                sessionStorage["brother_start"] = "1";
            }
        });

        $("#btnBrotherBet1").click(function () {
            if (sessionStorage["brother_bet_start"] == "1") {
                sessionStorage["brother_bet_start"] = "0";
            }
            else {
                sessionStorage["brother_bet_start"] = "1";
            }
        });

        $("#btnHavenBet1").click(function () {
            if (sessionStorage["havenStart"] == "1") {
                sessionStorage["havenStart"] = "0";
            }
            else {
                sessionStorage["havenStart"] = "1";
            }
        });

        $("#btnReverse1").click(function () {
            if (sessionStorage["reverseStart"] == "1") {
                sessionStorage["reverseStart"] = "0";
            }
            else {
                sessionStorage["reverseStart"] = "1";
            }
        });

        $("#dobet").click(function () {
            var cpqs = (parseInt(lastCPQS) + 1) + "";
            doBet1(parseInt($("#tbIndex").val()), parseInt($("#tbNum").val()), 1, cpqs);
        });

        $("#start").click(function () {
            window.betUtil.getBetDatas(window.betUtil.workId(), 2000, function (result) {
                storeDatas = result.reverse();
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

        $("#restart").click(function () {
            console.log("重新开始");
            for (var i = 0; i < window.policies.length; i++) {
                window.policies[i].stop = window.policies[i].stopping = false;
            }
        });
    };

    init();
})();