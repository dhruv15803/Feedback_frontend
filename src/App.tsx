import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Layout from './Layouts/Layout'
import AuthPage from './Pages/AuthPage';
import AppContextProvider from "./Context/AppContext";
import { ProtectedRoute } from "./Layouts/ProtectedRoute";
import CreateFormPage from "./Pages/CreateFormPage";
import Home from "./Pages/Home";
import FormPage from "./Pages/FormPage";
import FormResponsesPage from "./Pages/FormResponsesPage";
import FormResponseDetailPage from "./Pages/FormResponseDetailPage";
import UserFormResponsesPage from "./Pages/UserFormResponsePage";
export const API_URL=import.meta.env.VITE_API_URL || "https://go-feedback-app.onrender.com"


function App() {

  return (
    <>
    <AppContextProvider>
    <Router>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route path='auth' element={<AuthPage/>}/>
            <Route path="/" element={<ProtectedRoute/>}>
              <Route index element={<Home/>}/>
              <Route path="create" element={<CreateFormPage/>}/>
              <Route path="form/:id" element={<FormPage/>}/>
              <Route path="form-responses/:id" element={<FormResponsesPage/>}/>
              <Route path="my-responses" element={<UserFormResponsesPage/>}/>
              <Route path="form-responses/:formId/:responseId" element={<FormResponseDetailPage/>}/>
            </Route>
          </Route>
        </Routes>
      </Router>
    </AppContextProvider>
    </>
  )
}

export default App;

