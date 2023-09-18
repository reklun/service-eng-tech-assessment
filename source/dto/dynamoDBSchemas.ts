/**
 * Schema for LocationData Table
 */
export type LocationItem = {
    locationid : Number; // partition key
    jsonRaw: string;
};

/**
 * Schema for PedestrianData Table
 */
export type PedestrianItem = {
    locationid : Number; // partition key
    timestamp: string; // sort key
    jsonRaw: string;
};
