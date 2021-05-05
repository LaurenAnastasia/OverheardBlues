const myCanvas = { width: 600, height: 600};
const backgroundColor = [230,220,190];
const soundArrays = [[[null],[null]],[[null],[null]]];
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

function preload(){
    let mode = 0;
    let codes = ["FL","FR","DL","DR"];
    let i = 0;
    while(true){
        try {
            console.log("Loading: " + codes[i]+"_"+i+".mp3");
            soundArrays[i/2][i%2].push(new Howl({ src : [`sounds/${codes[i]+"_"+i}.mp3`]}));
            i = i + 1;
            if (i >= 100){
                console.log("Kill switch");
                break;
            }
        } catch(err) {
            i = 0;
            console.log(codes[i] + " is done. Moving to next");
            mode = mode + 1;
            if (mode == 4){
                break;
            }
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

    //const randomArray = Math.floor(Math.random() * numArrays);
    const nextArray = lastArrayPlayed > 0 ? 0 : 1;
    lastArrayPlayed = lastArrayPlayed > 0 ? 0 : 1;
    console.log(lastArrayPlayed);
    //this is the same as saying
    //let nextArray;
    // if(lasArrayPlayed > 0){
    //    nextArray = 0;
    //     } else {
    //         nextArray = 1
    //     }
    //}
    let ran = Math.floor(Math.random() * soundArrays[1][nextArray].length);

    //sound arrays has two arrays in it so first we choose which array 
    //and then which sound from that array
    console.log("Playing dialogue: 1 "+resp+" "+ran);
    return soundArrays[1][nextArray][ran];
    
}

function pickNewBuffer(){
    //logic to pick which buffer to select from
    let resp = lastArrayPlayed > 0 ? 0 : 1;
    
    let ran = Math.floor(Math.random() * soundArrays[0][resp].length);

    //sound arrays has two arrays in it so first we choose which array 
    //and then which sound from that array
    console.log("Playing buffer: 0 "+resp+" "+ran);
    return soundArrays[0][resp][ran];
}

function playSound(sound){
    sound.play();
    soundIsPlaying = true;
}