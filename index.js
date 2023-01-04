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
var sigPatt = 4
timeSignatureNum[0] = 4;
timeSignatureDen[0] = 4;
var index=0;
var notes = new Array(4).fill(0);
var accentedNotes = new Array(4).fill(0);
var hatNotes = new Array(4).fill(0);
var sub = new Array(4).fill(0);
var hatsub = new Array(4).fill(0);
var refreshIntervalId = 0;
var refreshIntervalIdc = 0;
var refreshIntervalIdd = 0;
var complexity = 1;
var measureIndex = 0;
var pattern = new Array(4).fill(0);
var accentPatternMap = new Map();
var accentIndex=0;
var count=0;

function createTimeSignatureNum() {
    timeSignatureNum[0] = parseInt(document.getElementById('timesignum').value);
    sigPatt = timeSignatureNum[0]
}

function createTimeSignatureDen() {
    timeSignatureDen[0] = parseInt(document.getElementById('timesigden').value);
}

function changeBPM() {
    BPM = parseInt(document.getElementById('bpmvalue').value);
}

function changeComplexity() {
    complexity = parseInt(document.getElementById('complex').value);
}

function changeKey() {
    key = document.getElementById('keyselected').value;
}


function kick() {
    var audio = new Audio('Kick (9).wav');
    volume(audio);
    audio.play();
}

function cymbal(){
    var audio = new Audio('live_open_hat.wav');
    audio.play();
}

function snare(){
    var audio = new Audio('Snare (25).wav');
    audio.play();
}

function hat(){
    var audio = new Audio('Hat (7).wav');
    volume(audio);
    audio.play()
    console.log("hat")
}

function volume(audio) {
    if (accentIndex==accentPatternMap.get(measureIndex+"")[count]){ //if the note being played is an accented one
        audio.volume=0.75;                                                               // we set the volume to 1
    }
    else{                                                                             //otherwise we set it to 0.5
        audio.volume=0.5;
    }
}

function play() {

    if (refreshIntervalId) {

        document.getElementById("some-div-id").innerHTML = "";

        clearInterval(refreshIntervalId);
        clearInterval(refreshIntervalIdc);
        clearInterval(refreshIntervalIdd);
        refreshIntervalIdd = 0;
        refreshIntervalIdc = 0;
        refreshIntervalId = 0;
        index = 0;
        measureIndex = 0;
        accentIndex = 0;
        count = 0;
    } else {

        createStave();

        generate()
    }
}

function generate() {
    for (measureIndex = 0; measureIndex < 4; measureIndex++) {

        if (measureIndex == 0) { //generate first accent pattern

            if (complexity == 3) { //in the case of complexity=3 the accent pattern has a different time signature numerator than the rest of the elements
                while (timeSignatureNum[measureIndex] % sigPatt == 0){
                    sigPatt = Math.ceil(Math.random() * timeSignatureNum[measureIndex] + 1)
                    console.log("sigPatt =", sigPatt)
                }


            } else {

                sigPatt = timeSignatureNum[measureIndex]

            }

            var sum = 0;
            var accentPattern = new Array(Math.ceil(sigPatt / 2));

            for (let i = 0; i < Math.ceil(sigPatt / 2); i++) {

                // Aggiunge un valore tra 2 e 3 alla posizione i-esima
                accentPattern[i] = Math.round(Math.random() + 2);
                sum += accentPattern[i];

                // Controlla che la somma rimanga minore del totale, altrimenti entra nell'if
                if (sum > sigPatt) {

                    // Elimina l'ultimo elemento
                    sum -= accentPattern[i];

                    // Prova a sommare 2 a sum e se risulta uguale al totale, inserisce 2 in ultima posizione ed esce dal ciclo
                    if (sum + 2 == sigPatt) {
                        accentPattern[i] = 2;
                        i = Math.ceil(sigPatt / 2);
                    } else {
                        // Caso in cui anche sommando 2 andiamo oltre il totale e andiamo a modificare il penultimo elemento
                        sum -= accentPattern[i - 1];

                        // Se è uguale a 3 inseriamo 2
                        if (accentPattern[i - 1] == 3) {
                            accentPattern[i - 1] = 2;
                            sum += 2;
                        } else {
                            // Se è uguale a 2 inseriamo 3
                            accentPattern[i - 1] = 3;
                            sum += 3;
                        }

                        // Facciamo ripartire il conteggio da i-1
                        i = i - 1;
                    }
                }

                if (sum == sigPatt) {
                    i = Math.floor(sigPatt / 2);
                }
            }
            if (!accentPattern[1]){
                accentPattern[1]=accentPattern[0]
            }
            accentPatternMap.set(measureIndex + "", accentPattern);
        }
        //Generate subsequent accent patterns
        else {
            if (complexity == 1 || complexity == 3) { //in the case of complexity 1 and 3 the accent pattern stays the same

                accentPatternMap.set(measureIndex + "", accentPatternMap.get(measureIndex - 1 + ""));

            } else if (complexity == 2) { //in the case of complexity 2 the pattern changes

                if (measureIndex == 1) {

                    var accentPattern = new Array(Math.ceil(timeSignatureNum[0] / 2));

                    for (let i = 0; accentPatternMap.get(measureIndex - 1 + "")[i] != 0 && i < 4; i++) {

                        accentPattern[i] = (accentPatternMap.get(measureIndex - 1 + "")[i]) * 2 + 1;

                    }
                    accentPatternMap.set(measureIndex + "", accentPattern);
                    console.log(accentPattern)
                } else {
                    accentPatternMap.set(measureIndex + "", accentPatternMap.get(measureIndex - 2 + ""));
                }
            }
        }


        //generate list of time signatures
        if (measureIndex != 0) {

            if (complexity == 1 || complexity == 3) { //in the cases of complexity 1 and 3 the time signature stays the same

                timeSignatureNum[measureIndex] = timeSignatureNum[measureIndex - 1]
                timeSignatureDen[measureIndex] = timeSignatureDen[measureIndex - 1]

            } else if (complexity == 2) {

                if (measureIndex == 1) {

                    timeSignatureDen[measureIndex] = timeSignatureDen[measureIndex - 1] * 2
                    timeSignatureNum[measureIndex] = timeSignatureNum[measureIndex - 1] * 2

                    for (let i = 0; accentPatternMap.get(measureIndex - 1 + "")[i] != 0 && i < 4; i++) {

                        timeSignatureNum[measureIndex]++;

                    }
                }
                if (measureIndex == 2) {
                    timeSignatureNum[measureIndex] = timeSignatureNum[measureIndex - 2]
                    timeSignatureDen[measureIndex] = timeSignatureDen[measureIndex - 2]
                }
                if (measureIndex == 3) {
                    timeSignatureNum[measureIndex] = timeSignatureNum[measureIndex - 2]
                    timeSignatureDen[measureIndex] = timeSignatureDen[measureIndex - 2]
                }

            }

        }

        if (sub[measureIndex] == 0) { //determines the subdivisions for each measure

            if (measureIndex == 0) {

                sub[measureIndex] = Math.round(Math.random() * 2 + 2) * timeSignatureDen[measureIndex];

            } else if (complexity == 1 || complexity == 3) {

                sub[measureIndex] = sub[measureIndex - 1]

            } else if (complexity == 2) {

                if (measureIndex == 1) {
                    sub[measureIndex] = Math.round(Math.random() + 1) * timeSignatureDen[measureIndex]
                } else {
                    sub[measureIndex] = sub[measureIndex - 2]
                }
            }
            if (complexity<4){

                hatsub[measureIndex] = sub[measureIndex]

            }
        }


 //determines the number of notes and the pattern for the kick for each measure
        if (measureIndex == 0) {
            notes[measureIndex] = timeSignatureNum[measureIndex] * sub[measureIndex] / timeSignatureDen[measureIndex];
            hatNotes[measureIndex] = timeSignatureNum[measureIndex] * hatsub[measureIndex] / timeSignatureDen[measureIndex];
            accentedNotes[measureIndex] = sigPatt * sub[measureIndex] / timeSignatureDen[measureIndex];
            pattern[measureIndex] = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));
        } else {
            if (complexity == 1 || complexity == 3) {
                if (measureIndex == 3) {
                    notes[measureIndex] = timeSignatureNum[measureIndex] * sub[measureIndex] / timeSignatureDen[measureIndex];
                    pattern[measureIndex] = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));
                } else {
                    notes[measureIndex] = notes[0];
                    pattern[measureIndex] = pattern[0];
                }
            } else if (complexity == 2) {
                if (measureIndex == 2) {
                    notes[measureIndex] = notes[0];
                    pattern[measureIndex] = pattern[0];
                } else {
                    notes[measureIndex] = timeSignatureNum[measureIndex] * sub[measureIndex] / timeSignatureDen[measureIndex];
                    pattern[measureIndex] = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));
                }
            }

        }
    } //end of for loop
    measureIndex=0
    if (refreshIntervalIdd == 0) {
        refreshIntervalIdd = setInterval(accentedPlay, 240000 / (BPM * timeSignatureDen[measureIndex]))
    }
    if (refreshIntervalId == 0) {
        refreshIntervalId = setInterval(render, 240000 / (BPM * sub[measureIndex]))
    }
    if (refreshIntervalIdc == 0) {
        if (hatsub[measureIndex] % 3!=0){
            refreshIntervalIdc = setInterval(hat, 480000 / (BPM * hatsub[measureIndex]))
        }
        else {
            refreshIntervalIdc = setInterval(hat, 720000 / (BPM * hatsub[measureIndex]))
        }

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
    }
    console.log("sub=", sub[measureIndex])


    index++;


    if (index >= notes[measureIndex]) {

        index = 0;
        measureIndex++;

        if (complexity!=3){
            accentIndex=0;
            if (count>1){
                count = 0;
            }
        }

        clearInterval(refreshIntervalId);
        clearInterval(refreshIntervalIdc);


        if (measureIndex == 4) {
            measureIndex = 0;
        }
        if (complexity!=3){
            clearInterval(refreshIntervalIdd);
            refreshIntervalIdd = setInterval(accentedPlay, 240000 / (BPM * timeSignatureDen[measureIndex]))
        }
        refreshIntervalId = setInterval(render, 240000 / (BPM * sub[measureIndex]))
        if (hatsub[measureIndex] % 3!=0){
            refreshIntervalIdc = setInterval(hat, 480000 / (BPM * hatsub[measureIndex]))
        }
        else {
            refreshIntervalIdc = setInterval(hat, 720000 / (BPM * hatsub[measureIndex]))
        }
        console.log("measure=", measureIndex)
        console.log("TimeSigNum=", timeSignatureNum[measureIndex])
        console.log("TimeSigDen=", timeSignatureDen[measureIndex])
    }
}

function accentedPlay(){
    console.log("accentIndex=", accentIndex);

    if(complexity==3){
        if ((accentIndex==0 && count==0) || accentIndex == accentPatternMap.get(0 + "")[count-1]) {
            cymbal();

            count++;
            if (count == 2 || count == 4){
                snare();
            }
            accentIndex = 0;
        }
        accentIndex++;
        console.log("accentPattern=", accentPatternMap.get(measureIndex + "")[count-1]);
        if (!accentPatternMap.get(measureIndex + "")[count]){
            if (count>1){
                count=0;
            }
            accentIndex=0;
        }
    }

    else {
        if ((accentIndex==0 && count==0) || accentIndex == accentPatternMap.get(measureIndex + "")[count-1]) {
            cymbal();
            if (count % 2 !=0){
                snare();
            }

            count++;

            accentIndex = 0;
        }
        accentIndex++;
        console.log("accentPattern=", accentPatternMap.get(measureIndex + "")[count-1]);
    }
}



VF = Vex.Flow;


function createStave() {
// We created an object to store the information about the workspace
    var WorkspaceInformation = {
        // The div in which you're going to work
        div: document.getElementById("some-div-id"),
        // Vex creates a svg with specific dimensions
        canvasWidth: 500,
        canvasHeight: 500
    };

// Create a renderer with SVG
    var renderer = new VF.Renderer(
        WorkspaceInformation.div,
        VF.Renderer.Backends.SVG
    );

// Use the renderer to give the dimensions to the SVG
    renderer.resize(WorkspaceInformation.canvasWidth, WorkspaceInformation.canvasHeight);

// Expose the context of the renderer
    var context = renderer.getContext();

// And give some style to our SVG
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");


    /**
     * Creating a new stave
     */
// Create a stave of width 400 at position x10, y40 on the SVG.
    var stave = new VF.Stave(10, 40, 400);

    stave.addClef("treble").addTimeSignature(timeSignatureNum[measureIndex] + "/" + timeSignatureDen[measureIndex]);
    stave.setContext(context).draw();
// Add a clef and time signature.
// stave.addClef("treble").addTimeSignature("4/4");
//stave.addClef("treble").addTimeSignature(timeSignatureNum + "/" + timeSignatureDen);
// Set the context of the stave our previous exposed context and execute the method draw !
// stave.setContext(context).draw();
}
