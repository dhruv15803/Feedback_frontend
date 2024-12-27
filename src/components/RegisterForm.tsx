import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'
import axios from "axios"
import { API_URL } from '@/App'
import { AppContext } from '@/Context/AppContext'
import { AppContextType } from '@/types'
import { Navigate, useNavigate } from 'react-router-dom'

const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 8 characters.",
    }).refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase character.",
    }).refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
      message: "Password must contain at least one special character.",
    }),
  })

export const RegisterForm = ({redirectUrl}:{redirectUrl:string}) =>  {
    const navigate = useNavigate();
  const {loggedInUser,setLoggedInUser} = useContext(AppContext) as AppContextType;
  if(loggedInUser) return <Navigate to="/"/>
  const {toast} = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [registerErrMsg,setRegisterErrMsg] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        setIsLoading(true);
        const response = await axios.post(`${API_URL}/user/register`,{
            "email":values.email,
            "username":values.username,
            "password":values.password
        },{withCredentials:true});
        console.log(response);
        setLoggedInUser(response.data.user);
        toast({title:"Registration successfull",description:"You have successfully registered"})
        form.reset();
        navigate(redirectUrl);
    } catch (error:any) {
        console.log(error);
        setRegisterErrMsg(error.response.data.message);
        setTimeout(() => {
          setRegisterErrMsg("")
        },3000)
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {registerErrMsg!=="" && <div className='my-2 text-red-500 font-semibold'>{registerErrMsg}</div> }
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  )
}

