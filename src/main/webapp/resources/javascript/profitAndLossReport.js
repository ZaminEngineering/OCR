var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getTotalSaleDate.json";
	$http({
	    method : "POST",
	    url : productListUrl
	  }).then(function mySuccess(response) {
		// console.log(JSON.stringify(response.data));
		  var startDate="";
	      var enableDays =[];
	      enableDays.push("2017-10-18");
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
	function  buildstockLifting(startDate,endDate){
		var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		var callingUrl = url+"getProfitAndLossData?firstDate="+startDate+"&lastDate="+endDate;
		$http({
		    method : "GET",
		    url : callingUrl
		  }).then(function mySuccess(response) {
			   console.log(JSON.stringify(response.data));
			  var totalAdministration = 0,totalRupees=0,profitForthePeriod=0,lossForthePeriod=0,totalDebitRupees=0,totalCreditRupees=0;
			  $.each(response.data.administrationExpensesBean, function (index, value) {
				  totalAdministration +=value.value;
		      });
			  totalAdministration += ((response.data.turnOverTax + response.data.breackage + response.data.licenseFee));
			  totalRupees += (response.data.sales + response.data.closingStock);
			  profitForthePeriod += (totalAdministration + (response.data.mrpRoundOff + response.data.purchase + response.data.openingStock));
			  totalDebitRupees = (response.data.openingStock + response.data.mrpRoundOff + response.data.purchase + totalAdministration);
				  if((totalRupees - profitForthePeriod) > 0){
					  profitForthePeriod = (totalRupees - profitForthePeriod);
					  lossForthePeriod = 0;
				  }
				  else{
					  lossForthePeriod = (profitForthePeriod - totalRupees);
					  profitForthePeriod = 0;
				  }
				  
			  $scope.profitAndLoss = response.data;
			  $scope.totalAdministration = totalAdministration;
			  $scope.profitForthePeriod = profitForthePeriod;
			  $scope.lossForthePeriod = lossForthePeriod;
			  $scope.totalDebitRupees = totalDebitRupees +profitForthePeriod;
			  $scope.totalCreditRupees = totalRupees + lossForthePeriod;
		  }, function myError(response) {
			  		    //alert(response);
			  
		  });
		
		
	}
	
});
app.filter('INR', function () {        
    return function (input) {
        if (! isNaN(input)) {
           // var currencySymbol = '₹';
        	 var currencySymbol = '';
            //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
            var result = input.toFixed(2).toString().split('.');

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
