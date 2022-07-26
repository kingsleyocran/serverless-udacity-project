import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getTodos } from "../../businessLogic/todos";
import { failureServerError, getUserId, successOK } from "../utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("getTodos");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("getting TODO item", { event });

    try {
      const userId = getUserId(event);

      const items = await getTodos(userId);
      return successOK({ items });
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
