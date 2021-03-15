import "./style.scss";

const selectMatch = document.querySelector(".matchstatus");
const selectHomeTeam = document.querySelector(".hometeam");
const selectAwayTeam = document.querySelector(".awayteam");

let eplData = [];

fetch(
  "https://app.sportdataapi.com/api/v1/soccer/matches?apikey=1ffbdde0-2738-11eb-a86c-17d577bff96a&season_id=352&date_from=2020-09-11"
)
  .then((res) => res.json())
  .then((data) => {
    eplData = data.data;
    console.log(eplData);
    getAllMatchCategory();
    getHomeTeams();
    getAwayTeams();
  });

function getAllMatchCategory() {
  selectMatch.innerHTML = "";
  let matchStatus = [];
  let newMatch;
  eplData.forEach((match) => {
    match.status === ""
      ? matchStatus.push("NOT PLAYED")
      : match.status === "notstarted"
      ? matchStatus.push("YET TO BE PLAYED")
      : match.status === "finished"
      ? matchStatus.push("FINISHED")
      : match.status === "postponed"
      ? matchStatus.push("POSTPONED")
      : match.status;
  });
  newMatch = [...new Set(matchStatus)];
  newMatch.unshift("ALL");
  console.log(newMatch);

  newMatch.forEach((status) => {
    const eplCategoryOptions = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${status}`;
    eplCategoryOptions.setAttributeNode(val);
    eplCategoryOptions.innerHTML = `
    ${status}
        `;
    selectMatch.appendChild(eplCategoryOptions);
    console.log("get status =>", status);
  });
}

selectMatch.addEventListener("change", () => {
  console.log("get status listener =>", selectMatch.value);
  if (selectMatch.value === "ALL") {
    getHomeTeams();
    getAwayTeams();
  } else {
    getHomeTeamsByStatus(selectMatch.value);
    getAwayTeamsByStatus(selectMatch.value);
  }
});

const getHomeTeams = () => {
  selectHomeTeam.innerHTML = "";
  let homeTeams = [];
  let newHomeTeam;
  eplData.forEach((team) => {
    homeTeams.push(team.home_team.name);
  });
  newHomeTeam = [...new Set(homeTeams)];
  newHomeTeam.forEach((team) => {
    const eplHomeTeams = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${team}`;
    eplHomeTeams.innerHTML = `
      ${team}
      `;
    selectHomeTeam.appendChild(eplHomeTeams);
  });
};

const getAwayTeams = () => {
  selectAwayTeam.innerHTML = "";
  let awayTeams = [];
  let newAwayTeam;
  eplData.forEach((team) => {
    awayTeams.push(team.away_team.name);
  });
  newAwayTeam = [...new Set(awayTeams)];
  newAwayTeam.forEach((team) => {
    const eplAwayTeams = document.createElement("option");
    eplAwayTeams.innerHTML = `
      ${team}
      `;
    selectAwayTeam.appendChild(eplAwayTeams);
  });
};

const getHomeTeamsByStatus = (status) => {
  console.log("get home status =>", status);
  selectHomeTeam.innerHTML = "";
  let newHomeTeam;
  let result;

  newHomeTeam = eplData.map((data) => ({
    team: data.home_team.name,
    status:
      data.status === ""
        ? "NOT PLAYED"
        : data.status === "notstarted"
        ? "YET TO BE PLAYED"
        : data.status === "finished"
        ? "FINISHED"
        : data.status === "postponed"
        ? "POSTPONED"
        : data.status,
  }));
  console.log("new home team =>", newHomeTeam);

  result = newHomeTeam.filter((team) => team.status === status);
  console.log("result of filter =>", result);
  result.forEach((team) => {
    const eplHomeTeams = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${team.team}`;
    eplHomeTeams.setAttributeNode(val);
    eplHomeTeams.innerHTML = `
      ${team.team}
      `;
    selectHomeTeam.appendChild(eplHomeTeams);
  });
};

const getAwayTeamsByStatus = (status) => {
  console.log("get away status =>", status);
  selectAwayTeam.innerHTML = "";

  const result = eplData.filter((match) => match.status === status);
  console.log("away result =>", result);
  result.forEach((team) => {
    const eplAwayTeams = document.createElement("option");
    eplAwayTeams.innerHTML = `
      ${team}
      `;
    selectAwayTeam.appendChild(eplAwayTeams);
  });
};

selectHomeTeam.addEventListener("change", () => {
  console.log("get home team listener =>", selectHomeTeam);
  
});
