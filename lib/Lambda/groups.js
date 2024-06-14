//got from /standings?league=4&season=2024
const axios = require("axios");
const { createRequest, sendToSlack } = require("./commons");
const alreadyOut = ["U01EL08LY12", "U01G23QUMD2", "U01E8924VMM"];
const people = require("./maps/teams");

let peopleTeams = {};
for (let team in people) {
  if (peopleTeams[people[team].userId]) {
    peopleTeams[people[team].userId] = [
      ...peopleTeams[people[team].userId],
      team,
    ];
  } else {
    peopleTeams[people[team].userId] = [team];
  }
}

let currentStandings = createRequest("standings?league=4&season=2024");

axios(currentStandings).then((gameResult) => {
  let teams = gameResult.data.response[0].league.standings.flat();
  //   console.log(JSON.stringify(teams, null, 2));
  let resolvedteams = {};

  for (let aPerson in peopleTeams) {
    for (let aTeam of peopleTeams[aPerson]) {
      let team = teams.find((thing) => {
        return thing.team.id == aTeam;
      });
      if (resolvedteams[aPerson]) {
        resolvedteams[aPerson] = [...resolvedteams[aPerson], team];
      } else {
        resolvedteams[aPerson] = [team];
      }
    }
  }

  const outPeople = [];
  //check if both descriptions = null
  for (let checkPerson in resolvedteams) {
    console.log(checkPerson);
    console.log(resolvedteams[checkPerson]);
    // if (alreadyOut.includes(checkPerson)) continue;
    if (resolvedteams[checkPerson].every((one) => one.description === null)) {
      outPeople.push(checkPerson);
    }
  }
  //   for each person in outPeople
  //   get the teams from peopleTeams
  //   convert that into names from people
  //   send a message

  const outmessages = [
    (team1, team2, person) =>
      `<@${person}> please let the door hit you on the way out. ${team1} and ${team2} are no more`,
    (team1, team2, person) =>
      `${team1} and ${team2} were a poor choice wernt they <@${person}>`,
    (team1, team2, person) =>
      `Back to the day job <@${person}>. ${team1} and ${team2} couldn't stand the heat in Qatar`,
  ];
  let counter = 0;
  for (let outPerson of outPeople) {
    let team1 = people[peopleTeams[outPerson][0]].name;
    let team2 = people[peopleTeams[outPerson][1]].name;
    const leavingMessage = outmessages[counter](team1, team2, outPerson);
    console.log(leavingMessage);
    // sendToSlack(leavingMessage);
    counter++;
  }
});
