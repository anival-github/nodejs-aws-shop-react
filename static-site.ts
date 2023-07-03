import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class StaticSite extends Construct {
  constructor(parent: cdk.Stack, name: string) {
    super(parent, name);

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, "OAI");

    const siteBucket = new s3.Bucket(this, "s3Bucket", {
      bucketName: "anival-static-site-0.0.1",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "staticSiteDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: cloudfrontOAI,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    );

    new s3deploy.BucketDeployment(this, "Deployment", {
      sources: [s3deploy.Source.asset("./dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
