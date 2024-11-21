import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function TodoCreator({
  dialogOpen, 
  setDialogOpen, 
  handleInputChange, 
  handleStatusChange, 
  todo, 
  editingId, 
  updateTodo, 
  createTodo
}) {
  // Status options
  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "COMPLETED", label: "Completed" },
    { value: "SKIPPED", label: "Skipped" },
    { value: "IN_PROGRESS", label: "In Progress" }
  ];

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild className="fixed bottom-4 right-4">
          <Button size={"icon"} className="rounded-full">
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Todo" : "Create Todo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter todo title"
                name="title"
                value={todo.title}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter todo description"
                name="description"
                value={todo.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="due_on">Due Date</Label>
              <Input
                id="due_on"
                type="date"
                name="due_on"
                value={todo.due_on}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label>Status</Label>
              <Select
                name="status"
                value={todo.status}
                onValueChange={(value) => handleStatusChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={editingId ? updateTodo : createTodo}
              className="w-full mt-4"
            >
              {editingId ? "Update Todo" : "Create Todo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TodoCreator;