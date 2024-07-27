import { Router } from "express";
import { retrieveTodos, createTodo, updateCompleteStatus } from "../../data/todos-dao.js";

const router = Router();

router.get("/", async (req, res) => {
    return res.json(await retrieveTodos())
});

router.post("/", async (req, res) => {
    const { description, dueDate } = req.body;
    if (!description || !dueDate) {
        return res.sendStatus(422);
    }
    const todo = await createTodo(description, dueDate);
    return res.location(`/api/todos/${todo.id}`).status(201).json(todo);
});

router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const { isComplete } = req.body;
    if (!isComplete) {
        return res.sendStatus(422);
    }
    const success = updateCompleteStatus(id, isComplete);
    res.sendStatus(success ? 204 : 404 );
})

export default router;