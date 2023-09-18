/**
 * for parsing response into objects and types
 */
import {Response} from "express";
import {LocationItem, PedestrianItem} from "../dto/dynamoDBSchemas";
import {InvalidResponseException} from "../exceptions/responseException";
import {LocationRawJson, PedestrianRawJson} from "../dto/rawJsonObj";
import {DynamoDB} from "aws-sdk";
import {DynamoDBUtils} from "../databaseComponents/dynamoDBUtils";
import {ILogObj, Logger} from "tslog";
import {transFromPedestrianLocation} from "../dto/responseObj";

const log: Logger<ILogObj> = new Logger();

/**
 * build response object to return for success scenario
 *
 * @param postResponse
 * @param res
 */
export const handlePostResponse = (postResponse: any, res: Response) => {
    // extract status code
    let statusCode: number = postResponse.httpResponse.statusCode;
    let respMessage: string = postResponse.httpResponse.statusMessage;

    log.info("Response status code = ", statusCode, ", message = ", respMessage);

    return res.status(statusCode).json({
        result: respMessage
    });
}

/**
 *
 * @param pedestrianResponse
 */
export const handleGetPedestrianResponse = (pedestrianResponse: any) => {

    // transform from DynamoDB object to JSON
    let pedList= parsePedestrianItem(pedestrianResponse);

    return pedList;
}

/**
 * handle the location item
 *
 * @param locationResponse
 */
export const handleGetLocationResponse = (locationResponse: any) => {

    let locationJson: LocationRawJson = parseLocationItem(locationResponse);

    log.info("Returning =", locationJson);

    return locationJson;
}
/**
 * combine result from two tables
 *
 * @param locationResponse
 * @param pedestrianResponse
 * @param res
 */
export const handleLocationPedestrianResponse = (locationResponse: any, pedestrianResponse: any, res: Response) => {

    return res.status(200).json({
        result: transFromPedestrianLocation(locationResponse, pedestrianResponse)
    });
}

/**
 * transform dynamoDB Item List object to JSON
 * @param data
 */
const parsePedestrianItem = (data: any): PedestrianRawJson[] => {
    if (data == null || data == '') {
        throw new InvalidResponseException("Null Pedestrian Data");
    }

    let responseList: PedestrianRawJson[] = [];

    let jList: PedestrianItem[] = JSON.parse(JSON.stringify(data).toString());

    jList.forEach((pedestrianItem: PedestrianItem) => {
        let unmarshalledJson = DynamoDBUtils.unmarshall(<DynamoDB.AttributeMap>pedestrianItem);
        let outJson: PedestrianRawJson = JSON.parse(unmarshalledJson.jsonRaw.toString());
        responseList.push(outJson);
    });

    return responseList;
}

/**
 * transform dynamoDB Item to JSON
 * @param data
 */
const parseLocationItem = (data: any): LocationRawJson => {
    if (data == null || data == '') {
        throw new InvalidResponseException("Null Location Data");
    }

    let marchalledResponse: {
        [p: string]: LocationItem
    } = DynamoDBUtils.unmarshall(<DynamoDB.AttributeMap>data);

    log.info('Response =', marchalledResponse);

    // transform from DynamoDB object to JSON
    let outJson: LocationRawJson = JSON.parse(marchalledResponse.jsonRaw.toString());

    return outJson;
}
