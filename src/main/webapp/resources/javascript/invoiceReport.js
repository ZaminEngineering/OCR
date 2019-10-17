var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getTotalInvoiceDate.json";
	$http({
	    method : "POST",
	    url : productListUrl
	  }).then(function mySuccess(response) {
		 // console.log(JSON.stringify(response.data));
	      var startDate="";
	      var enableDays =[];
	      $.each(response.data, function (index, value) {
	    	  enableDays.push(value.date);
	    	  startDate=value.date;
	      });
	      getTimeStamp(enableDays);
	        idate(startDate);
	       $("#startDate").val(startDate);
	    }, function myError(response) {
		    //alert(response);
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
$scope.getResults = function (startDate){
	var date = $("#startDate").val();
	 if(validateCalendarField()==false){return false;}
	 idate(date);
	 
}
function validateCalendarField(){
	var startDate = $("#startDate").val();
	if(startDate == ""){
		alert("Please fill Date.");
		return false;
	}
	return true;
}
function idate(ivoicedate){  
   var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var invoiceListUrl = url+"getSingleInvoiceDetailDateWise.json?ivoicedate="+ivoicedate;
	$http({
	    method : "GET",
	    url : invoiceListUrl
	  }).then(function mySuccess(response) {
		  console.log(JSON.stringify(response.data));
		  var mrpRoundOffValue = response.data.mrpRoundOffBean.mrpRoundOff;
		  var totalSaleAmount=0;
		  var totalCases=0;
		  var totalBeer=0;
		  var totalLiquor=0;
	 	  var brandNoarr = [];
    	   $.each(response.data.saleBean, function(index, value){
    	   	if(brandNoarr.indexOf(value.brandNo) === -1){
    	   		brandNoarr.push(value.brandNo);
    	   	}
    	   });
    	   var inputjson = [];
    	   var invoiceTotal=0;
 	       var mrpRoundingOffTotal=0;
    	   for (var i = 0; i < brandNoarr.length; i++) {
    		   var Brands= [];
    		   var company="";
    		   var category="";
    		   var brandname="";
    		   var bgcolor="";
    		   var caseqty=0;
    		   var companyOrder=0;
    		   var totalPriceVal=0;
                   $.each(response.data.saleBean, function(index, value){
    			   if(brandNoarr[i] == value.brandNo){
    				   var btlrate=value.singleBottelPrice;
    			    	  var noofbtls=(value.packQty*value.caseQty)+value.qtyBottels;
    			    	  var actMrp=0;
    			    	  var mrpRoundOf=0;
    			    	  var roundoffvall=0;
    			    	  var ttlRoundOf=0;
    			    	 /* if(value.productType == "BEER"){
    			    		  actMrp=btlrate+25/100*btlrate;
    			    		  mrpRoundOf=Math.ceil((Math.trunc(actMrp)+1)/10)*10;
    			    		  roundoffvall=mrpRoundOf-actMrp;
    			    		  ttlRoundOf=noofbtls*Math.round(roundoffvall * 100) / 100;
    			    	  }
    			    	  else{
    			    		  actMrp=btlrate+20/100*btlrate;
    			    		  mrpRoundOf=Math.ceil((Math.trunc(actMrp)+1)/10)*10;
    			    		  roundoffvall=mrpRoundOf-actMrp;
    			    		  ttlRoundOf=noofbtls*Math.round(roundoffvall * 100) / 100;;
    			    	  }*/
    			    	  invoiceTotal+=value.totalPrice;
    			    	 // mrpRoundingOffTotal+=ttlRoundOf;
    				      var input = {
    			        		"productType":value.productType,
    			        		"packType":value.packType,
    			        		"QTY":value.quantity,
    			        		"packQty":value.packQty,
    			        		"UnitRate":value.unitPrice,
    			        		"BTLRate":value.singleBottelPrice,
    			        		"caseQty":value.caseQty,
    			        		"btlqty":value.qtyBottels,
    			        		"TotalPrice":value.totalPrice,
    			        		"actMrp":Math.trunc(actMrp).toLocaleString('en-IN',{ maximumFractionDigits: 2}),
    			        		"mrpRoundOf":mrpRoundOf.toLocaleString('en-IN',{ maximumFractionDigits: 2}),
    			        		"ttlRoundOf":ttlRoundOf.toLocaleString('en-IN',{ maximumFractionDigits: 2})
    			        };
    				   Brands.push(input);
    				   company=value.company;
    				   category=value.category;
    				   brandname=value.brandName;
    				   caseqty+=value.caseQty;
    				   bgcolor=value.color;
    				   totalPriceVal+=value.totalPrice;
    				   companyOrder=value.companyOrder;
				   }
    			   
	    	    });
                   var  inputparent = {
   	   	        		"brandNo":brandNoarr[i],
   	   	        		"category":category,
   	   	        		"company":company,
   	   	        		"companyOrder":companyOrder,
   	   	        		"brandname":brandname,
   	   	        		"caseqty":caseqty,
   	   	        		"totalPriceVal":totalPriceVal,
   	   	        		"bgcolor":bgcolor,
   	   	        		"Brands":Brands
    		       };
                   inputjson.push(inputparent);
    		   
    	   }
    	  // console.log(JSON.stringify(inputjson));
    	   $scope.alldetails = inputjson;
    	   $scope.categories = inputjson;
    	   $("#invoiceTotal").html("<span style=\"float: left;padding: 0px 0px 0px 10px;\"> Cummulative Value = (Invoice Value + MRP Round Off) : "+(response.data.saleBean[0].cummulativePrice).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span><span> Invoice Value: "+invoiceTotal.toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span>");
 	      $("#mrpRoundingOffTotal").html("<span> MRP Round Off: "+(response.data.mrpRoundOffBean.mrpRoundOff).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span>");
 	     $("#netInvoiceValue").html("<span> Net Invoice Value: "+(invoiceTotal+mrpRoundOffValue).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span>");
 	     // $("#tcs").html("<span> TCS: "+((invoiceTotal+mrpRoundOffValue)/100).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span>");
 	     $("#tcs").html("<span> TCS: "+(response.data.mrpRoundOffBean.tcsVal).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span>");
 	     $("#turnOverTax").html("<span> TurnOver Tax: "+(response.data.mrpRoundOffBean.turnOverTax).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span>");
		  
	  }, function myError(response) {
		  		    //alert(response);
		  
	  });
}
$scope.greaterThan = function(prop, val){
    return function(item){
      return item[prop] > val;
    }
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
