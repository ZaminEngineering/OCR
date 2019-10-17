
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="x-ua-compatible" content="ie=edge">

www.zambientinfosystems.com

</title>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<!-- Font Awesome -->
  <link href="https://fonts.googleapis.com/css?family=Montserrat|Open+Sans" rel="stylesheet">

<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>

<script type="text/javascript" src="js/myscript.js"></script>
<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
 <link href="https://fonts.googleapis.com/css?family=Michroma" rel="stylesheet">
 
    <script src="resources/javascript/thirdpartyjs/jquery.min.js"></script> 
    
  <script src="resources/javascript/thirdpartyjs/angular.min.js"></script>
  
  <script src="resources/javascript/thirdpartyjs/angular-filter.js"></script>
  
  <script src="resources/javascript/thirdpartyjs/jquery-ui.js"></script> 
   
   <script src="resources/javascript/thirdpartyjs/bootstrap.min.js"></script> 
   
   <script src="resources/javascript/thirdpartyjs/jquery-confirm.min.js"></script> 
    <!-- Bootstrap CSS-->
   <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
   
   <link rel="stylesheet" href="resources/css/theme.css"> 
  
  <script src="resources/javascript/thirdpartyjs/bootstrap.min.js"></script> 
  
  <link rel="stylesheet" href="resources/css/bootstrap.min.css">

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">

<link rel="stylesheet" href="resources/css/bootstrap.min.css">

<link rel="stylesheet" href="resources/css/mdb.min.css">
 
 
<style type="text/css">

table, tr , td {

border: 1px solid grey;

border-collapse: collapse;

padding: 3px;

}
</style>

</head>

<body class="hidden-sn mdb-skin" ng-app="tablesApp">

   <header>
        <!-- Sidebar navigation -->
        <div id="slide-out" class="side-nav sn-bg-4 mdb-sidenav" style="    width: 22rem;">
            <ul class="custom-scrollbar list-unstyled" style="max-height:100vh;">
                <!-- Logo -->
                <li>
                    <div class="logo-wrapper waves-light" style="    padding: 25px;">
                    <p style=" font-family: 'Michroma', sans-serif; font-size: 23px;">POIZIN</p>
                    </div>
                </li>
                <!--/. Logo -->   <header>
                
                 <!-- Navbar -->
        
        
</header>
      

<div ng-controller="tablesCtrl">

<h2>Invoice Information</h2>

 <div ng-show="chooseDivShow==1">
     <input type="file" id="bannerImage" name="bannerImage" fileread="uploadme" accept="pdf/*" placeholder="Select Image" class="form-control">
	<button ng-click="fileUpload()" ng-init="count=0">Process</button> 
      
      </div>

<div ng-show="invoiceDiv==1">
<table>

<tr>

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

<tr ng-repeat="row in invoice">

<td>{{row.sno}}</td>

<td>{{row.brandNumber}}</td>

<td>{{row.brandName}}</td>
<td>{{row.productType}}</td>
<td>{{row.packType}}</td>
<td>{{row.packQty}}</td>
<td>{{row.caseDelivered}}</td>
<td>{{row.bottlesDelivered}}</td>
<td>{{row.unitRate}}</td>
<td>{{row.billRate}}</td>
<td>{{row.total}}</td>

</tr>

</table>
</div>

</div>

</body>

</html>