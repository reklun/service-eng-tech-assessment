/**
 * define interfaces for responses
 */
import {LocationRawJson, PedestrianRawJson} from "./rawJsonObj";

interface PedestrianLocation extends LocationRawJson {
    records: Pedestrian[];
}

type Pedestrian = {
    timestamp: string;
    direction_1: Number;
    direction_2: Number;
    total_of_directions: Number;
}

/**
 * put pedestrian data into location data
 *
 * @param location
 * @param pedRaws
 */
export const transFromPedestrianLocation = (location: LocationRawJson, pedRaws: PedestrianRawJson[]): PedestrianLocation => {

    let pedestrianLocation = location as PedestrianLocation;
    let pedestrians: Pedestrian[] = [];

    pedRaws.forEach((pedestrianRawJson: PedestrianRawJson) => {
        let ped: Pedestrian = excludeKey(pedestrianRawJson, 'locationid');
        pedestrians.push(ped);
    });

    pedestrianLocation.records = pedestrians;

    return pedestrianLocation;
}

/**
 * for removing duplicated attribute
 *
 * @param obj
 * @param key
 */
function excludeKey<T extends object, U extends keyof any>(obj: T, key: U) {
    const { [key]: _, ...newObj } = obj;
    return newObj;
}

