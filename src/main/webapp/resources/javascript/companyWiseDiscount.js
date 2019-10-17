var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {
	    $( "#transactionDate" ).datepicker({dateFormat: 'yy-mm-dd'});
        $('input.monthpicker').monthpicker({changeYear:true,dateFormat: "yy-mm-01" });
	  
        var myUrl = window.location.href;
    	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
    	var productListUrl = url+"getCompanyList.json";
    	$http({
    	    method : "GET",
    	    url : productListUrl
    	  }).then(function mySuccess(response) {
    		  $scope.companyData = response.data;
       	        var options="<option data-hidden=\"true\">Choose Company</option>";
    		     $.each(response.data, function (index, value) {
    		   	  options=options+"<option value=\""+value.id+"\">"+value.name+"</option>";
    		     });
    		     $("#listdataSec").html(options);
    		     $(".selectpicker").selectpicker('refresh');
    	  }, function myError(response) {
    	    //alert(response);
    	  });
    	
    	$(".fetchExistingExpenses").click(function(){
    		 var date =	$("#monthlyDate").val();
    		 var company = $scope.companyId;
    	   if(date!="" && company!="" && company != undefined){
    		   
    		    var myUrl = window.location.href;
    	    	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
    	    	var transactionUrl = url+"getDiscountCompanyWiseForAllMonth?date="+date+"&company="+company;
    	    	$http({
    	    	    method : "GET",
    	    	    url : transactionUrl
    	    	  }).then(function mySuccess(response) {
    	    		// console.log(JSON.stringify(response.data));
    	    		  $scope.transactionData = response.data;
    	    	  }, function myError(response) {
    	    	  });
    	    	
     	    	var receivedUrl = url+"getDiscountCompanyWiseForAllMonthWithReceived?company="+company;
     	    	$http({
     	    	    method : "GET",
     	    	    url : receivedUrl
     	    	  }).then(function mySuccess(response) {
     	    		 console.log(JSON.stringify(response.data));
     	    		  $scope.receivedData = response.data;
     	    	  }, function myError(response) {
     	    	  });
     	    	
     	    	var rentalUrl = url+"getUpToMonthRental?date="+date+"&company="+company;
     	    	$http({
     	    	    method : "GET",
     	    	    url : rentalUrl
     	    	  }).then(function mySuccess(response) {
     	    		 //console.log(JSON.stringify(response.data));
     	    		 $scope.rentalAmt = response.data;
     	    	  }, function myError(response) {
     	    	  });
    			   
    	   }else{
    		   alert("Please Select Month and Company");
    	   }
    	 });	
    	
    	$scope.greaterThan = function(prop, val){
    	    return function(item){
    	      return item[prop] > val;
    	    }
    	}
    	$scope.getCompanyName = function() {
  		  var companyid = $scope.companyId;
  		//console.log(JSON.stringify($scope.companyData));
  		$.each($scope.companyData, function (index, value) {
  			if($scope.companyId == value.id)
  			$scope.companyName = value.name;
		     });
  		};
});
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
myApp.filter("adjCheque", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(receivedData, i) {
             s += receivedData.adjustmentCheque;
        });
        return Math.ceil(s);
    };
})
myApp.filter("totalChequeAmount", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(receivedData, i) {
             s += receivedData.chequeAmount;
        });
        return Math.ceil(s);
    };
})
myApp.filter("totalDiscountAmt", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(transactionData, i) {
             s += transactionData.totalDiscount;
        });
        return Math.ceil(s);
    };
})
myApp.filter("totalRentals", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(transactionData, i) {
             s += transactionData.rentals;
        });
        return Math.ceil(s);
    };
})