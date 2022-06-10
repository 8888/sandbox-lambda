import { Stack, StackProps } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class SandboxLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'SandboxBucet', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    const handler = new Function(this, 'SandboxFunction', {
      functionName: 'DevSandbox',
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset('resources', {
        bundling: {
          command: [
            'bash',
            '-c',
            'npm ci && cp -au . /asset-output'
          ],
          image: Runtime.NODEJS_16_X.bundlingImage,
        },
      }),
      handler: 'sandbox.handler',
    });

    handler.addToRolePolicy(PolicyStatement.fromJson({
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "rds-data:BatchExecuteStatement",
        "rds-data:BeginTransaction",
        "rds-data:CommitTransaction",
        "rds-data:ExecuteStatement",
        "rds-data:RollbackTransaction"
      ],
      "Resource": "*"
    }));

    bucket.grantReadWrite(handler);
  }
}
