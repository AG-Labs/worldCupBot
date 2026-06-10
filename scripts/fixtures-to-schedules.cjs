#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const usage = `Usage:
  node scripts/fixtures-to-schedules.cjs [input.json]

Converts API-Football fixture JSON into:
{
  "fixture-date": ["fixture-id"]
}

The generated schedule is always written to lib/Lambda/maps/schedules.json.

Accepted input shapes:
  - { "response": [{ "fixture": { "id": 123, "date": "..." } }] }
  - [{ "fixture": { "id": 123, "date": "..." } }]
  - { "fixture": { "id": 123, "date": "..." } }
`;

const repoRoot = path.resolve(__dirname, "..");
const defaultInputPath = "outputs/fixtures.json";
const outputPath = path.join(repoRoot, "lib/Lambda/maps/schedules.json");
const [, , inputPath] = process.argv;

function readInput(filePath) {
  if (filePath === "-") {
    return fs.readFileSync(0, "utf8");
  }

  return fs.readFileSync(path.resolve(repoRoot, filePath || defaultInputPath), "utf8");
}

function getFixtures(input) {
  if (Array.isArray(input)) {
    return input;
  }

  if (Array.isArray(input.response)) {
    return input.response;
  }

  if (input.fixture) {
    return [input];
  }

  throw new Error(
    "Could not find fixtures. Expected a response array, an array, or a single fixture object.",
  );
}

function fixtureDate(fixtureResponse) {
  const date = fixtureResponse.fixture?.date;
  return typeof date === "string" ? date.replace(/\+00:00$/, "Z") : date;
}

function fixtureId(fixtureResponse) {
  const id = fixtureResponse.fixture?.id;
  return id === undefined || id === null ? undefined : String(id);
}

function buildSchedules(fixtures) {
  return fixtures
    .filter(
      (fixtureResponse) => fixtureDate(fixtureResponse) && fixtureId(fixtureResponse),
    )
    .sort((first, second) =>
      fixtureDate(first).localeCompare(fixtureDate(second)),
    )
    .reduce((schedules, fixtureResponse) => {
      const date = fixtureDate(fixtureResponse);
      const id = fixtureId(fixtureResponse);

      schedules[date] ||= [];

      if (!schedules[date].includes(id)) {
        schedules[date].push(id);
      }

      return schedules;
    }, {});
}

try {
  const rawInput = readInput(inputPath);

  if (!rawInput.trim()) {
    throw new Error("No JSON input received.");
  }

  const schedules = buildSchedules(getFixtures(JSON.parse(rawInput)));
  const output = `${JSON.stringify(schedules, null, 2)}\n`;

  fs.writeFileSync(outputPath, output);
  console.log(`Wrote ${outputPath}`);
} catch (error) {
  console.error(error.message);
  console.error(usage);
  process.exit(1);
}
