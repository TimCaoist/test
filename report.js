(function(){
   $("body").html("<div id='report'></div>");
   
		var datas = [];
   var handlerResult = function (data) {
        var openDatas = data.data.detail.LIST;
        for (var i = 0; i < openDatas.length; i++) {
            datas.push(openDatas[i].ZJHM.split(","));
        }
	var addArray = function(arry, d){
		var isFound = false;
		for(var f = 0; f < arry.length; f ++)
		{
			if(arry[f].d === d)
			{
				arry[f].c = arry[f].c + 1;
				isFound = true;
				break;
			}
		}
		
		if (isFound === false)
		{
			arry.push({
				d: d,
				c: 1
			})
		}
	}
	
	var sort = function(a, b){
		return b.c - a.c;
	}

	var u1 = 0;
       var u2 = 1;
	var str = "";
	for (var i = datas.length - 11; i >= 0; i --)
	{
		var oldDatas = [];
		for(var j = 1; j < 11; j ++)
		{
		    addArray(oldDatas, datas[i + j][u1]);
		    addArray(oldDatas, datas[i + j][u2]);
		}
		
		oldDatas.sort(sort);
		var cur1 = datas[i][u1];
		var cur2 = datas[i][u2];
		var isFound = false;
		var foundIndex = -1;
		for(var f = 0; f < oldDatas.length; f ++)
		{
		    if (oldDatas[f].d === cur1)
			{
				foundIndex = f;
				break;
			}
		}
		
		if (foundIndex > 2 && foundIndex < 8)
		{
			str +=  "true";
		}
		else{
			str +=  "false";
		}
		
		foundIndex = -1;
		for(var f = 0; f < oldDatas.length; f ++)
		{
		    if (oldDatas[f].d === cur2)
			{
				foundIndex = f;
				break;
			}
		}
		
		if (foundIndex > 2 && foundIndex < 8)
		{
			str += "true";
		}
		else{
			str +=  "false";
		}

		str += "<br/>";
	 }

       $("#report").html(str);
   }
	
    $.post("/controller/lottery/chart", {
        command: "lottery_request_transmit_v2",
        content: "{\"command_id\":23,\"lottery_id\":\"91\",\"issue_status\":\"1\",\"count\":\"300\"}"
    },
    function (data) {
        handlerResult(data);
    });
})();