$(document).ready(function() {
	buildupdateSaleDates();
	buildBrandDropDown()
	$('#updatesale').hide();
});
function buildupdateSaleDates(){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getTotalSaleDate.json";
	$.ajax ({
		url: productListUrl,
	       type: "POST",
	       success: function(data){
	      //console.log(JSON.stringify(data));
	      var enableDays =[];
	      $.each(data, function (index, value) {
	    	  enableDays.push(data[index].date);
	      });
	      getTimeStamp(enableDays);
	    }
	});
}
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
function buildBrandDropDown(){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getBrandDetails.json";
	$.ajax ({
		url: productListUrl,
	       type: "POST",
	       success: function(data){
	      //console.log(JSON.stringify(data));
	      var brand =new Array();
	      $.each(data, function (index, value) {
	    	//  alert(data[index].brandName);
	    	  brand.push(data[index].brandName+" "+data[index].brandNo+" "+data[index].packQty);
	      });
	      $("#brand").select2({
			  data: brand
			});
	    }
	});
}
function myFunction() {
	var date = $("#startDate").val();
	if(date.length = "" || date.length == 0){
		alert("Please select date");
	}else{
		$('#updatesale').show();
	var brandname = $("#brand option:selected").text();
	var n = brandname.split(" ");
    var val = n[n.length - 2].concat(n[n.length - 1]);
    var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var singleBrandListUrl = url+"getSingleSaleDetailForUpdate.json?brandNoAndPackQty="+val+"&date="+date;
	$.ajax ({
		url: singleBrandListUrl,
	       type: "POST",
	       success: function(data){
	    	  // console.log(JSON.stringify(data));
	    	   var ulSecValues="";
	    	   var index=0;
	    	   ulSecValues="<thead><tr><th>Brand Number</th><th>Pack QTY.</th><th>Opening</th><th>Received</th><th>Return</th><th>Closing</th><th>Sale</th><th>Unit Price</th><th>Cost</th><th>Sale Date</th></tr></thead>";
	    	   $.each(data, function (index, value) {
	    		   ulSecValues=ulSecValues+ "<tr><td>"+n[n.length - 2]+"</td><td>"+n[n.length - 1]+"</td><td id=\'openingval"+index+"'>"+data[index].opening+"</td><td id=\'receivedval"+index+"'>"+data[index].received+"</td><td id=\'returnval"+index+"'>"+data[index].noOfReturnsBtl+"<td><input type=\"number\" id=\'closingval"+index+"' class=\"form-control\" value=\'"+data[index].closing+"\' placeholder=\" (Ex. 123)\" name=\"closing\"  onkeyup=\"validationFun(this,"+data[index].unitPrice+","+index+")\" onclick=\"validationFun(this,"+data[index].unitPrice+","+index+")\" required></td><td id=\'totalvalsale"+index+"'>"+data[index].totalSale+"</td><td>"+data[index].unitPrice+"</td><td id=\'totalvalvalue"+index+"'>"+data[index].totalPrice+"</td><td>"+data[index].saleDate+"</td><td style=\"display:none\">"+data[index].saleId+"</td><td style=\"display:none\">"+data[index].brandNoPackQty+"</td></tr>"; 
	    		   index++;
	    	   });
	    	   $("#saledetails").html(ulSecValues);
	    }
	});
	}
}

function validateNumber(id){
	var number = $("#"+id).val();
	var regex = /^[0-9]*(?:\d{1,2})?$/;
	return regex.test(number);
}
function validationFun(num1,price,index){
	var closing= $(num1).val();
	//alert("Unit> "+unit+"sale> "+sale+" price> "+price);
	if(!(validateNum(closing))){
		alert("Please fill Correct Value");
		$(num1).val("");
		return false;
	}
	/*if(parseInt(opening+received) < parseInt(closing)){
		alert("Closing Should Be Less Than Or Equal To Opening");
		$(num1).val("");
		return false;
	}
    var totalSale = parseInt(opening+received) - closing;
    var totalPrice = totalSale * unit;*/
   // $('#'+price).html(totalPrice);
   // $('#'+sale).html(totalSale);
	var opening = $('#openingval'+index).text();
	var received = $('#receivedval'+index).text();
	var returnval = $('#returnval'+index).text();
	var totalSale = parseInt(parseInt(opening)+parseInt(received)+parseInt(returnval)) - parseInt(closing);
	var totalPrice = totalSale * price;
	$('#totalvalsale'+index).html(totalSale);
	 $('#totalvalvalue'+index).html(totalPrice);
	
	 var receivedsec=$('#receivedval'+(index+1)).text();
    $('#openingval'+(index+1)).html(closing);
   // $('#closingval'+(index+1)).val(parseInt(closing)+parseInt(receivedsec));
   // $('#totalvalsale'+(index+1)).html(0);
   // $('#totalvalvalue'+(index+1)).html(0);
    
	return true;
	
	
}

function saveOnlySaleItems(){
	var flag=true;
  var json = {"saleDetails": []};
	var table = $("#saledetails tbody");
  var index=0;
	 table.find('tr').each(function (i) {
	        var $tds = $(this).find('td'),
	            brandNumber = $tds.eq(0).text(),
	            packQty = $tds.eq(1).text(),
	            opening = $tds.eq(2).text(),
	            received = $tds.eq(3).text(),
	            returnval = $tds.eq(4).text(),
	            closing = $tds.eq(5).text(),
	            sale = $tds.eq(6).text(),
	            unitPrice = $tds.eq(7).text(),
	            cost = $tds.eq(8).text(),
	            saleDate = $tds.eq(9).text(),
	            saleId = $tds.eq(10).text(),
	        brandNoPackQty = $tds.eq(11).text();
	        var closingval=$('#closingval'+index).val();
	        var totalopening=parseInt(parseInt(opening)+parseInt(received)+parseInt(returnval));
	        var totalSale=totalopening-parseInt(closingval);
	        if(totalopening < parseInt(closingval)){
	        	alert("Please check Closing for this Date "+saleDate);
	        	flag=false;
	        	return false;
	        }
	        if(totalSale != parseInt(sale)){
	        	alert("Please check Sale for this Date "+saleDate);
	        	flag=false;
	        	return false;
	        }
	        var input = {
	        		"brandNoPackQty":brandNoPackQty,
	        		"opening":opening,
	        		"received":received,
	        		"returnval":returnval,
	        		"closing":$('#closingval'+index).val(),
	        		"totalSale":sale,
	        		"unitPrice":unitPrice,
	        		"totalPrice":cost,
	        		"saleDate":saleDate,
	        		"saleId":saleId
	        };
	        json.saleDetails.push(input);
	        index++;
	    });
	 if(flag)
	 updateSale(json);
}



function validateAmount(amount){
	var amount= $(amount).val();
	//alert(opening);
	if(!(validateNum(amount))){
		alert("Please fill Correct Value");
		$('#amount').val('');
		return false;
	}
	return true;
	
	
}
function validateNum(number){
	var regex = /^[0-9]*(?:\d{1,2})?$/;
	return regex.test(number);
}


$(function(data) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var saleListUrl = url+"getCashCardSale.json";
	$.ajax ({
		url: saleListUrl,
	       type: "POST",
	       success: function(data){
	    	  console.log(JSON.stringify(data));
	    	   var saleDetails="";
	    		   saleDetails=saleDetails+"<label>Selected Date:</label><input type=\"text\" class=\"form-control\" id=\"cardDate\" name=\"cardDate\" value=\'"+data.date+"\' readonly>" +
	    		   		"<label>Enter Card Sale:</label><input type=\"number\" class=\"form-control\" id=\"cardSale\"  name=\"cardSale\" onkeyup=\"validationDecimalFun(this)\" value=\'"+data.cardSale+"\'  required>" +
	    		   		"<label>Enter Cash Sale:</label><input type=\"number\" class=\"form-control\" id=\"cashSale\" name=\"cashSale\" onkeyup=\"validationDecimalFun(this)\" value=\'"+data.cashSale+"\' required>" +
	    		   		"<label>Enter Cheque Sale:</label><input type=\"number\" class=\"form-control\" id=\"chequeSale\" name=\"chequeSale\" onkeyup=\"validationDecimalFun(this)\" value=\'"+data.chequeSale+"\' required>" +
	    		   		"<input type=\"hidden\" id=\"cardcashid\" name=\"cardcashid\" value=\'"+data.id+"\'><input type=\"button\" class=\" btn btn-default btn-rounded\" onclick=\"submitCardSaleData()\" value=\"SUBMIT\" />";
	    		   $("#cardSaleFormId").html(saleDetails);
	       }
	});	
});
$(function(data) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var saleListUrl = url+"getExpensesData.json";
	$.ajax ({
		url: saleListUrl,
	       type: "POST",
	       success: function(data){
	    	   //console.log(JSON.stringify(data));
	    	   var saleDetails="";
	    	    saleDetails=saleDetails+"<label>Selected Date: </label><input type=\"text\" class=\"form-control\" id=\"emasterDate\" name=\"emasterDate\" value=\'"+data.expenseMasterDate+"\' readonly><input type=\"hidden\" class=\"form-control\" id=\"catmasterId\" name=\"catmasterId\" value=\'"+data.expenseMasterId+"\' readonly>";
	    	   $.each(data.updateExpenseAndMasterExpense, function (index, value) {
	    		   saleDetails=saleDetails+"<label>"+data.updateExpenseAndMasterExpense[index].expenseName+"</label> <input type=\"number\" class=\"form-control\" id=\'amount"+index+"' value=\'"+data.updateExpenseAndMasterExpense[index].expenseChildAmount+"\'><label>Comment</label><input type=\"text\" class=\"form-control\" id=\'comment"+index+"' value=\'"+data.updateExpenseAndMasterExpense[index].comment+"\'><input type=\"hidden\" class=\"form-control\" id=\'expensechild"+index+"' value=\'"+data.updateExpenseAndMasterExpense[index].expenseChildId+"\'>";
	    		   
	    	   });
	    	   $("#UpdateExpensesFormId").html(saleDetails);
	       }
	});	
});
function updateExpenseItems(form){
var button = $('.updateexpense');
$(button).attr('disabled', 'disabled');
var json = {"expenseDetails": []};
var total=0;
$("#expenseForm").each( function(){
var index=0;
 $(this).find('input[type=number]').each( function(){
    var input = {
    		"amount":$('#amount'+index).val().trim(),
    		"comment":$('#comment'+index).val().trim(),
    		"expensechild":$('#expensechild'+index).val().trim()
    };
    json.expenseDetails.push(input);
    total=total+parseInt($('#amount'+index).val().trim());
    index++;

});
});
var amountinput = {
		"emasterDate":$("#emasterDate").val(),
		"totalAmount":total,
		"catmasterId":$("#catmasterId").val()
};
json.expenseDetails.push(amountinput);
updateExpenses(json);
}
function updateExpenses(json){
	var myUrl = window.location.href;
	var url1 = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	   $.ajax({
		  async:false,
	      type: "POST",
	      contentType : 'application/json; charset=utf-8',
	      //dataType : 'json',
	      url: url1+"/updateUpdateExpenses",
	      headers: { 'x-my-custom-header': ip },
	      data: JSON.stringify(json), // Note it is important
	      success: function (data) {
	    	 alert(data.message);
	    	 location.reload(true);
	      },
	      error: function (data) {
	    	  alert(data+"error");
	    	  location.reload(true);
	      },
	      complete: function() {
	    	   location.reload(true);
	       }
	  });
}
/*function updateSaleItems(form){
		    var button = $('.saveDetail');
		    $(button).attr('disabled', 'disabled');
	    var json = {"saleDetails": []};
		$("#saleForm").each( function(){
		    var index=0;
		    //console.log(JSON.stringify(json));
		    var table = $("#saledetails tbody");
		    var index=0;
			 table.find('tr').each(function (i) {
			        var $tds = $(this).find('td'),
			            brandName = $tds.eq(0).text(),
			            brandNo = $tds.eq(1).text(),
			            productType = $tds.eq(2).text(),
			            quantity = $tds.eq(3).text(),
			            packQty = $tds.eq(4).text(),
			            packType = $tds.eq(5).text(),
			            opening = $tds.eq(6).text(),
			            received = $tds.eq(7).text(),
			            closing = $tds.eq(8).text(),
			            sale = $tds.eq(9).text(),
			            unitPrice = $tds.eq(10).text(),
			            cost = $tds.eq(11).text(),
			            saleDate = $tds.eq(12).text(),
			            brandNoPackQty = $tds.eq(13).text(),
			            saleId = $tds.eq(14).text();
			        var input = {
			        		"received":received,
			        		"closing":$('#closing'+index).val(),
			        		"totalSale":sale,
			        		"unitPrice":unitPrice,
			        		"totalPrice":cost,
			        		"opening":opening,
			        		"saleDate":saleDate,
			        		"brandNoPackQty":brandNoPackQty,
			        		"saleId":saleId
			        };
			        json.saleDetails.push(input);
			        index++;
			    });
		    updateSale(json);
			// console.log(JSON.stringify(json));
		});
	}*/
function updateSale(json) {
	var myUrl = window.location.href;
	var url1 = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	   $.ajax({
		  async:false,
	      type: "POST",
	      contentType : 'application/json; charset=utf-8',
	      //dataType : 'json',
	      url: url1+"/updateSaleDetails",
	      headers: { 'x-my-custom-header': ip },
	      data: JSON.stringify(json), // Note it is important
	      success: function (data) {
	    	 alert(data.message);
	    	 location.reload(true);
	      },
	      error: function (data) {
	    	  alert(data+"error");
	    	  location.reload(true);
	      },
	      complete: function() {
	    	   location.reload(true);
	       }
	  });
	}
function submitCardSaleData(){
	var card = $('#cardSale').val();
	var cash = $('#cashSale').val();
	var cheque = $('#chequeSale').val();
	var date = $('#cardDate').val();
	var id = $('#cardcashid').val();
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
				"id":id,
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
/*function validateDecimalNumber(number2){
	var regex = /^\d{0,9}(\.\d{0,2})?$/;
	return regex.test(number2);
}
function validateNumber(id){
	var number = $("#"+id).val();
	var regex = /^[0-9]*(?:\d{1,2})?$/;
	return regex.test(number);
}
function validateNum(number){
	var regex = /^[0-9]*(?:\d{1,2})?$/;
	return regex.test(number);
}
function validationFun(num1,opening,received,unit,sale,price){
	var closing= $(num1).val();
	//alert("Unit> "+unit+" opening>> "+opening+"sale> "+sale+" price> "+price);
	if(!(validateNum(closing))){
		alert("Please fill Correct Value");
		$(num1).val("");
		return false;
	}
    if(parseInt(opening+received) < parseInt(closing)){
		alert("Closing Should Be Less Than Or Equal To Opening");
		$(num1).val("");
		return false;
	}
    var totalSale = parseInt(opening+received) - closing;
    var totalPrice = totalSale * unit;
    $('#'+price).html(totalPrice);
    if(totalSale > 0){
    	 $('#'+sale).html(totalSale);
    	// $('#'+sale).css('color', 'green');
    }else{
    	 $('#'+sale).html(totalSale);
    	// $('#'+sale).css('color', 'red');
    }
	return true;
	
	
}*/