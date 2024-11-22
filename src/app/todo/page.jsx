"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TodoCard from "@/assets/todoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AuthContext } from "@/Context/authContext";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import TodoCreator from "@/assets/todoCreator";
import config from "@/config";
import UserProfileMenu from "@/assets/userProfile";

function Todo() {
  const [todo, setTodo] = useState({
    id: null,
    title: "",
    description: "",
    due_on: "",
    status: "PENDING",
    createdAt: "",
  });
  const [todoList, setTodoList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { jwt, userDetails } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!userDetails.userLoggedin) {
      router.push("/");
    }
    getTodo(jwt);
  }, [jwt]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTodo((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status) => {
    setTodo((prev) => ({ ...prev, status }));
  };

  const getTodo = async (accessToken) => {
    try {
      const response = await fetch(`${config.backendUrl}/api/tasks/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Ensure to replace with your actual token
          "Content-Type": "application/json",
        },
      }); 

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const todos = await response.json();
      setTodoList(todos);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return []; // Return an empty array or handle the error appropriately
    }
  };

  const createTodo = async () => {
    if (!todo.title) return;

    const newTodo = {
      ...todo,
      due_on: new Date(todo.due_on).toISOString(), // Ensure the due date is in ISO format
      status: todo.status || "PENDING",
    };

    try {
      const response = await fetch(`${config.backendUrl}/api/tasks/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`, // Replace with your actual token
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const createdTodo = await response.json();
      setTodoList((prev) => [...prev, createdTodo]);
      resetTodoForm(); // Reset form
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const resetTodoForm = () => {
    setTodo({
      id: null,
      title: "",
      description: "",
      due_on: "",
      status: "PENDING",
      createdAt: "",
    });
    setDialogOpen(false);
  };

  const updateTodo = async () => {
    if (!todo.title) return;  
    const updatedTodo = {
      ...todo,
      due_on: new Date(todo.due_on).toISOString(),
      status: todo.status || 'PENDING',
    };
  
    try {
      const response = await fetch(`${config.backendUrl}/api/tasks/${editingId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
  
      const updatedTask = await response.json();
      setTodoList((prev) =>
        prev.map((t) => (t.id === editingId ? updatedTask : t))
      );
      resetTodoForm();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${config.backendUrl}/api/tasks/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,},
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
  
      setTodoList((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditing = (todoItem) => {
    setEditingId(todoItem.id);
    setTodo(todoItem);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <UserProfileMenu/>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">My Todo List</h1>

        {/* Grid Layout for Todos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todoList.map((todoItem) => (
            <TodoCard
              key={todoItem.id}
              todoItem={todoItem}
              startEditing={startEditing}
              deleteTodo={deleteTodo}
            />
          ))}

          {/* Empty state when no todos */}
          {todoList.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">
                No todos yet. Click the + button to create your first todo!
              </p>
            </div>
          )}
        </div>
      </div>

      <TodoCreator
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        handleInputChange={handleInputChange}
        handleStatusChange={handleStatusChange}
        todo={todo}
        editingId={editingId}
        createTodo={createTodo}
        updateTodo={updateTodo}
      />
    </div>
  );
}

export default Todo;
