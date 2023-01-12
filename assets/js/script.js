// Key: 0d53b40518548d72b4985f1cfd796f6a
// Geo: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}


$(function() {
    $('#gobutton').click(function() {
        let searchinput = $('#searchfield').val();
        let inputarray = searchinput.split(" ");
        if (inputarray.length > 1 && inputarray[0].charAt(inputarray[0].length - 1) != ",") {
            inputarray[0] = inputarray[0] + ",";
        }
        let mininput = inputarray.join('');
        if ($('#checkbox').prop('checked') == false) {
            mininput = mininput + ',US';
        }
        console.log(mininput);
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
                let coord = "lat=" + lat + "&lon=" + lon;
                fetch('http://api.openweathermap.org/data/2.5/forecast?' + coord + '&appid=0d53b40518548d72b4985f1cfd796f6a&units=imperial')
                    .then(function(response){
                        return response.json();
                    })
                    .then(function(data){
                        console.log(data);
                        
                    })
            })
    })
})