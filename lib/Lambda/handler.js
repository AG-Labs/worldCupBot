const axios = require("axios");
const { sqsQueue } = process.env;
const aws = require("aws-sdk");
const schedules = require("./maps/schedules.json");
const people = require("./maps/teams");
const {
  // startingMessages,
  // middleMessageWinner,
  // middleMessageDraw,
  // nilnilMiddle,
  // endMessage,
  // endMessageDraw,
  finalStartingMessages,
  finalMiddleMessageWinner,
  finalMiddleMessageDraw,
  finalNilnilMiddle,
  finalEndMessage,
  personAisB,
} = require("./maps/messages");
const { createRequest, sendToSlack } = require("./commons");

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

const delayProgression = {
  delay0: "delay1",
  delay1: "delay2",
  delay2: null,
};
const delayBySQSMessage = async (eventBody) => {
  const delayType = eventBody.delay; //+1 needs a map to add one to the end
  await sqs
    .sendMessage({
      MessageBody: JSON.stringify({
        ...eventBody,
        delay: delayProgression[delayType], //need to check that delay of null is either handled or does not make it onto the message
      }),
      DelaySeconds: "900",
      ...baseMessageAttributes,
    })
    .promise();
};

module.exports.index = async (event) => {
  console.log(event);
  if (event.Records) {
    for (let singleEvent of event.Records) {
      const messageBody = JSON.parse(singleEvent.body);
      if (messageBody.delay) {
        await delayBySQSMessage(messageBody);
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
              // let randomMessage = Math.floor(
              //   Math.random() * nilnilMiddle.length
              // );
              // let messageFunction = nilnilMiddle[randomMessage];
              let messageFunction = finalNilnilMiddle[0];
              messageToSend = messageFunction(
                messageBody.personA,
                messageBody.personB,
                messageBody.teamA,
                messageBody.teamB
              );

              await sendToSlack(messageToSend);
            } else if (personAScore === personBScore) {
              // let randomMessage = Math.floor(
              //   Math.random() * middleMessageDraw.length
              // );
              // let messageFunction = middleMessageDraw[randomMessage];
              let messageFunction = finalMiddleMessageDraw[0];
              messageToSend = messageFunction(
                messageBody.personA,
                messageBody.personB,
                messageBody.teamA,
                messageBody.teamB
              );

              await sendToSlack(messageToSend);
            } else if (personAScore > personBScore) {
              // let randomMessage = Math.floor(
              //   Math.random() * middleMessageWinner.length
              // );
              // let messageFunction = middleMessageWinner[randomMessage];
              let messageFunction = finalMiddleMessageWinner[0];
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
              // let randomMessage = Math.floor(
              //   Math.random() * middleMessageWinner.length
              // );
              // let messageFunction = middleMessageWinner[randomMessage];
              let messageFunction = finalMiddleMessageWinner[0];
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
              // let randomMessage = Math.floor(Math.random() * endMessage.length);
              // let messageFunction = endMessage[randomMessage];
              let messageFunction = finalEndMessage[0];
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
              // let randomMessage = Math.floor(Math.random() * endMessage.length);
              // let messageFunction = endMessage[randomMessage];
              let messageFunction = finalEndMessage[0];
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
          } else if (gameStatus.short === "ET") {
            await sqs
              .sendMessage({
                MessageBody: JSON.stringify({
                  ...messageBody,
                }),
                DelaySeconds: "1800",
                ...baseMessageAttributes,
              })
              .promise();
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
        console.log("no game");
        return;
      }

      const fixtureMap = currentGames.map(async (gameId) => {
        const gameParameters = createRequest(`fixtures?id=${gameId}`);
        const gameResult = await axios(gameParameters);

        return gameResult.data;
      });
      const resolvedMap = await Promise.all(fixtureMap);

      for (let response of resolvedMap) {
        const { fixture, teams, goals, score } = response.response[0];

        // let randomMessage = Math.floor(Math.random() * startingMessages.length);
        // let messageFunction = startingMessages[randomMessage];
        let messageFunction = finalStartingMessages[0];

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

//ideas for next year, grab lots of the events run from cloudwatch and write some tests
// say some things about the goals or cards that have come out
// combine the split if for when someone is winning and just passin the params better no need for the duplication there
// could also write code in the 15 minute intervals to comment on things

// can the final be determined from the event rather than me changing the message funcs
// can we get scheduling automatically, could pr or load more into event bridge onece the inital schedule runs out
