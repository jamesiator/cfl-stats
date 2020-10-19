const GAMES = 1;
const PLAYERS = 2;
const LEADERS = 3;
const STANDINGS = 4;
const TEAMS = 5;
const VENUES = 6;

function getGames(json) {
  //add 'Game' to each item in the list
  let results = "";
  for (let element of json.data) {
    if (element.event_type.event_type_id != 0) { //filter out preseason games
      results += '<br><hr><br><div class="gameInfoContainer"><div class="gameInfo">'
      results += "<div><h2>" + element.team_1.location + "</h2>";
      results += '<h3 style="color: #d92b2b">' + element.team_1.nickname + "</h3>";
      results += "<p>" + element.team_1.score + "</p></div>";

      results += '<div class="atBox"><h1>at</h1></div>';

      results += "<div><h2>" + element.team_2.location + "</h2>";
      results += '<h3 style="color: #d92b2b">' + element.team_2.nickname + "</h3>";
      results += "<p>" + element.team_2.score + "</p></div>";
      results += "</div>";

      if (element.event_type.event_type_id != 1)
        results += "<p>" + element.event_type.title + "</p>";

      results += "<p>" + moment(element.date_start).format('MMM Do, YYYY') + "</p>";
      results += "<p>" + element.venue.name + "</p></div>";
    }
  }
  return results;
};

function getPlayers(json) {
  let results = "";
  for (let element of json.data) {
    results += '<br><h2>' + element.first_name + ' ' + element.last_name + '</h2>';
    results += '<p>- Position: ' + element.position.description + '</p>';
    results += '<p>- School: ' + element.school.name + '</p>';
  }
  return results;
};

function getLeaders(json) {
  let results = "";
  for (let element of json.data) {
    results += '<br><h2>' + element.first_name + ' ' + element.last_name;
    results += "&nbsp;(" + element.team_location + ")</h2>";

    let info = document.getElementById('statCategorySelect');
    let stat = info.options[info.selectedIndex].text;

    results += '<p>- ' + stat + ': ' + element[info.value] + '</p>';
  }
  return results;
};

function getStandings(json) {
  //put '[season] standings' at the top
  let results = '<br><div class="standings">';
  for (let e of Object.values(json.data.divisions)) {
    //debugger
    results += '<div><h1>' + e.division_name + '<h1><table>';
    results += '<tr><th>Team</th><th>&nbsp;Overall&nbsp;</th><th>&nbsp;Division&nbsp;</th></tr>';

    for (let e2 of Object.values(e.standings)) {
      results += '<tr><td>' + e2.location + '</td><td>' + e2.wins + ' - ' + e2.losses + '</td>';
      results += '<td>(' + e2.division_wins + ' - ' + e2.division_losses + ')</td></tr>';
    }
    results += '</table></div>';
  }
  return results;
};

function getTeams(json) {
  //put 'Team' before each list item
  let results = "";
  for (let element of json.data) {
    results += '<br><hr><br><div class="team">';
    results += '<img src="' + element.images.logo_image_url + '">';
    results += '<div class="teamInfo">';
    results += '<h1>' + element.full_name + '</h1>';
    results += '<p>Division: ' + element.division_name + '</p>';
    results += '<p>Venue: ' + element.venue_name + '</p></div>';
    results += "</div>";
  }
  return results;
};

function getVenues(json) {
  //put 'Venue' before each list item
  let results = "<ul>";
  for (let element of json.data) {
    if (element.Capacity != null) {
      results += '<br><li><h2>' + element.Name + '</h2>';
      results += ' - Capacity: ' + element.Capacity.toLocaleString() + '</li>';
    }
  }
  results += '</ul>';
  return results;
}

function fetchCFLData(category,categoryAPI,option,statCategory="") {
  let url = "https://cors-anywhere.herokuapp.com/api.cfl.ca/v1/";
  let key = "key=Kozi9mJuQEY9FwloBAoST4PGdNrzvzK4";
  let params = "";

  if (option === PLAYERS)
    params = 'page[number]=1&page[size]=100&';

  fetch(url + categoryAPI + '?' + params + key, {mode: 'cors'})
  .then(function(response) {
    return response.json();
  }).then(function(json) {

    let results = '<h1 class="resultsHeader">' + category + "</h1>";
    console.log(json);
    //'option' parameter is the number pertaining to the category
    switch(option) {
      case GAMES: //games
        results += getGames(json);
        break;
      case PLAYERS: //players
        results += getPlayers(json);
        break;
      case LEADERS: //leaders
        results += getLeaders(json);
        break;
      case STANDINGS: //standings
        results += getStandings(json);
        break;
      case TEAMS: //teams
        results += getTeams(json);
        break;
      case VENUES: //venues
        results += getVenues(json);
    }
    document.getElementById('data').innerHTML = results;
  }).catch(function(error) {
    console.log(error);
    document.getElementById('data').innerHTML = "could not fetch data";
  })
};

document.getElementById('dropDown').onchange = function(event) {
  event.preventDefault();

  //remove grey cup highlights video
  document.getElementById('video').innerHTML = "";

  //get the category from the dropdown
  let categoryAPI = document.getElementById('dropDown').value;

  //if the category is games, leaders, or standings, prompt for the desired season
  if (categoryAPI === 'games/' || categoryAPI === 'leaders/' || categoryAPI === 'standings/') {

    let seasonForm = "<h2>Enter a year: </h2>";
    seasonForm += '<input id="seasonInput" type="text"></input>';
    seasonForm += '<input id="seasonSubmit" type="submit" value=" submit ">';
    document.getElementById('seasonForm').innerHTML = seasonForm;

    //for formatting between options
    if (categoryAPI != 'leaders/')
      document.getElementById('statCategoryForm').innerHTML = "";

    //season event listener
    document.getElementById('seasonSubmit').addEventListener('click',function(event) {
      event.preventDefault();
      let season = document.getElementById('seasonInput').value;

      //if leaders, prompt for a statistical category
      //if games or standings, call fetchCFLData
      if (categoryAPI === 'leaders/') {

        let statCategoryForm = "<h2>Select a Category: </h2>";
        statCategoryForm += '<select id="statCategorySelect">';
        statCategoryForm += '<option value=""></option>';
        statCategoryForm += '<option value="converts">Extra Points</option>';
        statCategoryForm += '<option value="converts_2pt">2-pt Conversions</option>';
        statCategoryForm += '<option value="field_goal_missed_return_yards">';
        statCategoryForm += 'Missed Field Goal Return Yards</option>';

        statCategoryForm += '<option value="fumbles_forced">Forced Fumbles</option>';
        statCategoryForm += '<option value="fumbles_recoveries">Fumbles Recovered</option>';
        statCategoryForm += '<option value="interceptions">Interceptions</option>';
        statCategoryForm += '<option value="kickoff_return_yards">Kickoff Return Yards</option>';
        statCategoryForm += '<option value="kickoff_yards">Kickoff Yards</option>';
        statCategoryForm += '<option value="kicks_blocked">Blocked Kicks</option>';
        statCategoryForm += '<option value="passing_touchdowns">Passing Touchdowns</option>';
        statCategoryForm += '<option value="passing_yards">Passing Yards</option>';
        statCategoryForm += '<option value="receiving_touchdowns">Touchdown Receptions</option>';
        statCategoryForm += '<option value="receiving_yards">Receiving Yards</option>';
        statCategoryForm += '<option value="receiving_caught">Catches</option>';
        statCategoryForm += '<option value="receiving_targeted">Targets</option>';
        statCategoryForm += '<option value="return_yards">Return Yards</option>';
        statCategoryForm += '<option value="rushing_touchdowns">Rushing Touchdowns</option>';
        statCategoryForm += '<option value="rushing_yards">Rushing Yards</option>';
        statCategoryForm += '<option value="sacks">Sacks</option>';
        statCategoryForm += '<option value="tackles_defensive">Tackles</option>';
        statCategoryForm += "</select>";

        document.getElementById('statCategoryForm').innerHTML = statCategoryForm;
        //statistical category listener
        document.getElementById('statCategorySelect').onchange = function(event) {
          event.preventDefault();

          let statCategory = document.getElementById('statCategorySelect');
          let stat = statCategory.options[statCategory.selectedIndex].text;
          let category = season + " " + stat + " Leaders:";
          fetchCFLData(category,categoryAPI+season+"/category/"+statCategory.value,LEADERS);
        }
      } else if (categoryAPI === 'games/') {
          fetchCFLData(season + " Games:",categoryAPI+season,GAMES);
        } else //standings
          fetchCFLData(season + " League Standings:",categoryAPI+season,STANDINGS);
    });

  } else { //if players, teams, or venues, no need to prompt for additional info
    document.getElementById('seasonForm').innerHTML = "";
    document.getElementById('statCategoryForm').innerHTML = "";

    if (categoryAPI === 'players') {
      fetchCFLData("Current Players:",categoryAPI,PLAYERS);
    } else if (categoryAPI === 'teams') {
      fetchCFLData("All Teams:",categoryAPI,TEAMS);
    } else if (categoryAPI === 'teams/venues') {
      fetchCFLData("CFL Venues:",categoryAPI,VENUES);
    }
  }
};
