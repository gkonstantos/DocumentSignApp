import axios from "axios";
import { useState } from "react";

type GetFilesResult = {
    success: boolean;
    error: string | null;
}


export const useGetFiles = () => {
    const [result, setResult] = useState<GetFilesResult>({
        success: false,
        error: null,
    });

    const [data, setData] = useState<Array<any>>([]);

    const files = async (username: string) => {
        try {
          const response = await axios.post('http://localhost:5173/files', {
            username,
          });
    
          setResult({ success: true, error: null });
          setData(response.data);
        } catch (error:any) {
          if (error.response) {
            setResult({ success: false, error: error.response.data });
          } else {
            setResult({ success: false, error: 'Something went wrong' });
          }
        }
      };
      return {result, files, data};

   
}

export default useGetFiles;