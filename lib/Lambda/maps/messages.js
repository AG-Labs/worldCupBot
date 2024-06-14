const startingMessages = [
  (personA, personB, teamA, teamB) =>
    `Its all about to kick off with <@${personA}> ${teamA} against <@${personB}> ${teamB}.`,
  (personA, personB, teamA, teamB) =>
    `<@${personA}> are you sure ${teamA} can win against <@${personB}>'s ${teamB}?`,
  (personA, personB, teamA, teamB) =>
    `Lets go!!! <@${personA}> ${teamA} Vs <@${personB}> ${teamB}.`,
  (personA, personB, teamA, teamB) =>
    `<@${personA}> ${teamA} is facing off against <@${personB}> ${teamB}.`,
  (personA, personB, teamA, teamB) =>
    `Who is your winner <@${personA}> with ${teamA} or <@${personB}> with ${teamB}?`,
  (personA, personB, teamA, teamB) =>
    `<@${personA}> ${teamA} with <@${personB}> ${teamB}, my money is on <@${personA}>`,
  (personA, personB, teamA, teamB) =>
    `<@${personB}> ${teamB} with <@${personA}> ${teamA}, my money is on <@${personB}>`,
];
const finalStartingMessages = [
  (personA, personB, teamA, teamB) =>
    `This is it!!! The final <@${personB}> ${teamB} up against <@${personA}> ${teamA}. Its all to play for.`,
];

const middleMessageWinner = [
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `Can ${losingTeam} turn it around. I dont think so, sorry <@${losingPerson}>.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}.`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `Can ${losingTeam} turn it around. Go on <@${losingPerson}>!\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `I believe <@${winningPerson}> can take it all the way with ${winningTeam}.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `<@${winningPerson}> is going to bottle it I can feel it. Sorry ${winningTeam}.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `Should have listened to Paddy Power and bet on<@${winningPerson}>. ${winningTeam} are on the way to the top.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `Is it coming home <@${winningPerson}>.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `And its <@${winningPerson}> in the lead, thats a surprise.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
];
const finalMiddleMessageWinner = [
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `And its <@${winningPerson}> in the lead, thats a surprise.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
];

const middleMessageDraw = [
  (personA, personB, teamA, teamB) =>
    `Still all to play for. Maybe <@${personA}> can get ahead`,
  (personA, personB, teamA, teamB) =>
    `I think <@${personB}> can take the lead. Come on ${teamB}`,
  (personA, personB, teamA, teamB) =>
    `${teamA} have something up their sleeve, <@${personA}> knows it.`,
  (personA, personB, teamA, teamB) =>
    `No one is closer to the jackpot at this point`,
  (personA, personB, teamA, teamB) =>
    `You would have thought id have better messages for a draw by now. You're wrong`,
  (personA, personB, teamA, teamB) =>
    `Is this a good game? I'm not actually programmed to know.`,
];
const finalMiddleMessageDraw = [
  (personA, personB, teamA, teamB) =>
    `Really, you are doing this in the final?`,
];
const nilnilMiddle = [
  (personA, personB, teamA, teamB) =>
    `Would be nice if one of you got a goal <@${personA}> <@${personB}>`,
  (personA, personB, teamA, teamB) =>
    `Maybe the second half will be better. Do me a favour <@${personA}>.`,
  (personA, personB, teamA, teamB) =>
    `Maybe the second half will be better. Do me a favour <@${personB}>.`,
  (personA, personB, teamA, teamB) => `My bet is on <@${personA}>.`,
  (personA, personB, teamA, teamB) => `My bet is on <@${personB}>.`,
  (personA, personB, teamA, teamB) => `Id rather be watching the rugby.`,
  (personA, personB, teamA, teamB) => `Tax returns are more fun than this.`,
  (personA, personB, teamA, teamB) =>
    `Reckon you can break the deadlock <@${personA}>?`,
  (personA, personB, teamA, teamB) =>
    `No one is closer to the jackpot at this point`,
  (personA, personB, teamA, teamB) =>
    `Is this a good game? I'm not actually programmed to know.`,
  (personA, personB, teamA, teamB) => `Couldnt score in a brothel`,
];
const finalNilnilMiddle = [
  (personA, personB, teamA, teamB) =>
    `Really, you are doing this in the final?`,
];

const endMessage = [
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `Knew <@${winningPerson}> and ${winningTeam} had it in the bag.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `Soz <@${losingPerson}>.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `${winningTeam} and <@${winningPerson}> are one step closer to the prize.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `This is a bit shit isnt it <@${losingPerson}>.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `May as well rip up that fiver now <@${losingPerson}>.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `<@${winningPerson}> is already planning what to spend the winnings on.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `Cost of living crisis just got worse for <@${losingPerson}>.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `Its going to be a cold christmas for <@${losingPerson}>.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `Looks like <@${winningPerson}> will be able to keep the heating on little longer.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `Classic ${losingTeam} losing like this.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) => `<@${losingPerson}> :middle_finger:`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `<@${losingPerson}> You're outta here!\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `Please leave <@${losingPerson}>.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `Never doubted you for a second <@${winningPerson}>.\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
];
const finalEndMessage = [
  (
    winningPerson,
    losingPerson,
    winningTeam,
    losingTeam,
    winningScore,
    losingScore
  ) =>
    `<@${winningPerson}> takes the lot!! :partying_face: :partyparrot: :partyparrot: :partyparrot: :partying_face:\n${winningTeam}: ${winningScore} - ${losingTeam}: ${losingScore}`,
];

const endMessageDraw = [
  (personA, personB, teamA, teamB) =>
    `This would never happen at the world cup.`,
  (personA, personB, teamA, teamB) => `More time im not getting back.`,
  (personA, personB, teamA, teamB) =>
    `You would have thought id have better messages for a draw by now. You're wrong`,
];

const personAisB = [
  (person, teamA, teamB) =>
    `Back playing with ourselves again are we <@${person}>?`,
  (person, teamA, teamB) =>
    `Everyone is a winner, <@${person}> with ${teamA} against <@${person}> again but now with ${teamB}. (Guess everyone is also kind of a loser :grimacing:)`,
];

module.exports = {
  startingMessages,
  middleMessageWinner,
  middleMessageDraw,
  nilnilMiddle,
  endMessage,
  endMessageDraw,
  finalStartingMessages,
  finalMiddleMessageWinner,
  finalMiddleMessageDraw,
  finalNilnilMiddle,
  finalEndMessage,
  personAisB,
};
