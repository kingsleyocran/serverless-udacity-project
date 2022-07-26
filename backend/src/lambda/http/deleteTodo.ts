import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { deleteTodo } from "../../businessLogic/todos";
import { failureServerError, getUserId, successDelete } from "../utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("deleteTodo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info("deleting TODO item", { event });

      const userId = getUserId(event);
      const todoId = event.pathParameters.todoId;

      const item = await deleteTodo(userId, todoId);
      return successDelete({ item });
    } catch (error) {
      return failureServerError(error, error.code);
    }
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
