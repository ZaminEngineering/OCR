var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {
	$("#wait").css("display", "block");
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var saleDatesUrl = url+"mobileView/stockLiftingWithDiscountReport";
	$http({
	    method : "GET",
	    url : saleDatesUrl
	  }).then(function mySuccess(response) {
		  //console.log(JSON.stringify(response.data));
		 $scope.discountData = response.data;
		 $("#wait").css("display", "none");
	  }, function myError(response) {
		  $("#wait").css("display", "none");
	  });
	$scope.openListDisconts = function(discountasCompanyBeen,date,companyId,realDate,discAmt,rentals) {
		 $scope.date = date;
		 $scope.discAmt = discAmt;
		 $scope.rentalsAmt = rentals;
		// $scope.discountBeen = discountBeen;
		 $scope.discountasCompanyBeen = discountasCompanyBeen;
		 var myUrl = window.location.href;
			var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
			var Url = url+"mobileView/stockLiftingWithDiscountReportWithBrandDetails?date="+realDate+"&companyId="+companyId;
			$http({
			    method : "GET",
			    url : Url
			  }).then(function mySuccess(response) {
				  console.log(JSON.stringify(response.data));
				  var brandNoarr = [];
				   $.each(response.data, function(index, value){
				   	if(brandNoarr.indexOf(value.invoiceId) === -1){
				   		brandNoarr.push(value.invoiceId);
				   	}
				   });
				   var inputjson = [];
				   for (var i = 0; i < brandNoarr.length; i++) {
					   var Brands= [];
					   var totalCaseQty=0,totalDiscount=0,order=0;
					   var productName="";
					   $.each(response.data, function(index, value){
						   if(brandNoarr[i] == value.invoiceId){
							   var input = {
						        		"brandName":value.brandName,
						        		"brandNo":value.brandNo,
						        		"caseQty":value.caseQty,
						        		"discountAmt":value.unitPrice,
						        		"totalDisc":value.totalPrice
						        };
							   Brands.push(input);
							   totalCaseQty += value.caseQty;
							   totalDiscount += value.totalPrice;
							   productName = value.productType;
							   order = value.companyOrder;
						   }
						   
			    	    });
					   var  inputparent = {
				   	        		"productName":productName,
				   	        		"totalCaseQty":totalCaseQty,
				   	        		"totalDiscount":totalDiscount,
				   	        		"order":order,
				   	        		"Brands":Brands
					       };
			              inputjson.push(inputparent);
					   
				   }
				   //console.log(JSON.stringify(inputjson));
				   $scope.inputjson = inputjson;
			  }, function myError(response) {
			  });
		};
	$scope.greaterThan = function(prop, val){
	    return function(item){
	      return item[prop] > val;
	    }
	}
	$scope.openChekImg = function(image,imageName) {
		 $scope.image = image;
		 $scope.imageName = imageName;
		
		};
		
		$scope.greaterThanZero = function(prop1,prop2,prop3, val){
		    return function(item){
		      return (item[prop1]+item[prop2]+item[prop3]) > val;
		    }
		}
});
myApp.filter("sumOfDiscountAmt", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(discountBeen, i) {
             s += discountBeen.totalDiscountAmt;
        });
        return Math.ceil(s);
    };
})
myApp.filter("totalArrearsAmount", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(discountData, i) {
             s += discountData.duesAmt;
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
