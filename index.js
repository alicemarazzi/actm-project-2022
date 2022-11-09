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

function guitar() {
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
    a.connect(c.destination);

    o.frequency.value = 0;
    o.connect(g);
    o.start();
    g.connect(cmp);
    c.resume();
    o.frequency.setValueAtTime(440, c.currentTime);
    g.gain.setValueAtTime(1, c.currentTime);
    g.gain.linearRampToValueAtTime(0, c.currentTime+1);
}