var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {
	 $( "#indentDate" ).datepicker({dateFormat: 'yy-mm-dd'});
	 $('#indentDate').datepicker('setDate', new Date())
	 $('input.monthpicker').monthpicker({changeYear:true,dateFormat: "yy-mm-01" });
	 var msg = $("#popupmsg").val();
		if(msg != ""){
			alert(msg);
		}
		 $('#popupmsg').val("");
		 
		 var myUrl = window.location.href;
			var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
			var productListUrl =  url+"getIndentListBasedOnMonth";
			$http({
			    method : "GET",
			    url : productListUrl
			  }).then(function mySuccess(response) {
				 console.log(JSON.stringify(response.data));
				  $scope.indentList = response.data;
			  }, function myError(response) {
			  });
			
		 function buildIndentList(indentMonthSelect){
			 
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