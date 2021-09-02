refreshTodoItems();
initSettings();

function getCheckMark(clicked, name){
    if(clicked){
        return '<i class="far fa-check-circle" onclick="itemClicked(\'' + name + '\')"></i>';
    } else {
        return '<i class="far fa-circle" onclick="itemClicked(\'' + name + '\')"></i>';
    }
}

function refreshTodoItems(){
    let todoItems = {'Tasks':[]};
    if(getCookie('todoItems') != ""){
        todoItems = JSON.parse(getCookie('todoItems'));
    }
    document.getElementById('todo-items').innerHTML = "";
    for(let item of todoItems['Tasks']){
        let newItem = document.createElement('div');

        newItem.classList.add('todo-item');
        newItem.title = 'Erstellt: ' + item['created'] + ' Erledigt: ' + item['done'];
        if(item['checked']){
            newItem.innerHTML = '<i class="fas fa-trash" onclick="itemDelete(\'' + item['task'] + '\')"></i>';
            newItem.innerHTML += '<p class="todo-item-name">' + item['task'] + '</p>';
            newItem.innerHTML += getCheckMark(true, item['task']);
        } else {
            newItem.innerHTML += '<p class="todo-item-name">' + item['task'] + '</p>';
            newItem.innerHTML += getCheckMark(false, item['task']);
        }

        document.getElementById('todo-items').append(newItem);
    }
    
    todoItems = document.getElementsByClassName('todo-item');
    
    for(let item of todoItems){
        item.style.width = parseInt(getComputedStyle(item).width) - 20 + "px";
    }
}



function itemClicked(item){
    let items = document.getElementsByClassName('todo-item');
    let bCheck = false;
    let tdItems = JSON.parse(getCookie('todoItems'));
    for(let i of tdItems['Tasks']){
        if(i['task'] === item){
            bCheck = !i['checked'];
            i['checked'] = bCheck;
            if(bCheck){
                if(JSON.parse(getCookie('settings'))['autoDelete']){
                    itemDelete(i['task']);
                    return;
                }
                i['done'] = new Date().toLocaleString();
            } else {
                i['done'] = '';
            }
        }
    }
    
    setCookie('todoItems', JSON.stringify(tdItems), 365);
    refreshTodoItems();
}

function itemAdd(){
    let itemName = prompt('Task name:');
    let items = getCookie('todoItems');
    if(items == ""){
        items = {'Tasks':[]};
    }  else {
        items = JSON.parse(items);
    }
    items['Tasks'].push({'task': itemName , 'checked': false, 'created': new Date().toLocaleString(), 'done': ''});
    setCookie('todoItems', JSON.stringify(items), 365);

    refreshTodoItems();
}

function itemDelete(item){
    let tdItems = JSON.parse(getCookie('todoItems'));

    let index = tdItems['Tasks'].findIndex(function(it, i){
        return it.task === item
    });
    delete tdItems['Tasks'].splice(index, 1);
    setCookie('todoItems', JSON.stringify(tdItems), 365);
    refreshTodoItems();
}

function initSettings(){
    let settings = {'autoDelete': false};
    if(getCookie('settings') != ""){
        settings = JSON.parse(getCookie('settings'));
    }
    document.getElementById("cb-auto-delete").checked = settings['autoDelete'];

    setCookie('settings', JSON.stringify(settings), 365);
}

function checkSettings(){
    let settings = JSON.parse(getCookie('settings'));
    settings['autoDelete'] = document.getElementById("cb-auto-delete").checked;

    setCookie('settings', JSON.stringify(settings), 365);
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

