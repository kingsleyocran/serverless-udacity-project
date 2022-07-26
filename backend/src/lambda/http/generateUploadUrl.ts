import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import * as uuid from "uuid";
import { cors, httpErrorHandler } from "middy/middlewares";

import {
  generateSignedUrl,
  updateAttachmentUrl,
} from "../../businessLogic/todos";
import { failureServerError, getUserId, successCreated } from "../utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("generatePresignedUrl");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Generating pre-signedUrl", { event });
    try {
      const userId = getUserId(event);
      const todoId = event.pathParameters.todoId;
      const attachmentId = uuid.v4();

      const uploadUrl = await generateSignedUrl(attachmentId);
      await updateAttachmentUrl(userId, todoId, attachmentId);
      return successCreated({ uploadUrl });
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
