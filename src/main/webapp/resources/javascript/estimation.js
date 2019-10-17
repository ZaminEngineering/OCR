
function stockDivive(soldVal,needCase,totalcase){
	//console.log("needCase>> "+needCase);
	 var inPer=(soldVal*100)/totalcase;
	 var realVal = (inPer * needCase)/100;
	 if (! isNaN(realVal)) {
	 return Math.round(realVal);
	 }else{
		 return Math.round(0);
	 }
}

 function numFormate(x){
	 x=x.toString();
	 var lastThree = x.substring(x.length-3);
	 var otherNumbers = x.substring(0,x.length-3);
	 if(otherNumbers != '')
	     lastThree = ',' + lastThree;
	 var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
	 return res;
 }
 
 function remove_duplicates(a, b) {
	    for (var i = 0, len = a.length; i < len; i++) { 
	        for (var j = 0, len2 = b.length; j < len2; j++) { 
	            if (a[i].brandNo === b[j].brandNo) {
	                b.splice(j, 1);
	                len2=b.length;
	            }
	        }
	    }
	}
 
 function deletePupopGenerateRow(brandNo){
	 // alert("brandNo>> "+brandNo);
		if (confirm("Are you sure you want to delete ?"))
		  {
			$('#'+brandNo).remove();
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
		}
		//$scope.alldetails.splice($scope.alldetails.indexOf(item), 1);
	}
 
 function editPupopGenerateRow(row){
	    var $tds = $('#'+row).find('td'),
	          brandName = $tds.eq(1).text(),
		      brandNo = parseInt($tds.eq(2).text()),
		      caseRate = parseFloat($tds.eq(3).text()),
		      lastMonthSold = parseInt($tds.eq(4).text()),
	          liftedCase = parseInt($tds.eq(7).text()),
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
	          needCase = parseInt($tds.eq(21).text()),
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
	           inhousestock = $tds.eq(68).text()
		            	
		            	
		 $('#editSecPopupBrandName').html(brandName);
		 $('#editSecPopupCaseRate').html(brandNo);
		 $('#editSecPopupCaseRate').html(caseRate);
		 $('#editSecPopupLastDaysSold').html(lastMonthSold);
		 $('#editSecPopupInhouseStock').html(inhousestock);
		 $('#editSecPopupLiftedCase').html(liftedCase);
		 $('#editSecPopupNeedCase').html(needCase);
		 $('#editSecPopupInvestment').html(needCase * caseRate);
		      $("#2lSecPopup").val(l2Val);
		      $("#1lSecPopup").val(l1Val);
		      $("#qSecPopup").val(qVal);
		      $("#pSecPopup").val(pVal);
		      $("#nSecPopup").val(nVal);
		      $("#dSecPopup").val(dVal);
		      $("#lbSecPopup").val(lbVal);
		      $("#sbSecPopup").val(sbVal);
		      $("#tinSecPopup").val(tinVal);
		      $("#popupSecSpecialMrp").html(totalSpecialMrp);
		      $("#itemL2SpecialMrp").html(l2SpecialMargin);
		      $("#itemL1SpecialMrp").html(l1SpecialMargin);
		      $("#itemQSpecialMrp").html(qSpecialMargin);
		      $("#itemPSpecialMrp").html(pSpecialMargin);
		      $("#itemNSpecialMrp").html(nSpecialMargin);
		      $("#itemDSpecialMrp").html(dSpecialMargin);
		      $("#itemLBSpecialMrp").html(lbSpecialMargin);
		      $("#itemSBSpecialMrp").html(sbSpecialMargin);
		      $("#itemTINSpecialMrp").html(tinSpecialMargin);
		      $("#itemXSpecialMrp").html(xSpecialMargin);
		      $("#SecPopupBrandNO").html(brandNo); 
	     $("#editSecondModal").modal("show");
		}
function editSecChnage(){
	
var editSecPopupCaseRate =   parseInt($("#editSecPopupCaseRate").text());
	
var l2SecPopup = parseInt($("#2lSecPopup").val());
var l1SecPopup = parseInt($("#1lSecPopup").val());
var qSecPopup = parseInt($("#qSecPopup").val());
var pSecPopup = parseInt($("#pSecPopup").val());
var nSecPopup = parseInt($("#nSecPopup").val());
var dSecPopup = parseInt($("#dSecPopup").val());
var lbSecPopup = parseInt($("#lbSecPopup").val());
var sbSecPopup = parseInt($("#sbSecPopup").val());
var tinSecPopup = parseInt($("#tinSecPopup").val());

var itemL2SpecialMrp =   parseFloat($("#itemL2SpecialMrp").text());
var itemL1SpecialMrp =   parseFloat($("#itemL1SpecialMrp").text());
var itemQSpecialMrp =    parseFloat($("#itemQSpecialMrp").text());
var itemPSpecialMrp =    parseFloat($("#itemPSpecialMrp").text());
var itemNSpecialMrp =    parseFloat($("#itemNSpecialMrp").text());
var itemDSpecialMrp =    parseFloat($("#itemDSpecialMrp").text());
var itemLBSpecialMrp =   parseFloat($("#itemLBSpecialMrp").text());
var itemSBSpecialMrp =   parseFloat($("#itemSBSpecialMrp").text());
var itemTINSpecialMrp =  parseFloat($("#itemTINSpecialMrp").text());

var popupSecSpecialMrp = ((Math.round(l2SecPopup)*itemL2SpecialMrp)+(Math.round(l1SecPopup)*itemL1SpecialMrp)+(Math.round(qSecPopup)*itemQSpecialMrp)
		 +(Math.round(pSecPopup)*itemPSpecialMrp)+(Math.round(nSecPopup)*itemNSpecialMrp)+(Math.round(dSecPopup)*itemDSpecialMrp)+(Math.round(sbSecPopup)*itemSBSpecialMrp)
		 +(Math.round(lbSecPopup)*itemLBSpecialMrp)+(Math.round(tinSecPopup)*itemTINSpecialMrp));

var totalCase = l2SecPopup+l1SecPopup+qSecPopup+pSecPopup+nSecPopup+dSecPopup+lbSecPopup+sbSecPopup+tinSecPopup;
$('#editSecPopupNeedCase').html(totalCase);
$('#editSecPopupInvestment').html(totalCase * editSecPopupCaseRate);
$('#popupSecSpecialMrp').html(popupSecSpecialMrp);

}
function updateSecondRowValue(){
	var editSecPopupNeedCase = parseInt($("#editSecPopupNeedCase").text());
	if(editSecPopupNeedCase >=0){
	var brandNo = parseInt($("#SecPopupBrandNO").text());
	$("#investment"+brandNo).html(parseInt($("#editSecPopupInvestment").text()));
    $("#newcaseEdit"+brandNo).text(parseInt($("#editSecPopupNeedCase").text()));
    $("#newcase"+brandNo).val(parseInt($("#editSecPopupNeedCase").text()));
    
    $("#2l"+brandNo).html(parseInt($("#2lSecPopup").val()));
    $("#1l"+brandNo).html(parseInt($("#1lSecPopup").val()));
    $("#q"+brandNo).html(parseInt($("#qSecPopup").val()));
    $("#p"+brandNo).html(parseInt($("#pSecPopup").val()));
    $("#n"+brandNo).html(parseInt($("#nSecPopup").val()));
    $("#d"+brandNo).html(parseInt($("#dSecPopup").val()));
    $("#lb"+brandNo).html(parseInt($("#lbSecPopup").val()));
    $("#sb"+brandNo).html(parseInt($("#sbSecPopup").val()));
    $("#tin"+brandNo).html(parseInt($("#tinSecPopup").val()));
    $("#specialMrp"+brandNo).html(parseInt($("#popupSecSpecialMrp").text()));

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
	$('#editSecondModal').modal('hide');
    }else{
 	   alert("Field should not be empty!");
    }
}