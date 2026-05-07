import { JazzProvider } from "jazz-tools/react";
import { TodoList } from "./TodoList.js";

export default function App() {
  return (
    <JazzProvider
      config={{
        appId: "<your-app-id>",
      }}
    >
      <h1>Todos</h1>
      <TodoList />
    </JazzProvider>
  );
}
