import { AppContext } from '@/Context/AppContext'
import { AppContextType } from '@/types'
import { Loader } from 'lucide-react';
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    
    const {loggedInUser,isLoading} = useContext(AppContext) as AppContextType;

    console.log(loggedInUser);

    if(isLoading) {
        console.log("waiting...")
        return (
            <>
                <div className='flex items-center gap-2 justify-center'>
                    <Loader/>
                    <span className='font-semibold'>Loading...</span>
                </div>
            </>
        )
    }

    if(loggedInUser==null) {
        return <Navigate to="/auth"/>
    } 

    return <Outlet/>
}
