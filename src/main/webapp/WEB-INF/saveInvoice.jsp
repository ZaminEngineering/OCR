<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>www.poizin.com</title>
  
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
<title>www.poizin.com</title>



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
   
   <link rel="stylesheet" href="resources/css/newCommon.css">

</head>
<body class="hidden-sn mdb-skin">
    <!--Double navigation-->
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
                <!--/. Logo -->
               
                <!-- Side navigation links -->
                <li>
                    <ul class="collapsible collapsible-accordion">
                        <li><a class="collapsible-header waves-effect arrow-r inlineHeadrCss"><i class="fa fa-chevron-right"></i> Invoice <i class="fa fa-angle-down rotate-icon"></i></a>
                            <div class="collapsible-body">
                                <ul>
                                    <li><a href="addNewBrand" class="waves-effect inlineAchCss">Add Product</a>
                                    </li>
                                    <li><a href="saveInvoice" class="waves-effect inlineAchCss">Add Invoice</a>
                                    </li>
                                    <li><a href="productList" class="waves-effect inlineAchCss">Active/Inactive Products</a>
                                    </li>
                                    <li><a href="UploadAndViewInvoice" class="waves-effect inlineAchCss">Upload/View Invoice</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li><a class="collapsible-header waves-effect arrow-r inlineHeadrCss"><i class="fa fa-chevron-right"></i> Sale<i class="fa fa-angle-down rotate-icon"></i></a>
                            <div class="collapsible-body">
                                <ul>
                                    <li><a href="sale" class="waves-effect inlineAchCss">Enter Sale</a>
                                    </li>
                                    <li><a href="updateSale" class="waves-effect inlineAchCss">Edit Sale</a>
                                    </li>
                                    <li><a href="monthlyExpenses" class="waves-effect inlineAchCss">Monthly Debit/Credit</a>
                                    </li>
                                    <li><a href="investment" class="waves-effect inlineAchCss">Enter Investment</a>
                                    </li>
                                    <li><a href="discountTransaction" class="waves-effect inlineAchCss">Add Cheque</a>
                                    </li>
                                    <!--  <li><a href="mobileViewEnterSaleSheet" class="waves-effect inlineAchCss">Generate Sale Sheet</a>
                                    </li> -->
                                </ul>
                            </div>
                        </li>
                        <li><a class="collapsible-header waves-effect arrow-r inlineHeadrCss"><i class="fa fa-chevron-right"></i> Reports<i class="fa fa-angle-down rotate-icon"></i></a>
                            <div class="collapsible-body">
                                <ul>
                                    <li><a href="saleReport" class="waves-effect inlineAchCss">Sale Report</a>
                                    </li>
                                    <li><a href="saleDayWiseReport" class="waves-effect inlineAchCss">Day Wise Sale Report</a>
                                    </li>
                                    <li><a href="stockLifting" class="waves-effect inlineAchCss">Stock Lift</a>
                                    </li>
                                    <li><a href="inHouseStockValue" class="waves-effect inlineAchCss">InHouse Stock</a>
                                    </li>
                                    <li><a href="balanceSheet" class="waves-effect inlineAchCss">Balance Sheet</a>
                                    </li>
                                    <li><a href="productComparisionCategoryWise" class="waves-effect inlineAchCss">Product Comparison</a>
                                    </li>
                                    <li><a href="saleWithDiscount" class="waves-effect inlineAchCss">Sale With Discount</a>
                                    </li>
                                    <li><a href="expensesReport" class="waves-effect inlineAchCss">Expense Report</a>
                                    </li>
                                    <li><a href="profitAndLossReport" class="waves-effect inlineAchCss">Profit/Loss Report</a>
                                    </li>
                                    <!-- <li><a href="admin" class="waves-effect inlineAchCss">Dash board</a>
                                    </li> -->
                                </ul>
                            </div>
                        </li>
                        <li><a class="collapsible-header waves-effect arrow-r inlineHeadrCss"><i class="fa fa-chevron-right"></i>Discount<i class="fa fa-angle-down rotate-icon"></i></a>
                            <div class="collapsible-body">
                                <ul>
                                    <!-- <li><a href="discountEstimate" class="waves-effect inlineAchCss">Discount Estimate</a>
                                    </li> -->
                                    <li><a href="newDiscountEstimate" class="waves-effect inlineAchCss">Discount Estimate</a>
                                    </li>
                                    <li><a href="newIndentEstimate" class="waves-effect inlineAchCss">Indent Estimate</a>
                                    </li>
                                    <li><a href="viewDiscount" class="waves-effect inlineAchCss">Company Discount</a>
                                    </li>
                                    <li><a href="stockLiftWithDiscountTransaction" class="waves-effect inlineAchCss">Enter Discount</a>
                                    </li>
                                    <li><a href="generateDiscountPdf" class="waves-effect inlineAchCss">Discount Pdf</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li><a class=" waves-effect arrow-r inlineHeadrCss" href="./logout"> <i class="fa fa-chevron-right"></i>Logout</a></li>
                    </ul>
                </li>
                <!--/. Side navigation links -->
            </ul>
            <div class="sidenav-bg mask-strong"></div>
        </div>
        <!--/. Sidebar navigation -->
        <!-- Navbar -->
        
        <nav class="navbar fixed-top navbar-toggleable-md navbar-expand-lg scrolling-navbar double-nav" style="border-radius: 0px;">
            <!-- SideNav slide-out button -->
            <div class="float-left">
                <a href="#" data-activates="slide-out" class="button-collapse"><i class="fa fa-bars"></i></a>
            </div>
            <!-- Breadcrumb-->
            <div class="breadcrumb-dn mr-auto">
                <a href="admin" class="waves-effect inlineAchCss"><p style=" font-family: 'Michroma', sans-serif; font-size: 23px;">POIZIN</p></a>
            </div>
            <ul class="nav navbar-nav nav-flex-icons ml-auto">
                <li class="nav-item">
                    <a class="nav-link achPadding" href="saleReport"><span class="clearfix d-none d-sm-inline-block">Sale Report</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link achPadding" href="stockLifting"><span class="clearfix d-none d-sm-inline-block">Stock Lift</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link achPadding" href="inHouseStockValue"><span class="clearfix d-none d-sm-inline-block">InHouse Stock</span></a>
                </li>
               
            </ul>
        </nav>
        
        <!-- /.Navbar -->
    </header>
    <!--/.Double navigation-->
    
    
    
  <script src="resources/newTemp/js/jquery-3.3.1.min.js"></script>
   
  <script src="resources/newTemp/js/popper.min.js"></script>
 
  <script src="resources/newTemp/js/bootstrap.min.js"></script>
   
  <script src="resources/newTemp/js/mdb.min.js"></script>
  <script>
   $(".button-collapse").sideNav();
    </script>
 
</body>
</html> 
  
  
  <script src="resources/javascript/thirdpartyjs/jquery-ui.js"></script> 
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  
   <link rel="stylesheet" href="resources/css/select2.min.css">
	
  <script src="resources/javascript/thirdpartyjs/select2.min.js"></script>	
 
  <script src="resources/javascript/invoice.js"></script> 
  
  <script src="resources/javascript/common.js"></script>
  
  <script src="resources/javascript/buildInvoice.js"></script> 
  
  <link rel="stylesheet" href="resources/css/newCommon.css">
  
  <link rel="stylesheet" href="resources/css/invoiceEntry.css">
</head>
<body>
 <div class="container" style="padding-top: 100px;">
 <div class="row" style="margin-bottom: 20px;">
  <div class="col-sm-3 " style="padding: 0px !important;">
  <ul class="breadcrumb">
  <li><a href="admin">Dashboard</a></li>
   <li>Invoice</li>
  <li>Add Invoice</li>
</ul>
  </div>
    <input type="hidden" placeholder="" id="productTyp" name="productTyp">
    <div class="col-sm-2 bodyFontCss">
     <label>Date As Per Sheet</label>
     <input type="text" placeholder="Select Date" class="form-control" id="datepicker" name="invoiceDate" readonly="readonly" required>
    </div>
    <div class="col-sm-1 bodyFontCss customizedButton">
     <input class="ferchExistibgInvoice btn btn-default btn-rounded" type="submit" name="" value="GET DATA" />
    </div>
    <div class="col-sm-2 bodyFontCss newInvoiceForm">
     <label>Date As Per Invoice</label>
     <input type="text" class=" form-control" id="dateAsPerCopy" required readonly="readonly">
    </div>
    <div class="col-sm-3 bodyFontCss newInvoiceForm">
    <label>Select Product</label>
     <select id="brand"> </select>
    </div>
    <div class="col-sm-1 bodyFontCss newInvoiceForm customizedButton">
    <input class="btn btn-default btn-rounded" type="submit" name="" onclick="myFunction()" value="GET DATA" />
    </div>
 </div>
 <div class="row newInvoiceForm" style="margin-bottom: 20px;">
    <div class="col-sm-2 bodyFontCss "></div>
    <div class="col-sm-1 bodyFontCss">
     <label >Brand No.</label>
     <input type="text" class="form-control" id="brdNum" name="brandNumber" readonly="readonly" required>
    </div>
    <div class="col-sm-1 bodyFontCss">
     <label >Cases</label>
     <input type="text" class="form-control" id="caseQty" name="caseQty" onkeyup="validationFun(this); calculateTotalPrice();" required>
    </div>
    <div class="col-sm-1 bodyFontCss">
     <label>Bottles</label>
     <input type="text" class="form-control" id="QtyBottels" onkeyup="validationFun(this); calculateTotalPrice();" name="QtyBottels" required>
    </div>
    <div class="col-sm-1 bodyFontCss ">
     <label>Case Price</label>
     <input type="text" class="form-control" id="packQtyRate" onkeyup="validationDecimalFun(this); calculateTotalPrice();"  name="packQtyRate"  required>
    </div>
    <div class="col-sm-1 bodyFontCss ">
    <label>BTL Price</label>
    <input type="text" class="form-control" id="SingleBottelRate" onkeyup="validationDecimalFun(this); calculateTotalPrice();" name="SingleBottelRate"  required>
    </div>
    <div class="col-sm-1 bodyFontCss newInvoiceForm">
     <label>BTL MRP</label>
     <input type="text" class="form-control" id="EachBottleMrp" name="EachBottleMrp" onkeyup="validationDecimalFun(this)" required>
    </div>
    <div class="col-sm-1 bodyFontCss">
     <label>Total Price</label>
     <span id="setTotalPrice"></span>
     <input type="hidden" id="brandNoPackQtyId" name="brandNoPackQty" value="">
	 <input type="hidden" id="packQtyId" name="packQty" value="">
     <input type="hidden" id="saleId" name="saleId" value="">
    </div>
    <div class="col-sm-1 bodyFontCss customizedButton">
     <input type="button" class="add-row btn btn-default btn-rounded" value="ADD ROW" />
    </div>
    <div class="col-sm-2 bodyFontCss newInvoiceForm"></div>
 </div>
 <div class="row newInvoiceForm">
   <div id="idate" style=""></div>
   <div class="col-sm-12 bodyFontCss">
    <table id="ItemsTable">
        <thead>
            <tr style="color: #fff;background-color: #062351;">
                <th>Select</th>
                <th>S No.</th>
                <th>Brand Number</th>
                <th>Brand Name</th>
                <th>Product Type</th>
                <th>Pack Type</th>
                <th>Pack QTY</th>
                <th>Size(ml)</th>
                <th>QTY (Cases Delivered) </th>
                <th>QTY(Bottles Delivered)</th>
                <th>Unit Rate</th>
                <th>BTL Rate </th>
                <th>BTL MRP</th>
                <th>Total Price</th>
            </tr>
        </thead>
         <tbody id="invoiceTrList">
        </tbody> 
    </table>
   </div>
  </div>
 <div class="row newInvoiceForm" style="margin-bottom: 20px;">
    <div class="col-sm-1 bodyFontCss">
     <label>MRPRoundOff</label>
     <input type="number" value="0" class="form-control" id="mrpRoundOff" name="mrpRoundOff"/>
    </div>
    <div class="col-sm-1 bodyFontCss">
     <label>Turnover Tax</label>
     <input type="number" value="0" class="form-control" id="turnoverTax" name="turnoverTax"/>
    </div>
    <div class="col-sm-1 bodyFontCss">
     <label>TCS</label>
     <input type="number" value="0" class="form-control" id="tcsVal" name="tcsVal" name="turnoverTax"/>
    </div>
     <div class="col-sm-5 bodyFontCss">
      <div id="ttlmrp"></div>
    </div>
     <div class="col-sm-2 bodyFontCss">
     <input type="button" class="delete-row btn btn-default btn-rounded" value="DELETE SELECTED ROW" />
    </div>
    <div class="col-sm-2 bodyFontCss">
     <input type="button" onclick="getFirstCellTextList()" class=" btn btn-default btn-rounded" value="SUBMIT" />
    </div>
 </div>
 
 <div id="content">
        <table style="border: none;    display: none;">
        <thead>
            <tr>
                <th style="border: none;">Brand Number</th>
                <th style="border: none;">Brand Name</th>
                <th style="border: none;">Product Type:</th>
                
            </tr>
            <tr>
            <td style="border: none;"><label id="brandNolbl"></label></td>
            <td style="border: none;"><label id="brandNamelbl"></label></td>
            <td style="border: none;"><label id="productTypelbl"></label></td>
           
            </tr>
            <tr><th style="border: none;">Quantity</th>
                <th style="border: none;">No. Of Bottles IN Carton:</th>
                <th style="border: none;">Carton Type</th>
             </tr>
             <tr> <td style="border: none;"><label id="quantitylbl"></label></td>
            <td style="border: none;"><label id="packQtylbl"></label></td>
            <td style="border: none;"><label id="packTypelbl"></label></td></tr>
        </thead>
        <tbody>
        </tbody>
    </table>
      
      </div>
</div>
</body>
</html>