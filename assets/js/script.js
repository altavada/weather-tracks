$(function() {
    var locationName = $('#locationname');
    var searchField = $('#searchfield');
    var searchHistory = {
        destination: [],
        region: []
}
    // Executes search
    $('#gobutton').click(initSearch);

    // Resets page for new search
    $('#back').click(function() {
        getHistory();
        $('#searchbox').css('display', 'flex');
        $('#resultswrapper').css('display', 'none');
        searchField.val('');
        searchField.attr('placeholder', 'Enter location...');
    })

    // Processes search request, fetches location coordinates, saves search if successful and if new search
    function initSearch(searchinput) {
        let fromHistory = true;
        let regionstatus = $('#checkbox').prop('checked')
        if (searchField.val()) {
            searchinput = searchField.val();
            fromHistory = false;
        }
        let inputarray = searchinput.split(",");
        if (inputarray.length > 1 && inputarray[0].charAt(inputarray[0].length - 1) != ",") {
            inputarray[0] = inputarray[0] + ",";
        }
        let mininput = inputarray.join('');
        if (regionstatus == false && inputarray.length < 3) {
            mininput = mininput + ',US';
        }
        // Using Open Weather's Geocoding API to translate names to coordinates, as opposed to the built-in geocoder, which has been deprecated.
        fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + mininput + '&limit=1&appid=0d53b40518548d72b4985f1cfd796f6a')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data[0] == null) {
                    searchField.val('');
                    searchField.attr('placeholder', 'ERROR -- Location not found');
                    return;
                }
                let country = data[0].country;
                let state = data[0].state;
                if (regionstatus == true && country == "US") {
                    $('#checkbox').prop('checked', false);
                }
                if (regionstatus == false && country != "US") {
                    $('#checkbox').prop('checked', true);
                }
                if (state != null && regionstatus == false) {
                    locationName.text(data[0].name + ", " + state);
                } else {
                    locationName.text(data[0].name + ", " + country);
                }
                if (!fromHistory) {
                    saveHistory();
                }
                let x = data[0].lat.toString();
                let y = data[0].lon.toString();
                let latlon = "lat=" + x + "&lon=" + y;
                getResults(latlon);
            })
    }

    // Fetches 5-day forecast data and writes to page, toggles page to display results
    function getResults(coord) {
        fetch('https://api.openweathermap.org/data/2.5/forecast?' + coord + '&appid=0d53b40518548d72b4985f1cfd796f6a&units=imperial')
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            if (data.city == null) {
                searchField.val('');
                searchField.attr('placeholder', 'ERROR -- Forecast Unavailable');
                return;
            }
            let list = data.list;
            let day = dayjs();
            let today = day.format('YYYY-MM-DD');
            let forecastData = {
                temp: [list[0].main.temp],
                hum: [list[0].main.humidity],
                wind: [list[0].wind.speed],
                prec: [list[0].weather[0].main],
                icon: [list[0].weather[0].icon]
            }
            for (var i = 0; i < list.length; i++) {
                let item = list[i];
                let datearray = item.dt_txt.split(' ');
                if (datearray[0] != today && datearray[1] == '15:00:00') {
                    forecastData.temp.push(item.main.temp);
                    forecastData.hum.push(item.main.humidity);
                    forecastData.wind.push(item.wind.speed);
                    forecastData.prec.push(item.weather[0].main);
                    forecastData.icon.push(item.weather[0].icon);
                }
            }
            let weatherbox = $('#forecastwrapper').children();
            for (var i = 0; i < weatherbox.length; i++) {
                let card = weatherbox.eq(i);
                let title = card.children('div');
                let content = card.children('ul').children();
                if (card.attr('id') != 'day1') {
                    title.text(day.add(i, 'day').format('MM/DD'));
                }
                colorCoding(content, forecastData, i);
                content.eq(0).text(forecastData.temp[i] + " (F)");
                content.eq(1).text("Humidity: " + forecastData.hum[i] + "%");
                content.eq(2).text("Wind: " + forecastData.wind[i] + "mph");
                content.eq(3).text(forecastData.prec[i])
                    .append($('<img>').addClass('forecast-icon').attr('src', `https://openweathermap.org/img/wn/${forecastData.icon[i]}.png`));
            }
            $('#searchbox').css('display', 'none');
            $('#resultswrapper').css('display', 'block');
        })
    }

    // Saves new search to local storage
    function saveHistory() {
        searchHistory.destination.unshift(locationName.text());
        searchHistory.region.unshift($('#checkbox').prop('checked'));
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }

    // gets stored data and creates a clickable list of recent searches, defines click handler to execute searches from recent history
    function getHistory() {
        $('#history-items').empty();
        let stored = JSON.parse(localStorage.getItem("searchHistory"));
        if (stored) {
            searchHistory = stored;
            let x = 5;
            if (searchHistory.destination.length < 5) {
                x = searchHistory.destination.length;
            }
            for (var i = 0; i < x; i++) {
                $('#history-items')
                    .append($('<li></li>')
                    .addClass('list-group-item history-btn')
                    .attr('data-region', searchHistory.region[i])
                    .text(searchHistory.destination[i])
                    .click(function() {
                        searchField.val('');
                        if ($(this).attr('data-region') == "true") {
                            $('#checkbox').prop('checked', true);
                        } else {
                            $('#checkbox').prop('checked', false);
                        };
                        initSearch($(this).text());
                        if (locationName != $(this).text()) {
                            getHistory();
                        }
                    }));
            }
            $('#search-history').css('display', 'flex');
        }
    }

    // Color-codes weather data based on values
    function colorCoding(el, obj, x) {
        let temp = obj.temp[x];
        let tempcode;
        if (temp < 0) {
            tempcode = 'temp-a';
        } else if (temp >= 0 && temp < 10) {
            tempcode = 'temp-b';
        } else if (temp >= 10 && temp < 20) {
            tempcode = 'temp-c';
        } else if (temp >= 20 && temp < 30) {
            tempcode = 'temp-d';
        } else if (temp >= 30 && temp < 40) {
            tempcode = 'temp-e';
        } else if (temp >= 40 && temp < 50) {
            tempcode = 'temp-f';
        } else if (temp >= 50 && temp < 60) {
            tempcode = 'temp-g';
        } else if (temp >= 60 && temp < 70) {
            tempcode = 'temp-h';
        } else if (temp >= 70 && temp < 80) {
            tempcode = 'temp-i';
        } else if (temp >= 80 && temp < 90) {
            tempcode = 'temp-j';
        } else if (temp >= 90 && temp < 100) {
            tempcode = 'temp-k';
        } else {
            tempcode = 'temp-l';
        }
        el.eq(0).removeAttr('class').addClass('list-group-item ' + tempcode);
        let hum = obj.hum[x];
        let humcode;
        if (hum < 10) {
            humcode = 'hum-a';
        } else if (hum >= 10 && hum < 20) {
            humcode = 'hum-b';
        } else if (hum >= 20 && hum < 30) {
            humcode = 'hum-c';
        } else if (hum >= 30 && hum < 40) {
            humcode = 'hum-d';
        } else if (hum >= 40 && hum < 50) {
            humcode = 'hum-e';
        } else if (hum >= 50 && hum < 60) {
            humcode = 'hum-f';
        } else if (hum >= 60 && hum < 70) {
            humcode = 'hum-g';
        } else if (hum >= 70 && hum < 80) {
            humcode = 'hum-h';
        } else if (hum >= 80 && hum < 90) {
            humcode = 'hum-i';
        } else {
            humcode = 'hum-j';
        }
        el.eq(1).removeAttr('class').addClass('list-group-item ' + humcode);
        let wind =obj.wind[x];
        let windcode;
        if (wind < 1) {
            windcode = 'wind-b';
        } else if (wind >= 1 && wind < 4) {
            windcode = 'wind-c';
        } else if (wind >= 4 && wind < 8) {
            windcode = 'wind-d';
        } else if (wind >= 8 && wind < 13) {
            windcode = 'wind-e';
        } else if (wind >= 13 && wind < 19) {
            windcode = 'wind-f';
        } else if (wind >= 19 && wind < 25) {
            windcode = 'wind-g';
        } else if (wind >= 25 && wind < 32) {
            windcode = 'wind-h';
        } else if (wind >= 32 && wind < 39) {
            windcode = 'wind-i';
        } else if (wind >= 39 && wind < 47) {
            windcode = 'wind-j';
        } else if (wind >= 47 && wind < 55) {
            windcode = 'wind-k';
        } else if (wind >=55 && wind < 64) {
            windcode = 'wind-l';
        } else if (wind >= 64 && wind < 73) {
            windcode = 'wind-m';
        } else {
            windcode = 'wind-n';
        }
        el.eq(2).removeAttr('class').addClass('list-group-item ' + windcode);
    }

    // calls function when page loads, creates search history IF found
    getHistory();
})
