(function(){
   window.ticket = 	window.ticket || {};
   var nums = window.ticket.builderNumbers(4);
   var report = function(){
	  var reportStr = "";
	  for (var a = 0; a < 2; a++) {
          for (var b = a + 1; b < 3; b++) {
	         for (var c = b + 1; c < 4; c++) {
		        var wrongInfos = window.ticket.getWrongValue([a, b, c], nums);
				var str = window.ticket.getCurrentMatchVal([a, b, c], nums);
					if (str !== "")
					{
						var title = window.ticket.getText(a) + window.ticket.getText(b) + window.ticket.getText(c);
                        switch (title) {
                            case '万千百':
                                title = '<b>前三</b>';
                                break;
                            case '千百十':
                                title = '<b>中三</b>';
                                break;
                            case '百十个':
                                title = '<b>后三</b>';
                                break;
                        }

						title = window.ticket.getTitle(title, [a, b, c], wrongInfos);
                        reportStr += title + "<br/>";
                        reportStr += "--------------------------------<br/>";
                        reportStr += str;
                        reportStr += "--------------------------------<br/>";
					}
	         }
		  }
	  }
	   
	  return reportStr;
   }
   window.ticket.three = {
	   report: report,
	   builderNstr: function(numbers){
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
			
			return nstr;
	   }
   };
})();