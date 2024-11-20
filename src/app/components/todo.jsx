"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";

function Todo() {
  const [todo, setTodo] = useState({ title: "", description: "", dueOn: "" });
  const [todoList, setTodoList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTodo(prev => ({ ...prev, [name]: value }));
  };

  const createTodo = () => {
    if (!todo.title) return;
    
    const newTodo = {
      ...todo,
      id: Date.now(),
      createdAt: new Date().toLocaleString()
    };

    setTodoList(prev => [...prev, newTodo]);
    setTodo({ title: "", description: "", dueOn: "" });
    setDialogOpen(false);
  };

  const updateTodo = () => {
    setTodoList(prev => 
      prev.map(t => t.id === editingId ? { ...t, ...todo } : t)
    );
    setEditingId(null);
    setTodo({ title: "", description: "", dueOn: "" });
    setDialogOpen(false);
  };

  const deleteTodo = (id) => {
    setTodoList(prev => prev.filter(t => t.id !== id));
  };

  const startEditing = (todoItem) => {
    setEditingId(todoItem.id);
    setTodo(todoItem);
    setDialogOpen(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10 relative">
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-6 space-y-2">
            {todoList.map(todoItem => (
              <div 
                key={todoItem.id} 
                className="flex justify-between items-center p-2 border rounded"
              >
                <div>
                  <div className="font-bold">{todoItem.title}</div>
                  <div className="text-sm text-gray-500">{todoItem.description}</div>
                  <div className="text-xs">Due: {todoItem.dueOn}</div>
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => startEditing(todoItem)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => deleteTodo(todoItem.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild className="fixed bottom-4 right-4">
          <Button size={"icon"} className="rounded-full">
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Todo' : 'Create Todo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              name="title"
              value={todo.title}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Description"
              name="description"
              value={todo.description}
              onChange={handleInputChange}
            />
            <Input
              type="date"
              name="dueOn"
              value={todo.dueOn}
              onChange={handleInputChange}
            />
            <Button 
              onClick={editingId ? updateTodo : createTodo}
              className="w-full"
            >
              {editingId ? 'Update Todo' : 'Create Todo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Todo;