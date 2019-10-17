var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var saleDatesUrl = url+"mobileView/getTotalSaleDates";
	$http({
	    method : "GET",
	    url : saleDatesUrl
	  }).then(function mySuccess(response) {
		//  console.log(JSON.stringify(response.data));
		  var startDate="";
	      var enableDays =[];
	      $.each(response.data, function (index, value) {
	    	  enableDays.push(response.data[index].date);
	    	  startDate=response.data[index].date;
	      });
	      $("#startDate").val(startDate);
	  	  $("#endDate").val(startDate);
	  	   getTimeStamp(enableDays);
	  	 getDayWiseBalanceSheet(startDate,startDate);
	  }, function myError(response) {
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
	function  getDayWiseBalanceSheet(startDate,endDate){
		var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		var Url = url+"mobileView/dayWiseBalanceSheet?sdate="+startDate+"&edate="+endDate;
		$http({
		    method : "GET",
		    url : Url
		  }).then(function mySuccess(response) {
			  $scope.balancesheet = response.data.balanceSheetBean;
			  var diff=0;
			  $.each(response.data.balanceSheetBean, function(index, value){
				  diff += value.retention;
	    	   });
			  $scope.diff = diff+(response.data.data.value);
		  }, function myError(response) {
		  });
	}
	$scope.getResults = function (startDate,endDate){
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		 if(validateCalendarField()==false){return false;}
		 getDayWiseBalanceSheet(startDate,endDate);
		 
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
	$scope.getExpenseData = function(masterId,date) {
		var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		var productListUrl = url+"mobileView/getDayWiseExpenseDetails?expenseMasterID="+masterId;
		$http({
		    method : "GET",
		    url : productListUrl
		  }).then(function mySuccess(response) {
			/* console.log(JSON.stringify(response.data));*/
			 $scope.expensesData = response.data;
			 console.log(JSON.stringify(response.data));
		  }, function myError(response) {
		  });
		}

});
myApp.filter('INR', function () {        
    return function (input) {
        if (! isNaN(input)) {
           // var currencySymbol = '₹';
        	 var currencySymbol = '';
            //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
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
myApp.filter("difference", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(balancesheet, i) {
             s += balancesheet.retention;
        });
        return Math.ceil(s);
    };
})