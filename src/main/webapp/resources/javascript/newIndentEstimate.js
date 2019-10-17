var app = angular.module('myApp', []);
var myObj;

app.controller('myCtrl', function($scope, $http) {
	//$( "#datepicker" ).datepicker({ dateFormat: 'yy-mm-dd' }).datepicker("setDate", new Date());
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var callingUrl = url+"getDateAndDays";
	$http({
	    method : "GET",
	    url : callingUrl
	  }).then(function mySuccess(response) {
		  var custDate = formatDate(new Date());
		  $("#datepicker").val(custDate);
		  var enableDays = [custDate];
		  if(response.data.message != "" && response.data.message != null){
			  enableDays.push(response.data.message);
		  }
		  getTimeStamp(enableDays);
		  if(response.data.message != "" && response.data.message != null && response.data.customerId > 0){
			  $("#noOfDays").val(response.data.customerId);
			  if($("#datepicker").val() == response.data.message){
				  $("#noOfDays").val(response.data.customerId);
				  calculateIndentEstimate(response.data.customerId,response.data.message);
			  }
			  
		  }
			  
	  }, function myError(response) {
  
           });
	function formatDate(date) {
	    var d = new Date(date),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

	    return [year, month, day].join('-');
	}
	function getTimeStamp(enableDays){
		$("#datepicker").datepicker({
			  dateFormat: 'yy-mm-dd',  beforeShowDay: enableAllTheseDays,
			  numberOfMonths: 1,
			  onSelect: function(selected) {
			  $("#datepicker").datepicker("option","minDate", selected);
			  }
			  });
		    function enableAllTheseDays(date) {
		        var sdate = $.datepicker.formatDate( 'yy-mm-dd', date)
		        if($.inArray(sdate, enableDays) != -1) {
		            return [true];
		        }
		        return [false];
		    }
		    $('#datepicker').datepicker({dateFormat: 'yy-mm-dd', beforeShowDay: enableAllTheseDays});
	}
	$scope.getResults = function (){
		var noOfDays = $("#noOfDays").val();
		 var date = $("#datepicker").val();
		 if(validateCalendarField()==false){return false;}
		 calculateIndentEstimate(noOfDays,date);
		 
	}
	function validateCalendarField(){
		var noOfDays = $("#noOfDays").val();
		 var date = $("#datepicker").val();
		if(noOfDays == ""){
			alert("Please fill Days.");
			return false;
		}
		if(date == ""){
			alert("Please fill Date.");
			return false;
		}
		return true;
	}
	
function  calculateIndentEstimate(noOfDays,date){	
var myUrl = window.location.href;
var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
var productListUrl = url+"getDiscountEsitmateDataWithDays?noOfDays="+noOfDays+"&date="+date;
$http({
    method : "GET",
    url : productListUrl
  }).then(function mySuccess(response) {
	  console.log(JSON.stringify(response.data.discountEstimationBean));
	  $scope.month = response.data.date;
	  var inputjson = [];
	  var totalinvstval=0;
	  if(response.data.flag){
		  $.each(response.data.discountEstimationBean, function (index, value) {
			  var pendingVal = 0;
			  var pendingColor = "";
	    	  var pendingCase = value.commitment-value.liftedCase;
	    	  var needCase = 0;
	    	  if(pendingCase > 0){
	    		  if(value.needCase >= pendingCase)
	    		  needCase = value.needCase;
	    		  else
	    			  needCase = pendingCase;
	    		  pendingVal = pendingCase;
	    		  pendingColor = "#DAFAC4";
	    	  }
	    	  else{
	    		  needCase = value.needCase;
	    		  pendingVal = 0;
	    		  pendingColor = "#D6EAF8";
	    	  }
	    	  
	    	  var colorcode =0;
	    	  var p =value.pNeedCase,q=value.qNeedCase,l2=value.l2NeedCase,l1=value.l1NeedCase,n=value.nNeedCase,sb=value.sbNeedCase,d=value.dNeedCase,lb=value.lbNeedCase,tin=value.tinNeedCase,x=value.xNeedCase;
	    	  var totalcase = (value.p + value.q + value.l2 + value.l1 + value.n + value.sb + value.d + value.lb + value.tin);
	    	  var tempNeedCase = pendingCase -  value.needCase;
	    	  if(tempNeedCase > 0){
	    		  console.log("Shiva::")
	    		 p += stockDivive(value.p,tempNeedCase,totalcase);
	    		 q += stockDivive(value.q,tempNeedCase,totalcase);
	    		 l2 += stockDivive(value.l2,tempNeedCase,totalcase);
	    		 l1 += stockDivive(value.l1,tempNeedCase,totalcase);
	    		 n  += stockDivive(value.n,tempNeedCase,totalcase);
	    		 sb += stockDivive(value.sb,tempNeedCase,totalcase);
	    		 d  += stockDivive(value.d,tempNeedCase,totalcase);
	    		 lb += stockDivive(value.lb,tempNeedCase,totalcase);
	    		 tin += stockDivive(value.tin,tempNeedCase,totalcase);
	    		 x += stockDivive(value.x,tempNeedCase,totalcase);	
	    	     }
	    	    
	    	     if((needCase) > 0 || (value.commitment-value.liftedCase) > 0){
	    	    	 if((needCase) > 0 && (value.commitment-value.liftedCase) > 0)
	    	    		 colorcode=0;
	    	    	 else if((needCase) > 0 && (value.commitment-value.liftedCase) <= 0)
	    	    		 colorcode=1;
	    	    	 else 
	    	    		 colorcode=2;
	    	  var input = {
	    			    "colorcode":colorcode,
		        		"brandNo":value.brandNo,
		        		"brandName":value.brandName,
		        		"caseRate":value.caseRate,
		        		"category":value.category,
		        		"company":value.company,
		        		"noOfCases":value.noOfCases,
		        		"target":value.target,
		        		"lastMonthSold":value.lastMonthSold,
		        		"companyOrder":value.companyOrder,
		        		"companyColor":pendingColor,
		        		"estimationMonth":0,
		        		"inHouseStock":value.inHouseStock,
		        		"p":value.p,
		        		"q":value.q,
		        		"x":value.x,
		        		"l2":value.l2,
		        		"l1":value.l1,
		        		"n":value.n,
		        		"sb":value.sb,
		        		"d":value.d,
		        		"lb":value.lb,
		        		"tin":value.tin,
		        		"pNeedCase":value.pNeedCase,
		        		"qNeedCase":value.qNeedCase,
		        		"xNeedCase":value.xNeedCase,
		        		"l2NeedCase":value.l2NeedCase,
		        		"l1NeedCase":value.l1NeedCase,
		        		"nNeedCase":value.nNeedCase,
		        		"sbNeedCase":value.sbNeedCase,
		        		"dNeedCase":value.dNeedCase,
		        		"lbNeedCase":value.lbNeedCase,
		        		"tinNeedCase":value.tinNeedCase,
		        		"pSpecialMargin":value.pspecialMargin,
		        		"qSpecialMargin":value.qspecialMargin,
		        		"xSpecialMargin":value.xspecialMargin,
		        		"l2SpecialMargin":value.l2SpecialMargin,
		        		"l1SpecialMargin":value.l1SpecialMargin,
		        		"nSpecialMargin":value.nspecialMargin,
		        		"sbSpecialMargin":value.sbspecialMargin,
		        		"dSpecialMargin":value.dspecialMargin,
		        		"lbSpecialMargin":value.lbspecialMargin,
		        		"tinSpecialMargin":value.tinspecialMargin,
		        		"pStock":value.pstock,
		        		"qStock":value.qstock,
		        		"xStock":value.xstock,
		        		"l2Stock":value.l2Stock,
		        		"l1Stock":value.l1Stock,
		        		"nStock":value.nstock,
		        		"sbStock":value.sbstock,
		        		"dStock":value.dstock,
		        		"lbStock":value.lbstock,
		        		"tinStock":value.tinstock,
		        		"pending":pendingVal,
		        		"liftedCase":value.liftedCase,
		        		"commitment":value.commitment,
		        		"totalinvestment":(needCase * value.caseRate),
		        		"pVal":Math.round(p),
		        		"qVal":Math.round(q),
		        		"xVal":Math.round(x),
		        		"l2Val":Math.round(l2),
		        		"l1Val":Math.round(l1),
		        		"nVal":Math.round(n),
		        		"sbVal":Math.round(sb),
		        		"dVal":Math.round(d),
		        		"lbVal":Math.round(lb),
		        		"tinVal":Math.round(tin),
		        		"needCase":needCase,
		        		"OldneedCase":value.needCase,
		        		"productType":value.productType,
		        		"liftedCase":value.liftedCase,
		        		"totalSpecialMrp":((Math.round(p)*value.pspecialMargin)+(Math.round(q)*value.qspecialMargin)+(Math.round(x)*value.xspecialMargin)+
		        				(Math.round(l2)*value.l2SpecialMargin)+(Math.round(l1)*value.l1SpecialMargin)+(Math.round(n)*value.nspecialMargin)
		        				+(Math.round(sb)*value.sbspecialMargin)+(Math.round(d)*value.dspecialMargin)+(Math.round(lb)*value.lbspecialMargin)
		        				+(Math.round(tin)*value.tinspecialMargin))
		        };
	    	  inputjson.push(input);
	    	 }
	      });
	  }else{
		  $.each(response.data.discountEstimationBean, function (index, value) {
	    	  var colorcode =0;
	    	     if((value.needCase) > 0 || (value.otherPending) > 0){
	    	    	 if((value.needCase) > 0 && (value.otherPending) > 0)
	    	    		 colorcode=0;
	    	    	 else if((value.needCase) > 0 && (value.otherPending) <= 0)
	    	    		 colorcode=1;
	    	    	 else 
	    	    		 colorcode=2;
	    	  var input = {
	    			    "colorcode":colorcode,
		        		"brandNo":value.brandNo,
		        		"brandName":value.brandName,
		        		"caseRate":value.caseRate,
		        		"category":value.category,
		        		"company":value.company,
		        		"noOfCases":value.noOfCases,
		        		"target":value.target,
		        		"lastMonthSold":value.lastMonthSold,
		        		"companyOrder":value.companyOrder,
		        		"companyColor":value.companyColor,
		        		"estimationMonth":0,
		        		"inHouseStock":value.inHouseStock,
		        		"p":value.p,
		        		"q":value.q,
		        		"x":value.x,
		        		"l2":value.l2,
		        		"l1":value.l1,
		        		"n":value.n,
		        		"sb":value.sb,
		        		"d":value.d,
		        		"lb":value.lb,
		        		"tin":value.tin,
		        		"pNeedCase":value.pNeedCase,
		        		"qNeedCase":value.qNeedCase,
		        		"xNeedCase":value.xNeedCase,
		        		"l2NeedCase":value.l2NeedCase,
		        		"l1NeedCase":value.l1NeedCase,
		        		"nNeedCase":value.nNeedCase,
		        		"sbNeedCase":value.sbNeedCase,
		        		"dNeedCase":value.dNeedCase,
		        		"lbNeedCase":value.lbNeedCase,
		        		"tinNeedCase":value.tinNeedCase,
		        		"pSpecialMargin":value.pspecialMargin,
		        		"qSpecialMargin":value.qspecialMargin,
		        		"xSpecialMargin":value.xspecialMargin,
		        		"l2SpecialMargin":value.l2SpecialMargin,
		        		"l1SpecialMargin":value.l1SpecialMargin,
		        		"nSpecialMargin":value.nspecialMargin,
		        		"sbSpecialMargin":value.sbspecialMargin,
		        		"dSpecialMargin":value.dspecialMargin,
		        		"lbSpecialMargin":value.lbspecialMargin,
		        		"tinSpecialMargin":value.tinspecialMargin,
		        		"pStock":value.pstock,
		        		"qStock":value.qstock,
		        		"xStock":value.xstock,
		        		"l2Stock":value.l2Stock,
		        		"l1Stock":value.l1Stock,
		        		"nStock":value.nstock,
		        		"sbStock":value.sbstock,
		        		"dStock":value.dstock,
		        		"lbStock":value.lbstock,
		        		"tinStock":value.tinstock,
		        		"pending":value.otherPending,
		        		"liftedCase":value.liftedCase,
		        		"commitment":value.commitment,
		        		"totalinvestment":value.otherInvestment,
		        		"pVal":value.pVal,
		        		"qVal":value.qVal,
		        		"xVal":value.xVal,
		        		"l2Val":value.l2Val,
		        		"l1Val":value.l1Val,
		        		"nVal":value.nVal,
		        		"sbVal":value.sbVal,
		        		"dVal":value.dVal,
		        		"lbVal":value.lbVal,
		        		"tinVal":value.tinVal,
		        		"needCase":value.needCase,
		        		"OldneedCase":value.needCase,
		        		"productType":value.productType,
		        		"liftedCase":value.liftedCase,
		        		"totalSpecialMrp":value.totalSpecialMrp
		        };
	    	  inputjson.push(input);
	    	 }
	      });
	  }
      $scope.alldetails = inputjson;
      $scope.categoryList = inputjson;
     // console.log(JSON.stringify(inputjson));
    
  }, function myError(response) {
    //alert(response);
  });

}
$scope.calculateUpdatedNeedCase = function(targetcase,brandNo,caserate,L2,L1,Q,P,N,D,sb,lb,tin,SpecialMarginL2,SpecialMarginL1,SpecialMarginQ,SpecialMarginP,SpecialMarginN,SpecialMarginD,SpecialMarginsb,SpecialMarginlb,SpecialMargintin,L2NeedCase,L1NeedCase,QNeedCase,PNeedCase,NNeedCase,DNeedCase,sbNeedCase,lbNeedCase,tinNeedCase){
	var totalMrpRoundOffWithSpecialMrp = 0;
	
	$('#investment'+brandNo).html(Math.round(targetcase*caserate));
	var tempNeedCase = (L2NeedCase + L1NeedCase + QNeedCase+PNeedCase + NNeedCase + DNeedCase + sbNeedCase + lbNeedCase + tinNeedCase);
	var noofcases= targetcase - tempNeedCase;
	var p=PNeedCase,q=QNeedCase,l2=L2NeedCase,l1=L1NeedCase,n=NNeedCase,sb=sbNeedCase,d=DNeedCase,lb=lbNeedCase,tin=tinNeedCase;
	var totalcases=(L2+L1+Q+P+N+D+sb+lb+tin);
	if(targetcase >= tempNeedCase){
		 p += stockDivive(P,noofcases,totalcases);
		 q += stockDivive(Q,noofcases,totalcases);
		 l2 += stockDivive(L2,noofcases,totalcases);
		 l1 += stockDivive(L1,noofcases,totalcases);
		 n  += stockDivive(N,noofcases,totalcases);
		 sb += stockDivive(sb,noofcases,totalcases);
		 d  += stockDivive(D,noofcases,totalcases);
		 lb += stockDivive(lb,noofcases,totalcases);
		 tin += stockDivive(tin,noofcases,totalcases);
		 
	}else{
		 p=0,q=0,l2=0,l1=0,n=0,sb=0,d=0,lb=0,tin=0;
		// alert("Minimum "+tempNeedCase+" Case should be Indented for respective days!");
		/* $("#newcase"+brandNo).val(tempNeedCase);
		 $('#investment'+brandNo).html(Math.round(tempNeedCase*caserate));*/
	}/*else{
		p=0,q=0,l2=0,l1=0,n=0,sb=0,d=0,lb=0,tin=0;
	}*/
	 $('#2l'+brandNo).html(Math.round(l2));
	 $('#1l'+brandNo).html(Math.round(l1));
	 $('#q'+brandNo).html(Math.round(q));
	 $('#p'+brandNo).html(Math.round(p));
	 $('#n'+brandNo).html(Math.round(n));
	 $('#d'+brandNo).html(Math.round(d));
	 $('#sb'+brandNo).html(Math.round(sb));
	 $('#lb'+brandNo).html(Math.round(lb));
	 $('#tin'+brandNo).html(Math.round(tin));
	 totalMrpRoundOffWithSpecialMrp = ((Math.round(l2)*SpecialMarginL2)+(Math.round(l1)*SpecialMarginL1)+(Math.round(q)*SpecialMarginQ)
			 +(Math.round(p)*SpecialMarginP)+(Math.round(n)*SpecialMarginN)+(Math.round(d)*SpecialMarginD)+(Math.round(sb)*SpecialMarginsb)
			 +(Math.round(lb)*SpecialMarginlb)+(Math.round(tin)*SpecialMargintin));
	 $('#specialMrp'+brandNo).html(Math.round(totalMrpRoundOffWithSpecialMrp));
	
	var indentEstimate=0;
	var ttlMrpRoundoff = 0;
	var table = $("#indentEstimate tbody");
	table.find('tr').each(function (i) {
		 var $tds = $(this).find('td'),
		 val1 = parseFloat($tds.eq(10).text()),
		 val2 = parseFloat($tds.eq(20).text())
		 
		 if(val1 > 0)
			 indentEstimate +=val1;
		 if(val2 > 0)
			 ttlMrpRoundoff +=val2;
		
	 });
	$("#TotalestimateInvestment").text(indentEstimate);
	$("#TotalestimateSpecialMargin").text(Math.round(ttlMrpRoundoff));
	$("#tcsValue").text(Math.round((indentEstimate*1)/100));
	$("#turnOverTax").text(Math.round((indentEstimate*13.6)/100));
	$("#sumOfInvestmentAmt").text(Math.round(indentEstimate+ttlMrpRoundoff+((indentEstimate*1)/100)+ ((indentEstimate*13.6)/100)));
	
  };
  
  
$scope.buildModelPopupData = function(){
    $('#addBtnForNewProduct').css('display','none');
	var array1 =[];
	var table = $("#indentEstimate tbody");
	table.find('tr').each(function (i) {
		 var $tds = $(this).find('td'),
		 name = $tds.eq(1).text(),
		 brandNo = parseFloat($tds.eq(2).text())
		 var input = {
     		"brandName":name,
     		"brandNo":brandNo
     };
		 array1.push(input);
	 });
	
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getDistinctBrandNameAndNo.json";
	$http({
	    method : "GET",
	    url : productListUrl
	  }).then(function mySuccess(response) {
		  $scope.productList = response.data;
		  var array2 = $scope.productList;
		  remove_duplicates(array1,array2);
		  var brand =new Array();
		  $.each(array2, function (index, value) {
			  brand.push(value.brandName+" "+value.brandNo);
	      });
		  $("#brandNoVal").select2({
			  data: brand
			});
		  $("#myModal").modal("show");
		  
	  }, function myError(response) {
	    //alert(response);
	  });
	
	
}

$scope.greaterThan = function(prop, val){
    return function(item){
      return item[prop] > val;
    }
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
		var indentEstimate=0;
		var ttlMrpRoundoff = 0;
		var table = $("#indentEstimate tbody");
		table.find('tr').each(function (i) {
			 var $tds = $(this).find('td'),
			 val1 = parseFloat($tds.eq(10).text()),
			 val2 = parseFloat($tds.eq(20).text())
			 
			 if(val1 > 0)
				 indentEstimate +=val1;
			 if(val2 > 0)
				 ttlMrpRoundoff +=val2;
			
		 });
		$("#TotalestimateInvestment").text(indentEstimate);
		$("#TotalestimateSpecialMargin").text(Math.round(ttlMrpRoundoff));
		$("#tcsValue").text(Math.round((indentEstimate*1)/100));
		$("#turnOverTax").text(Math.round((indentEstimate*13.6)/100));
		$("#sumOfInvestmentAmt").text(Math.round(indentEstimate+ttlMrpRoundoff+((indentEstimate*1)/100) + ((indentEstimate*13.6)/100)));
		
};
  /*$scope.deleteRow = function(index, brandNo,item){
		if (confirm("Are you sure you want to delete ?"))
		  {
			$('#'+index).remove();
			var indentEstimate=0;
			var ttlMrpRoundoff = 0;
			var table = $("#indentEstimate tbody");
			table.find('tr').each(function (i) {
				 var $tds = $(this).find('td'),
				 val1 = parseFloat($tds.eq(10).text()),
				 val2 = parseFloat($tds.eq(20).text())
				 
				 if(val1 > 0)
					 indentEstimate +=val1;
				 if(val2 > 0)
					 ttlMrpRoundoff +=val2;
				
			 });
			$("#TotalestimateInvestment").text(indentEstimate);
			$("#TotalestimateSpecialMargin").text(Math.round(ttlMrpRoundoff));
			$("#tcsValue").text(Math.round((indentEstimate*1)/100));
			$("#turnOverTax").text(Math.round((indentEstimate*13.6)/100));
			$("#sumOfInvestmentAmt").text(Math.round(indentEstimate+ttlMrpRoundoff+((indentEstimate*1)/100) + ((indentEstimate*13.6)/100)));
			
			$scope.alldetails.splice($scope.alldetails.indexOf(item), 1);
		}
		
	}*/
  
  
  $scope.getPeroductDetails = function() {
	  var inputdate = $("#datepicker").val();
	  var brandname = $("#brandNoVal option:selected").text();
		var n = brandname.split(" ");
	    var brandNoVal = n[n.length - 1];
	  $('#addBtnForNewProduct').css('display','block');
	 // var brandNoVal = $scope.brandNoVal;
	  var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		var productListUrl = url+"getDiscountEsitmateDataWithBrandNo?brandNoVal="+brandNoVal+"&inputdate="+inputdate;
		$http({
		    method : "GET",
		    url : productListUrl
		  }).then(function mySuccess(response) {
			 // console.log(JSON.stringify(response.data));
			 // var l2=0,l1=0,q=0,p=0,n=0,d=0,lb=0,sb=0,tin=0;
			  $scope.singleBrandModelPopup = response.data;
			  var pendingCase = response.data.commitment - response.data.liftedCase;
			  var pendingValscope = 0;
			  var pendingColorScope ="";
			  if(pendingCase > 0){
	    		  pendingValscope = pendingCase;
	    		  pendingColorScope = "#DAFAC4";
	    	  }
	    	  else{
	    		  pendingValscope = 0;
	    		  pendingColorScope = "#D6EAF8";
	    	  }
			  $scope.pendingValscope = pendingValscope;
			  $scope.pendingColorScope = pendingColorScope;	 
			  var totalcasepupop = response.data.l2+response.data.l1+response.data.q+response.data.p+response.data.n+response.data.d+response.data.lb+response.data.sb+response.data.tin;
			  $scope.totalcasepupop = totalcasepupop;
			  $scope.l2DistributeAgain = 0;
				$scope.l1DistributeAgain = 0;
				$scope.QDistributeAgain = 0;
				$scope.PDistributeAgain = 0;
				$scope.NDistributeAgain = 0;
				$scope.DDistributeAgain = 0;
				$scope.SBDistributeAgain = 0;
				$scope.LBDistributeAgain = 0;
				$scope.TINDistributeAgain = 0;
				$scope.totalMrpRoundOffWithSpecialMrp = 0;
				
				$("#newProductCase").val(0);
		  }, function myError(response) {
		    //alert(response);
		  });
	
	};
	$scope.newProduct = function(noofcases,L2,L1,Q,P,N,D,lb,sb,tin,SpecialMarginL2,SpecialMarginL1,SpecialMarginQ,SpecialMarginP,SpecialMarginN,SpecialMarginD,SpecialMarginsb,SpecialMarginlb,SpecialMargintin,totalcases) {
		 $scope.noofcasespupop = noofcases;
		 var totalMrpRoundOffWithSpecialMrp = 0;
		 if(totalcases > 0){
		 $scope.l2DistributeAgain = Math.round(stockDivive(L2,noofcases,totalcases));
		 $scope.l1DistributeAgain = Math.round(stockDivive(L1,noofcases,totalcases));
		 $scope.QDistributeAgain = Math.round(stockDivive(Q,noofcases,totalcases));
		 $scope.PDistributeAgain = Math.round(stockDivive(P,noofcases,totalcases));
		 $scope.NDistributeAgain = Math.round(stockDivive(N,noofcases,totalcases));
		 $scope.DDistributeAgain = Math.round(stockDivive(D,noofcases,totalcases));
		 $scope.SBDistributeAgain = Math.round(stockDivive(sb,noofcases,totalcases));
		 $scope.LBDistributeAgain = Math.round(stockDivive(lb,noofcases,totalcases));
		 $scope.TINDistributeAgain = Math.round(stockDivive(tin,noofcases,totalcases));
		 $scope.totalMrpRoundOffWithSpecialMrp = ((Math.round($scope.l2DistributeAgain)*SpecialMarginL2)+(Math.round($scope.l1DistributeAgain)*SpecialMarginL1)+(Math.round($scope.QDistributeAgain)*SpecialMarginQ)
				 +(Math.round($scope.PDistributeAgain)*SpecialMarginP)+(Math.round($scope.NDistributeAgain)*SpecialMarginN)+(Math.round($scope.DDistributeAgain)*SpecialMarginD)+(Math.round($scope.SBDistributeAgain)*SpecialMarginsb)
				 +(Math.round($scope.LBDistributeAgain)*SpecialMarginlb)+(Math.round($scope.TINDistributeAgain)*SpecialMargintin));
		 }else{
			 $scope.l2DistributeAgain = 0;
				$scope.l1DistributeAgain = 0;
				$scope.QDistributeAgain = 0;
				$scope.PDistributeAgain = 0;
				$scope.NDistributeAgain = 0;
				$scope.DDistributeAgain = 0;
				$scope.SBDistributeAgain = 0;
				$scope.LBDistributeAgain = 0;
				$scope.TINDistributeAgain = 0;
				$scope.totalMrpRoundOffWithSpecialMrp = 0;
		 }
			
	 }
	 $(".add-row").click(function(){
		var newProductCase = $("#newProductCase").val();
		 if(!(newProductCase == null || newProductCase == "" || newProductCase <= 0)){
		 myObj = $scope.singleBrandModelPopup;
		 
		 var markup = "<tr id="+$scope.singleBrandModelPopup.brandNo+">" +
		 		"<td class=\"hideTotalPrice\" style=\"color: #000;background: linear-gradient(to right, "+$scope.pendingColorScope+" 15%, white 6%);\"><INPUT type=\"checkbox\" name=\"chk\" style=\"margin: 0px; padding: 0px;width: 15px;\"></td>" +
		 		"<td style=\"color: #000;\">"+$scope.singleBrandModelPopup.brandName+"</td>" +
		 		"<td class=\"hideTotalPrice\" style=\"color: #000;\">"+$scope.singleBrandModelPopup.brandNo+"</td>" +
		 		"<td class=\"hideTotalPrice\" style=\"color: #000;\">"+$scope.singleBrandModelPopup.caseRate+"</td>" +
		 		"<td class=\"hideTotalPrice tip\" style=\"color: #000;\">"+$scope.singleBrandModelPopup.lastMonthSold+"" +
		 		"<ul><li>2L: "+$scope.singleBrandModelPopup.l2+"</li><li>1L: "+$scope.singleBrandModelPopup.l1+"</li><li>Q: "+$scope.singleBrandModelPopup.q+"</li>" +
 				"<li>P: "+$scope.singleBrandModelPopup.p+"</li><li>N: "+$scope.singleBrandModelPopup.n+"</li><li>D: "+$scope.singleBrandModelPopup.d+"</li>" +
 				"<li>LB: "+$scope.singleBrandModelPopup.lb+"</li><li>SB: "+$scope.singleBrandModelPopup.sb+"</li><li>TIN: "+$scope.singleBrandModelPopup.tin+"</li></ul>" +
		 				"</td>" +
		 		"<td class=\"hideTotalPrice tip\" style=\"color: #000;\">"+$scope.singleBrandModelPopup.inHouseStock+"" +
		 		"<ul><li>2L: "+$scope.singleBrandModelPopup.l2Stock+"</li><li>1L: "+$scope.singleBrandModelPopup.l1Stock+"</li><li>Q: "+$scope.singleBrandModelPopup.qstock+"</li>" +
 				"<li>P: "+$scope.singleBrandModelPopup.pstock+"</li><li>N: "+$scope.singleBrandModelPopup.nstock+"</li><li>D: "+$scope.singleBrandModelPopup.dstock+"</li>" +
 				"<li>LB: "+$scope.singleBrandModelPopup.lbstock+"</li><li>SB: "+$scope.singleBrandModelPopup.sbstock+"</li><li>TIN: "+$scope.singleBrandModelPopup.tinstock+"</li></ul>" +
		 				"</td>" +
		 		"<td class=\"hideTotalPrice\" style=\"color: #000;\">"+$scope.singleBrandModelPopup.commitment+"</td>" +
		 		"<td class=\"hideTotalPrice\" style=\"color: #000;\">"+$scope.singleBrandModelPopup.liftedCase+"</td>" +
		 		"<td class=\"hideTotalPrice\" style=\"color: green;\">"+$scope.pendingValscope+"</td>" +
		 		"<td id=\"newcaseEdit"+$scope.singleBrandModelPopup.brandNo+"\" class=\"hideTotalPrice\" style=\"color: #000;\">"+$scope.noofcasespupop+"<input type=\"text\" style=\"display: none;width: 50px !important;\" id=\"newcase"+$scope.singleBrandModelPopup.brandNo+"\" value=\""+$scope.noofcasespupop+"\"></td>" +
		 		"<td id=\"investment"+$scope.singleBrandModelPopup.brandNo+"\" class=\"hideTotalPrice\" style=\"color: #000;\">"+($scope.noofcasespupop * $scope.singleBrandModelPopup.caseRate)+"</td>" +
		 		"<td id=\"2l"+$scope.singleBrandModelPopup.brandNo+"\" style=\"color: #000;\">"+$scope.l2DistributeAgain+"</td>" +
		 		"<td id=\"1l"+$scope.singleBrandModelPopup.brandNo+"\" style=\"color: #000;\">"+$scope.l1DistributeAgain+"</td>" +
		 		"<td id=\"q"+$scope.singleBrandModelPopup.brandNo+"\" style=\"color: #000;\">"+$scope.QDistributeAgain+"</td>" +
		 		"<td id=\"p"+$scope.singleBrandModelPopup.brandNo+"\" style=\"color: #000;\">"+$scope.PDistributeAgain+"</td>" +
		 		"<td id=\"n"+$scope.singleBrandModelPopup.brandNo+"\" style=\"color: #000;\">"+$scope.NDistributeAgain+"</td>" +
		 		"<td id=\"d"+$scope.singleBrandModelPopup.brandNo+"\" style=\"color: #000;\">"+$scope.DDistributeAgain+"</td>" +
		 		"<td id=\"lb"+$scope.singleBrandModelPopup.brandNo+"\" style=\"color: #000;\">"+$scope.LBDistributeAgain+"</td>" +
		 		"<td id=\"sb"+$scope.singleBrandModelPopup.brandNo+"\" style=\"color: #000;\">"+$scope.SBDistributeAgain+"</td>" +
		 		"<td id=\"tin"+$scope.singleBrandModelPopup.brandNo+"\" style=\"color: #000;\">"+$scope.TINDistributeAgain+"</td>" +
		 		"<td id=\"specialMrp"+$scope.singleBrandModelPopup.brandNo+"\" style=\"display: none;color: #000;\">"+$scope.totalMrpRoundOffWithSpecialMrp+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.noofcasespupop+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.target+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.companyOrder+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.pendingColorScope+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.productType+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.l2+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.l1+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.q+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.p+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.n+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.d+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.sb+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.lb+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.tin+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.x+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.l2SpecialMargin+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.l1SpecialMargin+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.qspecialMargin+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.pspecialMargin+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.nspecialMargin+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.dspecialMargin+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.sbspecialMargin+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.lbspecialMargin+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.tinspecialMargin+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.xspecialMargin+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.l2Stock+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.l1Stock+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.qstock+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.pstock+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.nstock+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.dstock+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.sbstock+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.lbstock+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.tinstock+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.xstock+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">0</td>"+
						"<td class=\"hideTotalPrice\" style=\"display: none;\">0</td>"+
						"<td class=\"hideTotalPrice\" style=\"display: none;\">0</td>"+
						"<td class=\"hideTotalPrice\" style=\"display: none;\">0</td>"+
						"<td class=\"hideTotalPrice\" style=\"display: none;\">0</td>"+
						"<td class=\"hideTotalPrice\" style=\"display: none;\">0</td>"+
						"<td class=\"hideTotalPrice\" style=\"display: none;\">0</td>"+
						"<td class=\"hideTotalPrice\" style=\"display: none;\">0</td>"+
						"<td class=\"hideTotalPrice\" style=\"display: none;\">0</td>"+
						"<td class=\"hideTotalPrice\" style=\"display: none;\">0</td>"+
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.category+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.company+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.inHouseStock+"</td>" +
		 				"<td class=\"hideTotalPrice\" style=\"display: none;\">"+$scope.singleBrandModelPopup.lastMonthSold+"</td>" +
						//"<td class=\"hideTotalPrice\" style=\"color: #000;background: linear-gradient(to left, "+$scope.pendingColorScope+" 15%, white 6%);\"><span class=\"glyphicon glyphicon-edit\" data-toggle=\"modal\" onclick=\"editPupopGenerateRow(myObj,"+$scope.l2DistributeAgain+","+$scope.l1DistributeAgain+","+$scope.QDistributeAgain+","+$scope.PDistributeAgain+","+$scope.NDistributeAgain+","+$scope.DDistributeAgain+","+$scope.LBDistributeAgain+","+$scope.SBDistributeAgain+","+$scope.TINDistributeAgain+","+0+","+$scope.noofcasespupop+","+$scope.totalMrpRoundOffWithSpecialMrp+");\" style=\"top: 0px;color: #000;font-size: 11px;cursor: pointer;\"></span></td>" +
		 				"<td class=\"hideTotalPrice\" style=\"color: #000;background: linear-gradient(to left, "+$scope.pendingColorScope+" 15%, white 6%);\"><span class=\"glyphicon glyphicon-edit\" data-toggle=\"modal\" onclick=\"editPupopGenerateRow("+$scope.singleBrandModelPopup.brandNo+");\" style=\"top: 0px;color: #000;font-size: 11px;cursor: pointer;\"></span></td>" +
		 				"</tr>";
		     $("#pupopNewProduct").append(markup);
		     var indentEstimate=0;
		 	var ttlMrpRoundoff = 0;
		 	var table = $("#indentEstimate tbody");
		 	table.find('tr').each(function (i) {
		 		 var $tds = $(this).find('td'),
		 		 val1 = parseFloat($tds.eq(10).text()),
		 		 val2 = parseFloat($tds.eq(20).text())
		 		 
		 		 if(val1 > 0)
		 			 indentEstimate +=val1;
		 		 if(val2 > 0)
		 			 ttlMrpRoundoff +=val2;
		 		
		 	 });
		 	$("#TotalestimateInvestment").text(indentEstimate);
		 	$("#TotalestimateSpecialMargin").text(Math.round(ttlMrpRoundoff));
		 	$("#tcsValue").text(Math.round((indentEstimate*1)/100));
		 	$("#turnOverTax").text(Math.round((indentEstimate*13.6)/100));
		 	$("#sumOfInvestmentAmt").text(Math.round(indentEstimate+ttlMrpRoundoff+((indentEstimate*1)/100) + ((indentEstimate*13.6)/100)));
		 	$('#myModal').modal('hide');
	       }else{
	    	   alert("Field should not be empty!");
	       }
		 });
  
	 
	 $scope.editRow = function(item){
	//	console.log(JSON.stringify(item));
		var brandNo = item.brandNo
		$('#editPopupInvestment').html(parseInt($("#investment"+brandNo).text()));
		$('#editPopupNeedCase').html(parseInt($("#newcase"+brandNo).val()));
		 $('#popupSpecialMrp').html(parseInt($("#specialMrp"+brandNo).text()));
		 
		 $("#2lPopup").val(parseInt($("#2l"+brandNo).text()));
	      $("#1lPopup").val(parseInt($("#1l"+brandNo).text()));
	      $("#qPopup").val(parseInt($("#q"+brandNo).text()));
	      $("#pPopup").val(parseInt($("#p"+brandNo).text()));
	      $("#nPopup").val(parseInt($("#n"+brandNo).text()));
	      $("#dPopup").val(parseInt($("#d"+brandNo).text()));
	      $("#lbPopup").val(parseInt($("#lb"+brandNo).text()));
	      $("#sbPopup").val(parseInt($("#sb"+brandNo).text()));
	      $("#tinPopup").val(parseInt($("#tin"+brandNo).text()))
		   /* $('#editPopupInvestment').html(item.totalinvestment);
	        $('#editPopupNeedCase').html(item.needCase);
	        $('#popupSpecialMrp').html(item.totalSpecialMrp);
	        
		      $("#2lPopup").val(item.l2Val);
		      $("#1lPopup").val(item.l1Val);
		      $("#qPopup").val(item.qVal);
		      $("#pPopup").val(item.pVal);
		      $("#nPopup").val(item.nVal);
		      $("#dPopup").val(item.dVal);
		      $("#lbPopup").val(item.lbVal);
		      $("#sbPopup").val(item.sbVal);
		      $("#tinPopup").val(item.tinVal);*/
		   $scope.editRowModelPopupItem = item;
		 $("#editModal").modal("show");
		 
			
		}
	 $scope.editChnage = function(currentVal,caseRate,brandNo,SpecialMarginL2,SpecialMarginL1,SpecialMarginQ,SpecialMarginP,SpecialMarginN,SpecialMarginD,SpecialMarginsb,SpecialMarginlb,SpecialMargintin){
      // var l2 = parseInt($("2lPopup"+brandNo).text());
       var l2 = parseInt($("#2lPopup").val());
       var l1 = parseInt($("#1lPopup").val());
       var q = parseInt($("#qPopup").val());
       var p = parseInt($("#pPopup").val());
       var n = parseInt($("#nPopup").val());
       var d = parseInt($("#dPopup").val());
       var lb = parseInt($("#lbPopup").val());
       var sb = parseInt($("#sbPopup").val());
       var tin = parseInt($("#tinPopup").val());
      var totalCase = (l2+l1+q+p+n+d+lb+sb+tin);
     var popupSpecialMrp = ((Math.round(l2)*SpecialMarginL2)+(Math.round(l1)*SpecialMarginL1)+(Math.round(q)*SpecialMarginQ)
				 +(Math.round(p)*SpecialMarginP)+(Math.round(n)*SpecialMarginN)+(Math.round(d)*SpecialMarginD)+(Math.round(sb)*SpecialMarginsb)
				 +(Math.round(lb)*SpecialMarginlb)+(Math.round(tin)*SpecialMargintin));
      $('#editPopupInvestment').html(totalCase * caseRate);
      $('#editPopupNeedCase').html(totalCase);
      $('#popupSpecialMrp').html(popupSpecialMrp);
		 
	 }
	 $scope.updateRowValue = function(brandNo){
		 var editPopupNeedCase = parseInt($("#editPopupNeedCase").text());
		     if(editPopupNeedCase >= 0){
		      $("#investment"+brandNo).html(parseInt($("#editPopupInvestment").text()));
		      $("#newcase"+brandNo).val(parseInt($("#editPopupNeedCase").text()));
		      
	          $("#2l"+brandNo).html(parseInt($("#2lPopup").val()));
		      $("#1l"+brandNo).html(parseInt($("#1lPopup").val()));
		      $("#q"+brandNo).html(parseInt($("#qPopup").val()));
		      $("#p"+brandNo).html(parseInt($("#pPopup").val()));
		      $("#n"+brandNo).html(parseInt($("#nPopup").val()));
		      $("#d"+brandNo).html(parseInt($("#dPopup").val()));
		      $("#lb"+brandNo).html(parseInt($("#lbPopup").val()));
		      $("#sb"+brandNo).html(parseInt($("#sbPopup").val()));
		      $("#tin"+brandNo).html(parseInt($("#tinPopup").val()));
		      $("#specialMrp"+brandNo).html(parseInt($("#popupSpecialMrp").text()));
		 
		    var indentEstimate=0;
		 	var ttlMrpRoundoff = 0;
		 	var table = $("#indentEstimate tbody");
		 	table.find('tr').each(function (i) {
		 		 var $tds = $(this).find('td'),
		 		 val1 = parseFloat($tds.eq(10).text()),
		 		 val2 = parseFloat($tds.eq(20).text())
		 		 
		 		 if(val1 > 0)
		 			 indentEstimate +=val1;
		 		 if(val2 > 0)
		 			 ttlMrpRoundoff +=val2;
		 		
		 	 });
		 	$("#TotalestimateInvestment").text(indentEstimate);
		 	$("#TotalestimateSpecialMargin").text(Math.round(ttlMrpRoundoff));
		 	$("#tcsValue").text(Math.round((indentEstimate*1)/100));
		 	$("#turnOverTax").text(Math.round((indentEstimate*13.6)/100));
		 	$("#sumOfInvestmentAmt").text(Math.round(indentEstimate+ttlMrpRoundoff+((indentEstimate*1)/100)+((indentEstimate*13.6)/100)));
		 	$('#editModal').modal('hide');
		       }else{
		    	   alert("Field should not be empty!");
		       }
		 }
	 
	 //--------------- POST request -------------------// 
	 
	 $scope.savedIndentEstimate = function(){
		 var noOfDays = $("#noOfDays").val();
		 var date = $("#datepicker").val();
		 if(noOfDays !="" && noOfDays > 0){
		 var json = {
				    "indentDetails": []
		        };
		 
		 var table = $("#indentEstimate tbody");
		 	table.find('tr').each(function (i) {
		 		 var $tds = $(this).find('td'),
		 		 brandName = $tds.eq(1).text(),
		 		 brandNo = parseInt($tds.eq(2).text()),
		 		 caseRate = parseFloat($tds.eq(3).text()),
		 		 lastMonthSold = parseInt($tds.eq(69).text()),
		 		 //inhousestock = parseInt($tds.eq(5).text()),
		 		 commitment = parseInt($tds.eq(6).text()),
		 	     liftedCase = parseInt($tds.eq(7).text()),
		 	     pending = parseInt($tds.eq(8).text()),
		 	     needCase = parseInt($tds.eq(9).text()),
		 	     investMent = parseInt($tds.eq(10).text()),
		 	     l2Val = parseInt($tds.eq(11).text()),
		 	     l1Val = parseInt($tds.eq(12).text()),
		 	     qVal = parseInt($tds.eq(13).text()),
		 	     pVal = parseInt($tds.eq(14).text()),
		 	     nVal = parseInt($tds.eq(15).text()),
		 	     dVal = parseInt($tds.eq(16).text()),
		 	     lbVal = parseInt($tds.eq(17).text()),
		 	     sbVal = parseInt($tds.eq(18).text()),
		 	     tinVal = parseInt($tds.eq(19).text()),
		 	    totalSpecialMrp = parseFloat($tds.eq(20).text()),
		 	   //  needCase = parseInt($tds.eq(21).text()),
		 	     target = parseInt($tds.eq(22).text()),
		 	     companyOrder = parseInt($tds.eq(23).text()),
		 	     companyColor =$tds.eq(24).text(),
		 	     productType = $tds.eq(25).text(),
		 	     l2 = parseFloat($tds.eq(26).text()),
		 	     l1 = parseFloat($tds.eq(27).text()),
		 	     q = parseFloat($tds.eq(28).text()),
		 	     p = parseFloat($tds.eq(29).text()),
		 	     n = parseFloat($tds.eq(30).text()),
		 	     d = parseFloat($tds.eq(31).text()),
		 	     sb = parseFloat($tds.eq(32).text()),
		 	     lb = parseFloat($tds.eq(33).text()),
		 	     tin = parseFloat($tds.eq(34).text()),
		 	     x = parseFloat($tds.eq(35).text()),
		 	    l2SpecialMargin = parseFloat($tds.eq(36).text()),
		 	    l1SpecialMargin = parseFloat($tds.eq(37).text()),
		 	    qSpecialMargin = parseFloat($tds.eq(38).text()),
		 	    pSpecialMargin = parseFloat($tds.eq(39).text()),
		 	    nSpecialMargin = parseFloat($tds.eq(40).text()),
		    	dSpecialMargin = parseFloat($tds.eq(41).text()),
		 	    sbSpecialMargin = parseFloat($tds.eq(42).text()),
		 	    lbSpecialMargin = parseFloat($tds.eq(43).text()),
		 	    tinSpecialMargin = parseFloat($tds.eq(44).text()),
		 	    xSpecialMargin = parseFloat($tds.eq(45).text()),
		 	   l2Stock = parseFloat($tds.eq(46).text()),
		 	   l1Stock = parseFloat($tds.eq(47).text()),
		 	   qStock = parseFloat($tds.eq(48).text()),
		 	   pStock = parseFloat($tds.eq(49).text()),
		 	   nStock = parseFloat($tds.eq(50).text()),
		 	   dStock = parseFloat($tds.eq(51).text()),
		 	   sbStock = parseFloat($tds.eq(52).text()),
		 	   lbStock = parseFloat($tds.eq(53).text()),
		 	   tinStock = parseFloat($tds.eq(54).text()),
		 	   xStock = parseFloat($tds.eq(55).text()),
		 	   l2NeedCase = parseFloat($tds.eq(56).text()),
		 	   l1NeedCase = parseFloat($tds.eq(57).text()),
		 	   qNeedCase = parseFloat($tds.eq(58).text()),
		 	   pNeedCase = parseFloat($tds.eq(59).text()),
		 	   nNeedCase = parseFloat($tds.eq(60).text()),
		 	   dNeedCase = parseFloat($tds.eq(61).text()),
		 	   sbNeedCase = parseFloat($tds.eq(62).text()),
		 	   lbNeedCase = parseFloat($tds.eq(63).text()),
		 	   tinNeedCase = parseFloat($tds.eq(64).text()),
		 	   xNeedCase = parseFloat($tds.eq(65).text()),
		 	   category = $tds.eq(66).text(),
		 	   company = $tds.eq(67).text(),
		 	   inhousestock = $tds.eq(68).text()
		 	   
		 	   if(isNaN(needCase) || needCase == ""){
		 	   var needCase = $("#newcase"+brandNo).val();
		 		  if(isNaN(needCase) || needCase == ""){
		 			 needCase=0;
			             }
		 	   }
		 	  var input = {
		        		"brandName":brandName,
		        		"brandNo":brandNo,
		        		"caseRate":caseRate,
		        		"lastMonthSold":lastMonthSold,
		        		"inhousestock":inhousestock,
		        		"commitment":commitment,
		        		"liftedCase":liftedCase,
		        		"needCase":needCase,
		        		"target":target,
		        		"companyOrder":companyOrder,
		        		"companyColor":companyColor,
		        		"productType":productType,
		        		"l2":l2,
		        		"l1":l1,
		        		"q":q,
		        		"p":p,
		        		"n":n,
		        		"d":d,
		        		"sb":sb,
		        		"lb":lb,
		        		"tin":tin,
		        		"x":x,
		        		"l2SpecialMargin":l2SpecialMargin,
		        		"l1SpecialMargin":l1SpecialMargin,
		        		"qSpecialMargin":qSpecialMargin,
		        		"pSpecialMargin":pSpecialMargin,
		        		"nSpecialMargin":nSpecialMargin,
		        		"dSpecialMargin":dSpecialMargin,
		        		"sbSpecialMargin":sbSpecialMargin,
		        		"lbSpecialMargin":lbSpecialMargin,
		        		"tinSpecialMargin":tinSpecialMargin,
		        		"xSpecialMargin":xSpecialMargin,
		        		"l2Stock":l2Stock,
		        		"l1Stock":l1Stock,
		        		"qStock":qStock,
		        		"pStock":pStock,
		        		"nStock":nStock,
		        		"dStock":dStock,
		        		"sbStock":sbStock,
		        		"lbStock":lbStock,
		        		"tinStock":tinStock,
		        		"xStock":xStock,
		        		"noOfDays":noOfDays,
		        		"date":date,
		        		"category":category,
		        		"company":company,
		        		"pending":pending,
		        		"investMent":investMent,
		        		 "l2Val":l2Val,
		        		 "l1Val":l1Val,
		        		 "qVal":qVal,
		        		 "pVal":pVal,
		        		 "nVal":nVal,
		        		 "dVal":dVal,
		        		 "lbVal":lbVal,
		        		 "sbVal":sbVal,
		        		 "tinVal":tinVal,
		        		 "totalSpecialMrp":totalSpecialMrp,
		        		 "l2NeedCase":l2NeedCase,
		        		 "l1NeedCase":l1NeedCase,
		        		 "qNeedCase":qNeedCase,
		        		 "pNeedCase":pNeedCase,
		        		 "nNeedCase":nNeedCase,
		        		 "dNeedCase":dNeedCase,
		        		 "sbNeedCase":sbNeedCase,
		        		 "lbNeedCase":lbNeedCase,
		        		 "tinNeedCase":tinNeedCase,
		        		 "xNeedCase":xNeedCase
		        };
		        json.indentDetails.push(input);
		 	 });
		 	saveTempIndent(json);
		 }
	 }
	 function saveTempIndent(json) {
			var myUrl = window.location.href;
			var url1 = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
			   $.ajax({
				  async:false,
			      type: "POST",
			      contentType : 'application/json; charset=utf-8',
			      //dataType : 'json',
			      url: url1+"/saveTempIndent",
			      data: JSON.stringify(json), 
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
app.filter("totalInvstAmt", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
             s += alldetails.totalinvestment;
        });
        return Math.ceil(s);
    };
})
app.filter("totalSpecialMargin", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
             s += alldetails.totalSpecialMrp;
        });
        return Math.ceil(s);
    };
})
app.filter("tcsValue", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
             s += alldetails.totalinvestment;
        });
        return Math.ceil((s*1)/100);
    };
})
app.filter("turnOverTax", function() {
    return function(data, index) {
        var s = 0;
       // if(!data || !data[0]) return soma;
        
        angular.forEach(data, function(alldetails, i) {
             s += alldetails.totalinvestment;
        });
        return Math.ceil((s*13.6)/100);
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