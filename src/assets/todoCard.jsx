import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle, Edit2, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function TodoCard({ todoItem, startEditing, deleteTodo }) {
  // Map status to badge colors and icons
  const statusConfig = {
    Completed: { 
      color: "green", 
      icon: <CheckCircle2 className="w-4 h-4 mr-2" />,
      text: "text-green-700" 
    },
    Pending: { 
      color: "yellow", 
      icon: <Clock className="w-4 h-4 mr-2" />,
      text: "text-yellow-700" 
    },
    Skipped: { 
      color: "red", 
      icon: <XCircle className="w-4 h-4 mr-2" />,
      text: "text-red-700" 
    },
  };

  const status = todoItem.status || "Pending";
  const currentStatus = statusConfig[status] || statusConfig.Pending;

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 relative group">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-grow">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {todoItem.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {todoItem.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Status:</span>
                <Badge 
                  variant="outline" 
                  className={`${currentStatus.text} border-${currentStatus.color}-300 bg-${currentStatus.color}-50`}
                >
                  {currentStatus.icon}
                  {status}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-500">
                <span className="font-medium">Due:</span> {todoItem.due_on}
              </div>
            </div>
          </div>
          
          {/* Action Icons */}
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    onClick={() => startEditing(todoItem)}
                    className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-gray-600 hover:text-blue-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Todo</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    onClick={() => deleteTodo(todoItem.id)}
                    className="p-2 hover:bg-red-50 rounded-full cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Todo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TodoCard;