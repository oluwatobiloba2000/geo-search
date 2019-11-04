
const input = document.getElementById('search__bar');
const inputforMap = document.getElementById('search__bar')
const button = document.getElementById('search__btn');
const autocomplete = new google.maps.places.Autocomplete(inputforMap);

function openErrorModal(open, close){
    if(open){
        let modal =  document.querySelector('.error__loader');
    modal.style.display = 'block';
    return setTimeout(()=>{
        modal.style.opacity = '1';
    }, 1000)
    }else if(close){
        let modal =  document.querySelector('.error__loader');
        modal.style.opacity = '0';
        return setTimeout(()=>{
            modal.style.display = 'none';
        }, 500)
    }
}
function loader(open, close){
    if(open){
        document.querySelector('.sk-chase').style.display = 'block';
     }else if(close){
        document.querySelector('.sk-chase').style.display = 'none';
     }
 }
 function error(data){
     openErrorModal("open");
          let modal =  document.querySelector('.alert__container')
     const errorDiv = document.createElement('div');
     errorDiv.innerHTML = ` <p>${data} <i class="fas fa-exclamation-triangle"></i></p>`
     errorDiv.classList.add('error');
     return modal.append(errorDiv);
}

function clearErrorDivs(){
    let modal =  document.querySelector('.alert__container');
    console.log(modal.childNodes)
    if(modal.childNodes.length !== 0){
        let i;
        for(i = 0; i < modal.childNodes.length; i++){
           modal.removeChild(modal.childNodes[i]);
        }
        setTimeout(()=>{
            for(i = 0; i < modal.childNodes.length; i++){
                modal.removeChild(modal.childNodes[i]);
             }
            // modal.removeChild(modal.childNodes[0])
            console.log(modal.childNodes)
        }, 900)
      }
}

 function okay(data){
    openErrorModal("open");
    let modal =  document.querySelector('.alert__container')
    const okayDiv = document.createElement('div');
    okayDiv.innerHTML = ` <p>${data} <i class="fas fa-check"></i></p>`
    okayDiv.classList.add('okay');
    return modal.append(okayDiv);
}
function waiting(data){
    openErrorModal("open");
    let modal =  document.querySelector('.alert__container')
    const waitingDiv = document.createElement('div');
    waitingDiv.innerHTML = ` <p>${data} <i class="far fa-dot-circle"></i></p>`
    waitingDiv.classList.add('waiting');
    return modal.append(waitingDiv);
}

function searchButtonLoader(add__loader, remove__loader){
    let button = document.querySelector('.search__btn');
    if(add__loader){
      document.querySelector('.close__loader__btn').style.display = 'none';
      button.setAttribute('disabled', '');
      button.innerHTML= `Searching <i class="fa fa-spinner fa-spin"></i>`;
      button.classList.add('search__btn__loading');
    }else if(remove__loader){
        document.querySelector('.close__loader__btn').style.display = 'block';
        button.removeAttribute('disabled', '');
        button.innerHTML= `Search`;
        button.classList.remove('search__btn__loading');
    }

}

function getQuery (){
    let trimmedValue = input.value.trim()
    if(trimmedValue == ''){
        loader('', 'close')
        document.querySelector('.close__loader__btn').style.display = 'block';
        document.querySelector('.close__loader__btn').addEventListener('click', ()=>{
            const placesearchQueryFromLocalstorage = localStorage.getItem('place-search-query');
            const placesearchQuery = JSON.parse(placesearchQueryFromLocalstorage);
            if(placesearchQuery){
              return  openErrorModal('', 'close')
            }else{
                return error('No recent search has been made');
            }
        })
        return error("search input cannot be empty")
    }
    console.log('search query', trimmedValue)
    localStorage.setItem('user-search-query', JSON.stringify(trimmedValue))
    searchButtonLoader('add__loader');
    // button.setAttribute('disabled', '');
    fetchData()
    loader("open")
//    window.location.reload()
}

button.addEventListener('click', () => {
    getQuery()
}, )
document.getElementById('search__bar').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
     getQuery()
    }
})

// window.onload =
fetchData()
 function fetchData() {
    openErrorModal('open')
    loader('open');
    //     // Instantiate a map and platform object:
    var platform = new H.service.Platform({
        'apikey': 'y4kWoJqXs6bP5lqGsrtpelecYoxSGzJHRFYH9MQjT14'
    });
    setTimeout(()=>{
  
    const userSearchQueryFromLocalstorage = localStorage.getItem('user-search-query');
    const usersearchQuery = JSON.parse(userSearchQueryFromLocalstorage);

    console.log(usersearchQuery)
    if(usersearchQuery == null || usersearchQuery == undefined || usersearchQuery == ''){
        return  okay(`Welcome to Geo search <br> To get started, type in an address eg.<strong>[cityname],[state],[country]</strong> and you will see the current weather
        forcast, map view of the location.
        <br> To search click on the search button or press 'ENTER' key on your keyboard
        <br /> This app was made by Anani Oluwatobiloba`);
    }

        input.value = usersearchQuery
        waiting('processing your request, you will see your address and location soon');
 
        
        //   Retrieve the target element for the map:
        var targetElement = document.getElementById('map');

        //   Get default map types from the platform object:
      var defaultLayers = platform.createDefaultLayers();
      
      // Create the parameters for the geocoding request:
    var geocodingParams = {
        searchText: `${usersearchQuery}`
    };
    
    // Define a callback function to process the geocoding response:
    var onResult = function(result) {
        console.log(result.Response.View)
    if(result.Response.View.length === 0){
        loader('', 'close')
        searchButtonLoader('', 'remove__loader');
        // button.removeAttribute('disabled', '');
        return error('Sorry!, Location not found, The issue might be due to incorrect address <br /> please make sure the address is valid');
    }
  var locations = result.Response.View[0].Result,
  position
    // marker;
  // Add a marker for each location found
  for (i = 0;  i < locations.length; i++) {
      position = {
          lat: locations[i].Location.DisplayPosition.Latitude,
          lng: locations[i].Location.DisplayPosition.Longitude
        };
        getPlacePhotoReference(result.Response.View[0].Result[0].Location.Address.Label)
        console.log(result.Response.View[0].Result[0].Location.Address.PostalCode, result.Response.View[0].Result[0].Location.Address.Label)
        let postalCode = result.Response.View[0].Result[0].Location.Address.PostalCode;
        if(postalCode === undefined){
            document.getElementById('postal__code').innerText = `Postal code: unavaliable`
        }else if(postalCode){
            document.getElementById('postal__code').innerText = `Postal code: ${postalCode}`
        }
        // )
        //   Instantiate the map:
        //   var map = new H.Map(
            //       document.getElementById('map'),
            //       defaultLayers.vector.normal.map,
            //       {
                //           zoom: 10,
                //         center: { lat: position.lat, lng: position.lng }
                //     }, console.log('show mapp'));
                //     marker = new H.map.Marker(position);
                //     map.addObject(marker);
                if(position.lat == undefined || position == null){
                    
                    return setTimeout(()=>{loader('', 'close'); searchButtonLoader('', 'remove__loader'); error('No Data for this location, please try another address')}, 2000)
                }else{
                    initialize(position.lat, position.lng)
                    // setTimeout(()=>{
                    //     waiting('Loading Weather data ....');
                    // }, 1000)
                    getWeather(position.lat, position.lng)
                    localStorage.setItem('place-search-query', JSON.stringify(result.Response.View[0].Result[0].Location.Address.Label))
                    const placesearchQueryFromLocalstorage = localStorage.getItem('place-search-query');
                    const placesearchQuery = JSON.parse(placesearchQueryFromLocalstorage);
                    document.querySelector('.city__name').innerText = `${placesearchQuery}`
                }
            }
};
// Get an instance of the geocoding service:
    var geocoder = platform.getGeocodingService();
    // Call the geocode method with the geocoding parameters,
    // the callback and an error callback function (called if a
    // communication error occurs):
    geocoder.geocode(geocodingParams, onResult, function (e) {
        setTimeout(()=>{
            loader('', 'close')
            searchButtonLoader('', 'remove__loader');
            error('Error!, This might occur due to network issues, Please check your network and try again')
        }, 2000)
        console(e);
    });

    function initialize(lat, lng) {
        // setTimeout(()=>{
        //     waiting('Loading Map Data ....');
        // }, 1000)
        // console.log('MAP IS LOADING ...............')
        var mapProp = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapProp);
        var markerCenter = new google.maps.LatLng(lat, lng);
        // console.log(lat, lng)
        if (lat == undefined || lng == undefined) {
            searchButtonLoader('', 'remove__loader');
            return error('Sorry!, No data for this location')
        }
        var marker = new google.maps.Marker({
            position: markerCenter,
            animation: google.maps.Animation.BOUNCE
        });
        marker.setMap(map);
       okay('Map loaded sucessfully ..............')
  
    }
    //settimeout close
       }, 2000)
}







function getWeather(lat, lon) {
    // setTimeout(()=>{
    //     waiting('Loading Weather Data');
    // }, 1000)

    console.log('LOADING WEATHER DATA ...............')
    var key = '820fbadeb36dd9e325e2ede7deca57b5';
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`)
        .then(function (resp) {
            return resp.json() // Convert data to json
        })
        .then(function (data) {
            console.log(data);
            document.querySelector('.spinner').style.display = 'none'
            document.querySelector('.city__name__h1').style.display = 'block';
            document.getElementById('map').style.display = 'block';
            searchButtonLoader('', 'remove__loader');
            document.querySelector('.share__wrapper').style.display = `flex`;
            document.querySelector('.view__map__mobile').style.display = 'block';
                 setTimeout(()=>{
                   clearErrorDivs()
                  }, 2500)
            okay('Weather Data is Avaliable ..');
            setTimeout(()=>{
                openErrorModal('', 'close');
            }, 2000)
            console.log('WEATHER DATA IS READY ):   ..........')
            const celciusTemperature = Math.round(parseFloat(data.main.temp)-273.15);
            const fahrenheit = Math.round(((parseFloat(data.main.temp)-273.15)*1.8)+32);
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;
            const description = data.weather[0].description;
            const icon = data.weather[0].icon;
            const date = new Date().toDateString();
            document.querySelector('.weather__icon').innerHTML = `<img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">`;
            document.querySelector('.today').innerText = `Today`
            document.querySelector('.today__date__words').innerHTML = `${date}`;
            document.querySelector('.temp__scale__btn').innerHTML = `<div class="tooltip">
                                                                      <button class="cel-to-active active" id="Celsius">°C</button>
                                                                        <span class="tooltiptext">Convert Temperature to celcius</span>
                                                                     </div>
                                                                     <div class="tooltip">
                                                                     <button class="fah-to-active not-active" id="Fahrenheit">°F</button>
                                                                     <span class="tooltiptext">Convert Temperature to Fahrenheit</span>
                                                                     </div>`
            // document.querySelector('#Fahrenheit').innerText = ``
            // document.querySelector('#Celsius').innerText = ``
            document.querySelector('.weather__degree').innerHTML = `${celciusTemperature} °C`;
            document.querySelector('.weather__description__details').innerHTML = `${description}`;
            document.querySelector('.pressure__details').innerHTML = `<img src="./UI/img/gauge.svg" alt="pressure icon">Pressure &nbsp;<span>${pressure} hpa</span>`;
            document.querySelector('.humidity__details').innerHTML = `<img src="./UI/img/humidity.svg" alt="">Humidity &nbsp;<span>${humidity}%</span>`;

            convertTemp(celciusTemperature, fahrenheit)
        })
        .catch(function (e) {
            // catch any errors
            setTimeout(()=>{
                loader('', 'close');
                searchButtonLoader('', 'remove__loader');
                error('ERROR!,Weather Data Failed to load due to network issues, Please try again!')
            }, 2000)
            // alert('ERROR FROM WEATHER DATA, DUE TO NETWORK ISSUES PLEASE TRY AGAIN')
            console.log(e)
        });
}

function getPlacePhotoReference(placeName){
    let key = 'AIzaSyCfV-yKThJMx3FJcPrYzinBiaZtCIulIfA';
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${placeName}&key=${key}`; // site that doesn’t send Access-Control-*
        fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
        .then(response => response.json())
        .then(contents => console.log(contents) /*getPlacesImages(contents.results[0].photos[0].photo_reference, placeName)*/)
        .catch((e) => console.log("Can’t access " + url + " response. Blocked by browser?", 'error', e))
        // getPlacesImages(contents.results[0].photos[0].photo_reference, placeName)
}

 function  getPlacesImages(photoRefrence, placeName){
    let key = 'AIzaSyCfV-yKThJMx3FJcPrYzinBiaZtCIulIfA';
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    // https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=YOUR_API_KEY
   fetch(`${proxyurl}https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRefrence}&key=${key}`)
       .then(res => res.json())
        .then(response =>   document.querySelector('.location__images').innerHTML=`<img class="image__location" src="${response}" title="picture of ${placeName}" alt="piture of ${placeName}">` )
        .catch(e => e)
    }
            // function createPhotoMarker(place) {
            //     var photos = place.photos;
            //     if (!photos) {
            //       return;
            //     }

function convertTemp(cel, fah){
    document.querySelector('#Fahrenheit').addEventListener('click', ()=>{
        document.querySelector('.weather__degree').innerHTML = `${fah}°F`;
        document.querySelector('.fah-to-active').classList.add('active');
        document.querySelector('.fah-to-active').classList.remove('not-active');
        document.querySelector('.cel-to-active').classList.remove('active');
    })
    document.querySelector('#Celsius').addEventListener('click', ()=>{
        document.querySelector('.weather__degree').innerHTML = `${cel}°C`;
        document.querySelector('.cel-to-active').classList.add('active');
        document.querySelector('.fah-to-active').classList.add('not-active');
        document.querySelector('.fah-to-active').classList.remove('active');
    })
}
//    google.maps.event.addDomListener(window, 'load', initialize);

// input.addEventListener('keyup', ()=>{
//     document.querySelector('.city__name').innerText = `${input.value}`
// })