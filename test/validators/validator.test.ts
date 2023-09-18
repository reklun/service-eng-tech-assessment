import { validatePedestrianJSON } from '../../source/validators/validator';
import {Request} from "express";
import {InvalidRequestException} from "../../source/exceptions/requestException";

/**
 * WHEN: wrong sum of direction is sent in Pedestrian JSON
 * THEN: Expecting a InvalidRequestException
 */
test('Test: Joi Custom Validation Sum of directions', () => {

    const mockRequest = {
        body: {
            timestamp: '2023-07-24T17:00:00+00:00',
            locationid: '5',
            direction_1: 4,
            direction_2: 5,
            total_of_directions: 8 // right value = 4 + 5 = 9
        },
    } as Request;

    try {
        validatePedestrianJSON(mockRequest)
    } catch (error) {
        expect(error).toBeInstanceOf(InvalidRequestException);
        expect(error).toHaveProperty('message', "\"total_of_directions\" failed custom validation because Invalid sum of total of directions");
    }
});