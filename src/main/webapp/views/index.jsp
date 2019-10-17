<%@ page contentType="text/html; charset = UTF-8" %>
<%@ taglib prefix = "form" uri = "http://www.springframework.org/tags/form"%>
<html>
   <head>
      <title>File Upload Example</title>
      
       <spring:url value="/js/myscript.js" var="FileSaverjs"/>
  <script src="${FileSaverjs}"></script>
   </head>
   
 
   <body ng-app="myApp" ng-controller="tablesCtrl">
     <div ng-show="chooseDivShow==0">
      <form:form method = "POST" modelAttribute = "fileUpload"  action="fileUpload()" enctype = "multipart/form-data">
         Please select a file to upload : 
         <input type = "file" name = "file" />
         <input type = "submit" value = "upload" />
      </form:form>
      
      </div>
      
<div ng-hide="tableShow==0">
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

      
   </body>
</html>