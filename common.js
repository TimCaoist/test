(function(){
   window.ticket = 	window.ticket || {};
   window.ticket.datas = [];
   window.ticket.isContainer = function (nums, index, arry) {
        var curDatas = window.ticket.datas[index];
        for(var i = 0; i < arry.length; i ++)
		{
			var curData = curDatas[arry[i]];
			if (nums.indexOf(curData) > -1) {
                return true;
            }
		}

        return false;
   };
   
   var sortNumber = function (a, b) {
        return b.mc - a.mc;
    };
	
   window.ticket.getTitle = function (txt, arraryIndexs, wrongInfos) {
	   var title = txt;
	   var position = window.ticket.getPositionStr(arraryIndexs);
       for (var wi = 0; wi < wrongInfos.length; wi++) {
                            if (wrongInfos[wi].p === position) {
                                switch (wrongInfos[wi].t) {
                                    case 1:
                                        title += "(N:" + wrongInfos[wi].i + ")";
                                        break;
                                    case 0:
                                        title += "(<span style='color:red'>N</span>:" + wrongInfos[wi].i + ")";
                                        break;
                                    case 3:
                                        title += "(R:" + wrongInfos[wi].i + ")";
                                        break;
                                    case 2:
                                        title += "(<span style='color:red'>R</span>:" + wrongInfos[wi].i + ")";
                                        break;
                                    case 5:
                                        title += "(L:" + wrongInfos[wi].i + ")";
                                        break;
                                    case 4:
                                        title += "(<span style='color:red'>L</span>:" + wrongInfos[wi].i + ")";
                                        break;
                                }
                            }
                        }
						
	    return title;
   };
   
   var getText = function (index) {
       switch (index) {
            case 0:
                return "万";
            case 1:
                return "千";
            case 2:
                return "百";
            case 3:
                return "十";
            case 4:
                return "个";
       }
   }
	
   window.ticket.getText = getText;
   window.ticket.builderNumbers = function(loopCount){
	var nums = [];
    for (var i = 0; i < 10; i++) {
        var subNums = [];
        for (var a = 0; a < loopCount; a++) {
            var n = i + a;
            if (n > 9) {
               n -= 10;
            }

            subNums.push(n + "");
        }

        nums.push(subNums);
     }
     
	 return nums;
   }
   
    window.ticket.isNormalNum = function(curNums){
		var nineIndex = curNums.indexOf('9');
		if (nineIndex > -1 && nineIndex !== (curNums.length - 1))
		{
			 return false;
		}
		
		return true;
	}
	
   window.ticket.checkWrongType1 = function(wrongInfos, nums, arryIndex){
	  var len = window.ticket.datas.length;
	  var wrongIndex = -1;
	  for (var i = 0; i < nums.length; i++) {
          var curNums = nums[i];
          var subStr = "";
          for (var f = 0; f < len; f++) {
              subStr += window.ticket.isContainer(curNums, f, arryIndex) + '';
              if (f > 3 && subStr.indexOf('falsefalsetruefalsefalse') > -1) {
                  wrongIndex = f;
                  break;
              }
          }

          if (wrongIndex > 0) {
                wrongInfos.push({
                    p: window.ticket.getPositionStr(arryIndex),
                    t: !window.ticket.isNormalNum(curNums) ? 1 : 0,
                    i: wrongIndex
                });

                break;
         }
      }
   }
   
   window.ticket.getSingleArrayIndex = function(nums, macthArrayIndex, arryIndex){
	   var macthIndex = -1;
	   if (macthArrayIndex.indexOf(nums.length - 1) > -1 && macthArrayIndex.indexOf(0) > -1)
	   {
		   var tempIndex = 0;
		   while(macthArrayIndex.indexOf(tempIndex) > -1)
		   {
			   macthIndex = tempIndex;
			   tempIndex = tempIndex + 1;
		   }
	   }
	   else{
		    macthIndex = macthArrayIndex[macthArrayIndex.length - 1];
	   }
	   
	   macthIndex += nums[0].length
	   if (macthIndex > 9)
	   {
		   macthIndex -= 10;
	   }
	   
	   return macthIndex;
   }
   
    window.ticket.getSingleArrayIndex2 = function(nums, macthArrayIndex, arryIndex){
	   var macthIndex = -1;
	   if (macthArrayIndex.indexOf(nums.length - 1) > -1 && macthArrayIndex.indexOf(0) > -1)
	   {
		   var tempIndex = 9;
		   while(macthArrayIndex.indexOf(tempIndex) > -1)
		   {
			   macthIndex = tempIndex;
			   tempIndex = tempIndex - 1;
		   }
	   }
	   else{
		    macthIndex = macthArrayIndex[0];
	   }
	   
	   macthIndex -= nums[0].length
	   if (macthIndex < 0)
	   {
		   macthIndex += 10;
	   }
	   
	   return macthIndex;
   }
   
   window.ticket.subCheck = function(nums, macthArrayIndex, arryIndex, index){
	   var macthIndex = window.ticket.getSingleArrayIndex(nums, macthArrayIndex, arryIndex);
	   var curNums = nums[macthIndex];
	   var r = window.ticket.isContainer(curNums, index, arryIndex);
	   var r1 = window.ticket.isContainer(curNums, index - 1, arryIndex);
	   if (r === false && r1 === false)
	   {
		   return window.ticket.isNormalNum(curNums)? {
		   t: 2,
		   ns: curNums
	   } : {
		   t: 3,
		   ns: curNums
	   };
	   }
	   
	   return {
		   t: -1,
		   ns: -1
	   };
   }
   
   window.ticket.getWrongValue = function(arryIndexs, nums){
	   var wrongInfos = [];
	   var len = window.ticket.datas.length;
       var wrongIndex = -1;
       window.ticket.checkWrongType1(wrongInfos, nums, arryIndexs);
	   window.ticket.checkWrongType2(wrongInfos, nums, arryIndexs, window.ticket.subCheck);
	   window.ticket.checkWrongType2(wrongInfos, nums, arryIndexs, window.ticket.subCheck2);
	   return wrongInfos;
   };
   
    window.ticket.subCheck2 = function(nums, macthArrayIndex, arryIndex, index){
	   var macthIndex = window.ticket.getSingleArrayIndex2(nums, macthArrayIndex, arryIndex);
	   var curNums = nums[macthIndex];
	   var r = window.ticket.isContainer(curNums, index, arryIndex);
	   var r1 = window.ticket.isContainer(curNums, index - 1, arryIndex);
	  if (r === false && r1 === false)
	   {
		   return window.ticket.isNormalNum(curNums)? {
		   t: 4,
		   ns: curNums
	   } : {
		   t: 5,
		   ns: curNums
	   };
	   }
	   
	   return {
		   t: -1,
		   ns: -1
	   };
   }
   
   window.ticket.getCurrentMatchVal = function(arraryIndexs, nums){
	   var matchMissArray = [];
	   var str = window.ticket.getMacth1(matchMissArray, nums, arraryIndexs);
	   if (matchMissArray.length > 0)
	   {
		   var macthIndex1 = window.ticket.getSingleArrayIndex(nums, matchMissArray, arraryIndexs);
		   var macthIndex2 = window.ticket.getSingleArrayIndex2(nums, matchMissArray, arraryIndexs);
		   str += window.ticket.builderNearButton(nums[macthIndex1], "Near_R", arraryIndexs);
           str += window.ticket.builderNearButton(nums[macthIndex2], "Near_L", arraryIndexs);
	   }
	   
	   var missnums = [];
       for (var i = 0; i < 10; i++) {
           var missCount = 0;
           for (var f = 0; f < 8; f++) {
                var isInclude = window.ticket.isContainer([i + ''], f, arraryIndexs);
                if (isInclude === false) {
                    missCount++;
                }
                else {
                    break;
                }
           }

           if (missCount > 5) {
               missnums.push({
                    n: i,
                    mc: missCount
               });
           }
        }

        if (missnums.length > (nums[0].length - 1)) {
            var missStr = "";
            var isFull = true;
            missnums.sort(sortNumber);
            for (var dd = 0; dd < nums[0].length; dd++) {
                var m = missnums[dd];
                missStr += m.n;
                if (m.mc < 7) {
                    isFull = false;
                }

                if (dd !== (nums[0].length - 1)) {
                    missStr += ",";
                }
            }

            var minMissCount = missnums[nums[0].length - 1].mc;
            str += "<b " + (isFull ? "style='color:red'" : "") + ">Miss(" + minMissCount + "):</b>" + missStr + "<button bind-nstr='" + missStr + "' bind-index='" + window.ticket.getPositionStr(arraryIndexs) + "'>Go</button><br/>";
       }
	   
	   return str;
   };
   
   window.ticket.checkWrongType2 = function(wrongInfos, nums, arryIndex, subCheck){
	  var len = window.ticket.datas.length;
	  for (var f = 4; f < len; f++) {
	     var macthArrays = [];
	     for (var i = 0; i < nums.length; i++) {
            var curNums = nums[i];
		    var r = window.ticket.isContainer(curNums, f, arryIndex);
		    var r1 = window.ticket.isContainer(curNums, f - 1, arryIndex);
		    var r2 = window.ticket.isContainer(curNums, f - 2, arryIndex);
		    if (r === true && r1 === false && r2 === false)
		    {
			   macthArrays.push(i);
		    }
        }
		
		if (macthArrays.length > 0)
		{
			var t = subCheck(nums, macthArrays, arryIndex, f - 3);
			if (t.t > -1)
			{
			  wrongInfos.push({
                    p: window.ticket.getPositionStr(arryIndex),
                    t: t.t,
                    i: f
              });
			  
			  break;
		   }
		}
	  }
   }
   
   window.ticket.builderNearButton = function (nearArray, name, arraryIndexs) {
        var str = "";
        if (nearArray.length > 0) {
            var nearNumberStr = "";
            for (var v = 0; v < nearArray.length; v++) {
                nearNumberStr += nearArray[v];
                if (v !== nearArray.length - 1) {
                    nearNumberStr += ",";
                }
            }

            str += name + ":" + nearNumberStr + "<button bind-nstr='" + nearNumberStr + "' bind-index='" + window.ticket.getPositionStr(arraryIndexs) + "'>Go</button><br/>";
        }

        return str;
    };
	
   window.ticket.getMacth1 = function(matchMissArray, nums, arraryIndexs){
	  var str = "";
	  for (var i = 0; i < nums.length; i++) {
		    var curNums = nums[i];
            var subStr = "";
            for (var f = 0; f < 6; f++) {
                subStr += window.ticket.isContainer(curNums, f, arraryIndexs) + '';
            }

            var matchIndex = subStr.indexOf('truefalsefalse');
            if (matchIndex < 0) {
                if (subStr.indexOf('falsefalsetrue') === 0) {
                    matchMissArray.push(i);
                }

                continue;
            }

            var trueIndex = -1;
            var trueTimes = 0;
            do {
                trueIndex = subStr.indexOf('true', trueIndex + 1);
                if (trueIndex < matchIndex && trueIndex > -1) {
                    trueTimes++;
                }
            }
            while (trueIndex < matchIndex && trueTimes < 3)

            if (trueTimes > 1) {
                continue;
            }

            subStr = subStr.replace(new RegExp('false', 'gm'), '<span style="color:red">F</span>');
            subStr = subStr.replace(new RegExp('true', 'gm'), '<span style="color:green">T</span>');
            str += subStr;
            var nstr = "";
            $.each(curNums, function (dd, n) {
                nstr += n
                if (dd !== curNums.length - 1) {
                    nstr += ",";
                }
            });

            str += nstr;
            str += "<button bind-nstr='" + nstr + "' bind-index='" + window.ticket.getPositionStr(arraryIndexs) + "'>Go</button><br/>";
	   }
	   
	   return str;
   }
   
   window.ticket.getPositionStr = function(arraryIndexs)
   {
	  var position = "";
	  $.each(arraryIndexs, function(ai, val){
			position += val;
			if (ai !== arraryIndexs.length - 1)
			{
				position += ",";
			}
	  });
			  
	  return position
   }
   
   window.httpRequest = (function () {
    function getUrl(url) {
        return (url || window.location.pathname + window.location.search).toLowerCase();
    }

    var request = {
        //取获参数值
        getQueryValue: function (queryName, url) {

            var match = getUrl(url).match(new RegExp("(^|[&\?])" + queryName.toLowerCase() + "=([^&]*)(&|$)"));

            return match != null ? decodeURIComponent(match[2]) : null;
        }
    };

    return request;
    })();
})();