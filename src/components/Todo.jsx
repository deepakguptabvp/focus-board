import React, { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import useLocalStorage from "../hooks/useLocalStorage";

const Todo = () => {
  const [textValue, setTextValue] = useState(""); // edit text in input box.
  const [taskList, setTaskList] = useLocalStorage("tasks", []); // show all task list.
  const [filterTasks, setFilterTasks] = useState("all"); //filter task state.

  // Edit in input list
  const editValue = (e) => {
    e.preventDefault();
    setTextValue(e.target.value);
    // console.log(e.target.value);
  };

  // List of Tasks
  const addTasks = () => {
    const value = textValue.trim();
    if (!value) return;

    setTaskList((prev) =>
      prev.some((item) => item.text.toLowerCase() === value.toLowerCase())
        ? prev
        : [...prev, { text: value, completed: false }],
    );
    setTextValue("");
  };

  //toggle function for task completion
  const handleToggle = (id) => {
    setTaskList((prev) =>
      prev.map((item, index) =>
        index === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  // filter task by All / Pending / completed
  const filteredTasks = taskList.filter((task) => {
    if (filterTasks === "pending") return !task.completed;
    if (filterTasks === "completed") return task.completed;
    return true;
  });

  // delete task by id
  const handleDeleteTask = (id) => {
    setTaskList((prev) => prev.filter((_, index) => index !== id));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto shadow-md  ">
        {/* <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">
          FocusBoard App
        </h1> */}

        {/* Add Task */}
        <div className="my-10">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input
              type="text"
              value={textValue}
              onChange={editValue}
              placeholder="What's the task for today?"
              className="w-full sm:w-96 px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-200 text-gray-100 placeholder-gray-200"
            />
            <button
              onClick={addTasks}
              className="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Filter Task - ALL / Pending / Completed */}
        <div className="flex flex-col md:flex-row justify-center gap-2 mb-8">
          <button
            onClick={() => setFilterTasks("all")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
              filterTasks === "all"
                ? "bg-gray-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterTasks("pending")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
              filterTasks === "pending"
                ? "bg-red-500 text-white shadow-lg"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterTasks("completed")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
              filterTasks === "completed"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Completed
          </button>
        </div>

        {/* List of tasks */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg italic font-bold">
                No tasks found. Add a new task above!
              </p>
            </div>
          ) : (
            filteredTasks.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggle(index)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span
                      className={`text-lg ${
                        item.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      title="Edit Task"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <FaPen className="w-4 h-4" />
                    </button>
                    <button
                      title="Delete Task"
                      onClick={() => handleDeleteTask(index)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
