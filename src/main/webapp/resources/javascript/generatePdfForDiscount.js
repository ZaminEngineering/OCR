var myApp = angular.module('myApp', ["checklist-model"]);
myApp.controller('Ctrl1', function($scope, $http) {
	/*$('#startMonth').monthpicker({changeYear:true,dateFormat: "yy-mm-01" });
	//$('#startMonth').val($.datepicker.formatDate('yy-mm-01', new Date()));
	$('#endMonth').monthpicker({changeYear:true,dateFormat: "yy-mm-01" });
	$('#endMonth').val($.datepicker.formatDate('yy-mm-01', new Date()));
	var tempDate = new Date()
	var sDate = tempDate.getFullYear()+"-"+("0" + (tempDate.getMonth())).slice(-2)+"-"+"01";
	$('#startMonth').val(sDate);
	*/
	$('input.monthpicker').monthpicker({changeYear:true,dateFormat: "yy-mm-01" });
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getCompanyList.json";
	$http({
	    method : "GET",
	    url : productListUrl
	  }).then(function mySuccess(response) {
		 // console.log(JSON.stringify(response.data));
		 $scope.companyData = response.data;
		  $.each(response.data, function (index, value) {
    	      $('#listdataSec').append( '<option  value="'+value.id+'">'+value.name+'</option>' );
	  });
	  }, function myError(response) {
	    //alert(response);
	  });
	
	$scope.buildDiscountWithPdf = function (){
		var startMonth = $("#startMonth").val();
		var endMonth =	$("#endMonth").val();
		 var company = $scope.companyId;
		 if(startMonth !="" && endMonth !="" && company !="" && company != undefined){
			 var myUrl = window.location.href;
 	    	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
 	    	var transactionUrl = url+"mobileView/getDiscountForSelectedMonth?startMonth="+startMonth+"&endMonth="+endMonth+"&company="+company;
 	    	$http({
 	    	    method : "GET",
 	    	    url : transactionUrl
 	    	  }).then(function mySuccess(response) {
 	    		// console.log(JSON.stringify(response.data));
 	    		 $scope.transactionData = response.data;
 	    	  }, function myError(response) {
 	    	  });
			 
 	    	var receivedUrl = url+"mobileView/getDiscountChecksForSelectedMonths?startMonth="+startMonth+"&endMonth="+endMonth+"&company="+company;
 	    	$http({
 	    	    method : "GET",
 	    	    url : receivedUrl
 	    	  }).then(function mySuccess(response) {
 	    		 //console.log(JSON.stringify(response.data));
 	    		  $scope.receivedData = response.data;
 	    	  }, function myError(response) {
 	    	  });
 	    	var rentalUrl = url+"mobileView/getRentalForSelected?startMonth="+startMonth+"&endMonth="+endMonth+"&company="+company;
 	    	$http({
 	    	    method : "GET",
 	    	    url : rentalUrl
 	    	  }).then(function mySuccess(response) {
 	    		// console.log(JSON.stringify(response.data));
 	    		 $scope.rentalAmt = response.data;
 	    	  }, function myError(response) {
 	    	  });
 	    	var previousArrearsUrl = url+"mobileView/getArrearsForPreviousDays?startMonth="+startMonth+"&company="+company;
 	    	$http({
 	    	    method : "GET",
 	    	    url : previousArrearsUrl
 	    	  }).then(function mySuccess(response) {
 	    		 console.log(JSON.stringify(response.data));
 	    		 $scope.previousArrears = response.data;
 	    	  }, function myError(response) {
 	    	  });
 	    	var companyUrl = url+"mobileView/getCompanyWithEnterPrice?company="+company;
	    	$http({
	    	    method : "GET",
	    	    url : companyUrl
	    	  }).then(function mySuccess(response) {
	    		  console.log(JSON.stringify(response.data));
	    		  $scope.companyName = response.data.label;
	    		  $scope.firstDate = startMonth;
	    		  $scope.secondDate = endMonth;
	    		  $scope.enterprice = "  ("+response.data.color+")";
	    		  
	    	  }, function myError(response) {
	    	  });
		 }else{
			 alert("Please Select Company.")
		 }
	
	}
	
	$scope.greaterThan = function(prop, val){
	    return function(item){
	      return item[prop] > val;
	    }
	}
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
