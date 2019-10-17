var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getCategoryList";
	$http({
	    method : "GET",
	    url : productListUrl
	  }).then(function mySuccess(response) {
		  $.each(response.data, function (index, value) {
	    	      $('#listdataSec').append( '<option  value="'+value.id+'">'+value.name+'</option>' );
		  });
		 
	  }, function myError(response) {
	    //alert(response);
	  });
	
	var saleDateUrl = url+"getTotalSaleDate.json";
	$http({
	    method : "POST",
	    url : saleDateUrl
	  }).then(function mySuccess(response) {
		  var startDate="";
	      var enableDays =[];
	      $.each(response.data, function (index, value) {
	    	  //alert(data[index].date);
	    	  enableDays.push(value.date);
	    	  startDate=value.date;
	      });
	      getTimeStamp(enableDays);
	      $("#startDate").val(startDate);
	  	  $("#endDate").val(startDate);
	  }, function myError(response) {
	    //alert(response);
	  });
	

function getTimeStamp(enableDays){
	$("#startDate").datepicker({
		  dateFormat: 'yy-mm-dd',  beforeShowDay: enableAllTheseDays,
		  numberOfMonths: 1,
		  onSelect: function(selected) {
		  $("#endDate").datepicker("option","minDate", selected);
		  }
		  });
	    function enableAllTheseDays(date) {
	        var sdate = $.datepicker.formatDate( 'yy-mm-dd', date)
	        if($.inArray(sdate, enableDays) != -1) {
	            return [true];
	        }
	        return [false];
	    }
	    $('#endDate').datepicker({dateFormat: 'yy-mm-dd', beforeShowDay: enableAllTheseDays});
}
$scope.generateReport= function (){
	var category = $scope.dropValue;
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	if(category != undefined && category != null && category != ""){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var callingUrl = url+"getProductComparisionWithPerformance?startDate="+startDate+"&endDate="+endDate+"&category="+category;
	$http({
	    method : "GET",
	    url : callingUrl
	  }).then(function mySuccess(response) {
		 // console.log(JSON.stringify(response.data));
			  var brandNoarr = [];
			  $.each(response.data, function(index, value){
	    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
	    	   		brandNoarr.push(value.brandNo);
	    	   	}
			  });
    	      var inputjson = [];
    	      var chartDataSecond="",chartDataFirst = "";
	    	   for (var i = 0; i < brandNoarr.length; i++) {
	    		   var brandName = "";
	    		   var casesSold=0,caseRate=0,costPrice=0,govtMargin=0,companyDisc=0,totalDisc=0,idx=0,totalPrice=0;
	    		   $.each(response.data, function(index, value){
	    			   if(brandNoarr[i] == value.brandNo){
	    				   idx++;
	    				   brandName = value.brandName;
	    				   casesSold +=value.totalSale/value.packQty;
	    				   caseRate += value.caseRate;
	    				   costPrice += value.costPrice;
	    				   govtMargin += value.govtMaegin;
	    				   companyDisc += value.companyDiscount;
	    				   totalPrice += value.totalPrice;
	    	        }
  	             });
	    		   var  inputparent = {
      	   	        		"brandName":brandName,
      	   	        		"casesSold":(casesSold).toFixed(1),
      	   	        		"caseRate":Math.round(caseRate/idx),
      	   	        		"costPrice":Math.round(costPrice),
      	   	        		"govtMargin":Math.round(totalPrice - govtMargin),
      	   	        		"companyDisc":Math.round(companyDisc),
      	   	        		"totalDisc":Math.round((totalPrice - govtMargin) +companyDisc),
      	   	        		"soldCase":Math.round( casesSold * 10 ) / 10
	    		       };
	    		   inputjson.push(inputparent);
	    		   chartDataFirst+="{\"label\" :"+JSON.stringify(brandName)+",\"value\" :"+JSON.stringify(Math.round((totalPrice - govtMargin) +companyDisc))+"}";
		  	    	  if(!(i==brandNoarr.length-1)){
		  	    		chartDataFirst+=",";
		  	    	  }
		  	    	  
	    		   chartDataSecond+="{\"label\" :"+JSON.stringify(brandName)+",\"value\" :"+JSON.stringify(Math.round( casesSold * 10 ) / 10)+"}";
		  	    	  if(!(i==brandNoarr.length-1)){
		  	    		 chartDataSecond+=",";
		  	    	  }
	    	   }
	    	   //console.log(JSON.stringify(inputjson));
	    	   $scope.performanceWithComparion = inputjson;
	    	   $scope.generateGraphForTotalDiscount("["+chartDataFirst+"]");
	    	   $scope.generateGraphForCasesSold("["+chartDataSecond+"]");
	  }, function myError(response) {
  
           });
	}else{
		alert("Please select category.");
	}
}
$scope.greaterThan = function(prop, val){
    return function(item){
      return item[prop] > val;
    }
}
$scope.generateGraphForCasesSold = function(chartDataSecond){
	//console.log(JSON.stringify(chartDataSecond));
	var salesChart = new FusionCharts({
		"type": "pie2d",
        "renderAt": "chart-container-casesold",
        "width": "100%",
        "height": "100%",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "caption": "Total Cases Sold",
                "subCaption": "",
                "paletteColors": "#1a0000,#0075c2,#8e0000,#0000ff,#1aaf5d,#f2c500,#f45b00,#ff0040,#00ffff,#a65959,#660066,#ff0066,#ff3300,#ffcc00,#cc9900,#99cc00,#ff66ff,#9999ff,#33ccff,#ffffcc,#669999,#ff9933,#99cc00,#ff3399",
                "bgColor": "#ffffff",
                "showBorder": "1",
                "use3DLighting": "0",
                "showShadow": "0",
                "enableSmartLabels": "1",
                "startingAngle": "0",
                "showPercentValues": "0",
                "showPercentInTooltip": "0",
                "decimals": "1",
                "captionFontSize": "14",
                "subcaptionFontSize": "14",
                "subcaptionFontBold": "0",
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "showHoverEffect":"1",
                "showLegend": "1",
                "legendBgColor": "#ffffff",
                "legendBorderAlpha": '0',
                "legendShadow": '0',
                "legendItemFontSize": '10',
                "legendItemFontColor": '#666666',
                "numberPrefix": "CASE ",
                "formatNumberScale": "0",
                "thousandSeparatorPosition": "2,3"
            },
            "data": JSON.parse(chartDataSecond)
        }
    });
	salesChart.render();
	
 }
$scope.generateGraphForTotalDiscount = function(chartDataFirst){
	//console.log(JSON.stringify(chartDataSecond));
	var salesChart = new FusionCharts({
		"type": "pie2d",
        "renderAt": "chart-container-totaldiscount",
        "width": "100%",
        "height": "100%",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "caption": "Total Margin",
                "subCaption": "",
                "paletteColors": "#1a0000,#0075c2,#8e0000,#0000ff,#1aaf5d,#f2c500,#f45b00,#ff0040,#00ffff,#a65959,#660066,#ff0066,#ff3300,#ffcc00,#cc9900,#99cc00,#ff66ff,#9999ff,#33ccff,#ffffcc,#669999,#ff9933,#99cc00,#ff3399",
                "bgColor": "#ffffff",
                "showBorder": "1",
                "use3DLighting": "0",
                "showShadow": "0",
                "enableSmartLabels": "1",
                "startingAngle": "0",
                "showPercentValues": "0",
                "showPercentInTooltip": "0",
                "decimals": "1",
                "captionFontSize": "14",
                "subcaptionFontSize": "14",
                "subcaptionFontBold": "0",
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "showHoverEffect":"1",
                "showLegend": "1",
                "legendBgColor": "#ffffff",
                "legendBorderAlpha": '0',
                "legendShadow": '0',
                "legendItemFontSize": '10',
                "legendItemFontColor": '#666666',
                "numberPrefix": "INR ",
                "formatNumberScale": "0",
                "thousandSeparatorPosition": "2,3"
            },
            "data": JSON.parse(chartDataFirst)
        }
    });
	salesChart.render();
	
 }
});
app.filter('INR', function () {        
    return function (input) {
        if (! isNaN(input)) {
           // var currencySymbol = '₹';
        	 var currencySymbol = '';
            //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
            var result = input.toString().split('.');

            var lastThree = result[0].substring(result[0].length - 3);
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            
            if (result.length > 1) {
                output += "." + result[1];
            }            

            return currencySymbol + output;
        }
    }
});
