import axios from "axios";
import { useState } from "react";



type RegisterResult = {
    success: boolean;
    error: string | null;
}

export const useRegister = () => {
    const [result, setResult] = useState<RegisterResult>({
      success: false,
      error: null,
    });
  
    const register = async (username: string, password: string) => {
      try {
         await axios.post('http://localhost:5173/register', {
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
  
    return {result, register};
  };
  
export default useRegister;