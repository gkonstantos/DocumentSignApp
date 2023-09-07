import axios from "axios";
import { useState } from "react";


type SignFilesResult = {
    success: boolean;
    error: string | null;
}

export const useSignData = () => {
    const [result, setResult] = useState<SignFilesResult>({
        success: false,
        error: null,
    });
    const [signedData, setSignedData] = useState<any>();

    const signData = async (payload: any) => {
        try {
          const response = await axios.post('http://localhost:5173/signData', {
            payload,
          });
    
          setResult({ success: true, error: null });
          setSignedData(response.data);

        } catch (error:any) {
          if (error.response) {
            setResult({ success: false, error: error.response.data });
          } else {
            setResult({ success: false, error: 'Something went wrong' });
          }
        }
      };
      return {result, signData, signedData}

}

export default useSignData;