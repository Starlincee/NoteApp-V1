const addTodoContainer = document.querySelector('#todoAdd');
const todoListContainer = document.querySelector('#todoList');
const firstCardBody = document.querySelectorAll('.card-body')[0];
const secondCardBody = document.querySelectorAll('.card-body')[1];
const todoList = document.querySelector('#todo-list');
const clearTodos = document.querySelector('#clear-todos');
const submitBtn = document.querySelector('#submit');
const todoListesi = document.querySelector('#todo-listesi');
const filter = document.querySelector('#filter');
const whatsapp = document.querySelector('#whatsapp');




const todoInput = document.querySelector('#todoInput');
const form = document.querySelector('#todo-form');

addEventListenerList();

function addEventListenerList(){
    form.addEventListener('submit',addTodo);
    clearTodos.addEventListener('click',deleteAllTodos);
    todoList.addEventListener('click',deleteTodoUI);
    todoList.addEventListener('click',completedItem);
    document.addEventListener('DOMContentLoaded',loadAllTodosToUI);
    filter.addEventListener('keyup',filterTodoList);
    document.addEventListener('click',showFilter);
    whatsapp.addEventListener('click',shareWhatsApp);
}

function showFilter(){
    let todos = getTodosFromStorage();
    //listede 4 den fazla eleman varsa filtre bölümünü göster
    if(todos.length < 5){
        filter.setAttribute('style','display: none');
    }
    else{
        filter.setAttribute('style','display: block');
    }
}

//Sayfa yüklenince itemların arayüze yüklenmesi
function loadAllTodosToUI(){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoToUI(todo);
    })
    counterItem();
    showFilter();
}

//Eleman ekleme
function addTodo(e){
    const newTodo = todoInput.value.trim();
    let todos = JSON.parse(localStorage.getItem('todos')); 

    if(newTodo === ""){
        showAlertBtn('danger','Alan boş bırakılamaz!');
    }

    else if(findItemInStorage(newTodo) == true){
        showAlertBtn('danger','Listede Zaten Var');
    }
   
    else{
        
        addTodoToUI(newTodo);
        addTodoToStogare(newTodo);
        showAlertBtn('success','Eklendi');  
        counterItem();//Eleman ekleyince Liste eleman sayısını güncelle
        showFilter();
    }

    e.preventDefault();
}

//Element oluşturma
function addTodoToUI(newTodo){
    //list item oluşturma
    const newLi = document.createElement('li');
    newLi.className = "list-group-item";
    newLi.textContent = newTodo;

    //a link oluşturma
    const newaRemove = document.createElement('a');
    newaRemove.href = "#";
    newaRemove.className = "pull-right"

    //i oluşturma
    const newiRemove = document.createElement('i');
    newiRemove.className = "fa fa-remove";

    //aCheck link oluşturma
    const newaCheck = document.createElement('a');
    newaCheck.href = "#";

    //iCheck oluşturma
    const newiCheck = document.createElement('i');
    newiCheck.className = "fa fa-check";

    newLi.prepend(newaCheck);
    newaCheck.appendChild(newiCheck);
    newLi.appendChild(newaRemove);
    newaRemove.appendChild(newiRemove);//son çocuk olarak ekleme
    todoList.insertBefore(newLi,todoList.childNodes[0]);//ilk çocuk olarak ekleme
    todoInput.value = "";
}

//Hazıfaya kaydetme (LOCALSTORAGE)
function addTodoToStogare(newTodo){
    let todos = getTodosFromStorage();

    todos.push(newTodo);
    localStorage.setItem('todos',JSON.stringify(todos));
}

//LocalStorage kontrol
function getTodosFromStorage(){
    let todos;

    if(localStorage.getItem('todos') === null){
        todos = [];
    }
    else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    return todos;
}

//Arayüzden item silme
function deleteTodoUI(e){
    if(e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlertBtnClear('info','Silindi!');
    }
    counterItem();//Eleman silince Liste eleman sayısını güncelle
}

//Tamamlanan görev
function completedItem(e){
    if(e.target.className === "fa fa-check"){
        
        const contentItem = e.target.parentElement.parentElement;
        contentItem.style.color = "gray";
        contentItem.style.textDecoration = "line-through";

        const check = contentItem.firstElementChild.firstElementChild;
        check.style.color = "gray";

    }
    counterItem();//Eleman silince Liste eleman sayısını güncelle
}

// localStorage item silme
function deleteTodoFromStorage(deleteTodo){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if(todo === deleteTodo){
            todos.splice(index,1);
        }
    });

    localStorage.setItem('todos',JSON.stringify(todos));
}

//Bütün taskları temizle
function deleteAllTodos(){
    if(todoList.firstElementChild === null){
        showAlertBtnClear('danger','Liste zaten boş!');
        clearTodos.style.backgroundColor = "rgb(220, 53, 64)";
        clearTodos.style.borderColor = "rgb(220, 53, 64)";
    }
    else{
        if(confirm("Hepsi silinsin mi?")){
            //todoList.innerHTML = ""; //todolistin tamamını siler. aşağıdakinden biraz daha yavaştır.
            while(todoList.firstElementChild != null){
                todoList.removeChild(todoList.firstElementChild);
            }
            localStorage.removeItem('todos');
            showAlertBtnClear('danger','Hepsi silindi!');
        }
    }
    counterItem(); //Listeyi temizleyince Liste eleman sayısını güncelle
}

//Alert fonksiyonu
function showAlertBtn(type,message){
    submitBtn.className = `btn btn-${type} mt-2 btn-block`;
    submitBtn.textContent = message;

    setTimeout(function(){
    submitBtn.className = `btn btn-primary mt-2 btn-block`;
    submitBtn.textContent = "Ekle";
    },2000);
    
}

function showAlertBtnClear(type,message){
    clearTodos.className = `btn btn-${type} btn-block`;
    clearTodos.value = message;

    setTimeout(function(){
    clearTodos.className = "btn btn-danger btn-block";
    clearTodos.value = "Hepsini Temizle";
    },2000);
    
}

//Listedekilerin Sayısı
function counterItem(){
    if(localStorage.getItem('todos') === null){
        const zeroItem = document.createElement('span');
        zeroItem.className = "badge badge-primary badge-pill pull-right";
        zeroItem.innerHTML = "Liste boş!"
            if(todoListesi.firstElementChild != null){
                todoListesi.firstElementChild.remove();
            }
        todoListesi.appendChild(zeroItem);
        setTimeout(function(){ //Liste boş uyarısı 2sn sonra silind
            zeroItem.innerHTML = "0";
        },2000);
    }
    else{
        let arrayItems = JSON.parse(localStorage.getItem('todos'));
        const counterUI = document.createElement('span');
        counterUI.className = "badge badge-primary badge-pill pull-right";
        counterUI.textContent = arrayItems.length;
        
        if(todoListesi.firstElementChild === null){
            todoListesi.appendChild(counterUI);
        }
        else{
            todoListesi.children[0].innerHTML = arrayItems.length;
        }
    }
}

//Eklemek istediğin eleman listede var mı?
function findItemInStorage(inputTodo){
    todos = getTodosFromStorage();

    for(let i =0; i < todos.length ; i++){
        if(inputTodo.toLowerCase() === todos[i].toLowerCase()){
            return true; //varsa true dönecek.
        }
    }
}

//Listedeki elemanlar arasında filtreleme işlemi
function filterTodoList(e){
    const filterText = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll('.list-group-item');

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();

        if(text.indexOf(filterText) === -1){
            //bulunamadı.
            listItem.setAttribute("style","display: none !important");
        }
        else{
            //bulundu.
            listItem.setAttribute("style","display: block !important");
        }
    })
    
}

//SHARE WHATSAPP
function shareWhatsApp(){
    todos = getTodosFromStorage();
    let shareText = "";
    let j = 0;
    for(i=0;i<todos.length;i++){
        
        j++;
        shareText += (j + "."+ todos[i] + " ");

    }
    
    whatsapp.href ="https://api.whatsapp.com/send?text="+"Yapılacaklar Listesi : " + shareText;

}