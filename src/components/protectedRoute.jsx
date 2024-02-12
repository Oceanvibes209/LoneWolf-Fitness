import { Navigate } from "react-router-dom"

// eslint-disable-next-line react/prop-types
export const ProtectedRoute = ({ children, user }) => {
    return user ? children: <Navigate to='/Login'></Navigate>;
};