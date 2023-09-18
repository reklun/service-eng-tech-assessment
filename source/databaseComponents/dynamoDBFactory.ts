/**
 * for producing DynamoDB request Objects
 */
import {DynamoDB} from "aws-sdk";
import {Request} from "express";
import {buildCurrentDate, buildFirstDate, buildISODate} from "../dateTimeUtils/dateTimeHelper";
import {LocationRawJson, PedestrianRawJson} from "../dto/rawJsonObj";

export class RequestFactory {

    private static readonly TABLE_LOCATION_DATA: string = 'LocationData';
    private static readonly TABLE_PEDESTRIAN_DATA: string = 'PedestrianData';

    constructor() {
    }

    /**
     * get request with one id value from LocationData Table
     *
     * @param req
     */
    public buildGetLocationByIdRequest(req: Request): DynamoDB.GetItemInput {

        let locationId: string = req.params.locationId;

        return {
            TableName: RequestFactory.TABLE_LOCATION_DATA,
            Key: {
                locationid: {N: locationId},
            },
        };
    }

    /**
     * put one Device Location JSON to LocationData table
     *
     * @param req
     */
    public buildPutLocationRequest(req: Request): DynamoDB.PutItemInput {

        let locationRawJson: LocationRawJson = req.body;

        let locationId = locationRawJson.location_id.toString();

        return {
            TableName: RequestFactory.TABLE_LOCATION_DATA,
            Item: {
                'locationid': {N: locationId},
                'jsonRaw': {S: JSON.stringify(locationRawJson)}
            }
        };
    }

    /**
     * write a list of devices to LocationData table
     * @param req
     */
    public buildBatchWriteLocationRequest(req: Request) {
        return this.buildLocationItems(req.body.devices);
    }

    /**
     * write a list of pedestrians to PedestrianData table
     * @param req
     */
    public buildBatchWritePedestrianRequest(req: Request) {
        return this.buildPedestrianItems(req.body.pedestrians);
    }

    private buildLocationItems(deviceLocations: LocationRawJson[]) {
        let itemsArray: any[] = []

        deviceLocations.forEach(item => {
            itemsArray.push(this.buildLocationItem(item));
        });

        return {
            RequestItems: {
                'LocationData': itemsArray
            }
        }
    }

    private buildLocationItem(deviceLocation: LocationRawJson) {
        return {
            PutRequest: {
                Item: {
                    "locationid": { "N": deviceLocation.location_id.toString() },
                    "jsonRaw": { "S": JSON.stringify(deviceLocation) }
                }
            }
        }
    }

    private buildPedestrianItems(pedestrians: PedestrianRawJson[]) {
        let itemsArray: any[] = []

        pedestrians.forEach(item => {
            itemsArray.push(this.buildPedestrianItem(item));
        });

        return {
            RequestItems: {
                'PedestrianData': itemsArray
            }
        }
    }

    private buildPedestrianItem(pedestrian: PedestrianRawJson) {
        return {
            PutRequest: {
                Item: {
                    "locationid": { "N": pedestrian.locationid.toString() },
                    'timestamp': {"S": pedestrian.timestamp},
                    "jsonRaw": { "S": JSON.stringify(pedestrian) }
                }
            }
        }
    }

    /**
     * put one Pedestrian JSON to PedestrianData table
     *
     * @param req
     */
    public buildPutPedestrianRequest(req: Request): DynamoDB.PutItemInput {

        let pedestrianRawJson: PedestrianRawJson = req.body;

        let locationId = pedestrianRawJson.locationid.toString();

        let timestamp = buildISODate(pedestrianRawJson.timestamp);

        return {
            TableName: RequestFactory.TABLE_PEDESTRIAN_DATA,
            Item: {
                'locationid': {N: locationId},
                'timestamp': {S: timestamp},
                'jsonRaw': {S: JSON.stringify(pedestrianRawJson)}
            }
        };
    }

    /**
     * return data from Pedestrian data
     *
     * @param req
     */
    public buildQueryPedestrianRequest(req: Request): DynamoDB.DocumentClient.QueryInput {

        let locationId: string = req.params.locationId;

        // convert to ISO date form
        let endDateTime: string = buildISODate(req.query.endDate);
        // put current date time if absent
        if (endDateTime.length === 0) {
            endDateTime = buildCurrentDate();
        }

        // convert to ISO date form
        let startDateTime: string = buildISODate(req.query.startDate);
        // put first date time if absent
        if (startDateTime.length === 0) {
            startDateTime = buildFirstDate();
        }

        return {
            TableName: RequestFactory.TABLE_PEDESTRIAN_DATA,
            KeyConditionExpression: '#pk = :pk AND #sk BETWEEN :start AND :end',
            ExpressionAttributeNames: {
                '#pk': 'locationid',
                '#sk': 'timestamp',
            },
            ExpressionAttributeValues: {
                ':pk': {N: locationId},
                ':start': {S: startDateTime},
                ':end': {S: endDateTime},
            },
        };
    }
}

