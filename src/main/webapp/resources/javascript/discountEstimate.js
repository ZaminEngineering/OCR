var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	$(".reportWithoutEntry").hide();
	 $('input.monthpicker').monthpicker({changeYear:true,dateFormat: "yy-mm-01" });
	
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
		    	var transactionUrl = url+"getDiscountEsitmateDetails?date="+date;
		    	$http({
		    	    method : "GET",
		    	    url : transactionUrl
		    	  }).then(function mySuccess(response) {
		    		  console.log(JSON.stringify(response.data));
		    		  var inputjson = [];
		    		  $.each(response.data, function (index, value) {
		    		  var input = {
		  	        		"brandNo":value.brandNo,
		  	        		"brandName":value.brandName,
		  	        		"caseRate":value.caseRate,
		  	        		"category":value.category,
		  	        		"company":value.company,
		  	        		"color":value.color,
		  	        		"target":value.targetCase,
		  	        		"lastMonthSold":value.lastMonthSold,
		  	        		"companyOrder":value.companyOrder,
		  	        		"companyColor":value.companyColor,
		  	        		"estimationMonth":value.clearnsPeriod,
		  	        		"clearnsPeriodWithoutInhouseStock":value.clearnsPeriodWithoutInhouseStock,
		  	        		"inHouseStock":value.inHouseStock,
		  	        		"date":value.date,
		  	        		"estimateinhouseStock":value.estimateinhouseStock,
		  	        		"dicsPerCase":value.dicsPerCase,
		  	        		"investment":value.investment,
		  	        		"rateOfInterestWithInhouse":value.rateOfInterestWithInhouse,
		  	        		"rateOfInterestWithoutInhouse":value.rateOfInterestWithoutInhouse,
		  	        		"totalDiscount":value.totalDiscount,
		  	        		"liftedCase":value.liftedCase,
		  	        		"companyId":value.companyId,
		  	        		"discountPer":((value.dicsPerCase * 100)/value.caseRate).toFixed(2)+"%",
		  	        		"pending":value.pending
		    		  };
		        	  inputjson.push(input);
		          });
		          $scope.alldetails = inputjson;
		          $scope.categoryList = inputjson;
		         // console.log(JSON.stringify(inputjson));
		          
		          var json = {"discountDetails": []};
		          $.each(inputjson, function(index, value){
		          if(value.target > 0 || value.dicsPerCase > 0){
				        var input = {
				        		"brandNo":(value.brandNo).toString(),
				        		"caseRate":value.caseRate,
				        		"inHouseStock":value.inHouseStock,
				        		"target":value.target,
				        		"discountAmount":value.dicsPerCase,
				        		"investment":(value.investment).toString(),
				        		"totalDiscount":(value.totalDiscount).toString(),
				        		"lastMonthSold":value.lastMonthSold,
				        		"estimationMonthIncludeInhouse":(value.estimationMonth).toString(),
				        		"estimationMonthExcludeInhouse":(value.clearnsPeriodWithoutInhouseStock).toString(),
				        		"rateOfInterestWithInhouse":(value.rateOfInterestWithInhouse).toString(),
				        		"rateOfInterestWithoutInhouse":(value.rateOfInterestWithoutInhouse).toString(),
				        		"companyId":value.companyId,
				        		"liftedAndDiscount":(value.liftedCase * value.dicsPerCase),
				        		"date":value.date,
				        		"pending":value.pending
				        };
				        json.discountDetails.push(input);
		              }
		             });
		           saveDiscountDataOnLoad(json); // onload
		          
		    	  }, function myError(response) {
		    	  });
				   
	 }
	 function saveDiscountDataOnLoad(json) {
			var myUrl = window.location.href;
			var url1 = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
			   $.ajax({
				  async:false,
			      type: "POST",
			      contentType : 'application/json; charset=utf-8',
			      //dataType : 'json',
			      url: url1+"/saveDiscountEsitmateDetails",
			      data: JSON.stringify(json), // Note it is important
			      success: function (data) {
			    	// alert(data.message); 
			    	 // $("#mymessage").text("");
			    		// location.reload();
			      },
			      error: function (data) {
			    	  //alert(data+"error");
			    	 // location.reload();
			      }
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
	
	var totalDiscount = Math.round(cases*discountAmt);
	var investment = Math.round(cases*caseRate);
	var discountandinvestment = ((totalDiscount * 100)/(investment));
	var estimationMonth = parseFloat((cases+inHouseCase)/lastMonthSold);
	var profitPerMonth = discountandinvestment/estimationMonth;
	if(!isNaN(profitPerMonth) && profitPerMonth !="Infinity" && profitPerMonth >0)
		$('#perMonth'+brandNo).html((profitPerMonth).toFixed(2)+"%");
	else
		$('#perMonth'+brandNo).html(0+"%");
	
	var totalDiscountExclusive = parseInt(cases * discountAmt);
	var investmentAmtExclusive = cases*caseRate;
	var discountandinvestmentExclusive = ((totalDiscountExclusive * 100)/investmentAmtExclusive);
	var estimationMonthExclusive = parseFloat(cases/lastMonthSold);
	var profitPerMonthExclusive = discountandinvestmentExclusive/estimationMonthExclusive;
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
	
	var totalDiscount = parseInt(targetcaserate*discount);
	var discountandinvestment = ((totalDiscount*100)/(caserate*targetcaserate));
	var profitPerMonth = discountandinvestment/((targetcaserate+inhouseStock)/lastMonthSold);
	if(!isNaN(profitPerMonth) && profitPerMonth !="Infinity" && profitPerMonth >0)
	$('#perMonth'+id).html((profitPerMonth).toFixed(2)+"%");
	else
		$('#perMonth'+id).html(0+"%");
	
	var totalDiscountExclusive = parseInt(targetcaserate*discount);
	var discountandinvestmentExclusive = ((totalDiscountExclusive*100)/(caserate*targetcaserate));
	var profitPerMonthExclusive = discountandinvestmentExclusive/(targetcaserate/lastMonthSold);
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
  
	 $scope.savediscountDetails = function(){
		 var json = {"discountDetails": []};
		  
			var table = $("#discounttab tbody");
			 table.find('tr').each(function (i) {
			        var $tds = $(this).find('td'),
			            select = $tds.eq(0).text(),
			            brandName = $tds.eq(1).text(),
			            brandNo = $tds.eq(2).text(),
			            caseRate = $tds.eq(3).text(),
			            inHouseStock = $tds.eq(4).text(),
			            lastMonthSold = $tds.eq(5).text(),
			            liftedCase = parseInt($tds.eq(6).text()),
			            target = $tds.eq(7).text(),
			            pending = parseInt($tds.eq(8).text()),
			            discPerCase = $tds.eq(9).text(),
			            investment = $tds.eq(10).text(),
			            totalDiscount = $tds.eq(11).text(),
			            discountPer = $tds.eq(12).text(),
			            estimationMonthIncludeInhouse = $tds.eq(13).text(),
			            estimationMonthExcludeInhouse = $tds.eq(14).text(),
			            rateOfInterestWithInhouse = $tds.eq(15).text(),
			            rateOfInterestWithoutInhouse = $tds.eq(16).text(),
			            companyId = $tds.eq(17).text()
			            
			            var target = parseInt($('#newcase'+brandNo).val());
			            var discountAmount = parseInt($('#discPerCase'+brandNo).val());
			            var date = $('#monthlyDate').val();
			            if(target > 0 || discountAmount > 0){
			        var input = {
			        		"brandNo":brandNo,
			        		"caseRate":caseRate,
			        		"inHouseStock":inHouseStock,
			        		"target":target,
			        		"discountAmount":discountAmount,
			        		"investment":investment,
			        		"totalDiscount":totalDiscount,
			        		"lastMonthSold":lastMonthSold,
			        		"estimationMonthIncludeInhouse":estimationMonthIncludeInhouse,
			        		"estimationMonthExcludeInhouse":estimationMonthExcludeInhouse,
			        		"rateOfInterestWithInhouse":rateOfInterestWithInhouse.slice(0,-1),
			        		"rateOfInterestWithoutInhouse":rateOfInterestWithoutInhouse.slice(0,-1),
			        		"companyId":companyId,
			        		"liftedAndDiscount":liftedCase * discountAmount,
			        		"date":date,
			        		"pending":pending
			        };
			        json.discountDetails.push(input);
			      }
			    });
			 if((Object.keys(json.discountDetails).length) > 0)
				 saveDiscountData(json);
		};
		
		function saveDiscountData(json) {
			var myUrl = window.location.href;
			var url1 = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
			   $.ajax({
				  async:false,
			      type: "POST",
			      contentType : 'application/json; charset=utf-8',
			      //dataType : 'json',
			      url: url1+"/saveDiscountEsitmateDetails",
			      data: JSON.stringify(json), // Note it is important
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
	
	var totalDiscount = Math.round(cases*discountAmt);
	var investment = Math.round(cases*caseRate);
	var discountandinvestment = ((totalDiscount * 100)/(investment));
	var estimationMonth = parseFloat((cases+inHouseCase)/lastMonthSold);
	var profitPerMonth = discountandinvestment/estimationMonth;
	if(!isNaN(profitPerMonth) && profitPerMonth !="Infinity" && profitPerMonth >0)
		$('#perMonthSec'+brandNo).html((profitPerMonth).toFixed(2)+"%");
	else
		$('#perMonthSec'+brandNo).html(0+"%");
	
	var totalDiscountExclusive = parseInt(cases * discountAmt);
	var investmentAmtExclusive = cases*caseRate;
	var discountandinvestmentExclusive = ((totalDiscountExclusive * 100)/investmentAmtExclusive);
	var estimationMonthExclusive = parseFloat(cases/lastMonthSold);
	var profitPerMonthExclusive = discountandinvestmentExclusive/estimationMonthExclusive;
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
	
	var totalDiscount = parseInt(targetcaserate*discount);
	var discountandinvestment = ((totalDiscount*100)/(caserate*targetcaserate));
	var profitPerMonth = discountandinvestment/((targetcaserate+inhouseStock)/lastMonthSold);
	if(!isNaN(profitPerMonth) && profitPerMonth !="Infinity" && profitPerMonth >0)
	$('#perMonthSec'+id).html((profitPerMonth).toFixed(2)+"%");
	else
		$('#perMonthSec'+id).html(0+"%");
	
	var totalDiscountExclusive = parseInt(targetcaserate*discount);
	var discountandinvestmentExclusive = ((totalDiscountExclusive*100)/(caserate*targetcaserate));
	var profitPerMonthExclusive = discountandinvestmentExclusive/(targetcaserate/lastMonthSold);
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
  
	 $scope.savediscountDetailsSec = function(){
		 var json = {"discountDetails": []};
		  
			var table = $("#discounttabSec tbody");
			 table.find('tr').each(function (i) {
			        var $tds = $(this).find('td'),
			            select = $tds.eq(0).text(),
			            brandName = $tds.eq(1).text(),
			            brandNo = $tds.eq(2).text(),
			            caseRate = $tds.eq(3).text(),
			            inHouseStock = $tds.eq(4).text(),
			            lastMonthSold = $tds.eq(5).text(),
			            liftedCase = parseInt($tds.eq(6).text()),
			            target = $tds.eq(7).text(),
			            pending = parseInt($tds.eq(8).text()),
			            discPerCase = $tds.eq(9).text(),
			            investment = $tds.eq(10).text(),
			            totalDiscount = $tds.eq(11).text(),
			            discountPer = $tds.eq(12).text(),
			            estimationMonthIncludeInhouse = $tds.eq(13).text(),
			            estimationMonthExcludeInhouse = $tds.eq(14).text(),
			            rateOfInterestWithInhouse = $tds.eq(15).text(),
			            rateOfInterestWithoutInhouse = $tds.eq(16).text(),
			            companyId = $tds.eq(17).text()
			            
			            var target = parseInt($('#newcaseSec'+brandNo).val());
			            var discountAmount = parseInt($('#discPerCaseSec'+brandNo).val());
			            var date = $('#monthlyDate').val();
			            if(target > 0 || discountAmount > 0){
			        var input = {
			        		"brandNo":brandNo,
			        		"caseRate":caseRate,
			        		"inHouseStock":inHouseStock,
			        		"target":target,
			        		"discountAmount":discountAmount,
			        		"investment":investment,
			        		"totalDiscount":totalDiscount,
			        		"lastMonthSold":lastMonthSold,
			        		"estimationMonthIncludeInhouse":estimationMonthIncludeInhouse,
			        		"estimationMonthExcludeInhouse":estimationMonthExcludeInhouse,
			        		"rateOfInterestWithInhouse":rateOfInterestWithInhouse.slice(0,-1),
			        		"rateOfInterestWithoutInhouse":rateOfInterestWithoutInhouse.slice(0,-1),
			        		"companyId":companyId,
			        		"liftedAndDiscount":liftedCase * discountAmount,
			        		"date":date,
			        		"pending":pending
			        };
			        json.discountDetails.push(input);
			      }
			    });
			 if((Object.keys(json.discountDetails).length) > 0)
				 saveDiscountData(json);
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
