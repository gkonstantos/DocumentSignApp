import { createContext } from 'react';

export type UserContextValues = {
    username: string;
}

export const UserContext = createContext<UserContextValues>({} as UserContextValues);