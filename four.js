(function(){
   window.ticket = 	window.ticket || {};
   var nums = window.ticket.builderNumbers(3);
   var report = function(){
	  var reportStr = "";
	  for (var a = 0; a < 2; a++) {
          for (var b = a + 1; b < 3; b++) {
	         for (var c = b + 1; c < 4; c++) {
		        for (var d = c + 1; d < 5; d++) {
		            var wrongInfos = window.ticket.getWrongValue([a, b, c, d], nums);
					var str = window.ticket.getCurrentMatchVal([a, b, c, d], nums);
					if (str !== "")
					{
						var title = window.ticket.getText(a) + window.ticket.getText(b) + window.ticket.getText(c)+ window.ticket.getText(d);
                        switch (title) {
                            case '万千百十':
                                title = '<b>前四</b>';
                                break;
                            case '千百十个':
                                title = '<b>后四</b>';
                                break;
                        }

						title = window.ticket.getTitle(title, [a, b, c, d], wrongInfos);
                        reportStr += title + "<br/>";
                        reportStr += "--------------------------------<br/>";
                        reportStr += str;
                        reportStr += "--------------------------------<br/>";
					}
	            }
	         }
		  }
	  }
	   
	  return reportStr;
   }
   window.ticket.four = {
	   report: report,
	   	   builderNstr: function(numbers){
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
				
				if (matchCount <= 2)
				{
					var tempArray = n.split("").sort(function(a, b) {return a - b});
					if (tempArray[0] === tempArray[1] && tempArray[1] === tempArray[2])
					{
						continue;
					}
					
					if (tempArray[1] === tempArray[2] && tempArray[2] === tempArray[3])
					{
						continue;
					}
				}

                nstr += n + "$";
            }
			
			return nstr;
	   }
   };
})();