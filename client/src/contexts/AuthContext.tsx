import React, {useState, useContext, useEffect} from 'react';
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
		const storedAuthUser = localStorage.getItem('authUser');
		return storedAuthUser ? JSON.parse(storedAuthUser) : null;
	});
	const [isLogged, setIsLogged] = useState(() => {
		const storedIsLogged = localStorage.getItem('isLogged');
		return storedIsLogged ? JSON.parse(storedIsLogged) : false;
	});

	useEffect(() => {
		localStorage.setItem('authUser', JSON.stringify(authUser));
		localStorage.setItem('isLogged', JSON.stringify(isLogged));
	}, [authUser, isLogged]);

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