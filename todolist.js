if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', readyToProcess)
} else {
    readyToProcess()
}

var toDoItemTextList = "";
function readyToProcess(){
    parseLocalStorageToHTML();
    var todoInputElem = document.querySelector(".todo_input");
    todoInputElem.addEventListener("change",(event)=>{
        createToDoItemElement(todoInputElem.value);
    })

    addListenerForCheckBox();
    addListenersForLabel();
    addListenersForAllActiveCompletedButtons();

    document.querySelectorAll(".clear-completed-container > button").forEach((button)=>{
        button.addEventListener("click",(event)=>{
            console.log('clear all dom items and local storage');
            document.querySelectorAll(".todo-item-container > input[item-completed=true]").forEach((input)=>{
                input.parentElement.remove();
            });
            updateToDoItemCount();
            upsertLocalStorage();
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
    todoItemInput.setAttribute("item-completed", false);

    todoItemContainer.appendChild(todoItemInput);
    var todoItemLabel = document.createElement("label");
    todoItemLabel.setAttribute("for", "todo-item");
    //todoItemLabel.setAttribute("contenteditable","true");
    todoItemLabel.innerText = toDoItemText;
    todoItemContainer.appendChild(todoItemLabel);
    // console.log(todoItemContainer);

    var toDoItemsContainer = document.querySelector(".todo_container");
    toDoItemsContainer.appendChild(todoItemContainer);
    if(toDoItemTextList == "") toDoItemTextList = toDoItemText;
    toDoItemTextList = toDoItemTextList + "," + toDoItemText;
    addListenerForCheckBox();
    //addListenersForLabel();
    updateToDoItemCount();
    document.querySelector(".btn-border").click();
    upsertLocalStorage();
}


function clearInputText(){
    document.querySelector(".todo_input").value = null;
}

function upsertLocalStorage(){
    window.localStorage.setItem("todos",document.querySelector("body").innerHTML);
}

function addListenerForCheckBox(){
    document.querySelectorAll(".todo-item-container > input").forEach((item)=>{
        item.addEventListener("change",(event)=>{
            var checkbox = event.target;
            if (checkbox.checked) {
                item.setAttribute("item-completed", true);
                item.nextSibling.classList.add("completed-todo");
            }
            else {
                item.setAttribute("item-completed", false);
                item.nextSibling.classList.remove("completed-todo");
            }
            document.querySelector(".btn-border").click();
            updateToDoItemCount();
            upsertLocalStorage();
        })
    });
}


function parseLocalStorageToHTML(){
    var localStorageVal = localStorage.getItem("todos");
    if(localStorageVal == null || localStorageVal == "") return;
    if (typeof DOMParser === 'function') {
        //console.log('support is there')
		var parser = new DOMParser();
		var doc = parser.parseFromString(localStorageVal, 'text/html');
		//console.log(doc.body.innerHTML);
        document.querySelector("body").innerHTML = doc.body.innerHTML;
	}else{
        // Otherwise, create div and append HTML
        //console.log('else');
        document.querySelector("body").innerHTML = localStorageVal;
    }
    maintainCheckBoxState();
    updateToDoItemCount();
}

function maintainCheckBoxState(){
    document.querySelectorAll("input[item-completed=true]").forEach((item)=>{
        item.checked = true;
    });
}

function updateToDoItemCount(){
    var itemCount = document.querySelectorAll("input[item-completed=false]").length;
    var itemContainerCount = document.querySelectorAll(".todo-item-container").length;
    if(itemCount == 0){
        document.querySelectorAll('.todo-item-actions-container > p')[0].innerText = itemCount + " item left";
        if(itemContainerCount == 0) document.querySelector('.todo-item-actions-container').classList.add("hide");
    }else{
        document.querySelector('.todo-item-actions-container').classList.remove("hide");
        document.querySelectorAll('.todo-item-actions-container > p')[0].innerText = itemCount + " " + (itemCount > 1 ? "items" : "item") + " left";
    }
    
}

function addListenersForLabel(){
    document.querySelectorAll(".todo-item-container > label").forEach((label)=>{
        label.addEventListener("click",(event)=>{
            event.preventDefault();
        })
        
        label.addEventListener("dblclick",(event)=>{
            label.setAttribute("contenteditable","true");
        })

        label.addEventListener("change",(event)=>{
            console.log('cjamhe');
        })
    });
}

function addListenersForAllActiveCompletedButtons(){
    document.querySelectorAll(".all-active-completed-container > button").forEach((button)=>{
        button.addEventListener("click",(event)=>{
            console.log('button clicked');
            console.log(button.innerText);
            switch(button.innerText){
                case "All":
                    document.querySelectorAll(".todo-item-container > input").forEach((input)=>{
                        input.parentElement.classList.remove("hide");
                    });
                    document.querySelectorAll(".all-active-completed-container > button").forEach((btn)=>{
                        btn.classList.remove("btn-border");
                    });
                    button.classList.add("btn-border");
                    break;
                case "Active":
                    document.querySelectorAll(".todo-item-container > input[item-completed=true]").forEach((input)=>{
                        input.parentElement.classList.add("hide");
                    });
                    document.querySelectorAll(".todo-item-container > input[item-completed=false]").forEach((input)=>{
                        input.parentElement.classList.remove("hide");
                    });
                    document.querySelectorAll(".all-active-completed-container > button").forEach((btn)=>{
                        btn.classList.remove("btn-border");
                    });
                    button.classList.add("btn-border");
                    break;
                case "Completed":
                    document.querySelectorAll(".todo-item-container > input[item-completed=false]").forEach((input)=>{
                        input.parentElement.classList.add("hide");
                    });
                    document.querySelectorAll(".todo-item-container > input[item-completed=true]").forEach((input)=>{
                        input.parentElement.classList.remove("hide");
                    });
                    document.querySelectorAll(".all-active-completed-container > button").forEach((btn)=>{
                        btn.classList.remove("btn-border");
                    });
                    button.classList.add("btn-border");
                    break;
            }
            upsertLocalStorage();
        })
    });
}