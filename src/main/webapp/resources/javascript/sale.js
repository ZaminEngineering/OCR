$(document).ready(function() {
	$(".saveDetail").hide();
	$(".totalSaleItmes").hide();
	//buildSaleDates();
	getDetails();
	//chartCreation();
});
function getDetails(){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var saleListUrl = url+"getSingleSaleBrandDetailForClosing.json";
	$.ajax ({
		url: saleListUrl,
	       type: "POST",
	       success: function(data){
	    	 // console.log(JSON.stringify(data));
	    	var ttlmrp=0;
	    	var borderColor="";
	    	var ulSecValues="";
	    	var ulValues="";
	    	var index=0;
	    	  ulSecValues="<thead><tr><th>Brand Name</th><th>Brand No.</th><th>Product Type</th><th>Quantity</th><th>Pack Quantity</th><th>Pack Type</th><th>Opening</th><th>Received</th><th>Return</th><th>Closing</th><th>Sale</th><th>Unit Price</th><th>Cost</th></tr></thead>";
	 		   ulValues="<thead><tr><th>Brand Name</th><th>Brand No.</th><th>Product Type</th><th>Quantity</th><th>Pack Quantity</th><th>Pack Type</th><th>Opening</th><th>Received</th><th>Return</th><th>Closing</th><th>Sale</th><th>Unit Price</th><th>Cost</th></tr></thead>";	    	        	 
			        $.each(data.saleBean, function (index, value) {
				if(data.saleBean[index].totalSale == 0)
					borderColor = 'saleRedBorder';
				else
					borderColor = 'saleGreenBorder';
					
				ttlmrp=ttlmrp+(data.saleBean[index].totalPrice);
	    		  var ttlclosing=parseInt(data.saleBean[index].opening)+parseInt(data.saleBean[index].received);
	    		  if(ttlclosing != 0)
	    	     ulValues=ulValues+ "<tr><td>"+data.saleBean[index].brandName+"</td><td>"+data.saleBean[index].brandNo+"</td><td>"+data.saleBean[index].productType+"</td><td>"+data.saleBean[index].quantity+"</td><td>"+data.saleBean[index].packQty+"</td><td>"+data.saleBean[index].packType+"</td><td>"+data.saleBean[index].opening+"</td><td>"+data.saleBean[index].received+"</td><td><input type=\"number\" id=\'return"+index+"' class=\"enterValidate\" value=\'0' placeholder=\" (Ex. 123)\" name=\"return\" onkeyup=\"validateReturn(this,"+ttlclosing+",'closing"+index+"','totalsale"+index+"')\" onclick=\"validateReturn(this,"+ttlclosing+",'closing"+index+"','totalsale"+index+"')\"  required></td><td><input type=\"number\" id=\'closing"+index+"' class=\"enterValidate\" value=\'"+ttlclosing+"\' placeholder=\" (Ex. 123)\" name=\"closing\"  onkeyup=\"validationFun(this,"+data.saleBean[index].opening+","+data.saleBean[index].received+","+data.saleBean[index].unitPrice+",'totalsale"+index+"','totalvalue"+index+"','return"+index+"')\" onclick=\"validationFun(this,"+data.saleBean[index].opening+","+data.saleBean[index].received+","+data.saleBean[index].unitPrice+",'totalsale"+index+"','totalvalue"+index+"','return"+index+"')\" required></td><td id=\'totalsale"+index+"' class=\""+borderColor+"\">"+data.saleBean[index].totalSale+"</td><td>"+data.saleBean[index].unitPrice+"</td><td id=\'totalvalue"+index+"'>"+data.saleBean[index].totalPrice+"</td><td style=\"display:none\">"+data.saleBean[index].saleDate+"</td><td style=\"display:none\">"+data.saleBean[index].brandNoPackQty+"</td></tr>";
	    		  else
	    			  ulValues=ulValues+ "<tr style=\"display:none\"><td>"+data.saleBean[index].brandName+"</td><td>"+data.saleBean[index].brandNo+"</td><td>"+data.saleBean[index].productType+"</td><td>"+data.saleBean[index].quantity+"</td><td>"+data.saleBean[index].packQty+"</td><td>"+data.saleBean[index].packType+"</td><td>"+data.saleBean[index].opening+"</td><td>"+data.saleBean[index].received+"</td><td><input type=\"number\" id=\'return"+index+"' class=\"enterValidate\" value=\'0' placeholder=\" (Ex. 123)\" name=\"return\" onkeyup=\"validateReturn(this,"+ttlclosing+",'closing"+index+"','totalsale"+index+"')\" onclick=\"validateReturn(this,"+ttlclosing+",'closing"+index+"','totalsale"+index+"')\"  required></td><td><input type=\"number\" id=\'closing"+index+"' class=\"enterValidate\" value=\'"+ttlclosing+"\' placeholder=\" (Ex. 123)\" name=\"closing\"  onkeyup=\"validationFun(this,"+data.saleBean[index].opening+","+data.saleBean[index].received+","+data.saleBean[index].unitPrice+",'totalsale"+index+"','totalvalue"+index+"','return"+index+"')\" onclick=\"validationFun(this,"+data.saleBean[index].opening+","+data.saleBean[index].received+","+data.saleBean[index].unitPrice+",'totalsale"+index+"','totalvalue"+index+"','return"+index+"')\" required></td><td id=\'totalsale"+index+"' class=\""+borderColor+"\">"+data.saleBean[index].totalSale+"</td><td>"+data.saleBean[index].unitPrice+"</td><td id=\'totalvalue"+index+"'>"+data.saleBean[index].totalPrice+"</td><td style=\"display:none\">"+data.saleBean[index].saleDate+"</td><td style=\"display:none\">"+data.saleBean[index].brandNoPackQty+"</td></tr>"; 
	    		  ulSecValues=ulSecValues+ "<tr><td>"+data.saleBean[index].brandName+"</td><td>"+data.saleBean[index].brandNo+"</td><td>"+data.saleBean[index].productType+"</td><td>"+data.saleBean[index].quantity+"</td><td>"+data.saleBean[index].packQty+"</td><td>"+data.saleBean[index].packType+"</td><td>"+data.saleBean[index].opening+"</td><td>"+data.saleBean[index].received+"</td><td><input type=\"number\" id=\'returnval"+index+"' class=\"enterValidate\" value=\'0' placeholder=\" (Ex. 123)\" name=\"return\" onkeyup=\"validateReturn(this,"+ttlclosing+",'closingval"+index+"','totalsale"+index+"')\" onclick=\"validateReturn(this,"+ttlclosing+",'closingval"+index+"','totalsale"+index+"')\"  required></td><td><input type=\"number\" id=\'closingval"+index+"' class=\"enterValidate\" value=\'"+ttlclosing+"\' placeholder=\" (Ex. 123)\" name=\"closing\"  onkeyup=\"validationFun(this,"+data.saleBean[index].opening+","+data.saleBean[index].received+","+data.saleBean[index].unitPrice+",'totalvalsale"+index+"','totalvalvalue"+index+"','returnval"+index+"')\" onclick=\"validationFun(this,"+data.saleBean[index].opening+","+data.saleBean[index].received+","+data.saleBean[index].unitPrice+",'totalvalsale"+index+"','totalvalvalue"+index+"''returnval"+index+"')\" required></td><td id=\'totalvalsale"+index+"' class=\""+borderColor+"\">"+data.saleBean[index].totalSale+"</td><td>"+data.saleBean[index].unitPrice+"</td><td id=\'totalvalvalue"+index+"'>"+data.saleBean[index].totalPrice+"</td><td style=\"display:none\">"+data.saleBean[index].saleDate+"</td><td style=\"display:none\">"+data.saleBean[index].brandNoPackQty+"</td></tr>";
	    		  $(".saveDetail").show(); 
	    		  index++;
	      });
			$("#saledetails").html(ulValues);
			$("#saleSecDetails").html(ulSecValues);
			$("#saleNextDate").html("<span> Date:   "+data.expenseDate+"</span>");
			$('#commentdate').val(data.expenseDate);
			 getCardCashSale();
	    }
	});
	
}
function getCardCashSale(){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var saleListUrl = url+"getCashCardSaleDate.json";
	$.ajax ({
		url: saleListUrl,
	       type: "POST",
	       success: function(data){
	    	  // console.log(JSON.stringify(data));
	    	   var saleDetails="";
	    		   saleDetails=saleDetails+"<label>Selected Date:</label><input type=\"text\" class=\"form-control\" id=\"cardDate\" name=\"cardDate\" value=\'"+data.message+"\' readonly>" +
	    		   		"<label>Enter Card Sale:</label><input type=\"number\" class=\"form-control\" id=\"cardSale\"  name=\"cardSale\" onkeyup=\"validationDecimalFun(this)\" value=\'\'  required>" +
	    		   		"<label>Enter Cash Sale:</label><input type=\"number\" class=\"form-control\" id=\"cashSale\" name=\"cashSale\" onkeyup=\"validationDecimalFun(this)\" value=\'\' required>" +
	    		   		"<label>Enter Cheque Sale:</label><input type=\"number\" class=\"form-control\" id=\"chequeSale\"  name=\"chequeSale\" onkeyup=\"validationDecimalFun(this)\" value=\'\'  required>" +
	    		   		"<p style=\"text-align: center;\"><input type=\"button\" class=\" btn btn-default btn-rounded\" onclick=\"submitCardSaleData()\" value=\"Submit\" /></p>";
	    		   $("#cardSaleFormId").html(saleDetails);
	       }
	});	
}

function saveOnlySaleItems(form){
	addCommentForSale($('#commentdate').val(),$('textarea#saleComment').val());
	  var button = $('.saveDetail');
	 $(button).attr('disabled', 'disabled');
    var json = {"ipAddr":ip,
    		    "saleDetails": []
    };
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
	            returnbtl = $tds.eq(8).text(),
	            closing = $tds.eq(9).text(),
	            sale = $tds.eq(10).text(),
	            unitPrice = $tds.eq(11).text(),
	            cost = $tds.eq(12).text(),
	            saleDate = $tds.eq(13).text(),
	            brandNoPackQty = $tds.eq(14).text();
	        var input = {
	        		"received":received,
	        		"returnbtl":$('#return'+index).val(),
	        		"closing":$('#closing'+index).val(),
	        		"totalSale":sale,
	        		"unitPrice":unitPrice,
	        		"totalPrice":cost,
	        		"opening":opening,
	        		"saleDate":saleDate,
	        		"brandNoPackQty":brandNoPackQty
	        };
	        json.saleDetails.push(input);
	        index++;
	    });
	    searchText(json);
}
function saveTotalSaleItems(form){
	addCommentForSale($('#commentdate').val(),$('textarea#saleCommentTotal').val());
    var button = $('.saveDetail');
    $(button).attr('disabled', 'disabled');
var json = {"ipAddr":ip,
		    "saleDetails": []
        };
$("#saleFormSecond").each( function(){
    var index=0;
   /* $(this).find('input[type=number]').each( function(){
        var input = {
        		"closing":$('#closingval'+index).val().trim(),
        		"unitPrice":$('#unitpriceval'+index).val().trim(),
        		"opening":$('#openingval'+index).val().trim(),
        		"brandNoPackQty":$('#brandNoPackQtyval'+index).val().trim(),
        		"saleId":$('#saleIdval'+index).val().trim(),
        		"saleDate":$('#saleDateval'+index).val().trim()
        };
        json.saleDetails.push(input);
        index++;*/
    var table = $("#saleSecDetails tbody");
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
	            returnbtl = $tds.eq(8).text(),
	            closing = $tds.eq(9).text(),
	            sale = $tds.eq(10).text(),
	            unitPrice = $tds.eq(11).text(),
	            cost = $tds.eq(12).text(),
	            saleDate = $tds.eq(13).text(),
	            brandNoPackQty = $tds.eq(14).text();
	        var input = {
	        		"received":received,
	        		"returnbtl":$('#returnval'+index).val(),
	        		"closing":$('#closingval'+index).val(),
	        		"totalSale":sale,
	        		"unitPrice":unitPrice,
	        		"totalPrice":cost,
	        		"opening":opening,
	        		"saleDate":saleDate,
	        		"brandNoPackQty":brandNoPackQty
	        };
	        json.saleDetails.push(input);
	        index++;
    }); 
    searchText(json);
});
}
function searchText(json) {
	var myUrl = window.location.href;
	var url1 = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	   $.ajax({
		  async:false,
	      type: "POST",
	      contentType : 'application/json; charset=utf-8',
	      //dataType : 'json',
	      url: url1+"/saveSingleSaleBrandDetail",
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
function validateNumber(id){
	var number = $("#"+id).val();
	var regex = /^[0-9]*(?:\d{1,2})?$/;
	return regex.test(number);
}
function validationFun(num1,opening,received,unit,sale,price,returnval){
	$( ".enterValidate" ).keypress(function( event ) {
		  if ( event.keyCode == 13 ) {
		     event.preventDefault();
		  }
	});
	var sumOfTotalAmount=0;
	var sumOfTotalSale=0;
	var closing= $(num1).val();
	console.log("closing>> "+closing);
	var returntextval = parseInt($('#'+returnval).val());
	//alert("Unit> "+unit+"sale> "+sale+" price> "+price);
	if(!(validateNum(closing))){
		alert("Please fill Correct Value");
		$(num1).val("");
		return false;
	}
    if(parseInt(opening+received+returntextval) < parseInt(closing)){
		alert("Closing Should Be Less Than Or Equal To Opening");
		$(num1).val("");
		return false;
	}
    var totalSale = parseInt(opening+received+returntextval) - closing;
    var totalPrice = totalSale * unit;
    $('#'+price).html(totalPrice);
    if(totalSale > 0){
    	 $('#'+sale).html(totalSale);
    	 $('#'+sale).css('color', 'green');
    }else{
    	 $('#'+sale).html(totalSale);
    	 $('#'+sale).css('color', 'red');
    }
    var table = $("#saledetails tbody");
	 table.find('tr').each(function (i) {
		 var $tds = $(this).find('td'),
		 sale = parseInt($tds.eq(10).text()),
         cost = parseInt($tds.eq(12).text())
         
         sumOfTotalSale=sumOfTotalSale+sale;
		 sumOfTotalAmount=sumOfTotalAmount+cost;
	 });
	 $(".sumOfTotalSale").text("Total Bottle Sale:  "+sumOfTotalSale);
     $(".sumOfTotalAmount").text("Total Amount:  "+sumOfTotalAmount);
	return true;
	
}
function validateReturn(returnid,closing,closingid,totalsaleid){
	$( ".enterValidate" ).keypress(function( event ) {
		  if ( event.keyCode == 13 ) {
		     event.preventDefault();
		  }
	});
	var returnval= $(returnid).val();
	if(!(validateNum(returnval))){
		alert("Please fill Correct Value");
		$(returnid).val("");
		return false;
	}
	var newclosing = parseInt(closing)+parseInt(returnval);
	$('#'+closingid).val(newclosing);
	$('#'+totalsaleid).html(0);
	 $('#'+totalsaleid).css('color', 'red');
	return true;
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

/*function onlySaleItem(){
	$(".totalSaleItmes").hide();
	$(".onlySaleItmes").show();
	
}
function totalSaleItmes(){
	$(".onlySaleItmes").hide();
	$(".totalSaleItmes").show();

}*/
function includeZeroSaleOrNot(){
	var catOrComp = $('#includeZeroSaleOrNot').prop('checked');
   if(catOrComp === true){
	   $(".onlySaleItmes").hide();
	   $(".totalSaleItmes").show();
   }else{
	  
	   $(".totalSaleItmes").hide();
	   $(".onlySaleItmes").show();
   }
	   
}
