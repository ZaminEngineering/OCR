<html lang="en">
<head>
  <title>www.poizin.com</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
 
 <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>

 <script  src="resources/myscript.js"></script>
 <style>
table, th , td  {
  border: 1px solid grey;
  border-collapse: collapse;
  padding: 5px;
}
table tr:nth-child(odd) {
  background-color: #f1f1f1;
}
table tr:nth-child(even) {
  background-color: #ffffff;
}

@import "compass/css3";

.table-editable {
  position: relative;
  
  .glyphicon {
    font-size: 20px;
  }
}


  #progressbar {
    margin-top: 20px;
  }
 
  .progress-label {
    font-weight: bold;
    text-shadow: 1px 1px 0 #fff;
  }
 
  .ui-dialog-titlebar-close {
    display: none;
  }

#hStyle{
margin-left: 210px;
}


</style>

<script>

    $(document).ready(function(){

        $("#add-row").click(function(){

           
            var markup = "<tr><td><input type='checkbox' name='record'></td ><td contenteditable='true'>" + " "+ "</td><td contenteditable='true'>" + " " + "</td><td contenteditable='true'>" + " " + "</td><td contenteditable='true'>" + " " + "</td><td contenteditable='true'>" + " " + "</td><td contenteditable='true'>" + " " + "</td><td contenteditable='true'>" + " " + "</td><td contenteditable='true'>" + " " + "</td><td contenteditable='true'>" + " " + "</td><td contenteditable='true'>" + " " + "</td><td contenteditable='true'>" + " " + "</td></tr>";

            $("#invoice-table").append(markup);

        });

        

        // Find and remove selected table rows

        $("#delete-row").click(function(){

            $("table tbody").find('input[name="record"]').each(function(){

                if($(this).is(":checked")){

                    $(this).parents("tr").remove();

                }

            });

        });

    });    

</script>
 
</head>


<body>
<!--  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script> -->
<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">POIZIN</a>
    </div>
 
  </div>
</nav>

<div  ng-app="myApp" ng-controller="myCtrl">


<h2 id="hStyle">Invoice Information</h2>

<div class="container">

<div class="col-sm-6">

 <div ng-show="chooseDivShow">
			<form ng-submit="fileUpload()" method="post">
			
				<input type="file" id="bannerImage" name="bannerImage"	fileread="uploadme" accept="pdf/*" placeholder="Select Image" class="form-control"/>
				
			 
				<input type="submit" value="Process"/>
				
				
			</form>
		</div>
	
		</div>
			
			
		<div class="col-sm-4">
		<div ng-show=true>
		
		 <button type="button" id="add-row">Add Record</button> 
		  <button type="button" id="delete-row">Delete Record</button> 
		
		</div>
		</div>
</div>
      
            <div ng-show="tableShow">
<table class="table-editable" id="invoice-table">
<thead class="thead-dark">
<tr>

<td>Select</td>
<td>SI.No.</td>
<td>Brand Number</td>
<td>Brand Name</td>
<td>Product Type</td>
<td>Pack Type</td>
<td>Pack Qty/Size(ml)</td>
<td>Qty(Cases.Delivered)</td>
<td>Qty(Bottles.Delivered)</td>
<td>Unit Rate</td>
<td>Bill Rate</td>
<td>Total</td>

</tr>
</thead>
<tr ng-repeat="row in invoice1">

<td><input type="checkbox" name="record"></td>
<td contenteditable='true'>{{$index+1}}</td>

<td contenteditable='true'>{{row.brandNumber}}</td>

<td contenteditable='true'>{{row.brandName}}</td>
<td contenteditable='true'>{{row.productType}}</td>
<td contenteditable='true'>{{row.packType}}</td>
<td contenteditable='true'>{{row.packQty}}</td>
<td contenteditable='true'>{{row.caseDeliveredQty}}</td>
<td contenteditable='true'>{{row.bottelsDeliveredQty}}</td>
<td contenteditable='true'>{{row.unitRate}}</td>
<td contenteditable='true'>{{row.billRate}}</td>
<td contenteditable='true'>{{row.total}}</td>

</tr>

</table>
</div> 


<div ng-show="tableShow">
<table>
<thead class="thead-dark">
<tr>
<td>Date</td>
<td>Sales Value</td>
<td>MRP Rounding Off</td>
<td>Retail Shop Excise Turnover Tax</td>
<td>TCS</td>
<td>Retailer Credit Balance</td>

</tr>
</thead>
<tr>

<td contenteditable='true'>{{invoice2.invoiceDate}}</td>

<td contenteditable='true'>{{invoice2.salesValue}}</td>

<td contenteditable='true'>{{invoice2.mrpRoundingOff}}</td>
<td contenteditable='true'>{{invoice2.retailShopExciseTurnoverTax}}</td>
<td contenteditable='true'>{{invoice2.tcs}}</td>
<td contenteditable='true'>{{invoice2.retailerCreditBalance}}</td>

</tr>

</table>
</div>
  
</div>

</body>
</html>
