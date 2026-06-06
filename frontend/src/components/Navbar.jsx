import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut, Settings, User } from 'lucide-react'
const Navbar = () => {

  const { authUser , logout} = useAuthStore();

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">AICH</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><a href="/setting">
            <Settings className='w-4 h-4' />
            <span>Settings</span>
          </a></li>

          {authUser && (
            <>
              <li><a href="/profile">
                <User className='size-5' />
                <span>Profile</span>
              </a></li>
              <li>
                <button onClick={logout}>
                  <LogOut className='size-5' />
                  <span>Logout</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Navbar