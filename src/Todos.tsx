import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "./components/ui/item";
import { Checkbox } from "./components/ui/checkbox";
import { eq, useLiveQuery } from "@tanstack/react-db";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { cn } from "./lib/utils";
import type { Todo } from "./types";
import { todoCollection } from "./main";

type TodosProps = {
  projectId: string;
};

export const Todos = ({ projectId }: TodosProps) => {
  const updateTodo = (todo: Todo) => async (checkedState: CheckedState) => {
    try {
      todoCollection.update(todo.id, (draft) => {
        draft.completed = Boolean(checkedState);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const { data: todos } = useLiveQuery((q) =>
    q
      .from({ todo: todoCollection })
      .where(({ todo }) => eq(todo.projectId, projectId))
  );

  return todos.map((todo) => (
    <Item variant="outline" key={todo.id} className={cn("m-2")}>
      <ItemContent>
        <ItemTitle>{todo.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Checkbox onCheckedChange={updateTodo(todo)} checked={todo.completed} />
      </ItemActions>
    </Item>
  ));
};
