import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";
import { createLogger } from "../utils/logger";

const logger = createLogger('httpResponse')

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

//Response Functions
export function successOK(body: any) {
  logger.info("RESPONSE", responseFunc(200, body));
  return responseFunc(200, body);
}

export function successCreated(body: any) {
  logger.info("RESPONSE", responseFunc(201, body));
  return responseFunc(201, body);
}


export function successDelete(body: any) {
  logger.info("RESPONSE", responseFunc(204, body));
  return responseFunc(204, body);
}

export function failureServerError(body: any, statusCode?: number) {
  logger.info("RESPONSE", responseFunc(500, body));
  return responseFunc(statusCode ?? 500, body);
}

function responseFunc(statusCode: number, body: any) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}