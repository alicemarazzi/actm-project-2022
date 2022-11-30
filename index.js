var c = new AudioContext();
var cmp = c.createDynamicsCompressor();
cmp.connect(c.destination);
// var a = c.createAnalyser();
var bs = c.createBufferSource();
bs.loop = true;

var BPM = 120;
// var style;
var key;
// var scale;
// var complexity;
var timeSignatureNum = 4;
var timeSignatureDen = 4;
var index=0;
var notes;
var sub;
var refreshIntervalId = 0;
var intensityIndex = 0;
var complexity;

function createTimeSignatureNum() {
    timeSignatureNum = parseInt(document.getElementById('timesignum').value);
}

function createTimeSignatureDen() {
    timeSignatureDen = parseInt(document.getElementById('timesigden').value);
}

function changeBPM() {
    BPM = parseInt(document.getElementById('bpmvalue').value);
}

function changeComplexity() {
    console.log(parseInt(document.getElementById('complex').value));
}

function changeKey() {
    key = document.getElementById('keyselected').value;
}


function kick() {
    var audio = new Audio('bassy_kick.wav');
    volume(audio);
    audio.play();
}

function cymbal(){
    var audio = new Audio('new_cymbal.wav');
    volume(audio);
    audio.play();
    intensityIndex++;
}

function snare(){
    var audio = new Audio('cage_snare.wav');
    audio.play();
}

function guitar(){
    var audio = new Audio('HMRhyChugA-E Lo.wav');
    volume(audio);
    audio.play();
}

function volume(audio){
    if (intensityIndex==0){
        audio.volume=1;
    }
    else if (intensityIndex==Math.ceil(timeSignatureDen/(timeSignatureNum*4))){
        audio.volume=0.5;
    }
    else if (intensityIndex==Math.ceil(timeSignatureDen/(timeSignatureNum*2))){
        audio.volume=0.8;
    }
    else if (intensityIndex==Math.ceil(timeSignatureDen/timeSignatureNum)){
        audio.volume=0.3;
    }
}
/*function hat(){
    var audio = new Audio('man_hat.wav');
    audio.play();
}*/

/*function guitar() { //one note of guitar playing
    var o = c.createOscillator();
    var g = c.createGain();

    var wnBuffer = c.createBuffer(1,
        c.sampleRate, c.sampleRate);

    var bufferData = wnBuffer.getChannelData(0);

    for(let i=0;i<bufferData.length;i++) {
        var sample = Math.sin(i/10);
        if (Math.abs(sample) < 0.3) {
            bufferData[i] = 1.3*sample;
        } else {
            bufferData[i] = 3*0.3*Math.sign(sample);
        }

    }

    bs.buffer = wnBuffer;
    bs.connect(a);

    o.connect(a);
    a.connect(g)
    g.connect(c.destination);

    o.frequency.value = 0;
    o.connect(g);
    o.start();
    g.connect(cmp);
    c.resume();
    o.frequency.setValueAtTime(440, c.currentTime);
    g.gain.setValueAtTime(1, c.currentTime);
    g.gain.linearRampToValueAtTime(0, c.currentTime+0.1);

}*/

function play() {

    if (refreshIntervalId){
        clearInterval(refreshIntervalId);
        refreshIntervalId = 0;
        index=0;
        intensityIndex=0;
    }
    else {
        sub = Math.ceil(Math.random() * 7);
        if (sub % 7 == 0) {
            sub = 14;
        } else if (sub % 5 == 0) {
            sub = 10;
        } else if (sub % 3 == 0) {
            sub = 12;
        } else if (sub % 2 == 0) {
            sub = 16;
        } else if (sub == 1) {
            sub = 8;
        }

        notes = timeSignatureNum * sub / timeSignatureDen;
        var pattern = Math.floor(Math.random() * Math.pow(2, notes));
        refreshIntervalId = setInterval(render, 240000 / (BPM * sub), pattern)
    }

    // VECCHIA VERSIONE
    /*var pattern1 = Math.floor(Math.random()*14)
    var pattern2 = Math.floor(Math.random()*14)
    var pattern3 = Math.floor(Math.random()*14)
    var pattern4 = Math.floor(Math.random()*14)
    console.log(pattern1)
    console.log(pattern2)
    console.log(pattern3)
    console.log(pattern4)
    setInterval(render, 60000/(BPM*4), pattern1, pattern2, pattern3, pattern4)*/

    //setInterval(kick_pattern, c.currentTime+4*60000/BPM, pattern1)
    //setTimeout(function(){setInterval(kick_pattern, 4*60000/BPM, pattern2)}, c.currentTime+60000/BPM)
    //setTimeout(function(){setInterval(kick_pattern, 4*60000/BPM, pattern3)}, c.currentTime+2*60000/BPM)
    //setTimeout(function(){setInterval(kick_pattern, 4*60000/BPM, pattern4)}, c.currentTime+3*60000/BPM)

}

/*function toggleOn (e) {
    play();
    e.target.classList.toggle("redOn");
}
var st = document.getElementById("start");
st.onclick = toggleOn;*/

start.onclick = toggleOn;

function toggleOn (e) {
    play();
    e.target.classList.toggle("redOn");
}

function render(pattern){
    let patternBinary = pattern.toString(2);

    if (patternBinary.charAt(index) - '0' && intensityIndex!=3){
        kick();
        guitar();
    }
    if(index%(sub/4)==0){
        cymbal();
        if (intensityIndex==3){
            snare();
        }
    }

    index++;
    if (index>=notes){
        index=0;
        intensityIndex=0;
    }
}

/* function render(pattern1, pattern2, pattern3, pattern4){
    var pattern
    if (index<4) {pattern=pattern1}
    else if (index >= 4 && index<8) {pattern=pattern2}
    else if (index >= 8 && index<12) {pattern=pattern3}
    else { pattern=pattern4 }
    sixteenth = index%4
    switch(sixteenth) {
        case 0:
            cymbal()
            if (pattern==0 || pattern==4 || pattern==5 || pattern==6 || pattern==10 ||  pattern==11 || pattern==13){
                kick()
                //guitar()
            }
            break;
        case 1:
            if (pattern==1 || pattern==4 || pattern==7 || pattern==8 || pattern==10 ||  pattern==11 || pattern==13){
                kick()
                //guitar()
            }
            break;
        case 2:
            if (pattern==2 || pattern==5 || pattern==7 || pattern==9 || pattern==10 ||  pattern==12 || pattern==13){
                kick()
                //guitar()
            }
            break;
        case 3:
            if (pattern==3 || pattern==6 || pattern==8 || pattern==9 || pattern==11 ||  pattern==12 || pattern==13){
                kick()
                //guitar()
            }
            break;
    }
    index++;
    if (index==15){index=0}
}*/