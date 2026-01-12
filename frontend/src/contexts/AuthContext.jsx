import { createContext, useContext, useEffect, useState } from "react";
import { apiUrl, apiOptions } from "@services/API";

// Cria o contexto
const AuthContext = createContext();

// Hook pra acessar o contexto
const useAuth = () => useContext(AuthContext);

// Provider
const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [authLoading, setAuthLoading] = useState(false);

    // Função que checa autenticação
    const checkSession = async () => {
        try {
            setAuthLoading(true);
            const res = await fetch(`${apiUrl}auth`, apiOptions("GET"));
            setIsAuthenticated(res.ok);
        } catch (err) {
            console.log('Erro ao checar autenticação');
            console.error(err);
            setIsAuthenticated(false);
        } finally {
            setAuthLoading(false);
        }
    };

    // Checa sessão automaticamente ao carregar o app
    useEffect(() => {
        checkSession();
    }, []);

    // Função de logout
    const logout = async () => {
        try {
            setAuthLoading(true);
            const res = await fetch(`${apiUrl}user/logout`, apiOptions("DELETE"));

            if(res.ok){
                setIsAuthenticated(false);
                return true;
            }
            return false;
        } catch (error) {
            console.log('Erro ao realizar logout');
            console.error(error);
            return false;    
        } finally {
            setAuthLoading(false);
        }
        
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, logout,checkSession, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, useAuth };