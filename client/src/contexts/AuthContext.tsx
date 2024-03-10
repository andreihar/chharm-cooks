import React, {useState, useContext, useEffect} from 'react';
import { jwtDecode } from "jwt-decode";
import { User } from '../models/User';

interface AuthContextValue {
	authUser: User;
	setAuthUser: React.Dispatch<React.SetStateAction<any>>;
	isLogged: boolean;
	setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
}
  
const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
	  throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

export function AuthProvider(props:any) {
	const [authUser, setAuthUser] = useState(() => {
        const savedUser = localStorage.getItem('authUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLogged, setIsLogged] = useState(!!authUser);

	useEffect(() => {
		if (authUser) {
			localStorage.setItem('authUser', JSON.stringify(authUser));
		} else {
			localStorage.removeItem('authUser');
		}
	}, [authUser]);

    useEffect(() => {
		const token = localStorage.getItem('token');
		if (token && typeof token === 'string') {
			const decodedToken = jwtDecode(token);
			if (decodedToken.exp) {
				const expirationDate = decodedToken.exp * 1000;
				const timeoutId = setTimeout(() => {
					localStorage.removeItem('authUser');
					localStorage.removeItem('token');
					setIsLogged(false);
				}, expirationDate - Date.now());
				return () => clearTimeout(timeoutId);
			}
		} else {
			localStorage.removeItem('authUser');
			localStorage.removeItem('token');
		}
	}, []);

	const value: any = {
		authUser,
		setAuthUser,
		isLogged,
		setIsLogged
	}

	return (
		<AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
	)
}