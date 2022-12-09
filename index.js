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
var timeSignatureNum = new Array(4);
var timeSignatureDen = new Array(4);
timeSignatureNum[0] = 4;
timeSignatureDen[0] = 4;
var index=0;
var notes = new Array(4).fill(0);
var sub = new Array(4).fill(0);
var refreshIntervalId = 0;
var refreshIntervalIdb = 0;
var complexity = 4;
var measureIndex = 0;
var pattern = new Array(4).fill(0);
var accentPatternMap = new Map();
var accentIndex=0;
var count=0;

function createTimeSignatureNum() {
    timeSignatureNum[0] = parseInt(document.getElementById('timesignum').value);
}

function createTimeSignatureDen() {
    timeSignatureDen[0] = parseInt(document.getElementById('timesigden').value);
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
    audio.play();
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

function hat(){
    var audio = new Audio('man_hat.wav');
    volume(audio);
    audio.play();
}

function volume(audio) {
    if (accentIndex==accentPatternMap.get(measureIndex+"")[count]){ //if the note being played is an accented one
        audio.volume=1;                                                               // we set the volume to 1
    }
    else{                                                                             //otherwise we set it to 0.5
        audio.volume=0.5;
    }
}

function play() {

    if (refreshIntervalIdb) {
        clearInterval(refreshIntervalId);
        clearInterval(refreshIntervalIdb)
        refreshIntervalId = 0;
        refreshIntervalIdb = 0;
        index = 0;
        measureIndex = 0;
        accentIndex = 0;
        count = 0;
        count = 0;
    } else {
        refreshIntervalIdb = setInterval(update, 600/BPM*timeSignatureNum[measureIndex]/timeSignatureDen[measureIndex])
    }

}

function update(){

    if (measureIndex!=0){
        timeSignatureNum[measureIndex]=timeSignatureNum[measureIndex-1]
        timeSignatureDen[measureIndex]=timeSignatureDen[measureIndex-1]
    }

    if (sub[measureIndex]==0) { //determines the subdivision for each measure
        sub[measureIndex] = Math.ceil(Math.random() * 7);
        if (sub[measureIndex] % 7 == 0) {
            sub[measureIndex] = 14;
        } else if (sub[measureIndex] % 5 == 0) {
            sub[measureIndex] = 10;
        } else if (sub[measureIndex] % 3 == 0) {
            sub[measureIndex] = 12;
        } else if (sub[measureIndex] % 2 == 0) {
            sub[measureIndex] = 16;
        } else if (sub[measureIndex] == 1) {
            sub[measureIndex] = 8;
        }
    }

    if (notes[measureIndex]==0){ //determines the number of notes and the pattern for each measure
        notes[measureIndex] = timeSignatureNum[measureIndex] * sub[measureIndex] / timeSignatureDen[measureIndex];
        pattern[measureIndex] = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));
    }

    if (!accentPatternMap.get(measureIndex)) {
        var sum=0;
        var accentPattern = new Array(Math.ceil(timeSignatureNum[0]/2));

        for (let i=0; i<Math.ceil(timeSignatureNum[measureIndex]/2); i++) {

            // Aggiunge un valore tra 2 e 3 alla posizione i-esima
            accentPattern[i] = Math.round(Math.random() + 2);
            sum += accentPattern[i];

            // Controlla che la somma rimanga minore del totale, altrimenti entra nell'if
            if (sum > timeSignatureNum) {

                // Elimina l'ultimo elemento
                sum -= accentPattern[i];

                // Prova a sommare 2 a sum e se risulta uguale al totale, inserisce 2 in ultima posizione ed esce dal ciclo
                if(sum+2 == timeSignatureNum) {
                    accentPattern[i] = 2;
                    i = Math.ceil(timeSignatureNum/2);
                } else {
                    // Caso in cui anche sommando 2 andiamo oltre il totale e andiamo a modificare il penultimo elemento
                    sum-= accentPattern[i-1];

                    // Se è uguale a 3 inseriamo 2
                    if(accentPattern[i-1] == 3) {
                        accentPattern[i-1] = 2;
                        sum += 2;
                    } else {
                        // Se è uguale a 2 inseriamo 3
                        accentPattern[i-1] = 3;
                        sum += 3;
                    }

                    // Facciamo ripartire il conteggio da i-1
                    i = i-1;
                }
            }

            if (sum==timeSignatureNum){
                i=Math.floor(timeSignatureNum/2);
            }
        }
        accentPatternMap.set(measureIndex+"", accentPattern);

    }
    if (refreshIntervalId==0){
        refreshIntervalId = setInterval(render, 240000 / (BPM * sub[measureIndex]))
    }
}

start.onclick = toggleOn;

function toggleOn (e) {
    play();
    e.target.classList.toggle("redOn");
}

function render(){
    let patternBinary = pattern[measureIndex].toString(2);

    if (patternBinary.charAt(index) - '0'){

        kick();
        guitar();

    }

    if (index==0 || accentIndex==accentPatternMap.get(measureIndex+"")[count]){
        cymbal();
        if (index!=0){
            count++;
        }
        accentIndex=0;
    }

    /*if(index%(sub/4)==0){

        cymbal();

    }*/

    index++;

    if ((index/sub[measureIndex])%(1/timeSignatureDen[measureIndex])==0){
        accentIndex++;
    }

    if (index>=notes[measureIndex]){

        index=0;
        count=0;
        measureIndex++;
        if (measureIndex==4){
            measureIndex=0;
        }

    }
}