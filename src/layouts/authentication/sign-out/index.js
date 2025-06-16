import { useAuth } from '../../../context/AuthContext';
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
    const navigate = useNavigate()
    const { signOut } = useAuth();

    useLayoutEffect(() => {
        signOut();
        navigate("/sign-in");
    }, []);
    return null;
}