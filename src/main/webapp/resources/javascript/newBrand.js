$(document).ready(function() {
	showAlertMsg();
});
function showAlertMsg(){
	var msg = $("#popupmsg").val();
	if(msg != ""){
		alert(msg);
	/*$.dialog({
	    title: 'Alert',
	    content: msg,
	});*/
	}
	 $('#popupmsg').val("");
}
onload =function(){ 
	  var ele = document.querySelectorAll('.number-only')[0];
	  ele.onkeypress = function(e) {
	     if(isNaN(this.value+""+String.fromCharCode(e.charCode)))
	        return false;
	  }
	  ele.onpaste = function(e){
	     e.preventDefault();
	  }
	}

