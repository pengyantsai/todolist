let add = document.querySelector("form button");
let section = document.querySelector("section");
add.addEventListener("click", e =>{
    //prvent form from being summitted
    e.preventDefault();

    //get the input value
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate  = form.children[2].value;
    if(todoText === "" || todoMonth ==="" || todoDate === ""){
        alert("Please enter some thing");
        return;
    }

    //create a todo
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("P");
    text.classList.add("todo-text");
    text.innerHTML = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerHTML = todoMonth + " / " + todoDate ;
    todo.appendChild(text);
    todo.appendChild(time);
    

    //creat check and trash can
    let completebutton = document.createElement("button");
    completebutton.classList.add("complete");
    completebutton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completebutton.addEventListener("click", e =>{
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
    })



    let trashbutton = document.createElement("button");
    trashbutton.classList.add("trash");
    trashbutton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashbutton.addEventListener("click", e =>{
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend",() =>{
            //remove from localStorage
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item,index) =>{
                if(item.todoText == text){
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            })
            todoItem.remove();
        })
        todoItem.style.animation = "scaleDown 0.3s forwards";
    })
    todo.appendChild(completebutton);
    todo.appendChild(trashbutton);
    
    todo.style.animation = "scaleUp 0.3s forwards";


    //create a object
    let myTodo = {
        todoText :todoText,
        todoMonth :todoMonth,
        todoDate :todoDate
    };

    //store data into local storage
    let myList = localStorage.getItem("list");
    if(myList == null){
        localStorage.setItem("list",JSON.stringify([]));
    }else{
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list",JSON.stringify(myListArray));
    }

    console.log(JSON.parse(localStorage.getItem("list")));


    form.children[0].value = "";//clear input
    section.appendChild(todo);
});

loadData();

function loadData(){
    let myList = localStorage.getItem("list");
    if(myList != null){
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item => {
            //create a todo
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText = item.todoText;
            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = item.todoMonth + " / " + item.todoDate;
            todo.appendChild(text);
            todo.appendChild(time);
            //creat check and trash can
            let completebutton = document.createElement("button");
            completebutton.classList.add("complete");
            completebutton.innerHTML = '<i class="fa-solid fa-check"></i>';
            completebutton.addEventListener("click", e =>{
            let todoItem = e.target.parentElement;
            todoItem.classList.toggle("done");
            })



            let trashbutton = document.createElement("button");
            trashbutton.classList.add("trash");
            trashbutton.innerHTML = '<i class="fa-solid fa-trash"></i>';
            trashbutton.addEventListener("click", e =>{
                let todoItem = e.target.parentElement;
                todoItem.addEventListener("animationend",() =>{
                    //remove from localStorage
                    let text = todoItem.children[0].innerText;
                    let myListArray = JSON.parse(localStorage.getItem("list"));
                    myListArray.forEach((item,index) =>{
                        if(item.todoText == text){
                            myListArray.splice(index, 1);
                            localStorage.setItem("list", JSON.stringify(myListArray));
                        }
                    })
                    todoItem.remove();
                })
                todoItem.style.animation = "scaleDown 0.3s forwards";
            })

            todo.appendChild(completebutton);
            todo.appendChild(trashbutton);

            section.appendChild(todo);
        });
    }
}




function mergeTime(arr1,arr2){
    let result = [];
    let i = 0;
    let j = 0;
    while (i < arr1.length && j < arr2.length){
        if(Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)){
            result.push(arr2[j]);
            j++;
        }else if(Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)){
            result.push(arr1[i]);
            i++;
        }else if(Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)){
            if(Number(arr1[i].todoDate) > Number(arr2[j].todoDate)){
                result.push(arr2[j]);
                j++;
            }else{
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while (i < arr1.length){
        result.push(arr1[i]);
        i++;
    }

    while(j < arr2.length){
        result.push(arr2[j]);
        j++;
    }
    return result;
}

function mergeSort(arr){
    if(arr.length == 1){
        return arr;
    }else{
        let middle = Math.floor(arr.length / 2);
        let left = arr.slice(0, middle);
        let right = arr.slice(middle,arr.length);
        return mergeTime(mergeSort(left),mergeSort(right));
    }
}


let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click",()=>{
    //sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));
    //remove data
    let len = section.children.length;
    for(let i=0;i<len;i++){
        section.children[0].remove();
    }

    // load data
    loadData();
})
