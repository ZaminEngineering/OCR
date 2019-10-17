var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"mobileView/getCategoryList";
	$http({
	    method : "GET",
	    url : productListUrl
	  }).then(function mySuccess(response) {
		  var options="<option data-hidden=\"true\">Choose Category</option>";
	      $.each(response.data, function (index, value) {
	    	  options=options+"<option value=\""+value.id+"\">"+value.name+"</option>";
	      });
	      $("#listdataSec").html(options);
	     $(".selectpicker").selectpicker('refresh');
	  }, function myError(response) {
	    //alert(response);
	  });
	
	var saleDatesUrl = url+"mobileView/getTotalSaleDates";
	$http({
	    method : "GET",
	    url : saleDatesUrl
	  }).then(function mySuccess(response) {
		//  console.log(JSON.stringify(response.data));
		  var startDate="";
	      var enableDays =[];
	      $.each(response.data, function (index, value) {
	    	  enableDays.push(response.data[index].date);
	    	  startDate=response.data[index].date;
	      });
	      $("#startDate").val(startDate);
	  	  $("#endDate").val(startDate);
	  	   getTimeStamp(enableDays);
	  }, function myError(response) {
	  });
	

function getTimeStamp(enableDays){
	$("#startDate").datepicker({
		  dateFormat: 'yy-mm-dd',  beforeShowDay: enableAllTheseDays,
		  numberOfMonths: 1,
		  onSelect: function(selected) {
		  $("#endDate").datepicker("option","minDate", selected);
		  }
		  });
	    function enableAllTheseDays(date) {
	        var sdate = $.datepicker.formatDate( 'yy-mm-dd', date)
	        if($.inArray(sdate, enableDays) != -1) {
	            return [true];
	        }
	        return [false];
	    }
	    $('#endDate').datepicker({dateFormat: 'yy-mm-dd', beforeShowDay: enableAllTheseDays});
}
$scope.generateReport= function (){
	var category = $scope.dropValue;
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var callingUrl = url+"mobileView/getProductComparisionBaseOnCategory?startDate="+startDate+"&endDate="+endDate+"&category="+category;
	$http({
	    method : "GET",
	    url : callingUrl
	  }).then(function mySuccess(response) {
		  //console.log(JSON.stringify(response.data.pieChartBean));
		  var chartDataSecond="";
   	      $.each(response.data.pieChartBean, function (index, value) {
   	    	chartDataSecond+="{\"y\" :"+JSON.stringify(value.value)+",\"name\" :"+JSON.stringify(value.label)+"}";
 	    	  if(!(index==response.data.pieChartBean.length-1)){
 	    		 chartDataSecond+=",";
 	    	  } 
   	       });
   	   charCreation("["+chartDataSecond+"]");
   	console.log(JSON.stringify("["+chartDataSecond+"]"));

	  }, function myError(response) {
  		    //alert(response);
  
           });
	
}
function explodePie (e) {
	if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
		e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
	} else {
		e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
	}
	e.chart.render();

}
function getRandomColor() {
	var letters = '0E1D4A'.split('');
    var color = '#';        
    color += letters[Math.round(Math.random() * 5)];
    letters = '0123456789ABCDEF'.split('');
    for (var i = 0; i < 5; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
	  return color;
	}
function charCreation(chartarr){
	CanvasJS.addColorSet("greenShades",
            ["#C0C0C0","#008000","#FF0000","#800000","#00FFFF","#FFFF00","#808000","#00FF00","#008080","#FF00FF","#000080","#800080","#0000FF","#CD5C5C","#E9967A","#C39BD3","#A3E4D7","#FCF3CF","#F2F3F4","#808B96"
            ]);
	 var options = {
				exportEnabled: true,
				animationEnabled: true,
				colorSet: "greenShades",
				title:{
					 fontSize: 15,
					text: "Product Performance Category wise."
				},
				legend:{
					fontSize: 10,
					cursor: "pointer",
					itemclick: explodePie,
					 padding: 3,
				     itemMarginTop: 5,
				     itemMarginBottom: 5,
					itemStyle: {
			            lineHeight: '14px'
			        }
				},
				toolTip:{
					  fontSize: 10,
					 },
				data: [{
					indexLabelFontColor: "black",
					type: "pie",
					indexLabelFontSize: 10,
					showInLegend: true,
					toolTipContent: "<b>{name}</b>: {y}",
					indexLabel: "{name}, {y}",
					legendText: "{name}, {y}",
					indexLabelPlacement: "inside",
					dataPoints: JSON.parse(chartarr)
				}]
			};
			$("#chart-container_for_beer").CanvasJSChart(options);
}
});