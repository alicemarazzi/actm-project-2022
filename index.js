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
var patternBinary = new Array(4).fill(0)
var accentPatternMap = new Map()
var accentIndex=0
var tableIndex=0
var count=0
var accent=1
var tableMap = new Map()
var flagM = 0
var tableNotes = new Array(4).fill(0)
var kickflag=0
var kickType=8
var snareType=25
var hatType=12
var openType=1
var replayFlag = 0;

var data = {
    '1': { name: 'Kick'},
    '2': { name: 'Cymbal'},
    '3': { name: 'Snare'},
    '4': { name: 'Ghost Snare'},
    '5': { name: 'hat'}
};

var drumkit = document.getElementById('drumkit');

construct();
window.addEventListener('keydown', handleKeyEvents);
start.onclick = toggleOn;

/** The following functions associate to a variable a wav file dependent on the selected sound, they modulate
 * the volume, and they play the sound. If they are called inside the loop they will also animate the drum. **/

function kick() {
    var audio = new Audio('Kick ('+kickType+').wav');
    audio.volume = 0.75
    if (refreshIntervalId != 0) playDrum('1', 0);
    audio.play();
}

function cymbal(){
    var audio = new Audio('Openhat ('+openType+').wav');
    if (refreshIntervalId != 0) playDrum('2', 0);
    audio.play();
}

function snare(){
    var audio = new Audio('Snare ('+snareType+').wav');
    audio.volume = 0.6
    if (refreshIntervalId != 0) playDrum('3', 0);
    audio.play();
}

function ghostSnare(){
    var audio = new Audio('ghoul_snare.wav')
    audio.volume = Math.random()*0.3
    if (refreshIntervalId != 0) playDrum('4', 0);
    audio.play()
}

function hat(){
    var audio = new Audio('Hat ('+hatType+').wav');
    audio.volume = Math.random()*accent;
    if (refreshIntervalId != 0) playDrum('5', 0);
    audio.play();
}

/** This function creates graphic elements of the instruments. **/

function construct() {

    for(var key in data) {

        var drumEl = document.createElement('img');
        drumEl.classList.add('drum');
        drumkit.appendChild(drumEl);
        if (key == '1') {
            drumEl.id = 'kick';
            drumEl.src = 'photo_2023-02-06_18-14-17.jpg';
        }
        else if (key == '2') {
            drumEl.id = 'cymbal';
            drumEl.src = 'photo_2023-02-06_18-14-20.jpg';
        }
        else if (key == '3') {
            drumEl.classList.add('snare');
            drumEl.src = 'photo_2023-02-06_18-14-19.jpg';
        }
        else if (key == '4') {
            drumEl.classList.add('snare');
            drumEl.id = 'ghostsnare';
            drumEl.src = 'photo_2023-02-06_18-14-22.jpg';
        }
        else if (key == '5') {
            drumEl.id = 'hat';
            drumEl.src = 'photo_2023-02-06_18-14-21.jpg';
        }

        var h2 = document.createElement('h2');
        h2.textContent = key;

        drumEl.appendChild(h2);

        data[key].el = drumEl;

        drumEl.addEventListener('click', function(event) {
            var key = event.currentTarget.querySelector('h2').textContent;
            playDrum(key, 1);
        });
    }
}

/** The following functions animate the graphic elements when the instruments are played by clicking on them or by
 * creating a pattern. **/
function playDrum(key, click) {

    if (click == 1) {

        // var audio = new Audio();

        if (key == '4') {
            // audio.src = data[3].sound;
            data[3].el.style.animation = 'drum-animation 0.3s';
            data[3].el.addEventListener('animationend', removeAnimation);
        } else {
            // audio.src = data[key].sound;
            data[key].el.style.animation = 'drum-animation 0.3s';
            data[key].el.addEventListener('animationend', removeAnimation);
        }

        if (refreshIntervalId == 0) {
            if (key == '1') kick();
            else if (key == '2') cymbal();
            else if (key == '5') hat();
            else snare();
        }

    } else if (click == 2) {
        if (refreshIntervalId == 0) {
            if (key == 'K') kick();
            else if (key == 'C') cymbal();
            else if (key == 'H') hat();
            else if (key == 'S') snare();
            else if (key == 'G') ghostSnare();
        }
        if (key == 'G') {
            key = 4;
            data[key].el.style.animation = 'drum-animation-ghostsnare 0.3s';
            data[3].el.style.animation = 'disappear 0.3s';
            data[key].el.addEventListener('animationend', removeAnimation);
            data[3].el.addEventListener('animationend', removeAnimation);
        } else {
            if (key == 'C') key = '2';
            else if (key == 'S') key = '3';
            else if (key == 'H') key = '5';
            else if (key == 'K') key = '1';
            data[key].el.style.animation = 'drum-animation 0.3s';
            data[key].el.addEventListener('animationend', removeAnimation);
        }
    } else {
        if (key == '4') {
            data[key].el.style.animation = 'drum-animation-ghostsnare 0.3s';
            data[3].el.style.animation = 'disappear 0.3s';
            data[key].el.addEventListener('animationend', removeAnimation);
            data[3].el.addEventListener('animationend', removeAnimation);
        } else {
            data[key].el.style.animation = 'drum-animation 0.3s';
            data[key].el.addEventListener('animationend', removeAnimation);
        }
    }
}

function handleKeyEvents(event) {
    playDrum(event.key.toUpperCase(), 2);
}

function removeAnimation(event) {
    event.currentTarget.style.animation = 'none';
}

/** The following functions take the input of the user and change the variables accordingly. **/

function createTimeSignatureNum() {
    timeSignatureNum[0] = parseInt(document.getElementById('timesignum').value);
    sigPatt = timeSignatureNum[0]
}

function createTimeSignatureDen() {
    timeSignatureDen[0] = parseInt(document.getElementById('timesigden').value);
}

function createKickType() {
    kickType = parseInt(document.getElementById('kick_type').value);
    kick();
}

function createOpenType() {
    openType = parseInt(document.getElementById('open_type').value);
    cymbal();
}

function createSnareType() {
    snareType = parseInt(document.getElementById('snare_type').value);
    snare();
}

function createHatType() {
    hatType = parseInt(document.getElementById('hat_type').value);
    hat();
}

function changeBPM() {
    BPM = parseInt(document.getElementById('bpmvalue').value);
}

function changeComplexity() {
    complexity = parseInt(document.getElementById('complex').value);
}

/** This function calls play function and toggles the start/stop button and enables the refresh button. **/

function toggleOn(e) {

    play();

    var refreshButton = document.getElementById("refresh");
    refreshButton.style.opacity = "100";

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

/** This function checks whether the loop is in motion, and if it is it stops everything; if it isn't it either calls
 * the generate function or it starts the loop based on a variable that checks whether the pattern was already
 * generated or not. **/

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
        kickflag = 0;

    } else if (replayFlag==0) {
        generate()
    }
    else{
        refreshIntervalId = setInterval(tableIn, 240000 / (BPM * tableNotes[measureIndex]))
        setTimeout(function(){refreshIntervalIdb = setInterval(function(){accent=0.15}, 80000 / (BPM * timeSignatureDen[measureIndex]))}, 80000 / (BPM * timeSignatureDen[measureIndex]))
    }
}

/** This function generates the main elements of the loop: the accent pattern, the evolution of the time
 * signatures, the subdivision for each measure and for each element, and the pattern of ghost snare. It then calls
 * the table function. **/

function generate() {

    for (measureIndex = 0; measureIndex < 4; measureIndex++) {

        if (measureIndex == 0) { // Generate first accent pattern

            if (timeSignatureNum[measureIndex]>=8){
                sigPatt = timeSignatureNum[measureIndex]
            }

            else{
                sigPatt = timeSignatureNum[measureIndex]*2
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
                else if (sum==sigPatt){
                    i=Math.ceil(sigPatt / 2)
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
        // Generate subsequent accent patterns
        else {

            if (complexity != 4) {
                accentPatternMap.set(measureIndex + "", accentPatternMap.get(measureIndex - 1 + ""));
            } else {

                if (measureIndex == 1) {

                    var accentPattern = new Array(Math.ceil(timeSignatureNum[0] / 2));

                    for (let i=0; accentPatternMap.get(measureIndex-1 + "")[i]; i++){
                        accentPattern[i] = (accentPatternMap.get(measureIndex - 1 + "")[i]) * 2 + 1;
                    }

                    accentPatternMap.set(measureIndex + "", accentPattern);

                } else {
                    accentPatternMap.set(measureIndex + "", accentPatternMap.get(measureIndex-2 +""));
                }
            }
        }

        // Generate list of time signatures
        if (measureIndex != 0) {

            if (complexity != 4) { // In the cases of complexity 1 and 3 the time signature stays the same

                timeSignatureNum[measureIndex] = timeSignatureNum[measureIndex - 1]
                timeSignatureDen[measureIndex] = timeSignatureDen[measureIndex - 1]

            } else {

                if (measureIndex==1) {

                    timeSignatureDen[measureIndex]=timeSignatureDen[measureIndex-1]*2
                    timeSignatureNum[measureIndex]=timeSignatureNum[measureIndex-1]*2

                    for (let i=0; accentPatternMap.get(measureIndex + "")[i]; i++) {
                        timeSignatureNum[measureIndex]++
                    }

                } else {
                    timeSignatureNum[measureIndex] = timeSignatureNum[measureIndex - 2]
                    timeSignatureDen[measureIndex] = timeSignatureDen[measureIndex - 2]
                }
            }
        }

        while (timeSignatureDen[measureIndex]<8){
            timeSignatureDen[measureIndex]=timeSignatureDen[measureIndex]*2
            timeSignatureNum[measureIndex]=timeSignatureNum[measureIndex]*2
        }


        if (sub[measureIndex] == 0) { // It determines the subdivisions for each measure

            if (measureIndex == 0) {

                sub[measureIndex] = Math.round(Math.random() * 2+1) * timeSignatureDen[measureIndex]

                while (timeSignatureNum[measureIndex] * sub[measureIndex] % timeSignatureDen[measureIndex]!=0) {
                    sub[measureIndex]++
                }

            } else {

                sub[measureIndex] = sub[measureIndex - 1]

                if (complexity == 3) {

                    if (measureIndex == 1) {

                        for (let i=0; accentPatternMap.get(measureIndex + "")[i]; i++){
                            sub[measureIndex]++;
                        }

                    } else {
                        sub[measureIndex] = sub[measureIndex - 2]
                    }

                } else if (complexity==4){

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

        hatsub[measureIndex] = sub[measureIndex]

        if (complexity==2) {

            if (measureIndex == 0) {

                while (sub[measureIndex]%hatsub[measureIndex]==0 || hatsub[measureIndex]%sub[measureIndex]==0) {
                    hatsub[measureIndex] = sub[measureIndex]*Math.round(Math.random()*4+1)/2
                }

            } else {

                hatsub[measureIndex] = hatsub[measureIndex - 1]

            }
        }


        // It determines the number of notes and the pattern for the kick for each measure
        if (measureIndex == 0) {

            var pattern

            notes[measureIndex] = timeSignatureNum[measureIndex] * sub[measureIndex] / timeSignatureDen[measureIndex];
            hatNotes[measureIndex] = timeSignatureNum[measureIndex] * hatsub[measureIndex] / timeSignatureDen[measureIndex]
            accentedNotes[measureIndex]= sigPatt;
            pattern = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));

            if (pattern<Math.pow(2, notes[measureIndex])/2){
                pattern=pattern+Math.pow(2, notes[measureIndex])/2
            }

            patternBinary[measureIndex] = pattern.toString(2);

        } else {


            if (complexity <=2) {

                if (measureIndex == 3) {
                    notes[measureIndex] = timeSignatureNum[measureIndex] * sub[measureIndex] / timeSignatureDen[measureIndex];
                    var pattern = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));

                    if (pattern<Math.pow(2, notes[measureIndex])/2) {
                        pattern=pattern+Math.pow(2, notes[measureIndex])/2
                    }

                    patternBinary[measureIndex] = pattern.toString(2);

                } else {
                    notes[measureIndex] = notes[0];
                    patternBinary[measureIndex] = patternBinary[0];
                }
                hatNotes[measureIndex]=hatNotes[measureIndex-1]

            } else if (complexity == 3) {


                if (measureIndex == 1) {
                    notes[measureIndex] = timeSignatureNum[measureIndex] * sub[measureIndex] / timeSignatureDen[measureIndex];
                    var pattern = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));

                    if (pattern<Math.pow(2, notes[measureIndex])/2){
                        pattern=pattern+Math.pow(2, notes[measureIndex])/2
                    }

                    patternBinary[measureIndex] = pattern.toString(2);

                } else {
                    notes[measureIndex] = notes[measureIndex-2];
                    patternBinary[measureIndex] = patternBinary[measureIndex-2];
                }
                hatNotes[measureIndex] = timeSignatureNum[measureIndex] * hatsub[measureIndex] / timeSignatureDen[measureIndex];
            }
            else if (complexity == 4) {


                if (measureIndex == 1) {
                    notes[measureIndex] = notes[measureIndex-1];
                    var pattern = Math.floor(Math.random() * Math.pow(2, notes[measureIndex]));

                    if (pattern<Math.pow(2, notes[measureIndex])/2){
                        pattern=pattern+Math.pow(2, notes[measureIndex])/2
                    }

                    patternBinary[measureIndex] = pattern.toString(2);

                } else {
                    notes[measureIndex] = notes[measureIndex-2];
                    patternBinary[measureIndex] = patternBinary[measureIndex-2];
                }
                hatNotes[measureIndex]=hatNotes[measureIndex-1]
            }



            if (complexity!=4){
                accentedNotes[measureIndex]=accentedNotes[measureIndex-1]
            } else{
                accentedNotes[measureIndex] = timeSignatureNum[measureIndex]
            }

        }

        tableNotes[measureIndex]=lcm(lcm(hatNotes[measureIndex], notes[measureIndex]), accentedNotes[measureIndex])
        console.log("tableNotes=", tableNotes)
    }

    measureIndex=0;
    replayFlag = 1;
    table()
}

/** The following functions generate the table on which the drum pattern is displayed. **/

function table() {

    if (flagM == 0) {

        insertTableNotes();

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

                var n=0

                for (let i=0; i<measureIndex; i++){
                    n=n+tableNotes[i];
                }

                tableMap.set(s+n + "", arrayMap);
            }
        }
        measureIndex=0
        flagM = 1;
    }

    if (refreshIntervalId==0){
        refreshIntervalId = setInterval(tableIn, 240000 / (BPM * tableNotes[measureIndex]))
    }

    setTimeout(function(){refreshIntervalIdb = setInterval(function(){accent=0.15}, 80000 / (BPM * timeSignatureDen[measureIndex]))}, 80000 / (BPM * timeSignatureDen[measureIndex]));
}

function insertTableNotes() {

    var paragraph = document.getElementById("measureOne");

    paragraph.textContent += tableNotes[0];
    paragraph = document.getElementById("measureTwo");
    paragraph.textContent += tableNotes[1];
    paragraph = document.getElementById("measureThree");
    paragraph.textContent += tableNotes[2];
    paragraph = document.getElementById("measureFour");
    paragraph.textContent += tableNotes[3];
}

/** This function is called as a loop with a set interval based on the smallest subdivision, it checks based on the
 * various patterns whether a specified element should be played at a certain time. **/

function tableIn(){

    snareflag=0;

    var n=0;

    for (let i=0; i<measureIndex; i++){
        n=n+tableNotes[i];
    }

    if(tableIndex==0){
        cymbal();
        tableMap.get(tableIndex+n+"").get(measureIndex*5 + 1+"").style.backgroundColor = "#0000ff";
    }

    if(complexity==3){

        if ((accentIndex==0 && count==0) || accentIndex == accentPatternMap.get(0 + "")[count-1]) {
            accent=0.75

            if (kickflag==0){

                kick()
                tableMap.get(tableIndex+n+"").get(measureIndex*5 + 3 + "").style.backgroundColor = "#ffa500";
                kickflag=1

            } else {
                setTimeout(snare, Math.random()*6+1)
                tableMap.get(tableIndex+n+"").get(measureIndex*5 + 2 + "").style.backgroundColor = "#ffc0cb";
                snareflag=1
                kickflag=0
            }

            count++;
            accentIndex = 0;
        }

        if (!accentPatternMap.get(0 + "")[count-1]){
            count=1
        }

    } else{

        if ((accentIndex==0 && count==0) || accentIndex == accentPatternMap.get(measureIndex + "")[count-1]) {
            accent=0.75

            if (kickflag==0){

                kick();
                tableMap.get(tableIndex+n+"").get(measureIndex*5 + 3 + "").style.backgroundColor = "#ffa500";
                kickflag=1


            } else {
                setTimeout(snare, Math.random()*6+1)
                tableMap.get(tableIndex+n+"").get(measureIndex*5 + 2 + "").style.backgroundColor = "#ffc0cb";
                snareflag=1
                kickflag=0

            }
            count++
            accentIndex = 0
        }
    }

    if ((tableIndex+1) % (tableNotes[measureIndex] / accentedNotes[measureIndex]) == 0) {

        accentIndex++;

        if (accentIndex-accentPatternMap.get(measureIndex + "")[count-1]==-1){

            if ((measureIndex==1 || measureIndex==3) && kickflag==1){
                kick()
                tableMap.get(tableIndex+n+"").get(measureIndex*5 + 3 + "").style.backgroundColor = "#ffa500"
            } else if ((measureIndex==2 || measureIndex==3) && kickflag==0){
                snare()
                tableMap.get(tableIndex+n+"").get(measureIndex*5 + 2 + "").style.backgroundColor = "#ffc0cb"
                snareflag=1
            }
        }
    }

    if (snareflag==0 && tableIndex!=0 && patternBinary[measureIndex].charAt(tableIndex*(tableNotes[measureIndex]/notes[measureIndex]) - '0')!=0){
        setTimeout(ghostSnare, Math.random()*14+1)
        tableMap.get(tableIndex+n+"").get(measureIndex*5 + 5 + "").style.backgroundColor = "#4c9a2a";
    }

    if (tableIndex%(tableNotes[measureIndex]/hatNotes[measureIndex])==0){
        setTimeout(hat, Math.random()*14+1)
        tableMap.get(tableIndex+n+"").get(measureIndex*5 + 4 + "").style.backgroundColor = "#8b0000"
    }

    tableIndex++

    if (tableIndex==tableNotes[measureIndex]){

        measureIndex++
        tableIndex=0

        if (measureIndex == 4) {
            measureIndex = 0
        }

        clearInterval(refreshIntervalIdb)
        setTimeout(function(){refreshIntervalIdb = setInterval(function(){accent=0.25}, 80000 / (BPM * timeSignatureDen[measureIndex]))}, 80000 / (BPM * timeSignatureDen[measureIndex]))
        accentIndex=0
        kickflag=0

        if (count>1){
            count = 0
        }

        clearInterval(refreshIntervalId)
        refreshIntervalId = setInterval(tableIn, 240000 / (BPM * tableNotes[measureIndex]))
    }
}

/** The following functions calculate the greatest common divider and least common multiple. **/

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