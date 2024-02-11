import React, {useState, useContext} from 'react';

interface AuthContextValue {
	authUser: any;
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
	const [authUser, setAuthUser] = useState(null);
	const [isLogged, setIsLogged] = useState(false);

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