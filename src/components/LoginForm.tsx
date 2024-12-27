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
import { AppContext } from '@/Context/AppContext'
import { AppContextType } from '@/types'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '@/App'

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export const  LoginForm = () => {
    const navigate = useNavigate();
    const {loggedInUser,setLoggedInUser} = useContext(AppContext) as AppContextType;
    if(loggedInUser) return <Navigate to="/"/>
    const {toast} = useToast();
    const [isLoading, setIsLoading] = useState(false)
    const [loginErrMsg,setLoginErrMsg] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: "",
        },
    })

  const  onSubmit = async (values: z.infer<typeof formSchema>) =>  {
    try {
        
        setIsLoading(true);
        const {email,password} = values;
        
        const response = await axios.post(`${API_URL}/user/login`,{
            "email":email,
            "password":password,
        },{withCredentials:true});
        
        console.log(response);
        setLoggedInUser(response.data.user);
        toast({
            title:"Login successfull",
            "description":"You have succesfully logged in"
        })
        form.reset();
        const redirectUrl = localStorage.getItem('redirectAfterLogin') || '/';
        navigate(redirectUrl);
    } catch (error:any) {
        console.log(error);
        setLoginErrMsg(error.response.data.message);
        setTimeout(() => {
          setLoginErrMsg("");
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
        {loginErrMsg!=="" && <div className='my-2 text-red-500 font-semibold'>{loginErrMsg}</div>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  )
}

