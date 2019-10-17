var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
	$("#allCompanies,#monthWiseDiscount").hide();
	$("#bacardiCompany").hide();
	$("#wait").css("display", "block");
	$('input.monthpicker').monthpicker({changeYear:true,dateFormat: "yy-mm-01" });
	$('input.monthpicker').val($.datepicker.formatDate('yy-mm-01', new Date()));
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getCompanyList.json";
	$http({
	    method : "GET",
	    url : productListUrl
	  }).then(function mySuccess(response) {
		 // console.log(JSON.stringify(response.data));
		 $scope.companyData = response.data;
		  $.each(response.data, function (index, value) {
    	      $('#listdataSec').append( '<option  value="'+value.id+'">'+value.name+'</option>' );
	  });
	  }, function myError(response) {
	    //alert(response);
	  });
	 $scope.getResults = function (){
		 if(validateCalendarField()==false){return false;}
		 if(($scope.companyId) == 1 || ($scope.companyId) == 10 || ($scope.companyId) == 5){
			 $("#allCompanies").hide();
			 $("#bacardiCompany").show();
		 buildTillMonthStockLiftWithDiscount();
		 }else{
			 $("#bacardiCompany").hide();
			 $("#allCompanies").show();
		buildTillMonthStockLiftWithDiscount();
		 }
		 
	}
 function validateCalendarField(){
		var date = $("#tillDateDiscountDate").val();
		var company = $scope.companyId;
		if(date == ""){
			alert("Please fill Date.");
			return false;
		}
		if(company == "" || company == undefined){
			alert("Please Select Company.");
			return false;
		}
		return true;
	}
function buildTillMonthStockLiftWithDiscount(){
	var date = $("#tillDateDiscountDate").val();
	var company = $scope.companyId;
	$scope.discountCompany = company;
	$scope.discountdate = date;
		   var myUrl = window.location.href;
			var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
			var productListUrl =  url+"getTillMonthStockLiftWithDiscount.json?date="+date+"&company="+company;
			$http({
			    method : "GET",
			    url : productListUrl
			  }).then(function mySuccess(response) {
				  $scope.alldetails = response.data;
				  $scope.latestArrears = response.data[0].dues;
			  }, function myError(response) {
			  });
			
			var transactionUrl = url+"getDiscountCompanyWiseForAllMonth?date="+date+"&company="+company;
	    	$http({
	    	    method : "GET",
	    	    url : transactionUrl
	    	  }).then(function mySuccess(response) {
	    		 console.log(JSON.stringify(response.data));
	    		  $scope.transactionData = response.data;
	    	  }, function myError(response) {
	    	  });
	    	
	    	var receivedUrl = url+"getDiscountCompanyWiseForAllMonthWithReceived?company="+company;
 	    	$http({
 	    	    method : "GET",
 	    	    url : receivedUrl
 	    	  }).then(function mySuccess(response) {
 	    		  $scope.receivedData = response.data;
 	    	  }, function myError(response) {
 	    	  });
 	    	
 	    	var rentalUrl = url+"getUpToMonthRental?date="+date+"&company="+company;
 	    	$http({
 	    	    method : "GET",
 	    	    url : rentalUrl
 	    	  }).then(function mySuccess(response) {
 	    		 $scope.rentalAmt = response.data;
 	    	  }, function myError(response) {
 	    	  });
 	    	
 	    	var companyUrl = url+"getCompanyWithEnterPrice?company="+company;
	    	$http({
	    	    method : "GET",
	    	    url : companyUrl
	    	  }).then(function mySuccess(response) {
	    		  $scope.companyName = response.data.label;
	    		  $scope.enterprice = "  ("+response.data.color+")";
	    		  
	    	  }, function myError(response) {
	    	  });
}


$scope.openListDisconts = function(saleBeen,discountBeen,date,aarears,ttlDiscount,rentals) {
	var brandNoarr = [];
	   $.each(saleBeen, function(index, value){
	   	if(brandNoarr.indexOf(value.invoiceId) === -1){
	   		brandNoarr.push(value.invoiceId);
	   	}
	   });
	   var inputjson = [];
	   for (var i = 0; i < brandNoarr.length; i++) {
		   var Brands= [];
		   var totalCaseQty=0,totalDiscount=0;
		   var productName="";
		   $.each(saleBeen, function(index, value){
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
	  // console.log(JSON.stringify(inputjson));
	   $scope.tempData = inputjson;
	 $scope.date = date;
	 $scope.aarears = aarears;
	 $scope.ttlDiscount = ttlDiscount;
	 $scope.saleBeen = saleBeen;
	 $scope.discountBeen = discountBeen;
	 $scope.rentalsAmt = rentals;
	
	};
	$scope.openChekImg = function(image,imageName) {
		 $scope.image = image;
		 $scope.imageName = imageName;
		
		};
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
	// All company Discount Start
	var saleDatesUrl = url+"mobileView/stockLiftingWithDiscountReport";
	$http({
	    method : "GET",
	    url : saleDatesUrl
	  }).then(function mySuccess(response) {
		//  console.log(JSON.stringify(response.data));
		 $scope.discountData = response.data;
		 $("#wait").css("display", "none");
	  }, function myError(response) {
		  $("#wait").css("display", "none");
	  });
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
		// $scope.discountBeen = discountBeen;
		 $scope.discountBeen = discountasCompanyBeen;
		// console.log(JSON.stringify(discountasCompanyBeen));
		 var myUrl = window.location.href;
			var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
			var Url = url+"mobileView/stockLiftingWithDiscountReportWithBrandDetails?date="+realDate+"&companyId="+companyId;
			$http({
			    method : "GET",
			    url : Url
			  }).then(function mySuccess(response) {
				//  console.log(JSON.stringify(response.data));
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
				   //console.log(JSON.stringify(inputjson));
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
	$scope.getSelectedMonthDiscount = function(){
		var month_names =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		var selectedDate = $("#discountMonthPicker").val();
		 var today = new Date(selectedDate);
		 $("#selectedMonth").text("" + month_names[today.getMonth()] + "-" + today.getFullYear());
		$("#monthWiseDiscount").show();
		var selecetedMonthDiscountUrl = url+"getDiscountForAllCompanies?month="+selectedDate;
		$http({
		    method : "GET",
		    url : selecetedMonthDiscountUrl
		  }).then(function mySuccess(response) {
			 // console.log(JSON.stringify(response.data));
		     $scope.selecetMonthDisc = response.data;
		  }, function myError(response) {
		  });
	}
	$scope.sortingKey = 'discountAmount';
	$scope.reverseKey = true;
	$scope.sorting = function(propName){
		$scope.sortingKey = propName;
	    $scope.reverseKey = !$scope.reverseKey;
	}
});
app.filter('INR', function () {        
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
app.filter("sumDiscounts", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.discounts;
        });
        return Math.ceil(s);
    };
})
app.filter("sumRental", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.rentals;
        });
        return Math.ceil(s);
    };
})
app.filter("sumTotal", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.total;
        });
        return Math.ceil(s);
    };
})
app.filter("sumReceived", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.received;
        });
        return Math.ceil(s);
    };
})
app.filter("sumDues", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.dues;
        });
        return Math.ceil(s);
    };
})
app.filter("adjCheque", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(receivedData, i) {
             s += receivedData.adjustmentCheque;
        });
        return Math.ceil(s);
    };
})
app.filter("totalChequeAmount", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(receivedData, i) {
             s += receivedData.chequeAmount;
        });
        return Math.ceil(s);
    };
})
app.filter("totalDiscountAmt", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(transactionData, i) {
             s += transactionData.totalDiscount;
        });
        return Math.ceil(s);
    };
})
app.filter("totalRentals", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(transactionData, i) {
             s += transactionData.rentals;
        });
        return Math.ceil(s);
    };
})
app.filter("selecetMonthDiscListdiscountAmount", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(selecetMonthDisc, i) {
             s += selecetMonthDisc.discountAmount;
        });
        return Math.ceil(s);
    };
})
app.filter("selecetMonthDiscListrentals", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(selecetMonthDisc, i) {
             s += selecetMonthDisc.rentals;
        });
        return Math.ceil(s);
    };
})
app.filter("selecetMonthDiscListtotal", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(selecetMonthDisc, i) {
             s += (selecetMonthDisc.discountAmount + selecetMonthDisc.rentals);
        });
        return Math.ceil(s);
    };
})
app.filter("selecetMonthDiscListchequeAmount", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(selecetMonthDisc, i) {
             s += selecetMonthDisc.chequeAmount;
        });
        return Math.ceil(s);
    };
})
app.filter("selecetMonthDiscListadjustmentCheque", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(selecetMonthDisc, i) {
             s += selecetMonthDisc.adjustmentCheque;
        });
        return Math.ceil(s);
    };
})
app.filter("selecetMonthDiscListarrears", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(selecetMonthDisc, i) {
             s += selecetMonthDisc.arrears;
        });
        return Math.ceil(s);
    };
})