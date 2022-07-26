import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { updateTodo } from "../../businessLogic/todos";
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { failureServerError, getUserId, successOK } from "../utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("getTodos");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Updating TODO item", { event });
    try {
      const userId: string = getUserId(event);
      const todoId: string = event.pathParameters.todoId;
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

      const item = await updateTodo(userId, todoId, updatedTodo);
      return successOK({ item });
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
