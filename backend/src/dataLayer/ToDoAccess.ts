import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Types } from 'aws-sdk/clients/s3';
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";
import { createLogger } from "../utils/logger";

const logger = createLogger('createtodo');
const AWSXRay = require('aws-xray-sdk')

export class ToDoAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWSXRay.DynamoDB.DocumentClient(),
        private readonly s3Client: Types = new AWSXRay.S3({ signatureVersion: 'v4' }),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
    }

    async getAllToDo(userId: string): Promise<TodoItem[]> {
        // console.log("Getting all todo");
        logger.info('Getting all todo');

        const params = {
            TableName: this.todoTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        const result = await this.docClient.query(params).promise();
        // console.log(result);
        logger.info(result);
        const items = result.Items;

        return items as TodoItem[];
    }

    async createToDo(todoItem: TodoItem): Promise<TodoItem> {
        // console.log("Creating new todo");
        logger.info('Creating new todo');

        const params = {
            TableName: this.todoTable,
            Item: todoItem,
        };

        const result = await this.docClient.put(params).promise();
        // console.log(result);
        logger.info(result);

        return todoItem as TodoItem;
    }

    async updateToDo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
        // console.log("Updating todo");
        logger.info('Updating todo');

        const params = {
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {
                "#a": "name",
                "#b": "dueDate",
                "#c": "done"
            },
            ExpressionAttributeValues: {
                ":a": todoUpdate['name'],
                ":b": todoUpdate['dueDate'],
                ":c": todoUpdate['done']
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await this.docClient.update(params).promise();
        // console.log(result);
        logger.info(result);
        const attributes = result.Attributes;

        return attributes as TodoUpdate;
    }

    async deleteToDo(todoId: string, userId: string): Promise<string> {
        console.log("Deleting todo");

        const params = {
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        };

        const result = await this.docClient.delete(params).promise();
        // console.log(result);
        logger.info(result);

        return "" as string;
    }

    async generateUploadUrl(todoId: string): Promise<string> {
        // console.log("Generating URL");
        logger.info("Generating URL");

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: 1000,
        });
        // console.log(url);
        logger.info(url);

        return url as string;
    }
}
