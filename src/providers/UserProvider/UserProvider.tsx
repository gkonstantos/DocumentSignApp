import React, { useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import PubSub from "pubsub-js";
import { EventTypes } from "../../common";


export const UserProvider: React.FC<React.PropsWithChildren> = ( {children,}) => {
    // const [userData, setUserData] = useState({
    //     username: '',
    //     password: '',
    //   });
    const [userData, setUserData] = useState(() => {
      const storedUserData = localStorage.getItem('userData');
      return storedUserData ? JSON.parse(storedUserData) : { username: '', password: '' };
    });

    
    useEffect(() => {
      localStorage.setItem('userData', JSON.stringify(userData));
    }, [userData]);

      PubSub.subscribe(EventTypes.LOGIN, function (msg, data) {
        const {username, password} = data;
        setUserData({ username, password });
        console.log(userData.username)
	    });
    
    

    return(
        <UserContext.Provider
        value={{
            username: userData.username,
            password: userData.password
        }}>
            {children}
        </UserContext.Provider>
    )
}