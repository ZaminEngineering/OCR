var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {
	 $(".saleReportWithCategoryWise").hide();
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var saleDatesUrl = url+"mobileView/getTotalSaleDates";
	$http({
	    method : "GET",
	    url : saleDatesUrl
	  }).then(function mySuccess(response) {
		  var startDate="";
	      var enableDays =[];
	      $.each(response.data, function (index, value) {
	    	  enableDays.push(response.data[index].date);
	    	  startDate=response.data[index].date;
	      });
	      $("#startDate").val(startDate);
	  	  $("#endDate").val(startDate);
	  	   getTimeStamp(enableDays);
	  	 getSaleWithDiscountReport(startDate,startDate);
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
	$scope.getResults = function (startDate,endDate){
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		 if(validateCalendarField()==false){return false;}
		 getSaleWithDiscountReport(startDate,endDate);
		 
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
	function  getSaleWithDiscountReport(startDate,endDate){
		
		$("#wait").css("display", "block");
		var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		var callingUrl = url+"mobileView/getSaleWithDiscountData?startDate="+startDate+"&endDate="+endDate;
	
		$http({
		    method : "GET",
		    url : callingUrl
		  }).then(function mySuccess(response) {
			  // console.log(JSON.stringify(response.data));
			  $scope.alldetails = response.data;
			  var companyName = [];
			  var categoryName = [];
	    	   $.each(response.data, function(index, value){
	    	   	if(companyName.indexOf(value.companyId) === -1){          // companyName=companyID
	    	   		companyName.push(value.companyId);
	    	   	}
	    	   	if(categoryName.indexOf(value.categoryId) === -1){          // saleId for categoryId
	    	   		categoryName.push(value.categoryId);
	    	   	}
	    	   });
	    	   var inputsuperjson = [];
	    	   for (var i = 0; i < companyName.length; i++) {
	    		   var brandNoarr = [];
	    		   var bgcolor="",company = "",category="";
	    		   var totalSaleamount = 0,totalDiscountAmount=0,companyOrder = 0,totalsaleQty=0;
	    		   $.each(response.data, function(index, value){
			    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
			    	   		if(companyName[i] == value.companyId)
			    	   		brandNoarr.push(value.brandNo);
			    	   	}
			    	   });
	    		   var inputjson = [];
	    		   for (var j = 0; j < brandNoarr.length; j++) {
	    			   var Brands= [];
	    			   var brandName="";
	    			   var salAmount=0,discountAmount=0,saleQty=0;
	    			   $.each(response.data, function(index, value){
			    		   if(brandNoarr[j] == value.brandNo){
		    				   var caseVal = Math.trunc(value.totalSale/value.packQty);
		    				   var input = {
		    			        		"quantity":value.packType,
		    			        		"totalPrice":value.totalPrice,
		    			        		"category":value.category,
		    			        		"company":value.company,
		    			        		"totalSale":value.totalSale,
		    			        		"saleInCase":caseVal,
		    			        		"btlVal":value.totalSale-(caseVal*value.packQty),
		    			        		"color":value.color,
		    			        		"companyOrder":value.companyOrder,
		    			        		"brandNoPackQty":value.brandNoPackQty,
		    			        		"discount":Math.round(value.discount),
		    			        		"govtDiscount":Math.round(value.totalPrice-value.govtDiscount),
		    			        		"totalDiscount":Math.round((value.totalPrice-value.govtDiscount)+value.discount),
		    			        		"discountMonth":value.discountMonth
		    			        };
		    				   Brands.push(input);
		    				   salAmount+=value.totalPrice;
		    				   brandname=value.brandName;
		    				   bgcolor=value.color;
		    				   discountAmount+=(value.discount+(value.totalPrice-value.govtDiscount));
		    				   company=value.company;
		    				   category=value.category;
		    				   companyOrder=value.companyOrder;
		    				   saleQty+=(value.totalSale/value.packQty);
			    		      }
			    		   });
	    			   var  inputparent = {
	       	   	        		"brandname":brandname,
	       	   	        		"discountAmount":Math.round(discountAmount),
	       	   	        		"salAmount":salAmount,
	       	   	        		"saleQty":Math.round(saleQty),
	       	   	        		"Brands":Brands
		    		       };
		    		   inputjson.push(inputparent);
		    		   totalSaleamount+=salAmount;
		    		   totalDiscountAmount+=discountAmount;
		    		   totalsaleQty+=saleQty;
	    		   }
	    		   var  inputsuperparent = {
     	   	        		"company":company,
     	   	        	    "bgcolor":bgcolor,
     	   	        	    "totalSaleamount":Math.round(totalSaleamount),
     	   	        	    "totalDiscountAmount":Math.round(totalDiscountAmount),
     	   	        	    "companyOrder":companyOrder,
     	   	        	    "totalsaleQty":Math.round(totalsaleQty),
     	   	        		"inputjson":inputjson
	    		       };
		    	   inputsuperjson.push(inputsuperparent);
	    	   }
	    	   $scope.saleWithDiscountdata = inputsuperjson;
	    	   
	    	   // for Category wise
	    	   var inputsuperCategoryjson = [];
	    	   for (var i = 0; i < categoryName.length; i++) {
	    		   var brandNoarr = [];
	    		   var bgcolor="",company = "",category="";
	    		   var totalSaleamount = 0,totalDiscountAmount=0,companyOrder = 0,totalsaleQty=0;
	    		   $.each(response.data, function(index, value){
			    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
			    	   		if(categoryName[i] == value.categoryId)
			    	   		brandNoarr.push(value.brandNo);
			    	   	}
			    	   });
	    		   var inputjson = [];
	    		   for (var j = 0; j < brandNoarr.length; j++) {
	    			   var Brands= [];
	    			   var brandName="";
	    			   var salAmount=0,discountAmount=0,saleQty=0;
	    			   $.each(response.data, function(index, value){
			    		   if(brandNoarr[j] == value.brandNo){
		    				   var caseVal = Math.trunc(value.totalSale/value.packQty);
		    				   var input = {
		    			        		"quantity":value.packType,
		    			        		"totalPrice":value.totalPrice,
		    			        		"category":value.category,
		    			        		"company":value.company,
		    			        		"totalSale":value.totalSale,
		    			        		"saleInCase":caseVal,
		    			        		"btlVal":value.totalSale-(caseVal*value.packQty),
		    			        		"color":value.color,
		    			        		"companyOrder":value.companyOrder,
		    			        		"brandNoPackQty":value.brandNoPackQty,
		    			        		"discount":Math.round(value.discount),
		    			        		"govtDiscount":Math.round(value.totalPrice-value.govtDiscount),
		    			        		"totalDiscount":Math.round((value.totalPrice-value.govtDiscount)+value.discount),
		    			        		"discountMonth":value.discountMonth
		    			        };
		    				   Brands.push(input);
		    				   salAmount+=value.totalPrice;
		    				   brandname=value.brandName;
		    				   bgcolor=value.categoryColor;
		    				   discountAmount+=(value.discount+(value.totalPrice-value.govtDiscount));
		    				   company=value.company;
		    				   category=value.category;
		    				   companyOrder=value.companyOrder;
		    				   saleQty+=(value.totalSale/value.packQty);
			    		      }
			    		   });
	    			   var  inputparent = {
	       	   	        		"brandname":brandname,
	       	   	        		"discountAmount":Math.round(discountAmount),
	       	   	        		"salAmount":salAmount,
	       	   	        		"saleQty":Math.round(saleQty),
	       	   	        		"Brands":Brands
		    		       };
		    		   inputjson.push(inputparent);
		    		   totalSaleamount+=salAmount;
		    		   totalDiscountAmount+=discountAmount;
		    		   totalsaleQty+=saleQty;
	    		   }
	    		   var  inputsuperparent = {
     	   	        		"category":category,
     	   	        	    "bgcolor":bgcolor,
     	   	        	    "totalSaleamount":Math.round(totalSaleamount),
     	   	        	    "totalDiscountAmount":Math.round(totalDiscountAmount),
     	   	        	    "companyOrder":companyOrder,
     	   	        	    "totalsaleQty":Math.round(totalsaleQty),
     	   	        		"inputjson":inputjson
	    		       };
	    		   inputsuperCategoryjson.push(inputsuperparent);
	    	   }
	    	   $scope.saleWithDiscountCategorydata = inputsuperCategoryjson;
	    	   
			  $("#wait").css("display", "none");
		  }, function myError(response) {
			  $("#wait").css("display", "none");
		  });
		
	}
	$scope.filterData = function (item) {
	    return !(item.company === "Carlsberg" || item.company === "Kingfisher" || item.company === "SAB Miller");
	  }
	$scope.filterDataBeer = function (item) {
	    return (item.company === "Carlsberg" || item.company === "Kingfisher" || item.company === "SAB Miller");
	  }
	$scope.filterCategoryData = function (item) {
	    return !(item.category === "BEER" || item.category === "FOREIGN BEER" || item.category === "BEER -FL");
	  }
	$scope.filterCategoryDataBeer = function (item) {
	    return (item.category === "BEER" || item.category === "FOREIGN BEER" || item.category === "BEER -FL");
	  }
	$scope.greaterThan = function(prop, val){
	    return function(item){
	      return item[prop] > val;
	    }
	}
	$scope.FilterCatOrComp = function(){
		var catOrComp = $('#catOrComp').prop('checked');
       if(catOrComp === true){
    	   $(".saleReportWithCategoryWise").hide();
    	   $(".saleReportWithCompanyWise").show();
       }else{
    	   $(".saleReportWithCompanyWise").hide();
    	   $(".saleReportWithCategoryWise").show();
       }
    	   
	}
});
myApp.filter("totalDiscountAmount", function() {
	 return function(data, index) {
	        var s = 0;
	       // if(!data || !data[0]) return soma;
	        
	        angular.forEach(data, function(alldetails, i) {
	             s += (alldetails.discount+(alldetails.totalPrice - alldetails.govtDiscount));
	        });
	        return Math.round(s);
	    };
})
myApp.filter("totalSaleAmount", function() {
	 return function(data, index) {
	        var s = 0;
	       // if(!data || !data[0]) return soma;
	        
	        angular.forEach(data, function(alldetails, i) {
	             s += alldetails.totalPrice;
	        });
	        return Math.round(s);
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
