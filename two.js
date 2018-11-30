(function(){
   window.ticket = 	window.ticket || {};
   var nums = window.ticket.builderNumbers(5);
   var report = function(){
	  var reportStr = "";
	  for (var a = 0; a < 4; a++) {
          for (var b = a + 1; b < 5; b++) {
	         var wrongInfos = window.ticket.getWrongValue([a, b], nums);
					var str = window.ticket.getCurrentMatchVal([a, b], nums);
					if (str !== "")
					{
						var title = window.ticket.getText(a) + window.ticket.getText(b);
                        switch (title) {
                            case '万千':
                                title = '<b>前二</b>';
                                break;
                            case '十个':
                                title = '<b>后二</b>';
                                break;
                        }

						title = window.ticket.getTitle(title, [a, b], wrongInfos);
                        reportStr += title + "<br/>";
                        reportStr += "--------------------------------<br/>";
                        reportStr += str;
                        reportStr += "--------------------------------<br/>";
					}
		  }
	  }
	   
	  return reportStr;
   }
   window.ticket.two = {
	   report: report,
	   	   builderNstr: function(numbers){
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
			
			return nstr;
	   }
   };
})();