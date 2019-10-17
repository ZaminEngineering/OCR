
    	
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
    	
    	
    	$scope.getCompanyName = function() {
  		  var companyid = $scope.companyId;
  		//console.log(JSON.stringify($scope.companyData));
  		$.each($scope.companyData, function (index, value) {
  			if($scope.companyId == value.id)
  			$scope.companyName = value.name;
		     });
  		};

