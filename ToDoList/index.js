const d = document,
  $form = d.querySelector('.dataForm'),
  $dataForm = d.querySelector('.dataForm'),
  $searchForm = d.querySelector('.searchForm'),
  $editForm = d.querySelector('.editForm'),
  endPoint = "http://localhost:3000/tasks",
  $template = d.querySelector(".showData").content,
  $fragment = d.createDocumentFragment(),
  $table = d.querySelector(".tableData"),
  $taskBoard = d.querySelector(".taskBoard"),
  $taskCounter = d.querySelector(".taskCounter"),
  $tableContent =d.querySelector(".tableContent"),
  $searchBar = d.querySelector(".searchBar");
//Función para dibujar en el template los resultados de la consulta
function draw(json){
  json.forEach(element => {
    //mostrar datos
    if(element.status === "undone"){
      $template.querySelector(".taskRow").style.backgroundColor = "rgba(0, 128, 0, 0.2)";
      $template.querySelector(".done").removeAttribute("disabled", "disabled");
      $template.querySelector(".edit").removeAttribute("disabled", "disabled");
      $template.querySelector(".done").style.cursor = "pointer";
      $template.querySelector(".edit").style.cursor = "pointer";
    }else if(element.status === "done"){
     
      $template.querySelector(".taskRow").style.backgroundColor = "rgba(0, 0, 255, 0.2)";
      $template.querySelector(".done").setAttribute("disabled", "disabled");
      $template.querySelector(".edit").setAttribute("disabled", "disabled");

      $template.querySelector(".done").style.cursor = "default";
      $template.querySelector(".edit").style.cursor = "default";
    }
    $template.querySelector(".nameTask").textContent = element.name;
    $template.querySelector(".dateStart").textContent = element.dateStart;
    $template.querySelector(".dateEnd").textContent = element.dateEnd;
    //dataset a edit
    $template.querySelector(".edit").dataset.id = element.id;
    $template.querySelector(".edit").dataset.name = element.name;
    $template.querySelector(".edit").dataset.dateStart = element.dateStart;
    $template.querySelector(".edit").dataset.dateEnd = element.dateEnd;
    //dataset a delete
    $template.querySelector(".delete").dataset.id = element.id;
    //dataset a finalizar
    $template.querySelector(".done").dataset.id = element.id;
    $template.querySelector(".done").dataset.name = element.name;
    $template.querySelector(".done").dataset.dateStart = element.dateStart;
    $template.querySelector(".done").dataset.dateEnd = element.dateEnd;
    //copia de template e insercion a fragment
    let $clone = d.importNode($template,true);
    $fragment.appendChild($clone); 
  });
  $table.querySelector("tbody").appendChild($fragment);
}
//Función para obtener los datos de la db y dibujarlos
async function getData(){
  try{
    const response = await fetch(endPoint),
      json = await response.json();
    if(!response.ok) throw { status: response.status, message: response.statusText};
    draw(json);
  }catch (error){
    const myError = error.statusText || "Error al cargar los datos";
    console.log(myError);
  }
};
//Función que añade una tarea
async function insertItem(name, dateStart, dateEnd){
  try{
    const options = {
      method : "POST",
      headers : {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        name: name,
        dateStart: dateStart,
        dateEnd: dateEnd,
        status: "undone",
      }),
    },
      response = await fetch(endPoint, options),
      json = await response.json();
    if(!response.ok) throw { status: response.status, message: response.statusText};
    location.reload();
  }catch(error){
    const myError = error.statusText || "Error al cargar los datos";
    console.log(myError);
  }
}
//Función que elimina la tarea con el id dado
async function deleteData(idData){
  try{
    //almaceno json en localstorage
    const response1 = await fetch(endPoint+`/${idData}`),
      json1 = await response1.json();
    localStorage.setItem(localStorage.length, JSON.stringify(json1));
    //elimino tarea
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json; charset=utf-8 ',
      }
    },
      response2 = await fetch(endPoint+`/${idData}`, options),
      json2 = await response2.json();
    if(!response.ok) throw { status: response.status, message: response.statusText};
    location.reload();
  }catch(error){
    const myError = error.statusText || "Error al eliminar los datos";
    console.log(myError);
  }
}
//Función para finalizar una tarea
async function setStatusDone(idData, name, dateStart, dateEnd){
  try{
    const options = {
      method : "PUT",
      headers : {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        name: name,
        dateStart: dateStart,
        dateEnd: dateEnd,
        status: "done",
      })
    },  
      response = await fetch(endPoint+`/${idData}`, options),
      json = await response.json();
    if(!response.ok) throw { status: response.status, message: response.statusText};
  }catch(error){
    const myError = error.statusText || "Error al finalizar la tarea";
    console.log(myError);
  }
}
//Función para cambiar el formato de fecha para que sea aceptado por input type date
function formatDate (date){
  let positions = "";
  for(let i = 0; i < date.length; i++) {
    if(date.charAt(i) === "/"){
      positions += i;
    }
  }
  let day = date.slice(0, positions[0]),
    month = date.slice(parseInt(positions[0])+1, positions[1]),
    year = date.slice(parseInt(positions[1])+1);
  day.length == 1? day = 0+day :day;
  month.length == 1? month = 0+month :month;
  return `${year}-${month}-${day}`;
}
//Función para editar una tarea
async function editItem(idData, name, dateStart, dateEnd){
  try{
    const options = {
      method : "PUT",
      headers : {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        name: name,
        dateStart: dateStart,
        dateEnd: dateEnd,
        status: "undone",
      })
    },  
      response = await fetch(endPoint+`/${idData}`, options),
      json = await response.json();
    if(!response.ok) throw { status: response.status, message: response.statusText};
  }catch(error){
    const myError = error.statusText || "Error al editar la tarea";
    console.log(myError);
  }
}
//Función para contabilizar tareas y dibujar un gráfico
async function countTasks(){
  let counterDelete = localStorage.length;
  const counterDone = [],
    counterUndone = [];
  try{
    const response = await fetch(endPoint),
      json = await response.json();
    if(!response.ok) throw { status: response.status, message: response.statusText};
    json.forEach( element =>{
      if(element.status === "done"){
        counterDone.push(element);
      }else{
        counterUndone.push(element);
      }
    });
  }catch (error){
    const myError = error.statusText || "Error  al contabilizar las tareas.";
    console.log(myError);
  }
  new Chart($taskCounter, {
    type: 'doughnut',
    data: {
      labels: ['Pendientes', 'Realizadas', 'Eliminadas'],
      datasets: [{
        label: 'Resumen de las tareas',
        data: [counterUndone.length, counterDone.length, counterDelete],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    }
  });
}
//Llamo a la función para mostrar datos
d.addEventListener('DOMContentLoaded', getData);
//Eventos en submit
d.addEventListener("submit", async (e) =>{
    //inserta una nueva tarea en la db
    if(e.target.send){
      e.preventDefault();
      const name = e.target.name.value,
        dateStart = new Date().toLocaleDateString(),
        dateEnd = new Date(e.target.dateEnd.value).toLocaleDateString();
      insertItem(name, dateStart, dateEnd);
    }
    //edita una tarea de la db
    if(e.target.sendEdit){
      e.preventDefault();
      const id = e.target.idEdit.value,
        name = e.target.nameEdit.value,
        dateStart = new Date(e.target.dateStartEdit.value).toLocaleDateString(),
        dateEnd = new Date(e.target.dateEndEdit.value).toLocaleDateString();
      editItem(id, name, dateStart, dateEnd);
    } 
});
//Eventos Click
d.addEventListener("click", async (e) =>{
  //aparece el formulario al hacer click en editar
  if(e.target.matches(".edit")){
    e.preventDefault();
    window.getComputedStyle($editForm).display === "none" ? $editForm.style.display = "block" : $editForm.style.display = "none";
    d.querySelector("#idEdit").value = e.target.dataset.id;
    d.querySelector("#nameEdit").value = e.target.dataset.name;
    d.querySelector("#dateStartEdit").value = formatDate(e.target.dataset.dateStart);
    d.querySelector("#dateEndEdit").value = formatDate(e.target.dataset.dateEnd);
  }
  //se elimina la tarea al hacer click en eliminar
  if(e.target.matches(".delete")){
    e.preventDefault();
    deleteData(e.target.dataset.id);
  }
  //finaliza la tarea al hacer click
  if(e.target.matches(".done")){
    e.preventDefault();
    setStatusDone(e.target.dataset.id, e.target.dataset.name, e.target.dataset.dateStart, e.target.dataset.dateEnd);
  }
  //mostrar formulario para añadir tarea
  if(e.target.matches("#newTask")){
    e.preventDefault();
    window.getComputedStyle($dataForm).display === "none" ? $dataForm.style.display = "block" : $dataForm.style.display = "none";
    //ocultar elementos no relacionados
    window.getComputedStyle($editForm).display === "block" ? $editForm.style.display = "none" : "";
    window.getComputedStyle($taskBoard).display === "block" ? $taskBoard.style.display = "none" : "";
    window.getComputedStyle($searchForm).display === "block" ? $searchForm.style.display = "none" : "";
    window.getComputedStyle($taskCounter).display === "block" ? $taskCounter.style.display = "none" : "";
  }
  //mostrar formulario de búsqueda
  if(e.target.matches("#searchTask")){
    e.preventDefault();
    window.getComputedStyle($searchForm).display === "none" ? $searchForm.style.display = "block" : $searchForm.style.display = "none";
    $tableContent.innerHTML = "";
    window.getComputedStyle($taskBoard).display === "none" ? $taskBoard.style.display = "block" : "";
    //ocultar elementos no relacionados
    window.getComputedStyle($editForm).display === "block" ? $editForm.style.display = "none" : "";
    window.getComputedStyle($dataForm).display === "block" ? $dataForm.style.display = "none" : "";
    window.getComputedStyle($taskCounter).display === "block" ? $taskCounter.style.display = "none" : "";
    $searchBar.addEventListener("focus", () => $searchBar.value = "");
  }
  //motrar gráficos
  if(e.target.matches("#showGraphic")){
    e.preventDefault();
    window.getComputedStyle($taskCounter).display === "none" ? $taskCounter.style.display = "block" : $taskCounter.style.display = "none";
    //ejecuto la función cuando estoy en el apartado gráfico
    if(window.getComputedStyle($taskCounter).display != "none") countTasks();
    //ocultar elementos no relacionados
    window.getComputedStyle($editForm).display === "block" ? $editForm.style.display = "none" : "";
    window.getComputedStyle($taskBoard).display === "block" ? $taskBoard.style.display = "none" : "";
    window.getComputedStyle($searchForm).display === "block" ? $searchForm.style.display = "none" : "";
    window.getComputedStyle($dataForm).display === "block" ? $dataForm.style.display = "none" : "";
  }
})
//Evento búsqueda
const results = [];
d.addEventListener("keyup", async (e) => {
  let $searchBar = d.querySelector(".searchBar").value;
  //poner limpieza de campo
  // d.querySelector(".searchBar").addEventListener("click", async (e) => e.value = "");
  try{
    const response = await fetch(endPoint),
      json = await response.json();
    if(!response.ok) throw { status: response.status, message: response.statusText};
    $tableContent.innerHTML = "";
    results.length = 0;
    json.forEach( element =>{
      if(element.name.includes($searchBar) || element.dateStart.includes($searchBar) || element.dateEnd.includes($searchBar)){
        results.push(element);
      }
    });
    draw(results);
  }catch (error){
    const myError = error.statusText || "Error al cargar los datos";
    console.log(myError);
  }
})