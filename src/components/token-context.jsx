import { useContext, createContext } from 'react';

export const TokenContext = createContext('');
export const useAuthToken = () => useContext(TokenContext);
