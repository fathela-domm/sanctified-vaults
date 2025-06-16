import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";

export default function NotFound () {
    const { userRole } = useAuth();
    const navigate = useNavigate();
    console.log(userRole);
    useEffect(() => {
        if (userRole && userRole === "admin") {
            navigate("/baptism_registry");
        } else
            navigate("/sign-in");
    }, [userRole])
    return null;
}