$(function(data) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getMonthlyExpenseCategory.json";
	$.ajax ({
		url: productListUrl,
	       type: "GET",
	       success: function(data){
	    	   console.log(JSON.stringify(data));
	    	   var ulValues="";
	 	      $.each(data.expenseCategoryBeanList, function (index, value) {
	 	    	  //alert(data[index].expenseName);
	 	    	  if(index==0)
	 	    		  $('#subject').append( '<option value="">Select Subject</option>' );
	 	    	      $('#subject').append( '<option title="'+value.expenseDate+'" value="'+value.expenseName+'_'+value.categoryId+'">'+value.expenseName+'</option>' );
	 	      });
	    }
	});
});
function jsFunction(val){
	var n = val.split('_');
	var name=n[0];
	var cid=n[1];
	$('#categoryid').val(cid);
}
$(document).ready(function(){
	$('.newMonthlyExpensesForm').hide();
	$('input.monthpicker').monthpicker({changeYear:true,dateFormat: "yy-mm-01" });
	$("#monthlyExpensesDate").val($.datepicker.formatDate('yy-mm-01', new Date()));
	/*$('.date-picker').datepicker( {
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'MM yy',
        onClose: function(dateText, inst) { 
            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
        }
    });*/
 //$("#monthlyExpensesDate").val($.datepicker.formatDate('MM yy', new Date()));
 
 $(".fetchExistingExpenses").click(function(){
	    sno=1;
	    count=0;
	 var startDate =	$("#monthlyExpensesDate").val();
	    var today = new Date(startDate);
	    var dd = today.getDate();
	    var mm = today.getMonth()+1; 
	    if(dd<10) 
	    {
	        dd='0'+dd;
	    } 

	    if(mm<10) 
	    {
	        mm='0'+mm;
	    } 
	    var yyyy = today.getFullYear();
	    var expensesdate = yyyy+"-"+mm+"-"+dd;
	   if(expensesdate!=""){
		   $('.newMonthlyExpensesForm').show();
			   var myUrl = window.location.href;
				var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
				var productListUrl =  url+"getMonthlyExpenses.json?expensesdate="+expensesdate;
				$.ajax ({
					url: productListUrl,
				       type: "GET",
				       success: function(data){
				    	  // console.log(JSON.stringify(data));
				    	   $("#monthlyExpensesList").empty();
				    	   var existindExpenses="";
				    	   $.each(data, function (index, value) {
				    		   if(count++ % 2){
								   rowclass = 'oddrow';
							   }else{
								   rowclass = 'evenrow';
							   }
				    		   //existindExpenses =existindExpenses+ "<tr class=\""+rowclass+"\"><td><input type='checkbox' name='record' value='"+value.monthlyExpenseId+"'></td><td>"+sno+++"</td><td>"+value.debitCredit+"</td><td>"+value.amount+"</td><td>"+value.subject+"</td><td>" + value.comment + "</td><td style=\"display:none;\">" + value.monthlyExpenseId + "</td><td style=\"display:none;\">0</td><td style=\"display:none;\">0</td></tr>";
				    		   existindExpenses =existindExpenses+ "<tr class=\""+rowclass+"\" id=\"delete"+sno+"\"><td><span class=\"glyphicon glyphicon-trash \" onclick=\"deleteRow("+value.monthlyExpenseId+","+sno+")\" style=\"color: #000;font-size: 12px;cursor: pointer;font-family: 'Glyphicons Halflings';\"></span></td><td>"+sno+++"</td><td>"+value.debitCredit+"</td><td>"+value.amount+"</td><td>"+value.subject+"</td><td>" + value.comment + "</td><td style=\"display:none;\">" + value.monthlyExpenseId + "</td><td style=\"display:none;\">0</td><td style=\"display:none;\">0</td></tr>";
				    	   });
				    	   $("#monthlyExpensesList").append(existindExpenses);
				       }
				});
	   }else{
		   alert("Please Select Month");
	   }
	 });
 
 
 
 var count=0;
 var sno=1;
 $(".add-row").click(function(){
 	var cd="";
 	var debitCredit=$("#debitCredit").val(); 
 	var amount=$("#amount").val(); 
 	var subject =  $("#subject").val();
 	var comment =  $("#comment").val();
 	if(debitCredit == "" || amount == "" || subject == "" || comment == ""){
 		alert("All fields are mandatory");
		return false;
 	}
 	var n = subject.split('_');
	var subjectname=n[0];
	var subjectcid=n[1];
    if(count++ % 2){
			   rowclass = 'oddrow';
		   }else{
			   rowclass = 'evenrow';
		   }
    if(debitCredit == 0)
    	cd="Debit";
    else
    	cd="Credit";
     //var markup = "<tr class=\""+rowclass+"\"><td><input type='checkbox' name='record' value=''></td><td>"+sno+++"</td><td>"+cd+"</td><td>"+amount+"</td><td>"+subjectname+"</td><td>" + comment + "</td><td style=\"display:none;\">0</td><td style=\"display:none;\">"+debitCredit+"</td><td style=\"display:none;\">"+subjectcid+"</td></tr>";
    var markup = "<tr class=\""+rowclass+"\" id=\"delete"+sno+"\"><td><span class=\"glyphicon glyphicon-trash \" onclick=\"deleteRow(-1,"+sno+")\" style=\"font-family: 'Glyphicons Halflings';color: #000;font-size: 12px;cursor: pointer;\"></span></td><td>"+sno+++"</td><td>"+cd+"</td><td>"+amount+"</td><td>"+subjectname+"</td><td>" + comment + "</td><td style=\"display:none;\">0</td><td style=\"display:none;\">"+debitCredit+"</td><td style=\"display:none;\">"+subjectcid+"</td></tr>";
     $("#monthlyExpensesList").append(markup);
     $('#amount').val("");
     $('#subject').val("");
     $('#comment').val("");
 });
 $(".delete-row").click(function(){
     $("#ItemsTable tbody").find('input[name="record"]').each(function(){
     	if($(this).is(":checked")){
     		var expenseMonthlyId = $(this).val();
     		if (confirm("Are you sure you want to delete ?"))
     		  {
	     		if(expenseMonthlyId !="" && expenseMonthlyId !=null){
	 			   var myUrl = window.location.href;
	 				var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	 				var productListUrl =  url+"deleteMonthlyExpenses.json?expenseMonthlyId="+expenseMonthlyId;
	 				$.ajax ({
	 					url: productListUrl,
	 				       type: "GET",
	 				       success: function(data){
	 				    	 // console.log(JSON.stringify(data));
	 				       }
	 				});
	     		}
     		 $(this).parents("tr").remove();
     		}
     	}
     });
 });	
});  
function deleteRow(expenseMonthlyId,id) {
	if (confirm("Are you sure you want to delete ?"))
	  {
		if(expenseMonthlyId !="" && expenseMonthlyId !=null){
		   var myUrl = window.location.href;
			var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
			var productListUrl =  url+"deleteMonthlyExpenses.json?expenseMonthlyId="+expenseMonthlyId+"&ip="+ip;
			$.ajax ({
				url: productListUrl,
			       type: "GET",
			       success: function(data){
			    	 // console.log(JSON.stringify(data));
			       }
			});
		}
		$('#delete'+id).remove();
	}
}
function buildJsonForExpenses() {
   var startDate =	$("#monthlyExpensesDate").val();
    var today = new Date(startDate);
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    var yyyy = today.getFullYear();
    var date = yyyy+"-"+mm+"-"+dd;
	 var json = {"monthlyExpensesDetails": []};
	 var table = $("#ItemsTable tbody");
	 table.find('tr').each(function (i) {
	        var $tds = $(this).find('td'),
	            expenseId = $tds.eq(0).text(),
	            sno = $tds.eq(1).text(),
	            debit = $tds.eq(2).text(),
	            amount = $tds.eq(3).text(),
	            subjectName = $tds.eq(4).text(),
	            comment = $tds.eq(5).text(),
	            expenseId = $tds.eq(6).text(),
	            debitCredit = $tds.eq(7).text(),
	            subject = $tds.eq(8).text()
	            if(expenseId == 0){
	        var input = {
	        		"debitCredit":debitCredit.trim(),
	        		"amount":amount.trim(),
	        		"subject":subject.trim(),
	        		"comment":comment.trim(),
	        		"date":date.trim()
	        };
	        json.monthlyExpensesDetails.push(input);
	       }
	    });
	saveMonthlyExpenses(json);
	}
function saveMonthlyExpenses(json) {
	var myUrl = window.location.href;
	var url1 = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	   $.ajax({
		  async: false,
	      type: "POST",
	      contentType : 'application/json; charset=utf-8',
	      url: url1+"/saveMonthlyExpensesData",
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