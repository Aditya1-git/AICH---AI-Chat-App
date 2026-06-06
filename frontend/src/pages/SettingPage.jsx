import React from 'react'
import { Send } from 'lucide-react'
import { useThemeStore } from '../store/useThemeStore'

const THEMES = [
  'light',
  'dark',
  'cupcake',
  'retro',
  'coffee',
  'synthwave',
  'dracula',
]

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
]

const SettingPage = () => {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`group flex flex-col items-center gap-2 p-2 rounded-lg transition-colors w-full ${theme === t ? 'bg-base-200' : 'hover:bg-base-200/50'}`}
            >
              <div className="relative h-10 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary" />
                  <div className="rounded bg-secondary" />
                  <div className="rounded bg-accent" />
                  <div className="rounded bg-neutral" />
                </div>
              </div>
              <span className="text-[12px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        <div>
          <label className="block mb-2 font-medium">Preview</label>
          <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-200 rounded-lg">
            {PREVIEW_MESSAGES.map((message) => (
              <div key={message.id} className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl p-3 shadow-sm ${message.isSent ? 'bg-primary text-primary-content' : 'bg-base-100'}`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-[10px] mt-1.5 ${message.isSent ? 'text-primary-content/70' : 'text-base-content/70'}`}>
                    12:00 PM
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input (preview only) */}
          <div className="p-4 border-t border-base-300 bg-base-100 rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-bordered flex-1 text-sm h-10"
                placeholder="Type a message..."
                value="This is a preview"
                readOnly
              />
              <button className="btn btn-primary h-10 min-h-0">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingPage