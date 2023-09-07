import axios from "axios";
import { useState } from "react";


type UploadResult = {
    success: boolean |null;
    error: string | null;
}

export const useUploadFile = () => {
    const [uploadResult, setUploadResult] = useState<UploadResult>({
        success: null,
        error: null,
    });
    const file = async (name: string, type:string,size: number, username:string, publicUrl: string, signed:boolean) => {
        try {
          await axios.post('http://localhost:5173/uploadFiles', {
            name,
            type, 
            size,
            username,
            publicUrl,
            signed
          });
    
          setUploadResult({ success: true, error: null });
        } catch (error:any) {
          if (error.response) {
            setUploadResult({ success: false, error: error.response.data });
          } else {
            setUploadResult({ success: false, error: 'Something went wrong' });
          }
        }
      };
      return {uploadResult, file};
}

export default useUploadFile;