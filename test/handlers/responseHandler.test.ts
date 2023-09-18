import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { GetItemInput } from 'aws-sdk/clients/dynamodb';
import {handleGetLocationResponse} from "../../source/handlers/responseHandler";

// setting up mock DB
beforeAll(async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB', 'getItem', (params: GetItemInput, callback: Function) => {
        console.log('DynamoDB', 'getItem', 'mock called');
        callback(null, {
            jsonRaw: {
                S: '{"location_id":25,"sensor_description":"Bourke Street Mall (South)","sensor_name":"Bou283_T","installation_date":"2020-03-30","note":null,"location_type":"Outdoor","status":"A","direction_1":"East","direction_2":"West","latitude":-37.81380668,"longitude":144.96516718,"location":{"lon":144.96516718,"lat":-37.81380668}}'
            },
            locationid: {
                N: '25'
            }
        });
    })
});

// close DB for each test case
afterAll( async() => {
    AWSMock.restore('DynamoDB');
});

test('Test: Unmarshalling and parsing from Mock DynamoDB Response', async () => {

    const expected = {
        "direction_1": "East",
        "direction_2": "West",
        "installation_date": "2020-03-30",
        "latitude": -37.81380668,
        "location": {
            "lat": -37.81380668,
            "lon": 144.96516718
        },
        "location_id": 25,
        "location_type": "Outdoor",
        "longitude": 144.96516718,
        "note": null,
        "sensor_description": "Bourke Street Mall (South)",
        "sensor_name": "Bou283_T",
        "status": "A"
    }

    const input:GetItemInput = { TableName: 'LocationData', Key: {  locationid: {N: '25'}} };
    const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    const dbreturndata = await dynamodb.getItem(input).promise();

    expect(handleGetLocationResponse(dbreturndata)).toStrictEqual(expected);
});
