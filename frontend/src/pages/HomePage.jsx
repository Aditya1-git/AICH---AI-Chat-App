import { useRef } from "react";

import { useChatStore } from "../store/useChatStore";
import { useAiStore } from "../store/useAiStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import AiChatContainer from "../components/AiChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  const {
    isAiopen,
    setAiOpen,
    aiWidth,
    setAiWidth,
  } = useAiStore();

  const dragStarted = useRef(false);
  const startPos = useRef(0);
  const startWidthRef = useRef(0);

  const startResize = (e) => {
    e.preventDefault();

    dragStarted.current = false;
    startPos.current = e.clientX;
    
    // If it's open, use current width. If it's closed, start calculations from 0px.
    startWidthRef.current = isAiopen ? aiWidth : 0;

    const handleMove = (event) => {
      const movement = Math.abs(event.clientX - startPos.current);

      if (movement > 5) {
        dragStarted.current = true;
      }

      // Calculate how far the mouse moved left
      const diff = startPos.current - event.clientX;
      let newWidth = startWidthRef.current + diff;

      // If dragging while closed, make sure the panel activates open
      if (!isAiopen && dragStarted.current && newWidth > 10) {
        setAiOpen(true);
      }

      // If the user drags too far right/closes it completely, snap it shut
      if (isAiopen && newWidth <= 150) {
        setAiOpen(false);
        handleUp();
        return;
      }

      // Constrain width constraints between 250px and 700px
      setAiWidth(Math.max(250, Math.min(700, newWidth)));
    };

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);

      // Simple click behavior still toggles it perfectly
      if (!dragStarted.current) {
        setAiOpen(!isAiopen);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-base-200 p-4">
      <div className="bg-base-100 rounded-lg shadow-cl w-full h-full min-h-0">
        <div className="flex h-full min-h-0 rounded-lg overflow-hidden">
          <Sidebar />

          {!selectedUser ? (
            <NoChatSelected />
          ) : (
            <div className="flex flex-1 min-w-0 min-h-0 relative">
              {/* Main Chat */}
              <div className="flex-1 min-w-0 min-h-0">
                <ChatContainer />
              </div>

              {/* Drag / Toggle Handle */}
              <button
                onMouseDown={startResize}
                className="
                  absolute
                  top-1/2
                  -translate-y-1/2
                  z-50
                  h-24
                  w-6
                  rounded-l-xl
                  rounded-r-none
                  bg-base-300
                  border
                  border-base-300
                  hover:bg-base-300
                  flex
                  items-center
                  justify-center
                  cursor-ew-resize
                  select-none
                  transition-colors
                "
                style={{
                  right: isAiopen ? `${aiWidth - 1}px` : "0px",
                }}
              >
                {isAiopen ? ">" : "<"}
              </button>

              {/* AI Chat */}
              {isAiopen && (
                <div
                  className="
                    flex-shrink-0
                    border-l
                    border-base-300
                    overflow-hidden
                  "
                  style={{
                    width: `${aiWidth}px`,
                  }}
                >
                  <AiChatContainer />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;