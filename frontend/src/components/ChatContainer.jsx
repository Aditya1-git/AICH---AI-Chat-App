import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'

import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formateMessageTime } from '../lib/utils';
import { useAiStore } from '../store/useAiStore';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeToMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const { isAiopen, setAiOpen } = useAiStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
    subscribeToMessages();

    return () => unsubscribeToMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeToMessages]); // when selected user changes getMessages will be called

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser?._id]);

  if (isMessagesLoading) {
    return (
      <div className='relative flex h-full min-h-0 w-full flex-col overflow-hidden'>
        <ChatHeader />
        <div className='flex-1 min-h-0 overflow-y-auto'>
          <MessageSkeleton />
        </div>
        <div className='shrink-0 border-t border-base-300 bg-base-100'>
          <MessageInput />
        </div>
      </div>
    );
  }


  return (
    <div className='relative flex h-full min-h-0 w-full flex-col overflow-hidden'>
      <ChatHeader />

      <div className='flex-1 min-h-0 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
            <div className='chat-image avatar'>
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic ||
                      "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"
                      : selectedUser?.profilePic ||
                      "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className='chat-header mb-1'>
              <time className='text-xs opacity-50 ml-1'>
                {formateMessageTime(message.createdAt)}
              </time>
            </div>
            <div className='chat-bubble flex flex-col'>
              {message.image && (
                <img src={message.image} alt="attachment" className='sm:max-w-90 rounded-md mb-2 mt-1' />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className='shrink-0 border-t border-base-300 bg-base-100'>
        <MessageInput />
      </div>
    </div>

  )
}

export default ChatContainer