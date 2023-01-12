// Key: 0d53b40518548d72b4985f1cfd796f6a
// Geo: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}


$(function() {
    $('#gobutton').click(initSearch);

    $('#back').click(function() {
        $('#searchbox').css('display', 'flex');
        $('#resultswrapper').css('display', 'none');
        $('#searchfield').val('');
    })

    function initSearch(mininput) {
        let searchinput = $('#searchfield').val();
        let inputarray = searchinput.split(" ");
        if (inputarray.length > 1 && inputarray[0].charAt(inputarray[0].length - 1) != ",") {
            inputarray[0] = inputarray[0] + ",";
        }
        mininput = inputarray.join('');
        if ($('#checkbox').prop('checked') == false) {
            mininput = mininput + ',US';
        }
        fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + mininput + '&limit=1&appid=0d53b40518548d72b4985f1cfd796f6a')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data[0] == null) {
                    $('#searchfield').val('ERROR -- Location not found');
                    return;
                }
                // console.log(data);
                $('#locationname').text(data[0].name + ", " + data[0].state);
                let lat = data[0].lat.toString();
                let lon = data[0].lon.toString();
                let latlon = "lat=" + lat + "&lon=" + lon;
                getResults(latlon);
            })
    }

    function getResults(coord) {
        fetch('http://api.openweathermap.org/data/2.5/forecast?' + coord + '&appid=0d53b40518548d72b4985f1cfd796f6a&units=imperial')
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            if (data.city == null) {
                $('#searchfield').val('ERROR -- Forecast unavailable');
                return;
            }
            console.log("Data object:", data);
            let list = data.list;
            let day = dayjs();
            let today = day.format('YYYY-MM-DD');
            let forecastData = {
                temp: [list[0].main.temp],
                hum: [list[0].main.humidity],
                wind: [list[0].wind.speed],
                prec: [list[0].weather[0].main]
            }
            for (var i = 0; i < list.length; i++) {
                let item = list[i];
                let datearray = item.dt_txt.split(' ');
                if (datearray[0] != today && datearray[1] == '15:00:00') {
                    forecastData.temp.push(item.main.temp);
                    forecastData.hum.push(item.main.humidity);
                    forecastData.wind.push(item.wind.speed);
                    forecastData.prec.push(item.weather[0].main);
                }
            }
            console.log(forecastData);
            let weatherbox = $('#forecastwrapper').children();
            for (var i = 0; i < weatherbox.length; i++) {
                let card = weatherbox.eq(i);
                let title = card.children('div');
                let content = card.children('ul').children();
                if (card.attr('id') != 'day1') {
                    title.text(day.add(i, 'day').format('MM/DD'));
                }
                content.eq(0).text(forecastData.temp[i] + " (F)");
                content.eq(1).text("Humidity: " + forecastData.hum[i] + "%");
                content.eq(2).text("Wind: " + forecastData.wind[i] + "mph");
                content.eq(3).text(forecastData.prec[i]);
            }
            $('#searchbox').css('display', 'none');
            $('#resultswrapper').css('display', 'block');
        })
    }
})
