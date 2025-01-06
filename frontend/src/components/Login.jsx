import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

function Login() {

  const [input, setInput] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const changeEventHandler = (e)=>{
    setInput({...input, [e.target.name]:e.target.value});
  }

  const signupHandler = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true); 
      const res = await axios.post('http://localhost:3000/api/v1/user/login', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials:true
      });
      if(res.data.success){
        navigate('/');
        toast.success(res.data.message);
        setInput({
          email:'',
          password:''
        });
      }
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className='flex items-center w-screen h-screen justify-center'>
        <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
          <div className='my-4 text-gray-700'>
            <h1 className='text-center font-bold text-xl'>Logo</h1>
            <p className='text-sm text-center'>Login to see photos and videos from your friends</p>
          </div>
          <div>
            <span className='font-medium'>Email</span>
            <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
            />
          </div>
          <div>
            <span className='font-medium'>Password</span>
            <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
            />
          </div>
          {
            loading ? (
                <Button>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'> Please Wait</Loader2>
                </Button>
            ) : (
                <Button type="submit">Login</Button>
            )
          }
          <span className='text-center'>Dont have an account? <Link to='/signup' className='text-blue-600'>Signup</Link></span>
        </form>
      </div>
    </>
  )
}

export default Login