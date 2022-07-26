import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("TodosAccess");

// Implementation of the dataLayer logic

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosByUserIndex = process.env.TODOS_CREATED_AT_INDEX
  ) {}

  async createTodoItem(item: TodoItem): Promise<void> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: item,
      })
      .promise();
  }

  async getTodoItemsByUser(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.todosByUserIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();

    return result.Items as TodoItem[];
  }

  async getTodoItem(userId: string, todoId: string): Promise<TodoItem> {
    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: { userId, todoId },
      })
      .promise();

    return result.Item as TodoItem;
  }

  async updateTodoItem(
    userId: string,
    todoId: string,
    todoUpdate: TodoUpdate
  ): Promise<TodoItem> {
    const result = await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeNames: {
          "#name": "name",
        },
        ExpressionAttributeValues: {
          ":name": todoUpdate.name,
          ":dueDate": todoUpdate.dueDate,
          ":done": todoUpdate.done,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return result.Attributes as TodoItem;
  }

  //Delete Todo item data layer function
  async deleteTodoItem(userId: string, todoId: string): Promise<TodoItem> {
    const result = await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: { userId, todoId },
        ReturnValues: "ALL_OLD",
      })
      .promise();

    return result.Attributes as TodoItem;
  }

  async updateTodoItemAttachmentUrl(
    userId: string,
    todoId: string,
    attachmentUrl: string
  ): Promise<void> {
      await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        },
      }).promise()
  
    return
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log("Creating a local DynamoDB instance");
    return new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}
