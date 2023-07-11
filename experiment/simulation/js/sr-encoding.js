var reverseMessage = [];
var message = [];
let arr1 = [0, 0, 0];
let i = 0;

function generateMessage() {
    for (var i = 0; i < 4; i++) {
        message[i] = Math.floor(Math.random() * 2);

        reverseMessage[3 - i] = message[i];
    }

    document.getElementById("message-bits").innerHTML = "<b>" + reverseMessage[3] + reverseMessage[2] + reverseMessage[1] + reverseMessage[0] + "</b>";
    document.getElementById("inp-message-bit").innerHTML = reverseMessage[0];

    return false;
}


function getNextArr() {
    // Calculate next array
    let arrnext = [(reverseMessage[i] + arr1[2]) % 2, (reverseMessage[i] + arr1[0] + arr1[2]) % 2, arr1[1]];

    return arrnext;
}

function checkAnswer() {

    const input1 = document.getElementById("p1").value;
    const input2 = document.getElementById("p2").value;
    const input3 = document.getElementById("p3").value;
    const nextBit = document.getElementById("inp-message-bit");
    const obs = document.getElementById("observations");

    if (input1.length == 0 || input2.length == 0 || input3.length == 0) {
        obs.style.color = "black";
        obs.innerHTML = "Enter all the bits.";
    }

    else if (input1.length > 1 || input2.length > 1 || input3.length > 1) {
        obs.style.color = "black";
        obs.innerHTML = "Enter values from the set {0, 1}.";
    }

    else if (input1 > 1 || input1 < 0 || input2 > 1 || input2 < 0 || input3 > 1 || input3 < 0) {
        obs.style.color = "black";
        obs.innerHTML = "Enter values from the set {0, 1}.";
    }

    else {
        let arrnext = getNextArr();
        if (input1 == arrnext[0] && input2 == arrnext[1] && input3 == arrnext[2]) {
            document.getElementById("shift-reg-1").innerHTML = input1;
            document.getElementById("shift-reg-2").innerHTML = input2;
            document.getElementById("shift-reg-3").innerHTML = input3;

            document.getElementById("form1").reset();

            if (i == 3) {
                obs.innerHTML = "<b>Correct Answer!!!</b>" + "<br> You have successfully completed the encoding. Now enter the codeword.";
                obs.style.color = "green";
                nextBit.innerHTML = "";

                finalCodeword();
            }

            else {
                let j = i + 2;
                nextBit.innerHTML = reverseMessage[i + 1];
                obs.innerHTML = "<b>Correct Answer!!!</b>" + "<br> Now fill the values of shift " + j;
                obs.style.color = "green";


            }

            if (i < 3) {
                arr1 = arrnext;
                i++;
                getNextArr(); // Move to next element in message array
            }
        }

        else {

            if (obs.innerHTML == "<b>Wrong Answer :(</b>") {
                obs.innerHTML = "<b>Wrong Again :(</b>";
                obs.style.color = "red";
                return;
            }

            else {
                obs.innerHTML = "<b>Wrong Answer :(</b>";
                obs.style.color = "red";
                return;
            }
        }
    }
}


function finalCodeword() {
    document.getElementById("p1").style.display = "none";
    document.getElementById("p2").style.display = "none";
    document.getElementById("p3").style.display = "none";


    document.getElementById("form2").reset();
    document.getElementById("codeword").style.display = "block";
    document.getElementById("submit1").style.display = "none";

}

function verifyCodeword() {

    const c1 = document.getElementById("c1").value;
    const c2 = document.getElementById("c2").value;
    const c3 = document.getElementById("c3").value;
    const c4 = document.getElementById("c4").value;
    const c5 = document.getElementById("c5").value;
    const c6 = document.getElementById("c6").value;
    const c7 = document.getElementById("c7").value;
    const obs = document.getElementById("observations");

    let arrnext = getNextArr();

    if (c1.length == 0 || c2.length == 0 || c3.length == 0 || c4.length == 0
        || c5.length == 0 || c6.length == 0 || c7.length == 0) {
        obs.style.color = "black";
        obs.innerHTML = "Enter all the bits.";
    }

    else if (c1.length > 1 || c2.length > 1 || c3.length > 1 || c4.length > 1
        || c5.length > 1 || c6.length > 1 || c7.length > 1) {
        obs.style.color = "black";
        obs.innerHTML = "Enter values from the set {0, 1}.";
    }


    else if (c1 > 1 || c1 < 0 || c2 > 1 || c2 < 0 || c3 > 1 || c3 < 0
        || c4 > 1 || c4 < 0 || c5 > 1 || c5 < 0 || c6 > 1 || c6 < 0 || c7 > 1 || c7 < 0) {
        obs.style.color = "black";
        obs.innerHTML = "Enter values from the set {0, 1}.";
    }

    else {

        if (c1 == arrnext[0] && c2 == arrnext[1] && c3 == arrnext[2] && c4 == message[0]
            && c5 == message[1] && c6 == message[2] && c7 == message[3]) {
            obs.innerHTML = "<b>Correct Answer!!!</b>";
            obs.style.color = "green";
        }
        else {
            if (obs.innerHTML == "<b>Wrong Answer :(</b>") {
                obs.innerHTML = "<b>Wrong Again :(</b>";
                obs.style.color = "red";
                return;
            }

            else {
                obs.innerHTML = "<b>Wrong Answer :(</b>";
                obs.style.color = "red";
                return;
            }
        }
    }
}

function initial() {
    document.getElementById("submit1").style.display = "block";
    document.getElementById("codeword").style.display = "none";


    reverseMessage = [];
    message = [];
    arr1 = [0, 0, 0];
    i = 0;

    generateMessage();

    document.getElementById("p1").style.display = "block";
    document.getElementById("p2").style.display = "block";
    document.getElementById("p3").style.display = "block";

    document.getElementById("observations").innerHTML = "";

    document.getElementById("shift-reg-1").innerHTML="0";
    document.getElementById("shift-reg-2").innerHTML="0";
    document.getElementById("shift-reg-3").innerHTML="0";


}