$( function() {
	$('.newInvoiceForm').hide();
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getTotalInvoiceDate.json";
	$.ajax ({
		url: productListUrl,
	       type: "POST",
	       success: function(data){
	     // console.log(JSON.stringify(data));
	      var startDate="";
	      var enableDays =[];
	      $.each(data, function (index, value) {
	    	  startDate=data[index].date;
	      });
	      $( "#datepicker" ).datepicker({
	    	  dateFormat: 'yy-mm-dd',
	      	//changeMonth: true,
	       //   changeYear: true,
	          minDate: startDate
	      });
	    }
	});
  });

$(document).ready(function(){
	var count=0;
	var total=0;
	var sno=1;
	var flag=true;
	var removeVal=0;
	var sumOfPackQty=0;
	var sumOfCaseQty=0;
	var sumOfBottleQty=0;
	var uniqeBrandNumPackQty=[];
	 $(".ferchExistibgInvoice").click(function(){
	   var ivoicedate = $('#datepicker').val();
	   if(ivoicedate!=""){
		   $('.newInvoiceForm').show();
		   uniqeBrandNumPackQty=[];
		   total=0;
		   sno=1;
		   flag=true;
		   removeVal=0;
		   count=0;
		   sumOfPackQty=0;
		   sumOfCaseQty=0;
		   sumOfBottleQty=0;
	   var myUrl = window.location.href;
		var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
		var productListUrl =  url+"getSingleInvoiceDetailDateWise.json?ivoicedate="+ivoicedate;
		$.ajax ({
			url: productListUrl,
		       type: "GET",
		       success: function(data){
		    	 //  console.log(JSON.stringify(data));
		    	   $('#mrpRoundOff').val(0);
		    	   $('#turnoverTax').val(0);
		    	   $("#invoiceTrList").empty();
		    	   if(data.saleBean.length > 0){
		    		   $("#dateAsPerCopy").val(data.saleBean[0].invoiceDateAsCopy);
		    		   $( "#dateAsPerCopy" ).datepicker(  "option", { disabled: true } );
		    	   }
		    	   else{
		    		   $( "#dateAsPerCopy" ).datepicker(  "option", { disabled: false } );
		    		   $("#dateAsPerCopy").datepicker({ dateFormat: 'yy-mm-dd' });
		    	      $("#dateAsPerCopy").val(ivoicedate);
		    	   }
		      var existinvoice="";
		      $.each(data.saleBean, function (index, value) {
		    	//  console.log(JSON.stringify(value));
		    	  if(count++ % 2){
					   rowclass = 'oddrow';
				   }else{
					   rowclass = 'evenrow';
				   }
		    	  uniqeBrandNumPackQty.push(parseInt(value.brandNoPackQty));
		    	  total=total+value.totalPrice;
		    	  sumOfPackQty=sumOfPackQty+value.packQty;
		    	  sumOfCaseQty=sumOfCaseQty+value.caseQty;
		    	  sumOfBottleQty=sumOfBottleQty+value.qtyBottels;
		    	  existinvoice =existinvoice+ "<tr class=\""+rowclass+"\"><td></td><td>"+sno+++"</td><td>"+value.brandNo+"</td><td>"+value.brandName+"</td><td>"+value.productType+"</td><td>" + value.packType + "</td><td>" + value.packQty + "</td><td>" + value.quantity + "</td><td>" + value.caseQty + "</td><td>" + value.qtyBottels + "</td><td>" + value.unitPrice + "</td><td>"+value.singleBottelPrice+"</td><td>"+value.bottleSaleMrp+"</td><td>"+value.totalPrice+"</td><td style=\"display:none;\">0</td><td style=\"display:none;\">0</td><td style=\"display:none;\">0</td><td style=\"display:none;\">0</td></tr>";
		      });
		      $("#invoiceTrList").append(existinvoice);
		      $("#ttlmrp").html("<span style=\"color: #000;font-weight: 600;\">Amount: "+parseFloat(Math.round(total * 100) / 100).toFixed(2)+"</span><span style=\"color: #000;font-weight: 600;\">BottleQty : "+sumOfBottleQty+"</span><span style=\"color: #000;font-weight: 600;\">CaseQty : "+sumOfCaseQty+"</span><span style=\"color: #000;font-weight: 600;\">PackQty : "+sumOfPackQty+"</span>");
		      $('#mrpRoundOff').val(data.mrpRoundOffBean.mrpRoundOff);
		      $('#turnoverTax').val(data.mrpRoundOffBean.turnOverTax);
		      $('#tcsVal').val(data.mrpRoundOffBean.tcsVal);
		   }
		});
	   }else{
		   alert("Please Select Date");
	   }
	 });
    $(".add-row").click(function(){
    	if($('#brdNum').val() == ""){
    		alert("Please Select Brand");
    		return false;
    	}
    	if(($('#caseQty').val() == "" || $('#QtyBottels').val() =="") || ($('#caseQty').val() == 0 && $('#QtyBottels').val() ==0)){
    		alert("Please fill At least Case Or No. of bottles");
    		return false;
    	}
    	if($('#packQtyRate').val() == "" || $('#SingleBottelRate').val() == "" || $('#EachBottleMrp').val() == "" || $('#packQtyRate').val() == 0 || $('#SingleBottelRate').val() == 0 || $('#EachBottleMrp').val() == 0)
    	{
    		alert("Price Should Not Be 0 Or Empty");
    		return false;
    	}
    	
    	 var brandNoPackQtyId = parseInt($("#brandNoPackQtyId").val());
    	 $.each(uniqeBrandNumPackQty, function (index, value){  
                   if(value==brandNoPackQtyId){
                	   flag=false;  
                	   removeVal=brandNoPackQtyId;
                   }
           });
    	if(flag){
    		 uniqeBrandNumPackQty.push(brandNoPackQtyId);
    	var brandName=$("#brandNamelbl").text(); 
    	var brandNumber=$("#brandNolbl").text(); 
    	var productType=$("#productTypelbl").text();
    	var packTypelbl=$("#packTypelbl").text();
    	var quantity=$("#quantitylbl").text();
        var date = $("#datepicker").val();
        var dateAsPerCopy = $("#dateAsPerCopy").val();
        var caseQty = $("#caseQty").val();
        var packQtyRate = $("#packQtyRate").val();
        var QtyBottels = $("#QtyBottels").val();
        var SingleBottelRate = $("#SingleBottelRate").val();
        var EachBottleMrp = $("#EachBottleMrp").val();
        var packQtyId = $("#packQtyId").val();
        var saleId = $("#saleId").val();
        var casepricesum = parseInt(caseQty)*parseFloat(packQtyRate);
        var btlpricesum = parseInt(QtyBottels)*parseFloat(SingleBottelRate);
       // var totalPrice=(parseInt(caseQty)*parseInt(packQtyId)+parseInt(QtyBottels))*(parseFloat(SingleBottelRate));
        var totalPrice=casepricesum+btlpricesum;
        total=total+totalPrice;
        sumOfPackQty=sumOfPackQty+parseInt(packQtyId);
	    sumOfCaseQty=sumOfCaseQty+parseInt(caseQty);
		sumOfBottleQty=sumOfBottleQty+parseInt(QtyBottels);
        $("#idate").html("<span style=\" float: right;font-size: 12px;font-weight: 600;padding: 0px 15px 0px 0px;font-weight: 600;\">Invoice Date: "+date+"</span>");
        $("#ttlmrp").html("<span style=\"color: #000;font-weight: 600;\">Amount: "+parseFloat(Math.round(total * 100) / 100).toFixed(2)+"</span><span style=\"color: #000;font-weight: 600;\">BottleQty : "+sumOfBottleQty+"</span><span style=\"color: #000;font-weight: 600;\">CaseQty : "+sumOfCaseQty+"</span><span style=\"color: #000;font-weight: 600;\">PackQty : "+sumOfPackQty+"</span>");
        if(count++ % 2){
			   rowclass = 'oddrow';
		   }else{
			   rowclass = 'evenrow';
		   }
        var markup = "<tr class=\""+rowclass+"\"><td><input type='checkbox' name='record' value=\'"+sno+"\'></td><td>"+sno+++"</td><td>"+brandNumber+"</td><td>"+brandName+"</td><td>"+productType+"</td><td>" + packTypelbl + "</td><td>" + packQtyId + "</td><td>" + quantity + "</td><td>" + caseQty + "</td><td>" + QtyBottels + "</td><td>" + packQtyRate + "</td><td>"+SingleBottelRate+"</td><td>"+EachBottleMrp+"</td><td>"+parseFloat(Math.round(totalPrice * 100) / 100).toFixed(2)+"</td><td style=\"display:none;\">" + brandNoPackQtyId + "</td><td style=\"display:none;\">" + saleId + "</td><td style=\"display:none;\">" + date + "</td><td style=\"display:none;\">" + dateAsPerCopy + "</td></tr>";
       // $("#invoiceTrList").append(markup);
        $(markup).prependTo('#ItemsTable > tbody');
        $('#caseQty').val("");
        $('#QtyBottels').val(0);
        $('#brdNum').val("");
        $('#packQtyRate').val("");
        $('#SingleBottelRate').val("");
        $('#EachBottleMrp').val("");
		//$("#invoiceForm").hide();
    	}else{
    		alert("You have already added Invoice for this brand");
    		flag=true;
    	}
    	/*}else{
    		alert("Please fill all the fields");
    	}*/
    });
    
    // Find and remove selected table rows
    $(".delete-row").click(function(){
        $("#ItemsTable tbody").find('input[name="record"]').each(function(){
        	if($(this).is(":checked")){
                $(this).parents("tr").remove();
        	        var $tds = $(this).parents("tr").find('td'),
        	            packQtyId = $tds.eq(6).text(),
        	            caseQty = $tds.eq(8).text(),
        	            QtyBottels = $tds.eq(9).text(),
        	            totalValue = $tds.eq(13).text(),
        	            brandNoPlushQty=$tds.eq(14).text();
        	            sumOfPackQty=sumOfPackQty-parseInt(packQtyId);
        		        sumOfCaseQty=sumOfCaseQty-parseInt(caseQty);
        			    sumOfBottleQty=sumOfBottleQty-parseInt(QtyBottels);
        			    total=total- parseInt(totalValue);
        			   // alert(brandNoPlushQty);
        			    $("#ttlmrp").html("<span style=\"color: #000;font-weight: 600;\">Amount: "+parseFloat(Math.round(total * 100) / 100).toFixed(2)+"</span><span style=\"color: #000;font-weight: 600;\">BottleQty : "+sumOfBottleQty+"</span><span style=\"color: #000;font-weight: 600;\">CaseQty : "+sumOfCaseQty+"</span><span style=\"color: #000;font-weight: 600;\">PackQty : "+sumOfPackQty+"</span>");
        			    for(var i = uniqeBrandNumPackQty.length -1; i >= 0 ; i--){
        		        	//console.log(uniqeBrandNumPackQty[i]+" >> "+brandNoPlushQty)
        		            if(uniqeBrandNumPackQty[i] == brandNoPlushQty){
        		            	uniqeBrandNumPackQty.splice(i, 1);
        		            }
        		        }
        	}
        });
        /*uniqeBrandNumPackQty = $.grep(uniqeBrandNumPackQty, function(value) {
        	  return value != removeVal;
        	});*/
       /* for(var i = uniqeBrandNumPackQty.length -1; i >= 0 ; i--){
        	console.log(uniqeBrandNumPackQty[i]+" >> "+removeVal)
            if(uniqeBrandNumPackQty[i] == removeVal){
            	uniqeBrandNumPackQty.splice(i, 1);
            }
        }*/
       // console.log(uniqeBrandNumPackQty);
    });
});  
function calculateTotalPrice(){
	 var price =0;
	  $( "#setTotalPrice" ).empty();
	 var caseQty = $("#caseQty").val();
     var packQtyRate = $("#packQtyRate").val();
     var QtyBottels = $("#QtyBottels").val();
     var SingleBottelRate = parseFloat($("#SingleBottelRate").val());
     var casepricesum = parseInt(caseQty)*parseFloat(packQtyRate);
     var btlpricesum = parseInt(QtyBottels)*parseFloat(SingleBottelRate);
     var totalPrice=casepricesum+btlpricesum;
     //console.log(totalPrice);
     $("#setTotalPrice").text(totalPrice);
     var productType = $("#productTyp").val();
     if(productType == "BEER"){
    	        
    	 price = Math.ceil(((SingleBottelRate+(25*(SingleBottelRate/100)))).toFixedDown(2)/10)*10;
	   $('#EachBottleMrp').val(price);
    }else{
    	price = Math.ceil(((SingleBottelRate+(20*(SingleBottelRate/100)))).toFixedDown(2)/10)*10;
		   $('#EachBottleMrp').val(price);
    }
}
