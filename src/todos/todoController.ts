import { Route, Controller, Post, Body } from "tsoa";
import { Todo } from "./todo";
import { provideSingleton } from "../util/provideSingleton";

@Route("/todos")
@provideSingleton(TodosController)
export class TodosController extends Controller {
  @Post()
  public async createTodo(@Body() _body: Partial<Todo>) {
    return;
  }
}
