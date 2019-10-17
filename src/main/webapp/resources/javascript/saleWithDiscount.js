var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getTotalSaleDate.json";
	$http({
	    method : "POST",
	    url : productListUrl
	  }).then(function mySuccess(response) {
		  var startDate="";
	      var enableDays =[];
	      $.each(response.data, function (index, value) {
	    	  enableDays.push(response.data[index].date);
	    	  startDate=response.data[index].date;
	      });
	      getTimeStamp(enableDays);
	      buildstockLifting(startDate,startDate);
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
	function  buildstockLifting(startDate,endDate){
		var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		var callingUrl = url+"getSaleWithDiscount.json?startdate="+startDate+"&enddate="+endDate;
		$http({
		    method : "GET",
		    url : callingUrl
		  }).then(function mySuccess(response) {
			  console.log(JSON.stringify(response.data));
			  var brandNoarr = [];
			  $.each(response.data, function(index, value){
	    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
	    	   		brandNoarr.push(value.brandNo);
	    	   	}
	    	   });
			  var inputjson = [];
	    	   for (var i = 0; i < brandNoarr.length; i++) {
	    		   var Brands= [];
	    		   var company="",category="",brandname="",bgcolor="",categoryColor="";
	    		   var totalval=0,totalbtlsale=0,cases=0,companyOrder=0,discount=0,govtDiscount=0,totalDiscountVal=0,costPrice=0,categoryOrder=0;
	    		   $.each(response.data, function(index, value){
	    			   if(brandNoarr[i] == value.brandNo){
	    				   var caseVal = Math.trunc(value.totalSale/value.packQty);
	    				   var input = {
	    			        		"quantity":value.quantity,
	    			        		"totalPrice":value.totalPrice,
	    			        		"category":value.category,
	    			        		"company":value.company,
	    			        		"totalSale":value.totalSale,
	    			        		"saleInCase":caseVal,
	    			        		"btlVal":value.totalSale-(caseVal*value.packQty),
	    			        		"color":value.color,
	    			        		"companyOrder":value.companyOrder,
	    			        		"brandNoPackQty":value.brandNoPackQty,
	    			        		"discount":Math.round(value.discount),
	    			        		"govtDiscount":Math.round(value.totalPrice-value.govtDiscount),
	    			        		"totalDiscount":Math.round((value.totalPrice-value.govtDiscount)+value.discount),
	    			        		"discountMonth":value.discountMonth,
	    			        		"costPrice":Math.round(value.costPrice),
	    			        		"companyDiscInPercentage":((value.discount * 100)/value.costPrice).toFixed(1),
	    			        		"govtMarginInPercentage":(((value.totalPrice-value.govtDiscount) * 100)/value.costPrice).toFixed(1),
	    			        		"totalDiscountValInPer":((((value.totalPrice-value.govtDiscount)+value.discount) * 100)/value.costPrice).toFixed(1),
	    			        		"categoryOrder":value.categoryOrder
	    			        };
	    				   Brands.push(input);
	    				   company=value.company;
	    				   category=value.category;
	    				   brandname=value.brandName;
	    				   totalval=totalval+value.totalPrice;
	    				   totalbtlsale=totalbtlsale+value.totalSale;
	    				   cases+=value.totalSale/value.packQty;
	    				   bgcolor=value.color;
	    				   discount+=value.discount;
	    				   govtDiscount+=(value.totalPrice-value.govtDiscount);
	    				   totalDiscountVal+=((value.totalPrice-value.govtDiscount)+value.discount);
	    				   companyOrder=value.companyOrder;
	    				   costPrice+=value.costPrice;
	    				   categoryOrder = value.categoryOrder;
	    				   categoryColor = value.categoryColor;
	    				  
    				   }
	    			   
		    	    });
	    		   var  inputparent = {
      	   	        		"brandNo":brandNoarr[i],
      	   	        		"category":category,
      	   	        		"company":company,
      	   	        		"companyOrder":companyOrder,
      	   	        		"categoryOrder":categoryOrder,
      	   	        		"brandname":brandname,
      	   	        		"totalval":totalval,
      	   	        		"totalbtlsale":totalbtlsale,
      	   	        		"cases":Math.round(cases),
      	   	        		"bgcolor":bgcolor,
      	   	        		"discountAmt":Math.round(discount),
      	   	        		"govtDiscount":Math.round(govtDiscount),
      	   	        		"totalDiscountVal":Math.round(totalDiscountVal),
      	   	        		"costPrice":Math.round(costPrice),
      	   	        	    "companyDiscInPercentage":((discount * 100)/costPrice).toFixed(1),
		        		    "govtMarginInPercentage":((govtDiscount * 100)/costPrice).toFixed(1),
		        		    "companyDiscInPercentageExcat":((discount * 100)/costPrice),
		        		    "govtMarginInPercentageExcat":((govtDiscount * 100)/costPrice),
		        		    "totalDiscountValInPer":((totalDiscountVal * 100)/costPrice).toFixed(1),
		        		    "categoryColor":categoryColor,
      	   	        		"Brands":Brands
	    		       };
                      inputjson.push(inputparent);
	    	   }
	    	  // console.log(JSON.stringify(inputjson));
	    	   $scope.alldetails = inputjson;
	    	   $scope.categories = inputjson;
		  }, function myError(response) {
			  		    //alert(response);
			  
		  });
		
		
	}
	// Sort by
	$scope.sortKey = ['companyOrder','brandname'];
	$scope.sort = function(propName1,propName2){
		  //alert($scope.sortKey);
	      $scope.sortKey = [propName1,propName2];
	      $scope.reverse = !$scope.reverse;
	  }
	
	$scope.greaterThan = function(prop, val){
	    return function(item){
	      return item[prop] > val;
	    }
	}

});
app.filter("ttlSaleAmt", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.totalval;
        });
        return Math.ceil(s);
    };
})
app.filter("ttlDiscountAmt", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.discountAmt;
        });
        return Math.ceil(s);
    };
})
app.filter("ttlGovtDiscountAmt", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.govtDiscount;
        });
        return Math.ceil(s);
    };
})
app.filter("ttlGovtCompDiscountAmt", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.totalDiscountVal;
        });
        return Math.ceil(s);
    };
})
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
