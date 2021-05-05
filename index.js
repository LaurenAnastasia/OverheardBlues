const myCanvas = { width: 600, height: 600};
const backgroundColor = [230,220,190];
const soundArrays = [[[],[]],[[],[]]];
//will control whether loop runs or not
let looping = false;
// a boolean variable to let us know if a sound is playing
let soundIsPlaying  = false;
//and a variable to store the actual sound playing, or the 
// representation of it so we can check if it's done playing yet.
let soundPlaying = null;
// we'll switch between 0 and 1 here, so we can pick which array to play from
let lastArrayPlayed = 1;
//a start and pause button because, you know, web audio wants user input
let button1, button2;
bufferIsPlaying = false;
let resp = 1;
let respArrays = soundArrays;

const lims = [2,1,5,7];
const codes = ["FL","FR","DL","DR"];

function preload(){
    console.log("Zero");
    for (i = 0; i < codes.length; i++){
        for (j = 0; j < lims[i]; j++){
            let snd = new Howl({ src : [`sounds/${codes[i]+"_"+j}.mp3`]})
            soundArrays[codes[i]].push(snd);
        }
    }
    console.table(soundArrays[0]);
    console.table(soundArrays[1]);

    button1 = createButton('click to start');
    button1.mousePressed(startRoutine)
    button2 = createButton('click to pause');
    button2.mousePressed(pauseRoutine)
}

function setup(){
    createCanvas(myCanvas.width, myCanvas.height);
    background(backgroundColor);   
}



function draw(){
    background(backgroundColor);
    
    //check if the loop should run or not; the buttons set this value
    if(looping){

        if(!bufferIsPlaying){
            if (Math.random()*100 == 1){
                bufferPlaying = pickNewBuffer();
                playBuffer(bufferPlaying);
                bufferPlaying.on('end', () => {
                    bufferPlaying = null,
                    bufferIsPlaying = false;
                });
            }
        }

        if(!soundIsPlaying){
            //our pickNewSound function returns a new sound
            soundPlaying = pickNewSound();
            playSound(soundPlaying)
            //Howler gives us an event listener that waits for the end of a sound
            soundPlaying.on('end', () => {
                soundPlaying = null,
                soundIsPlaying = false;
            });
        }

    } else {
      //logic to stop playing sounds
    }
}

function playBuffer(sound){
    sound.play()
    bufferIsPlaying = true;
  }

function startRoutine(){
    looping = true;
}

function pauseRoutine(){
    looping = false;
}


function pickNewSound(){
    // pick a sound here, this is where we need to set up our algorithm
    // to 'randomly' pick a sound 

    lastArrayPlayed = lastArrayPlayed > 0 ? 0 : 1;
    
    let ran = Math.floor(Math.random() * soundArrays[codes[2+lastArrayPlayed]].length);

    //sound arrays has two arrays in it so first we choose which array 
    //and then which sound from that array
    console.log("Playing dialogue: "+codes[2+lastArrayPlayed]+" "+ran);
    return soundArrays[codes[2+lastArrayPlayed]][ran];
    
}

function pickNewBuffer(){
    //logic to pick which buffer to select from
    let resp = lastArrayPlayed;
    
    let ran = Math.floor(Math.random() * soundArrays[codes[resp]].length);

    //sound arrays has two arrays in it so first we choose which array 
    //and then which sound from that array
    console.log("Playing buffer: "+codes[resp]+" "+ran);
    return soundArrays[codes[resp]][ran];
}

function playSound(sound){
    sound.play();
    soundIsPlaying = true;
}