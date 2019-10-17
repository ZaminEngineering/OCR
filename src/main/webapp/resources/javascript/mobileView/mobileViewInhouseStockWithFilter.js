var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {
	 $(".saleReportWithCategoryWise").hide();
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"mobileView/InHouseStockAmountWithSale";
    $http({
    method : "GET",
    url : productListUrl
  }).then(function mySuccess(response) {
	  //console.log(JSON.stringify(response.data));
	  var companyName = [],categoryName = [];
	  $.each(response.data, function(index, value){
	   	if(companyName.indexOf(value.saleId) === -1){          // companyName=companyID
	   		companyName.push(value.saleId);
	   	}
	   	if(categoryName.indexOf(value.invoiceId) === -1){          // categoryName=opening
	   		categoryName.push(value.invoiceId);
	   	}
	   });
	   var inputsuperjson = [];
	   for (var i = 0; i < companyName.length; i++) {
		   var brandNoarr = [];
		   var bgcolor="",company = "";
		   var sumOfCase = 0,companyOrder=0,firstFontColor=5,totalinhouseStockAmount=0,totalInhouseSaleAmount=0,ttlexactInvoiceAmt=0;
    	   $.each(response.data, function(index, value){
    		   
    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
    	   		if(companyName[i] == value.saleId)
    	   		brandNoarr.push(value.brandNo);
    	   	}
    	   });
	   var inputjson = [];
	   for (var j = 0; j < brandNoarr.length; j++) {
		   var Brands= [];
		   var cases=0,secondFontColor=5,inhouseStockAmount=0,inhouseSaleAmount=0,exactInvoiceAmt=0,order=0;
		   var name="";
		   $.each(response.data, function(index, value){
		   if(brandNoarr[j] == value.brandNo){
			   var input = {
		        		"quantity":value.quantity,
		        		"caseVal":value.caseQty,
		        		"closing":value.closing,
		        		"btls":value.qtyBottels,
		        		"noOfDays":value.productId,
		        		"packQty":value.packQty,
		        		"stockAmount":value.totalPrice,
		        		"saleAmount":value.cummulativePrice,
		        		"exactInvoiceAmt":value.singleBottelPrice
		        };
			   Brands.push(input);
			   order = value.noOfReturnsBtl;
			   exactInvoiceAmt += value.singleBottelPrice;
			   cases=cases+(value.closing/value.packQty);
			   inhouseStockAmount+=value.totalPrice;
			   inhouseSaleAmount+=value.cummulativePrice;
			   brandname=value.brandName;
			   bgcolor=value.color;
			   company=value.company;
			   companyOrder=value.companyOrder;
			   if(((value.productId) <= 1))
				   secondFontColor = 0;
		     }
		   });
		   var  inputparent = {
	   	        		"brandNo":brandNoarr[j],
	   	        		"brandname":brandname,
	   	        		"cases":Math.round(cases),
	   	        		"secondFontColor":secondFontColor,
	   	        		"inhouseStockAmount":inhouseStockAmount,
	   	        		"inhouseSaleAmount":inhouseSaleAmount,
	   	        		"exactInvoiceAmt":exactInvoiceAmt,
	   	        		"order":order,
	   	        		"Brands":Brands
		       };
		   inputjson.push(inputparent);
		   sumOfCase=sumOfCase+cases;
		   totalInhouseSaleAmount+=inhouseSaleAmount;
		   totalinhouseStockAmount+=inhouseStockAmount;
		   ttlexactInvoiceAmt += exactInvoiceAmt;
		   if(secondFontColor <=1)
			   firstFontColor = 0;
	   }
	   var  inputsuperparent = {
 	        		"company":company,
 	        	    "bgcolor":bgcolor,
 	        	    "sumOfCase":Math.round(sumOfCase),
 	        	    "companyOrder":companyOrder,
 	        	    "firstFontColor":firstFontColor,
 	        	    "totalinhouseStockAmount":totalinhouseStockAmount,
 	        	    "totalInhouseSaleAmount":totalInhouseSaleAmount,
 	        	    "ttlexactInvoiceAmt":ttlexactInvoiceAmt,
 	        		"inputjson":inputjson
	       };
	   inputsuperjson.push(inputsuperparent);
   }
	  // console.log(JSON.stringify(inputsuperjson));
   $scope.stockdata = inputsuperjson;
	  
	  // Category wise
   var inputCategorysuperjson = [];
   for (var i = 0; i < categoryName.length; i++) {
	   var brandNoarr = [];
	   var bgcolor="",category = "";
	   var sumOfCase = 0,categoryOrder=0,firstFontColor=5,totalinhouseStockAmount=0,totalInhouseSaleAmount=0,ttlexactInvoiceAmt=0;
	   $.each(response.data, function(index, value){
		   
	   	if(brandNoarr.indexOf(value.brandNo) === -1){
	   		if(categoryName[i] == value.invoiceId)
	   		brandNoarr.push(value.brandNo);
	   	}
	   });
   var inputjson = [];
   for (var j = 0; j < brandNoarr.length; j++) {
	   var Brands= [];
	   var cases=0,secondFontColor=5,inhouseStockAmount=0,inhouseSaleAmount=0,exactInvoiceAmt=0,order=0;
	   var name="";
	   $.each(response.data, function(index, value){
	   if(brandNoarr[j] == value.brandNo){
		   var input = {
	        		"quantity":value.quantity,
	        		"caseVal":value.caseQty,
	        		"closing":value.closing,
	        		"btls":value.qtyBottels,
	        		"noOfDays":value.productId,
	        		"packQty":value.packQty,
	        		"stockAmount":value.totalPrice,
	        		"saleAmount":value.cummulativePrice,
	        		"exactInvoiceAmt":value.singleBottelPrice
	        };
		   Brands.push(input);
		   order = value.noOfReturnsBtl;
		   exactInvoiceAmt += value.singleBottelPrice;
		   cases=cases+(value.closing/value.packQty);
		   inhouseStockAmount+=value.totalPrice;
		   inhouseSaleAmount+=value.cummulativePrice;
		   brandname=value.brandName;
		   bgcolor=value.salePrimaryKey;
		   category=value.category;
		   categoryOrder=value.categoryOrder;
		   if(((value.productId) <= 1))
			   secondFontColor = 0;
	     }
	   });
	   var  inputparent = {
   	        		"brandNo":brandNoarr[j],
   	        		"brandname":brandname,
   	        		"cases":Math.round(cases),
   	        		"secondFontColor":secondFontColor,
   	        		"inhouseStockAmount":inhouseStockAmount,
   	        		"inhouseSaleAmount":inhouseSaleAmount,
   	        		"exactInvoiceAmt":exactInvoiceAmt,
   	        		"order":order,
   	        		"Brands":Brands
	       };
	   inputjson.push(inputparent);
	   sumOfCase=sumOfCase+cases;
	   totalinhouseStockAmount+=inhouseStockAmount;
	   totalInhouseSaleAmount+=inhouseSaleAmount;
	   ttlexactInvoiceAmt += exactInvoiceAmt;
	   if(secondFontColor <=1)
		   firstFontColor = 0;
   }
   var  inputsuperparent = {
	        		"category":category,
	        	    "bgcolor":bgcolor,
	        	    "sumOfCase":Math.round(sumOfCase),
	        	    "categoryOrder":categoryOrder,
	        	    "firstFontColor":firstFontColor,
	        	    "totalinhouseStockAmount":totalinhouseStockAmount,
	        	    "totalInhouseSaleAmount":totalInhouseSaleAmount,
	        	    "ttlexactInvoiceAmt":ttlexactInvoiceAmt,
	        		"inputjson":inputjson
       };
   inputCategorysuperjson.push(inputsuperparent);
}
$scope.stockCastegorydata = inputCategorysuperjson;
	 
  }, function myError(response) {
    
  });
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
    $scope.greaterThan = function(prop, val){
	    return function(item){
	      return item[prop] > val;
	    }
	}
 
});
myApp.filter("stockPrice", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(stockdata, i) {
            s += stockdata.ttlexactInvoiceAmt;
        });
        return Math.ceil(s);
    };
})
myApp.filter("salePrice", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(stockdata, i) {
            s += stockdata.totalInhouseSaleAmount;
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
