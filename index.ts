import * as cdk from "aws-cdk-lib";
import { StaticSite } from "./static-site";

class MyStaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string) {
    super(parent, name);

    new StaticSite(this, "ANIVALStaticWebsite");
  }
}

const app = new cdk.App();

new MyStaticSiteStack(app, "ANIVALMyStaticWebsite");

app.synth();
