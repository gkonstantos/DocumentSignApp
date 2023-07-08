import { createContext } from 'react';

export type UserContextValues = {
    username: string;
    password:string;
}

export const UserContext = createContext<UserContextValues>({} as UserContextValues);