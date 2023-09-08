## Task

This is a timeboxed task that requires you to design & develop a set of APIs that can receive pedestrian data form the city of melbourne IoT devices, push into a database and then expose it as a data API service for a consumer.

This task will require you to:

1. An API that can receive one of more pedestrian updates
2. Data is to then be record into some datastore / database
3. Have the location data loaded into the datastore somehow.
2. A read only API accepts filters and then returns the filtered pedestrian data with it's location information
 - filters can be date/timestamp and location id
4. Have at least one unit test
5. Instructions on how to build your project

### Further information

- The language preference is TypeScript
- Don't over engineer, keep to the brief (there's plenty of room within that)
- schema in and out can be adjust as you see fit
- database / storage choice is up to you
- database schema is up to you
- how and when you enrich the data is up to you

### Getting started

- Fork this repo as a starting point

### Submission

Once you have completed you solution share the github repo with your HR contact with instructions on how to build your code, do not share any packaged code or binaries.

### Task data files
json data examples can be found here:

1. Melbourne pedestrian data - newer version or different format can be downloaded [Here](https://discover.data.vic.gov.au/dataset/pedestrian-counting-system-counts-per-hour)
2. Location data - newer version or different format can be downloaded [Here](https://discover.data.vic.gov.au/dataset/pedestrian-counting-system-sensor-locations)

Pedestrian data example
```json
{
    "timestamp": "2023-07-24T17:00:00+00:00", 
    "locationid": "1", 
    "direction_1": 4, 
    "direction_2": 5, 
    "total_of_directions": 9
}
```
Location data example
```json
{
    "location_id": 2, 
    "sensor_description": "Bourke Street Mall (South)",
    "sensor_name": "Bou283_T", 
    "installation_date": "2009-03-30", 
    "note": null, 
    "location_type": "Outdoor", 
    "status": "A", 
    "direction_1": "East", 
    "direction_2": "West", 
    "latitude": -37.81380668, 
    "longitude": 144.96516718, 
    "location": 
    {
        "lon": 144.96516718, 
        "lat": -37.81380668
    }
}
```

## Points of interest
- performance
- scale
- memory usage
- errors and validation
