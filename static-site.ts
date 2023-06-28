import * as s3 from "@aws-cdk/aws-s3";
import * as iam from "@aws-cdk/aws-iam";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cdk from "aws-cdk-lib";
import { Construct, Stack } from "@aws-cdk/core";

export class StaticSite extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "ANIVAL-OAI-0.0.10"
    );

    const siteBucket = new s3.Bucket(this, "ANIVALStatickBucket", {
      bucketName: "anival-cloudfront-s3-0.0.10",
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
      "ANIVAL-distribution-0.0.10",
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

    new s3deploy.BucketDeployment(this, "ANIVAL-Bucket-Deployment-0.0.10", {
      sources: [s3deploy.Source.asset("./dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
