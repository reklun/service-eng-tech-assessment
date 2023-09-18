/**
 * for sending the request and return response from DynamoDB
 */
import {DynamoDB} from "aws-sdk";
import {Request} from "express";
import {RequestFactory} from "../databaseComponents/dynamoDBFactory";
import {ILogObj, Logger} from "tslog";
import {
    validateLocationListParams,
    validateGetLocationParams,
    validateGetPedestrianParams,
    validateLocationJSON,
    validatePedestrianJSON, validatePedestrianListJSON
} from "../validators/validator";
import {handleGetLocationResponse, handleGetPedestrianResponse} from "../handlers/responseHandler";

export class RequestProcessor {

    private requestFactory;
    private dynamoDBInstance: DynamoDB;
    private log: Logger<ILogObj> = new Logger();

    constructor(requestFactory: RequestFactory, dynamoDBInstance: DynamoDB) {
        this.requestFactory = requestFactory;
        this.dynamoDBInstance = dynamoDBInstance;
    }

    public processPostPedestrian = async (req: Request) => {

        // payload validation
        validatePedestrianJSON(req);

        // Define the parameters for the petItem operation
        const params: DynamoDB.PutItemInput = this.requestFactory.buildPutPedestrianRequest(req);

        this.log.info('Request sending = ', params);

        const postResponse = await this.dynamoDBInstance.putItem(params).promise().then(result => result.$response);

        // this.log.debug('Response = ', postResponse);

        return postResponse;
    }

    public processPostPedestrians = async (req: Request) => {

        // payload validation
        validatePedestrianListJSON(req);

        // Define the parameters for the petItem operation
        const params = this.requestFactory.buildBatchWritePedestrianRequest(req);

        this.log.info('Request sending = ', params);

        const postResponse = await this.dynamoDBInstance.batchWriteItem(params).promise().then(result => result.$response);

        // this.log.debug('Response = ', postResponse);

        return postResponse;
    }

    public processPostDevice = async (req: Request) => {

        // payload validation
        validateLocationJSON(req);

        // Define the parameters for the putItem operation
        const params: DynamoDB.PutItemInput = this.requestFactory.buildPutLocationRequest(req);

        this.log.info('Request sending = ', params);

        const postResponse = await this.dynamoDBInstance.putItem(params).promise().then(result => result.$response);

        // this.log.debug('Response = ', postResponse);

        return postResponse;
    }

    public processPostDevices = async (req: Request) => {

        // payload validation
        validateLocationListParams(req);

        // Define the parameters for the putItem operation
        const params = this.requestFactory.buildBatchWriteLocationRequest(req);

         this.log.info('Request sending = ', params);

        const postResponse = await this.dynamoDBInstance.batchWriteItem(params).promise().then(result => result.$response);

        // this.log.debug('Response = ', postResponse);

        return postResponse;
    }

    public processGetDeviceByLocation = async (req: Request) => {

        // simple validation on GET params
        validateGetLocationParams(req);

        // Define the parameters for the getItem operation
        const params: DynamoDB.GetItemInput = this.requestFactory.buildGetLocationByIdRequest(req);

        this.log.info('Request sending = ', params);

        // send request
        const locationResponse = await this.dynamoDBInstance.getItem(params).promise().then(result => result.Item);

        this.log.debug('Response = ', locationResponse);

        return handleGetLocationResponse(locationResponse);
    }


    public processGetPedestrian = async (req: Request) => {

        // simple validation on GET params
        validateGetPedestrianParams(req);

        // Build the request objects for the query operation
        const params: DynamoDB.DocumentClient.QueryInput = this.requestFactory.buildQueryPedestrianRequest(req);

        this.log.info('Request sending = ', params);

        const pedestrianResponse = await this.dynamoDBInstance.query(params).promise().then(result => result.Items);

        this.log.debug('Response = ', pedestrianResponse);

        return handleGetPedestrianResponse(pedestrianResponse);
    }

}


