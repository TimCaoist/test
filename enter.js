(function () {
    var lotId = window.httpRequest.getQueryValue("id");
    if (lotId === null) {
        lotId = "91";
    }

    var urls = [
    {
        id: '91',
        name: '俄罗斯',
    }, {
        id: '96',
        name: '新西兰',
    }, {
        id: '48',
        name: '加拿大',
    }, {
        id: '49',
        name: '台湾',
    }, {
        id: '1',
        name: '重庆',
    }, {
        id: '3',
        name: '天津',
    }, {
        id: '7', name: '新疆',
    }];

    var urlStr = "";
    var curUrl = null;
    for (var i = 0; i < urls.length; i++) {
        urlStr += '<a href="/static/html/client/bh/lottery/help.html?id=' + urls[i].id + '">' + urls[i].name + '</a>&nbsp;&nbsp;';
        if (urls[i].id === lotId) {
            curUrl = urls[i];
        }
    }

    $("body").html('<div><h3><b>' + curUrl.name + ':</b><a href="/static/html/client/bh/lottery/chart.html?16121801&cp_id=' + lotId + '" target="_blank">详情</a></h3></div>' +
        '<div><h4>开奖时间:<b style="color:red" id="openTimes">0</b> 锁定时间:<b style="color:red" id="times">0</b></h4></div><div>' + urlStr + '</div><div id="issue"></div><div id="report"><div></div><div></div><div></div></div>' +
        '金额：<input type="number" id="money" value="100"/>');

		
    $("#money").change(function(){
	    var val = 	$("#money").val();
		localStorage.money = val;
	});
	
	if (localStorage.money)
	{
		$("#money").val(localStorage.money);
	}
	
    var curIssueNum = "";
    var builderOrderParams = function (index, nums, mId, perCount) {
        var betInfo = {
            "command_id": 527,
            "lottery_id": lotId,
            "win_stop": "1",
            "bet_info": [
                {
                    "method_id": mId,
                    "number": index + "@" + nums,
                    "rebate_count": 83,
                    "trace_info": [
                        {
                            "issue": (curIssueNum + 1) + "",
                            "multiple": perCount + "",
                            "mode": mId === '120001' ? 2 : 3,
                            "bet_money": ""
                        },
                        {
                            "issue": (curIssueNum + 2) + "",
                            "multiple": (perCount * 4) + "",
                            "mode": mId === '120001' ? 2 : 3,
                            "bet_money": ""
                        }
                    ]
                }
            ]
        }

        var model = {
            command: 'lottery_logon_request_transmit_v2',
            param: JSON.stringify(betInfo)
        };

        $.post("/controller/lottery/949335", model,
            function (data) {
                console.log(data.data.detail[0].remark);
            });
    }

    var nums = [];
    for (var i = 0; i < 10; i++) {
        var subNums = [];
        for (var a = 0; a < 4; a++) {
            var n = i + a;
            if (n > 9) {
                n -= 10;
            }

            subNums.push(n + "");
        }

        nums.push(subNums);
    }

    var handlerResult = function (data) {
        var openDatas = data.data.detail.LIST;
        for (var i = 0; i < openDatas.length; i++) {
            if (i === 0) {
                curIssueNum = parseInt(openDatas[i].CP_QS);
            }

            window.ticket.datas.push(openDatas[i].ZJHM.split(","));
        }

        $("#issue").append("当前期号:" + curIssueNum + "_____" + openDatas[0].ZJHM + "<br/>");
		$("#report div").eq(0).append(window.ticket.four.report());
        $("#report div").eq(1).append(window.ticket.three.report());
		$("#report div").eq(2).append(window.ticket.two.report());
		$("#report div").css({
			float:'left',
			width:'200px'
		})
        $("#report button").click(function () {
            var index = $(this).attr('bind-index');
            var numbers = $(this).attr('bind-nstr').split(',');
            var nstr = "";
			var methodId = "";
			var perMoney = 0;
            switch(numbers.length)
			{
				case 4:
				nstr = window.ticket.three.builderNstr(numbers);
				methodId = "130001";
				perMoney = 1.512;
				break;
			    case 3:
				nstr = window.ticket.four.builderNstr(numbers);
				methodId = "140001";
				perMoney = 14.808;
				break;
				case 5:
				nstr = window.ticket.two.builderNstr(numbers);
				methodId = "120001";
				perMoney = 1.5;
				break;
			}

			var money = parseInt($("#money").val());
            var total = parseInt(money / perMoney);
            var perCount = parseInt(total / 5);
            nstr = nstr.substring(0, nstr.length - 1);
            builderOrderParams(index, nstr, methodId, perCount);
        });
    }

    $.post("/controller/lottery/chart", {
        command: "lottery_request_transmit_v2",
        content: "{\"command_id\":23,\"lottery_id\":\"" + lotId + "\",\"issue_status\":\"1\",\"count\":\"100\"}"
    },
    function (data) {
        handlerResult(data);
    });

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

    var date = new Date();
    var getDateText = function (n) {
        n = n + "";
        if (n.length < 2) {
            n = "0" + n;
        }

        return n;
    }

    var handlerTimes = function (id, sj) {
        var sdTime = getDateByStr(sj);
        var date3 = sdTime.getTime() - date.getTime();
        var leave1 = date3 % (24 * 3600 * 1000);
        var leave2 = leave1 % (3600 * 1000);
        var leave3 = leave2 % (60 * 1000);
        var minutes = Math.floor(leave2 / (60 * 1000))
        var seconds = Math.round(leave3 / 1000);
        if (seconds >= 0) {
            $(id).text(getDateText(minutes) + ":" + getDateText(seconds));
        }

        var timeInterId = setInterval(function () {
            seconds--;
            if (seconds > 0) {
                $(id).text(getDateText(minutes) + ":" + getDateText(seconds));
            }
            else if (seconds === 0 && minutes > 0) {
                minutes--;
                seconds = 59;
                $(id).text(getDateText(minutes) + ":" + getDateText(seconds));
            }
            else {
                $(id).text("00:00");
                window.clearInterval(timeInterId);
            }

        }, 1000);
    }

    var clientStr = date.getFullYear() + "" + getDateText(date.getMonth() + 1) + getDateText(date.getDate()) + getDateText(date.getHours()) + getDateText(date.getMinutes()) + getDateText(date.getSeconds());
    $.post("/controller/lottery/949335", {
        command: "lottery_request_transmit_v2",
        content: "{\"command_id\":550,\"lottery_id\":\"" + lotId + "\",\"client_time\":\"" + clientStr + "\",\"rand_key\":\"1482309207152\"}"
    },
   function (data) {
       handlerTimes("#times", data.data.issue_info.SDSJ);
       handlerTimes("#openTimes", data.data.issue_info.KJSJ);
   });
})();