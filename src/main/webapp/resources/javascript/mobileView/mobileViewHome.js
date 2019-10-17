var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"mobileView/InHouseStockAmount";
    $http({
    method : "GET",
    url : productListUrl
  }).then(function mySuccess(response) {
	 
	  $scope.inHouseStockAmount = response.data;
	 // console.log(JSON.stringify(response.data));
		
  }, function myError(response) {
    
  });
});
myApp.filter('INR', function () {        
    return function (input) {
        if (! isNaN(input)) {
        	 var currencySymbol = '';
            var result = Math.ceil(input).toString().split('.');

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