var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getHomePageDetails";
	$http({
	    method : "GET",
	    url : productListUrl
	  }).then(function mySuccess(response) {
		 //console.log(JSON.stringify(response.data));
		  $scope.profitOrLoss = response.data.profitOrLoss;
		  $scope.totalSaleValue = response.data.saleValue;
		  $scope.inHouseStockValue = response.data.inHouseStockValue;
		  $scope.discountDues = response.data.pendingDiscount;
		  $scope.comulativeValue = response.data.comulativeValue;
		  $scope.maxSaleProduct = response.data.maxSaleProduct;
		  chartCreationForMonthWiseSale(JSON.stringify(response.data.dailySale));
		  $scope.lowStockProduct = response.data.lowStockProduct;
		  $scope.doughnutChart = response.data.doughnutChart;
		  //$scope.chartdoughnut3d(JSON.stringify(response.data.doughnutChart));
		  canvasPieChart(response.data.doughnutChart,response.data.currentDate);
		  $scope.companyDiscountDues = response.data.companyDiscountDues;
		  $scope.currentDate = response.data.currentDate;
	  }, function myError(response) {
	    //alert(response);
	  });
	
	function canvasPieChart(jsonData,curDate){
		var chartDataSecond="";
		$.each(jsonData, function (index, value) {
			chartDataSecond+="{\"y\" :"+JSON.stringify(value.value)+",\"name\" :"+JSON.stringify(value.label)+",\"case\":"+JSON.stringify(value.caseInPercentage)+",\"caseVal\":"+JSON.stringify(value.saleInCase)+"}";
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
						text: "Category Wise Sale ("+curDate+")"
					},
					data: [
					{
						type: "pie",
						click: onClick,
						showInLegend: false,
						indexLabelFontSize: 12,
						indexLabelFontColor: "black",
						indexLabelPlacement: "inside",
						toolTipContent: "{name}, {caseVal}C, INR {y}",
						indexLabel: "{name}, #percent%",
						percentFormatString: "#0.#",
						dataPoints: JSON.parse("["+chartDataSecond+"]")
					}]
				});
				chart.render();
	}
	function onClick(e) {
		compaire(e.dataPoint.name)
		//alert(  e.dataSeries.type + ", dataPoint { x:" + e.dataPoint.name + ", y: "+ e.dataPoint.y + " }" );
	}
	function explodePie (e) {
		if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
			e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
		} else {
			e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
		}
		e.chart.render();

	}
	 function chartCreationForMonthWiseSale(totalCost){
		 // console.log(JSON.stringify(totalCost));
			var salesChart = new FusionCharts({
		        type: 'column2d',
		        renderAt: 'total_sale_chart_container_Month_wise',
		        width: '100%',
		        height: '100%',
		        dataFormat: 'json',
		        dataSource: {
		            "chart": {
		                "caption": "Last 10 Days Sale",
		                "subCaption": "",
		                "xAxisName": "Day",
		                "yAxisName": "Amount (In INR)",
		                "numberPrefix": "",
		                "formatNumberScale": "0",
		                "thousandSeparatorPosition": "2,3",
		                "paletteColors": "#C5ADC2,#33cc33,#6699ff,#FF7A33,#ff8080,#cccc00,#33FF74",
		                "bgColor": "#ffffff",
		                "showBorder": "0",
		                "showCanvasBorder": "0",
		                "plotBorderAlpha": "10",
		                "usePlotGradientColor": "0",
		                "plotFillAlpha": "50",
		                "showXAxisLine": "1",
		                "axisLineAlpha": "25",
		                "divLineAlpha": "10",
		                "showValues": "1",
		                "showAlternateHGridColor": "0",
		                "captionFontSize": "15",
		                "subcaptionFontSize": "8",
		                "subcaptionFontBold": "0",
		                "toolTipColor": "#ffffff",
		                "toolTipBorderThickness": "0",
		                "toolTipBgColor": "#000000",
		                "toolTipBgAlpha": "80",
		                "toolTipBorderRadius": "2",
		                "toolTipPadding": "5",
		                "rotatevalues": "1",
		                "placevaluesInside": "1",
		                "outCnvBaseFont": "'Montserrat', sans-serif !important",
		                "outCnvBaseFontColor": "#00000",
		                "theme": "candy"
		               /* "valueFontSize": "8"*/
		                	
		            },
		            
		            "data": JSON.parse(totalCost)
		        }
		    });
			salesChart.render();
		}
	 $scope.chartdoughnut3d = function(totalCost){
		  //console.log(JSON.stringify(totalCost));
			var salesChart = new FusionCharts({
		        type: 'pie2d',
		        renderAt: 'doughnutChart',
		        width: '100%',
		        height: '100%',
		        dataFormat: 'json',
		        dataSource: {
		        	"chart": {
		        		"caption": "Category Wise Sale",
		                 "subCaption": "",
		                 "bgColor": "#ffffff",
		                 "showBorder": "0",
		                 "use3DLighting": "0",
		                 "showShadow": "0",
		                 "enableSmartLabels": "0",
		                 "startingAngle": "0",
		                 "showPercentValues": "0",
		                 "showPercentInTooltip": "0",
		                 "showlabels": "0",
		                 "showValues": "0",
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
		                 "outCnvBaseFont": "'Montserrat', sans-serif !important",
			              "outCnvBaseFontColor": "#00000",
		                 "thousandSeparatorPosition": "2,3"
		               },
		            "data": JSON.parse(totalCost)
		        },
		        "events": {
			          "dataplotClick": function(evtObj, argObj) {
			        	  $scope.compaire(argObj);
			          }
			       }
		    });
			salesChart.render();
		}
	 
	 function compaire(argObj){
            angular.forEach($scope.doughnutChart, function(value, key) {
                if(value.label == argObj) {
                	 $scope.$apply(function() {
                		 $scope.renderSaleData = value.dashboardSaleBeanList;
                		// console.log(JSON.stringify(value.dashboardSaleBeanList));
                		 $scope.catLabel = value.label;
                     });
                	 $("#comparisonPupop").modal("show");
                }
                var chartDataSecond="";
        		$.each($scope.renderSaleData, function (index, value) {
        			chartDataSecond+="{\"y\" :"+JSON.stringify(value.amount)+",\"name\" :"+JSON.stringify(value.shortName)+",\"case\":"+JSON.stringify(value.caseInPercentage)+",\"caseVal\":"+JSON.stringify(value.saleInCase)+"}";
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
							toolTipContent: "{name}, {caseVal}C, INR {y}",
							indexLabel: "{name}, #percent%",
							percentFormatString: "#0.#",
							dataPoints: JSON.parse("["+chartDataSecond+"]")
						}]
					});
					chart.render();
		}
	 $scope.openModalPopup = function(brandName,previousSoldData){
		// console.log(JSON.stringify(previousSoldData));
		  var salesChart = new FusionCharts({
		        type: 'line',
		        renderAt: 'chart-container',
		        width: '100%',
		        height: '100%',
		        dataFormat: 'json',
		        dataSource: {
		            "chart": {
		                "caption": brandName,
		                "subCaption": "",
		                "xAxisName": "Day",
		                "yAxisName": "Sale Amount",
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
		            "data": previousSoldData
		        }
		    });
			salesChart.render();
	  }
 $scope.listOutAllDiscount = function(companyId,companyName){
	 $scope.DiscountCompanyName = companyName;
	 $scope.popupcompanyId= companyId;
//	 alert("companyId>> "+companyId+" companyName>> "+companyName);
	 var productListUrl = url+"getHomePageDiscountDetails?companyId="+companyId;
		$http({
		    method : "GET",
		    url : productListUrl
		  }).then(function mySuccess(response) {
			 // console.log(JSON.stringify(response.data));
			  $scope.DiscountDetails = response.data;
			  $("#discountPupop").modal("show");
		  }, function myError(response) {
		  });
 }
 $scope.openListDiscontsAllCompany = function(date,realDate,discountAmt,rentals,checkAmt,arrears) {
		 $scope.dateDash = date;
		 $scope.ttlDiscountDash = discountAmt;
		 $scope.rentalsAmtDash = rentals;
		 $scope.aarearsDash = arrears;
		 var myUrl = window.location.href;
			var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
			var Url = url+"mobileView/stockLiftingWithDiscountReportWithBrandDetails?date="+realDate+"&companyId="+$scope.popupcompanyId;
			$http({
			    method : "GET",
			    url : Url
			  }).then(function mySuccess(response) {
				  var brandNoarr = [];
				   $.each(response.data, function(index, value){
				   	if(brandNoarr.indexOf(value.invoiceId) === -1){
				   		brandNoarr.push(value.invoiceId);
				   	}
				   });
				   var inputjson = [];
				   for (var i = 0; i < brandNoarr.length; i++) {
					   var Brands= [];
					   var totalCaseQty=0,totalDiscount=0;
					   var productName="";
					   $.each(response.data, function(index, value){
						   if(brandNoarr[i] == value.invoiceId){
							   var input = {
						        		"brandName":value.brandName,
						        		"brandNo":value.brandNo,
						        		"caseQty":value.caseQty,
						        		"unitPrice":value.unitPrice,
						        		"totalPrice":value.totalPrice
						        };
							   Brands.push(input);
							   totalCaseQty += value.caseQty;
							   totalDiscount += value.totalPrice;
							   productName = value.productType;
						   }
						   
			    	    });
					   var  inputparent = {
				   	        		"productName":productName,
				   	        		"totalCaseQty":totalCaseQty,
				   	        		"totalDiscount":totalDiscount,
				   	        		"Brands":Brands
					       };
			              inputjson.push(inputparent);
					   
				   }
				   $scope.tempData = inputjson;
			  }, function myError(response) {
			  });
		}
 $scope.greaterThanZeroAllCompany = function(prop1,prop2,prop3, val){
	    return function(item){
	      return (item[prop1]+item[prop2]+item[prop3]) > val;
	    }
	}
 $scope.greaterThan = function(prop, val){
	    return function(item){
	      return item[prop] > val;
	    }
	}
});

app.filter('INR', function () {        
    return function (input) {
        if (! isNaN(input)) {
           // var currencySymbol = '₹';
        	 var currencySymbol = '';
            //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
            var result = Math.round(input).toString().split('.');

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
