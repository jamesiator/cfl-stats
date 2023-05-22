/* TODO
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

const BASE_URL = 'http://api.cfl.ca/v1';

const dataField = document.getElementById('data');
const videoField = document.getElementById('video');

const categoryDropdownOptions = {
  '': '',
  'games/': 'Games',
  'players': 'Players',
  'leaders/': 'Stat Leaders',
  'standings/': 'League Standings',
  'teams': 'Teams',
  'teams/venues': 'Venues'
};

const statCategoryDropdownOptions = {
  '': '',
  'converts': 'Extra Points',
  'converts_2pt': '2-pt Conversions',
  'field_goal_missed_return_yards': 'Missed Field Goal Return Yards',
  'fumbles_forced': 'Forced Fumbles',
  'fumbles_recoveries': 'Fumbles Recovered',
  'interceptions': 'Interceptions',
  'kickoff_return_yards': 'Kickoff Return Yards',
  'kickoff_yards': 'Kickoff Yards',
  'kicks_blocked': 'Blocked Kicks',
  'passing_touchdowns': 'Passing Touchdowns',
  'passing_yards': 'Passing Yards',
  'receiving_touchdowns': 'Touchdown Receptions',
  'receiving_yards': 'Receiving Yards',
  'receiving_caught': 'Catches',
  'receiving_targeted': 'Targets',
  'return_yards': 'Return Yards',
  'rushing_touchdowns': 'Rushing Touchdowns',
  'rushing_yards': 'Rushing Yards',
  'sacks': 'Sacks',
  'tackles_defensive': 'Tackles'
};

window.onload = function() {
  let dropdownString = '';
  Object.entries(categoryDropdownOptions).forEach(([value, label]) => {
    dropdownString += `<option value="${value}">${label}</option>`;
  });
  document.getElementById('categorySelect').innerHTML = dropdownString;

  dropdownString = '';
  Object.entries(statCategoryDropdownOptions).forEach(([value, label]) => {
    dropdownString += `<option value="${value}">${label}</option>`;
  });
  document.getElementById('statCategorySelect').innerHTML = dropdownString;
};

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
  
  let results = '';

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

  let results = '<ul>';

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
 */
async function getData(category,categoryAPI,option) {
  const key = 'Kozi9mJuQEY9FwloBAoST4PGdNrzvzK4';
  let params = '';

  // TODO: allow page scrolling (request different page numbers)
  if (option === PLAYERS) {
    params = 'page[number]=1&page[size]=100&';
  }

  try {
    const url = `${BASE_URL}/${categoryAPI}?${params}key=${key}`;
    console.log(`url=${url}`);
    const {data} = await axios.get(url);
    console.log(data);

    let results = `<h1 class="resultsHeader">${category}</h1>`;

    switch(option) {
      case GAMES:
        return `${results}${showGames(data)}`;
      case PLAYERS:
        return `${results}${showPlayers(data)}`;
      case LEADERS:
        return `${results}${showLeaders(data)}`;
      case STANDINGS:
        return `${results}${showStandings(data)}`;
      case TEAMS:
        return `${results}${showTeams(data)}`;
      case VENUES:
        return `${results}${showVenues(data)}`;
    }

  } catch (error) {
    console.log(error);
    return 'could not fetch data';
  }
}

function hideVideo() {
  videoField.className = 'hidden';
  dataField.className = '';
}

function hideData() {
  videoField.className = '';
  dataField.className = 'hidden';
}

/**
 * Configure event listener for dropdown change
 * 
 * Options:
 * - Games
 * - Players
 * - Stat Leaders
 * - League standings
 * - Teams
 * - Venues
 */
document.getElementById('categorySelect').onchange = async function(event) {
  event.preventDefault();

  //get the category from the dropdown
  let categoryAPI = document.getElementById('categorySelect').value;

  // hide/unhide video/data accordingly
  if (categoryAPI === '') {
    hideData();
  } else {
    hideVideo();
  }

  //if the category is games, leaders, or standings, prompt for the desired season
  if (categoryAPI === 'games/' || categoryAPI === 'leaders/' || categoryAPI === 'standings/') {

    document.getElementById('seasonForm').className = '';

    //for formatting between options
    if (categoryAPI === 'leaders/')
      document.getElementById('statCategoryForm').className = '';
    else
      document.getElementById('statCategoryForm').className = 'hidden';

    //season event listener
    document.getElementById('seasonSubmit').addEventListener('click', async function(event) {
      event.preventDefault();
      let season = document.getElementById('seasonInput').value;

      //if leaders, prompt for a statistical category
      //if games or standings, call fetchCFLData
      if (categoryAPI === 'leaders/') {

        document.getElementById('statCategoryForm').className = '';

        document.getElementById('statCategorySelect').onchange = async function(event) {
          event.preventDefault();

          let statCategory = document.getElementById('statCategorySelect');
          let stat = statCategory.options[statCategory.selectedIndex].text;
          dataField.innerHTML = await getData(
            `${season} ${stat} Leaders:`,
            `${categoryAPI}${season}/category/${statCategory.value}`,
            LEADERS
          );
        }
      } else if (categoryAPI === 'games/') {
        dataField.innerHTML = await getData(
          `${season} Games:`,
          `${categoryAPI}${season}`,
          GAMES
        );
      } else //standings
      dataField.innerHTML = await getData(
        `${season} League Standings:`,
        `${categoryAPI}${season}`,
        STANDINGS
      );
    });

  } else { //if players, teams, or venues, no need to prompt for additional info
    document.getElementById('seasonForm').className = 'hidden';
    document.getElementById('statCategoryForm').className = 'hidden';

    if (categoryAPI === 'players') {
      dataField.innerHTML = await getData(
        'Current Players:',
        categoryAPI,
        PLAYERS
      );
    } else if (categoryAPI === 'teams') {
      dataField.innerHTML = await getData(
        'All Teams:',
        categoryAPI,
        TEAMS
      );
    } else if (categoryAPI === 'teams/venues') {
      dataField.innerHTML = await getData(
        'CFL Venues:',
        categoryAPI,
        VENUES
      );
    }
  }
}
