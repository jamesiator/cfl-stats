/* TODO
  - refactor helper method names
  - hide/unhide video instead of removing html
  - create enum for leaders dropdown
  - remove unused statCategory param?
  - put category/year/leader-category all on one line?
  - GET /teams on inital page load, store for later use (logo next to game scores, player names, etc.)
  - don't clear leader-category when inputting new year
  - store queries?
  - html/css: make background of page dark gray (no white space under footer for short pages)
*/

const GAMES = 1;
const PLAYERS = 2;
const LEADERS = 3;
const STANDINGS = 4;
const TEAMS = 5;
const VENUES = 6;

/**
 * Helper method for displaying game data
 * 
 * @param {Array} data 'data' attribute of json returned from api.cfl.ca/v1/games/[season]
 * @returns {String} html in string format to display games
 */
function showGames({data}) {
  // TODO: team logos, don't display scores of games that haven't started yet

  const PRESEASON = 0;
  const REG_SEASON = 1;
  let results = '';

  data.forEach(({event_type, team_1, team_2, date_start, venue}) => {
    // don't display any preseason games
    if (event_type.event_type_id != PRESEASON) {
      results += '<br><hr><br><div class="gameInfoContainer"><div class="gameInfo">';
      results += `<div><h2>${team_1.location}</h2>`;
      results += `<h3 style="color: #d92b2b">${team_1.nickname}</h3>`;
      results += `<p>${team_1.score}</p></div>`;

      results += '<div class="atBox"><h1>at</h1></div>';

      results += `<div><h2>${team_2.location}</h2>`;
      results += `<h3 style="color: #d92b2b">${team_2.nickname}</h3>`;
      results += `<p>${team_2.score}</p></div>`;
      results += '</div>';

      // if the game is not a regular season game, display event title (grey cup, etc.)
      if (event_type.event_type_id != REG_SEASON)
        results += `<p>${event_type.title}</p>`;

      results += `<p>${moment(date_start).format('MMM Do, YYYY')}</p>`;
      results += `<p>${venue.name}</p></div>`;
    }
  });

  return results;
};

/**
 * Helper method for displaying player data
 * 
 * @param {Array} data 'data' attribute of json returned from api.cfl.ca/v1/players
 * @returns {String} html in string format to display players
 */
function showPlayers({data}) {
  //TODO: team logos next to players

  let results = '';

  data.forEach(({first_name, last_name, position, school}) => {
    results += `<br><h2>${first_name} ${last_name}</h2>`;
    results += `<p>- Position: ${position.description}</p>`;
    results += `<p>- School: ${school.name}</p>`;
  });

  return results;
};

/**
 * Helper method for displaying stat leader data
 * 
 * @param {Array} data 'data' attribute of json returned from api.cfl.ca/v1/leaders/[season]/category/[category]
 * @returns {String} html in string format to display stat leaders
 */
function showLeaders({data}) {
  //TODO: store team logos in accessible data structure, display next to players

  let results = '';
  const info = document.getElementById('statCategorySelect');
  const stat = info.options[info.selectedIndex].text;

  data.forEach(leader => {
    results += `<br><h2>${leader.first_name} ${leader.last_name} (${leader.team_location})</h2>`;
    results += `<p>- ${stat}: ${leader[info.value]}</p>`
  });

  return results;
};

/**
 * Helper method for displaying league standings
 * 
 * @param {Object} data 'data' attribute of json returned from api.cfl.ca/v1/standings/[season]
 * @returns {String} html in string format to display standings
 */
function showStandings({data}) {
  //TODO: put team logos next to city names

  let results = '<br><div class="standings">';

  Object.values(data.divisions).forEach(({division_name, standings}) => {
    results += `<div><h1>${division_name}<h1><table><tr><th>Team</th><th>Record</th>`;
    
    Object.values(standings).forEach(({location, wins, losses, division_wins, division_losses}) => {
      results += `<tr><td>${location}</td><td>${wins} - ${losses} (${division_wins} - ${division_losses})</td></tr>`;
    });

    results += `</table></div>`;
  });

  return results;
};

/**
 * Helper method for displaying teams
 * 
 * @param {Array} data 'data' attribute of json returned from api.cfl.ca/v1/teams
 * @returns {String} html in string format to display standings
 */
function showTeams({data}) {
  
  let results = "";

  data.forEach(({images, full_name, division_name, venue_name}) => {
    results += `<br><hr><br><div class="team"><img src="${images.logo_image_url}">`;
    results += `<div class="teamInfo"><h1>${full_name}</h1>`;
    results += `<p>Division: ${division_name}</p><p>Venue: ${venue_name}</p></div></div>`;
  });

  return results;
};

/**
 * Helper method for displaying venues
 * 
 * @param {Array} data 'data' attribute of json returned from api.cfl.ca/v1/teams/venues
 * @returns {String} html in string format to display team venues
 */
function showVenues({data}) {
  //TODO: team logos

  let results = "<ul>";

  data.forEach(venue => {
    if (venue.Capacity != null) {
      results += `<br><li><h2>${venue.Name}</h2> - Capacity: ${venue.Capacity}</li>`;
    }
  });

  results += '</ul>';
  return results;
}

/**
 * Fetch the data
 * 
 * @param {String} category the category selected by the user in the dropdown
 * @param {String} categoryAPI the API endpoint pertaining to the selected category
 * @param {String} option something for players...?
 * @param {String} statCategory not currently used...
 */
function fetchCFLData(category,categoryAPI,option,statCategory="") {
  const url = 'https://api.cfl.ca/v1/'
  const key = 'Kozi9mJuQEY9FwloBAoST4PGdNrzvzK4';
  let params = '';

  if (option === PLAYERS) {
    params = 'page[number]=1&page[size]=100&';
  }

  axios.get(`${url}${categoryAPI}?${params}key=${key}`)
  .then(function(response) {
    return response.data;
  })
  .then(function(data) {

    let results = '<h1 class="resultsHeader">' + category + "</h1>";
    console.log(data);
    //'option' parameter is the number pertaining to the category
    switch(option) {
      case GAMES: //games
        results += showGames(data);
        break;
      case PLAYERS: //players
        results += showPlayers(data);
        break;
      case LEADERS: //leaders
        results += showLeaders(data);
        break;
      case STANDINGS: //standings
        results += showStandings(data);
        break;
      case TEAMS: //teams
        results += showTeams(data);
        break;
      case VENUES: //venues
        results += showVenues(data);
    }
    document.getElementById('data').innerHTML = results;
  })
  .catch(function(error) {
    console.log(error);
    document.getElementById('data').innerHTML = "could not fetch data";
  })
};

document.getElementById('dropDown').onchange = function(event) {
  event.preventDefault();

  //hide grey cup highlights video
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
        statCategoryForm += '<option value="field_goal_missed_return_yards">Missed Field Goal Return Yards</option>';
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
