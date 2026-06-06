import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Ellipse, Ellipsis, Eye, EyeOff, Loader2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [showpassword , setShowPassword] = useState(false);
  const [formData , setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if(!formData.fullName.trim()) return toast.error("Full name is required");
    if(!formData.email.trim()) return toast.error("Email is required");
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if(!formData.password) return toast.error("Password is required");
    if(formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    if(/\s/.test(formData.password)) return toast.error("Password must not contain spaces");
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if(success == true) signup(formData);
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="text-center sm:text-md lg:text-left lg:text-4xl ">
      <h1 className="text-5xl font-bold-400 lg:font-bold">Create Account</h1>
      <p className="py-6">
       Get started with you free account
      </p>
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="fieldset">
          <label className="label">Full name</label>
          <input type="text"
                   className={`input input-bordered w-full `}
                   placeholder='John Doe'
                   value={formData.fullName}
                   onChange={(e) => setFormData({ ...formData , fullName: e.target.value})}
            />
          <label className="label">Email</label>
          <input type="text"
                   className={`input input-bordered w-full `}
                   placeholder='you@gmail.com'
                   value={formData.email}
                   onChange={(e) => setFormData({ ...formData , email: e.target.value})}
            />
          <label className="label">Password</label>
          <div className='relative'>
          <input type={showpassword ? "text" : "password"}
                   className={`input input-bordered w-full `}
                   placeholder='******'
                   value={formData.password}
                   onChange={(e) => setFormData({ ...formData , password: e.target.value})}
            />
            <button type='button' className='absolute inset-y-0 right-0 pr-3 flex items-center'
            onClick={() => setShowPassword(!showpassword)}>
              {
                showpassword ?(
                  <EyeOff className='size-5 text-base-content/40'/>
                ):(
                  <Eye className='size-5 text-base-content/40'/>
                )
              }
            </button>
          </div>
          <button type="submit" className="btn btn-neutral mt-4" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                Loading
                <Ellipsis className="animate-pulse text-gray-500" size={32} />
                </>
              ): (
                "Create Account"
              )}
          </button>
          <div className='text-center pt-1'>
            <p className='text-base-content/60'>
              Already have an account?{" "}
              <Link to="/login" className='link link-primary'>Sign in</Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  </div>
</div>
  )
}

export default SignUpPage;