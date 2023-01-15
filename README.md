# WeatherTrax Forecast Finder

## Description

This project utilizes the Bootstrap framework and the fetch API method to handle user searches and return 5-day forecast data for a given location in the world by calling on the Open Weather Map server-side API. It also stores recent searches in the user's browser cache, and automatically creates and updates a list of recent searches. Numeric weather data is color-coded according to its values, to help the user easily visualize relative scale. Temperature (in Fahrenheit) and humidity (in percent humidity index) color-coding uses a base-10 scale and covers a normative range of 0-100, with additional temperature categories handling temperatures outside this range. Wind speed color-coding is based off the Beaufort wind force scale. As true daily highs and lows are not available via this API (a paid alternative exists from the same site that would fulfill this specification), future-date forecasts list results from 3PM each day, while current conditions are listed from the closest 3-hour forecast listing to the present time.

User opens page for first time:
![A first-time user opens the page](./Assets/images/sample.png)

User performs first search (US location):
![User performs first search](./Assets/images/sample2.png)

User clicks "New Search" or reloads page, begins second search (non-US location). Recent Search history appears:
![User clicks "New Search" or reloads page, and begins second search](./Assets/images/sample3.png)

New search performed, Recent Search history persists:
![New search performed, Recent Search history persists](./Assets/images/sample4.png)

Recent Search item clicked. Search history and results updated:
![Recent Search item clicked. Search history and results updated](./Assets/images/sample5.png)



## Installation

N/A

## Usage

When the user first visits the page, they are presented with a simple search bar. As indicated, the user should check the "Outside US" box to filter out results with a US state address (which entails different API formatting). When the user enters a valid location name and clicks "GO," the page returns current conditions and future conditions ranging from tomorrow to today-plus-5. If an invalid location is entered or weather data cannot be retrieved, the page does not change and a corresponding error message will display in the search bar. Following a successful search, the user can click "New Search" to return to the empty search bar and start again. When this is done, a "Recent Searches" table appears below the search bar. This table persists when new searches are performed or the page is reloaded, and will always display the most recent searches (max 5 at a time). When an item from this list is clicked, an up-to-date forecast for that location is returned. If a new search is performed and then an item from the recent history is clicked, the page immediately switches to that forecast and updates recent searches to include the last new search. If any search result is not returning correctly (returning an error state or an unintended location), try adding a two-letter state or country code to your search query separated by a comma. You can also try spelling out the state or country, also separated by a comma, if the abbreviation fails. At least one of these methods should sufficiently narrow down your search, provided the location exists in the API database. To view the deployed page, [click here](https://altavada.github.io/weather-tracks/).

## Credits

N/A

## License

Refer to license in the repo.