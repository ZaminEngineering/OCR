var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {
	 $(".saleReportWithCategoryWise").hide();
	 $("#startDate").val($.monthpicker.formatDate('MM yy', new Date()));
	 $('input.monthpicker').monthpicker({changeYear:true,dateFormat: 'MM yy' });
	 getStockLifting($.monthpicker.formatDate('MM yy', new Date()));
	 
	 
	 $scope.getResults = function (startDate){
		var startDate = $("#startDate").val();
		 if(validateCalendarField()==false){return false;}
		 getStockLifting(startDate);
		 
	}
	function validateCalendarField(){
		var startDate = $("#startDate").val();
		if(startDate == ""){
			alert("Please Select Month.");
			return false;
		}
		return true;
	}
	function  getStockLifting(startDate){
		//console.log("khage");
		$("#setDateValueID").val(startDate);
		var n = startDate.split(" ");
	    var val1 = n[n.length - 2];
	    var val2 = n[n.length - 1];
	    var date="01/"+val1+"/"+val2;
		var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		var callingUrl = url+"mobileView/getStockLiftingReports?date="+date;
		$http({
		    method : "GET",
		    url : callingUrl
		  }).then(function mySuccess(response) {
			// console.log(JSON.stringify(response.data));
			  $scope.alldetails = response.data;
			  $scope.commulative = response.data[0].unitPrice;
			  var companyName = [];
			  var categoryName = [];
			  var totalCaseForPercentage=0;
	    	   $.each(response.data, function(index, value){
	    		   totalCaseForPercentage+=value.caseQty;
	    	   	if(companyName.indexOf(value.invoiceId) === -1){          // companyName=companyID
	    	   		companyName.push(value.invoiceId);
	    	   	}
	    	   	if(categoryName.indexOf(value.opening) === -1){          // categoryName=opening
	    	   		categoryName.push(value.opening);
	    	   	}
	    	   });
	    	   $scope.totalCaseForPercentage = totalCaseForPercentage;
	    	   var inputsuperjson = [];
	    	   for (var i = 0; i < companyName.length; i++) {
	    		   var brandNoarr = [];
	    		   var bgcolor="";
	    		   var sumOfCase = 0,firstFontColor=0,sumOvPending=0,sumOfStock=0;
	    		   var company = "";
	    		   var companyOrder=0;
		    	   $.each(response.data, function(index, value){
		    		   
		    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
		    	   		if(companyName[i] == value.invoiceId)
		    	   		brandNoarr.push(value.brandNo);
		    	   	}
		    	   });
	    	   var inputjson = [];
	    	   for (var j = 0; j < brandNoarr.length; j++) {
	    		   var Brands= [];
	    		   var cases=0,inHouse=0,pending=0,secondFontColor=5;
	    		   var name="";
	    		   $.each(response.data, function(index, value){
	    		   if(brandNoarr[j] == value.brandNo){
    				   var input = {
    			        		"quantity":value.quantity,
    			        		"caseVal":value.caseQty,
    			        		"caseQty":value.closing,
    			        		"btls":value.noOfReturnsBtl,
    			        		"noOfDays":value.received,
    			        };
    				   Brands.push(input);
    				   cases=cases+value.caseQty;
    				   brandname=value.brandName;
    				   bgcolor=value.color;
    				   company=value.company;
    				   companyOrder=value.companyOrder;
    				   inHouse+=value.cummulativePrice;
    				   pending=value.saleId;
    				   if(((value.received) <= 1))
    					   secondFontColor = 0;
	    		     }
	    		   });
	    		   var temp =0;
	    		   if((pending-cases) > 0)
	    			   temp = pending-cases;
	    			   
	    		   var  inputparent = {
       	   	        		"brandNo":brandNoarr[j],
       	   	        		"brandname":brandname,
       	   	        		"cases":cases,
       	   	        		"inHouse":Math.round(inHouse),
       	   	        		"pending":temp,
       	   	        		"secondFontColor":secondFontColor,
       	   	        		"Brands":Brands
	    		       };
	    		   inputjson.push(inputparent);
	    		   sumOfCase=sumOfCase+cases;
	    		   sumOvPending+=temp;
	    		   sumOfStock+=inHouse;
	    		   if(secondFontColor <=1)
	    			   firstFontColor = 0;
	    	   }
	    	   var tempSec = 0;
	    	   if(sumOvPending > 0)
	    		   tempSec = sumOvPending;
	    	   
	    	   var  inputsuperparent = {
  	   	        		"company":company,
  	   	        	    "bgcolor":bgcolor,
  	   	        	    "sumOfCase":sumOfCase,
  	   	        	    "companyOrder":companyOrder,
  	   	        	    "firstFontColor":firstFontColor,
  	   	        	    "sumOvPending":tempSec,
  	   	        	    "sumOfStock":Math.round(sumOfStock),
  	   	        		"inputjson":inputjson
    		       };
	    	   inputsuperjson.push(inputsuperparent);
    	   }
    	   $scope.stockdata = inputsuperjson;
    	   
    	   // logic for category wise data
    	   var categorysuperjson = [];
    	   for (var i = 0; i < categoryName.length; i++) {
    		   var brandNoarr = [];
    		   var bgcolor="";
    		   var sumOfCase = 0,firstFontColor=0,sumOvPending=0,sumOfStock=0;
    		   var category = "";
    		   var categoryOrder=0;
	    	   $.each(response.data, function(index, value){
	    		   
	    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
	    	   		if(categoryName[i] == value.opening)
	    	   		brandNoarr.push(value.brandNo);
	    	   	}
	    	   });
    	   var inputjson = [];
    	   for (var j = 0; j < brandNoarr.length; j++) {
    		   var Brands= [];
    		   var cases=0,inHouse=0,pending=0,secondFontColor=5;
    		   var name="";
    		   $.each(response.data, function(index, value){
    		   if(brandNoarr[j] == value.brandNo){
				   var input = {
			        		"quantity":value.quantity,
			        		"caseVal":value.caseQty,
			        		"caseQty":value.closing,
			        		"btls":value.noOfReturnsBtl,
			        		"noOfDays":value.received,
			        };
				   Brands.push(input);
				   cases=cases+value.caseQty;
				   brandname=value.brandName;
				   bgcolor=value.salePrimaryKey;
				   category=value.category;
				   categoryOrder=value.categoryOrder;
				   inHouse+=value.cummulativePrice;
				   pending=value.saleId;
				   if(((value.received) <= 1))
					   secondFontColor = 0;
    		     }
    		   });
    		   var temp =0;
    		   if((pending-cases) > 0)
    			   temp = pending-cases;
    			
    		   var  inputparent = {
   	   	        		"brandNo":brandNoarr[j],
   	   	        		"brandname":brandname,
   	   	        		"cases":cases,
   	   	        		"inHouse":Math.round(inHouse),
   	   	        		"pending":temp,
   	   	        		"secondFontColor":secondFontColor,
   	   	        		"Brands":Brands
    		       };
    		   inputjson.push(inputparent);
    		   sumOfCase=sumOfCase+cases;
    		   sumOvPending+=temp;
    		   sumOfStock+=inHouse;
    		   if(secondFontColor <=1)
    			   firstFontColor = 0;
    	   }
    	   var tempSec = 0;
    	   if(sumOvPending > 0)
    		   tempSec = sumOvPending;
    	   
    	   var  inputsuperparent = {
	   	        		"category":category,
	   	        	    "bgcolor":bgcolor,
	   	        	    "sumOfCase":sumOfCase,
	   	        	    "categoryOrder":categoryOrder,
	   	        	    "firstFontColor":firstFontColor,
	   	        	    "sumOvPending":tempSec,
	   	        	    "sumOfStock":Math.round(sumOfStock),
	   	        		"inputjson":inputjson
		       };
    	   categorysuperjson.push(inputsuperparent);
	   }
	   $scope.stockCastegorydata = categorysuperjson;
    	   
		  }, function myError(response) {
			  
		  });
		
	 }
	$scope.greaterThan = function(prop, val){
	    return function(item){
	      return item[prop] > val;
	    }
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
myApp.filter("totalCase", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
             s += alldetails.caseQty;
        });
        return Math.ceil(s);
    };
})
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
