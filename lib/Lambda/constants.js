const { apiKey } = process.env;

const headers = {
  "x-apisports-key": apiKey,
};
const BASE_URL = "https://v3.football.api-sports.io";

module.exports = {
  headers,
  BASE_URL,
};
