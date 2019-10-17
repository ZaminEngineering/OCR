var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope,$http) {
	var myUrl = "http://localhost:8081/OCR/";
	$scope.chooseDivShow=true;
	$scope.tableShow=false;
	$scope.progressBar=false;
	
	$scope.fileUpload = function(){
		
		$scope.tableShow=false;
		if($('#bannerImage')[0].files[0]==null){
	alert("Null request triggered...");
	
      }else{
    		//$scope.progressBar=true;
    	// alert("Request is Processing...");
      }
    var formData = new FormData();
    formData.append('bulkUploadFile', $('#bannerImage')[0].files[0]);
    var bulkUrl = myUrl+"fileUpload";
    
 
   
    $.ajax({
       url: bulkUrl,
       async : false,
       data: formData,
       contentType: false,
       processData: false,
       type: 'POST',
       success: function(data){
    	  $scope.status= data.status;
    	  alert(JSON.stringify($scope.status))
    	   console.log(JSON.stringify(data));
    	   $scope.tableShow=true;
    	   $scope.invoice=data;
    	   $scope.invoice1=$scope.invoice[0];
    	   $scope.invoice2=$scope.invoice[1];
    	   
       },
    error: function (request, status, error) {
        alert(request.responseText +" : "+request.status);
    }
    
    
   });
    
	/*$scope.progressBar=false;*/
    
}

	
	


});

	
