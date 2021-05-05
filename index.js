const myCanvas = { width: 600, height: 600};
const backgroundColor = [230,220,190];
const soundArrays = {};
const FPS = 60; //fps
const interruptTimer = 10; //in seconds
//will control whether loop runs or not
let looping = false;
// a boolean variable to let us know if a sound is playing
let soundIsPlaying  = false;
let bufferIsPlaying = false;
//and a variable to store the actual sound playing, or the 
// representation of it so we can check if it's done playing yet.
let soundPlaying = null;
// we'll switch between 0 and 1 here, so we can pick which array to play from
let lastArrayPlayed = 1;
//a start and pause button because, you know, web audio wants user input
let button1, button2;
let resp = 1;
let respArrays = soundArrays;

//parallel arrays
const lims = [2,1,5,7];
const codes = ["FL","FR","DL","DR"];

function preload(){
    //2d array. First layer is for each code, second is for how many of that code
    for (i = 0; i < codes.length; i++){
        //initialize empty array for 2d dict
        soundArrays[codes[i]] = [];
        for (j = 0; j < lims[i]; j++){
            //some BULLSHIT loading. I hate Howl.
            let snd = new Howl({ src : [`sounds/${codes[i]+"_"+j}.mp3`]})
            soundArrays[codes[i]].push(snd);
        }
    }

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
        
        //debounce
        if(!bufferIsPlaying){

            //Random check for buffers :)))
            if (Math.floor(Math.random()*interruptTimer*FPS) == 1){

                //Select new buffer
                bufferPlaying = pickNewBuffer();
                playBuffer(bufferPlaying);

                //Ending sequence
                bufferPlaying.on('end', () => {
                    bufferPlaying = null,
                    bufferIsPlaying = false;
                });
            }
        }

        //debounce
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
      //logic to stop playing sounds add in future
    }
}

function playBuffer(sound){
    sound.play()
    bufferIsPlaying = true;
  }

  function playSound(sound){
      sound.play();
      soundIsPlaying = true;
  }

function startRoutine(){
    looping = true;
}

function pauseRoutine(){
    looping = false;
}


function pickNewSound(){
    //Basically just boolean not statement
    lastArrayPlayed = lastArrayPlayed > 0 ? 0 : 1;
    
    //Chaos for picking a random
    let ran = Math.floor(Math.random() * soundArrays[codes[2+lastArrayPlayed]].length);

    //Printing for debug then return index in SOUNDS.
    console.log("Playing dialogue: "+codes[2+lastArrayPlayed]+" "+ran);
    return soundArrays[codes[2+lastArrayPlayed]][ran];
    
}

function pickNewBuffer(){
    //Boolean not statement
    let resp = lastArrayPlayed > 0 ? 0 : 1;
    
    //Chaos for picking random
    let ran = Math.floor(Math.random() * soundArrays[codes[resp]].length);

    //Printing for debug then return index in BUFFER.
    console.log("Playing buffer: "+codes[resp]+" "+ran);
    return soundArrays[codes[resp]][ran];
}