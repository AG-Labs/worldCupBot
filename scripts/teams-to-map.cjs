#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const usage = `Usage:
  node scripts/teams-to-map.cjs [input.json]

Reads outputs/teams.json by default and prints teams.js content to stdout.
It does not write or replace lib/Lambda/maps/teams.js.

Accepted input shapes:
  - [{ "team": { "id": 1, "name": "Belgium", "code": "BEL" } }]
  - { "response": [{ "team": { "id": 1, "name": "Belgium", "code": "BEL" } }] }
`;

const repoRoot = path.resolve(__dirname, "..");
const defaultInputPath = "outputs/teams.json";
const [, , inputPath] = process.argv;

function readInput(filePath) {
  if (filePath === "-") {
    return fs.readFileSync(0, "utf8");
  }

  return fs.readFileSync(path.resolve(repoRoot, filePath || defaultInputPath), "utf8");
}

function getTeamResponses(input) {
  if (Array.isArray(input)) {
    return input;
  }

  if (Array.isArray(input.response)) {
    return input.response;
  }

  throw new Error("Could not find teams. Expected an array or a response array.");
}

function jsString(value) {
  return JSON.stringify(value ?? "");
}

function teamId(teamResponse) {
  return teamResponse.team?.id;
}

function buildTeamsFile(teamResponses) {
  const teams = teamResponses
    .filter((teamResponse) => teamId(teamResponse) !== undefined && teamId(teamResponse) !== null)
    .sort((first, second) => teamId(first) - teamId(second));

  const teamLines = teams.map(({ team }) => {
    return `  ${team.id}: { name: ${jsString(team.name)}, code: ${jsString(
      team.code,
    )}, user: "", userId: "" },`;
  });

  return `const teams = {
${teamLines.join("\n")}
};

module.exports = teams;
`;
}

try {
  const rawInput = readInput(inputPath);

  if (!rawInput.trim()) {
    throw new Error("No JSON input received.");
  }

  process.stdout.write(buildTeamsFile(getTeamResponses(JSON.parse(rawInput))));
} catch (error) {
  console.error(error.message);
  console.error(usage);
  process.exit(1);
}
