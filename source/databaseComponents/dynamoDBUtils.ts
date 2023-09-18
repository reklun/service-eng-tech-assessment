/**
 * for creating params object for dynamoDB requests
 */
import {DynamoDB} from "aws-sdk";

export class DynamoDBUtils {

    /**
     * unmarshalling objects returned from DynamoDB to JSON
     * @param data
     */
    public static unmarshall(data: DynamoDB.AttributeMap) : { [p: string]: any }  {
        return DynamoDB.Converter.unmarshall(data);
    }

}