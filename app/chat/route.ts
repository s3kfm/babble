import { convertToModelMessages, streamText, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, projects, tasks } = await req.json();

  const modelMessages = await convertToModelMessages(messages);
  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    system: `
      You are a task manager assistant. The user speaks out their tasks through speech to text. 
      Extract tasks, modify existing ones, delete or complete them based on user's response.
      Tasks belong to projects (as strings). For non-classifiable projects, use "General". 
      
      When you want to create a new project, simply include the project name in the task's project field.
      The system will automatically create the project if it doesn't exist.
      
      Here're the current projects: 
      ${projects.join(", ")}
      And task list is as follows: 
      ${JSON.stringify(tasks, null, 2)}


    `,
    tools: {
      addTasks: tool({
        description:
          "Add multiple tasks at once. Use this when the user mentions multiple tasks in one statement.",
        inputSchema: z.object({
          tasks: z
            .array(
              z.object({
                text: z.string().describe("The task description"),
                project: z
                  .string()
                  .describe(
                    "The project name. If this is a new project name, it will be created automatically.",
                  ),
                completed: z
                  .boolean()
                  .optional()
                  .describe(
                    "Whether the task is completed (defaults to false)",
                  ),
              }),
            )
            .describe("Array of tasks to add"),
        }),
      }),

      deleteTasks: tool({
        description: "Delete multiple tasks at once",
        inputSchema: z.object({
          ids: z.array(z.string()).describe("Array of task IDs to delete"),
        }),
      }),
      updateTasks: tool({
        description:
          "Update one or more tasks. Can update task text, completion status, or move tasks to different projects.",
        inputSchema: z.object({
          updates: z
            .array(
              z.object({
                id: z.string().describe("The task ID to update"),
                text: z.string().optional().describe("New task description"),
                completed: z
                  .boolean()
                  .optional()
                  .describe("New completion status"),
                project: z
                  .string()
                  .optional()
                  .describe(
                    "New project name. If this is a new project name, it will be created automatically.",
                  ),
              }),
            )
            .describe("Array of task updates"),
        }),
      }),
    },
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
