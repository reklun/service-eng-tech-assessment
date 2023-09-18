/**
 * for creating response for error
 */
import {InvalidRequestException} from "../exceptions/requestException";
import {HttpStatusCode} from "axios";
import {Request, Response} from "express";
import {ILogObj, Logger} from "tslog";
import {InvalidResponseException} from "../exceptions/responseException";

const log: Logger<ILogObj> = new Logger();

/**
 * main error handler
 *
 * @param error
 * @param req
 * @param res
 */
export const handleError = (error: any, req: Request, res: Response)=> {

    log.error("error =", error.error, ", message =", error.message, ", raw request body =", req.body);

    if (error instanceof InvalidRequestException) {
        return buildErrorResponse(400, error.message, req.body, res);
    } else if (error instanceof InvalidResponseException) {
        return buildErrorResponse(HttpStatusCode.InternalServerError, error.message, req.body, res);
    } else {
        return buildErrorResponse(HttpStatusCode.InternalServerError, error.message, req.body, res);
    }
}

/**
 * for building returning response
 *
 * @param errorCode
 * @param errorMessage
 * @param reqBody
 * @param res
 */
const buildErrorResponse = (errorCode: number, errorMessage: String, reqBody: String, res: Response) => {
    return res.status(errorCode).json({
        error: errorMessage,
        raw: reqBody
    });
}