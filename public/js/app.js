let allBoxes = document.querySelectorAll('.box');
let allFlags = document.querySelectorAll('.flag');
let nameInput = document.querySelector('#name');
let nameButton = document.querySelector('.name-button');
let timer = document.querySelector('.timer');

let clickedArr = [];
let elementArr = [];
let foundElementsArr = [];
let time = 5;
let timerInterval;
let gameStarted = false;
let buttonClickedOnce = false;

let clickedType = null; // initially, no element has been clicked

const clickFunction = () => {
  allBoxes.forEach((box) => {
    box.addEventListener('click' , (e) => {
      // only sets timer once.
      if (gameStarted === false) {
        timerFunction();
      }
      gameStarted = true;
      const isoValue = e.target.dataset.iso;

      // check if the user has already clicked an element of the same type
      if (clickedType === e.target.tagName) {
        toastr.warning("You can only click on 1 flag and 1 question.", {timeOut: 2000});
        box.
        return;
      }

      // Highlight the clicked element
      e.target.style.border = "3px dotted red";

      if (elementArr.includes(e.target)) {
        // If the element has already been clicked, remove it from the clicked array and the element array
        const index = elementArr.indexOf(e.target);
        clickedArr.splice(index, 1);
        elementArr.splice(index, 1);

        // update clickedType
        clickedType = null;
        return;
      }

      // Add the ISO value and the clicked element to their respective arrays
      clickedArr.push(isoValue);
      elementArr.push(e.target);

      // update clickedType
      clickedType = e.target.tagName;

      // removes this class so it can be red again
      e.target.classList.remove('reset-border');

      if (clickedArr.length === 2 && elementArr.length == 2) {
        // If they have the same data attribute, call winlogic
        if (elementArr[0].dataset.iso === elementArr[1].dataset.iso) {
          toastr.success("Match", {timeOut: 2000});
          foundElementsArr.push(elementArr[0], elementArr[1]);
          winLogic(elementArr[0], elementArr[1]);
        } else {
          toastr.warning("No match", {timeOut: 2000});
          elementArr.forEach((element) => {
            element.classList.add('reset-border');
            element.style.border= "none";
          });
        }
        // Reset the clicked array and the element array
        clickedArr = [];
        elementArr = [];

        clickedType = null;
      }
    });
  });
};


const winLogic = (element, element2) => {
    element.style.border = "none";
    element2.style.border = "none";
    element.style.filter = "blur(8px)";
    element2.style.filter = "blur(8px)";
    // makes it unclickable
    element.style.pointerEvents = "none";
    element2.style.pointerEvents = "none";

    // if all elements are found
    if(foundElementsArr.length == 10) {
        clearInterval(timerInterval);
        $("#my-modal").modal("show");
        nameButton.addEventListener("click", () => {
            if(nameInput.value === "") {
                toastr.warning("Please fill in your name.", "Warning", {timeOut: 3000});
            } else {
                let obj = {
                    name: nameInput.value,
                    time
                }
                // put it in the database
                if(!buttonClickedOnce) {
                  buttonClickedOnce = true;
                  fetch("api/score", {
                    method: "POST",
                    body: JSON.stringify(obj),
                    headers: {
                        "Content-Type": "application/json"
                    }
                    })
                    .then(response =>{
                        toastr.success("Score has been saved.", "Success", {timeOut: 3000});
                        $("#my-modal").modal("hide");
                        resetGame();
                    })
                    .catch(error => console.error(error))
                } 
            }
        })
    }
}

// reset game method after winning
const resetGame = () => {
  time = 30;
  timer.textContent = '30s';
  getLeaderboard();
  gameStarted = false;
  buttonClickedOnce = false;
  
  reshuffle(".right-container");
  reshuffle(".left-container");

  foundElementsArr.forEach((element) => {
    element.style.filter = "blur(0px)";
    element.style.pointerEvents = "auto";  
    element.style.border = "5px solid black";
  })

  allFlags.forEach((el) => {
    el.style.border = "5px solid black"
  })

  foundElementsArr = [];
}

const reshuffle = (container) => {
    container = document.querySelector(container);
    const elements = Array.from(container.children);

    while (container.lastChild) {
      container.lastChild.remove();
    }

    elements.sort(() => Math.random() - 0.5);
    elements.forEach((element) => container.appendChild(element));
  };

const getLeaderboard = async () => {
  const response = await fetch("/api/leaderboard");
  const html = await response.text();
  document.querySelector('.leaderboard-container').innerHTML = html;
}

let timerFunction = () => {
  timerInterval = setInterval(() => {
    time--;
    timer.textContent = `${time}s`;
    if(time === -1) {
      clearInterval(timerInterval);
      toastr.warning("Restart game.", "Time's up", {timeOut: 3000});
      resetGame();
    }
  }, 1000);
}

clickFunction();