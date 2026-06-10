#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WorldCupStack } from "../lib/world_cup-stack";

const app = new cdk.App();
new WorldCupStack(app, "WorldCupStack", {});
