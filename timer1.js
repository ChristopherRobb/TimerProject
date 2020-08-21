const Timer = class {

    constructor(input, button, minLabel, secLabel) {
        // Define your constructors.
        this.input = input;         // getElementById("first-input");
        this.button = button;       // getElementsByClass("first");
        this.minLabel = minLabel;   // getElementById("first-min");
        this.secLabel = secLabel;   // getElementById("first-sec");

        // Initialize all click flagging variables
        this.click = {
            set: true,
            reset: false,
            down: false,
            up: false,
            pause: 0,
        }

        // Initialize time counter.
        this.countTime = 0

        this.minutes = 0;
        this.totalTime = 0;
        //this.my_int = 0;
        this.valString = '';

        // Bind your functions so you can use "this" keyword relative to object definitions.
        //this.get_input = this.get_input.bind(this);
        this.set_state = this.set_state.bind(this);
        //this.set_timer = this.set_timer.bind(this);
        this.countdown_timer = this.countdown_timer.bind(this);
        this.countup_timer = this.countup_timer.bind(this);
        this.reset_timer = this.reset_timer.bind(this);
        //this.pause_timer = this.pause_timer.bind(this);

        this.display_timer = this.display_timer.bind(this);
        this.pad = this.pad.bind(this);
        this.change_button = this.change_button.bind(this);
    }

    // Declare all methods being used

    // This function retrieves the value of the input and converts it to an integer.
    /*get_input() {
        this.minutes = parseInt(this.input.value);
        if (this.input_condition) {
            alert("Ass");
        } else {
            return;
        }
    }*/

    // This disables or enables a button so that the user doesn't mess with the timer at the wrong instance.
    set_state(state0, state1, state2, state3, state4) {
        this.button[0].disabled = state0;
        this.button[1].disabled = state1;
        this.button[2].disabled = state2;
        this.button[3].disabled = state3;
        this.button[4].disabled = state4;
    }

    // Triggered when someone clicks on set, countup, countdown, or reset button. 
    set_timer(flag) {

        // If this is the FIRST time this function is entered in the counting session, this will happen...
        if (this.click.set == true && !(this.input_condition)) {

            this.minutes = parseInt(this.input.value);
            if (this.minutes <= 0 || this.minutes > 30 || Number.isInteger(this.minutes) != true) {
                alert("Must be an integer number between 0 and 30.");
            } else {
                this.set_state(true, true, false, false, false);
                this.change_button();
                this.totalTime = this.minutes * 60;
                this.secLabel.innerHTML = "00";
                this.minLabel.innerHTML = this.minutes;

                this.click.set = false;
            }
        }

        // If the argument entered is 'countup', the timer will be ascending
        if (flag == 'countup' && this.click.down == false) {
            console.log("entered");
            this.set_state(true, false, true, true, false);
            this.change_button();
            this.button[2].style.backgroundColor = 'rgb(255, 105, 105)';
            this.countup_timer(this.totalTime);
        }

        // If the argument entered is 'countdown', the timer will be descending
        if (flag == 'countdown' && this.click.up == false) { 
            console.log("entered");
            this.set_state(true, false, true, true, false);
            this.change_button();
            this.button[3].style.backgroundColor = 'rgb(255, 105, 105)';
            this.countTime = this.totalTime;
            this.countdown_timer();
        }

        // If the argument entered is 'reset', the timer will be stopped & reset
        if (flag == 'reset') {
            this.click.reset = true;
            this.reset_timer(this.minLabel, this.secLabel);
        }

    }

    //Function for ascending timer.
    countup_timer(tt) {
        console.log("entered");
        console.log("counter: " + this.countTime, " total time: ", tt);
        this.click.up = true;
    
        this.my_int = setInterval(() => { 
            if (this.countTime < tt) {
                console.log("entered tt");
                this.countTime++;
                this.display_timer(this.minLabel, this.secLabel, this.countTime);
                console.log(this.countTime);
            }
        }, 1000);
    }

    // Function for descending timer.
    countdown_timer() {
        this.click.down = true;
        
        this.my_int = setInterval(() => { 
            if (this.countTime > 0) {
                this.countTime--;
                this.display_timer(this.minLabel, this.secLabel, this.countTime);
                console.log(this.countTime);
            }
        }, 1000);
    }

    // Function for resetting the timer.
    reset_timer(m, s) {
        s.innerHTML = this.pad(0);
        m.innerHTML = this.pad(parseInt(0));
        clearInterval(this.my_int);
        this.click.up, this.click.down = false;
        this.set_state(false, true, true, true, true);

        this.change_button();
        this.click.reset = true;
        this.pause_timer();

        // Set back to initialization values.
        this.input.value = "";
        this.click.set = true;
        this.countTime = 0;
        this.click.pause = 0;
        this.click.reset = false;
        this.click.down = false;
        this.click.up = false;
    }

    // If the user wants to pause or resume the timer, this function is called.
    pause_timer() {
        this.click.pause++;

        // Accounts for the instance where the button is left paused and it says "resume",
        // but the user presses reset while it's paused.
        if (this.click.reset == true) {
            this.button[1].innerHTML = "PAUSE";
            return;
        }

        // If this.click.pause is NOT an even number, the timer is paused.
        if (this.click.pause % 2 != 0) {
            clearInterval(this.my_int);
            this.button[1].innerHTML = "RESUME";
        }

        // If this.click.pause IS an even number, the timer is resumed according to
        // whether it was initialized as ascending or descending.
        else {
            this.button[1].innerHTML = "PAUSE";
            
            // If prior to pressing pause, the timer was descending.... this happens.
            if (this.click.down = true && this.click.up == false) {
                this.click.set = false;
                this.countdown_timer();
            }

            // If prior to pressing pause, the timer was ascending.... this happens.
            if (this.click.up = true && this.click.down == false) {
                this.click.set = false;
                this.countup_timer(this.totalTime);
            }
        }
    }

    // This displays the timer to show minutes and seconds, instead of 
    // just the total time in seconds.
    display_timer(m, s, t) {
        s.innerHTML = this.pad(t%60);
        m.innerHTML = this.pad(parseInt(t/60));

        if (t < 0) {
            this.reset_timer();
        }


    }

    // This formats the timer to accurately display minutes and seconds.
    pad(val) {
        this.valString = val + "";
        if(this.valString.length < 2) {
            return "0" + this.valString;
        } else {
            return this.valString;
        }
    }

    // Changes the button's color depending on whether it's disabled or not.
    change_button() {
        if (this.button[3].disabled == true) {
            this.button[3].style.backgroundColor = '#666';
        } 
        
        if (this.button[3].disabled == false) {
            this.button[3].style.backgroundColor = 'steelblue';
        } 
        
        if (this.button[2].disabled == true) {
            this.button[2].style.backgroundColor = '#666';
        } 
        
        if (this.button[2].disabled == false) {
            this.button[2].style.backgroundColor = 'steelblue';
        }

    }

}

// ** In order to assign the element IDs and classes to the object, it has to be done 
// ** during the onload event.
//
// ** This function also makes the buttons disabled for all the objects except for set
function setTimersState() {
    // First timer ID's and classes
    var firstInput = document.getElementById('first-input');
    const firstButtons = document.getElementsByClassName('first');
    const firstMinLabel = document.getElementById('first-min');
    const firstSecLabel = document.getElementById('first-sec');

    // Second timer ID's and classes
    var secondInput = document.getElementById('second-input');
    const secondButtons = document.getElementsByClassName('second');
    const secondMinLabel = document.getElementById('second-min');
    const secondSecLabel = document.getElementById('second-sec');

    // Third timer ID's and classes
    var thirdInput = document.getElementById('third-input');
    const thirdButtons = document.getElementsByClassName('third');
    const thirdMinLabel = document.getElementById('third-min');
    const thirdSecLabel = document.getElementById('third-sec');

    firstTimer = new Timer(firstInput, firstButtons, firstMinLabel, firstSecLabel);
    secondTimer = new Timer(secondInput, secondButtons, secondMinLabel, secondSecLabel);
    thirdTimer = new Timer(thirdInput, thirdButtons, thirdMinLabel, thirdSecLabel);

    firstTimer.input.value = "";
    secondTimer.input.value = "";
    thirdTimer.input.value = "";

    firstTimer.set_state(false, true, true, true, true);
    secondTimer.set_state(false, true, true, true, true);
    thirdTimer.set_state(false, true, true, true, true);
}