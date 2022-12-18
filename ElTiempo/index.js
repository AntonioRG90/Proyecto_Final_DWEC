/**
 * - Saber el tiempo que hay en una localidad (nos registramos en api.openweathermap.org) nos un token, cogemos nuestra localidad
 *  y obtenemos el json de los datos metereologicos de nuestra localidad. Copiar y pegar.
 * - mostrar en una tarjeta toda la información
 * - Crear un nav con un menu que tenga (Consulta por localidad) cuando clickemos aparece un formulario de busqueda con validación
 * - El estado del tiempo lo indica con palabras, tenemos que crear un array que tenga img de sol, nublado.... y los asociamos a la palabra.
 * - Hacemos lo mismo con el viento.
 */
// cambiar description por main , consulta apiweather
//MENU
document.getElementById("searchByCity").addEventListener("click", () =>{
  const $menu = document.getElementById("hamburguerMenu");
  window.getComputedStyle($menu).display === "none" ? $menu.style.display = "block" : $menu.style.display = "none";
});
//Check si el nombre de la ciudad cumple las condiciones dadas
function checkCityName(city){
  const regExp = /^[A-z, ,\ñ]+[^\@]$/i;
  return regExp.test(city);
}
//conexión api coordenadas
async function cityData(city){
  try{
    const response = await fetch(city);
    if(response.ok){
      const jsonResponse = await response.json();
      return jsonResponse;
    }
  }catch(e){
      console.log(e.message);
  }
};
//Conexión api tiempo
async function weatherData(url){
  try{
    const response = await fetch(url);
    if(response.ok){
      const jsonResponse = await response.json();
      return jsonResponse;
    }
  }catch(e){
    console.log(e.message);
  }
};
//ARRAY IMAGENES - DESCRIPCION
const weatherMap = [
  {key:"Clear", value:"01d@2x.png"},
  {key: "few clouds",value:"02d@2x.png"},
  {key: "scattered clouds",value:"03d@2x.png"},
  {key: "broken clouds",value:"04d@2x.png"},
  {key: "overcast clouds" ,value:"04d@2x.png"},
  {key: "Drizzle",value:"09d@2x.png"},
  {key: "Rain",value:"10d@2x.png"},
  {key: "Thunderstorm",value:"11d@2x.png"},
  {key: "Snow",value:"13d@2x.png"},
  {key: "Mist",value:"50d@2x.png"},
];
const windArrows = [];
const windDirection = [];

const $template = document.getElementById("template-weather").content;
const $main = document.getElementById("main");
const $fragment = document.createDocumentFragment();


//Resuelvo promesa e inserto datos
document.getElementById("city").addEventListener("keypress", (e) =>{
  if(e.key === "Enter"){
    if(document.getElementById("card1")){
      document.getElementById("card1").remove();
    }
    let city = document.getElementById("city").value;
    if(checkCityName(city)){
    
      const cityUrl =`https://api.openweathermap.org/geo/1.0/direct?q=${city},ES&limit=1&appid=80fec4e0cb0181d285e699cb7337eacf`;

      cityData(cityUrl).then( cityObj => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${cityObj[0].lat}&lon=${cityObj[0].lon}&appid=80fec4e0cb0181d285e699cb7337eacf&units=metric`;

        weatherData(apiUrl).then( objWeather => {
          console.log(objWeather);
          let icon = "./images/";
          weatherMap.forEach((element) =>{
            if(objWeather.weather[0].main === "Clouds"){
              if(objWeather.weather[0].description === element.key) icon += element.value;
            }
            if(objWeather.weather[0].main === element.key)icon += element.value;
          });
          $template.querySelector(".cityName").textContent = city;
          $template.querySelector(".status").setAttribute("src", icon);
          $template.querySelector(".status").setAttribute("title", objWeather.weather[0].description);
          $template.querySelector(".tMax").querySelector("span").textContent = (Math.round(objWeather.main.temp_max));
          $template.querySelector(".tMin").querySelector("span").textContent = (Math.round(objWeather.main.temp_min));
      
          $template.querySelector(".windSpeed").querySelector("span").textContent = (Math.round(objWeather.wind.speed * 3.6));
          $template.querySelector(".pressure").querySelector("span").textContent = (objWeather.main.pressure);
      
          let $clone = document.importNode($template, true);
          $fragment.appendChild($clone);
          $main.appendChild($fragment);
            
        });
      });
    }else{
      alert("Ciudad Incorrecta");
    }
  } 
});


