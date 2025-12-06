import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { projectSchema, todoSchema } from "./types.ts";

export const queryClient = new QueryClient();

export const todoCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await fetch(TODO_API_URL);
      return response.json();
    },
    queryClient,
    getKey: (item) => item.id,
    onUpdate: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map(({ original, changes }) =>
          fetch(`${TODO_API_URL}/${original.id}`, {
            method: "PATCH",
            body: JSON.stringify(changes),
          })
        )
      );
    },
    schema: todoSchema,
  })
);

const API_URL = "http://localhost:3000";
const TODO_API_URL = API_URL + "/todos";
const PROJECT_API_URL = API_URL + "/projects";

export const projectCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch(PROJECT_API_URL);
      return response.json();
    },
    queryClient,
    getKey: (item) => item.id,
    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0];
      await fetch(`${PROJECT_API_URL}/${original.id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
    },
    schema: projectSchema,
  })
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
