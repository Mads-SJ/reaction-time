const body = document.querySelector("body");
const bolt = document.querySelector(".bolt");


let currentState = 0;
const colors = ["hsl(0, 90%, 55%)", "hsl(120, 80%, 45%)", "hsl(200, 80%, 60%)"];
const states = ["<div class='container clickable'><button class='trans-btn'><i class='fas fa-ellipsis-h dots'></i></button><div class='text-container'><h1 class='header'>Wait for Green</h1></div></div>", 
                "<div class='container clickable'><button class='trans-btn'><i class='fas fa-ellipsis-h dots'></i></button><div class='text-container'><h1 class='header'>Click now!</h1></div></div>",
                "<div class='container'><button class='trans-btn'><i class='far fa-clock clock''></i></button><h1 class='header'></h1><div class='btn-container'><button class='btn' onClick='retry()'>Retry</button><button class='btn submit-btn'>Submit</button></div><button class='btn highscore-btn'>Highscores</button><div id='modal' class='modal'><div class='modal-content'></div></div></div>"];

function changeState() {
    body.innerHTML = states[currentState];
    document.body.style.backgroundColor = colors[currentState];
    currentState++;
}

// Fetches scores from the API
async function getData() {
    const res = await fetch("http://localhost:3000/scores");
    const data = await res.json();
    console.log(data);
    return data;
}

function loadModals(result) {
    // Load initial modal elements
    var modal = document.getElementById("modal");
    var modalContent = document.querySelector(".modal-content");
    var submitModalBtn = document.querySelector(".submit-btn");
    var highscoreModalBtn = document.querySelector(".highscore-btn");
    

    // Loads all submitModal components
    submitModalBtn.onclick = function() {
        modalContent.innerHTML = "<form><label for='name'>Name: </label><input id='inputField'></input></form><p class='result-value'></p><button class='final-submit-btn'>Submit</button>";

        var inputField = document.getElementById("inputField");
        var resultValue = document.querySelector(".result-value");
        var submitBtn = document.querySelector(".final-submit-btn");

        resultValue.innerText = "Score: " + result + "ms";
        modal.style.display = "block";

        submitBtn.onclick = async function() {
            const name = inputField.value;
    
            if (name !== "") {
                modal.style.display = "none";
                submitModalBtn.style.display = "none";
    
                const scoreObject = JSON.stringify({
                    name: name,
                    score: result
                });
    
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: scoreObject
                }
    
                const res = await fetch("http://localhost:3000/scores", options);
                const jsonRes = await res.json();
                console.log(jsonRes);
            }
        }
      }

      // Loads all HighscoreModal components
      highscoreModalBtn.onclick = async function() {
          const scores = await getData();
          var htmlResult = "";
          scores.slice(0, 19).forEach(object => {
            htmlResult += `<li>${object.name}: ${object.score}</li>`; 
          });
          modalContent.innerHTML = `<ol>${htmlResult}</ol>`;
          modal.style.display = "block";
      }
      
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
}

function measureTime() {
    const container = document.querySelector(".clickable");
    var startTime, endTime;

    container.addEventListener("click", () => {
        endTime = new Date();
         const result = endTime - startTime; //in ms

        changeState();
        const header = document.querySelector(".header");
        header.innerText = result + "ms";
        loadModals(result);
    });

    startTime = new Date();
};

// TODO: implement this function. Use flag somehow.
/* function checkPrematureClick( clicked) {
    const container = document.querySelector(".clickable");

    container.addEventListener("click", () => {
        body.innerHTML = "<div class='container clickable'><button class='trans-btn'><i class='fas fa-exclamation-triangle dots'></i></button><h1 class='header'>Trigger happy?</h1></div>";
        return true;
    });
}; */

function beginTest() {
    const random = (Math.random() * 5 + 2) * 1000;
    window.setTimeout(changeState, random);
    window.setTimeout(measureTime, random);
};

function retry() {
    currentState = 0;
    changeState();
    beginTest();
};

function app() {
    bolt.addEventListener("click", () => {
        changeState();
        beginTest();
    });
}

app();