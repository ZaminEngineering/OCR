var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {
	 $("#showAllDetails").hide();
	 $(".saleReportWithCategoryWise").hide();
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var saleDatesUrl = url+"mobileView/getTotalSaleDates";
	$http({
	    method : "GET",
	    url : saleDatesUrl
	  }).then(function mySuccess(response) {
		//  console.log(JSON.stringify(response.data));
		  var startDate="";
	      var enableDays =[];
	      $.each(response.data, function (index, value) {
	    	  enableDays.push(response.data[index].date);
	    	  startDate=response.data[index].date;
	      });
	      $("#startDate").val(startDate);
	  	  $("#endDate").val(startDate);
	  	   getTimeStamp(enableDays);
	  	 getSaleReport(startDate,startDate);
	  }, function myError(response) {
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
	$scope.getResults = function (startDate,endDate){
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		 if(validateCalendarField()==false){return false;}
		 getSaleReport(startDate,endDate);
		 
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
	function  getSaleReport(startDate,endDate){
		var compareNo = startDate.localeCompare(endDate);
		$("#wait").css("display", "block");
		var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		var callingUrl = url+"mobileView/getSaleReports.json?startDate="+startDate+"&endDate="+endDate;
		$http({
		    method : "GET",
		    url : callingUrl
		  }).then(function mySuccess(response) {
			 // console.log(JSON.stringify(response.data));
			  $scope.alldetails = response.data.saleBean;
			  $scope.allExpenseAmt = response.data.amount;
			  $scope.carAndCash = response.data.total;
			  $scope.difference = response.data.diff;
			  var companyName = [];
			  var categoryName = [];
			  var totalPriceForPercentage=0;
	    	   $.each(response.data.saleBean, function(index, value){
	    		   totalPriceForPercentage+=value.totalPrice;
	    	   	if(companyName.indexOf(value.invoiceId) === -1){          // companyName=companyID
	    	   		companyName.push(value.invoiceId);
	    	   	}
	    	   	if(categoryName.indexOf(value.saleId) === -1){          // saleId for categoryId
	    	   		categoryName.push(value.saleId);
	    	   	}
	    	   });
	    	   $scope.totalPriceForPercentage = totalPriceForPercentage;
	    	   // for company including zero
	    	   var inputsuperjson = [];
	    	   for (var i = 0; i < companyName.length; i++) {
	    		   var brandNoarr = [];
	    		   var bgcolor="",company = "";
	    		   var sumOfCase = 0,bottles = 0,totalSaleAmount = 0;
	    		   var companyOrder = 0,inhousestock = 0,firstFontColor=5,firstFontColorWithFilter=5,superCompareCurrentSale=0,superComparePreviousDaySale=0;
		    	   $.each(response.data.saleBean, function(index, value){
		    		   
		    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
		    	   		if(companyName[i] == value.invoiceId)
		    	   		brandNoarr.push(value.brandNo);
		    	   	}
		    	   });
		    	   var inputjson = [];
		    	   for (var j = 0; j < brandNoarr.length; j++) {
		    		   var Brands= [];
		    		   var name="";
		    		   var cases=0,totalbtlsale=0,saleValue = 0,inHouseCase = 0,secondFontColor=5,secondFontColorWithFilter=5,compareCurrentSale=0,comparePreviousDaySale=0;
		    		   $.each(response.data.saleBean, function(index, value){
		    		   if(brandNoarr[j] == value.brandNo){
		    			   var caseVal = Math.trunc(value.totalSale/value.packQty);
	    				   var input = {
	    			        		"quantity":value.quantity,
	    			        		"totalSale":value.totalSale,
	    			        		"caseVal":caseVal,
	    			        		"amount":value.totalPrice,
	    			        		"btlVal":value.totalSale-(caseVal*value.packQty),
	    			        		"closing":value.closing,
	    			        		"caseStock":Math.trunc(value.bottleSaleMrp),
	    			        		"noOfDays":value.noOfReturnsBtl,
	    			        		"stock":value.qtyBottels+value.totalSale,
	    			        		"compareTotalSale":value.received,
	    			        		"compareNo":compareNo
	    			        };
	    				   Brands.push(input);
	    				   cases=cases+value.cummulativePrice;
	    				   brandname=value.brandName;
	    				   bgcolor=value.color;
	    				   saleValue=saleValue+value.totalPrice;
	    				   totalbtlsale=totalbtlsale+value.totalSale;
	    				   compareCurrentSale += value.totalSale;
	    				   comparePreviousDaySale += value.received;
	    				   company=value.company;
	    				   companyOrder=value.companyOrder;
	    				   inHouseCase=inHouseCase+value.bottleSaleMrp; // for in house stock as case
	    					 if(((value.noOfReturnsBtl) <= 1))
	    					   secondFontColor = 0;
		    		     }
		    		   });
		    		   var  inputparent = {
	       	   	        		"brandNo":brandNoarr[j],
	       	   	        		"brandname":brandname,
	       	   	        		"cases":Math.round(cases),
	       	   	        		"saleValue":saleValue,
	       	   	        		"totalbtlsale":totalbtlsale,
	       	   	        		"inHouseCase":Math.round(inHouseCase),
	       	   	        		"secondFontColor":secondFontColor,
	       	   	        	    "compareCurrentSale": compareCurrentSale,
	       	   	        	    "comparePreviousDaySale": comparePreviousDaySale,
	       	   	        	    "compareNo":compareNo,
	       	   	        		"Brands":Brands
		    		       };
		    		   inputjson.push(inputparent);
		    		   sumOfCase=sumOfCase+cases;
		    		   superCompareCurrentSale += compareCurrentSale;
		    		   superComparePreviousDaySale += comparePreviousDaySale;
		    		   totalSaleAmount=totalSaleAmount+saleValue;
		    		   bottles=bottles+totalbtlsale;
		    		   inhousestock=inhousestock+inHouseCase;
		    		   if(secondFontColor <=1)
		    			   firstFontColor = 0;
		    	   }
		    	   var  inputsuperparent = {
      	   	        		"company":company,
      	   	        	    "bgcolor":bgcolor,
      	   	        	    "sumOfCase":Math.round(sumOfCase),
      	   	        	    "superComparePreviousDaySale" :superComparePreviousDaySale,
      	   	        	    "superCompareCurrentSale" :superCompareCurrentSale,
      	   	        	    "bottles":bottles,
      	   	        	    "totalSaleAmount":totalSaleAmount,
      	   	        	    "companyOrder":companyOrder,
      	   	        	    "inhousestock":Math.round(inhousestock),
      	   	        	    "firstFontColor":firstFontColor,
      	   	        	    "compareNo":compareNo,
      	   	        		"inputjson":inputjson
	    		       };
		    	   inputsuperjson.push(inputsuperparent);
	    	   }
	    	   $scope.saledata = inputsuperjson;
	    	   
	    	   // For company including only sale
	    	   var inputsuperjsonOnlySale = [];
	    	   for (var i = 0; i < companyName.length; i++) {
	    		   var brandNoarr = [];
	    		   var bgcolor="",company = "";
	    		   var totalSaleAmount = 0,bottles = 0,sumOfCase = 0,companyOrder = 0,inhousestock = 0,firstFontColorWithFilter=5,superCompareCurrentSale=0,superComparePreviousDaySale=0;
		    	   $.each(response.data.saleBean, function(index, value){
		    		   
		    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
		    	   		if(companyName[i] == value.invoiceId)
		    	   		brandNoarr.push(value.brandNo);
		    	   	}
		    	   });
		    	   var inputjson = [];
		    	   for (var j = 0; j < brandNoarr.length; j++) {
		    		   var Brands= [];
		    		   var cases=0;
		    		   var name="";
		    		   var totalbtlsale=0;
		    		   var saleValue = 0,inHouseCase = 0,secondFontColorWithFilter=5,compareCurrentSale=0,comparePreviousDaySale=0;
		    		   $.each(response.data.saleBean, function(index, value){
		    		   if((brandNoarr[j] == value.brandNo) && (value.totalSale > 0)){
		    			   var caseVal = Math.trunc(value.totalSale/value.packQty);
	    				   var input = {
	    			        		"quantity":value.quantity,
	    			        		"totalSale":value.totalSale,
	    			        		"caseVal":caseVal,
	    			        		"amount":value.totalPrice,
	    			        		"btlVal":value.totalSale-(caseVal*value.packQty),
	    			        		"closing":value.closing,
	    			        		"caseStock":Math.trunc(value.bottleSaleMrp),
	    			        		"noOfDays":value.noOfReturnsBtl,
	    			        		"stock":value.qtyBottels+value.totalSale,
	    			        		"compareTotalSale":value.received,
	    			        		"compareNo":compareNo
	    			        };
	    				   Brands.push(input);
	    				   cases=cases+value.cummulativePrice;
	    				   brandname=value.brandName;
	    				   bgcolor=value.color;
	    				   saleValue=saleValue+value.totalPrice;
	    				   totalbtlsale=totalbtlsale+value.totalSale;
	    				   compareCurrentSale += value.totalSale;
	    				   comparePreviousDaySale += value.received;
	    				   company=value.company;
	    				   companyOrder=value.companyOrder;
	    				   inHouseCase=inHouseCase+value.bottleSaleMrp; // for in house stock as case
	    					 if((value.noOfReturnsBtl) <= 1)
	    						 secondFontColorWithFilter = 0;
		    		     }
		    		   });
		    		   var  inputparent = {
	       	   	        		"brandNo":brandNoarr[j],
	       	   	        		"brandname":brandname,
	       	   	        		"cases":Math.round(cases),
	       	   	        		"saleValue":saleValue,
	       	   	             	"compareCurrentSale": compareCurrentSale,
       	   	        	        "comparePreviousDaySale": comparePreviousDaySale,
	       	   	        		"totalbtlsale":totalbtlsale,
	       	   	        		"inHouseCase":Math.round(inHouseCase),
	       	   	        		"secondFontColorWithFilter":secondFontColorWithFilter,
	       	   	            	"compareNo":compareNo,
	       	   	        		"Brands":Brands
		    		       };
		    		   inputjson.push(inputparent);
		    		   sumOfCase=sumOfCase+cases;
		    		   superCompareCurrentSale += compareCurrentSale;
		    		   superComparePreviousDaySale += comparePreviousDaySale;
		    		   totalSaleAmount=totalSaleAmount+saleValue;
		    		   bottles=bottles+totalbtlsale;
		    		   inhousestock=inhousestock+inHouseCase;
		    		   if(secondFontColorWithFilter <=1)
		    			   firstFontColorWithFilter = 0;
		    	   }
		    	   var  inputsuperparent = {
      	   	        		"company":company,
      	   	        	    "bgcolor":bgcolor,
      	   	        	    "sumOfCase":Math.round(sumOfCase),
      	   	        	    "superComparePreviousDaySale" :superComparePreviousDaySale,
   	   	        	        "superCompareCurrentSale" :superCompareCurrentSale,
      	   	        	    "bottles":bottles,
      	   	        	    "totalSaleAmount":totalSaleAmount,
      	   	        	    "companyOrder":companyOrder,
      	   	        	    "inhousestock":Math.round(inhousestock),
      	   	        	    "firstFontColorWithFilter":firstFontColorWithFilter,
      	   	        	    "compareNo":compareNo,
      	   	        		"inputjson":inputjson
	    		       };
		    	   inputsuperjsonOnlySale.push(inputsuperparent);
	    	   }
	    	   $scope.saledataOnlySale = inputsuperjsonOnlySale;
	    	   
	    	   // For category wise including zero
	    	   var inputsuperCategoryjson = [];
	    	   for (var i = 0; i < categoryName.length; i++) {
	    		   var brandNoarr = [];
	    		   var bgcolor="",category = "";
	    		   var sumOfCase = 0,bottles = 0,totalSaleAmount = 0;
	    		   var categoryOrder = 0,inhousestock = 0,firstFontColor=5,firstFontColorWithFilter=5,superCompareCurrentSale=0,superComparePreviousDaySale=0;
		    	   $.each(response.data.saleBean, function(index, value){
		    		   
		    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
		    	   		if(categoryName[i] == value.saleId)
		    	   		brandNoarr.push(value.brandNo);
		    	   	}
		    	   });
		    	   var inputcategoryjson = [];
		    	   for (var j = 0; j < brandNoarr.length; j++) {
		    		   var Brands= [];
		    		   var cases=0;
		    		   var name="";
		    		   var totalbtlsale=0;
		    		   var saleValue = 0,inHouseCase = 0,secondFontColor=5,secondFontColorWithFilter=5,compareCurrentSale=0,comparePreviousDaySale=0;
		    		   $.each(response.data.saleBean, function(index, value){
		    		   if(brandNoarr[j] == value.brandNo){
		    			   var caseVal = Math.trunc(value.totalSale/value.packQty);
	    				   var input = {
	    			        		"quantity":value.quantity,
	    			        		"totalSale":value.totalSale,
	    			        		"caseVal":caseVal,
	    			        		"amount":value.totalPrice,
	    			        		"btlVal":value.totalSale-(caseVal*value.packQty),
	    			        		"closing":value.closing,
	    			        		"caseStock":Math.trunc(value.bottleSaleMrp),
	    			        		"noOfDays":value.noOfReturnsBtl,
	    			        		"stock":value.qtyBottels+value.totalSale,
	    			        		"compareTotalSale":value.received,
	    			        		"compareNo":compareNo
	    			        };
	    				   Brands.push(input);
	    				   cases=cases+value.cummulativePrice;
	    				   brandname=value.brandName;
	    				   bgcolor=value.invoiceDate;// for color
	    				   saleValue=saleValue+value.totalPrice;
	    				   totalbtlsale=totalbtlsale+value.totalSale;
	    				   compareCurrentSale += value.totalSale;
	    				   comparePreviousDaySale += value.received;
	    				   category=value.category;
	    				   categoryOrder=value.categoryOrder;
	    				   inHouseCase=inHouseCase+value.bottleSaleMrp; // for in house stock as case
	    				   if(((value.noOfReturnsBtl) <= 1) && ((value.qtyBottels+value.totalSale) > 0))
	    					   firstFontColorWithFilter = 0;
	    					   if(((value.noOfReturnsBtl) <= 1))
	    					   secondFontColor = 0;
		    		     }
		    		   });
		    		   var  inputparent = {
	       	   	        		"brandNo":brandNoarr[j],
	       	   	        		"brandname":brandname,
	       	   	        		"cases":Math.round(cases),
	       	   	        	    "compareCurrentSale": compareCurrentSale,
   	   	        	            "comparePreviousDaySale": comparePreviousDaySale,
	       	   	        		"saleValue":saleValue,
	       	   	        		"totalbtlsale":totalbtlsale,
	       	   	        		"inHouseCase":Math.round(inHouseCase),
	       	   	        		"secondFontColor":secondFontColor,
	       	   	        		"secondFontColorWithFilter":secondFontColorWithFilter,
	       	   	        	    "compareNo":compareNo,
	       	   	        		"Brands":Brands
		    		       };
		    		   inputcategoryjson.push(inputparent);
		    		   sumOfCase=sumOfCase+cases;
		    		   superCompareCurrentSale += compareCurrentSale;
		    		   superComparePreviousDaySale += comparePreviousDaySale;
		    		   totalSaleAmount=totalSaleAmount+saleValue;
		    		   bottles=bottles+totalbtlsale;
		    		   inhousestock=inhousestock+inHouseCase;
		    		   if(secondFontColor <=1)
		    			   firstFontColor = 0;
		    		   if(secondFontColorWithFilter <= 1)
		    			   firstFontColorWithFilter = 0;
		    	   }
		    	   var  inputsuperparent = {
      	   	        		"category":category,
      	   	        	    "bgcolor":bgcolor,
      	   	        	    "sumOfCase":Math.round(sumOfCase),
      	   	        	    "superComparePreviousDaySale" :superComparePreviousDaySale,
	   	        	        "superCompareCurrentSale" :superCompareCurrentSale,
      	   	        	    "bottles":bottles,
      	   	        	    "totalSaleAmount":totalSaleAmount,
      	   	        	    "categoryOrder":categoryOrder,
      	   	        	    "inhousestock":Math.round(inhousestock),
      	   	        	    "firstFontColor":firstFontColor,
      	   	        	    "firstFontColorWithFilter":firstFontColorWithFilter,
      	   	        	    "compareNo":compareNo,
      	   	        		"inputcategoryjson":inputcategoryjson
	    		       };
		    	   inputsuperCategoryjson.push(inputsuperparent);
	    	   }
	    	   $scope.saleCategoryData = inputsuperCategoryjson;
	    	   
	    	   // For category wise without including zero
	    	   var inputsuperCategoryjsonOnlySale = [];
	    	   for (var i = 0; i < categoryName.length; i++) {
	    		   var brandNoarr = [];
	    		   var bgcolor="",category = "";
	    		   var sumOfCase = 0,bottles = 0,totalSaleAmount = 0;
	    		   var categoryOrder = 0,inhousestock = 0,firstFontColor=5,superCompareCurrentSale=0,superComparePreviousDaySale=0;
		    	   $.each(response.data.saleBean, function(index, value){
		    		   
		    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
		    	   		if(categoryName[i] == value.saleId)
		    	   		brandNoarr.push(value.brandNo);
		    	   	}
		    	   });
		    	   var inputcategoryjson = [];
		    	   for (var j = 0; j < brandNoarr.length; j++) {
		    		   var Brands= [];
		    		   var name="";
		    		   var cases=0,totalbtlsale=0,saleValue = 0,inHouseCase = 0,secondFontColor=5,compareCurrentSale=0,comparePreviousDaySale=0;
		    		   $.each(response.data.saleBean, function(index, value){
		    		   if((brandNoarr[j] == value.brandNo) && (value.totalSale > 0)){
		    			   var caseVal = Math.trunc(value.totalSale/value.packQty);
	    				   var input = {
	    			        		"quantity":value.quantity,
	    			        		"totalSale":value.totalSale,
	    			        		"caseVal":caseVal,
	    			        		"amount":value.totalPrice,
	    			        		"btlVal":value.totalSale-(caseVal*value.packQty),
	    			        		"closing":value.closing,
	    			        		"caseStock":Math.trunc(value.bottleSaleMrp),
	    			        		"noOfDays":value.noOfReturnsBtl,
	    			        		"stock":value.qtyBottels+value.totalSale,
	    			        		"compareTotalSale":value.received,
	    			        		"compareNo":compareNo
	    			        };
	    				   Brands.push(input);
	    				   cases=cases+value.cummulativePrice;
	    				   compareCurrentSale += value.totalSale;
	    				   comparePreviousDaySale += value.received;
	    				   brandname=value.brandName;
	    				   bgcolor=value.invoiceDate;// for color
	    				   saleValue=saleValue+value.totalPrice;
	    				   totalbtlsale=totalbtlsale+value.totalSale;
	    				   category=value.category;
	    				   categoryOrder=value.categoryOrder;
	    				   inHouseCase=inHouseCase+value.bottleSaleMrp; // for in house stock as case
	    				   if(((value.noOfReturnsBtl) <= 1))
	    					   secondFontColor = 0;
	    					 
		    		     }
		    		   });
		    		   var  inputparent = {
	       	   	        		"brandNo":brandNoarr[j],
	       	   	        		"brandname":brandname,
	       	   	        		"cases":Math.round(cases),
	       	   	        	    "compareCurrentSale": compareCurrentSale,
	   	        	            "comparePreviousDaySale": comparePreviousDaySale,
	       	   	        		"saleValue":saleValue,
	       	   	        		"totalbtlsale":totalbtlsale,
	       	   	        		"inHouseCase":Math.round(inHouseCase),
	       	   	        		"secondFontColor":secondFontColor,
	       	   	        	    "compareNo":compareNo,
	       	   	        		"Brands":Brands
		    		       };
		    		   inputcategoryjson.push(inputparent);
		    		   sumOfCase=sumOfCase+cases;
		    		   superCompareCurrentSale += compareCurrentSale;
		    		   superComparePreviousDaySale += comparePreviousDaySale;
		    		   totalSaleAmount=totalSaleAmount+saleValue;
		    		   bottles=bottles+totalbtlsale;
		    		   inhousestock=inhousestock+inHouseCase;
		    		   if(secondFontColor <= 1)
		    			   firstFontColor = 0;
		    	   }
		    	   var  inputsuperparent = {
      	   	        		"category":category,
      	   	        	    "bgcolor":bgcolor,
      	   	        	    "sumOfCase":Math.round(sumOfCase),
      	   	        	    "superComparePreviousDaySale" :superComparePreviousDaySale,
   	        	            "superCompareCurrentSale" :superCompareCurrentSale,
      	   	        	    "bottles":bottles,
      	   	        	    "totalSaleAmount":totalSaleAmount,
      	   	        	    "categoryOrder":categoryOrder,
      	   	        	    "inhousestock":Math.round(inhousestock),
      	   	        	    "firstFontColor":firstFontColor,
      	   	            	"compareNo":compareNo,
      	   	        		"inputcategoryjson":inputcategoryjson
	    		       };
		    	   inputsuperCategoryjsonOnlySale.push(inputsuperparent);
	    	   }
	    	   //console.log(JSON.stringify(inputsuperCategoryjsonOnlySale));
	    	   $scope.saleCategoryDataOnlySale = inputsuperCategoryjsonOnlySale;
	    	   
	    	   $("#wait").css("display", "none");
		  }, function myError(response) {
			  $("#wait").css("display", "none");
		  });
		
	 }
	$scope.includeZeroSaleOrNot = function(){
		var catOrComp = $('#includeZeroSaleOrNot').prop('checked');
       if(catOrComp === true){
    	   $("#showAllOnlySaleDetails").hide();
    	   $("#showAllDetails").show();
       }else{
    	  
    	   $("#showAllDetails").hide();
    	   $("#showAllOnlySaleDetails").show();
       }
    	   
	}
	$scope.greaterThan = function(prop, val){
	    return function(item){
	      return item[prop] > val;
	    }
	}
	$scope.greaterThanStock = function(prop, val){
	    return function(item){
	    	 return item[prop] > val;
	    }
	}
	$scope.filterDataOnlySale = function (item) {
	    return (!(item.company === "Carlsberg" || item.company === "Kingfisher" || item.company === "SAB Miller")&&(item.bottles > 0 || item.inhousestock > 0 || item.totalSaleAmount > 0));
	  }
	$scope.filterDataBeerOnlySale = function (item) {
	    return ((item.company === "Carlsberg" || item.company === "Kingfisher" || item.company === "SAB Miller")&&(item.bottles > 0 || item.inhousestock > 0 || item.totalSaleAmount > 0));
	  }
	$scope.filterCategoryDataOnlySale = function (item) {
	    return (!(item.category === "BEER" || item.category === "FOREIGN BEER" || item.category === "BEER -FL")&&(item.bottles > 0 || item.inhousestock > 0 || item.totalSaleAmount > 0));
	  }
	$scope.filterCategoryDataBeerOnlySale = function (item) {
	    return ((item.category === "BEER" || item.category === "FOREIGN BEER" || item.category === "BEER -FL")&&(item.bottles > 0 || item.inhousestock > 0 || item.totalSaleAmount > 0));
	  }
	
	
	$scope.filterData = function (item) {
	    return !(item.company === "Carlsberg" || item.company === "Kingfisher" || item.company === "SAB Miller");
	  }
	$scope.filterDataBeer = function (item) {
	    return (item.company === "Carlsberg" || item.company === "Kingfisher" || item.company === "SAB Miller");
	  }
	
	$scope.filterCategoryData = function (item) {
	    return !(item.category === "BEER" || item.category === "FOREIGN BEER" || item.category === "BEER -FL");
	  }
	$scope.filterCategoryDataBeer = function (item) {
	    return (item.category === "BEER" || item.category === "FOREIGN BEER" || item.category === "BEER -FL");
	  }
	$scope.FilterCatOrComp = function(){
		var catOrComp = $('#catOrComp').prop('checked');
       if(catOrComp === true){
    	   $(".saleReportWithCategoryWise").hide();
    	   $(".saleReportWithCompanyWise").show();
       }else{
    	   $(".saleReportWithCompanyWise").hide();
    	   $(".saleReportWithCategoryWise").show();
       }
    	   
	}
});
myApp.filter('roundup', function () {
    return function (value) {
        //return Math.ceil(value);
    	return value.toFixed(1);
    };
})
myApp.filter("totalAmount", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
             s += alldetails.totalPrice;
        });
        return Math.ceil(s);
    };
});
myApp.filter("soldBeerCase", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(saleCategoryDataOnlySale, i) {
        	if(saleCategoryDataOnlySale.category === "BEER" || saleCategoryDataOnlySale.category === "BEER -FL")
             s += saleCategoryDataOnlySale.sumOfCase;
        });
        return Math.round(s);
    };
});
myApp.filter("soldLiquorCase", function() {
	return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(saleCategoryDataOnlySale, i) {
        	if(!(saleCategoryDataOnlySale.category === "BEER" || saleCategoryDataOnlySale.category === "BEER -FL"))
             s += saleCategoryDataOnlySale.sumOfCase;
        });
        return Math.round(s);
    };
});
myApp.f
/*
myApp.filter("Liquortotalprice", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(saleCategoryDataOnlySale, i) {
        	if(!(saleCategoryDataOnlySale.category === "BEER" || saleCategoryDataOnlySale.category === "BEER -FL"))
             s += saleCategoryDataOnlySale.totalSaleAmount;
        });
        return Math.ceil(s);
    };
});
myApp.filter("beertotalprice", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(saleCategoryDataOnlySale, i) {
        	if(saleCategoryDataOnlySale.category === "BEER" || saleCategoryDataOnlySale.category === "BEER -FL")
             s += saleCategoryDataOnlySale.totalSaleAmount;
        });
        return Math.ceil(s);
    };
});*/
myApp.filter('INR', function () {        
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
