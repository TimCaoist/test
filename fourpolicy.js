sessionStorage["bet_multiple_4"] = 1;
var filterFourNumbers = function (n, numberArray) {
    return !(numberArray.indexOf(n[0]) > - 1 && numberArray.indexOf(n[1]) > -1);
};

var getFourIndex = function (index) {
    switch (index + "") {
        case "0":
            return [0, 1, 2, 3];
        case "1":
            return [1, 2, 3, 4];
    }
};

var doFourBet = function (betIndex, nums, bias, issueNumber) {
    var betNumberA = "";
    var betNumberB = "";
    var ca = 0;
    var cb = 0;

    var filters = [];
    filters.push(filterFourNumbers);

    for (var i = 0; i < 10000; i++) {
        var n = (i + '').padLeft('0', 4);
        var isMatch = true;
        for (var fi in filters) {
            var filter = filters[fi];
            if (filter(n, nums) === false) {
                isMatch = false;
                break;
            }
        }

        if (isMatch === false) {
            continue;
        }

        if (i < 5000) {
            ca++;
            betNumberA += n + "$";
        }
        else {
            cb++;
            betNumberB += n + "$";
        }
    }

    var datas = [];
    var multiple = parseInt(sessionStorage["bet_multiple_4"], 10);
    var perMoney = multiple * 0.002;
    var indexes = getFourIndex(betIndex);
    var index = indexes[0] + "," + indexes[1] + "," + indexes[2] + "," + indexes[3];

    datas.push({
        "method_id": "140001",
        "number": index + "@" + betNumberA.substr(0, betNumberA.length - 1),
        "rebate_count": 80,
        "multiple": multiple + "",
        "mode": 3,
        "bet_money": (perMoney * ca).toFixed(3),
        "calc_type": "0"
    });

    datas.push({
        "method_id": "140001",
        "number": index + "@" + betNumberB.substr(0, betNumberB.length - 1),
        "rebate_count": 80,
        "multiple": multiple + "",
        "mode": 3,
        "bet_money": (perMoney * cb).toFixed(3),
        "calc_type": "0"
    });

    console.log("��ע��Ϣ:");
    console.log(datas);
    window.betUtil.builderOrderParams(datas, issueNumber, 'fourbet');
};

var createFourPolicy = function (name, cacheName) {
    var register = function () {
        var watch = findWatch(name);
        watch.policies.push(policy);
    };

    var compare = function (ns, fiveNumber) {
        return !(ns.indexOf(fiveNumber[0]) > -1 && ns.indexOf(fiveNumber[1]) > -1);
    };

    var policy = {
        register: register,
        isRunning: false,
        stoping: false,
        bias: 1,
        stopping: false,
        right: 0,
        wins: 0,
        tryStop: function () {
            if (policy.bias === 1 && policy.isRunning === false) {
                policy.stop = true;
                return;
            }

            policy.stopping = true;
        },
        check: function (watch, newData) {
            if (watch === null) {
                return;
            }

            if (policy.isRunning === false) {
                return;
            }

            policy.isRunning = false;
            var ns = [];
            for (var s = policy.i; s < policy.i + 4; s++) {
                var n1 = newData.ZJHM.split(',')[s];
                ns.push(n1);
            }

            var isRight = compare(ns, policy.nums);

            if (isRight) {
                policy.wins++;
                batchWins++;
                console.logex("����" + name + "��ȷӯ��һ�Ρ���ǰ����������" + policy.wins + "��ӯ��: " + batchWins);
            }
            else {
                sessionStorage[cacheName] = "1";
                console.logex("����" + name + "���սᡣ");
            }
        },
        tryStart: function (watch, array, newData) {
            if (policy.isRunning) {
                return;
            }

            var matchItem = array;
            policy.bias = 1;
            policy.CP_QS = newData.CP_QS;
            policy.isRunning = true;
            policy.i = matchItem.index;
            policy.nums = matchItem.nums;

            console.logex("����" + name + "������������ǰ����:" + policy.bias + "λ�ã�" + matchItem.index);
            if (policy.stop === true || policy.stoping === true) {
                console.logex("����" + name + "δ��ע��");
                return;
            }

            if (sessionStorage[cacheName] != "1") {
                console.logex("����" + name + "δ��ע��");
                return;
            }

           // doFourBet(matchItem.index, matchItem.nums, 1, (parseInt(newData.CP_QS) + 1) + "");
        }
    };

    window.policies.push(policy);
};

(function () {
    createFourPolicy(fourpaiwei, "fourpaiwei_start");
})();