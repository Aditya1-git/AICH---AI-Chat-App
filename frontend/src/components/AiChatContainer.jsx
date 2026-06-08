import { useState, useRef, useEffect } from "react";
import { Bot, Send, CornerDownLeft } from "lucide-react";

import { useChatStore } from "../store/useChatStore";
import { useAiStore } from "../store/useAiStore";

const AiChatContainer = () => {
  const [prompt, setPrompt] = useState("");

  const { selectedUser } = useChatStore();

  const {
    messages,
    sendAiMessage,
    isLoading,
    setInputDraft,
  } = useAiStore();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim() || isLoading) return;

    const currentPrompt = prompt.trim();
    setPrompt(""); 

    try {
      await sendAiMessage(selectedUser._id, currentPrompt);
    } catch (err) {
      setPrompt(currentPrompt); 
    }
  };

  return (
    /* FIX: Changed parent to max-h-full h-full so it fills the dynamic flex column exactly */
    <div className="h-full max-h-full w-full flex flex-col bg-base-100 overflow-hidden relative">

      {/* Header */}
      <div className="p-4 border-b border-base-300 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold text-base-content">
              AI Assistant
            </h2>
            <p className="text-sm text-base-content/60">
              Helping with this conversation
            </p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      {/* FIX: overflow-y-auto ensures scrolling works exclusively inside this scroll pane */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 container-snap">
        {messages.length === 0 && (
          <div className="text-center text-base-content/50 mt-10">
            Start a conversation with AI
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div
              className={`chat-bubble max-w-[85%] text-sm ${
                message.role === "assistant"
                  ? "chat-bubble-primary text-primary-content"
                  : "bg-base-200 text-base-content"
              }`}
            >
              <div className="flex flex-col items-start gap-2 break-words w-full">
                <div className="w-full leading-relaxed">
                  {message.content}
                </div>
                
                {message.role === "assistant" && (
                  <button
                    type="button"
                    onClick={() => setInputDraft(message.content)}
                    className="
                      btn
                      btn-xs
                      gap-1
                      mt-1
                      border
                      border-primary-focus/30
                      bg-primary-focus/20
                      hover:bg-primary-focus/40
                      text-primary-content/90
                    "
                    title="Insert into input"
                  >
                    <CornerDownLeft size={12} />
                    <span className="text-[10px]">Use Draft</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-primary opacity-80 flex items-center gap-2">
              <span className="loading loading-dots loading-xs"></span>
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-base-300 p-3 bg-base-100 flex-shrink-0">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 items-center"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={isLoading ? "AI is processing..." : "Ask AI..."}
            disabled={isLoading}
            className="input input-bordered input-sm flex-1 bg-base-200 focus:bg-base-100 text-sm h-10"
          />

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="btn btn-primary btn-sm h-10 min-h-0 px-4"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default AiChatContainer;