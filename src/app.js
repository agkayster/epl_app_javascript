import "./style.scss";
import "core-js/stable";
import "regenerator-runtime/runtime";

const selectMatchCategory = document.querySelector(".matchstatus");
const selectHomeTeam = document.querySelector(".hometeam");
const selectAwayTeam = document.querySelector(".awayteam");
const selectMatchDate = document.querySelector(".matchDate");
const selectMatchTime = document.querySelector(".matchTime");

let eplData = [];

async function getEplData() {
  try {
    await fetch(
      "https://app.sportdataapi.com/api/v1/soccer/matches?apikey=1ffbdde0-2738-11eb-a86c-17d577bff96a&season_id=352&date_from=2020-09-11"
    )
      .then((res) => res.json())
      .then((data) => {
        eplData = data.data;
        console.log("get epl data =>", eplData);
        getAllMatchCategory();
        getHomeTeams();
        getAwayTeams();
        getAllDates();
        getAllMatchTimes();
      });
  } catch (e) {
    console.log("error", e);
  }
}
getEplData();

// Get all Dates of Matches //

function getAllDates() {
  selectMatchDate.innerHTML = "";
  let dateOfMatch = [];
  let newDate;
  let newDateMatch;
  eplData.map((data) => {
    let date = new Date(data.match_start);
    newDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    dateOfMatch.push(newDate);
  });
  newDateMatch = [...new Set(dateOfMatch)];
  newDateMatch.unshift("ALL");

  newDateMatch.forEach((date) => {
    const eplMatchDates = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${date}`;
    eplMatchDates.setAttributeNode(val);
    eplMatchDates.innerHTML = `
    ${date}
    `;
    selectMatchDate.appendChild(eplMatchDates);
  });
}

// Implement event listener to get the time of the matches and Category of the matches that match the dates//

selectMatchDate.addEventListener("change", () => {
  if (selectMatchDate.value === "ALL") {
    getAllMatchTimes();
    getAllMatchCategory();
    getHomeTeams();
    getAwayTeams();
  } else {
    getAllMatchTimesForDates(selectMatchDate.value);
    getAllMatchCategoryForDates(selectMatchDate.value);
    getHomeTeamsByDates(selectMatchDate.value);
    getAwayTeamsByDates(selectMatchDate.value);
  }
});

// Get all Times of Matches //

const getAllMatchTimes = () => {
  selectMatchTime.innerHTML = "";
  let newTime;
  let timeOfMatch = [];
  let newTimeOfMatch;
  eplData.map((data) => {
    let date = new Date(data.match_start);
    if (`${date.getMinutes()}`.length < 2) {
      newTime = `${date.getHours()}:${date.getMinutes()}0:${date.getSeconds()}0`;
    } else {
      newTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}0`;
    }
    timeOfMatch.push(newTime);
  });
  newTimeOfMatch = [...new Set(timeOfMatch)];
  newTimeOfMatch.unshift("ALL");
  newTimeOfMatch.forEach((time) => {
    const eplMatchTimes = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${time}`;
    eplMatchTimes.setAttributeNode(val);
    eplMatchTimes.innerHTML = `
    ${time}
    `;
    selectMatchTime.appendChild(eplMatchTimes);
  });
};

// Implement Event Listener to get Category based on Time //

selectMatchTime.addEventListener("change", () => {
  if (selectMatchTime.value === "ALL") {
    getAllMatchCategory();
  } else {
    getAllMatchCategoryForTime(selectMatchTime.value);
  }
});

// Get all Match times based on Dates //

const getAllMatchTimesForDates = (date) => {
  selectMatchTime.innerHTML = "";
  let newTime;
  let matchTimeForDates = eplData.map((data) => {
    let dDate = new Date(data.match_start);
    if (`${dDate.getMinutes()}`.length < 2) {
      newTime = `${dDate.getHours()}:${dDate.getMinutes()}0:${dDate.getSeconds()}0`;
    } else {
      newTime = `${dDate.getHours()}:${dDate.getMinutes()}:${dDate.getSeconds()}0`;
    }
    return {
      matchDate: `${dDate.getDate()}/${
        dDate.getMonth() + 1
      }/${dDate.getFullYear()}`,
      matchTime: newTime,
    };
  });
  let result = matchTimeForDates.filter((match) => match.matchDate === date);
  result.forEach((time) => {
    const eplMatchTimes = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${time.matchTime}`;
    eplMatchTimes.setAttributeNode(val);
    eplMatchTimes.innerHTML = `
    ${time.matchTime}
    `;
    selectMatchTime.appendChild(eplMatchTimes);
  });
  selectMatchTime.addEventListener("change", () => {
    result.filter((item) => {
      if (selectMatchTime.value === item.matchTime) {
        getAllMatchCategoryForDatesAndTime(selectMatchTime.value, date);
      }
    });
  });
};

//================================================================================> Match Category/Status

// Get all the Match status/Category //

function getAllMatchCategory() {
  selectMatchCategory.innerHTML = "";
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
    selectMatchCategory.appendChild(eplCategoryOptions);
  });
}

// Get all the Match status/Category based on Dates //

const getAllMatchCategoryForDates = (date) => {
  selectMatchCategory.innerHTML = "";
  let dDate;
  let newDate;

  let newMatch = eplData.map((data) => {
    dDate = new Date(data.match_start);
    newDate = `${dDate.getDate()}/${
      dDate.getMonth() + 1
    }/${dDate.getFullYear()}`;
    return {
      matchCategory:
        data.status === ""
          ? "NOT PLAYED"
          : data.status === "notstarted"
          ? "YET TO BE PLAYED"
          : data.status === "finished"
          ? "FINISHED"
          : data.status === "postponed"
          ? "POSTPONED"
          : data.status,
      matchDate: newDate,
    };
  });

  let result = newMatch.filter((item) => item.matchDate === date);
  console.log("result filter for match status with dates =>", result);
  result.forEach((item) => {
    const eplCategoryDates = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${item.matchCategory}`;
    eplCategoryDates.setAttributeNode(val);
    eplCategoryDates.innerHTML = `
    ${item.matchCategory}
        `;
    selectMatchCategory.appendChild(eplCategoryDates);
  });

  selectMatchCategory.addEventListener("change", () => {
    result.filter((team) => {
      if (team.matchCategory === selectMatchCategory.value) {
        getHomeTeamsByCategoryAndDate(selectMatchCategory.value, date);
        getAwayTeamsByCategoryAndDate(selectMatchCategory.value, date);
      }
    });
  });
};

// Get all Match Category/Status based on Time //

const getAllMatchCategoryForTime = (time) => {
  selectMatchCategory.innerHTML = "";
  let dDate;
  let newTime;

  let newMatch = eplData.map((data) => {
    dDate = new Date(data.match_start);
    if (`${dDate.getMinutes()}`.length < 2) {
      newTime = `${dDate.getHours()}:${dDate.getMinutes()}0:${dDate.getSeconds()}0`;
    } else {
      newTime = `${dDate.getHours()}:${dDate.getMinutes()}:${dDate.getSeconds()}0`;
    }
    return {
      matchCategory:
        data.status === ""
          ? "NOT PLAYED"
          : data.status === "notstarted"
          ? "YET TO BE PLAYED"
          : data.status === "finished"
          ? "FINISHED"
          : data.status === "postponed"
          ? "POSTPONED"
          : data.status,
      matchTime: newTime,
    };
  });

  let result = newMatch.filter((item) => item.matchTime === time);
  console.log("result filter for match status with dates =>", result);
  result.forEach((item) => {
    const eplCategoryTimes = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${item.matchCategory}`;
    eplCategoryTimes.setAttributeNode(val);
    eplCategoryTimes.innerHTML = `
    ${item.matchCategory}
        `;
    selectMatchCategory.appendChild(eplCategoryTimes);
  });
};

// Get all Match category based on Dates and Times //

const getAllMatchCategoryForDatesAndTime = (time, date) => {
  console.log("get category based on dates and time =>", time, date);
  selectMatchCategory.innerHTML = "";
  let dDate;
  let newTime;
  let newDate;

  let newMatch = eplData.map((data) => {
    dDate = new Date(data.match_start);
    if (`${dDate.getMinutes()}`.length < 2) {
      newTime = `${dDate.getHours()}:${dDate.getMinutes()}0:${dDate.getSeconds()}0`;
    } else {
      newTime = `${dDate.getHours()}:${dDate.getMinutes()}:${dDate.getSeconds()}0`;
    }
    newDate = `${dDate.getDate()}/${
      dDate.getMonth() + 1
    }/${dDate.getFullYear()}`;
    return {
      matchCategory:
        data.status === ""
          ? "NOT PLAYED"
          : data.status === "notstarted"
          ? "YET TO BE PLAYED"
          : data.status === "finished"
          ? "FINISHED"
          : data.status === "postponed"
          ? "POSTPONED"
          : data.status,
      matchTime: newTime,
      matchDate: newDate,
    };
  });
  let result = newMatch.filter(
    (item) => item.matchTime === time && item.matchDate === date
  );
  result.forEach((item) => {
    const eplCategoryTimesDates = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${item.matchCategory}`;
    eplCategoryTimesDates.setAttributeNode(val);
    eplCategoryTimesDates.innerHTML = `
    ${item.matchCategory}
        `;
    selectMatchCategory.appendChild(eplCategoryTimesDates);
  });
  selectMatchCategory.addEventListener("click", () => {
    result.filter((item) => {
      if (item.matchCategory === selectMatchCategory.value) {
        getHomeTeamsByCategoryDateTime(selectMatchCategory.value, time, date);
      }
    });
  });
};

// Implement the event listener for all statuses and categories //

selectMatchCategory.addEventListener("change", () => {
  if (selectMatchCategory.value === "ALL") {
    getHomeTeams();
    getAwayTeams();
  } else {
    getHomeTeamsByStatus(selectMatchCategory.value);
    getAwayTeamsByStatus(selectMatchCategory.value);
  }
});

//=========================================================================================> Home Teams

// Get all the Home teams //

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
    eplHomeTeams.setAttributeNode(val);
    eplHomeTeams.innerHTML = `
      ${team}
      `;
    selectHomeTeam.appendChild(eplHomeTeams);
  });
};

// Get all the Home teams based on the Categories/Statuses //

const getHomeTeamsByStatus = (status) => {
  selectHomeTeam.innerHTML = "";
  let newHomeTeam;
  let result;

  newHomeTeam = eplData.map((data) => ({
    homeTeam: data.home_team.name,
    awayTeam: data.away_team.name,
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

  result = newHomeTeam.filter((team) => team.status === status);
  console.log("result of status filter =>", result);
  result.forEach((team) => {
    const eplHomeTeams = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${team.homeTeam}`;
    eplHomeTeams.setAttributeNode(val);
    eplHomeTeams.innerHTML = `
      ${team.homeTeam}
      `;
    selectHomeTeam.appendChild(eplHomeTeams);
  });
  selectHomeTeam.addEventListener("change", () => {
    result.filter((team) => {
      if (team.homeTeam === selectHomeTeam.value) {
        getAwayTeamsByHomeTeam(selectHomeTeam.value, status);
      }
    });
  });
};

// Get all the Home teams based on the Dates of the Match and Category of the Matches //

const getHomeTeamsByCategoryAndDate = (matchCat, date) => {
  selectHomeTeam.innerHTML = "";
  let dDate;
  let newDate;
  let newHomeTeam;
  let result;
  newHomeTeam = eplData.map((data) => {
    dDate = new Date(data.match_start);
    newDate = `${dDate.getDate()}/${
      dDate.getMonth() + 1
    }/${dDate.getFullYear()}`;
    return {
      homeTeam: data.home_team.name,
      matchDate: newDate,
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
    };
  });

  result = newHomeTeam.filter(
    (item) => item.status === matchCat && item.matchDate === date
  );
  console.log(
    "result of filter for home team based on Category and date =>",
    result
  );
  result.forEach((team) => {
    const eplHomeTeams = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${team.homeTeam}`;
    eplHomeTeams.setAttributeNode(val);
    eplHomeTeams.innerHTML = `
      ${team.homeTeam}
      `;
    selectHomeTeam.appendChild(eplHomeTeams);
  });
};

// Get all the Home teams based on the Dates of the Matches //

const getHomeTeamsByDates = (date) => {
  selectHomeTeam.innerHTML = "";
  let dDate;
  let newDate;
  let newHomeTeam;
  let result;

  newHomeTeam = eplData.map((data) => {
    dDate = new Date(data.match_start);
    newDate = `${dDate.getDate()}/${
      dDate.getMonth() + 1
    }/${dDate.getFullYear()}`;
    return {
      homeTeam: data.home_team.name,
      matchDate: newDate,
    };
  });

  result = newHomeTeam.filter((team) => team.matchDate === date);
  console.log("result of home team filter based on dates =>", result);
  result.forEach((team) => {
    const eplHomeTeams = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${team.homeTeam}`;
    eplHomeTeams.setAttributeNode(val);
    eplHomeTeams.innerHTML = `
      ${team.homeTeam}
      `;
    selectHomeTeam.appendChild(eplHomeTeams);
  });
  selectHomeTeam.addEventListener("change", () => {
    result.filter((team) => {
      if (team.homeTeam === selectHomeTeam.value) {
        getAwayTeamsByHomeTeamDate(selectHomeTeam.value, date);
      }
    });
  });
};

// Get all the Home teams based on the Dates, Categories and times of the Matches //

const getHomeTeamsByCategoryDateTime = (matchCat, time, date) => {
  selectHomeTeam.innerHTML = "";
  let dDate;
  let newDate;
  let newHomeTeam;
  let newTime;
  newHomeTeam = eplData.map((data) => {
    dDate = new Date(data.match_start);
    newDate = `${dDate.getDate()}/${
      dDate.getMonth() + 1
    }/${dDate.getFullYear()}`;
    if (`${dDate.getMinutes()}`.length < 2) {
      newTime = `${dDate.getHours()}:${dDate.getMinutes()}0:${dDate.getSeconds()}0`;
    } else {
      newTime = `${dDate.getHours()}:${dDate.getMinutes()}:${dDate.getSeconds()}0`;
    }
    return {
      homeTeam: data.home_team.name,
      matchDate: newDate,
      matchTime: newTime,
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
    };
  });

  let result = newHomeTeam.filter(
    (item) =>
      item.status === matchCat &&
      item.matchTime === time &&
      item.matchDate === date
  );
  console.log("result filter for category, dates and times =>", result);
  result.forEach((team) => {
    const eplHomeTeams = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${team.homeTeam}`;
    eplHomeTeams.setAttributeNode(val);
    eplHomeTeams.innerHTML = `
      ${team.homeTeam}
      `;
    selectHomeTeam.appendChild(eplHomeTeams);
  });
};
//===================================================================================================> AWAY TEAMS
// Get all the Away teams //

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
    const val = document.createAttribute("value");
    eplAwayTeams.setAttributeNode(val);
    val.value = `${team}`;
    eplAwayTeams.innerHTML = `
      ${team}
      `;
    selectAwayTeam.appendChild(eplAwayTeams);
  });
};

// Get all the Away Teams based on the Categories/Statuses //

const getAwayTeamsByStatus = (status) => {
  console.log("get away status =>", status);
  selectAwayTeam.innerHTML = "";
  let newAwayTeam;
  let result;

  newAwayTeam = eplData.map((data) => ({
    homeTeam: data.home_team.name,
    awayTeam: data.away_team.name,
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

  result = newAwayTeam.filter((team) => team.status === status);
  console.log("result of status filter =>", result);
  result.forEach((team) => {
    const eplAwayTeams = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${team.homeTeam}`;
    eplAwayTeams.setAttributeNode(val);
    eplAwayTeams.innerHTML = `
      ${team.awayTeam}
      `;
    selectAwayTeam.appendChild(eplAwayTeams);
  });
};

// Get all Away teams based on the Category of Matches(status) and Home team

const getAwayTeamsByHomeTeam = (homeT, status) => {
  selectAwayTeam.innerHTML = "";
  let newAwayTeam;
  let result;

  newAwayTeam = eplData.map((data) => ({
    homeTeam: data.home_team.name,
    awayTeam: data.away_team.name,
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

  result = newAwayTeam.filter(
    (team) => team.homeTeam === homeT && team.status === status
  );
  console.log("result of away team filter =>", result);
  result.forEach((team) => {
    const eplAwayTeams = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${team.awayTeam}`;
    eplAwayTeams.setAttributeNode(val);
    eplAwayTeams.innerHTML = `
      ${team.awayTeam}
      `;
    selectAwayTeam.appendChild(eplAwayTeams);
  });
};

// Get all Away teams based on the Dates of the Matches //

const getAwayTeamsByDates = (date) => {
  selectAwayTeam.innerHTML = "";
  let dDate;
  let newDate;
  let newAwayTeam;
  let result;

  newAwayTeam = eplData.map((data) => {
    dDate = new Date(data.match_start);
    newDate = `${dDate.getDate()}/${
      dDate.getMonth() + 1
    }/${dDate.getFullYear()}`;
    return {
      awayTeam: data.away_team.name,
      matchDate: newDate,
    };
  });

  result = newAwayTeam.filter((team) => team.matchDate === date);
  console.log("result of filter for away team based on match date =>", result);

  result.forEach((team) => {
    const eplAwayTeams = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${team.awayTeam}`;
    eplAwayTeams.setAttributeNode(val);
    eplAwayTeams.innerHTML = `
      ${team.awayTeam}
      `;
    selectAwayTeam.appendChild(eplAwayTeams);
  });
};

// Get all Away teams based on the Home teams and Dates //

const getAwayTeamsByHomeTeamDate = (homeT, date) => {
  console.log("get away teams by home team and date =>", homeT, date);
  selectAwayTeam.innerHTML = "";
  let dDate;
  let newDate;
  let newAwayTeam;
  let result;
  newAwayTeam = eplData.map((data) => {
    dDate = new Date(data.match_start);
    newDate = `${dDate.getDate()}/${
      dDate.getMonth() + 1
    }/${dDate.getFullYear()}`;
    return {
      homeTeam: data.home_team.name,
      awayTeam: data.away_team.name,
      matchDate: newDate,
    };
  });

  result = newAwayTeam.filter(
    (team) => team.homeTeam === homeT && team.matchDate === date
  );
  console.log(
    "result of away team filter based on home team and date =>",
    result
  );
  result.forEach((team) => {
    const eplAwayTeams = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${team.awayTeam}`;
    eplAwayTeams.setAttributeNode(val);
    eplAwayTeams.innerHTML = `
      ${team.awayTeam}
      `;
    selectAwayTeam.appendChild(eplAwayTeams);
  });
};

// Get all Away teams based on Match Category and Dates //

const getAwayTeamsByCategoryAndDate = (matchCat, date) => {
  console.log("get away teams based on category and date =>", matchCat, date);
  selectAwayTeam.innerHTML = "";
  let dDate;
  let newDate;
  let newAwayTeam;
  let result;
  newAwayTeam = eplData.map((data) => {
    dDate = new Date(data.match_start);
    newDate = `${dDate.getDate()}/${
      dDate.getMonth() + 1
    }/${dDate.getFullYear()}`;
    return {
      awayTeam: data.away_team.name,
      matchDate: newDate,
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
    };
  });

  result = newAwayTeam.filter(
    (item) => item.status === matchCat && item.matchDate === date
  );
  console.log(
    "result of filter for away team based on Category and date =>",
    result
  );
  result.forEach((team) => {
    const eplAwayTeams = document.createElement("option");
    const val = document.createAttribute("value");
    val.value = `${team.awayTeam}`;
    eplAwayTeams.setAttributeNode(val);
    eplAwayTeams.innerHTML = `
      ${team.awayTeam}
      `;
    selectAwayTeam.appendChild(eplAwayTeams);
  });
};
