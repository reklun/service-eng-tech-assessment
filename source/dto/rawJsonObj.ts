/**
 * json type for raw data
 */
export interface LocationRawJson {
    location_id: Number;
    sensor_description: string;
    sensor_name: string;
    installation_date: string;
    note: string;
    location_type: string;
    status: string;
    direction_1: string;
    direction_2: string;
    latitude: Number;
    longitude: Number;
    location: LocationXY;
}

type LocationXY = {
    lon: Number;
    lat: Number;
};

export interface PedestrianRawJson {
    locationid: string;
    timestamp: string;
    direction_1: Number;
    direction_2: Number;
    total_of_directions: Number;
}
