import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle, Edit2, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function TodoCard({ todoItem, startEditing, deleteTodo }) {
  const statusConfig = {
    Completed: { 
      color: "bg-green-100 text-green-700 border-green-200", 
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    Pending: { 
      color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
      icon: <Clock className="w-4 h-4" />,
    },
    Skipped: { 
      color: "bg-red-100 text-red-700 border-red-200", 
      icon: <XCircle className="w-4 h-4" />,
    },
  };

  const status = todoItem.status || "Pending";
  const currentStatus = statusConfig[status] || statusConfig.Pending;
  
  // Format the date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
      <CardContent className="p-6">
        {/* Status Badge - Top Right */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex-grow pr-4 line-clamp-1">
            {todoItem.title}
          </h3>
          <Badge 
            variant="outline" 
            className={`${currentStatus.color} flex items-center gap-1.5 px-2.5 py-1 rounded-full`}
          >
            {currentStatus.icon}
            {status}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">
          {todoItem.description || "No description provided"}
        </p>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {/* Due Date */}
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">
              Due: {formatDate(todoItem.due_on)}
            </span>
          </div>

          {/* Action Buttons */}
          <TooltipProvider>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => startEditing(todoItem)}
                    className="p-2 hover:bg-blue-50 rounded-full transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Todo</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => deleteTodo(todoItem.id)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Todo</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}

export default TodoCard;