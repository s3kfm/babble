

# 🗣️ Babble

**Babble** is a hands-free, AI-powered task manager built with Next.js. Instead of manually typing out todos, you can simply "braindump" your thoughts out loud. Using **Deepgram** for high-speed transcription and **Anthropic** for intelligent intent extraction, Babble identifies action items, organizes your list, and allows you to manage tasks entirely through natural speech. This is intended to be a demo of deepgram and usechat and not a serious project. However feel free to use the project for all its worth. 

## ✨ Features

*   **Voice Braindumping:** Speak naturally; the AI identifies what's an actual task and what's just rambling.
*   **Intelligent Deletion:** Ask Babble to "remove the laundry task" or "clear my list" using voice commands.
*   **Real-time Transcription:** Powered by Deepgram for low-latency, accurate speech-to-text.
*   **Contextual Understanding:** Uses Anthropic (Claude) to parse complex sentences into clean, actionable todo items.

<img width="960" height="905" alt="screenshot-babble-stt vercel app-2026 05 11-13_45_59" src="https://github.com/user-attachments/assets/8a53bec2-24f1-4e39-bac2-05b1845a5a06" />

---

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18.x or later)
*   A [Deepgram API Key](https://console.deepgram.com/)
*   An [Anthropic API Key](https://console.anthropic.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/s3kfm/babble.git](https://github.com/s3kfm/babble.git)
    cd babble
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your keys:
    ```env
    DEEPGRAM_API_KEY=your_deepgram_key_here
    ANTHROPIC_API_KEY=your_anthropic_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:4022](http://localhost:4022) with your browser to see the result.

---

## 🛠️ Usage

1.  **Launch:** Open the app and click on the **Babble Icon** to begin listening.
2.  **Speak:** Describe your day, mention things you need to do, or specific chores. 
    > *Example: "I really need to call the mechanic tomorrow, and oh, I should probably buy some milk on the way home."*
3.  **Process:** The AI will automatically add "Call the mechanic" and "Buy milk" to your list.
4.  **Manage:** To remove a task, just say "Delete the milk task" while the listener is active.

---

## 🏗️ Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Voice-to-Text:** [Deepgram](https://deepgram.com/)
*   **LLM Logic:** [Anthropic Claude API](https://www.anthropic.com/)
*   **Styling:** Tailwind CSS / DaisyUI (optional, if you used it)

---

## 📄 License

This project is public domain. Do with it what you please. No need to credit me.
