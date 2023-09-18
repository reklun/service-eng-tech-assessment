/**
 * For returning dynamoDB instance for sending requests
 */
import {DynamoDB} from "aws-sdk";
import * as AWS from "aws-sdk";
import {Config} from "../config/config";
export class DynamoDBSingleton {

    private static readonly API_VERSION: string = '2012-08-10';
    private static readonly API_KEY_PATH: string = '../../aws_cred/aws_cred.json';

    private static dynamoDBInstance: DynamoDB;

    private constructor() { }

    // Set the AWS region and credentials
    private static init() {
        let config: Config = require(DynamoDBSingleton.API_KEY_PATH);

        AWS.config.update({
            region: 'ap-southeast-2',
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
        });
    }

    public static getInstance(): DynamoDB {
        if (!DynamoDBSingleton.dynamoDBInstance) {
            DynamoDBSingleton.init();
            DynamoDBSingleton.dynamoDBInstance = new DynamoDB({apiVersion: DynamoDBSingleton.API_VERSION});
        }

        return DynamoDBSingleton.dynamoDBInstance;
    }
}