import { TodosAccess } from "../dataLayer/todosAcess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { createLogger } from "../utils/logger";
import * as uuid from "uuid";
//import * as createError from "http-errors";
import { TodoUpdate } from "../models/TodoUpdate";
import { getAttachmentUrl, getUploadUrl } from "../fileStore/fileStoreUtils";

//Implement businessLogic

const todoAccess = new TodosAccess();

const logger = createLogger("TodosBusinessLogic");

export async function createTodo(
  userId: string,
  createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {
  const todoId = uuid.v4();

  const item: TodoItem = {
    userId,
    todoId,
    done: false,
    attachmentUrl: null,
    createdAt: new Date().toISOString(),
    ...createTodoRequest,
  };

  try {
    await todoAccess.createTodoItem(item);
    logger.info("TODO item created successfully", {
      todoId,
      userId,
      todoItem: item,
    });
    return item;
  } catch (error) {
    logger.error(error);
    throw new ErrorParse(error.message, 500);
  }
}

export async function getTodos(userId: string): Promise<TodoItem[]> {
  try {
    const result = await todoAccess.getTodoItemsByUser(userId);
    logger.info(`TODO items of user: ${userId}`, JSON.stringify(result));
    return result;
  } catch (error) {
    logger.error(error);
    throw new ErrorParse(error.message, 500);
  }
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<TodoItem> {
  try {
    const item = await todoAccess.updateTodoItem(
      userId,
      todoId,
      updateTodoRequest as TodoUpdate
    );
    logger.info("TODO item updated successfully", {
      userId,
      todoId,
      todoUpdate: updateTodoRequest,
    });
    return item;
  } catch (error) {
    logger.error(error);
    throw new ErrorParse(error.message, 500);
  }
}

export async function deleteTodo(
  userId: string,
  todoId: string
): Promise<TodoItem> {
  try {
    const item = await todoAccess.deleteTodoItem(userId, todoId);
    logger.info("TODO item deleted successfully", {
      userId,
      todoId,
    });
    return item;
  } catch (error) {
    logger.error(error);
    throw new ErrorParse(error.message, 500);
  }
}

export async function generateSignedUrl(attachmentId: string): Promise<string> {
  try {
    logger.info("Generating signedURL");
    const uploadUrl = await getUploadUrl(attachmentId);
    logger.info("SignedURL generated");

    return uploadUrl;
  } catch (error) {
    logger.error(error);
    throw new ErrorParse(error.message, 500);
  }
}

export async function updateAttachmentUrl(
  userId: string,
  todoId: string,
  attachmentId: string
): Promise<void> {
  try {
    const attachmentUrl = getAttachmentUrl(attachmentId);
    await todoAccess.updateTodoItemAttachmentUrl(userId, todoId, attachmentUrl);

    logger.info("AttachmentURL updated successfully", {
      userId,
      todoId,
    });
    return;
  } catch (error) {
    logger.error(error);
    throw new ErrorParse(error.message, 500);
  }
}

class ErrorParse extends Error {
  code: number;

  constructor(message: string, code: number) {
    super();
    this.message = message;
    this.code = code;
  }
}
