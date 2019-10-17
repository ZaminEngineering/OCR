var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	 $('.date-picker').datepicker( {
	        changeMonth: true,
	        changeYear: true,
	        showButtonPanel: true,
	        dateFormat: 'MM yy',
	        onClose: function(dateText, inst) { 
	            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
	        }
	    });
	 $("#startDate").val($.datepicker.formatDate('MM yy', new Date()));
	 buildstockLifting($.datepicker.formatDate('MM yy', new Date()));


$scope.getResults = function (startDate){
	var startDate = $("#startDate").val();
	 if(validateCalendarField()==false){return false;}
	 buildstockLifting(startDate);
	 
}
function validateCalendarField(){
	var startDate = $("#startDate").val();
	if(startDate == ""){
		alert("Please fill Start Date.");
		return false;
	}
	
	return true;
}
$scope.greaterThan = function(prop, val){
    return function(item){
      return item[prop] > val;
    }
}

function  buildstockLifting(startDate){
	$("#setDateValueID").text(startDate);
	var n = startDate.split(" ");
    var val1 = n[n.length - 2];
    var val2 = n[n.length - 1];
    var date="01/"+val1+"/"+val2;
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var callingUrl = url+"getStockLiftingWithDiscount.json?date="+date;
	$http({
	    method : "GET",
	    url : callingUrl
	  }).then(function mySuccess(response) {
		  //console.log(JSON.stringify(response.data));
		  $scope.alldetails = response.data;
   	      $scope.categories = response.data;
   	   var json = {
		    	"discountDetails": []
		}
   	   $.each(response.data,function(index, value){
   		 var input = {
	        		"brandNo":value.brandNo+"",
	        		"discountAmount":value.discount+"",
	        		"adjustment":value.adjustment,
	        		"discountTotalAmount":value.totalDiscount+"",
	        		"companyId":value.comapnyId+"",
	        		"target":value.targetCase,
	        		"totalDiscount":Math.round((value.discount * value.targetCase))+""
	        };
	        json.discountDetails.push(input);
   		   
		   });
   	 if((Object.keys(json.discountDetails).length) > 0)
   		saveDiscountDataSecond(json);
		  
	  }, function myError(response) {
		    //alert(response);

});
	
}
$scope.onChnage = function(discountamount,brandno){
	var totalcases = parseInt($("#ttlcases"+brandno).text());
	var totalDiscountAmount=totalcases*discountamount;
	if(totalDiscountAmount > 0){
		$('#ttldiscoutamount'+brandno).html(Math.round(totalDiscountAmount));
	}
	else
		$('#ttldiscoutamount'+brandno).html(0);
	
	/*var totalDiscount = parseInt(cases*discountamount);
	var investment = Math.round(cases*caseRate);
	var discountandinvestment = ((totalDiscount * 100)/(investment));
	var estimationMonth = parseFloat((cases+inHouseCase)/lastMonthSold);
	var profitPerMonth = discountandinvestment/estimationMonth;
	if(!isNaN(profitPerMonth) && profitPerMonth !="Infinity" && profitPerMonth >0)
		$('#perMonth'+brandno).html((profitPerMonth).toFixed(2));
	else
		$('#perMonth'+brandno).html(0);
	
	var totalDiscountExclusive = parseInt(cases*discountamount);
	var investmentAmtExclusive = Math.round(cases*caseRate);
	var discountandinvestmentExclusive = ((totalDiscountExclusive * 100)/investmentAmtExclusive);
	var estimationMonthExclusive = parseFloat(cases/lastMonthSold);
	var profitPerMonthExclusive = discountandinvestmentExclusive/estimationMonthExclusive;
	if(!isNaN(profitPerMonthExclusive) && profitPerMonthExclusive !="Infinity" && profitPerMonthExclusive >0)
		$('#perMonthExclude'+brandno).html((profitPerMonthExclusive).toFixed(2));
	else
		$('#perMonthExclude'+brandno).html(0);
	
	*/
	
	var ttlDicAmt=0;
	var table = $("#discounttab tbody");
	 table.find('tr').each(function (i) {
	        var $tds = $(this).find('td'),
	            discountTotalAmount = parseInt($tds.eq(10).text())
	            ttlDicAmt=ttlDicAmt+discountTotalAmount;
	    });
	 
	 $('#discountamountid').html(ttlDicAmt);
	
};


$scope.afterADJ = function(adj,brandNo,ttlCase){
    var data = ttlCase+(adj);
    $('#ttlcases'+brandNo).html(data);
    var discountAmt = $('#damount'+brandNo).val();
    $scope.onChnage(discountAmt,brandNo);
};
$scope.afterTarget = function(target,brandNo,liftedCase){
    var data = target - liftedCase;
    if(data > 0)
    $('#pending'+brandNo).html(data);
    else
    	 $('#pending'+brandNo).html(0);
};

function validateNum(number){
	var regex = /^[0-9]*(?:\d{1,2})?$/;
	return regex.test(number);
}
$scope.savediscountDetails = function(){
	  var json = {
		    	"discountDetails": [],
		}
	  
		var table = $("#discounttab tbody");
		 table.find('tr').each(function (i) {
		        var $tds = $(this).find('td'),
		            brandName = $tds.eq(0).text(),
		            brandNo = $tds.eq(1).text(),
		            caseRate = $tds.eq(2).text(),
		            inHousestock = $tds.eq(3).text(),
		            totalcases = $tds.eq(4).text(),
		            adj = $tds.eq(5).text(),
		            ttlCases = $tds.eq(6).text(),
		            target = $tds.eq(7).text(),
		            pending = parseInt($tds.eq(8).text()),
		            discAmt = $tds.eq(9).text(),
		            discountTotalAmount = $tds.eq(10).text(),
		            companyId = $tds.eq(11).text()
		            
		            var discountAmount = $('#damount'+brandNo).val();
		            var Adjustment = parseInt($('#adjustment'+brandNo).val());
		            var targetVal =  parseInt($('#target'+brandNo).val());
		            if(isNaN(Adjustment)){
		            	Adjustment=0;
			             }
		            if(isNaN(discountAmount)){
		            	discountAmount=0;
			             }
		            if(isNaN(targetVal)){
		            	targetVal=0;
			             }
		        var input = {
		        		"brandNo":brandNo,
		        		"discountAmount":discountAmount,
		        		"adjustment":Adjustment,
		        		"discountTotalAmount":discountTotalAmount,
		        		"companyId":companyId,
		        		"target":targetVal,
		        		"totalDiscount":(discountAmount * target)+""
		        };
		        json.discountDetails.push(input);
		    });
		 if((Object.keys(json.discountDetails).length) > 0)
		saveDiscountData(json);
	};
	function saveDiscountData(json){
		var startDate = $("#setDateValueID").text();
		var n = startDate.split(" ");
		var val1 = n[n.length - 2];
	    var val2 = n[n.length - 1];
	    var date="01/"+val1+"/"+val2;
		 var myUrl = window.location.href;
		  var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		  var discountListUrl = url+"saveStockLiftWithDiscountData?date="+date;
				$http({
				    method : "POST",
				    contentType : 'application/json; charset=utf-8',
				    data: JSON.stringify(json),
				    url : discountListUrl,
				    headers: { 'x-my-custom-header': ip }
				  }).then(function mySuccess(response) {
					  alert(response.data.message);
					  location.reload(true);
				  }, function myError(response) {
					  alert("error"+response.data.message);
					  location.reload(true);
				  });
				
	  }
	function saveDiscountDataSecond(json){
		var startDate = $("#setDateValueID").text();
		var n = startDate.split(" ");
		var val1 = n[n.length - 2];
	    var val2 = n[n.length - 1];
	    var date="01/"+val1+"/"+val2;
	    //console.log(JSON.stringify(json)+" date>> "+date);
		 var myUrl = window.location.href;
		  var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		  var discountListUrl = url+"saveStockLiftWithDiscountData?date="+date;
				$http({
				    method : "POST",
				    contentType : 'application/json; charset=utf-8',
				    data: JSON.stringify(json),
				    url : discountListUrl,
				    headers: { 'x-my-custom-header': ip }
				  }).then(function mySuccess(response) {
				  }, function myError(response) {
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
app.filter("sumOfDiscount", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
            s += alldetails.totalDiscount;
        });
        return Math.ceil(s);
    };
})
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

