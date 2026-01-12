import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';

const ProtectedRoute = ({ element, auth }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (auth === null) {
        return element;
    }

    if(auth === true && isAuthenticated === false){
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    if(auth === false && isAuthenticated === true){
        return <Navigate to="/" replace state={{ from: location.pathname }} />
    }

    return element;

};

export default ProtectedRoute;