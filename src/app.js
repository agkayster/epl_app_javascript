import "./style.scss";

let eplData = [];

fetch(
  "https://app.sportdataapi.com/api/v1/soccer/matches?apikey=1ffbdde0-2738-11eb-a86c-17d577bff96a&season_id=352&date_from=2020-09-11"
)
  .then((res) => res.json())
  .then((data) => (eplData = data));

console.log(eplData);
