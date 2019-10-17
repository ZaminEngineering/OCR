$(document).ready(function() {
	$('.totalSaleItmes').hide();
	//getDetailsforEditMrp();
});
$( function() {
	$('.newInvoiceForm').hide();
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getTotalInvoiceDate.json";
	$.ajax ({
		url: productListUrl,
	       type: "POST",
	       success: function(data){
	      console.log(JSON.stringify(data));
	      var startDate="";
	      var enableDays =[];
	      $.each(data, function (index, value) {
	    	  startDate=data[index].date;
	      });
	      var myDate=new Date(startDate);
	      myDate.setDate(myDate.getDate()+1);
	      // format a date
	      var dateval = myDate.getFullYear()+ '-' + ("0" + (myDate.getMonth() + 1)).slice(-2) + '-' + myDate.getDate();
	      $( "#datepicker" ).datepicker({
	    	  dateFormat: 'yy-mm-dd',
	          minDate: dateval
	      });
	    }
	});
  });
function getDetailsforEditMrp(){
	var ivoicedate = $('#datepicker').val();
	   if(ivoicedate!=""){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var saleListUrl = url+"getDetailsforEditMrp.json";
	$.ajax ({
		url: saleListUrl,
	       type: "POST",
	       success: function(data){
	    	   //console.log(JSON.stringify(data));
	    	  var ulSecValues="";
	    	  var cnt=1;
	    	   ulSecValues="<thead><tr><th>S No.</th><th>Brand Name</th><th>Brand No.</th><th>Product Type</th><th>Quantity</th><th>Pack Quantity</th><th>Pack Type</th><th>Pack Qty (Case) Rate</th><th>Single Bottle Rate</th><th>Single Bottle Sale Mrp</th></tr></thead>";
	    	   $.each(data, function (index, value) {
		       ulSecValues=ulSecValues+ "<tr><td>"+cnt+++"</td><td>"+data[index].brandName+"</td><td>"+data[index].brandNo+"</td><td>"+data[index].productType+"</td><td>"+data[index].quantity+"</td><td>"+data[index].packQty+"</td><td>"+data[index].packType+"</td><td><input type=\"number\" id=\'unitprice"+index+"' value=\'"+data[index].unitPrice+"\' placeholder=\" (Ex. 123)\" name=\"\"  onkeyup=\"validationFun(this)\" onclick=\"validationFun(this)\" required step=\".01\"></td><td><input type=\"number\" id=\'singlebtlinvoicemrp"+index+"' value=\'"+data[index].singleBottelPrice+"\' placeholder=\" (Ex. 123)\" name=\"\"  onkeyup=\"validationFun(this)\" onclick=\"validationFun(this)\" required step=\".01\"></td></td><td><input type=\"number\" id=\'singlebtlmrp"+index+"' value=\'"+data[index].bottleSaleMrp+"\' placeholder=\" (Ex. 123)\" name=\"\"  onkeyup=\"validationFun(this)\" onclick=\"validationFun(this)\" required step=\".01\"></td><td style=\"display:none\">"+data[index].brandNoPackQty+"</td></tr>";
		      });
	    	   $("#saleSecDetails").html(ulSecValues);
	    	   $('.totalSaleItmes').show();
	       }
	});	
	   }else{
		   alert("Please Select Date");
	   }
}
function saveTotalSaleItems(form){
    var button = $('.saveDetail');
    $(button).attr('disabled', 'disabled');
var json = {"invoiceDetails": []};
$("#saleFormSecond").each( function(){
    var index=0;
    var table = $("#saleSecDetails tbody");
    var index=0;
	 table.find('tr').each(function (i) {
	        var $tds = $(this).find('td'),
	            sno = $tds.eq(0).text(),
	            brandName = $tds.eq(1).text(),
	            brandNo = $tds.eq(2).text(),
	            productType = $tds.eq(3).text(),
	            quantity = $tds.eq(4).text(),
	            packQty = $tds.eq(5).text(),
	            packType = $tds.eq(6).text(),
	            packQtyRate = $tds.eq(7).text(),
	            singleBottleRate = $tds.eq(8).text(),
	            bottleSaleMrp = $tds.eq(9).text(),
	            brandNoPackQty = $tds.eq(10).text()
	           
	        var input = {
	        	"brandName":brandName.trim(),
        		"brandNumber":brandNo.trim(),
        		"packQtyId":packQty.trim(),
        		"date":$('#datepicker').val(),
        		"caseQty":0,
        		"packQtyRate":$('#unitprice'+index).val(),
        		"QtyBottels":0,
        		"SingleBottelRate":$('#singlebtlinvoicemrp'+index).val(),
        		"EachBottleMrp":$('#singlebtlmrp'+index).val(),
        		"totalValue":0,
        		"brandNoPackQtyId":brandNoPackQty.trim()
	        };
	        json.invoiceDetails.push(input);
	        index++;
    }); 
    searchText(json);
});
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
function validateNumber(id){
	var number = $("#"+id).val();
	var regex = /^[0-9]*(?:\d{1,2})?$/;
	return regex.test(number);
}
function validationFun(num1){
	var closing= $(num1).val();
	if(!(validateNum(closing))){
		alert("Please fill Correct Value");
		$(num1).val("");
		return false;
	}
	return true;
	
	
}

function validateNum(number){
	var regex = /^[1-9]\d*(\.\d+)?$/;
	return regex.test(number);
}