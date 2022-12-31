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
var timeSignatureNum = new Array(4);
var timeSignatureDen = new Array(4);
timeSignatureNum[0] = 4;
timeSignatureDen[0] = 4;
var index=0;
var notes = new Array(4).fill(0);
var sub = 0;
var refreshIntervalId = 0;
var refreshIntervalIdb = 0;
var complexity = 3;
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
    parseInt(document.getElementById('complex').value);
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

        // document.getElementById("some-div-id").innerHTML = "";

        clearInterval(refreshIntervalId);
        clearInterval(refreshIntervalIdb)
        refreshIntervalId = 0;
        refreshIntervalIdb = 0;
        index = 0;
        measureIndex = 0;
        accentIndex = 0;
        count = 0;

    } else {
        refreshIntervalIdb = setInterval(update, 600/BPM*timeSignatureNum[measureIndex]/timeSignatureDen[measureIndex])
    }
}

function update(){

    if (sub==0) { //determines the subdivision
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
    }

    if (!accentPatternMap.get(measureIndex+"")) {
        if (measureIndex==0){
            var sum=0;
            var accentPattern = new Array(Math.ceil(timeSignatureNum[0]/2));

            for (let i=0; i<Math.ceil(timeSignatureNum[measureIndex]/2); i++) {

                // Aggiunge un valore tra 2 e 3 alla posizione i-esima
                accentPattern[i] = Math.round(Math.random() + 2);
                sum += accentPattern[i];

                // Controlla che la somma rimanga minore del totale, altrimenti entra nell'if
                if (sum > timeSignatureNum[measureIndex]) {

                    // Elimina l'ultimo elemento
                    sum -= accentPattern[i];

                    // Prova a sommare 2 a sum e se risulta uguale al totale, inserisce 2 in ultima posizione ed esce dal ciclo
                    if(sum+2 == timeSignatureNum[measureIndex]) {
                        accentPattern[i] = 2;
                        i = Math.ceil(timeSignatureNum[measureIndex]/2);
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

                if (sum==timeSignatureNum[measureIndex]){
                    i=Math.floor(timeSignatureNum[measureIndex]/2);
                }
            }
            accentPatternMap.set(measureIndex+"", accentPattern);

        } else{

            if (complexity==1 || complexity==3){
                accentPatternMap.set(measureIndex+"", accentPatternMap.get(measureIndex-1 + ""));
            }

            else if (complexity==2){
                if (measureIndex==1){
                    var accentPattern = new Array(Math.ceil(timeSignatureNum[0]/2));

                    for (let i=0; accentPatternMap.get(measureIndex-1 + "")[i]!=0 && i<4; i++){

                        accentPattern[i]=(accentPatternMap.get(measureIndex-1 + "")[i])*2+1;

                    }
                    accentPatternMap.set(measureIndex+"", accentPattern);
                    console.log(accentPattern)
                }
                if (measureIndex==2){
                    accentPatternMap.set(measureIndex+"", accentPatternMap.get(measureIndex-2 + ""));
                }
                if (measureIndex==3){
                    accentPatternMap.set(measureIndex+"", accentPatternMap.get(measureIndex-2 + ""));
                }
            }
        }
    }


    if (measureIndex!=0){

        if (complexity==1){
            timeSignatureNum[measureIndex]=timeSignatureNum[measureIndex-1]
            timeSignatureDen[measureIndex]=timeSignatureDen[measureIndex-1]
        }

        else if (complexity==2){
            if(measureIndex==1){
                timeSignatureDen[measureIndex]=timeSignatureDen[measureIndex-1]*2
                timeSignatureNum[measureIndex]=timeSignatureNum[measureIndex-1]*2
                for (let i=0; accentPatternMap.get(measureIndex-1 + "")[i]!=0 && i<4; i++){
                    timeSignatureNum[measureIndex]++;
                }
            }
            if (measureIndex==2){
                timeSignatureNum[measureIndex]=timeSignatureNum[measureIndex-2]
                timeSignatureDen[measureIndex]=timeSignatureDen[measureIndex-2]
            }
            if(measureIndex==3){
                timeSignatureNum[measureIndex]=timeSignatureNum[measureIndex-2]
                timeSignatureDen[measureIndex]=timeSignatureDen[measureIndex-2]
            }

        }
        else if (complexity==3){
            if (measureIndex==1){
                timeSignatureNum[measureIndex]=3*timeSignatureNum[measureIndex-1]
                timeSignatureDen[measureIndex]=2*timeSignatureDen[measureIndex-1]
            }
            if (measureIndex==2){
                timeSignatureNum[measureIndex]=timeSignatureNum[measureIndex-2]
                timeSignatureDen[measureIndex]=timeSignatureDen[measureIndex-2]
            }
            if(measureIndex==3){
                timeSignatureNum[measureIndex]=2*timeSignatureNum[measureIndex-1]
                timeSignatureDen[measureIndex]=3*timeSignatureDen[measureIndex-1]
            }
        }

    }

    if (notes[measureIndex]==0){ //determines the number of notes and the pattern for each measure
        if (measureIndex==0){
            notes[measureIndex] = timeSignatureNum[measureIndex] * sub / timeSignatureDen[measureIndex];
            pattern[measureIndex] = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));
        }
        else{
            if (complexity==1){
                if (measureIndex==3){
                    notes[measureIndex] = timeSignatureNum[measureIndex] * sub / timeSignatureDen[measureIndex];
                    pattern[measureIndex] = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));
                }
                else {
                    notes[measureIndex] = notes[0];
                    pattern[measureIndex] = pattern[0];
                }
            }
            else if (complexity==2) {
                if (measureIndex == 2) {
                    notes[measureIndex] = notes[0];
                    pattern[measureIndex] = pattern[0];
                } else {
                    notes[measureIndex] = timeSignatureNum[measureIndex] * sub / timeSignatureDen[measureIndex];
                    pattern[measureIndex] = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));
                }
            }
            else if (complexity==3){
                    if (measureIndex==2){
                        notes[measureIndex] = notes[0];
                        pattern[measureIndex] = pattern[0];
                    }
                    else {
                        notes[measureIndex] = timeSignatureNum[measureIndex] * sub / timeSignatureDen[measureIndex];
                        pattern[measureIndex] = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));
                    }
            }
        }
    }

    if (refreshIntervalId==0){
        refreshIntervalId = setInterval(render, 240000 / (BPM * sub))
    }
}

start.onclick = toggleOn;

function toggleOn(e) {
    play();

    if(e.target.parentElement.classList.contains("green")) {
        e.target.parentElement.classList.toggle("redOn");
    } else {
        e.target.classList.toggle("redOn");

    }

    if(document.getElementById("StartStop").innerHTML == "START") {
        document.getElementById("StartStop").innerHTML = "STOP";
    } else {
        document.getElementById("StartStop").innerHTML = "START";
    }

}

function render() {
    let patternBinary = pattern[measureIndex].toString(2);

    if (patternBinary.charAt(index) - '0') {
        kick();
        guitar();
    }

    console.log("sub=", sub)
    console.log("accentIndex=", accentIndex);
    console.log("accentPattern=", accentPatternMap.get(measureIndex + "")[count]);

    if (index == 0 || accentIndex == accentPatternMap.get(measureIndex + "")[count]) {
        cymbal();

        if (index != 0) {
            count++;
            if (count == 1 || count == 3){
                snare();
            }
        }
        accentIndex = 0;
    }

    index++;
    if (complexity == 3){
        if ((index / sub) % (1 / timeSignatureDen[0]) == 0) {
            hat();
            accentIndex++;
        }
    }
    else {
        if ((index / sub) % (1 / timeSignatureDen[measureIndex]) == 0) {
            hat();
            accentIndex++;
        }
    }


    if (index >= notes[measureIndex]) {

        index = 0;
        count = 0;
        measureIndex++;
        if (measureIndex == 4) {
            measureIndex = 0;
        }
        console.log("measure=", measureIndex)
        console.log("TimeSigNum=", timeSignatureNum[measureIndex])
        console.log("TimeSigDen=", timeSignatureDen[measureIndex])
    }
}