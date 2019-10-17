var myApp = angular.module('myApp', ["checklist-model"]);
myApp.controller('Ctrl1', function($scope, $http) {
	$('#startMonth').monthpicker({changeYear:true,dateFormat: "yy-mm-01" });
	//$('#startMonth').val($.datepicker.formatDate('yy-mm-01', new Date()));
	$('#endMonth').monthpicker({changeYear:true,dateFormat: "yy-mm-01" });
	$('#endMonth').val($.datepicker.formatDate('yy-mm-01', new Date()));
	var tempDate = new Date()
	var sDate = tempDate.getFullYear()+"-"+("0" + (tempDate.getMonth())).slice(-2)+"-"+"01";
	$('#startMonth').val(sDate);
	buildTillMonthStockLiftWithDiscount();
	 $scope.getResults = function() {
		if (validateCalendarField() == false) {
				return false;
			}
		buildTillMonthStockLiftWithDiscount();

	}
 function validateCalendarField(){
		var startMonth = $("#startMonth").val();
		var endMonth = $("#endMonth").val();
		var date1, date2;
        date1 = new Date(startMonth);
        date2 = new Date(endMonth);
        if (date1 > date2){
        	alert("Start month should not be greater than End month!");
        	return false;
        }
		if(startMonth == ""){
			alert("Please fill Start Month.");
			return false;
		}
		if(endMonth == ""){
			alert("Please fill End Month.");
			return false;
		}
		return true;
	}
 $scope.user = {
	        discountData: []
	      };
	      $scope.checkAll = function() {
	        $scope.user.discountData = angular.copy($scope.discountData);
	      };
	      $scope.uncheckAll = function() {
	        $scope.user.discountData = [];
	      };
function buildTillMonthStockLiftWithDiscount(){
	  //$scope.user.discountData = "";
	var startMonth = $("#startMonth").val();
	var endMonth = $("#endMonth").val();
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var URL = url+"discountReportForSelectedMonth?startMonth="+startMonth+"&endMonth="+endMonth;
	$http({
	    method : "GET",
	    url : URL
	  }).then(function mySuccess(response) {
		  console.log(JSON.stringify(response.data));
		  $scope.discountData = response.data;
		  $scope.user.discountData = angular.copy($scope.discountData);
	  }, function myError(response) {
	  });
}

	$scope.openChekImg = function(image,imageName) {
		 $scope.image = image;
		 $scope.imageName = imageName;
		
		};
		$scope.greaterThanTopCheck = function(prop1,prop2, val){
		    return function(item){
		      return (item[prop1]+item[prop2]) > val;
		    }
		}
	$scope.greaterThan = function(prop, val){
	    return function(item){
	      return item[prop] > val;
	    }
	}
	$scope.greaterThanZero = function(prop1,prop2,prop3,prop4,prop5, val){
	    return function(item){
	      return (item[prop1]+item[prop2]+item[prop3]+item[prop4]+item[prop5]) > val;
	    }
	}
	$scope.greaterThanZeroAllCompany = function(prop1,prop2,prop3, val){
	    return function(item){
	      return (item[prop1]+item[prop2]+item[prop3]) > val;
	    }
	}
	$scope.openListDiscontsAllCompany = function(discountasCompanyBeen,date,companyId,realDate,discAmt,rentals,arrears) {
		 $scope.date = date;
		 $scope.ttlDiscount = discAmt;
		 $scope.rentalsAmt = rentals;
		 $scope.aarears = arrears;
		 $scope.discountBeen = discountasCompanyBeen;
		 var myUrl = window.location.href;
			var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
			var Url = url+"mobileView/stockLiftingWithDiscountReportWithBrandDetails?date="+realDate+"&companyId="+companyId;
			$http({
			    method : "GET",
			    url : Url
			  }).then(function mySuccess(response) {
				  var brandNoarr = [];
				   $.each(response.data, function(index, value){
				   	if(brandNoarr.indexOf(value.invoiceId) === -1){
				   		brandNoarr.push(value.invoiceId);
				   	}
				   });
				   var inputjson = [];
				   for (var i = 0; i < brandNoarr.length; i++) {
					   var Brands= [];
					   var totalCaseQty=0,totalDiscount=0;
					   var productName="";
					   $.each(response.data, function(index, value){
						   if(brandNoarr[i] == value.invoiceId){
							   var input = {
						        		"brandName":value.brandName,
						        		"brandNo":value.brandNo,
						        		"caseQty":value.caseQty,
						        		"unitPrice":value.unitPrice,
						        		"totalPrice":value.totalPrice
						        };
							   Brands.push(input);
							   totalCaseQty += value.caseQty;
							   totalDiscount += value.totalPrice;
							   productName = value.productType;
						   }
						   
			    	    });
					   var  inputparent = {
				   	        		"productName":productName,
				   	        		"totalCaseQty":totalCaseQty,
				   	        		"totalDiscount":totalDiscount,
				   	        		"Brands":Brands
					       };
			              inputjson.push(inputparent);
					   
				   }
				   $scope.tempData = inputjson;
			  }, function myError(response) {
			  });
		};
	// All company Discount end
		$scope.IsHidden = true;
		$scope.ShowHide = function(val) {
			$scope.tabFourHidden = true;
			if(val == 1)
			 $scope.IsHidden =  false;
			else
			 $scope.IsHidden = true;
		}
		$scope.tabFourHidden = true;
		$scope.tabHidden = function() {
			 $scope.tabFourHidden =  false;
			 $scope.IsHidden = true;
		}
	$scope.sortKey = 'duesAmt';
	$scope.reverse = true;
	$scope.sort = function(propName){
		$scope.sortKey = propName;
	    $scope.reverse = !$scope.reverse;
	}
	
});
myApp.filter('INR', function () {        
    return function (input) {
        if (! isNaN(input)) {
           // var currencySymbol = '₹';
        	 var currencySymbol = '';
            //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
            var result = Math.round(input).toString().split('.');

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
myApp.filter("Arrears", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(shiva, i) {
             s += shiva.duesAmt;
        });
        return Math.ceil(s);
    };
})
myApp.filter("Discount", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(shiva, i) {
             s += shiva.totalDiscount;
        });
        return Math.ceil(s);
    };
})