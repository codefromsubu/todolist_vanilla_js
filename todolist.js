if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', readyToProcess)
} else {
    readyToProcess()
}
var toDoItemTextList = "";
function readyToProcess(){
    initToDoListFromLocalStorage();
    var todoInputElem = document.querySelector(".todo_input");
    todoInputElem.addEventListener("change",(event)=>{
        createToDoItemElement(todoInputElem.value);
    })

    document.querySelectorAll(".all-active-completed-container > button").forEach((button)=>{
        button.addEventListener("click",(event)=>{
            console.log('button clicked');
        })
    });

    document.querySelectorAll(".clear-completed-container > button").forEach((button)=>{
        button.addEventListener("click",(event)=>{
            console.log('clear all dom items and local storage');
        })
    });
}

function createToDoItemElement(toDoItemText){
    clearInputText();
    var todoItemContainer = document.createElement("div");
    todoItemContainer.classList.add("todo-item-container");
    var todoItemInput = document.createElement("input");
    todoItemInput.setAttribute("type", "checkbox");
    todoItemInput.setAttribute("id", "todo-item");
    todoItemInput.setAttribute("name", "todo-item");

    todoItemContainer.appendChild(todoItemInput);
    var todoItemLabel = document.createElement("label");
    todoItemLabel.setAttribute("for", "todo-item");
    todoItemLabel.innerText = toDoItemText;
    todoItemContainer.appendChild(todoItemLabel);
    // console.log(todoItemContainer);

    var toDoItemsContainer = document.querySelector(".todo_container");
    toDoItemsContainer.appendChild(todoItemContainer);
    if(toDoItemTextList == "") toDoItemTextList = toDoItemText;
    toDoItemTextList = toDoItemTextList + "," + toDoItemText;
    localStorage.setItem("todolist_list",toDoItemTextList);
}


function clearInputText(){
    document.querySelector(".todo_input").value = null;
}

function initToDoListFromLocalStorage(){
    toDoItemTextList = localStorage.getItem("todolist_list");
    if(toDoItemTextList == "" || toDoItemTextList == null) return;
    toDoItemTextListAsArray = toDoItemTextList.split(",");
    toDoItemTextListAsArray.forEach(item => {
        //createToDoItemElement(item);
    });
}