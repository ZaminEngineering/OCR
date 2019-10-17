var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {
	 $('.newMonthlyExpensesForm').hide();
	 var msg = $("#popupmsg").val();
		if(msg != ""){
			alert(msg);
		}
		 $('#popupmsg').val("");
	    $( "#transactionDate" ).datepicker({dateFormat: 'yy-mm-dd'});
        $('input.monthpicker').monthpicker({changeYear:true,dateFormat: "yy-mm-01" });
	  
        var myUrl = window.location.href;
    	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
    	var productListUrl = url+"getCompanyList.json";
    	$http({
    	    method : "GET",
    	    url : productListUrl
    	  }).then(function mySuccess(response) {
    		  $.each(response.data, function (index, value) {
    			  $('#listdataSec').append( '<option  value="'+value.id+'">'+value.name+'</option>' );
    		     });
    		
       	       /* var options="<option data-hidden=\"true\">Choose Company</option>";
    		     $.each(response.data, function (index, value) {
    		   	  options=options+"<option value=\""+value.id+"\">"+value.name+"</option>";
    		     });
    		     $("#listdataSec").html(options);
    		     $(".selectpicker").selectpicker('refresh');*/
    	  }, function myError(response) {
    	    //alert(response);
    	  });
    	
    	$(".fetchExistingExpenses").click(function(){
    		 var date =	$("#monthlyDate").val();
    		 var company = $scope.companyId;
    	   if(date!="" && company!="" && company != undefined){
    		   $('.newMonthlyExpensesForm').show();
    		   
    		    var myUrl = window.location.href;
    	    	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
    	    	var transactionUrl = url+"getDiscountTransactionDetails?date="+date+"&company="+company;
    	    	$http({
    	    	    method : "GET",
    	    	    url : transactionUrl
    	    	  }).then(function mySuccess(response) {
    	    		  console.log(JSON.stringify(response.data));
    	    		  $scope.transactionData = response.data;
    	    		  $scope.monthDate = date;
    	    	  }, function myError(response) {
    	    	  });
    			   
    	   }else{
    		   alert("Please Select Month and Company");
    	   }
    	 });	
    	
    	$scope.openListDisconts = function(indexNo,id,companyId,month,image) {
    		if (confirm("Are you sure you want to delete ?"))
    		  {
	    		var myUrl = window.location.href;
		    	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		    	var transactionUrl = url+"deleteDiscountTransactionDetails?id="+id+"&companyId="+companyId+"&month="+month+"&image="+image;
		    	$http({
		    	    method : "GET",
		    	    url : transactionUrl
		    	  }).then(function mySuccess(response) {
		    		  
		    	  }, function myError(response) {
		    	  });
		    	$('#delete'+indexNo).remove();
    		  }
      };
    	
    	
    	
    	
    	
    	
    	
    	
    	
    	
});
