var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getTotalSaleDate.json";
	$http({
	    method : "POST",
	    url : productListUrl
	  }).then(function mySuccess(response) {
		// console.log(JSON.stringify(response.data));
		  var startDate="";
	      var enableDays =[];
	      $.each(response.data, function (index, value) {
	    	  //alert(data[index].date);
	    	  enableDays.push(response.data[index].date);
	    	  startDate=response.data[index].date;
	      });
	      getTimeStamp(enableDays);
	      BuildSaleDayWiseReport(startDate);
	      $("#startDate").val(startDate);
			
	  }, function myError(response) {
	    //alert(response);
	  });
	function getTimeStamp(enableDays){
		 function enableAllTheseDays(date) {
		        var sdate = $.datepicker.formatDate( 'yy-mm-dd', date)
		        if($.inArray(sdate, enableDays) != -1) {
		            return [true];
		        }
		        return [false];
		    }
		    $('#startDate').datepicker({dateFormat: 'yy-mm-dd', beforeShowDay: enableAllTheseDays});
	}
	function  BuildSaleDayWiseReport(startDate){
		$(".totalSaleItmes").hide();
		var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		var callingUrl = url+"getInHouseStockValue.json?startDate="+startDate;
		$http({
		    method : "GET",
		    url : callingUrl
		  }).then(function mySuccess(response) {
		 	     //console.log(JSON.stringify(response.data));
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
	    		  var companyOrder=0,closing=0,totalcost=0,totalSaleAmount=0,categoryOrder=0,exactInvoiceValue=0,firstFontColor=5;
	    		  var flag=true,redAlert=false;
	    		  $.each(response.data, function(index, value){
	    			   if(brandNoarr[i] == value.brandNo){
	    				   var input = {
	    			        		"brandName":value.brandName,
	    			        		"brandNo":value.brandNo,
	    			        		"quantity":value.quantity,
	    			        		"packQty":value.packQty,
	    			        		"packType":value.packType,
	    			        		"totalPrice":value.totalPrice,
	    			        		"category":value.category,
	    			        		"company":value.company,
	    			        		"case":value.caseQty,
	    			        		"bottle":value.qtyBottels,
	    			        		"color":value.color,
	    			        		"companyOrder":value.companyOrder,
	    			        		"brandNoPackQty":value.brandNoPackQty,
	    			        		"saleAmount":value.cummulativePrice,
	    			        		"categoryOrder":value.categoryOrder,
	    			        		"exactInvoiceValue":value.singleBottelPrice,
	    			        		"days":value.target.toFixed(1)
	    			        };
	    				   Brands.push(input);
	    				   exactInvoiceValue += value.singleBottelPrice;
	    				   company=value.company;
	    				   category=value.category;
	    				   brandname=value.brandName;
	    				   bgcolor=value.color;
	    				   companyOrder=value.companyOrder;
	    				   categoryOrder = value.categoryOrder;
	    				   totalSaleAmount+=value.cummulativePrice;
	    				   closing=closing+(value.closing/value.packQty);
	    				   totalcost=totalcost+value.totalPrice;
	    				   categoryColor = value.salePrimaryKey;
	    				   if(((value.target) <= 1)) /// for days calc
	    					   firstFontColor = 0;
	    				   if(value.totalPrice == 0 || value.totalPrice < 0)
	    					   flag=false;
	    				   if(value.target > 30)
	    					   redAlert = true;
   				   }
		    	    });
	    		  var  inputparent = {
     	   	        		"brandNo":brandNoarr[i],
     	   	        		"category":category,
     	   	        		"company":company,
     	   	        		"companyOrder":companyOrder,
     	   	        		"categoryOrder":categoryOrder,
     	   	        		"brandname":brandname,
     	   	        		"bgcolor":bgcolor,
     	   	        		"closing":Math.round(closing),
     	   	        		"totalcost":Math.round(totalcost),
     	   	        		"totalSaleAmount":totalSaleAmount,
     	   	        		"flag": flag,
     	   	        		"redAlert": redAlert,
     	   	        	    "firstFontColor":firstFontColor,
     	   	        		"categoryColor":categoryColor,
     	   	        		"exactInvoiceValue":exactInvoiceValue,
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
	$scope.getResults = function (startDate){
		var startDate = $("#startDate").val();
		 if(validateCalendarField()==false){return false;}
		 BuildSaleDayWiseReport(startDate);
		 
	}
	
	
	function validateCalendarField(){
		var startDate = $("#startDate").val();
		if(startDate == ""){
			alert("Please fill Start Date.");
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
	$scope.equalsTo = function(prop, val){
	    return function(item){
	      return item[prop] == val;
	    }
	}
	$scope.equalsToZero = function(prop){
	    return function(item){
	      return item[prop] == false;
	    }
	}
	
	$scope.sortKey = ['companyOrder','brandname'];
	$scope.sort = function(propName1,propName2){
		  //alert($scope.sortKey);
	      $scope.sortKey = [propName1,propName2];
	      $scope.reverse = !$scope.reverse;
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
app.filter("totalAvailableStock", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.closing;
        });
        return Math.ceil(s);
    };
})
app.filter("totalAmount", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.exactInvoiceValue;
        });
        return Math.ceil(s);
    };
})
app.filter("totalMrpAmount", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.totalSaleAmount;
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
