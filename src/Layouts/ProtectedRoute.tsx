import { AppContext } from '@/Context/AppContext'
import { AppContextType } from '@/types'
import { Loader } from 'lucide-react';
import { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute = () => {
    const { loggedInUser, isLoading } = useContext(AppContext) as AppContextType;
    const location = useLocation(); // Get the current path

    if (isLoading) {
        return (
            <div className='flex items-center gap-2 justify-center'>
                <Loader />
                <span className='font-semibold'>Loading...</span>
            </div>
        );
    }

    if (loggedInUser == null) {
        // Store the current location to redirect after successful login
        sessionStorage.setItem('redirectAfterLogin', location.pathname);
        return <Navigate to="/auth" />;
    }

    return <Outlet />;
}
