import { UUID } from "src/users/user";

export interface Todo {
  id: UUID;
  text: string;
  files: File[];
}
