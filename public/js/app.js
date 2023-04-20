let allBoxes = document.querySelectorAll('.box');
let nameInput = document.querySelector('#name');
let nameButton = document.querySelector('.name-button');

let clickedArr = [];
let elementArr = [];
let foundElementsArr = [];
let time = 0;

let clickedType = null; // initially, no element has been clicked

let clickFunction = () => {
  allBoxes.forEach((box) => {
    box.addEventListener('click' , (e) => {
      const isoValue = e.target.dataset.iso;

      // check if the user has already clicked an element of the same type
      if (clickedType === e.target.tagName) {
        toastr.warning("You can only click on 1 flag and 1 question.", {timeOut: 2000});
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
            if (element.classList.contains('question-wrapper')) {
              element.classList.add('reset-border');
            }
            element.style.border= "none";
          });
        }
        // Reset the clicked array and the element array
        clickedArr = [];
        elementArr = [];

        // update clickedType
        clickedType = null;
      }
    });
  });
};


let winLogic = (element, element2) => {
    element.style.border = "none";
    element2.style.border = "none";
    element.style.filter = "blur(8px)";
    element2.style.filter = "blur(8px)";
    // makes it unclickable
    element.style.pointerEvents = "none";
    element2.style.pointerEvents = "none";

    // if all elements are found
    if(foundElementsArr.length == 10) {
        $("#my-modal").modal("show");
        nameButton.addEventListener("click", () => {
            if(nameInput.value === "") {
                toastr.warning("Please fill in your name.", "Warning", {timeOut: 3000});
            } else {
                let obj = {
                    name: nameInput.value,
                    time: 1
                }
                
                // put it in the database
                fetch("api/score", {
                    method: "POST",
                    body: JSON.stringify(obj),
                    headers: {
                        "Content-Type": "application/json"
                    }
                    })
                    .then(response =>{
                        toastr.success("Score has been saved.", "Success", {timeOut: 3000});
                        $()
                    })
                    .catch(error => console.error(error))
            }
        })
    }
}

    clickFunction();