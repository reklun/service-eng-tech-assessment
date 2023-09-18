/**
 * for placing validating methods
 */

import {Request} from "express";
import {InvalidRequestException} from "../exceptions/requestException";
import {DevicesSchema, LocationSchema, PedestrianSchema, PedestriansSchema} from "./validationSchema";
import {ILogObj, Logger} from "tslog";

const log: Logger<ILogObj> = new Logger();

export const validatePedestrianJSON = (req: Request): void => {
    const { error, value } = PedestrianSchema.validate(req.body);
    if (error) {
        throw new InvalidRequestException(error.message);
    } else {
        log.debug("Validated = ", req.body);
    }
}

export const validatePedestrianListJSON = (req: Request): void => {
    const pedestrians = req.body.pedestrians;

    if (pedestrians == undefined) {
        throw new InvalidRequestException("Pedestrians attribute undefined for pedestrians list");
    }

    const { error, value } = PedestriansSchema.validate(pedestrians);
    if (error) {
        throw new InvalidRequestException(error.message);
    } else {
        log.debug("Validated = ", pedestrians);
    }
}

export const validateLocationJSON = (req: Request): void => {
    const { error, value } = LocationSchema.validate(req.body);
    if (error) {
        throw new InvalidRequestException(error.message);
    } else {
        log.debug("Validated = ", req.body);
    }
}

export const validateLocationListParams = (req: Request): void => {
    const devices = req.body.devices;

    if (devices == undefined) {
        throw new InvalidRequestException("Devices attribute undefined for devices list");
    }

    const { error, value } = DevicesSchema.validate(devices);
    if (error) {
        throw new InvalidRequestException(error.message);
    } else {
        log.debug("Validated = ", devices);
    }
}

export const validateGetLocationParams = (req: Request): void => {
    validateLocationId(req.params.locationId);
}

export const validateGetPedestrianParams = (req: Request): void => {
    validateLocationId(req.params.locationId);

    validateDate(req.query.startDate);
    validateDate(req.query.endDate);
}

const validateLocationId = (locationId: string): void => {
    if (isEmpty(locationId)) {
        throw new InvalidRequestException("locationId is missing");
    }

    if (isNotANumber(locationId)) {
        throw new InvalidRequestException("locationId is not a number = " + locationId);
    }
}

const validateDate = (dateParam : any): boolean => {
    if (typeof dateParam == 'string') {
        if (isEmpty(dateParam)) {
            return true;
        } else {
            new Date(dateParam).toISOString();
            return true;
        }
    }

    return false;
}

const isEmpty = (s: any): boolean => {
    return (s == null) || (s === '');
}

const isNotANumber = (s ?: string | number) : boolean => {
    return isNaN(Number(s));
}


