var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
$(function(data) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getTotalSaleDate.json";
	$.ajax ({
		url: productListUrl,
	       type: "POST",
	       success: function(data){
	    // alert(JSON.stringify(data));
	      var startDate="";
	      var enableDays =[];
	      $.each(data, function (index, value) {
	    	  enableDays.push(data[index].date);
	    	  startDate=data[index].date;
	      });
	      getTimeStamp(enableDays);
	      BuildSaleDayWiseReport(startDate);
	      getSaleCommentData(startDate);
	      $("#startDate").val(startDate);
	    }
	});
});
function getTimeStamp(enableDays){
	    function enableAllTheseDays(date) {
	        var sdate = $.datepicker.formatDate( 'yy-mm-dd', date)
	        if($.inArray(sdate, enableDays) != -1) {
	            return [true];
	        }
	        return [false];
	    }
	    $('#startDate').datepicker({dateFormat: 'yy-mm-dd', beforeShowDay: enableAllTheseDays});
}
$scope.getResults = function(startDate){
	var date = $("#startDate").val();
	 if(validateCalendarField()==false){return false;}
	 BuildSaleDayWiseReport(date);
	 
}
function validateCalendarField(){
	var startDate = $("#startDate").val();
	if(startDate == ""){
		alert("Please fill Date.");
		return false;
	}
	return true;
}
function  BuildSaleDayWiseReport(startDate){
	 $(".totalSaleItmes").hide();
	//var startDate=$("#startDate").val();
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var callingUrl = url+"getSaleDayWiseReports.json?startDate="+startDate;
	$http({
	    method : "GET",
	    url : callingUrl
	  }).then(function mySuccess(response) {
		  //console.log(JSON.stringify(response.data));
		  $scope.dayWiseSale = response.data.saleBean;
		  $scope.cardAmount = response.data.cardAmount;
		  $scope.cashAmount = response.data.cashAmount;
		  $scope.expenseAmount = response.data.expenseAmount;
	  }, function myError(response) {
		    //alert(response);
      });
 	//getSaleCommentData(startDate);
}

function includeZeroSaleOrNot(){
	var catOrComp = $('#includeZeroSaleOrNot').prop('checked');
   if(catOrComp === true){
	   $(".onlySaleItmes").hide();
	   $(".totalSaleItmes").show();
   }else{
	  
	   $(".totalSaleItmes").hide();
	   $(".onlySaleItmes").show();
   }
	   
}
});
app.filter("totalAmount", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(dayWiseSale, i) {
            s += dayWiseSale.totalPrice;
        });
        return Math.ceil(s);
    };
})