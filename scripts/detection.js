/*
 * WEBCAM FACE DETECTION
 *
 * This code is merely a mixture from the work by 
 * Wes Bos (http://wesbos.com/html5-video-face-detection-canvas-javascript/)
 * and Ian Devlin (http://www.iandevlin.com/blog/2012/06/html5/filtering-a-webcam-using-getusermedia-and-html5-canvas)
 */

// Video
var v;
// Canvas and canvas 2D context
var c, con;
// Width, height and ration
var w, h, ratio;
// Interval
var inte;
// The timer
var timer;
// The image obect with the fancy glasses
var glasses = new Image();
glasses.src = "i/glasses.png";

window.addEventListener('DOMContentLoaded', function() {
	// Get handles
	v = document.getElementById('v');
	c = document.getElementById('c');
	timer = document.getElementById('timer');
	con = c.getContext('2d');
	
	// When the video is ready, initialise the canvas
	v.addEventListener('loadedmetadata', function() { initCanvas(); }, true);		
	v.addEventListener('canplaythrough', function() { initCanvas(); }, true);
	
	// If the browser supports getUserMedia, get the webcam stream
	if (navigator.getUserMedia) {
		navigator.getUserMedia('video', success, error);
		
		function success(stream) {
			// Assign the webcam stream to the src of the video element
			v.src = stream;
			filterCam();
		}
		
		function error(error) {
			alert('Hmm, something went wrong. (error code ' + error.code + ')');
			return;
		}
	}
	else {
		alert('Sorry, the browser you are using doesn\'t support getUserMedia');
		return;
	}
});

// Initialise the canvas
function initCanvas() {
	ratio = v.videoWidth / v.videoHeight;
	w = (v.videoWidth / 100) * 50;
	h = parseInt(w / ratio, 10);
	c.width = w;
	c.height = h;

}


// Apply the relevant filter depending on 'type'
function filterCam(type) {
	clearInterval(inte);
	if (type == 'glasses') inte = setInterval('drawGlasses()', 250);
	else if (type == 'rect') inte = setInterval('drawRect()', 250);
	else inte = setInterval('copyCanvas()', 33);
}

function copyCanvas() {
	con.fillRect(0, 0, w, h);
	con.drawImage(v, 0, 0, w, h);
}

// Start face detection and return the detected areas
function detectFaces(){
	// Start the clock
    var elapsed_time = (new Date()).getTime();

	 // use the face detection library to find the face
    var comp = ccv.detect_objects({ "canvas" : (ccv.pre(c)),
                                    "cascade" : cascade,
                                    "interval" : 5,
                                    "min_neighbors" : 1 });


 	// Stop the clock
    timer.innerHTML = "Process time : " + ((new Date()).getTime() - elapsed_time).toString() + "ms";
    return comp;
}

// Draw a recangle around the faces
function drawRect() {
	copyCanvas();
	comp = detectFaces();

    con.lineWidth = 3;
    con.strokeStyle = "#f00";
    for (var i = 0; i < comp.length; i++) {
        con.strokeRect(comp[i].x, comp[i].y, comp[i].width, comp[i].height);
    }
}

// draw the fancy glasses (image by Wes Bos)
function drawGlasses() {
	copyCanvas();
	comp = detectFaces();
 
    for (var i = 0; i < comp.length; i++) {
        con.drawImage(glasses, comp[i].x, comp[i].y,comp[i].width, comp[i].height);
    }
}
