var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	
var myUrl = window.location.href;
var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
var productListUrl = url+"getTotalDiscountDate.json";
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
      buildDiscountIntent(startDate);
      $("#startDate").val(startDate);
		
  }, function myError(response) {
    //alert(response);
  });



function getTimeStamp(enableDays){
	$("#startDate").datepicker({
		  dateFormat: 'yy-mm-dd',  beforeShowDay: enableAllTheseDays,
		  numberOfMonths: 1,
		  });
	    function enableAllTheseDays(date) {
	        var sdate = $.datepicker.formatDate( 'yy-mm-dd', date)
	        if($.inArray(sdate, enableDays) != -1) {
	            return [true];
	        }
	        return [false];
	    }
}
$scope.getResults = function (startDate,endDate){
	var startDate = $("#startDate").val();
	 if(validateCalendarField()==false){return false;}
	 buildDiscountIntent(startDate);
	 
}
function validateCalendarField(){
	var startDate = $("#startDate").val();
	if(startDate == ""){
		alert("Please fill Start Date.");
		return false;
	}
	return true;
}

function  buildDiscountIntent(startDate){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var callingUrl = url+"getbuildDiscountIntentData.json?startDate="+startDate;
	$http({
	    method : "GET",
	    url : callingUrl
	  }).then(function mySuccess(response) {
		   //console.log(JSON.stringify(response.data));
		  var brandNumber = [];
		  $.each(response.data,function(index, value){
   		   if(brandNumber.indexOf(value.brandNo) === -1){
   			  brandNumber.push(value.brandNo);
	    	   	}
   		   });
		  var inputjson = [];
   	   for (var i = 0; i < brandNumber.length; i++) {
   		   var Brands= [];
   		   var company="";
   		   var category="";
   		   var brandname="";
   		   var totalPrice=0;
   		   var bgcolor="";
   		   var totalcases=0;
   		   var companyOrder=0;
                  $.each(response.data, function(index, value){
   			   if(brandNumber[i] == value.brandNo){
   				   var input = {
   			        		"caseRate":value.caseRate,
   			        		"noOfCases":value.noOfCases,
   			        		"cashBackOnPerCase":value.cashBackOnPerPrice,
   			        		"priceToPurches":value.priceToPurches,
   			        		"cashBackOnOrder":value.cashBackOnOrder,
   			        		"profitPercentageDiscount":value.profitPercentageDiscount,
   			        		"l2":value.l2,
   			        		"l1":value.l1,
   			        		"q":value.q,
   			        		"p":value.p,
   			        		"n":value.n,
   			        		"d":value.d,
   			        		"c":value.c,
   			        		"x":value.x,
   			        		"g":value.g,
   			        		"estimateDays":value.estimateDays
   			        };
   				   Brands.push(input);
   				   company=value.company;
   				   category=value.category;
   				   brandname=value.brandName;
   				   bgcolor=value.color;
   				   companyOrder=value.orderBy;
				   }
   			   
	    	    });
                  var  inputparent = {
  	   	        		"brandNo":brandNumber[i],
  	   	        		"category":category,
  	   	        		"company":company,
  	   	        		"companyOrder":companyOrder,
  	   	        		"brandname":brandname,
  	   	        		"totalPrice":totalPrice,
  	   	        		"totalcases":totalcases,
  	   	        		"bgcolor":bgcolor,
  	   	        		"Brands":Brands
   		       };
                  inputjson.push(inputparent);
   		   
   	   }
     	$scope.alldetails = inputjson;
	   $scope.categories = inputjson;
		  
		  
		  
	    	    	   
	    	  
	  }, function myError(response) {
		    //alert(response);

});
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
