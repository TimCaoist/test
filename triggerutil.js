window.tu = {
    two: {
        builderNstr: function(numbers) {
            var nstr = "";
            for (var i = 0; i < 100; i++) {
                var n = i + "";
                while (n.length < 2) {
                    n = "0" + n;
                }

                var matchCount = 0;
                for (var a = 0; a < numbers.length; a++) {
                    var d = numbers[a];
                    if (n.indexOf(d) > -1) {
                        matchCount++;
                    }
                }

                if (matchCount === 0) {
                    continue;
                }

                nstr += n + "$";
            }

            return nstr.substring(0, nstr.length - 1);
        }
    },
    four: {
        builderNstr: function(numbers) {
            var nstr = "";
            for (var i = 1; i < 10000; i++) {
                if (i % 1111 === 0) {
                    continue;
                }

                var n = i + "";
                while (n.length < 4) {
                    n = "0" + n;
                }

                var matchCount = 0;
                for (var a = 0; a < numbers.length; a++) {
                    var d = numbers[a];
                    if (n.indexOf(d) > -1) {
                        matchCount++;
                    }
                }

                if (matchCount === 0) {
                    continue;
                }

                if (matchCount <= 2) {
                    var tempArray = n.split("").sort(function(a, b) { return a - b });
                    if (tempArray[0] === tempArray[1] && tempArray[1] === tempArray[2]) {
                        continue;
                    }

                    if (tempArray[1] === tempArray[2] && tempArray[2] === tempArray[3]) {
                        continue;
                    }
                }

                nstr += n + "$";
            }

            return nstr.substring(0, nstr.length - 1);;
        }
    },
    three: {
        builderNstr: function(numbers) {
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
        }
    }
};

(function (util) {
    util.handlerDatas = function (datas) {
        var matchInfos = [];
        for (var i = 0; i < window.ti.instance.length; i++) {
            var instance = window.ti.instance[i];
            var matchDatas = instance.getMacthDatas(datas);
            for (var a = 0; a < matchDatas.length; a++) {
                matchInfos.push(matchDatas[a]);
            }
        }

        return matchInfos;
    }
})(window.tu);

