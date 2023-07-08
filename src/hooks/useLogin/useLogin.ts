import { useState } from "react";
import axios from "axios";


type LoginResult = {
    success: boolean;
    error: string | null;
}


export const useLogin = () => {
    const [result, setResult] = useState<LoginResult>({
        success: false,
        error: null,
    });

    const login = async (username: string, password: string) => {
        try {
          await axios.post('http://localhost:5173/login', {
            username,
            password,
          });
    
          setResult({ success: true, error: null });
        } catch (error:any) {
          if (error.response) {
            setResult({ success: false, error: error.response.data });
          } else {
            setResult({ success: false, error: 'Something went wrong' });
          }
        }
      };
      return {result, login};
}

export default useLogin;