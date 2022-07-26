import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { failureServerError, getUserId, successCreated } from "../utils";
import { createTodo } from "../../businessLogic/todos";
import { createLogger } from "../../utils/logger";

const logger = createLogger("createTodo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("creating TODO item", { event });

    try {
      const userId = getUserId(event);
      const newTodo: CreateTodoRequest = JSON.parse(event.body);

      const item = await createTodo(userId, newTodo);
      return successCreated({ item });
    } catch (error) {
      return failureServerError(error, error.code);
    }
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
