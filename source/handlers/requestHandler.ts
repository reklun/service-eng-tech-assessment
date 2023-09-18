/** source/handlers/router.ts */
import {NextFunction, Request, Response} from "express";
import {
    validateGetPedestrianParams
} from "../validators/validator";
import {
    handlePostResponse,
    handleLocationPedestrianResponse
} from "./responseHandler";
import {Logger, ILogObj} from "tslog";
import {handleError} from "./errorHandler";
import {RequestProcessor} from "../processors/requestProcessor";
import {RequestFactory} from "../databaseComponents/dynamoDBFactory";
import {DynamoDB} from "aws-sdk";
import {buildCurrentDate} from "../dateTimeUtils/dateTimeHelper";

export class RequestHandler {

    private requestProcessor: RequestProcessor;

    private log: Logger<ILogObj> = new Logger();

    constructor(requestFactory: RequestFactory, dynamoDBInstance: DynamoDB) {
        this.requestProcessor = new RequestProcessor(requestFactory, dynamoDBInstance);
    }

    /**
     * for returning success if invoked
     * @param req
     * @param res
     * @param next
     */
    public getHealth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const timestamp = buildCurrentDate();

            this.log.info('health check done at ', timestamp);

            return res.status(200).json({
                result: "ok",
                timestamp: timestamp
            });

        } catch (error: any) {
            return res.status(500).json({
                error: error.message
            });;
        }
    };

    /**
     * post a Pedestrian JSON to Pedestrian table
     *
     * @param req
     * @param res
     * @param next
     */
    public postPedestrian = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.log.info('Operation postPedestrian Received body =', req.body);

            const dynamoDBResponse = await this.requestProcessor.processPostPedestrian(req);

            return handlePostResponse(dynamoDBResponse, res);

        } catch (error: any) {
            return handleError(error, req, res);
        }
    };

    /**
     * post a Pedestrian JSON to Pedestrian table
     *
     * @param req
     * @param res
     * @param next
     */
    public postPedestrians = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.log.info('Operation postPedestrians Received body =', req.body);

            const dynamoDBResponse = await this.requestProcessor.processPostPedestrians(req);

            return handlePostResponse(dynamoDBResponse, res);

        } catch (error: any) {
            return handleError(error, req, res);
        }
    };

    /**
     * post a device JSON to location table
     *
     * @param req
     * @param res
     * @param next
     */
    public postDevice = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.log.info('Operation putDevice Received body =', req.body);

            const dynamoDBResponse = await this.requestProcessor.processPostDevice(req);

            return handlePostResponse(dynamoDBResponse, res);

        } catch (error: any) {
            return handleError(error, req, res);
        }
    };

    /**
     * post a list of devices JSON to location table
     *
     * @param req
     * @param res
     * @param next
     */
    public postDevices = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.log.info('Operation putDevices Received body =', req.body);

            const dynamoDBResponse = await this.requestProcessor.processPostDevices(req);

            return handlePostResponse(dynamoDBResponse, res);

        } catch (error: any) {
            return handleError(error, req, res);
        }
    };

    /**
     * Return device detail by location Id
     *
     * @param req
     * @param res
     * @param next
     */
    public getDeviceByLocation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.log.info('Operation getDeviceByLocation Received locationId = ', req.params.locationId);

            let outJson = await this.requestProcessor.processGetDeviceByLocation(req);

            return res.status(200).json({
                result: outJson
            });

        } catch (error: any) {
            return handleError(error, req, res);
        }
    };

    /**
     * retrieve pedestrian data by location ID and timestamps
     *
     * @param req
     * @param res
     * @param next
     */
    public getRawPedestrian = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.log.info('Operation getPedestrian Received locationId =', req.params.locationId,
                ', startDate =', req.query.startDate, ', endDate =', req.query.endDate);

            const outJson = await this.requestProcessor.processGetPedestrian(req);

            return res.status(200).json({
                result: outJson
            });

        } catch (error: any) {
            return handleError(error, req, res);
        }
    };

    /**
     * retrieve full pedestrian data by location ID and timestamps
     *
     * @param req
     * @param res
     * @param next
     */
    public getFullPedestrian = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.log.info('Operation getPedestrian Received locationId =', req.params.locationId,
                ', startDate =', req.query.startDate, ', endDate =', req.query.endDate);

            // simple validation on GET params
            validateGetPedestrianParams(req);

            // list of pedestrian record
            const pedestrianResponse = await this.requestProcessor.processGetPedestrian(req);

            // the detail of device at one location
            const locationRawJson = await this.requestProcessor.processGetDeviceByLocation(req);

            return handleLocationPedestrianResponse(locationRawJson, pedestrianResponse, res);

        } catch (error: any) {
            return handleError(error, req, res);
        }
    };

}
