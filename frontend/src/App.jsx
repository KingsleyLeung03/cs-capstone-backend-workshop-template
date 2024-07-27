import { useEffect, useState } from "react";
import TodoList from "./components/TodoList";
import styles from "./App.module.css";
import AddTodoForm from "./components/AddTodoForm";
import AddButton from "./components/AddButton";
import BottomDrawer from "./components/BottomDrawer";
import SearchBar from "./components/SearchBar";
import { initialTodos } from "./initial-todos";

export default function App() {
  // True if the "add todo" form should be shown, false otherwise.
  const [showAddForm, setShowAddForm] = useState(false);

  // The todo list
  const [todos, setTodos] = useState(initialTodos);

  // The search string to use to filter the displayed todos.
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/todos")
    .then((response) => response.json())
    .then((todos) => setTodos(todos));
  }, []);

  /**
   * Creates a new todo.
   *
   * @param {string} description the description of the new todo.
   * @param {string} dueDate the due date, in the format YYYY-MM-DD
   */
  function createTodo(description, dueDate) {
    const newTodo = {
      id: todos[todos.length - 1].id + 1,
      description,
      dueDate,
      isComplete: false,
    };
    setTodos([...todos, newTodo]);
  }

  /**
   * Toggles the isComplete status of the given todo.
   *
   * @param {number} id the id of the todo to toggle
   */
  function toggleComplete(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
      )
    );
  }

  /**
   * Deletes the todo with the given id.
   *
   * @param {number} id the id of the todo to delete
   */
  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  // Apply search filter
  const filteredTodos = todos.filter(
    (todo) =>
      search.length === 0 ||
      todo.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Page header: Title */}
      <nav className={styles.nav}>
        <div className={styles.container}>
          <h1>My Todo List</h1>
        </div>
      </nav>

      {/* Main content: Todo list and search box */}
      <main className={styles.container}>
        <SearchBar onChange={(search) => setSearch(search)} />
        <TodoList
          todos={filteredTodos}
          onToggleComplete={(todo) => toggleComplete(todo.id)}
          onDelete={(todo) => deleteTodo(todo.id)}
        />
      </main>

      {/* Page footer: "Add todo" form */}
      <BottomDrawer>
        <div className={styles.container}>
          {showAddForm ? (
            <AddTodoForm
              onSubmit={createTodo}
              onCancel={() => setShowAddForm(false)}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              <AddButton onClick={() => setShowAddForm(!showAddForm)} />
            </div>
          )}
        </div>
      </BottomDrawer>
    </>
  );
}
