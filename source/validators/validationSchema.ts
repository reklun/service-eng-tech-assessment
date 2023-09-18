/**
 * define the schema for validations
 */

import BaseJoi from "joi";
import JoiDate from '@joi/date';

const Joi = BaseJoi.extend(JoiDate);

enum Direction {
    East = "East",
    North = "North",
    South = "South",
    West = "West"
}

export const PedestrianSchema = Joi.object({
    locationid: Joi.string().required(),
    timestamp: Joi.string().isoDate().required(),
    direction_1: Joi.number().integer().min(0).required(),
    direction_2: Joi.number().integer().min(0).required(),

    // check sum of directions
    total_of_directions: BaseJoi.number().integer().min(0).required().custom((value, helpers) => {
        const {direction_1, direction_2} = helpers.state.ancestors[0];
        if (value !== direction_1 + direction_2) {
            throw new Error('Invalid sum of total of directions');
        }

        return value;
    })
})
    .max(5) // avoid fields other than defined for security issue
    .options({abortEarly: true});

export const LocationSchema = Joi.object({
    location_id: Joi.number().integer().min(0).required(),
    sensor_description: Joi.string().required(),
    sensor_name: Joi.string().required(),
    installation_date: Joi.date().format('YYYY-MM-DD').allow(null).required(),
    note: Joi.string().allow(null, '').required(),
    location_type: Joi.string().allow(null, '').required(),
    status: Joi.string().required(),
    direction_1: Joi.string().valid(...Object.values(Direction)).required(),
    direction_2: Joi.string().valid(...Object.values(Direction)).required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    location: Joi.object({
        lon: Joi.number().required(),
        lat: Joi.number().required(),
    })
})
    .max(12) // avoid fields other than defined for security issue
    .options({abortEarly: true});

export const DevicesSchema = Joi.array().items(LocationSchema);

export const PedestriansSchema = Joi.array().items(PedestrianSchema);