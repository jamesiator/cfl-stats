const categoryDropdownOptions = {
  '': '',
  'games': 'Games',
  'players': 'Players',
  'leaders': 'Stat Leaders',
  'standings': 'League Standings',
  'teams': 'Teams',
  'teams/venues': 'Venues'
};

const statLeadersDropdownOptions = {
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

/**
 * On initial page load, populate dropdown values
 */
window.onload = function () {
  let dropdownString = '';
  Object.entries(categoryDropdownOptions).forEach(([value, label]) => {
    dropdownString += `<option value="${value}">${label}</option>`;
  });
document.getElementById('categorySelect').innerHTML = dropdownString;

  dropdownString = '';
  Object.entries(statLeadersDropdownOptions).forEach(([value, label]) => {
    dropdownString += `<option value="${value}">${label}</option>`;
  });
  document.getElementById('statLeadersSelect').innerHTML = dropdownString;
};