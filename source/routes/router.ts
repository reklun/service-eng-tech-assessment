/** source/routes/router.ts */
import express from 'express';
import {RequestHandler} from '../handlers/requestHandler';
import {RequestFactory} from "../databaseComponents/dynamoDBFactory";
import {DynamoDBSingleton} from "../databaseComponents/dynamoDBConnector";
const router = express.Router();

let requestHandler: RequestHandler = new RequestHandler(new RequestFactory(), DynamoDBSingleton.getInstance());

/**********HEALTH CHECK**********/

/** get device detail with :locationId **/
router.get('/health', requestHandler.getHealth);

/**********GET**********/

/** get device detail with :locationId **/
router.get('/getDeviceByLocation/:locationId', requestHandler.getDeviceByLocation);

/** get original pedestrian detail with :locationId and optional timestamp :startDate and :endDate **/
router.get('/getRawPedestrian/:locationId', requestHandler.getRawPedestrian);

/** get joint details for pedestrian and location with :locationId and optional timestamp :startDate and :endDate **/
router.get('/getFullPedestrian/:locationId', requestHandler.getFullPedestrian);


/**********POST**********/

/** post a device JSON to location table **/
router.post('/postDevice', requestHandler.postDevice);

/** post a list of devices to location table **/
router.post('/postDevices', requestHandler.postDevices);

/** post a pedestrian JSON to pedestrian table **/
router.post('/postPedestrian', requestHandler.postPedestrian);

/** post a list of pedestrian JSON to pedestrian table **/
router.post('/postPedestrians', requestHandler.postPedestrians);

export = router;
