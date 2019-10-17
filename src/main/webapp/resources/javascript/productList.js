var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	$(".editProduct").hide();
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getProductList";
	$http({
	    method : "GET",
	    url : productListUrl
	  }).then(function mySuccess(response) {
		console.log(JSON.stringify(response.data));
			$scope.productList = response.data;
			$scope.categories = response.data;
	  }, function myError(response) {
		  
	  });
	var brandListUrl = url+"getDistinctBrandNameAndNo";
	$http({
	    method : "GET",
	    url : brandListUrl
	  }).then(function mySuccess(response) {
		//console.log(JSON.stringify(response.data));
			$scope.brandList = response.data;
			 var brand =new Array();
		      $.each(response.data, function (index, value) {
		    	  brand.push(value.brandName+" "+value.brandNo);
		      });
		      $("#brand").select2({
				  data: brand
				});
	  }, function myError(response) {
		  
	  });
	$scope.getResults = function(){
		var brandNo = $("#brand option:selected").text();
		var n = brandNo.split(" ");
	    var val = n[n.length - 1];
	    var brandListUrl = url+"editProductDetails?brandNo="+val;
		$http({
		    method : "GET",
		    url : brandListUrl
		  }).then(function mySuccess(response) {
			//console.log(JSON.stringify(response.data));
				$scope.singleBrandList = response.data;
		  }, function myError(response) {
			  
		  });
	  }
	 
	 
	 
	$scope.includeZeroSaleOrNot = function(){
		var catOrComp = $('#includeZeroSaleOrNot').prop('checked');
       if(catOrComp === true){
    	   $(".activeOrInActive").hide();
    	   $(".editProduct").show();
       }else{
    	  
    	   $(".editProduct").hide();
    	   $(".activeOrInActive").show();
       }
    	   
	}
	
	$scope.activeOrInActive = function(brandNoPackQty,bolVal){
		var activeVal = 0;
		if(bolVal == true)
			activeVal = 1;
		
		var myUrl = window.location.href;
    	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
    	var transactionUrl = url+"setActiveOrInActive?brandNoPackQty="+brandNoPackQty+"&activeVal="+activeVal;
    	$http({
    	    method : "GET",
    	    url : transactionUrl
    	  }).then(function mySuccess(response) {
    		  
    	  }, function myError(response) {
    	  });
	}
	$scope.submitProductForm = function () {
       var brandNo = parseInt($("#editBrandNo").val());
       var editBrandName = $("#editBrandName").val();
       var editmatchName = $("#editmatchName").val();
       var editMatchValue = parseInt($("#editMatchValue").val());
       var editshortName = $("#editshortName").val();
       
       var productjson = { "editProductJson": [] };
	   var table = $("#editProductTab tbody");
	   table.find('tr').each(function (i) {
	        var $tds = $(this).find('td'),
	            brandNoPackQty = parseInt($tds.eq(0).text())
	            
	            
	            var productType = $( "#productType"+brandNoPackQty+" option:selected" ).val();
	            var quantity = $( "#quantity"+brandNoPackQty+" option:selected" ).val();
	            var caseQty = parseInt($( "#caseQty"+brandNoPackQty+" option:selected" ).val());
	            var caseType = $( "#caseType"+brandNoPackQty+" option:selected" ).val();
	            var category = parseInt($( "#category"+brandNoPackQty+" option:selected" ).val());
	            var company = parseInt($( "#company"+brandNoPackQty+" option:selected" ).val());
	            var margin = parseFloat($('#margin'+brandNoPackQty).val());
	            
	           
	        var input = {
	        		"brandNo":brandNo,
	        		"brandName":editBrandName,
	        		"matchName":editmatchName,
	        		"matchValue":editMatchValue,
	        		"sortName":editshortName,
	        		"productType":productType,
	        		"quantity":quantity,
	        		"caseQty":caseQty,
	        		"caseType":caseType,
	        		"company":company,
	        		"category":category,
	        		"margin":margin,
	        		"brandNoPackQty":brandNoPackQty
	        };
	        productjson.editProductJson.push(input);
	    });
	   updateProduct(productjson);
};
function updateProduct(productjson) {
	var myUrl = window.location.href;
	var url1 = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	   $.ajax({
		  async:false,
	      type: "POST",
	      contentType : 'application/json; charset=utf-8',
	      url: url1+"/updateSingleProductDetails",
	      data: JSON.stringify(productjson), 
	      success: function (data) {
	    	 alert(data.message); 
	    	 // $("#mymessage").text("");
	    		 location.reload();
	      },
	      error: function (data) {
	    	  alert(data+"error");
	    	  location.reload();
	      }
	  });
	}
});
app.filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});