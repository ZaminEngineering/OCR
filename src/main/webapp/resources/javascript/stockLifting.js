var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	
var myUrl = window.location.href;
var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
var productListUrl = url+"getTotalInvoiceDateAsPerSheet.json";
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
$scope.greaterThan = function(prop, val){
    return function(item){
      return item[prop] > val;
    }
}
function  buildstockLifting(startDate,endDate){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var callingUrl = url+"getStockLifting.json?startDate="+startDate+"&endDate="+endDate;
	$http({
	    method : "GET",
	    url : callingUrl
	  }).then(function mySuccess(response) {
		   // console.log(JSON.stringify(response.data));
	    	   var brandNumber = [];
	    	   var companybrand = [];
	    	   var pushValue="";
	    	   var sumoftotalamount=0,sumoftotalcases=0,count=0,totalInvoiceAmount=0;
	 	      var rowclass='';
	 	     var sno=1;
	    	   $.each(response.data,function(index, value){
	    		   if(brandNumber.indexOf(value.brandNo) === -1){
	    			   brandNumber.push(value.brandNo);
		    	   	}
	    		   });
	    	   var inputjson = [];
	    	   for (var i = 0; i < brandNumber.length; i++) {
	    		   var Brands= [];
	    		   var company="",bgcolor="",category="",brandname="",categoryColor="";
	    		   var totalPrice=0,companyOrder=0,totalcases=0,categoryOrder=0;
                       $.each(response.data, function(index, value){
	    			   if(brandNumber[i] == value.brandNo){
	    				   var input = {
	    			        		"packQty":value.packQty,
	    			        		"qty":value.quantity,
	    			        		"cases":value.caseQty,
	    			        		"unitPrice":value.unitPrice,
	    			        		"BtlMrp":value.bottleSaleMrp,
	    			        		"date":value.saleDate,
	    			        		"totalAmount":Math.round(value.totalPrice),
	    			        		"qtyBottels":value.qtyBottels,
	    			        		"categoryOrder":value.categoryOrder,
	    			        		"companyOrder":value.companyOrder
	    			        };
	    				   Brands.push(input);
	    				   company=value.company;
	    				   category=value.category;
	    				   brandname=value.brandName;
	    				   totalPrice=totalPrice+value.totalPrice;
	    				   totalcases=totalcases+value.currentMonthSold;
	    				   bgcolor=value.color;
	    				   companyOrder=value.companyOrder;
	    				   categoryOrder = value.categoryOrder;
	    				   categoryColor = value.salePrimaryKey;
    				   }
	    			   
		    	    });
                       var  inputparent = {
       	   	        		"brandNo":brandNumber[i],
       	   	        		"category":category,
       	   	        		"company":company,
       	   	        		"companyOrder":companyOrder,
       	   	        		"categoryOrder":categoryOrder,
       	   	        		"brandname":brandname,
       	   	        		"totalPrice":Math.round(totalPrice),
       	   	        		"totalcases":Math.round(totalcases),
       	   	        		"bgcolor":bgcolor,
       	   	        		"categoryColor":categoryColor,
       	   	        		"Brands":Brands
	    		       };
                       inputjson.push(inputparent);
                       totalInvoiceAmount+=totalPrice;
	    	   }
	    	   $scope.alldetails = inputjson;
	    	   $scope.categories = inputjson;
	    	   $("#invoiceTotal").html("<span>"+(response.data[0].cummulativePrice).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span>");
	    	   $("#mrpRoundingOffTotal").html("<span>"+(response.data[0].target).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span>");
	   	     $("#netInvoiceValue").html("<span>"+(totalInvoiceAmount+response.data[0].target).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span>");
	   	     $("#tcs").html("<span>"+(response.data[0].lastMonthSold).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span>");
	   	     $("#turnOverTax").html("<span>"+(response.data[0].singleBottelPrice).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span>");
	  		
	    	   // console.log(JSON.stringify(inputjson));
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

/*var prevIndex = "";

$scope.sortBy = function()
{
  var currIndex = $("#sortById")[0].selectedIndex;
    if( currIndex > 0 )
    {
        if( prevIndex != currIndex )
        {
            $scope.sortKey = $( "#sortById option:selected" ).val();
	          $scope.reverse = !$scope.reverse;
            prevIndex = currIndex;
        }
        else
        {
            prevIndex = "";
        }
    }
}*/
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
            s += alldetails.totalPrice;
        });
        return Math.ceil(s);
    };
})
app.filter("sumCases", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
             s += alldetails.totalcases;
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

