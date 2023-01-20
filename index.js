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
var refreshIntervalIdb = 0;
var refreshIntervalIdc = 0;
var refreshIntervalIdd = 0;
var complexity = 1;
var measureIndex = 0;
var pattern = new Array(4).fill(0);
var accentPatternMap = new Map();
var accentIndex=0;
var count=0;
var s = 0;
var accent=1;
var playC = 0;
var playGS = 0;
var playK = 0;
var playS = 0;
var playH = 0;

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
    audio.volume = 0.75
    audio.play();
}

function cymbal(){
    var audio = new Audio('live_open_hat.wav');
    audio.play();
}

function snare(){
    var audio = new Audio('Snare (25).wav');
    audio.volume = 0.6
    audio.play();
}

function ghostSnare(){
    var audio = new Audio('ghoul_snare.wav')
    audio.volume = Math.random()*0.3
    audio.play()
}

function hat(){
    var audio = new Audio('Hat (7).wav');
    audio.volume = Math.random()*accent
    audio.play()
    console.log("hat")
}

function play() {

    if (refreshIntervalId) {

        clearInterval(refreshIntervalId);
        clearInterval(refreshIntervalIdc);
        clearInterval(refreshIntervalIdd);
        refreshIntervalIdd = 0;
        refreshIntervalIdc = 0;
        refreshIntervalIdb = 0
        refreshIntervalId = 0;
        index = 0;
        measureIndex = 0;
        accentIndex = 0;
        count = 0;

        // Per cancellare il pattern con STOP
        /*pattern.fill(0)
        timeSignatureDen.fill(0)
        timeSignatureNum.fill(0)
        notes.fill(0)
        sub.fill(0)
        accentPatternMap.clear()
        timeSignatureNum[0] = parseInt(document.getElementById('timesignum').value);
        sigPatt = timeSignatureNum[0]
        timeSignatureDen[0] = parseInt(document.getElementById('timesigden').value);*/

    } else {
        generate()
    }
}

function generate() {

    for (measureIndex = 0; measureIndex < 4; measureIndex++) {

        if (measureIndex == 0) { //generate first accent pattern

            if (complexity == 3) { //in the case of complexity=3 the accent pattern has a different time signature numerator than the rest of the elements

                while (timeSignatureNum[measureIndex] % sigPatt == 0){
                    if (timeSignatureNum[measureIndex]>=8){
                        sigPatt = Math.ceil(Math.random() * timeSignatureNum[measureIndex] + 1)
                        console.log("sigPatt =", sigPatt)
                    }
                    else{
                        sigPatt = Math.ceil(Math.random() * timeSignatureNum[measureIndex]*2 + 1)
                        console.log("sigPatt =", sigPatt)
                    }
                }


            } else {

                if (timeSignatureNum[measureIndex]>=8){
                    sigPatt = timeSignatureNum[measureIndex]
                }

                else{
                    sigPatt = timeSignatureNum[measureIndex]*2
                }

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
            if (complexity!=5) {

                accentPatternMap.set(measureIndex + "", accentPatternMap.get(measureIndex - 1 + ""));
            }
        }


        //generate list of time signatures
        if (measureIndex != 0) {

            if (complexity != 5) { //in the cases of complexity 1 and 3 the time signature stays the same

                timeSignatureNum[measureIndex] = timeSignatureNum[measureIndex - 1]
                timeSignatureDen[measureIndex] = timeSignatureDen[measureIndex - 1]

            }

            else{
                if (measureIndex==1){
                    timeSignatureDen[measureIndex]=timeSignatureDen[measureIndex-1]*2
                    timeSignatureNum[measureIndex]=timeSignatureNum[measureIndex-1]*2
                    for (let i = 0; accentPatternMap.get(measureIndex - 1 + "")[i] && i < 4; i++) {

                        timeSignatureNum[measureIndex]++

                    }
                }
                else{
                    timeSignatureNum[measureIndex] = timeSignatureNum[measureIndex - 2]
                    timeSignatureDen[measureIndex] = timeSignatureDen[measureIndex - 2]
                }
            }

        }

        while (timeSignatureDen[measureIndex]<8){
            timeSignatureDen[measureIndex]=timeSignatureDen[measureIndex]*2
            timeSignatureNum[measureIndex]=timeSignatureNum[measureIndex]*2
        }

        if (complexity==5 && measureIndex!=0){
            if (measureIndex == 1) {

                var accentPattern = new Array(Math.ceil(timeSignatureNum[0] / 2));

                for (let i = 0; accentPatternMap.get(measureIndex - 1 + "")[i] != 0 && i < 4; i++) {

                    accentPattern[i] = (accentPatternMap.get(measureIndex - 1 + "")[i]) * 2 + 1;

                }
                accentPatternMap.set(measureIndex + "", accentPattern);
            }
            else {
                accentPatternMap.set(measureIndex + "", accentPatternMap.get(measureIndex-2 +""));
            }

        }


        if (sub[measureIndex] == 0) { //determines the subdivisions for each measure

            if (measureIndex == 0) {

                sub[measureIndex] = Math.round(Math.random() * 2 + 2) * timeSignatureDen[measureIndex];
                console.log("sub[", measureIndex, "]==", sub[measureIndex])


            } else {

                sub[measureIndex] = sub[measureIndex - 1]


            }
            if (complexity == 2) {

                if (measureIndex == 1) {
                    for (let i=0; accentPatternMap.get(measureIndex + "")[i]; i++){
                        sub[measureIndex]++;
                    }
                } else {
                    sub[measureIndex] = sub[measureIndex - 2]
                }
            }
            else if (complexity==5){
                if (measureIndex == 1) {
                    for (let i=0; accentPatternMap.get(measureIndex + "")[i]; i++){
                        sub[measureIndex]--;
                    }
                } else if (measureIndex!=0) {
                    sub[measureIndex] = sub[measureIndex - 2]
                }
            }

            if (BPM>=110){
                while (sub[measureIndex]>16){
                    sub[measureIndex]=sub[measureIndex]/2
                }
                if (sub[measureIndex]==timeSignatureDen[measureIndex]){
                    if(sub[measureIndex]%3==0){
                        sub[measureIndex]=sub[measureIndex]*2/3
                    }
                    else{
                        sub[measureIndex]=sub[measureIndex]*3/2
                    }
                }
            }

            hatsub[measureIndex] = sub[measureIndex]

            if(complexity==4){
                if (measureIndex == 0) {
                    while (sub[measureIndex]%hatsub[measureIndex]==0 || hatsub[measureIndex]%sub[measureIndex]==0){
                        hatsub[measureIndex] = sub[measureIndex]*Math.round(Math.random()*4+1)/2
                    }
                } else {

                    hatsub[measureIndex] = hatsub[measureIndex - 1]

                }
            }

            if (BPM>=110){
                while (hatsub[measureIndex]>16){
                    hatsub[measureIndex]=hatsub[measureIndex]/2
                }
                if (complexity==4){
                    if (sub[measureIndex]==hatsub[measureIndex]){
                        if(hatsub[measureIndex]%3==0){
                            hatsub[measureIndex]=hatsub[measureIndex]*3/2
                        }
                        else{
                            hatsub[measureIndex]=hatsub[measureIndex]*2/3
                        }
                    }
                }

            }

        }

        console.log("sub[", measureIndex, "]==", sub[measureIndex])

 //determines the number of notes and the pattern for the kick for each measure
        if (measureIndex == 0) {

            notes[measureIndex] = timeSignatureNum[measureIndex] * sub[measureIndex] / timeSignatureDen[measureIndex];
            hatNotes[measureIndex] = timeSignatureNum[measureIndex] * hatsub[measureIndex] / timeSignatureDen[measureIndex];
            accentedNotes[measureIndex] = sigPatt * sub[measureIndex] / timeSignatureDen[measureIndex];
            pattern[measureIndex] = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));

            if (pattern[measureIndex]<Math.pow(2, notes[measureIndex])/2){
                pattern[measureIndex]=pattern[measureIndex]+Math.pow(2, notes[measureIndex])/2
            }
        } else {
            if (complexity == 1 || complexity == 3 || complexity==4) {
                if (measureIndex == 3) {
                    notes[measureIndex] = timeSignatureNum[measureIndex] * sub[measureIndex] / timeSignatureDen[measureIndex];
                    pattern[measureIndex] = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));
                } else {
                    notes[measureIndex] = notes[0];
                    pattern[measureIndex] = pattern[0];
                }
            } else if (complexity == 2 || complexity == 5) {
                if (measureIndex == 1) {
                    notes[measureIndex] = timeSignatureNum[measureIndex] * sub[measureIndex] / timeSignatureDen[measureIndex];
                    pattern[measureIndex] = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));
                }
                else {
                    notes[measureIndex] = notes[measureIndex-2];
                    pattern[measureIndex] = pattern[measureIndex-2];
                }
            }
        }
    } //end of for loop

    measureIndex=0
    if (refreshIntervalIdd == 0) {
        refreshIntervalIdd = setInterval(accentedPlay, 240000 / (BPM * timeSignatureDen[measureIndex]))
        setTimeout(function(){refreshIntervalIdb = setInterval(function(){accent=0.15}, 80000 / (BPM * timeSignatureDen[measureIndex]))}, 80000 / (BPM * timeSignatureDen[measureIndex]))
    }
    if (refreshIntervalId == 0) {
        refreshIntervalId = setInterval(render, 240000 / (BPM * sub[measureIndex]))
    }
    if (refreshIntervalIdc == 0) {

        refreshIntervalIdc = setInterval(hat, 480000 / (BPM * hatsub[measureIndex]))

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

    if(index==0){
        cymbal()
        playC = 1;
    }

    let patternBinary = pattern[measureIndex].toString(2);

    if (index*timeSignatureDen[measureIndex]%sub[measureIndex]!=0 && patternBinary.charAt(index) - '0') {
        ghostSnare();

        playGS = 1;

        /*if (s != -1) {

            if (playC == 1) {

                var markup = "<tr><td bgColor='#0000ff'></td><td></td><td bgColor='#4c9a2a'></td><td></td><td></td></tr>";
                $("table tbody").append(markup);
                s++;

                playC = 0;
            } else {

                var markup = "<tr><td></td><td></td><td bgColor='#4c9a2a'></td><td></td><td></td></tr>";
                $("table tbody").append(markup);
                s++;

            }


        }*/

    } else {

        //playGS = 0;

        /*if (s != -1) {

            if (playC == 1) {

                var markup = "<tr><td bgColor='#0000ff'></td><td></td><td></td><td></td><td></td></tr>";
                $("table tbody").append(markup);
                s++;

                playC = 0;
            } else {

                var markup = "<tr><td></td><td></td><td></td><td></td><td></td></tr>";
                $("table tbody").append(markup);
                s++;

            }
        }*/

    }



    console.log("sub=", sub[measureIndex])

    index++;

    if (index >= notes[measureIndex]) {
        index = 0;
        measureIndex++;

        if (complexity==1 || complexity==4 || complexity==5){
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
        if (complexity==1 || complexity==4 || complexity==5){
            clearInterval(refreshIntervalIdd);
            clearInterval(refreshIntervalIdb);
            playH = 1;
            refreshIntervalIdd = setInterval(accentedPlay, 240000 / (BPM * timeSignatureDen[measureIndex]))
            setTimeout(function(){refreshIntervalIdb = setInterval(function(){accent=0.25}, 80000 / (BPM * timeSignatureDen[measureIndex]))}, 80000 / (BPM * timeSignatureDen[measureIndex]))
        }

        if (s == sub[measureIndex]) {
            s = -1;
        }


        refreshIntervalId = setInterval(render, 240000 / (BPM * sub[measureIndex]))
        hat()
        playH = 1;
        refreshIntervalIdc = setInterval(hat, 480000 / (BPM * hatsub[measureIndex]))

        console.log("measure=", measureIndex)
        console.log("TimeSigNum=", timeSignatureNum[measureIndex])
        console.log("TimeSigDen=", timeSignatureDen[measureIndex])
    }
}

function accentedPlay(){

    console.log("accentIndex=", accentIndex);

    if(complexity==2 || complexity==3){
        if ((accentIndex==0 && count==0) || accentIndex == accentPatternMap.get(0 + "")[count-1]) {
            accent=0.75

            if (count % 2 ==0){
                kick();

                playK = 1;

                /*if (s != -1) {

                    if (playGS == 1) {
                        if (playC == 1) {

                            var markup = "<tr><td bgColor='#0000ff'></td><td bgColor='#ffa500'></td><td bgColor='#4c9a2a'></td><td></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;

                            playC = 0;
                        } else {

                            var markup = "<tr><td></td><td bgColor='#ffa500'></td><td bgColor='#4c9a2a'></td><td></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;

                        }
                    } else {
                        if (playC == 1) {

                            var markup = "<tr><td bgColor='#0000ff'></td><td bgColor='#ffa500'></td><td></td><td></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;

                            playC = 0;
                        } else {

                            var markup = "<tr><td></td><td bgColor='#ffa500'></td><td></td><td></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;

                        }
                    }
                }*/

            } else{
                snare();

                playS = 1;

                /*if (s != -1) {

                    if (playGS == 1) {
                        if (playC == 1) {

                            var markup = "<tr><td bgColor='#0000ff'></td><td></td><td bgColor='#4c9a2a'></td><td bgColor='#ffc0cb'></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;

                            playC = 0;
                        } else {

                            var markup = "<tr><td></td><td bgColor='#ffa500'></td><td bgColor='#4c9a2a'></td><td bgColor='#ffc0cb'></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;

                        }
                    } else {
                        if (playC == 1) {

                            var markup = "<tr><td bgColor='#0000ff'></td><td></td><td></td><td bgColor='#ffc0cb'></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;

                            playC = 0;
                        } else {

                            var markup = "<tr><td></td><td></td><td></td><td bgColor='#ffc0cb'></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;

                        }
                    }
                }*/
            }
            count++;
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
    } else {

        if ((accentIndex==0 && count==0) || accentIndex == accentPatternMap.get(measureIndex + "")[count-1]) {
            accent=0.75
            if (count % 2 ==0){
                kick();

                if (s != -1) {

                    if (playGS == 1) {

                        if (playC == 1) {

                            if (playH == 1) {

                                // C YES K YES GS YES S NO H YES

                                var markup = "<tr><td bgColor='#0000ff'></td><td bgColor='#ffa500'></td><td bgColor='#4c9a2a'></td><td></td><td bgColor='8b0000'></td></tr>";
                                $("table tbody").append(markup);
                                s++;

                                playH = 0;

                            } else {

                                // C YES K YES GS YES S NO H NO

                                var markup = "<tr><td bgColor='#0000ff'></td><td bgColor='#ffa500'></td><td bgColor='#4c9a2a'></td><td></td><td></td></tr>";
                                $("table tbody").append(markup);
                                s++;
                            }

                            /*var markup = "<tr><td bgColor='#0000ff'></td><td bgColor='#ffa500'></td><td bgColor='#4c9a2a'></td><td></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;*/

                            playC = 0;

                        } else {

                            if (playH == 1) {

                                // C NO K YES GS YES S NO H YES

                                var markup = "<tr><td></td><td bgColor='#ffa500'></td><td bgColor='#4c9a2a'></td><td></td><td bgColor='8b0000'></td></tr>";
                                $("table tbody").append(markup);
                                s++;

                                playH = 0;
                            } else {

                                // C NO K YES GS YES S NO H NO

                                var markup = "<tr><td></td><td bgColor='#ffa500'></td><td bgColor='#4c9a2a'></td><td></td><td></td></tr>";
                                $("table tbody").append(markup);
                                s++;
                            }

                            /*var markup = "<tr><td></td><td bgColor='#ffa500'></td><td bgColor='#4c9a2a'></td><td></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;*/

                        }

                        playGS = 0;

                    } else {

                        if (playC == 1) {

                            if (playH == 1) {

                                // C YES K YES GS NO S NO H YES

                                var markup = "<tr><td bgColor='#0000ff'></td><td bgColor='#ffa500'></td><td></td><td></td><td bgColor='8b0000'></td></tr>";
                                $("table tbody").append(markup);
                                s++;

                                playH = 0;

                            } else {

                                // C YES K YES GS NO S NO H NO

                                var markup = "<tr><td bgColor='#0000ff'></td><td bgColor='#ffa500'></td><td></td><td></td><td></td></tr>";
                                $("table tbody").append(markup);
                                s++;

                            }

                            /*var markup = "<tr><td bgColor='#0000ff'></td><td bgColor='#ffa500'></td><td></td><td></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;*/

                            playC = 0;
                        } else {

                            if (playH == 1) {

                                // C NO K YES GS NO S NO H YES
                                var markup = "<tr><td></td><td bgColor='#ffa500'></td><td></td><td></td><td bgColor='8b0000'></td></tr>";
                                $("table tbody").append(markup);
                                s++;

                                playH = 0;
                            } else {

                                // C NO K YES GS NO S NO H NO
                                var markup = "<tr><td></td><td bgColor='#ffa500'></td><td></td><td></td><td></td></tr>";
                                $("table tbody").append(markup);
                                s++;
                            }

                            /*var markup = "<tr><td></td><td bgColor='#ffa500'></td><td></td><td></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;*/

                        }
                    }
                }
            }
            else{
                snare();

                if (s != -1) {

                    if (playGS == 1) {
                        if (playC == 1) {

                            if (playH == 1) {

                                // C YES K NO GS YES S YES H YES

                                var markup = "<tr><td bgColor='#0000ff'></td><td></td><td bgColor='#4c9a2a'></td><td bgColor='#ffc0cb'></td><td bgColor='8b0000'></td></tr>";
                                $("table tbody").append(markup);
                                s++;

                                playH = 0;
                            } else {

                                // C YES K NO GS YES S YES H NO
                                var markup = "<tr><td bgColor='#0000ff'></td><td></td><td bgColor='#4c9a2a'></td><td bgColor='#ffc0cb'></td><td></td></tr>";
                                $("table tbody").append(markup);
                                s++;
                            }

                            /*var markup = "<tr><td bgColor='#0000ff'></td><td></td><td bgColor='#4c9a2a'></td><td bgColor='#ffc0cb'></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;*/

                            playC = 0;
                        } else {

                            if (playH == 1) {

                                // C NO K NO GS YES S YES H YES
                                var markup = "<tr><td></td><td></td><td bgColor='#4c9a2a'></td><td bgColor='#ffc0cb'></td><td bgColor='8b0000'></td></tr>";
                                $("table tbody").append(markup);
                                s++;

                                playH = 0;
                            } else {

                                // C NO K NO GS YES S YES H NO
                                var markup = "<tr><td></td><td></td><td bgColor='#4c9a2a'></td><td bgColor='#ffc0cb'></td><td></td></tr>";
                                $("table tbody").append(markup);
                                s++;
                            }

                            /*var markup = "<tr><td></td><td bgColor='#ffa500'></td><td bgColor='#4c9a2a'></td><td bgColor='#ffc0cb'></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;*/

                        }
                        playGS = 0;
                    } else {
                        if (playC == 1) {

                            if (playH == 1) {

                                // C YES K NO GS NO S YES H YES
                                var markup = "<tr><td bgColor='#0000ff'></td><td></td><td></td><td bgColor='#ffc0cb'></td><td bgColor='8b0000'></td></tr>";
                                $("table tbody").append(markup);
                                s++;

                                playH = 0;
                            } else {

                                // C YES K NO GS NO S YES H NO
                                var markup = "<tr><td bgColor='#0000ff'></td><td></td><td></td><td bgColor='#ffc0cb'></td><td></td></tr>";
                                $("table tbody").append(markup);
                                s++;
                            }

                            /*var markup = "<tr><td bgColor='#0000ff'></td><td></td><td></td><td bgColor='#ffc0cb'></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;*/

                            playC = 0;

                        } else {

                            if (playH == 1) {

                                // C NO K NO GS NO S YES H YES
                                var markup = "<tr><td></td><td></td><td></td><td bgColor='#ffc0cb'></td><td bgColor='8b0000'></td></tr>";
                                $("table tbody").append(markup);
                                s++;

                                playH = 0;
                            } else {

                                // C NO K NO GS NO S YES H NO
                                var markup = "<tr><td></td><td></td><td></td><td bgColor='#ffc0cb'></td><td></td></tr>";
                                $("table tbody").append(markup);
                                s++;
                            }

                            /*var markup = "<tr><td></td><td></td><td></td><td bgColor='#ffc0cb'></td><td></td></tr>";
                            $("table tbody").append(markup);
                            s++;*/

                        }
                    }
                }
            }

            count++;

            accentIndex = 0;
        }
        accentIndex++;
        console.log("accentPattern=", accentPatternMap.get(measureIndex + "")[count-1]);
    }
}