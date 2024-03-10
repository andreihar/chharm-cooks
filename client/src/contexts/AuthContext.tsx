import React, {useState, useContext} from 'react';
import Cookies from 'js-cookie';
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
        const savedUser = Cookies.get('authUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLogged, setIsLogged] = useState(!!authUser);

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