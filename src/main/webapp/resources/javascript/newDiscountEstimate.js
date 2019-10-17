var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	$(".reportWithoutEntry").hide();
	 $('input.monthpicker').monthpicker({changeYear:true,dateFormat: "yy-mm-01" });
	 $("#wait").css("display", "block");
	 buildDiscount($.datepicker.formatDate('yy-mm-01', new Date()));
	  $("#monthlyDate").val($.datepicker.formatDate('yy-mm-01', new Date()));
	 
	 $scope.getResults = function (){
		     var date =	$("#monthlyDate").val();
			 if(validateCalendarField(date)==false){return false;}
			 buildDiscount(date);
			 
		}
	 $scope.FilterCatOrComp = function(){
			var catOrComp = $('#catOrComp').prop('checked');
	       if(catOrComp === true){
	    	   $(".reportWithoutEntry").hide();
	    	   $(".reportWithEntry").show();
	       }else{
	    	   $(".reportWithEntry").hide();
	    	   $(".reportWithoutEntry").show();
	       }
		}
	    $scope.greaterThan = function(prop,prop1, val){
		    return function(item){
		      return (item[prop]+item[prop1]) > val;
		    }
		}
	 function validateCalendarField(date){
			if(date == ""){
				alert("Please fill Start Date.");
				return false;
			}
			return true;
		}
	 
	 function buildDiscount(date){
			   var myUrl = window.location.href;
		    	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		    	var transactionUrl = url+"getNewDiscountEsitmateDetails?date="+date;
		    	$http({
		    	    method : "GET",
		    	    url : transactionUrl
		    	  }).then(function mySuccess(response) {
		    		  $("#wait").css("display", "none");
		    		  //console.log(JSON.stringify(response.data));
		    		  var inputjson = [];
		    		  var json = {
			      		    	"discountDetails": []
			      		}
		    		  $.each(response.data, function (index, value) {
		    			  var pending=0,clearnsPeriodWithStock=0,clearnsPeriodWithoutStock=0,rateOfInterestWithInhouse=0,rateOfInterestWithoutInhouse=0;
	    				  if((value.targetCase - value.liftedCase) > 0)
	    					  pending = value.targetCase - value.liftedCase;
	    				  if(value.lastMonthSold > 0){
	    					  clearnsPeriodWithStock=((pending + value.inHouseStock) / value.lastMonthSold);
	    					  clearnsPeriodWithoutStock=(pending / value.lastMonthSold);
	    					 }
	    				  var profitForTheMonth = (value.dicsPerCase*100)/(value.caseRate);
	    				  if(profitForTheMonth > 0 && clearnsPeriodWithStock > 0){
	    					  rateOfInterestWithInhouse = (profitForTheMonth)/((pending + value.inHouseStock) / value.lastMonthSold);
	    				  }
	    				  if(profitForTheMonth > 0 && clearnsPeriodWithoutStock > 0){
	    					  rateOfInterestWithoutInhouse = (profitForTheMonth)/(pending / value.lastMonthSold);
	    				  }
	    				  
		    		  var input = {
		  	        		"brandNo":value.brandNo,
		  	        		"brandName":value.brandName,
		  	        		"caseRate":value.caseRate,
		  	        		"category":value.category,
		  	        		"company":value.company,
		  	        		"color":value.color,
		  	        		"categoryColor":value.categoryColor,
		  	        		"target":value.targetCase,
		  	        		"lastMonthSold":value.lastMonthSold,
		  	        		"companyOrder":value.companyOrder,
		  	        		"companyColor":value.companyColor,
		  	        		"estimationMonth":(clearnsPeriodWithStock).toFixed(2),
		  	        		"clearnsPeriodWithoutInhouseStock":(clearnsPeriodWithoutStock).toFixed(2),
		  	        		"inHouseStock":value.inHouseStock,
		  	        		"date":value.date,
		  	        		"estimateinhouseStock":value.inHouseStock,
		  	        		"dicsPerCase":value.dicsPerCase,
		  	        		"investment":(pending * value.caseRate),
		  	        		"rateOfInterestWithInhouse":(rateOfInterestWithInhouse).toFixed(2),
		  	        		"rateOfInterestWithoutInhouse":(rateOfInterestWithoutInhouse).toFixed(2),
		  	        		"totalDiscount":Math.round(pending * value.dicsPerCase),
		  	        		"liftedCase":value.liftedCase,
		  	        		"companyId":value.companyId,
		  	        		"discountPer":((value.dicsPerCase * 100)/value.caseRate).toFixed(2)+"%",
		  	        		"pending":pending,
		  	        		"adjustment": value.pending,
		  	        		"saleSheetOrder":value.saleSheetOrder,
		  	        		"splitPackType":value.splitPackType
		    		  };
		        	  inputjson.push(input);
		        	  
		         		 var input = {
		      	        		"brandNo":value.brandNo+"",
		      	        		"discountAmount":value.dicsPerCase+"",
		      	        		"adjustment":value.pending,
		      	        		"discountTotalAmount":Math.round((value.dicsPerCase * (value.liftedCase+value.pending)))+"",
		      	        		"companyId":value.comapnyId+"",
		      	        		"target":value.targetCase,
		      	        		"totalDiscount":(value.dicsPerCase * (value.liftedCase+value.pending))+""
		      	        };
		      	        json.discountDetails.push(input);
		         		   
		      		   });
		    		  $scope.alldetails = inputjson;
			          $scope.categoryList = inputjson;
			          
		         	 if((Object.keys(json.discountDetails).length) > 0)
		         		saveDiscountDataSecond(json);
		         // console.log(JSON.stringify(inputjson));
		    	  }, function myError(response) {
		    	  });
				   
	 }
	 function saveDiscountDataSecond(json){
		 var date = $("#monthlyDate").val();
		 var myUrl = window.location.href;
		  var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		  var discountListUrl = url+"saveStockLiftWithDiscountDataFromDiscountEstimate?date="+date;
					$http({
					    method : "POST",
					    contentType : 'application/json; charset=utf-8',
					    data: JSON.stringify(json),
					    url : discountListUrl,
					    headers: { 'x-my-custom-header': ip }
					  }).then(function mySuccess(response) {
						  $("#wait").css("display", "none");
					  }, function myError(response) {
						  $("#wait").css("display", "none");
					  });
					
		  }
$scope.calculateTotalDicount = function(discountAmt,inHouseCase,brandNo,lastMonthSold,caseRate){
	var discPercentage = (discountAmt * 100)/caseRate;
	if(!isNaN(discPercentage) && discPercentage !="Infinity" && discPercentage >0)
		$('#discPercentage'+brandNo).html((discPercentage).toFixed(2)+"%");
	else
		$('#discPercentage'+brandNo).html(0+"%");
	
	var cases = parseFloat($('#pending'+brandNo).text());
	//var caseVal = parseFloat($('#pending'+brandNo).html());
	
	$('#totalDisc'+brandNo).html(Math.round((cases)*discountAmt));
	
	//var totalDiscount = Math.round(cases*discountAmt);
	//var investment = Math.round(cases*caseRate);
	//var discountandinvestment = ((totalDiscount * 100)/(investment));
	var estimationMonth = parseFloat((cases+inHouseCase)/lastMonthSold);
	var profitPerMonth = discPercentage/estimationMonth;
	if(!isNaN(profitPerMonth) && profitPerMonth !="Infinity" && profitPerMonth >0)
		$('#perMonth'+brandNo).html((profitPerMonth).toFixed(2)+"%");
	else
		$('#perMonth'+brandNo).html(0+"%");
	
	//var totalDiscountExclusive = parseInt(cases * discountAmt);
	//var investmentAmtExclusive = cases*caseRate;
	//var discountandinvestmentExclusive = ((totalDiscountExclusive * 100)/investmentAmtExclusive);
	var estimationMonthExclusive = parseFloat(cases/lastMonthSold);
	var profitPerMonthExclusive = discPercentage/estimationMonthExclusive;
	if(!isNaN(profitPerMonthExclusive) && profitPerMonthExclusive !="Infinity" && profitPerMonthExclusive >0)
		$('#perMonthExclude'+brandNo).html((profitPerMonthExclusive).toFixed(2)+"%");
	else
		$('#perMonthExclude'+brandNo).html(0+"%");
	
	
	var totalDisVa=0,totalInvst=0,clearans=0,indx=0;
	var table = $("#discounttab tbody");
	table.find('tr').each(function (i) {
		 var $tds = $(this).find('td'),
		 val1 = parseFloat($tds.eq(10).text()),
		 val2 = parseFloat($tds.eq(11).text()),
		 val3 = parseFloat($tds.eq(13).text())
		 
		 totalDisVa +=val2;
		 if(val1 > 0)
		 totalInvst +=val1;
		 if(val3 > 0){
			 indx++;
			 clearans +=val3;
		 }
	 });
	$("#TotalInvestment").text(totalInvst);
	$("#discountAmt").text(totalDisVa);
	$("#clearns").text(Math.round(clearans/indx));
};


$scope.onChnage = function(targetcase,inhouseStock,id,caserate,lastMonthSold,liftedCase){
	var targetcaserate = targetcase - liftedCase;
	$('#pending'+id).html(targetcaserate);
	
	$('#investment'+id).html(Math.round(caserate*targetcaserate));
	
	var estimationMonth = (targetcaserate+inhouseStock)/lastMonthSold;
	if(!isNaN(estimationMonth) && estimationMonth !="Infinity" && estimationMonth >0)
	$('#estimationMonth'+id).html((estimationMonth).toFixed(2));
	else
		$('#estimationMonth'+id).html(0);
	
	var estimationMonthExclusive = (targetcaserate)/lastMonthSold;
	if(!isNaN(estimationMonthExclusive) && estimationMonthExclusive !="Infinity" && estimationMonthExclusive >0)
	$('#estimationMonthExclude'+id).html((estimationMonthExclusive).toFixed(2));
	else
		$('#estimationMonthExclude'+id).html(0);
	
	var discount = $('#discPerCase'+id).val();
	$('#totalDisc'+id).html(Math.round((targetcaserate)*discount));
	
	/*var totalDiscount = parseInt(targetcaserate*discount);
	var discountandinvestment = ((totalDiscount*100)/(caserate*targetcaserate));*/
	var discountPer = ((discount*100)/(caserate));
	var profitPerMonth = discountPer/((targetcaserate+inhouseStock)/lastMonthSold);
	if(!isNaN(profitPerMonth) && profitPerMonth !="Infinity" && profitPerMonth >0)
	$('#perMonth'+id).html((profitPerMonth).toFixed(2)+"%");
	else
		$('#perMonth'+id).html(0+"%");
	
	/*var totalDiscountExclusive = parseInt(targetcaserate*discount);
	var discountandinvestmentExclusive = ((totalDiscountExclusive*100)/(caserate*targetcaserate));*/
	var profitPerMonthExclusive = discountPer/(targetcaserate/lastMonthSold);
	if(!isNaN(profitPerMonthExclusive) && profitPerMonthExclusive !="Infinity" && profitPerMonthExclusive >0)
	$('#perMonthExclude'+id).html((profitPerMonthExclusive).toFixed(2)+"%");
	else
		$('#perMonthExclude'+id).html(0+"%");
	

	var totalDisVa=0,totalInvst=0,clearans=0,indx=0;
	var table = $("#discounttab tbody");
	table.find('tr').each(function (i) {
		 var $tds = $(this).find('td'),
		 val1 = parseFloat($tds.eq(10).text()),
		 val2 = parseFloat($tds.eq(11).text()),
		 val3 = parseFloat($tds.eq(13).text())
		 
		 totalDisVa +=val2;
		 if(val1 > 0)
		 totalInvst +=val1;
		 if(val3 > 0){
			 indx++;
			 clearans +=val3;
		 }
	 });
	$("#TotalInvestment").text(totalInvst);
	$("#discountAmt").text(totalDisVa);
	$("#clearns").text(Math.round(clearans/indx));
  };
  $scope.calculateVal = function(id){
	  var totalDisVa=0,totalInvst=0,clearans=0,indx=0;
	  $.each($scope.categoryList, function (index, value) {
		  if(value.company == id && value.investment > 0){
			  totalInvst += value.investment;
			  totalDisVa += value.totalDiscount;
		  }
		  if(value.company == id && value.estimationMonth > 0){
			  indx++;
			  clearans += value.estimationMonth;
		  }
		  if(id == "" && value.totalDiscount > 0){
			  totalInvst += value.investment;
			  totalDisVa += value.totalDiscount;
		  }
		  if(id == "" && value.estimationMonth > 0){
			  indx++;
			  clearans += value.estimationMonth;
		  }
	  });
	  $("#TotalInvestment").text(totalInvst);
	  $("#discountAmt").text(totalDisVa);
	  $("#clearns").text(Math.round(clearans/indx));
	 };
  
$scope.deleteRow = function(tableID){
	try {
		var table = document.getElementById(tableID);
		var rowCount = table.rows.length;

		for(var i=0; i<rowCount; i++) {
			var row = table.rows[i];
			var chkbox = row.cells[0].childNodes[0];
			if(null != chkbox && true == chkbox.checked) {
				table.deleteRow(i);
				rowCount--;
				i--;
			}

		}
		}catch(e) {
			alert(e);
		}
		var totalDisVa=0,totalInvst=0,clearans=0,indx=0;
		var table = $("#discounttab tbody");
		table.find('tr').each(function (i) {
			 var $tds = $(this).find('td'),
			 val1 = parseFloat($tds.eq(10).text()),
			 val2 = parseFloat($tds.eq(11).text()),
			 val3 = parseFloat($tds.eq(13).text())
			 
			 totalDisVa +=val2;
			 if(val1 > 0)
			 totalInvst +=val1;
			 if(val3 > 0){
				 indx++;
				 clearans +=val3;
			 }
		 });
		$("#TotalInvestment").text(totalInvst);
		$("#discountAmt").text(totalDisVa);
		$("#clearns").text(Math.round(clearans/indx));
};

// for second Table 

$scope.calculateTotalDicountSec = function(discountAmt,inHouseCase,brandNo,lastMonthSold,caseRate){
	var discPercentage = (discountAmt * 100)/caseRate;
	if(!isNaN(discPercentage) && discPercentage !="Infinity" && discPercentage >0)
		$('#discPercentageSec'+brandNo).html((discPercentage).toFixed(2)+"%");
	else
		$('#discPercentageSec'+brandNo).html(0+"%");
	
	var cases = parseFloat($('#pendingSec'+brandNo).text());
	//var caseVal = parseFloat($('#pending'+brandNo).html());
	
	$('#totalDiscSec'+brandNo).html(Math.round((cases)*discountAmt));
	
	//var totalDiscount = Math.round(cases*discountAmt);
	//var investment = Math.round(cases*caseRate);
	//var discountandinvestment = ((totalDiscount * 100)/(investment));
	var estimationMonth = parseFloat((cases+inHouseCase)/lastMonthSold);
	var profitPerMonth = discPercentage/estimationMonth;
	if(!isNaN(profitPerMonth) && profitPerMonth !="Infinity" && profitPerMonth >0)
		$('#perMonthSec'+brandNo).html((profitPerMonth).toFixed(2)+"%");
	else
		$('#perMonthSec'+brandNo).html(0+"%");
	
	//var totalDiscountExclusive = parseInt(cases * discountAmt);
	//var investmentAmtExclusive = cases*caseRate;
	//var discountandinvestmentExclusive = ((totalDiscountExclusive * 100)/investmentAmtExclusive);
	var estimationMonthExclusive = parseFloat(cases/lastMonthSold);
	var profitPerMonthExclusive = discPercentage/estimationMonthExclusive;
	if(!isNaN(profitPerMonthExclusive) && profitPerMonthExclusive !="Infinity" && profitPerMonthExclusive >0)
		$('#perMonthExcludeSec'+brandNo).html((profitPerMonthExclusive).toFixed(2)+"%");
	else
		$('#perMonthExcludeSec'+brandNo).html(0+"%");
	
	
	var totalDisVa=0,totalInvst=0,clearans=0,indx=0;
	var table = $("#discounttabSec tbody");
	table.find('tr').each(function (i) {
		 var $tds = $(this).find('td'),
		 val1 = parseFloat($tds.eq(10).text()),
		 val2 = parseFloat($tds.eq(11).text()),
		 val3 = parseFloat($tds.eq(13).text())
		 
		 totalDisVa +=val2;
		 if(val1 > 0)
		 totalInvst +=val1;
		 if(val3 > 0){
			 indx++;
			 clearans +=val3;
		 }
	 });
	$("#TotalInvestmentSec").text(totalInvst);
	$("#discountAmtSec").text(totalDisVa);
	$("#clearnsSec").text(Math.round(clearans/indx));
};


$scope.onChnageSec = function(targetcase,inhouseStock,id,caserate,lastMonthSold,liftedCase){
	//var newcaserate = targetcaserate - liftedCase;
	//$('#pending'+id).html(newcaserate);
	var targetcaserate = targetcase - liftedCase;
	$('#pendingSec'+id).html(targetcaserate);
	
	$('#investmentSec'+id).html(Math.round(caserate*targetcaserate));
	
	var estimationMonth = (targetcaserate+inhouseStock)/lastMonthSold;
	if(!isNaN(estimationMonth) && estimationMonth !="Infinity" && estimationMonth >0)
	$('#estimationMonthSec'+id).html((estimationMonth).toFixed(2));
	else
		$('#estimationMonthSec'+id).html(0);
	
	var estimationMonthExclusive = (targetcaserate)/lastMonthSold;
	if(!isNaN(estimationMonthExclusive) && estimationMonthExclusive !="Infinity" && estimationMonthExclusive >0)
	$('#estimationMonthExcludeSec'+id).html((estimationMonthExclusive).toFixed(2));
	else
		$('#estimationMonthExcludeSec'+id).html(0);
	
	var discount = $('#discPerCaseSec'+id).val();
	$('#totalDiscSec'+id).html(Math.round((targetcaserate)*discount));
	
	//var totalDiscount = parseInt(targetcaserate*discount);
	//var discountandinvestment = ((totalDiscount*100)/(caserate*targetcaserate));
	var discountPer = ((discount*100)/(caserate));
	var profitPerMonth = discountPer/((targetcaserate+inhouseStock)/lastMonthSold);
	if(!isNaN(profitPerMonth) && profitPerMonth !="Infinity" && profitPerMonth >0)
	$('#perMonthSec'+id).html((profitPerMonth).toFixed(2)+"%");
	else
		$('#perMonthSec'+id).html(0+"%");
	
	//var totalDiscountExclusive = parseInt(targetcaserate*discount);
//	var discountandinvestmentExclusive = ((totalDiscountExclusive*100)/(caserate*targetcaserate));
	var profitPerMonthExclusive = discountPer/(targetcaserate/lastMonthSold);
	if(!isNaN(profitPerMonthExclusive) && profitPerMonthExclusive !="Infinity" && profitPerMonthExclusive >0)
	$('#perMonthExcludeSec'+id).html((profitPerMonthExclusive).toFixed(2)+"%");
	else
		$('#perMonthExcludeSec'+id).html(0+"%");
	

	var totalDisVa=0,totalInvst=0,clearans=0,indx=0;
	var table = $("#discounttabSec tbody");
	table.find('tr').each(function (i) {
		 var $tds = $(this).find('td'),
		 val1 = parseFloat($tds.eq(10).text()),
		 val2 = parseFloat($tds.eq(11).text()),
		 val3 = parseFloat($tds.eq(13).text())
		 
		 totalDisVa +=val2;
		 if(val1 > 0)
		 totalInvst +=val1;
		 if(val3 > 0){
			 indx++;
			 clearans +=val3;
		 }
	 });
	$("#TotalInvestmentSec").text(totalInvst);
	$("#discountAmtSec").text(totalDisVa);
	$("#clearnsSec").text(Math.round(clearans/indx));
  };
  $scope.calculateValSec = function(id){
	  var totalDisVa=0,totalInvst=0,clearans=0,indx=0;
	  $.each($scope.categoryList, function (index, value) {
		  if(value.company == id && value.investment > 0){
			  totalInvst += value.investment;
			  totalDisVa += value.totalDiscount;
		  }
		  if(value.company == id && value.estimationMonth > 0){
			  indx++;
			  clearans += value.estimationMonth;
		  }
		  if(id == "" && value.totalDiscount > 0){
			  totalInvst += value.investment;
			  totalDisVa += value.totalDiscount;
		  }
		  if(id == "" && value.estimationMonth > 0){
			  indx++;
			  clearans += value.estimationMonth;
		  }
	  });
	  $("#TotalInvestmentSec").text(totalInvst);
	  $("#discountAmtSec").text(totalDisVa);
	  $("#clearnsSec").text(Math.round(clearans/indx));
	 };
  
		
$scope.deleteRowSec = function(tableID){
	try {
		var table = document.getElementById(tableID);
		var rowCount = table.rows.length;

		for(var i=0; i<rowCount; i++) {
			var row = table.rows[i];
			var chkbox = row.cells[0].childNodes[0];
			if(null != chkbox && true == chkbox.checked) {
				table.deleteRow(i);
				rowCount--;
				i--;
			}

		}
		}catch(e) {
			alert(e);
		}
		var totalDisVa=0,totalInvst=0,clearans=0,indx=0;
		var table = $("#discounttabSec tbody");
		table.find('tr').each(function (i) {
			 var $tds = $(this).find('td'),
			 val1 = parseFloat($tds.eq(10).text()),
			 val2 = parseFloat($tds.eq(11).text()),
			 val3 = parseFloat($tds.eq(13).text())
			 
			 totalDisVa +=val2;
			 if(val1 > 0)
			 totalInvst +=val1;
			 if(val3 > 0){
				 indx++;
				 clearans +=val3;
			 }
		 });
		$("#TotalInvestmentSec").text(totalInvst);
		$("#discountAmtSec").text(totalDisVa);
		$("#clearnsSec").text(Math.round(clearans/indx));
};
$scope.savediscountDetailsSec = function(){
	  var json = {
		    	"discountDetails": [],
		}
	  
		var table = $("#discounttabSec tbody");
		 table.find('tr').each(function (i) {
		        var $tds = $(this).find('td'),
		            brandNo = $tds.eq(2).text(),
		            liftedCase = parseInt($tds.eq(6).text()),
		            Adjustment = parseInt($tds.eq(18).text()),
		            companyId = $tds.eq(17).text()
		            
		            var discountAmount = $('#discPerCaseSec'+brandNo).val();
		            var targetVal =  parseInt($('#newcaseSec'+brandNo).val());
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
		        		"discountTotalAmount":Math.round((discountAmount * (liftedCase+Adjustment)))+"",
		        		"companyId":companyId,
		        		"target":targetVal,
		        		"totalDiscount":(discountAmount * (liftedCase+Adjustment))+""
		        };
		        json.discountDetails.push(input);
		    });
		 if((Object.keys(json.discountDetails).length) > 0)
		saveDiscountData(json);
	};
	$scope.savediscountDetails = function(){
		  var json = {
			    	"discountDetails": [],
			}
		  
			var table = $("#discounttab tbody");
			 table.find('tr').each(function (i) {
			        var $tds = $(this).find('td'),
			            brandNo = $tds.eq(2).text(),
			            liftedCase = parseInt($tds.eq(6).text()),
			            Adjustment = parseInt($tds.eq(18).text()),
			            companyId = $tds.eq(17).text()
			            
			            var discountAmount = $('#discPerCase'+brandNo).val();
			            var targetVal =  parseInt($('#newcase'+brandNo).val());
			            if(isNaN(discountAmount)){
			            	discountAmount=0;
				             }
			            if(isNaN(targetVal)){
			            	targetVal=0;
				             }
			        var input = {
			        		"brandNo":brandNo,
			        		"discountAmount":discountAmount+"",
			        		"adjustment":Adjustment,
			        		"discountTotalAmount":Math.round((discountAmount * (liftedCase+Adjustment)))+"",
			        		"companyId":companyId,
			        		"target":targetVal,
			        		"totalDiscount":(discountAmount * (liftedCase+Adjustment))+""
			        };
			        json.discountDetails.push(input);
			    });
			 if((Object.keys(json.discountDetails).length) > 0)
			saveDiscountData(json);
		};
	function saveDiscountData(json){
		var date = $("#monthlyDate").val();
		 var myUrl = window.location.href;
		  var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		  var discountListUrl = url+"saveStockLiftWithDiscountDataFromDiscountEstimate?date="+date;
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
  
});
app.filter("clearns", function() {
    return function(data, index) {
        var s = 0,indx=0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
        	if(alldetails.estimationMonth > 0){
             s += alldetails.estimationMonth;
             indx ++;
        	}
        });
        return Math.round(s/indx);
    };
})
app.filter("TotalDiscount", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
        	if(alldetails.totalDiscount > 0)
             s += alldetails.totalDiscount;
        });
        return Math.ceil(s);
    };
})
app.filter("TotalInvestment", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
        	if(alldetails.investment > 0)
             s += alldetails.investment;
        });
        return Math.ceil(s);
    };
})
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
