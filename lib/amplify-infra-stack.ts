import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as path from 'path';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AmplifyInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const mytable = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    const myLambda = new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),

      environment:{
        TABLE_NAME:mytable.tableName,
      },
    });
    mytable.grantReadWriteData(myLambda);

    const myLambdaPut = new lambda.Function(this, 'LambdaPut', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handlerput.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),

      environment:{
        TABLE_NAME:mytable.tableName,
      },
    });

    mytable.grantWriteData(myLambdaPut);

    const myLambdaGetbyId = new lambda.Function(this, 'LambdaGetbyId', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handlerbyId.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),

      environment:{
        TABLE_NAME:mytable.tableName,
      },
    });

    mytable.grantReadWriteData(myLambdaGetbyId);

    const myApiGateway = new apigw.RestApi(this, 'hello-api', {
      defaultCorsPreflightOptions: {
      allowOrigins: apigw.Cors.ALL_ORIGINS,
      allowHeaders: ['*'],
      }
      });
    myApiGateway.root.
    resourceForPath("hello")
    .addMethod("GET",new apigw.LambdaIntegration(myLambda))

    myApiGateway.root.
    resourceForPath("hello")
    .addMethod("POST",new apigw.LambdaIntegration(myLambdaPut))

    /*myApiGateway.root.
    resourceForPath("hello/id")
    .addMethod("GET",new apigw.LambdaIntegration(myLambdaGetbyId))*/

   
}}

