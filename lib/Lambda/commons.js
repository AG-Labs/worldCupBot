const { apiKey, slackWebhookUrl } = process.env;

const headers = {
  "x-apisports-key": apiKey,
};
const BASE_URL = "https://v3.football.api-sports.io";

const createRequest = (endpoint) => {
  return {
    method: "get",
    url: `${BASE_URL}/${endpoint}`,
    headers,
  };
};

const sendToSlack = async (message) => {
  return fetch(slackWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: "C076NS4L0Q6",
      text: message,
      icon_emoji: ":soccer:",
    }),
  });
};

module.exports = {
  createRequest,
  sendToSlack,
};
