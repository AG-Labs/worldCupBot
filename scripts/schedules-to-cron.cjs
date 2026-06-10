#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const usage = `Usage:
  node scripts/schedules-to-cron.cjs [schedules.json]

Reads lib/Lambda/maps/schedules.json by default and prints a CDK
Schedule.cron snippet that runs at least once for every scheduled fixture.
`;

const repoRoot = path.resolve(__dirname, "..");
const defaultInputPath = "lib/Lambda/maps/schedules.json";
const [, , inputPath] = process.argv;

function readInput(filePath) {
  if (filePath === "-") {
    return fs.readFileSync(0, "utf8");
  }

  return fs.readFileSync(path.resolve(repoRoot, filePath || defaultInputPath), "utf8");
}

function sortedNumbers(values) {
  return [...values].sort((first, second) => first - second);
}

function padTwo(value) {
  return String(value).padStart(2, "0");
}

function parseScheduleDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid schedule date: ${dateString}`);
  }

  return date;
}

function buildCron(schedules) {
  const minutes = new Set();
  const hours = new Set();
  const days = new Set();
  const months = new Set();

  for (const dateString of Object.keys(schedules)) {
    const date = parseScheduleDate(dateString);

    minutes.add(date.getUTCMinutes());
    hours.add(date.getUTCHours());
    days.add(date.getUTCDate());
    months.add(date.getUTCMonth() + 1);
  }

  return {
    minute: sortedNumbers(minutes).join(","),
    hour: sortedNumbers(hours).join(","),
    day: sortedNumbers(days).map(padTwo).join(","),
    month: sortedNumbers(months).map(padTwo).join(","),
  };
}

function buildScheduleSnippet(cron) {
  return `schedule: Schedule.cron({
  minute: "${cron.minute}",
  hour: "${cron.hour}",
  day: "${cron.day}",
  month: "${cron.month}",
}),`;
}

try {
  const rawInput = readInput(inputPath);

  if (!rawInput.trim()) {
    throw new Error("No JSON input received.");
  }

  process.stdout.write(`${buildScheduleSnippet(buildCron(JSON.parse(rawInput)))}\n`);
} catch (error) {
  console.error(error.message);
  console.error(usage);
  process.exit(1);
}
