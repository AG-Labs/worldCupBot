import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import * as eventTargets from "aws-cdk-lib/aws-events-targets";
import {
  Role,
  ServicePrincipal,
  CompositePrincipal,
  PolicyStatement,
  Effect,
  ManagedPolicy,
} from "aws-cdk-lib/aws-iam";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import "dotenv/config";
const { apiKey, slackWebhookUrl } = process.env;

export class WorldCupStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    if (!apiKey || !slackWebhookUrl) {
      throw new Error("Missing environment variables");
    }
    // The code that defines your stack goes here

    // example resource
    const queue = new Queue(this, "WorldCupQueue", {});

    const lambdaRole = new Role(this, "lambdaRole", {
      assumedBy: new CompositePrincipal(
        new ServicePrincipal("lambda.amazonaws.com"),
        new ServicePrincipal("events.amazonaws.com")
      ),
      description: "Example role...",
      managedPolicies: [
        new ManagedPolicy(this, "mp1", {
          managedPolicyName: "mp1",
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ["lambda:*"],
              resources: ["*"],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ["logs:*"],
              resources: ["*"],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ["sqs:*"],
              resources: ["*"],
            }),
          ],
        }),
      ],
    });
    lambdaRole.addToPolicy;

    const fn = new Function(this, "function", {
      runtime: Runtime.NODEJS_16_X,
      handler: "handler.index",
      code: Code.fromAsset(path.join(__dirname, "Lambda")),
      role: lambdaRole,
      environment: {
        sqsQueue: queue.queueUrl,
        apiKey: apiKey,
        slackWebhookUrl: slackWebhookUrl,
      },
      timeout: Duration.seconds(20),
    });

    fn.addPermission("ebp", {
      principal: new ServicePrincipal("events.amazonaws.com"),
      sourceArn: `arn:aws:events:${this.region}:${this.account}:rule/*`,
    });
    fn.addEventSource(new SqsEventSource(queue));

    const rule = new Rule(this, `timed-events-game`, {
      description: "Timed Rule for world cup games",
      enabled: true,
      ruleName: `game-cron`,
      schedule: Schedule.cron({
        minute: "0",
        hour: "16,13,19",
        day: "14,15,16,17,18,19,20,21,22,23,24,25,26,30,01,02",
        month: "06,07",
      }),
      targets: [new eventTargets.LambdaFunction(fn)],
    });

    // eventTargets.addLambdaPermission(rule, fn);
    // rule.addTarget(new eventTargets.LambdaFunction(fn));
  }
}
