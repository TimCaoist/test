(function () {
    var numbers = [];

    for (var a = 0; a < 8; a++) {
        var str = '';
        for (var b = a; b < a + 3; b++) {
            str += b;
        }

        numbers.push(str);
    }

    var find = function (histroyDatas, indexes) {
        for (var item in numbers) {
            var isFound = false;
            for (var i = histroyDatas.length - 1; i >= histroyDatas.length - 4; i--) {
                for (var subItem in numbers[item]) {
                    for (var index in indexes) {
                        var n = fetchHistroy(histroyDatas, i, indexes[index]);
                        if (numbers[item][subItem] == n) {
                            isFound = true;
                            break;
                        }
                    }

                    if (isFound) {
                        break;
                    }
                }

                if (isFound) {
                    break;
                }
            }

            if (isFound == false) {
                return numbers[item];
            }
        }

        return null;
    }

    var watch = {
        name: "fourwatch",
        txt: "",
        prevWrong: false,
        policies: [],
        matchGuy: null,
        newBetData: function (oldData, newData, histroyDatas) {
            var match = find(histroyDatas, [0, 1, 2, 3]);
            if (match == null) {
                match = find(histroyDatas, [1, 2, 3, 4]);
                if (match != null) {
                    console.logex("策略fourwatch符合条件！");
                    $("#tbFourType").val('1');
                    $("#tbFourNum").val(match);
                }
            }
            else {
                console.logex("策略fourwatch符合条件！");
                $("#tbFourType").val('0');
                $("#tbFourNum").val(match);
            }
        }
    };

    window.watchers.push(watch);
})();