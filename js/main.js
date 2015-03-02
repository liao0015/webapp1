var pages = [];
var links = [];
var numLinks = 0;
var numPages = 0;

document.addEventListener("DOMContentLoaded", function(){
	//document.addEventListener("deviceready", function(){
		pages = document.querySelectorAll('[data-role="page"]');
		numPages = pages.length;
		links = document.querySelectorAll('[data-role="pagelink"]');
		numLinks = links.length;
		for(var i = 0; i < numLinks; i++){
			console.log( links[i] );
			//console.log( links[i].href);
			//console.log( links[i].dataset.role);
			//console.log (links[i].getAttribute('data-role'));
			if(detectTouchSupport()){
				links[i].addEventListener("touchend", handleTouch, false);
			}
			links[i].addEventListener("click", handleLinkClick, false);
		};
		//back button
		window.addEventListener("popstate", browserBackButton, false);
		//sticky footer
		document.addEventListener("scroll", handleScrolling, false);
		loadPage(null);
		ShowStaticMap();
	//});
});

function handleTouch(ev){
	ev.preventDefault();
	ev.stopImmediatePropagation();
	var touch = evt.changedTouches[0];
	var newEvt = document.createEvent("MouseEvent");
	newEvt.initMouseEvent("click", true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
	ev.currentTarget.dispatchEvent(newEvt);
}

function handleLinkClick(ev){
	ev.preventDefault();
	var href = ev.target.href;
	var parts = href.split("#");
	loadPage(parts[1]);
	return false;
}

function loadPage(url){
	//console.log("loadpage function");
	if(url == null){
		pages[0].style.display = "block";
		history.replaceState(null, null, "#home");
	}
	else{
		for (var i =0; i < numPages; i++){
			if (pages[i].id == url){
				pages[i].style.display = "block";
				history.pushState(null, null, "#" + url);
			}
			else{
				pages[i].style.display = "none";
			}
		}
		for (var x = 0; x < numLinks; x++){
			links[x].className = "";
			if (links[x].href == location.href){
				links[x].className = "show";
			}
		}
	}
}

//sticky footer when scrolled down
function handleScrolling(ev){
	var height = window.innerHeight;
	var offset = window.pageYOffset;
	var footHeight = 60;
	var footer = document.querySelector("#sticky");
	footer.style.position = "absolute";
	var total = height + offset - footHeight;
	footer.style.top = total + "px";
}

function browserBackButton(ev){
	url = location.hash;
	for(var i = 0; i < numPages; i++){
		if(("#" + pages[i].id) == url){
			pages[i].style.display = "block";
		}
		else {
			pages[i].style.display = "none";
		}
	}
	for(var x = 0; x < numLinks; x++){
		links[x].className = "";
		if(links[x].href == location.href){
			links[x].className = "show";
		}
	}
}

//test for browers support of touch events
function detectTouchSupport(){
	msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
	var touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
	return touchSupport;
}

function ShowStaticMap(){
	//check if geolocation is supported
	if( navigator.geolocation ){ 
	
		var params = {enableHighAccuracy: true, timeout:360000, maximumAge:0};
		navigator.geolocation.getCurrentPosition( watchPosition, gpsError, params ); 
		
		function watchPosition( position ){ 
			//create canvas element and append into div
			var x = document.getElementById("box");
			var canvas = document.createElement("canvas");
			canvas.width = "500";
			canvas.height = "500";
			canvas.style.border = "2px dashed teal";
			var context = canvas.getContext("2d");
			x.appendChild(canvas);
			
			//get location parameters and display map img in canvas
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;
			var img = document.createElement("img");
			img.src = "https://maps.googleapis.com/maps/api/staticmap?&size=400x400&markers=color:red%7C" + lat + "," + lon;
			img.onload = function() {
    			context.drawImage(img, 50, 50);
  			};
		}
		
		function gpsError( error ){   
  			var errors = {
			1: 'Permission denied',
			2: 'Position unavailable',
			3: 'Request timeout'
  			};
  			alert("Error: " + errors[error.code]);
		}
	}
	else{
		alert("Your browser doesn't support geolocation function.");
	}
}
