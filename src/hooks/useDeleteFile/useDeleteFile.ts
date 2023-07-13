import axios from "axios";
import { useState } from "react";


type DeleteFilesResult = {
    success: boolean;
    error: string | null;
}

export const useDeleteFile = () => {
    const [result, setResult] = useState<DeleteFilesResult>({
        success: false,
        error: null,
    });
    const fileDelete = async (fileid: string, filename: string) => {
        try {
          const response = await axios.post('http://localhost:5173/delete', {
            fileid,
            filename
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
      return {result, fileDelete};
}

export default useDeleteFile;