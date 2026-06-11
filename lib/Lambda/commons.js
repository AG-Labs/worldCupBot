const { apiKey, slackWebhookUrl, channel } = process.env;

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
  const response = await fetch(slackWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: channel,
      text: message,
      icon_emoji: ":soccer:",
    }),
  });
  if (!response.ok) {
    throw new Error(`Slack webhook error! status: ${response.status}`);
  }
  return response;
};

module.exports = {
  createRequest,
  sendToSlack,
};
