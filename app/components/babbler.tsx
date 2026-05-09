import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { StopCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDeepgramFlux } from "use-deepgram";
import { toast } from "sonner";
import { useTaskStore } from "../store/task-store";

interface AddTasksInput {
  tasks: Array<{
    id?: string;
    text: string;
    completed?: boolean;
    project: string;
  }>;
}

interface DeleteTasksInput {
  ids: string[];
}

interface UpdateTasksInput {
  updates: Array<{
    id: string;
    text?: string;
    completed?: boolean;
    project?: string;
  }>;
}

interface DeleteProjectInput {
  project: string;
  reassignToProject?: string;
}

export default function Babbler({
  token,
  onStop,
}: {
  token: string;
  onStop: () => void;
}) {
  const [showStartMessage, setShowStartMessage] = useState(true);
  const {
    addTasks,

    deleteTasks,
    updateTasks,
    deleteProject,

    tasks,
    projects,
  } = useTaskStore();
  const [pendingMessages, setPendingMessages] = useState<string[]>([]);

  const { sendMessage, status, addToolOutput } = useChat({
    transport: new DefaultChatTransport({
      api: "/chat",
      prepareSendMessagesRequest: ({ id, messages }) => {
        return { body: { id, messages, tasks, projects } };
      },
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall: ({ toolCall: { toolName, toolCallId, input } }) => {
      switch (toolName) {
        case "addTasks": {
          const addTasksInput = input as AddTasksInput;
          addTasks(addTasksInput.tasks);
          const count = addTasksInput.tasks.length;
          toast.success(`${count} task${count === 1 ? "" : "s"} added`);
          addToolOutput({ tool: toolName, toolCallId, output: true });
          break;
        }

        case "deleteTasks": {
          const deleteTasksInput = input as DeleteTasksInput;
          deleteTasks(deleteTasksInput.ids);
          const count = deleteTasksInput.ids.length;
          toast.success(`${count} task${count === 1 ? "" : "s"} deleted`);
          addToolOutput({ tool: toolName, toolCallId, output: true });
          break;
        }
        case "updateTasks": {
          const updateTasksInput = input as UpdateTasksInput;
          updateTasks(updateTasksInput.updates);
          const count = updateTasksInput.updates.length;
          toast.success(`${count} task${count === 1 ? "" : "s"} updated`);
          addToolOutput({ tool: toolName, toolCallId, output: true });
          break;
        }
        case "deleteProject": {
          const deleteProjectInput = input as DeleteProjectInput;
          deleteProject(
            deleteProjectInput.project,
            deleteProjectInput.reassignToProject,
          );
          toast.success(`Project deleted`);
          addToolOutput({ tool: toolName, toolCallId, output: true });

          break;
        }
      }
    },
  });

  useEffect(() => {
    async function sendNextMessage() {
      if (status === "ready") {
        const top = pendingMessages[0];
        if (!top) return;
        setPendingMessages((prev) => prev.slice(1));
        await sendMessage({
          role: "user",
          parts: [{ type: "text", text: top.trim() }],
        });
      }
    }
    sendNextMessage();
  }, [pendingMessages, status]);

  const { interimTranscript } = useDeepgramFlux({
    token,
    onError: () => {
      toast.error("Something went wrong with deepgram");
    },
    eotTimeoutMs: 2000,
    eotThreshold: 0.8,
    onTurnEnd: (transcript) => {
      console.log("Turn end", transcript);
      setPendingMessages((msgs) => [...msgs, transcript]);
    },
    onTurnStart: () => {},
  });
  useEffect(() => {
    if (interimTranscript.length > 0) {
      setTimeout(() => setShowStartMessage(false));
    }
  }, [interimTranscript]);
  return (
    <div className="flex justify-between">
      <div className="p-2">
        {showStartMessage && "Start speaking"}
        {interimTranscript}
      </div>
      <button onClick={onStop} className="btn-secondary btn">
        <StopCircle size={24} />
        Stop
      </button>
    </div>
  );
}
