import { useContext, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from '@/components/LoginForm'
import { RegisterForm } from '@/components/RegisterForm'
import { AppContext } from '@/Context/AppContext'
import { AppContextType } from '@/types'
import { Navigate } from 'react-router-dom'

export default function AuthPage() {
  const { loggedInUser } = useContext(AppContext) as AppContextType;

  if (loggedInUser) return <Navigate to={"/"} />  // Redirect to original URL after login

  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Login or create an account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
