import fs from 'node:fs';
const todosPath = './mcp-todos.json';
// In-memory todos storage
const todos = fs.existsSync(todosPath)
    ? JSON.parse(fs.readFileSync(todosPath, 'utf8'))
    : [
        {
            id: 1,
            title: 'Buy groceries',
        },
    ];
// Subscription callbacks per userID
let subscribers = [];
// Get the todos for a user
export function getTodos() {
    return todos;
}
// Add an item to the todos
export function addTodo(title) {
    todos.push({ id: todos.length + 1, title });
    fs.writeFileSync(todosPath, JSON.stringify(todos, null, 2));
    notifySubscribers();
}
// Subscribe to cart changes for a user
export function subscribeToTodos(callback) {
    subscribers.push(callback);
    callback(todos);
    return () => {
        subscribers = subscribers.filter((cb) => cb !== callback);
    };
}
// Notify all subscribers of a user's cart
function notifySubscribers() {
    for (const cb of subscribers) {
        try {
            cb(todos);
        }
        catch { }
    }
}
