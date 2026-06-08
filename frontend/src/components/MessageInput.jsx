import React, { useRef, useState, useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAiStore } from '../store/useAiStore';

const MessageInput = () => {

  const [text,setText] = useState("");
  const [imagePreview , setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const {sendMessage , selectedUser} = useChatStore();
  const { messages, sendAiMessage , setAiOpen, clearInputSignal, inputDraft, setInputDraft } = useAiStore();

  useEffect(() => {
    if (clearInputSignal) {
      setText("");
    }
  }, [clearInputSignal]);

  useEffect(() => {
    if (inputDraft) {
      setText(inputDraft);
      // clear draft in store
      setInputDraft(null);
    }
  }, [inputDraft, setInputDraft]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        if (messages && messages.length > 0) {
          const last = messages[messages.length - 1];
          const content = last?.content ?? last?.text ?? '';
          setText(content);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [messages]);

  const handleImageChange =(e) => {
    const file = e.target.files[0];
    if(!file.type.startsWith("image/")){
      toast.error("please select a Image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () =>{
      setImagePreview(reader.result);
    }
    reader.readAsDataURL(file);;
  }
  const removeImage = () => {
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async(e) => {
    e.preventDefault();
    if(!text.trim() && !imagePreview) return;
    try{
      const delimiter = '/-';
      const idx = text.indexOf(delimiter);

      if (idx !== -1) {
        if (!selectedUser?._id) {
          toast.error('No user selected for AI');
          return;
        }
        setAiOpen(true);
        const promptBeforeDash = text.slice(0, idx).trim();
        const promptAfterDash = text.slice(idx + delimiter.length).trim();
        const prompt = `This is the text you have to modify -> <${promptBeforeDash}> , This is the prompt ${promptAfterDash}`;
        await sendAiMessage(selectedUser?._id, prompt);
      } else {
        await sendMessage({
          text: text.trim(),
          image: imagePreview,
        });
      }

      setText("");
      setImagePreview(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }catch(err){
      console.log("Failed to send message." , err);
      toast.error(err?.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <textarea
            rows={1}
            className="w-full textarea textarea-bordered rounded-lg textarea-sm sm:textarea-md resize-none"
            placeholder="Message... or /- fix grammar, rewrite, summarize"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;