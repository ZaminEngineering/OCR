var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getTotalSaleDate.json";
	$http({
	    method : "POST",
	    url : productListUrl
	  }).then(function mySuccess(response) {
	      var enableDays =[];
	      $.each(response.data, function (index, value) {
	    	  //alert(data[index].date);
	    	  enableDays.push(response.data[index].date);
	    	  startDate=response.data[index].date;
	      });
	      getTimeStamp(enableDays);
	      buildstockLifting(startDate,startDate);
	      $("#startDate").val(startDate);
	  	  $("#endDate").val(startDate);
	  	  $("#popupstartDate").val(response.data[response.data.length-7].date);
	  	  $("#popupendDate").val(startDate);
			$scope.popupDate1 = response.data[response.data.length-7].date;
			$scope.popupDate2 = startDate;
	  }, function myError(response) {
	    //alert(response);
	  });
	function getTimeStamp(enableDays){
		$("#startDate,#popupstartDate").datepicker({
			  dateFormat: 'yy-mm-dd',  beforeShowDay: enableAllTheseDays,
			  numberOfMonths: 1,
			  onSelect: function(selected) {
			  $("#endDate,#popupendDate").datepicker("option","minDate", selected);
			  }
			  });
		    function enableAllTheseDays(date) {
		        var sdate = $.datepicker.formatDate( 'yy-mm-dd', date)
		        if($.inArray(sdate, enableDays) != -1) {
		            return [true];
		        }
		        return [false];
		    }
		    $('#endDate,#popupendDate').datepicker({dateFormat: 'yy-mm-dd', beforeShowDay: enableAllTheseDays});
	}
	function  buildstockLifting(startDate,endDate){
		var compareNo = startDate.localeCompare(endDate);
		$(".totalSaleItmes").hide();
		var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		var callingUrl = url+"getSaleReports.json?startDate="+startDate+"&endDate="+endDate;
	
		$http({
		    method : "GET",
		    url : callingUrl
		  }).then(function mySuccess(response) {
			//  console.log(JSON.stringify(response.data));
			  var totalSaleAmount=0,totalBeer=0,totalCases=0,totalLiquor=0;
		 	     $scope.products = response.data.saleBean;
		 	     $scope.companies = response.data.saleBean;
		 	  var brandNoarr = [];
	    	   $.each(response.data.saleBean, function(index, value){
	    	      if(value.category === "BEER" || value.category === "BEER -FL")
	    	    	  totalBeer=totalBeer+value.totalPrice;
	    	      else
	    	    	  totalLiquor=totalLiquor+value.totalPrice;
	    	    	  
	    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
	    	   		brandNoarr.push(value.brandNo);
	    	   	}
	    	   });
	    	   var inputjson = [];
	    	   for (var i = 0; i < brandNoarr.length; i++) {
	    		   var Brands= [];
	    		   var company="",category="",brandname="",bgcolor="",categoryColor="";
	    		   var totalval=0,totalbtlsale=0,cases=0,preCases=0,currCases=0,sumOfRealCases=0,caseClosing=0,companyOrder=0,categoryOrder=0,firstFontColor=5,compareCurrentSale=0,comparePreviousDaySale=0;
                       $.each(response.data.saleBean, function(index, value){
	    			   if(brandNoarr[i] == value.brandNo){
	    				   var caseVal = Math.trunc(value.totalSale/value.packQty);
	    				   var previouscaseVal = Math.trunc(value.noOfReturnsBtl/value.packQty);
	    				   var input = {
	    			        		"brandName":value.brandName,
	    			        		"brandNo":value.brandNo,
	    			        		"quantity":value.quantity,
	    			        		"packQty":value.packQty,
	    			        		"packType":value.packType,
	    			        		"unitPrice":value.unitPrice,
	    			        		"totalPrice":value.totalPrice,
	    			        		"category":value.category,
	    			        		"company":value.company,
	    			        		"totalSale":value.totalSale,
	    			        		"saleInCase":caseVal,
	    			        		"btlVal":value.totalSale-(caseVal*value.packQty),
	    			        		"color":value.color,
	    			        		"companyOrder":value.companyOrder,
	    			        		"closing":value.cummulativePrice,
	    			        		"closingCase":Math.trunc(value.bottleSaleMrp),
	    			        		"BtlStock":value.qtyBottels,
	    			        		"brandNoPackQty":value.brandNoPackQty,
	    			        		"noOfDays":value.saleId,
	    			        		"compareNo":compareNo,
	    			        		"prevoiusDayTotalSale":value.noOfReturnsBtl,
	    			        		"categoryOrder":value.categoryOrder,
	    			        		"categoryColor":value.invoiceDateAsCopy,
	    			        		"categoryId":value.productId,
	    			        		"compairSale":((value.totalSale - value.noOfReturnsBtl) / value.totalSale) * 100,
	    			        		"previousSaleInCase":previouscaseVal,
	    			        		"previousBtlVal":value.noOfReturnsBtl-(previouscaseVal*value.packQty)
	    			        };
	    				   Brands.push(input);
	    				   company=value.company;
	    				   category=value.category;
	    				   brandname=value.brandName;
	    				   totalval=totalval+value.totalPrice;
	    				   totalbtlsale=totalbtlsale+value.totalSale;
	    				   cases+=value.totalSale/value.packQty;
	    				   preCases+=value.noOfReturnsBtl/value.packQty;
	    				   currCases+=value.totalSale/value.packQty;
	    				   caseClosing=caseClosing+value.bottleSaleMrp;
	    				   sumOfRealCases += value.currentMonthSold;
	    				   compareCurrentSale += value.totalSale,
	    				   comparePreviousDaySale += value.noOfReturnsBtl;
	    				   bgcolor=value.color;
	    				   companyOrder=value.companyOrder;
	    				   categoryOrder = value.categoryOrder;
	    				   categoryColor = value.invoiceDateAsCopy;
	    				   if(((value.saleId) <= 1)) /// for days calc
	    					   firstFontColor = 0;
    				   }
	    			   
		    	    });
                       var  inputparent = {
       	   	        		"brandNo":brandNoarr[i],
       	   	        		"category":category,
       	   	        		"company":company,
       	   	        		"companyOrder":companyOrder,
       	   	        		"categoryOrder":categoryOrder,
       	   	        		"categoryColor":categoryColor,
       	   	        		"brandname":brandname,
       	   	        		"totalval":totalval,
       	   	        		"totalbtlsale":totalbtlsale,
       	   	        		"cases":Math.round(cases),
       	   	        		"bgcolor":bgcolor,
       	   	        		"caseClosing":Math.round(caseClosing),
       	   	        		"firstFontColor":firstFontColor,
       	   	        		"sumOfRealCases":sumOfRealCases,
       	   	        		"compareCurrentSale":compareCurrentSale,
       	   	        		"comparePreviousDaySale":comparePreviousDaySale,
       	   	        	    "compareNoSuper":compareNo,
       	   	        	    "compairSaleSuper":((compareCurrentSale - comparePreviousDaySale) / compareCurrentSale) * 100,
       	   	        	    "preCases":preCases.toFixed(1),
       	   	        	    "currCases":currCases.toFixed(1),
       	   	        		"Brands":Brands
	    		       };
                       inputjson.push(inputparent);
	    		   
	    	   }
	    	   $scope.alldetails = inputjson;
	    	   $scope.categories = inputjson;
	    	   var inputwithoutZerojson = [];
	    	   for (var i = 0; i < brandNoarr.length; i++) {
	    		   var Brands= [];
	    		   var company="",category="",brandname="",bgcolor="",categoryColor="";
	    		   var totalval=0,totalbtlsale=0,cases=0,preCases=0,currCases=0,sumOfRealCases=0,caseClosing=0,companyOrder=0,categoryOrder=0,firstFontColor=5,compareCurrentSale=0,comparePreviousDaySale=0;
                       $.each(response.data.saleBean, function(index, value){
	    			   if((brandNoarr[i] == value.brandNo) && (value.totalSale > 0)){
	    				   var caseVal = Math.trunc(value.totalSale/value.packQty);
	    				   var previouscaseVal = Math.trunc(value.noOfReturnsBtl/value.packQty);
	    				   var input = {
	    			        		"brandName":value.brandName,
	    			        		"brandNo":value.brandNo,
	    			        		"quantity":value.quantity,
	    			        		"packQty":value.packQty,
	    			        		"packType":value.packType,
	    			        		"unitPrice":value.unitPrice,
	    			        		"totalPrice":value.totalPrice,
	    			        		"category":value.category,
	    			        		"company":value.company,
	    			        		"totalSale":value.totalSale,
	    			        		"saleInCase":caseVal,
	    			        		"btlVal":value.totalSale-(caseVal*value.packQty),
	    			        		"color":value.color,
	    			        		"companyOrder":value.companyOrder,
	    			        		"closing":value.cummulativePrice,
	    			        		"closingCase":Math.trunc(value.bottleSaleMrp),
	    			        		"BtlStock":value.qtyBottels,
	    			        		"brandNoPackQty":value.brandNoPackQty,
	    			        		"noOfDays":value.saleId,
	    			        		"compareNo":compareNo,
	    			        		"prevoiusDayTotalSale":value.noOfReturnsBtl,
	    			        		"categoryOrder":value.categoryOrder,
	    			        		"categoryColor":value.invoiceDateAsCopy,
	    			        		"categoryId":value.productId,
	    			        		"compairSale":((value.totalSale - value.noOfReturnsBtl) / value.totalSale) * 100,
	    			        		"previousSaleInCase":previouscaseVal,
	    			        		"previousBtlVal":value.noOfReturnsBtl-(previouscaseVal*value.packQty)
	    			        };
	    				   Brands.push(input);
	    				   company=value.company;
	    				   category=value.category;
	    				   brandname=value.brandName;
	    				   totalval=totalval+value.totalPrice;
	    				   totalbtlsale=totalbtlsale+value.totalSale;
	    				   cases+=value.totalSale/value.packQty;
	    				   preCases+=value.noOfReturnsBtl/value.packQty;
	    				   currCases+=value.totalSale/value.packQty;
	    				   caseClosing=caseClosing+value.bottleSaleMrp;
	    				   bgcolor=value.color;
	    				   sumOfRealCases += value.currentMonthSold;
	    				   compareCurrentSale += value.totalSale,
	    				   comparePreviousDaySale += value.noOfReturnsBtl;
	    				   companyOrder=value.companyOrder;
	    				   categoryOrder = value.categoryOrder;
	    				   categoryColor = value.invoiceDateAsCopy;
	    				   if(((value.saleId) <= 1)) /// for days calc
	    					   firstFontColor = 0;
    				   }
	    			   
		    	    });
                       var  inputparent = {
       	   	        		"brandNo":brandNoarr[i],
       	   	        		"category":category,
       	   	        		"company":company,
       	   	        		"companyOrder":companyOrder,
       	   	        		"categoryOrder":categoryOrder,
       	   	        		"categoryColor":categoryColor,
       	   	        		"brandname":brandname,
       	   	        		"totalval":totalval,
       	   	        		"totalbtlsale":totalbtlsale,
       	   	        		"cases":Math.round(cases),
       	   	        		"bgcolor":bgcolor,
       	   	        		"caseClosing":Math.round(caseClosing),
       	   	        	   "firstFontColor":firstFontColor,
       	   	        	   "sumOfRealCases":sumOfRealCases,
       	   	        	   "compareCurrentSale":compareCurrentSale,
   	   	        		   "comparePreviousDaySale":comparePreviousDaySale,
   	   	        		   "compareNoSuper":compareNo,
   	   	        		   "compairSaleSuper":((compareCurrentSale - comparePreviousDaySale) / compareCurrentSale) * 100,
   	   	        	       "preCases":preCases.toFixed(1),
   	   	        	        "currCases":currCases.toFixed(1),
       	   	        		"Brands":Brands
	    		       };
                       inputwithoutZerojson.push(inputparent);
	    		   
	    	   }
	    	   $scope.allgreterthanzerodetails = inputwithoutZerojson;
	    	   $scope.greterthanzerocategories = inputwithoutZerojson;
	    	  // console.log(JSON.stringify(inputjson));
	    	   $scope.expenseAmount = (response.data.amount).toLocaleString('en-IN',{ maximumFractionDigits: 2});
	    	   buildSoldPieChart(startDate,endDate);
		  }, function myError(response) {
			  		    //alert(response);
			  
		  });
	}
	$scope.getResults = function (startDate,endDate){
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		 if(validateCalendarField()==false){return false;}
		 buildstockLifting(startDate,endDate);
	}
	function validateCalendarField(){
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		if(startDate == ""){
			alert("Please fill Start Date.");
			return false;
		}
		if(endDate == ""){
			alert("Please fill End Date.");
			return false;
		}
		return true;
	}
	
	$scope.includeZeroSaleOrNot = function(){
		var catOrComp = $('#includeZeroSaleOrNot').prop('checked');
       if(catOrComp === true){
    	   $(".onlySaleItmes").hide();
    	   $(".totalSaleItmes").show();
       }else{
    	  
    	   $(".totalSaleItmes").hide();
    	   $(".onlySaleItmes").show();
       }
    	   
	}
	
	$scope.greaterThan = function(prop, val){
	    return function(item){
	      return item[prop] > val;
	    }
	}
	 
	 $scope.sortKey = ['companyOrder','brandname'];
	  $scope.sort = function(propName1,propName2){
	        $scope.sortKey = [propName1,propName2];
	        $scope.reverse = !$scope.reverse;
	    }
	  
	  
	  $scope.openModalPopup = function(brandNoPackQty,name,qty,categoryId){
		  $scope.brandNoPackQty = brandNoPackQty;
		  $scope.popupBrandName = name;
		  $scope.popupQuantity = qty;
		  if(($("#startDate").val().localeCompare($("#endDate").val())) == 0){
			  var today = new Date($("#endDate").val());
			  today.setDate(today.getDate() - 6);
			   var newDate = (today.getFullYear()) + "-" + (("0" + (today.getMonth() + 1)).slice(-2)) + "-" + (("0" + today.getDate()).slice(-2))
			  $("#popupstartDate").val(newDate);
		  	  $("#popupendDate").val($("#endDate").val());
		  }
		  else{
			  $("#popupstartDate").val($("#startDate").val());
		  	  $("#popupendDate").val($("#endDate").val());
		  }
		  var myUrl = window.location.href;
			var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
			var productListUrl = url+"getProductListWithShortName?brandNoPackQty="+brandNoPackQty+"&categoryId="+categoryId;
			$http({
			    method : "GET",
			    url : productListUrl
			  }).then(function mySuccess(response) {
				  var options="<option value=\""+brandNoPackQty+"\" selected>"+name+"_"+qty+"</option>";
		 	      $.each(response.data, function (index, value) {
		            options=options+"<option value=\""+value.brandNoPackQty+"\">"+value.shortBrandName+"_"+value.quantity+"</option>";
		 	     });
		 	      $("#listdata").html(options);
		 	     $(".selectpicker").selectpicker('refresh');
			  }, function myError(response) {
		  
	               });
		  
     		$scope.buildLineGraph(brandNoPackQty);
		 
	  }
	  $scope.buildLineGraph = function(brandNoPackQty){
		var sdate = $("#popupstartDate").val();
		var edate = $("#popupendDate").val();
	    var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		var lineChartUrl = url+"getSaleByBrandNoPackQty?brandNoPackQty="+brandNoPackQty+"&sdate="+sdate+"&edate="+edate;
		$http({
		    method : "GET",
		    url : lineChartUrl
		  }).then(function mySuccess(response) {
			  //console.log(JSON.stringify(response.data));
			  var salesChart = new FusionCharts({
			        type: 'line',
			        renderAt: 'chart-container',
			        width: '100%',
			        height: '100%',
			        dataFormat: 'json',
			        dataSource: {
			            "chart": {
			                "caption": $scope.popupBrandName+", "+$scope.popupQuantity,
			                "subCaption": "",
			                "xAxisName": "Date",
			                "yAxisName": "Sale In Bottles",
			                "numberPrefix": "",
			                "formatNumberScale": "0",
			                "thousandSeparatorPosition": "2,3",
			                "showValues": "1",
			                "showAlternateHGridColor": "0",
			                "captionFontSize": "12",
			                "subcaptionFontSize": "12",
			                "subcaptionFontBold": "0",
			                "toolTipColor": "#ffffff",
			                "toolTipBorderThickness": "0",
			                "toolTipBgColor": "#000000",
			                "toolTipBgAlpha": "80",
			                "toolTipBorderRadius": "2",
			                "toolTipPadding": "5",
			                "rotatevalues": "1",
			                "lineThickness": "1",
			                "theme": "fint",
			                "outCnvBaseFont": "'Montserrat', sans-serif !important",
			                "outCnvBaseFontColor": "#00000",
			                "outCnvBaseFontSize":"11"
			            },
			            "data": JSON.parse(JSON.stringify(response.data))
			        }
			    });
				salesChart.render();
		  }, function myError(response) {
	  		    //alert(response);
	  
               });
		} 
	  $scope.buildMultiLineGraph = function(){
			var sdate = $("#popupstartDate").val();
			var edate = $("#popupendDate").val();
			var targets = [];
			$.each($("#listdata option:selected"), function(){
			targets.push($(this).val());
			});
			if(targets.length > 0){
				var myUrl = window.location.href;
				var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
				var callingUrl = url+"getMultiChartBeanSaleData.json?sdate="+sdate+"&edate="+edate+"&targets="+targets;
				$http({
	 	    	    method : "GET",
	 	    	    url : callingUrl
	 	    	  }).then(function mySuccess(response) {
	 	    	   // console.log(JSON.stringify(response.data));
	 	    	   var salesChart = new FusionCharts({
				        type: 'msline',
				        renderAt: 'chart-container',
				        width: '100%',
				        height: '100%',
				        dataFormat: 'json',
				        dataSource: {
				        	"chart": {
				                "theme": "fint",
				                "caption": "",
				                "subCaption": "",
				                "xAxisName": "Date",
				        		"yAxisName": "Sale In Bottles",
				                "numberPrefix": "",
				        		"formatNumberScale": "0",
				        		"thousandSeparatorPosition": "2,3",
				        		"showValues": "1",
				                "toolTipColor": "#ffffff",
				        		"toolTipBorderThickness": "0",
				        		"toolTipBgColor": "#000000",
				        		"toolTipBgAlpha": "80",
				        		"toolTipBorderRadius": "2",
				        		"toolTipPadding": "5"
				              },
				              "categories": [{
				                  "category": JSON.parse(JSON.stringify(response.data.categoryLineChart))
				                }],
				                "dataset": JSON.parse(JSON.stringify(response.data.dataset))
				        }
				    });
					salesChart.render();
	 	    	  }, function myError(response) {
	 	    	  });
			}
		} 
function  buildSoldPieChart(startDate,endDate){
		var canvasPieChart = url+"getSaleCanvasPieChart?startDate="+startDate+"&endDate="+endDate;
		$http({
		    method : "GET",
		    url : canvasPieChart
		  }).then(function mySuccess(response) {
			 console.log(JSON.stringify(response.data));
			  $scope.canvasPieChart(response.data);
			  $scope.doughnutChart = response.data;
		  }, function myError(response) {
		    //alert(response);
		  });
   }
$scope.canvasPieChart = function(jsonData){
	var chartDataSecond="";
	$.each(jsonData, function (index, value) {
		chartDataSecond+="{\"y\" :"+JSON.stringify(value.value)+",\"name\" :"+JSON.stringify(value.label)+",\"case\" :"+JSON.stringify(value.saleInCase)+"}";
    	  if(!(index==jsonData.length-1)){
    		  chartDataSecond+=",";
    	  } 
   });
	CanvasJS.addColorSet("greenShades",
            ["#D98880","#BB8FCE","#76D7C4","#F7DC6F","#E59866","#BFC9CA","#85929E","#F5B7B1","#A9CCE3","#A2D9CE","#F9E79F","#D6DBDF","#D0D3D4"]);
	
	var chart = new CanvasJS.Chart("doughnutChart",
			{
		        colorSet: "greenShades",
				title:{
					fontSize: 15,
					fontColor: "black",
					fontFamily: "'Montserrat', sans-serif",
					fontWeight: "bold",
					text: "Category Wise Sale"
				},
				data: [
				{
					type: "pie",
					click: onClick,
					showInLegend: false,
					indexLabelFontSize: 12,
					indexLabelFontColor: "black",
					indexLabelPlacement: "inside",
					toolTipContent: "{name}, {case}C, INR {y}",
					indexLabel: "{name}, #percent%",
					percentFormatString: "#0.#",
					dataPoints: JSON.parse("["+chartDataSecond+"]")
				}]
			});
			chart.render();
}
function onClick(e) {
	
	compaire(e.dataPoint.name);
}
function explodePie (e) {
	if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
		e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
	} else {
		e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
	}
	e.chart.render();

}
function compaire(argObj){
	
    angular.forEach($scope.doughnutChart, function(value, key) {
        if(value.label == argObj) {
        	 $scope.$apply(function() {
        		 $scope.renderSaleData = value.dashboardSaleBeanList;
        		// console.log(JSON.stringify(value.dashboardSaleBeanList));
        		 $scope.catLabel = value.label;
             });
        	 $('#comparisonPupop').modal('show');
        	 
        }
        var chartDataSecond="";
		$.each($scope.renderSaleData, function (index, value) {
			chartDataSecond+="{\"y\" :"+JSON.stringify(value.amount)+",\"name\" :"+JSON.stringify(value.shortName)+",\"case\" :"+JSON.stringify(value.saleInCase)+"}";
	    	  if(!(index==$scope.renderSaleData.length-1)){
	    		  chartDataSecond+=",";
	    	  } 
	   });
        generatePieChartForSeparateCat(chartDataSecond);
    });

}
function generatePieChartForSeparateCat(chartDataSecond){
	CanvasJS.addColorSet("greenShades",
            ["#BB8FCE","#76D7C4","#F7DC6F","#BFC9CA","#85929E","#F5B7B1","#A9CCE3","#A2D9CE","#F9E79F","#D6DBDF","#D0D3D4","#8c7373","#bf4040","#7CFC00","#E59866"]);
	
	var chart = new CanvasJS.Chart("doughnutChartForACat",
			{
		        colorSet: "greenShades",
		        height:500,
		        width: 780,
				title:{
					fontSize: 15,
					fontColor: "black",
					fontFamily: "'Montserrat', sans-serif",
					fontWeight: "bold",
					text: $scope.catLabel+" Sale"
				},
				data: [
				{
					type: "pie",
					showInLegend: false,
					indexLabelFontSize: 12,
					indexLabelFontColor: "black",
					indexLabelPlacement: "inside",
					toolTipContent: "{name}, {case}C, INR {y}",
					//indexLabel: "{name}",
					indexLabel: "{name}, #percent%",
					percentFormatString: "#0.#",
					dataPoints: JSON.parse("["+chartDataSecond+"]")
				}]
			});
			chart.render();
}
});
app.filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});
app.filter("sumItens", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.totalval;
        });
        return Math.ceil(s);
    };
})
app.filter("soldBeerCase", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
        	if(alldetails.category === "BEER" || alldetails.category === "BEER -FL")
             s += alldetails.sumOfRealCases;
        });
        return Math.round(s);
    };
})
app.filter("sumCases", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
             s += alldetails.cases;
        });
        return Math.ceil(s);
    };
})
app.filter("beertotalprice", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
        	if(alldetails.category === "BEER" || alldetails.category === "BEER -FL")
             s += alldetails.totalval;
        });
        return Math.ceil(s);
    };
})
app.filter("Liquortotalprice", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
        	if(!(alldetails.category === "BEER" || alldetails.category === "BEER -FL"))
             s += alldetails.totalval;
        });
        return Math.ceil(s);
    };
})
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
