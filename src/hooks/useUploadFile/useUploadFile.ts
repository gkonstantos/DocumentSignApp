import axios from "axios";
import { useState } from "react";


type UploadResult = {
    success: boolean |null;
    error: string | null;
}

export const useUploadFile = () => {
    const [result, setResult] = useState<UploadResult>({
        success: null,
        error: null,
    });
    const file = async (name: string, type:string,size: number, username:string, publicUrl: string) => {
        try {
          await axios.post('http://localhost:5173/uploadFiles', {
            name,
            type, 
            size,
            username,
            publicUrl,
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
      return {result, file};
}

export default useUploadFile;