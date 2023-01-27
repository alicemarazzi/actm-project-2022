var c = new AudioContext();
var cmp = c.createDynamicsCompressor();
cmp.connect(c.destination);
// var a = c.createAnalyser();
var bs = c.createBufferSource();
bs.loop = true;

var BPM = 120
var timeSignatureNum = new Array(4)
var timeSignatureDen = new Array(4)
var sigPatt = 4
timeSignatureNum[0] = 4
timeSignatureDen[0] = 4
var snareflag=0
var notes = new Array(4).fill(0)
var accentedNotes = new Array(4).fill(0)
var hatNotes = new Array(4).fill(0)
var sub = new Array(4).fill(0)
var hatsub = new Array(4).fill(0)
var refreshIntervalId = 0
var refreshIntervalIdb = 0
var complexity = 1
var measureIndex = 0
var pattern = new Array(4).fill(0)
var accentPatternMap = new Map()
var accentIndex=0
var tableIndex=0
var count=0
var accent=1
var tableMap = new Map()
var flagM = 0
var tableNotes = new Array(4).fill(0)

// ALI DRUMS SCHEME


var data = {
    '1': { name: 'Kick', sound: 'Kick (9).wav'},
    '2': { name: 'Cymbal', sound: 'live_open_hat.wav'},
    '3': { name: 'Snare', sound: 'Snare (25).wav'},
    '4': { name: 'Ghost Snare', sound: 'ghoul_snare.wav'},
    '5': { name: 'hat', sound: 'Hat (7).wav'}
};

var drumkit = document.getElementById('drumkit');

function construct() {
    for(var key in data) {
        var drumEl = document.createElement('img');
        drumEl.classList.add('drum');
        drumkit.appendChild(drumEl);
        if (key == '1') {
            drumEl.id = 'kick';
            drumEl.src = "https://w7.pngwing.com/pngs/271/248/png-transparent-bass-drums-tom-toms-timbales-snare-drums-drums-gretsch-drum-cymbal.png"
        }
        else if (key == '2') {
            drumEl.id = 'cymbal';
            drumEl.src = "https://w7.pngwing.com/pngs/374/775/png-transparent-crash-cymbal-avedis-zildjian-company-crash-ride-cymbal-drum-drum-cymbal-musical-instruments.png"
        }
        else if (key == '3') {
            drumEl.id = 'snare';
            drumEl.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Drumhead_Coated_on_Snare_Drum.png/1200px-Drumhead_Coated_on_Snare_Drum.png"
        }
        else if (key == '4') {
            drumEl.id = 'ghostsnare';
            drumEl.src = "https://toppng.com/uploads/preview/stars-solid-shell-snare-drums-offer-three-characteristic-tama-star-snare-case-115631217325ugsplu4ci.png"
        }
        else if (key == '5') {
            drumEl.id = 'hat';
            drumEl.src = "https://e7.pngegg.com/pngimages/932/127/png-clipart-hi-hats-sabian-crescent-cymbals-paiste-hi-hat-hat-beat.png"
        }



        var h2 = document.createElement('h2');
        h2.textContent = key;

        var span = document.createElement('span');
        span.textContent = data[key].name;

        drumEl.appendChild(h2);
        drumEl.appendChild(span);

        data[key].el = drumEl;

        drumEl.addEventListener('click', function(event) {
            var key = event.currentTarget.querySelector('h2').textContent;
            playDrum(key, 1);
        });
    }

};

function playDrum(key, click) {

    if (click) {
        var audio = new Audio();
        audio.src = data[key].sound;
        audio.play();
    }

    data[key].el.style.animation = 'drum-animation 0.3s';

    data[key].el.addEventListener('animationend', removeAnimation);

};

function removeAnimation(event) {
    event.currentTarget.style.animation = 'none';

}

// function handleKeyEvents(event) {
//     playDrum(event.key.toUpperCase());
// }

construct();
//window.addEventListener('keydown', handleKeyEvents);

// ALI DRUMS SCHEME END


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

function kick() {
    var audio = new Audio('Kick (9).wav');
    audio.volume = 0.75
    playDrum('1', 0);
    audio.play();
}

function cymbal(){
    var audio = new Audio('live_open_hat.wav');
    playDrum('2', 0);
    audio.play();
}

function snare(){
    var audio = new Audio('Snare (25).wav');
    audio.volume = 0.6
    playDrum('3', 0);
    audio.play();
}

function ghostSnare(){
    var audio = new Audio('ghoul_snare.wav')
    audio.volume = Math.random()*0.3
    playDrum('4', 0);
    audio.play()
}

function hat(){
    var audio = new Audio('Hat (7).wav');
    audio.volume = Math.random()*accent;
    playDrum('5', 0);
    audio.play();
    tableMap.get(tableIndex+(measureIndex*tableNotes[measureIndex])+"").get(measureIndex*5 + 4 + "").style.backgroundColor = "#8b0000";
}

function play() {

    if (refreshIntervalId) {

        clearInterval(refreshIntervalId)
        clearInterval(refreshIntervalIdb)
        refreshIntervalIdb = 0
        refreshIntervalId = 0
        index = 0
        measureIndex = 0
        accentIndex = 0
        count = 0
        tableIndex=0

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
                    }
                    else{
                        sigPatt = Math.ceil(Math.random() * timeSignatureNum[measureIndex]*2 + 1)
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

                sub[measureIndex] = Math.round(Math.random() * 2 + 2) * timeSignatureDen[measureIndex]
                console.log("sub=", sub[measureIndex])

            } else {
                sub[measureIndex] = sub[measureIndex - 1]

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
        console.log("sub=", sub[measureIndex])

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

 //determines the number of notes and the pattern for the kick for each measure
        if (measureIndex == 0) {

            notes[measureIndex] = timeSignatureNum[measureIndex] * sub[measureIndex] / timeSignatureDen[measureIndex];
            hatNotes[measureIndex] = timeSignatureNum[measureIndex] * hatsub[measureIndex] / timeSignatureDen[measureIndex];
            accentedNotes[measureIndex] = sigPatt;
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
            hatNotes[measureIndex] = timeSignatureNum[measureIndex] * hatsub[measureIndex] / timeSignatureDen[measureIndex];
            if (complexity!=5){
                accentedNotes[measureIndex]=accentedNotes[measureIndex-1]
            }

        }
        tableNotes[measureIndex]=lcm(lcm(hatNotes[measureIndex], notes[measureIndex]), accentedNotes[measureIndex])
        console.log("tableNotes=", tableNotes)
    } //end of for loop

    measureIndex=0;
    table()
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



function table(){

    if (flagM == 0) {
        for (measureIndex=0; measureIndex<4; measureIndex++){

            for (let s=0; s<tableNotes[measureIndex]; s++){
                var arrayMap = new Map();
                var table;
                var cell;

                if (measureIndex==0){
                    table = document.getElementById("tableC");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(1 + "", cell);

                    table = document.getElementById("tableS");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(2 + "", cell);

                    table = document.getElementById("tableK");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(3 + "", cell);

                    table = document.getElementById("tableH");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(4 + "", cell);

                    table = document.getElementById("tableGS");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(5 + "", cell);
                }
                if (measureIndex==1){
                    table = document.getElementById("tableC2");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(6 + "", cell);

                    table = document.getElementById("tableS2");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(7 + "", cell);

                    table = document.getElementById("tableK2");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(8 + "", cell);

                    table = document.getElementById("tableH2");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(9 + "", cell);

                    table = document.getElementById("tableGS2");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(10 + "", cell);
                }
                if (measureIndex==2){
                    table = document.getElementById("tableC3");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(11 + "", cell);

                    table = document.getElementById("tableS3");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(12 + "", cell);

                    table = document.getElementById("tableK3");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(13 + "", cell);

                    table = document.getElementById("tableH3");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(14 + "", cell);

                    table = document.getElementById("tableGS3");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(15 + "", cell);
                }
                if (measureIndex==3){
                    table = document.getElementById("tableC4");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(16 + "", cell);

                    table = document.getElementById("tableS4");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(17 + "", cell);

                    table = document.getElementById("tableK4");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(18 + "", cell);

                    table = document.getElementById("tableH4");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(19 + "", cell);

                    table = document.getElementById("tableGS4");
                    cell = table.rows[0].insertCell(s+1);
                    arrayMap.set(20 + "", cell);
                }
                tableMap.set(s+(measureIndex*tableNotes[measureIndex]) + "", arrayMap);

            }
        }
        measureIndex=0
        flagM = 1;
    }

    if (refreshIntervalId==0){
        refreshIntervalId = setInterval(tableIn, 240000 / (BPM * tableNotes[measureIndex]))
    }
    setTimeout(function(){refreshIntervalIdb = setInterval(function(){accent=0.15}, 80000 / (BPM * timeSignatureDen[measureIndex]))}, 80000 / (BPM * timeSignatureDen[measureIndex]))

}

function tableIn(){
    snareflag=0
    if(tableIndex==0){
        cymbal()
        tableMap.get(tableIndex+(measureIndex*tableNotes[measureIndex])+"").get(measureIndex*5 + 1+"").style.backgroundColor = "#0000ff";
    }
    if(complexity==2 || complexity==3){
        if ((accentIndex==0 && count==0) || accentIndex == accentPatternMap.get(0 + "")[count-1]) {
            accent=0.75

            if (count % 2 ==0){

                kick();
                tableMap.get(tableIndex+(measureIndex*tableNotes[measureIndex])+"").get(measureIndex*5 + 3 + "").style.backgroundColor = "#ffa500";

            } else {
                snare();
                tableMap.get(tableIndex+(measureIndex*tableNotes[measureIndex])+"").get(measureIndex*5 + 2 + "").style.backgroundColor = "#ffc0cb";
                snareflag=1
            }
            count++;
            accentIndex = 0;
        }
    }
    else{
        if ((accentIndex==0 && count==0) || accentIndex == accentPatternMap.get(measureIndex + "")[count-1]) {
            accent=0.75

            if (count % 2 ==0){

                kick();
                tableMap.get(tableIndex+(measureIndex*tableNotes[measureIndex])+"").get(measureIndex*5 + 3 + "").style.backgroundColor = "#ffa500";

            } else {
                snare();
                tableMap.get(tableIndex+(measureIndex*tableNotes[measureIndex])+"").get(measureIndex*5 + 2 + "").style.backgroundColor = "#ffc0cb";
                snareflag=1
            }
            count++
            accentIndex = 0
        }
    }

    let patternBinary = pattern[measureIndex].toString(2);

    if (snareflag==0 && tableIndex!=0 && patternBinary.charAt(tableIndex*(tableNotes[measureIndex]/sub[measureIndex]) - '0')!=0){
        ghostSnare();
        tableMap.get(tableIndex+(measureIndex*tableNotes[measureIndex])+"").get(measureIndex*5 + 5 + "").style.backgroundColor = "#4c9a2a";
    }



    if (tableIndex%(2*tableNotes[measureIndex]/hatsub[measureIndex])==0){
        hat()
    }



    tableIndex++
    if (tableIndex%(tableNotes[measureIndex]/timeSignatureDen[measureIndex])==0){
        accentIndex++
    }
    if (tableIndex==tableNotes[measureIndex]){

        measureIndex++
        tableIndex=0

        if (measureIndex == 4) {
            measureIndex = 0
        }
        if (complexity==1 || complexity==4 || complexity==5){
            clearInterval(refreshIntervalIdb)
            setTimeout(function(){refreshIntervalIdb = setInterval(function(){accent=0.25}, 80000 / (BPM * timeSignatureDen[measureIndex]))}, 80000 / (BPM * timeSignatureDen[measureIndex]))
            accentIndex=0
            if (count>1){
                count = 0
            }
        }
        else{
            if (!accentPatternMap.get(measureIndex + "")[count]){
                if (count>1){
                    count=0;
                }
                accentIndex=0;
            }
        }
        clearInterval(refreshIntervalId)
        refreshIntervalId = setInterval(tableIn, 240000 / (BPM * tableNotes[measureIndex]))
    }
}

function gcd(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function lcm(a, b) {
    return (Math.abs(a * b) / gcd(a, b))
}