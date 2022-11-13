const axios = require("axios");
const { sqsQueue, slackWebhookUrl } = process.env;
const aws = require("aws-sdk");
const schedules = require("./maps/schedules.json");
const people = require("./maps/teams");
const {
  startingMessages,
  middleMessageDraw,
  middleMessageWinner,
  nilnilMiddle,
  endMessageDraw,
  endMessage,
  personAisB,
} = require("./maps/messages");
const { headers, BASE_URL } = require("./constants");

const sqs = new aws.SQS();

const baseMessageAttributes = {
  QueueUrl: sqsQueue,
  MessageAttributes: {
    temp: {
      DataType: "String",
      StringValue: "NewUser",
    },
  },
};

module.exports.index = async (event) => {
  console.log(event);
  if (event.Records) {
    for (let singleEvent of event.Records) {
      const messageBody = JSON.parse(singleEvent.body);
      if (messageBody.delay) {
        if (messageBody.delay === "delay0") {
          await sqs
            .sendMessage({
              MessageBody: JSON.stringify({
                ...JSON.parse(singleEvent.body),
                delay: "delay1",
              }),
              DelaySeconds: "900",
              ...baseMessageAttributes,
            })
            .promise();
        }
        if (messageBody.delay === "delay1") {
          await sqs
            .sendMessage({
              MessageBody: JSON.stringify({
                ...JSON.parse(singleEvent.body),
                delay: "delay2",
              }),
              DelaySeconds: "900",
              ...baseMessageAttributes,
            })
            .promise();
        }
        if (messageBody.delay === "delay2") {
          const { delay, ...rest } = messageBody;
          await sqs
            .sendMessage({
              MessageBody: JSON.stringify({
                ...rest,
              }),
              DelaySeconds: "900",
              ...baseMessageAttributes,
            })
            .promise();
        }
      } else {
        if (messageBody.type === "mid") {
          const gameParameters = createRequest(
            `fixtures?id=${messageBody.gameId}`
          );
          const gameResult = await axios(gameParameters);
          const gameStatus = gameResult.data.response[0].fixture.status;

          const gameScore = gameResult.data.response[0].score;
          const gameGoals = gameResult.data.response[0].goals;

          //
          // check current status of game
          //use incoming to create message
          //random to target it at the winner or the loser
          // send delayed sqs

          if (gameStatus.short === "HT") {
            //work out a message
            let personAScore = gameGoals.home;
            let personBScore = gameGoals.away;
            if (personAScore == 0 && personBScore == 0) {
              let randomMessage = Math.floor(
                Math.random() * nilnilMiddle.length
              );
              let messageFunction = nilnilMiddle[randomMessage];
              messageToSend = messageFunction(
                messageBody.personA,
                messageBody.personB,
                messageBody.teamA,
                messageBody.teamB
              );

              await sendToSlack(messageToSend);
            } else if (personAScore === personBScore) {
              let randomMessage = Math.floor(
                Math.random() * middleMessageDraw.length
              );
              let messageFunction = middleMessageDraw[randomMessage];
              messageToSend = messageFunction(
                messageBody.personA,
                messageBody.personB,
                messageBody.teamA,
                messageBody.teamB
              );

              await sendToSlack(messageToSend);
            } else if (personAScore > personBScore) {
              let randomMessage = Math.floor(
                Math.random() * middleMessageWinner.length
              );
              let messageFunction = middleMessageWinner[randomMessage];
              messageToSend = messageFunction(
                messageBody.personA,
                messageBody.personB,
                messageBody.teamA,
                messageBody.teamB,
                personAScore,
                personBScore
              );
              await sendToSlack(messageToSend);
            } else if (personAScore < personBScore) {
              let randomMessage = Math.floor(
                Math.random() * middleMessageWinner.length
              );
              let messageFunction = middleMessageWinner[randomMessage];
              messageToSend = messageFunction(
                messageBody.personB,
                messageBody.personA,
                messageBody.teamB,
                messageBody.teamA,
                personBScore,
                personAScore
              );

              await sendToSlack(messageToSend);
            }

            await sqs
              .sendMessage({
                MessageBody: JSON.stringify({
                  ...messageBody,
                  delay: "delay0",
                  type: "end",
                }),
                DelaySeconds: "900",
                ...baseMessageAttributes,
              })
              .promise();
          } else {
            await sqs
              .sendMessage({
                MessageBody: JSON.stringify({
                  ...messageBody,
                }),
                DelaySeconds: "120",
                ...baseMessageAttributes,
              })
              .promise();
          }
        }
        if (messageBody.type === "end") {
          const gameParameters = createRequest(
            `fixtures?id=${messageBody.gameId}`
          );
          const gameResult = await axios(gameParameters);
          const gameStatus = gameResult.data.response[0].fixture.status;
          try {
            console.log(JSON.stringify(gameResult.data.response[0], null, 2));
          } catch (errorInString) {
            console.error(errorInString);
          }
          console.log(gameResult.data.response[0]);
          console.log(gameStatus);
          const gameScore = gameResult.data.response[0].score;
          const gameGoals = gameResult.data.response[0].goals;
          console.log(gameScore);
          console.log(gameGoals);
          //check if the game has finished
          //if not then delay a two minute sqs
          // if it has
          // random to target winner or loser and send message

          if (["FT", "AET", "PEN"].includes(gameStatus.short)) {
            // if it is et then send one 15 minutes away on delay 2
            let personAScore;
            let personBScore;

            if ("PEN" === gameStatus.short) {
              personAScore = gameScore.penalty.home;
              personBScore = gameScore.penalty.away;
            } else if ("AET" === gameStatus.short) {
              personAScore = gameScore.extratime.home;
              personBScore = gameScore.extratime.away;
            } else {
              personAScore = gameGoals.home;
              personBScore = gameGoals.away;
            }
            if (personAScore === personBScore) {
              let randomMessage = Math.floor(
                Math.random() * endMessageDraw.length
              );
              let messageFunction = endMessageDraw[randomMessage];
              messageToSend = messageFunction(
                messageBody.personA,
                messageBody.personB,
                messageBody.teamA,
                messageBody.teamB
              );

              await sendToSlack(messageToSend);
            } else if (personAScore > personBScore) {
              let randomMessage = Math.floor(Math.random() * endMessage.length);
              let messageFunction = endMessage[randomMessage];
              messageToSend = messageFunction(
                messageBody.personA,
                messageBody.personB,
                messageBody.teamA,
                messageBody.teamB,
                personAScore,
                personBScore
              );

              await sendToSlack(messageToSend);
            } else if (personAScore < personBScore) {
              let randomMessage = Math.floor(Math.random() * endMessage.length);
              let messageFunction = endMessage[randomMessage];
              messageToSend = messageFunction(
                messageBody.personB,
                messageBody.personA,
                messageBody.teamB,
                messageBody.teamA,
                personBScore,
                personAScore
              );

              await sendToSlack(messageToSend);
            }
            await sendToSlack(
              `Glad I get to have a break now. See you for the next sweepstake!`
            );
          } else {
            await sqs
              .sendMessage({
                MessageBody: JSON.stringify({
                  ...messageBody,
                }),
                DelaySeconds: "300",
                ...baseMessageAttributes,
              })
              .promise();
          }
        }
      }
    }
    return;
  } else {
    try {
      const currentGames = schedules[event.time];
      if (!currentGames) {
        return;
      }
      await sendToSlack(
        `I would like to apologise for missing the last games. I was on strike, its the thing to do now.`
      );

      const fixtureMap = currentGames.map(async (gameId) => {
        const gameParameters = createRequest(`fixtures?id=${gameId}`);
        const gameResult = await axios(gameParameters);

        return gameResult.data;
      });
      const resolvedMap = await Promise.all(fixtureMap);

      for (let response of resolvedMap) {
        const { fixture, teams, goals, score } = response.response[0];

        let randomMessage = Math.floor(Math.random() * startingMessages.length);
        let messageFunction = startingMessages[randomMessage];

        let messageToSend;
        if (
          people[`${teams.home.id}`].userId ===
          people[`${teams.away.id}`].userId
        ) {
          let randomMessage = Math.floor(Math.random() * personAisB.length);
          let messageFunctionAB = personAisB[randomMessage];
          messageToSend = messageFunctionAB(
            people[`${teams.home.id}`].userId,
            teams.home.name,
            teams.away.name
          );
        } else {
          messageToSend = messageFunction(
            people[`${teams.home.id}`].userId,
            people[`${teams.away.id}`].userId,
            teams.home.name,
            teams.away.name
          );
        }

        await sendToSlack(messageToSend);

        await sqs
          .sendMessage({
            MessageBody: JSON.stringify({
              gameId: fixture.id,
              personA: people[`${teams.home.id}`].userId,
              personB: people[`${teams.away.id}`].userId,
              teamA: teams.home.name,
              teamB: teams.away.name,
              delay: "delay1",
              type: "mid",
            }),
            DelaySeconds: "900",
            ...baseMessageAttributes,
          })
          .promise();
      }
    } catch (e) {
      console.error(e);
    }
  }
};

const createRequest = (endpoint) => {
  return {
    method: "get",
    url: `${BASE_URL}/${endpoint}`,
    headers,
  };
};

const sendToSlack = async (message) => {
  return axios.post(slackWebhookUrl, {
    channel: "C04BPELE5B6",
    text: message,
    icon_emoji: ":soccer:",
  });
};