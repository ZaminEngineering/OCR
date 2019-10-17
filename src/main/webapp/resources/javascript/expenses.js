$(function(data) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getExpenseCategory.json";
	$.ajax ({
		url: productListUrl,
	       type: "POST",
	       success: function(data){
	      var ulValues="";
	      $.each(data.expenseCategoryBean, function (index, value) {
	    	  //alert(data[index].expenseName);
	    	  if(index==0)
	    		  $('#mySelect').append( '<option>Select Expense Name</option>' );
	    	  $('#mySelect').append( '<option value="'+data.expenseCategoryBean[index].expenseName+'_'+data.expenseCategoryBean[index].categoryId+'">'+data.expenseCategoryBean[index].expenseName+'</option>' );
	      });
	      $("#expensedatepicker").val(data.edate);
	    }
	});
});
function jsFunction(val){
	var n = val.split('_');
	var name=n[0];
	var cid=n[1];
	$('#ename').val(name);
	$('#catid').val(cid);
	$('#eamount').val("");
	$('#description').val("");
}
$(document).ready(function(){
	var totalAmount=0;
	var sno=0;
	var categoryArr=[];
	var flag=true;
	var removeVal=0;
	var total=0;
	 $(".add-row").click(function(){
	var date = $("#expensedatepicker").val();
	 var expenseName = $("#ename").val();
	 var amount = $("#eamount").val();
     var comment =  $("#description").val();
     var cid = $("#catid").val();
      if(date != "" && expenseName != "" && amount != "" && cid !=""){
    	  if(expenseName == "Other" && comment.trim() == ""){
    		  alert("For Other its mandatory to write comment");
    	  }else{
    		  $.each(categoryArr, function (index, value){  
                  if(value==cid){
               	   flag=false;  
               	   removeVal=cid;
                  }
                 });
    		  categoryArr.push(cid);
    		  if(flag){
    			  totalAmount=totalAmount+parseInt(amount);
    			  total=total+parseInt(amount);
    		    sno++;
    		     $("#idate").html("<input type='text' id='tamount' name='tamount' value=\""+totalAmount+"\"><input type='hidden' id='datespan' name='datespan' value=\""+date+"\"><span style=\" float: right;font-size: 12px;font-weight: 600;padding: 0px 15px 0px 0px;\">Expense Date: "+date+"</span>");
    		     var markup = "<tr><td><input type='checkbox' name='record'></td><td>"+sno+"</td><td>" + expenseName + "</td><td>" + amount + "</td><td>" + comment + "</td><td style=\"display:none;\">" + cid + "</td></tr>";
    		     $("#invoiceTrList").append(markup);
    		     $("#ttlmrp").html("<span style=\" float: right;padding: 0px 23px 7px 18px;font-size: 15px;color: #000;font-weight: 600;\">Total Amount: "+parseFloat(Math.round(total * 100) / 100).toFixed(2)+"</span>");
    		  }else{
    			  alert("You have allready added Expense Amount for this Expense Name, If you want to edit then You have to frist delete added Expense");
    	    		flag=true;
    		  }
    	  }
      }
      else{
    	  alert("Please fill all the fields");
      }
   
      });
    
    // Find and remove selected table rows
    $(".delete-row").click(function(){
    	/*categoryArr = $.grep(categoryArr, function(value) {
        	  return value != removeVal;
        	});*/
    	$("table tbody").find('input[name="record"]').each(function(){
        	if($(this).is(":checked")){
                $(this).parents("tr").remove();
                var $tds = $(this).parents("tr").find('td'),
	            totalValue = $tds.eq(3).text();
			    total=total- parseInt(totalValue);
                $("#ttlmrp").html("<span style=\" float: right;padding: 0px 23px 7px 18px;font-size: 15px;color: #000;font-weight: 600;\">Total Amount: "+parseFloat(Math.round(total * 100) / 100).toFixed(2)+"</span>");
            }
        });
    	for(var i = categoryArr.length -1; i >= 0 ; i--){
            if(categoryArr[i] == removeVal){
            	categoryArr.splice(i, 1);
            }
        }
    }); 
    	
});  
function getFirstCellTextList() {
	var total=0;
	 var json = {"expenseDetails": []};

	 var table = $("#ItemsTable tbody");
	 table.find('tr').each(function (i) {
	        var $tds = $(this).find('td'),
	            productId = $tds.eq(0).text(),
	            sno = $tds.eq(1).text(),
	            expenseName = $tds.eq(2).text(),
	            amount = $tds.eq(3).text(),
	            comment = $tds.eq(4).text(),
	            catID = $tds.eq(5).text();
	        var input = {
	        		"categoryId":catID.trim(),
	        		"amount":amount.trim(),
	        		"commment":comment.trim()
	        };
	        total=total+parseInt(amount);
	        json.expenseDetails.push(input);
	        
	    });
	 var amountinput = {
	    		"expenseDate":$("#datespan").val(),
	    		"totalAmount":total
	    };
		json.expenseDetails.push(amountinput);
	// console.log(JSON.stringify(json));
	 sendExpenseData(json);
	
	}
function sendExpenseData(json) {
	var myUrl = window.location.href;
	var url1 = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	   $.ajax({
		  async: false,
	      type: "POST",
	      contentType : 'application/json; charset=utf-8',
	     // dataType : "text",
	      url: url1+"/saveExpenses",
	      headers: { 'x-my-custom-header': ip },
	      data: JSON.stringify(json), // Note it is important
	      success: function (data) {
	    	  alert(data.message); 
	    	  location.reload();
	      },
	      error: function (data) {
	    	  alert(data+"error");
	    	  location.reload();
	      }
	  });
	}
function submitCardSaleData(){
	var card = $('#cardSale').val();
	var cash = $('#cashSale').val();
	var cheque = $('#chequeSale').val();
	var date = $('#cardDate').val();
	//var id = $('#cardcashid').val();
	if(card == ""){
		alert("Please fill Card Sale Ammount");
		return false;
	}
	if(cash == ""){
		alert("Please fill cash Sale Ammount");
		return false;
	}
	if(cheque == ""){
		alert("Please fill cash Sale Ammount");
		return false;
	}
	var json = {
			"cardsaleDetails":{
				"id":-1,
	    		"cardSale":card,
	    		"cashSale":cash,
	    		"chequeSale":cheque,
	    		"date":date
			}
	};
	submitCardDetails(json);
}
function submitCardDetails(json) {
	var myUrl = window.location.href;
	var url1 = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	   $.ajax({
		  async: false,
	      type: "POST",
	      contentType : 'application/json; charset=utf-8',
	     // dataType : "text",
	      url: url1+"/saveCardCashSale",
	      headers: { 'x-my-custom-header': ip },
	      data: JSON.stringify(json), // Note it is important
	      success: function (data) {
	    	  alert(data.message); 
	    	  location.reload();
	      },
	      error: function (data) {
	    	  alert(data+"error");
	    	  location.reload();
	      }
	  });
	}


function validationDecimalFun(num2){
	var number2= $(num2).val();
	if(!(validateDecimalNumber(number2))){
		alert("Please fill Correct Value");
		$(num2).val("");
		return false;
	}
	return true;
	
}
function validateDecimalNumber(number2){
	var regex = /^\d{0,9}(\.\d{0,2})?$/;
	return regex.test(number2);
}
$(function(data) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getTotalSaleDate.json";
	$.ajax ({
		url: productListUrl,
	       type: "POST",
	       success: function(data){
	      var startDate="";
	      var enableDays =[];
	      $.each(data, function (index, value) {
	    	  //alert(data[index].date);
	    	  enableDays.push(data[index].date);
	    	  startDate=data[index].date;
	      });
	      getTimeStamp(enableDays);
	      buildBalanceSheet(startDate,startDate);
	      $("#startDate").val(startDate);
	  	  $("#endDate").val(startDate);
	    }
	});
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
function getResults(startDate,endDate){
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	 if(validateCalendarField()==false){return false;}
	 buildBalanceSheet(startDate,endDate);
	 
}
function  buildBalanceSheet(startDate,endDate){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var callingUrl = url+"getBalanceSheet.json?startDate="+startDate+"&endDate="+endDate;
	$.ajax ({
		 url: callingUrl,
		 type: "GET",
	       success: function(data){
	    	 // console.log(JSON.stringify(data.balanceSheetBean));
	    	   var ulValues="";
	    	   var rowclass='',fontcolor='';
	 	      var sno=1,count=0,total=0,totalCashDiff=0,totalCredited=0,totalCashSale=0,totalChequeSale=0,sumOftotal=0,sumOfCard=0,sumOfExpenses=0;
	    	  $.each(data.balanceSheetBean,function(index, value){
	    		  sumOfCard=sumOfCard+parseInt(value.cradSale);
	    		  sumOftotal=sumOftotal+parseInt(value.totalPrice);
	    		  sumOfExpenses=sumOfExpenses+parseInt(value.totalAmount);
	    		  totalCashSale=totalCashSale+parseInt(value.cashSale);
	    		  totalChequeSale=totalChequeSale+parseInt(value.chequeSale);
	    		  totalCredited=totalCredited+parseInt(value.creditedAmount);
	    		  var difference= parseInt(value.totalPrice)-(parseInt(value.totalAmount)+parseInt(value.cradSale)+parseInt(value.cashSale)+parseInt(value.chequeSale));
	    		  var totalval = parseInt(value.totalAmount)+parseInt(value.cradSale)+parseInt(value.cashSale)+parseInt(value.chequeSale);
	    		  totalCashDiff+=value.retention;
	    		  total=total+(difference);
	    		  if(difference > 0){
	    			  fontcolor = 'fontcolorred';
	    		  }else if(difference < 0)
	    			  {
	    			  fontcolor = 'fontcolorgreen';
	    			  }
	    		  else{
	    			  fontcolor = 'fontcolorblack';
	    		  }
	    		  ulValues = ulValues +"<tr><td class=\"col-xs-1\" style=\"color:#fff;background-color: #75b9ce!important;\">"+value.date+"</td><td class=\"col-xs-1\" style=\"background-color: #996633!important;color:#fff;\" title=\""+(value.totalPrice).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"\">"+(value.totalPrice).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td><td class=\"col-xs-1\" style=\"background-color: #ff4d4d!important;color:#fff;cursor: pointer;\" data-toggle=\"modal\" data-target=\"#myModal\" onclick=\"getExpenseData("+(value.expenseMasterId)+",'"+(value.date)+"');\">"+(value.totalAmount).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td><td class=\"col-xs-1\" style=\"background-color: #ff5050!important;color:#fff;\">"+(value.cradSale).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td><td class=\"col-xs-1\" style=\"background-color:#ff5050!important;color:#fff;\">"+(value.cashSale).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td><td class=\"col-xs-1\" style=\"background-color:#ff5050!important;color:#fff;\">"+(value.chequeSale).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td><td class=\"col-xs-2\" style=\"background-color:#8c8c8c!important;color:#fff;\">"+totalval.toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td><td class=\"col-xs-1 "+fontcolor+"\" style=\"background-color:  #ddf7ff!important;\">"+difference.toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td><td class=\"col-xs-1\" style=\"background-color:  #304225!important;color:#fff;\">"+(value.creditedAmount).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td><td class=\"col-xs-1\" style=\"background-color:  #85929E!important;color:#fff;\">"+(value.retention).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td><td class=\"col-xs-1\" style=\"background-color:  #BB8FCE!important;color:#fff;cursor: pointer;\" data-toggle=\"modal\" data-target=\"#investmentModal\" onclick=\"getInvestmentData('"+(value.date)+"');\">"+(value.investment).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td></tr>";
	    	  
	    	  });
	 	      $("#listbalanseData").html(ulValues);
	 	      
	 	     // $("#totalDiff").html("<span style=\" float: right;padding: 0px 23px 7px 18px;font-size: 12px;color: #000;font-weight: 600;\">Total Cash Difference: "+(totalCashDiff).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span><span style=\" float: right;color: #000;padding: 0px 23px 7px 18px;font-size: 12px;font-weight: 600;\">Difference (After removing breakage): "+(total-(data.data.value)).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span><span style=\" float: right;padding: 0px 23px 7px 18px;font-size: 12px;color: #000;font-weight: 600;\">Total Card Amount: "+sumOfCard.toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span><span style=\" float: right;padding: 0px 23px 7px 18px;font-size: 12px;color: #000;font-weight: 600;\">Total Expenses: "+sumOfExpenses.toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span><span style=\" float: right;padding: 0px 23px 7px 18px;font-size: 12px;color: #000;font-weight: 600;\">Total Sale Amount: "+sumOftotal.toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</span>");
	 	     $("#cashDiff").text((totalCashDiff).toLocaleString('en-IN',{ maximumFractionDigits: 2}));
	 	     $("#diffRemovedBreackeg").text((total-(data.data.value)).toLocaleString('en-IN',{ maximumFractionDigits: 2}));
	 	     $("#cardAmt").text(sumOfCard.toLocaleString('en-IN',{ maximumFractionDigits: 2}));
	 	     $("#cashAmt").text(totalCashSale.toLocaleString('en-IN',{ maximumFractionDigits: 2}));
	 	     $("#expenses").text(sumOfExpenses.toLocaleString('en-IN',{ maximumFractionDigits: 2}));
	 	     $("#saleAmt").text(sumOftotal.toLocaleString('en-IN',{ maximumFractionDigits: 2}));
	       }
	})
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
function getExpenseData(expenseMasterID,idate){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getExpenseDetails.json?expenseMasterID="+expenseMasterID;
	$.ajax ({
		url: productListUrl,
	       type: "GET",
	       success: function(data){
	    	  // console.log(JSON.stringify(data));
	    	   var totalAmount=0;
	    	   var expenseList="<table id=\"customers\"><tr><th>Expense Name</th><th>Amount</th><th>Comment</th></tr>";
	    	   $.each(data,function(index, value){
	    		   totalAmount=totalAmount+value.expenseChildAmount;
	    		   expenseList=expenseList+"<tr><td>"+value.name+"</td><td>"+(value.expenseChildAmount).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td><td>"+value.comment+"</td></tr>";
	    		   
	    	   });
	    	   expenseList=expenseList+"<tr style=\"border-top: solid 1px #ccc;\"><td></td><td></td><td style=\"float:right;color:red;\">Total : "+totalAmount.toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td></tr></table>";
	    	   $("#expenseList").html(expenseList);
	    	   $("#edate").text("Selected Date: "+idate);
	    }
	});
	
}
function getInvestmentData(date){
	console.log(date);
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getInvestmentData.json?date="+date;
	$.ajax ({
		url: productListUrl,
	       type: "GET",
	       success: function(data){
	    	   //console.log(JSON.stringify(data));
	    	   var totalAmount=0;
	    	   var investmentList="<table id=\"customers\"><tr><th>Amount</th><th>Tr. Type</th><th>Bank</th></tr>";
	    	   $.each(data,function(index, value){
	    		   totalAmount+=value.amount;
	    		   investmentList=investmentList+"<tr><td>"+(value.amount).toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td><td>"+value.transactionType+"</td><td>"+value.bank+"</td></tr>";
	    		   
	    	   });
	    	   investmentList=investmentList+"<tr style=\"border-top: solid 1px #ccc;\"><td></td><td></td><td style=\"float:right;color:red;\">Total : "+totalAmount.toLocaleString('en-IN',{ maximumFractionDigits: 2})+"</td></tr></table>";
	    	   $("#investmentList").html(investmentList);
	    	   $("#investdate").text("Selected Date: "+date);
	    }
	});
	
}
function updateAb(value){  
	var bankdate = $('#bankdate').val();
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var saleListUrl = url+"getLastDateCredit.json?date="+bankdate;
	$.ajax ({
		url: saleListUrl,
	       type: "GET",
	       success: function(data){
	    	  // console.log(JSON.stringify(data));
	    	   $("#hiddenVal").val(JSON.stringify(data));
	       }
	});	
}
function calcRetention(){
	var cashValue = $('#hiddenVal').val();
    var creditValue = $('#bankCredit').val();
    $("#retention").val(cashValue-creditValue);
}


function submitBankCreditAmount(){
	var bankdate = $('#bankdate').val();
	var bankCredit = $('#bankCredit').val();
	var retention = $('#retention').val();
	if(bankdate == ""){
		alert("Please Select Date");
		return false;
	}
	if(bankCredit == ""){
		alert("Please fill Bank Credit Ammount");
		return false;
	}
	var json = {
			"bankCreditDetails":{
	    		"bankdate":bankdate,
	    		"bankCredit":bankCredit,
	    		"retention":retention
			}
	};
	submitBankCredit(json);
}
function submitBankCredit(json) {
	var myUrl = window.location.href;
	var url1 = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	   $.ajax({
		  async: false,
	      type: "POST",
	      contentType : 'application/json; charset=utf-8',
	     // dataType : "text",
	      url: url1+"saveBankCreditAmount",
	      headers: { 'x-my-custom-header': ip },
	      data: JSON.stringify(json), // Note it is important
	      success: function (data) {
	    	  alert(data.message); 
	    	  location.reload();
	      },
	      error: function (data) {
	    	  alert(data+"error");
	    	  location.reload();
	      }
	  });
	}
function generateSaleSheet() {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	$("#wait").css("display", "block");
	$.ajax({
        url: url+'downloadSaleDetailsForClosing',
        method: 'GET',
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = 'Sale_Sheet_'+$('#commentdate').val()+'.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
            $("#wait").css("display", "none");
        }
    });
	
 }
function generateEmptySaleSheet() {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	$("#wait").css("display", "block");
	$.ajax({
        url: url+'downloadEmptySaleDetailsForClosing',
        method: 'GET',
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = 'Sale_Sheet_'+$('#commentdate').val()+'.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
            $("#wait").css("display", "none");
        }
    });
	
 }