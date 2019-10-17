$(document).ready(function() {
	//showAlertMsg();
	buildBrandDropDown();
});

function buildBrandDropDown(){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getBrandDetails.json";
	$.ajax ({
		url: productListUrl,
	       type: "POST",
	       success: function(data){
	   //  console.log(JSON.stringify(data));
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
Number.prototype.toFixedDown = function(digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};
function myFunction() {
	var brandname = $("#brand option:selected").text();
	var n = brandname.split(" ");
    var val = n[n.length - 2].concat(n[n.length - 1]);
  //  alert(val);
    var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var singleBrandListUrl = url+"getSingleBrandDetail.json?brandNoAndPackQty="+val;
	$.ajax ({
		url: singleBrandListUrl,
	       type: "POST",
	       success: function(data){
	    	   console.log(JSON.stringify(data));
	    	   $.each(data, function (index, value) {
	    		   //$("#invoiceForm").show();
	    		   $('#brandNolbl').text(data[index].brandNo);
	    		   $('#brandNamelbl').text(data[index].brandName);
	    		   $('#productTypelbl').text(data[index].productType);
	    		   $('#quantitylbl').text(data[index].quantity);
	    		   $('#packQtylbl').text(data[index].packQty);
	    		   $('#packTypelbl').text(data[index].packType);
	    		   $('#brdNum').val(data[index].brandNo);
	    		   $('#brandNoPackQtyId').val(data[index].brandNoPackQty);
	    		   $('#packQtyId').val(data[index].packQty);
	    		   $('#packQtyRate').val(data[index].packQtyRate);
	    		   $('#SingleBottelRate').val(data[index].singleBottelRate);
	    		   $('#saleId').val(data[index].saleId);
	    		   $('#QtyBottels').val(0);
	    		   $('#caseQty').val("");
	    		   $('#productTyp').val(data[index].productType);
	    		   if(data[index].productType == "BEER"){
	    			   var price = Math.ceil(((data[index].singleBottelRate+(25*(data[index].singleBottelRate/100)))).toFixedDown(2)/10)*10;
	    		   $('#EachBottleMrp').val(price);
	    	      }else{
	    	    	  var price = Math.ceil(((data[index].singleBottelRate+(20*(data[index].singleBottelRate/100)))).toFixedDown(2)/10)*10;
		    		   $('#EachBottleMrp').val(price);
	    	      }
	    		   
	    			   
	    		   
	    		   
	    		   
	    		   
	    		  /* if(data[index].packQtyRate == 0 || data[index].singleBottelRate == 0 || data[index].unitPrice == 0){
	    			   $("#packQtyRate").attr("readonly", false); 
	    			   $("#SingleBottelRate").attr("readonly", false); 
	    			   $("#EachBottleMrp").attr("readonly", false); 
	    		   }else{
	    			   $("#packQtyRate").attr("readonly", true); 
	    			   $("#SingleBottelRate").attr("readonly", true); 
	    			   $("#EachBottleMrp").attr("readonly", true);
	    		   
	    		   }*/
	    		   
	   	      });
	    }
	});
}
function saveMrpRoundOff(date,dateAsPerCopy,mrproundoff,turnoverTax,tcsVal){
	//alert("date>> "+date+" mrproundoff>> "+mrproundoff);
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"saveMrpRoundOff.json?date="+date+"&dateAsPerCopy="+dateAsPerCopy+"&mrproundoff="+mrproundoff+"&turnoverTax="+turnoverTax+"&tcsVal="+tcsVal;
	$.ajax ({
		url: productListUrl,
	       type: "POST",
	       success: function(data){
	     
	    }
	});
}
function getFirstCellTextList() {
	saveMrpRoundOff($('#datepicker').val(),$('#dateAsPerCopy').val(),$('#mrpRoundOff').val(),$('#turnoverTax').val(),$('#tcsVal').val());
	var copyDate = $('#dateAsPerCopy').val();
	 var json = {"invoiceDetails": []};
	 var table = $("#ItemsTable tbody");
	 table.find('tr').each(function (i) {
	        var $tds = $(this).find('td'),
	            productId = $tds.eq(0).text(),
	            sno = $tds.eq(1).text(),
	            brandNumber = $tds.eq(2).text(),
	            brandName = $tds.eq(3).text(),
	            productType = $tds.eq(4).text(),
	            packTypelbl = $tds.eq(5).text(),
	            packQtyId = $tds.eq(6).text(),
	            quantity = $tds.eq(7).text(),
	            caseQty = $tds.eq(8).text(),
	            QtyBottels = $tds.eq(9).text(),
	            packQtyRate = $tds.eq(10).text(),
	            SingleBottelRate = $tds.eq(11).text(),
	            EachBottleMrp = $tds.eq(12).text(),
	            totalValue = $tds.eq(13).text(),
	            brandNoPackQtyId = $tds.eq(14).text(),
	            saleId = $tds.eq(15).text(),
	            date = $tds.eq(16).text();
	            dateAsCopy = $tds.eq(17).text();
	        if(brandNoPackQtyId != 0){
	        var input = {
	        		"brandName":brandName.trim(),
	        		"brandNumber":brandNumber.trim(),
	        		"packQtyId":packQtyId.trim(),
	        		"date":date.trim(),
	        		"dateAsCopy":copyDate.trim(),
	        		"caseQty":caseQty.trim(),
	        		"packQtyRate":packQtyRate.trim(),
	        		"QtyBottels":QtyBottels.trim(),
	        		"SingleBottelRate":SingleBottelRate.trim(),
	        		"EachBottleMrp":EachBottleMrp.trim(),
	        		"totalValue":totalValue.trim(),
	        		"brandNoPackQtyId":brandNoPackQtyId.trim(),
	        		"saleId":saleId.trim()
	        };
	        json.invoiceDetails.push(input);
	        }
	    });
	// console.log(JSON.stringify(json));
	 searchText(json);
	}
function searchText(json) {
	var myUrl = window.location.href;
	var url1 = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	   $.ajax({
		  async: false,
	      type: "POST",
	      contentType : 'application/json; charset=utf-8',
	      //dataType : 'json',
	      url: url1+"/saveInvoiceJsonData",
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
function validationFun(num1){
	var number= $(num1).val();
	//alert(opening);
	if(!(validateNumber(number))){
		alert("Please fill Correct Value");
		$(num1).val("");
		return false;
	}
	return true;
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

function validateNumber(number){
	var regex = /^[0-9]*(?:\d{1,2})?$/;
	return regex.test(number);
}
function validateDecimalNumber(number2){
	var regex = /^\d{0,9}(\.\d{0,2})?$/;
	return regex.test(number2);
}