const input = document.getElementById('search__bar');
const inputforMap = document.getElementById('search__bar')
const button = document.getElementById('search__btn');
const autocomplete = new google.maps.places.Autocomplete(inputforMap);


button.addEventListener('click', () => {  
    getQuery();
})

document.getElementById('search__bar').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        getQuery();
    }
})

function ModalActivityLog(open, close) {
    if (open) {
        let modal = document.querySelector('.error__loader');
        modal.style.display = 'block';
        return setTimeout(() => {
            modal.style.opacity = '1';
        }, 1000)
    } else if (close) {
        let modal = document.querySelector('.error__loader');
        modal.style.opacity = '0';
        return setTimeout(() => {
            modal.style.display = 'none';
        }, 500)
    }
}

function ActivityLogLoader(open, close) {
    if (open) {
        document.querySelector('.sk-chase').style.display = 'block';
    } else if (close) {
        document.querySelector('.sk-chase').style.display = 'none';
    }
}

function ErrorStatusLog(data) {
    ModalActivityLog("open");
    CheckIfLogsAreGreaterThan7()
    let modal = document.querySelector('.alert__container')
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = ` <p>${data} <i class="fas fa-exclamation-triangle"></i></p>`
    errorDiv.classList.add('error');
    return modal.append(errorDiv);
}

function CheckIfLogsAreGreaterThan7(){
    let modal = document.querySelector('.alert__container');
    if (modal.childNodes.length === 7) {
        modal.removeChild(modal.childNodes[0]);
    }
}

function OkayStatusLog(data) {
    ModalActivityLog("open");
    CheckIfLogsAreGreaterThan7()
    let modal = document.querySelector('.alert__container')
    const okayDiv = document.createElement('div');
    okayDiv.innerHTML = ` <p>${data} <i class="fas fa-check"></i></p>`
    okayDiv.classList.add('okay');
    return modal.append(okayDiv);
}

function WaitingStatusLog(data) {
    ModalActivityLog("open");
    CheckIfLogsAreGreaterThan7()
    let modal = document.querySelector('.alert__container')
    const waitingDiv = document.createElement('div');
    waitingDiv.innerHTML = ` <p>${data} <i class="far fa-dot-circle"></i></p>`
    waitingDiv.classList.add('waiting');
    return modal.append(waitingDiv);
}

function searchButtonLoader(add__loader, remove__loader) {
    let button = document.querySelector('.search__btn');
    if (add__loader) {
        document.querySelector('.close__loader__btn').style.display = 'none';
        button.setAttribute('disabled', '');
        button.innerHTML = `Searching <i class="fa fa-spinner fa-spin"></i>`;
        button.classList.add('search__btn__loading');
    } else if (remove__loader) {
        document.querySelector('.close__loader__btn').style.display = 'block';
        button.removeAttribute('disabled', '');
        button.innerHTML = `Search`;
        button.classList.remove('search__btn__loading');
    }
    
}

document.querySelector('.close__loader__btn').addEventListener('click', () => {
    const placesearchQueryFromLocalstorage = localStorage.getItem('place-search-query');
    const placesearchQuery = JSON.parse(placesearchQueryFromLocalstorage);
 if (placesearchQuery) {
        return ModalActivityLog('', 'close')
     }else if(placesearchQuery == null || placesearchQuery == undefined) {
                console.log(placesearchQuery);
                return ErrorStatusLog('No recent search has been made');
            }
})

function getQuery() {
    let userSearchQueryValue = input.value.trim()
    if (userSearchQueryValue == '') {
        ActivityLogLoader('', 'close')
        document.querySelector('.close__loader__btn').style.display = 'block';
        return ErrorStatusLog("search input cannot be empty");
    }
    localStorage.setItem('user-search-query', JSON.stringify(userSearchQueryValue))
    searchButtonLoader('add__loader');
    fetchData()
    ActivityLogLoader("open")
}

setTimeout(function(){
    fetchData();
}, 2000)

function fetchData() {
    ModalActivityLog('open')
    ActivityLogLoader('open');
    //     // Instantiate a map and platform object:
    var platform = new H.service.Platform({
        'apikey': 'y4kWoJqXs6bP5lqGsrtpelecYoxSGzJHRFYH9MQjT14'
    });
    setTimeout(() => {
        const userSearchQueryFromLocalstorage = localStorage.getItem('user-search-query');
        const usersearchQuery = JSON.parse(userSearchQueryFromLocalstorage);

        if (usersearchQuery == null || usersearchQuery == undefined || usersearchQuery == '') {
            ActivityLogLoader('', 'close')
            return OkayStatusLog(`Welcome to Geo search <br> To get started, type in an address eg.<strong>[cityname],[state],[country]</strong> and you will see the current weather
        forcast, map view of the location.
        <br> To search click on the search button or press 'ENTER' key on your keyboard <br />
        Please dont forget to leave a like [Just click on the like button when you see it, Thanks! <span class="smile__emoji">🙂</span>]
        <br /> This app was made by Anani Oluwatobiloba`);
        }

        input.value = usersearchQuery
        WaitingStatusLog('Processing your request...');

          // Create the parameters for the geocoding request:
        var geocodingParams = {
            searchText: `${usersearchQuery}`
        };

        // Define a callback function to process the geocoding response:
        var onResult = function (result) {
            if (result.Response.View.length === 0) {
                ActivityLogLoader('', 'close')
                searchButtonLoader('', 'remove__loader');
                // button.removeAttribute('disabled', '');
                return ErrorStatusLog('Sorry!, Location not found, The issue might be due to incorrect address <br /> please make sure the address is valid');
            }
            var locations = result.Response.View[0].Result,
                position
            // marker;
            // Add a marker for each location found
            for (i = 0; i < locations.length; i++) {
                position = {
                    lat: locations[i].Location.DisplayPosition.Latitude,
                    lng: locations[i].Location.DisplayPosition.Longitude
                };

                  getPlacePhotoReference(result.Response.View[0].Result[0].Location.Address.Label)

                let postalCode = result.Response.View[0].Result[0].Location.Address.PostalCode;
                  if (postalCode === undefined) {
                    document.getElementById('postal__code').innerText = `Postal code: unavaliable`
                  } else if (postalCode) {
                    document.getElementById('postal__code').innerText = `Postal code: ${postalCode}`
                  }

                if (position.lat == undefined || position == null) {
                    return setTimeout(() => {
                        ActivityLogLoader('', 'close');
                        searchButtonLoader('', 'remove__loader');
                        ErrorStatusLog('No Data for this location, please try another address')
                    }, 2000)
                } else {
                    LoadMap(position.lat, position.lng)
                    TODO:
                    // getWeather(position.lat, position.lng)
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
            setTimeout(() => {
                ActivityLogLoader('', 'close')
                searchButtonLoader('', 'remove__loader');
                ErrorStatusLog('Error!, This might occur due to network issues, Please check your network connection and try again');
            }, 2000)
            console(e);
        });

        function LoadMap(lat, lng) {
            let mapContainer = document.getElementById('map');
            // var mapProp = {
            //     center: new google.maps.LatLng(lat, lng),
            //     zoom: 9,
            //     mapTypeId: google.maps.MapTypeId.ROADMAP
            // };
            // var map = new google.maps.Map(document.getElementById("map"), mapProp);
            // var markerCenter = new google.maps.LatLng(lat, lng);
            // // console.log(lat, lng)
            // https://www.mapquestapi.com/staticmap/v5/map?key=H1snoR7HAMGka2pLiA1cDnQiU2mVEc5x&locations=47.603229,-122.33028&size=900,500@2x
            fetch(`https://www.mapquestapi.com/staticmap/v5/map?key=H1snoR7HAMGka2pLiA1cDnQiU2mVEc5x&locations=${lat},${lng}&size=1100,500@2x`)
            .then(function(data){
                OkayStatusLog('Map loaded sucessfully ..............');
                mapContainer.innerHTML =`<img src="${data.url}" alt="map showing the place you searched">`

                getWeather(lat, lng, data);
            }).catch(function(e){
                searchButtonLoader('', 'remove__loader');
                ActivityLogLoader('', 'close')
                ErrorStatusLog(e);
               return console.log(e);
            })

            if (lat == undefined || lng == undefined) {
                searchButtonLoader('', 'remove__loader');
                return ErrorStatusLog('Sorry!, No data for this location')
            }
            // var marker = new google.maps.Marker({
            //     position: markerCenter,
            //     animation: google.maps.Animation.BOUNCE
            // });
            // marker.setMap(map);
        }
        //settimeout close
    }, 2000)
}

function FbShareDescription(mapImage, celciusTemperature, fahrenheit, description){
const head  = document.getElementsByTagName('head')[0]
const placesearchQueryFromLocalstorage = localStorage.getItem('place-search-query');
const placesearchQuery = JSON.parse(placesearchQueryFromLocalstorage);
    if(head.childNodes.length >= 45){
        head.removeChild(head.childNodes[44])
        head.removeChild(head.childNodes[43])
    }
  const metaForImage = document.createElement('meta');
  metaForImage.setAttribute('property', 'content')
  metaForImage.property = "og:image";
  metaForImage.content = `${mapImage}`;
  document.getElementsByTagName('head')[0].appendChild(metaForImage);
  const metaForWeatherDescription = document.createElement('meta');
  metaForWeatherDescription.setAttribute('property', 'content')
  metaForWeatherDescription.property = "og:description";
  metaForWeatherDescription.content = `The weather condition in ${placesearchQuery} is ${celciusTemperature}/${fahrenheit}, ${description} Source :- https://geo-search.netlify.com`;
  document.getElementsByTagName('head')[0].appendChild(metaForWeatherDescription);
}

function getWeather(lat, lon, mapImage) {
    var key = '820fbadeb36dd9e325e2ede7deca57b5';
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`)
        .then(function (resp) {
            return resp.json() // Convert data to json
        })
        .then(function (data) {
            document.querySelector('.spinner').style.display = 'none'
            document.querySelector('.city__name__h1').style.display = 'block';
            document.getElementById('map').style.display = 'block';
            searchButtonLoader('', 'remove__loader');
            document.querySelector('.share__wrapper').style.display = `flex`;
            document.querySelector('.view__map__mobile').style.display = 'block';
            OkayStatusLog('Weather Data is Avaliable ..');
            setTimeout(() => {
                ModalActivityLog('', 'close');
            }, 2000)
            const celciusTemperature = Math.round(parseFloat(data.main.temp) - 273.15);
            const fahrenheit = Math.round(((parseFloat(data.main.temp) - 273.15) * 1.8) + 32);
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;
            const description = data.weather[0].description;
            const icon = data.weather[0].icon;
            const date = new Date().toDateString();

               FbShareDescription(mapImage, celciusTemperature, fahrenheit, description);

            document.querySelector('.weather__icon').innerHTML = `<img src="https://openweathermap.org/img/w/${icon}.png" alt="${description}">`;
            document.querySelector('.today').innerText = `Today`
            document.querySelector('.today__date__words').innerHTML = `${date}`;
            document.querySelector('.temp__scale__btn').innerHTML = `<div class="tooltip">
                                                                       <button class="cel-to-active active" id="Celsius">°C</button>
                                                                       <span class="tooltiptext">Convert Temperature to celcius</span>
                                                                     </div>
                                                                     <div class="tooltip">
                                                                       <button class="fah-to-active not-active" id="Fahrenheit">°F</button>
                                                                       <span class="tooltiptext">Convert Temperature to Fahrenheit</>
                                                                     </div>`
            document.querySelector('.weather__degree').innerHTML = `${celciusTemperature} °C`;
            document.querySelector('.weather__description__details').innerHTML = `${description}`;
            document.querySelector('.pressure__details').innerHTML = `<img src="./UI/img/gauge.svg" alt="pressure icon">Pressure &nbsp;<span>${pressure} hpa</span>`;
            document.querySelector('.humidity__details').innerHTML = `<img src="./UI/img/humidity.svg" alt="">Humidity &nbsp;<span>${humidity}%</span>`;
            convertTemp(celciusTemperature, fahrenheit)
        })
        .catch(function (e) {
            // catch any errors
            setTimeout(() => {
                ActivityLogLoader('open')
                searchButtonLoader('', 'remove__loader');
                ErrorStatusLog('ERROR!, Weather Data Failed to load due to network issues, Please try again!')
            }, 2000)
            console.log(e)
        });
}

function getPlacePhotoReference(placeName) {
    let key = 'AIzaSyAvQWut7PvB0bmndRW65xjWBQ7P06vO-cU';
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${placeName}&key=${key}`; // site that doesn’t send Access-Control-*
    fetch(proxyurl + url)
        .then(response => response.json())
        .then(contents => console.log(contents) /*getPlacesImages(contents.results[0].photos[0].photo_reference, placeName)*/ )
        .catch((e) => console.log("Can’t access " + url + " response. Blocked by browser?", 'error', e))
    // getPlacesImages(contents.results[0].photos[0].photo_reference, placeName)
}

function getPlacesImages(photoRefrence, placeName) {
    let key = 'AIzaSyAvQWut7PvB0bmndRW65xjWBQ7P06vO-cU';
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    // https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=YOUR_API_KEY
    fetch(`${proxyurl}https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRefrence}&key=${key}`)
        .then(res => res.json())
        .then(response => document.querySelector('.location__images').innerHTML = `<img class="image__location" src="${response}" title="picture of ${placeName}" alt="piture of ${placeName}">`)
        .catch(e => e)
}

function convertTemp(cel, fah) {
    document.querySelector('#Fahrenheit').addEventListener('click', () => {
        document.querySelector('.weather__degree').innerHTML = `${fah}°F`;
        document.querySelector('.fah-to-active').classList.add('active');
        document.querySelector('.fah-to-active').classList.remove('not-active');
        document.querySelector('.cel-to-active').classList.remove('active');
    })
    document.querySelector('#Celsius').addEventListener('click', () => {
        document.querySelector('.weather__degree').innerHTML = `${cel}°C`;
        document.querySelector('.cel-to-active').classList.add('active');
        document.querySelector('.fah-to-active').classList.add('not-active');
        document.querySelector('.fah-to-active').classList.remove('active');
    })
}