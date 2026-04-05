import React from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { useState } from 'react';

const Input = ({value, onChange,placeholder,type, label}) => {
    
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    return (
    <div>
      <label htmlFor="" className='text-[13px] text-slate-800'>{label}</label>
      <div className='input-box'>
        <input type={type=="password" ? (showPassword ?'text' : 'password') : type}  placeholder={placeholder} value={value} className="w-full bg-transparent outline-none" onChange={(e) => onChange(e)}/>
        {type === "password" && (
            <span onClick={toggleShowPassword} className="ml-2 cursor-pointer">
                {showPassword ?
                    <FaRegEyeSlash 
                    size={22} className="text-purple-400 cursor-pointer" onClick={() => toggleShowPassword()} />
                    :   
                    <FaRegEye 
                    size={22} className="text-slate-400 cursor-pointer" onClick={() => toggleShowPassword()} />
                }
            </span>
        )}      
        </div>
    </div>
  )
}

export default Input
