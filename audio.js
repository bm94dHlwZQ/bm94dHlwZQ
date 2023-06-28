<script src='https://cdnjs.cloudflare.com/ajax/libs/three.js/84/three.min.js'></script>
<script src='https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.3/dat.gui.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.3.0/simplex-noise.min.js'></script>

<script>
/**
 * Music Player
 */
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const currTime = document.querySelector('#currTime');
const playIcon = document.querySelector('.play-img');
const pauseIcon = document.querySelector('.pause-img');
const vibingEmoji = document.querySelector('.vibing-emoji');
const staticEmoji = document.querySelector('.static-emoji');


// Song titles
const songs = ['Noxtype - ID', 'Noxtype - ID', 'Noxtype - ID', 'Noxtype - ID'];

//Source To Your Songs
const songUrl = [
'https://mp3.noxtype.com/LOCO.wav',
'https://mp3.noxtype.com/LOCO.wav',
'https://mp3.noxtype.com/LOCO.wav',
'https://mp3.noxtype.com/LOCO.wav']

// Keep track of song
let songIndex = 2;

// Initially load song details into DOM
loadSong(songs[songIndex]);

// Update song details
function loadSong(song) {
  title.innerText = song;
  audio.src = songUrl[songIndex];
}

// Play song
function playSong() {
 musicContainer.classList.add('play');
 	
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'block';

  vibingEmoji.style.display = 'flex';
	staticEmoji.style.display = 'none';

  audio.play();
}

// Pause song
function pauseSong() {
 musicContainer.classList.remove('play');
 
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
  
  staticEmoji.style.display = 'flex';
  vibingEmoji.style.display = 'none';
  
  audio.pause();
}

// Previous song
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]);

  playSong();
}

// Next song
function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);

  playSong();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

//get duration & currentTime for Time of song
function DurTime (e) {
	const {duration,currentTime} = e.srcElement;
	var sec;
	var sec_d;

	// define minutes currentTime
	let min = (currentTime==null)? 0:
	 Math.floor(currentTime/60);
	 min = min <10 ? '0'+min:min;

	// define seconds currentTime
	function get_sec (x) {
		if(Math.floor(x) >= 60){
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
					sec = Math.floor(x) - (60*i);
					sec = sec <10 ? '0'+sec:sec;
				}
			}
		}else{
		 	sec = Math.floor(x);
		 	sec = sec <10 ? '0'+sec:sec;
		 }
	} 

	get_sec (currentTime,sec);

	// change currentTime DOM
	currTime.innerHTML = min +':'+ sec;

	// define minutes duration
	let min_d = (isNaN(duration) === true)? '0':
		Math.floor(duration/60);
	 min_d = min_d <10 ? '0'+min_d:min_d;


	 function get_sec_d (x) {
		if(Math.floor(x) >= 60){
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
					sec_d = Math.floor(x) - (60*i);
					sec_d = sec_d <10 ? '0'+sec_d:sec_d;
				}
			}
		}else{
		 	sec_d = (isNaN(duration) === true)? '0':
		 	Math.floor(x);
		 	sec_d = sec_d <10 ? '0'+sec_d:sec_d;
		 }
	} 
	get_sec_d (duration);
};

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);

// Time of song
audio.addEventListener('timeupdate',DurTime);
/**
 * Three.js
 */
var noise = new SimplexNoise();
var vizInit = function () {

playBtn.addEventListener('click',() => {threePlay()}, {once: true})

function threePlay() {
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var scene = new THREE.Scene();
    var group = new THREE.Group();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,0,100);
    camera.lookAt(scene.position);
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);


    var icosahedronGeometry = new THREE.IcosahedronGeometry(5, 4);
   //Mesh Texture
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff6700,
        wireframe: true
    });

    var ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);
    group.add(ball);

    // var ambientLight = new THREE.AmbientLight(0x166562);
    // scene.add(ambientLight);

    // var spotLight = new THREE.SpotLight(0xFFFFFF);
    // spotLight.intensity = 0.9;
    // spotLight.position.set(-10, 40, 20);
    // spotLight.lookAt(ball);
    // spotLight.castShadow = true;
    // scene.add(spotLight);

    /*
       Point Lights
    */
    const pointLight1 = new THREE.PointLight( 0xFFFFFF, 3, 100 );
    pointLight1.position.set( 30, 30, 10 );
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight( 0xFFFFFF, 1.3, 100 );
    pointLight2.position.set( 30, -30, 10 );
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight( 0xFFFFFF, 3, 100 );
    pointLight3.position.set( -30, -35, 10 );
    scene.add(pointLight3);
    
    const pointLight4 = new THREE.PointLight( 0xFFFFFF, 1.3, 100 );
    pointLight4.position.set( -30, 30, 10 );
    scene.add(pointLight4);
    
    const pointLight5 = new THREE.PointLight( 0xFFFFFF, 3, 100 );
    pointLight5.position.set( 0, -10, 10 );
    scene.add(pointLight5);
    
    const pointLight6 = new THREE.PointLight( 0xFFFFFF, 5, 100 );
    pointLight6.position.set( 0, 50, 10 );
    scene.add(pointLight5);

    scene.add(group);

    document.getElementById('out').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    render();

    function render() {
      analyser.getByteFrequencyData(dataArray);

      var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
      var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

      var overallAvg = avg(dataArray);
      var lowerMax = max(lowerHalfArray);
      var lowerAvg = avg(lowerHalfArray);
      var upperMax = max(upperHalfArray);
      var upperAvg = avg(upperHalfArray);

      var lowerMaxFr = lowerMax / lowerHalfArray.length;
      var lowerAvgFr = lowerAvg / lowerHalfArray.length;
      var upperMaxFr = upperMax / upperHalfArray.length;
      var upperAvgFr = upperAvg / upperHalfArray.length;

      
      makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));

      group.rotation.x += (0.002);
      group.rotation.y += (0.002);
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function makeRoughBall(mesh, bassFr, treFr) {
        mesh.geometry.vertices.forEach(function (vertex, i) {
            var offset = mesh.geometry.parameters.radius;
            var amp = 2.5;
            var time = window.performance.now();
            vertex.normalize();
            var rf = 0.00001;
            var distance = (offset + bassFr ) + noise.noise3D(vertex.x + time *rf*5, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
            vertex.multiplyScalar(distance);
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
    }
  };
}

window.onload = vizInit();

document.body.addEventListener('touchend', function(ev) { context.resume(); });





function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr){
    return arr.reduce(function(a, b){ return Math.max(a, b); })
}

audio.crossOrigin = "anonymous";
</script>
