var myApp = angular.module('myApp', ["checklist-model"]);

myApp.controller('Ctrl1', function($scope, $http) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getTotalSaleDate.json";
	$http({
	    method : "POST",
	    url : productListUrl
	  }).then(function mySuccess(response) {
		  var startDate="";
	      var enableDays =[];
	      enableDays.push("2017-10-18");
	      $.each(response.data, function (index, value) {
	    	  //alert(data[index].date);
	    	  enableDays.push(response.data[index].date);
	    	  startDate=response.data[index].date;
	      });
	      getTimeStamp(enableDays);
	      $("#startDate").val(startDate);
	  	  $("#endDate").val(startDate);
	  	getExpenseData(startDate,startDate);
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
		$.each($("#listdata option:selected"), function(){
			expenseId.push($(this).val());
		});
		 if(validateCalendarField()==false){return false;}
		 getExpenseData(startDate,endDate);
		 
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
	$scope.user = {
			expensesData: []
	      };
	      $scope.checkAll = function() {
	        $scope.user.expensesData = angular.copy($scope.expensesData);
	      };
	      $scope.uncheckAll = function() {
	        $scope.user.expensesData = [];
	      };
	function  getExpenseData(startDate,endDate){
		var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		//var callingUrl = url+"getExpenseDataByCategory?startDate="+startDate+"&endDate="+endDate+"&expenseId="+expenseId;
		var callingUrl = url+"getExpenseDataRangeWise?startDate="+startDate+"&endDate="+endDate;
		$http({
		    method : "GET",
		    url : callingUrl
		  }).then(function mySuccess(response) {
			  $scope.expensesData = response.data;
			  $scope.user.expensesData = angular.copy($scope.expensesData);
		  }, function myError(response) {
          });
		
	}	
	$scope.greaterThan = function(prop, val){
	    return function(item){
	      return item[prop] > val;
	    }
	}

});
myApp.filter("totalExpense", function() {
    return function(data, index) {
        var s = 0;
        
        angular.forEach(data, function(expensesData, i) {
             s += expensesData.total;
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
