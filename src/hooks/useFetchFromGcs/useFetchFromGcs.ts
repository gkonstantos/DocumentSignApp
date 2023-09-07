import axios from "axios";
import { useState } from "react";


type FetchFilesResult = {
    success: boolean;
    error: string | null;
}

export const useFetchFromGcs = () => {
    const [result, setResult] = useState<FetchFilesResult>({
        success: false,
        error: null,
    });

    const [gcsFile, setGcsFile] = useState<any>();
    const fileFetch = async ( filename: string) => {
        try {
          const response = await axios.post('http://localhost:5173/fetchGcs', {
            filename
          });
    
          setResult({ success: true, error: null });
          // console.log(response)
          setGcsFile(response.data);
          // console.log(gcsFile);
        } catch (error:any) {
          if (error.response) {
            setResult({ success: false, error: error.response.data });
          } else {
            setResult({ success: false, error: 'Something went wrong' });
          }
        }
      };
      return {result, fileFetch, gcsFile};
}

export default useFetchFromGcs;