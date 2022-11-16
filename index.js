var c = new AudioContext();
var cmp = c.createDynamicsCompressor();
cmp.connect(c.destination);
var a = c.createAnalyser();
var bs = c.createBufferSource();
bs.loop = true;

var BPM;
var style;
var key;
var scale;
var complexity;
var timeSignature;
var index=0;

function kick() {
    var audio = new Audio('bassy_kick.wav');
    audio.play();
}

function cymbal(){
    var audio = new Audio('new_cymbal.wav');
    audio.play();
}

function snare(){
    var audio = new Audio('cage_snare.wav');
    audio.play();
}

function hat(){
    var audio = new Audio('man_hat.wav');
    audio.play();
}

function guitar() { //one note of guitar playing
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
            bufferData[i] = 1*3*0.3*Math.sign(sample);
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

}

function play(BPM){
    //setInterval(cymbal, 60000/BPM)
    var pattern1 = Math.floor(Math.random()*14)
    var pattern2 = Math.floor(Math.random()*14)
    var pattern3 = Math.floor(Math.random()*14)
    var pattern4 = Math.floor(Math.random()*14)
    console.log(pattern1)
    console.log(pattern2)
    console.log(pattern3)
    console.log(pattern4)
    setInterval(render, 60000/(BPM*4), pattern1, pattern2, pattern3, pattern4)
    //setInterval(kick_pattern, c.currentTime+4*60000/BPM, pattern1)
    //setTimeout(function(){setInterval(kick_pattern, 4*60000/BPM, pattern2)}, c.currentTime+60000/BPM)
    //setTimeout(function(){setInterval(kick_pattern, 4*60000/BPM, pattern3)}, c.currentTime+2*60000/BPM)
    //setTimeout(function(){setInterval(kick_pattern, 4*60000/BPM, pattern4)}, c.currentTime+3*60000/BPM)

}

function render(pattern1, pattern2, pattern3, pattern4){
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
}