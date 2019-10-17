

var isInputValChanged = false;
var ip;
$(function() {
	
	$(":input").change(function() {
		isInputValChanged = true;
		/*if(!$(this).hasClass("modalpop")){
			isInputValChanged = true;
		}*/
	});
	$(".dashboardText").click(function() {
		cmenuId=$(this).attr("id");
		if (isInputValChanged) {
			var text="You have changed Something, Do You Want to proceed?";
			if (confirm(text) == true) {
				isInputValChanged=false;
				$("#"+cmenuId).trigger("click");
		    } else {
		    	 return false;
		    }
		}else{
			document.location = $(this).children("a").attr("href");
		}
	});
});
function addCommentForSale(date,comment){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"addCommentForSale.json?date="+date+"&comment="+comment;
	$.ajax ({
		url: productListUrl,
	       type: "POST",
	       success: function(data){
	     
	    }
	});
}
function updateComment(form){
	var comment = $('textarea#daywisesaleComment').val();
	var date =  $('#startDate').val()
	if(date !="" && comment !="")
		addCommentForSale(date,comment);
}
function getSaleCommentData(date){
	var myUrl = window.location.href;
	var url = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);
	var productListUrl = url+"getSaleCommentData.json?date="+date;
	$.ajax ({
		url: productListUrl,
	       type: "GET",
	       success: function(data){
	      console.log(JSON.stringify(data));
	      $("textarea#daywisesaleComment").val(data.saleComment);
	    }
	});
}

/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
function getUserIP(onNewIP) { 
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        
        pc.setLocalDescription(sdp, noop, noop);
    }, noop); 

    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}
getUserIP(function(ip){
		console.log('Got your IP ! : '  + ip + " | verify in http://www.whatismypublicip.com/");
		this.ip=ip;
		
});
