import axios from "axios";
import { useState } from "react";


type ValidateFilesResult = {
    success: boolean;
    error: string | null;
}

export const useValidateData = () => {
    const [result, setResult] = useState<ValidateFilesResult>({
        success: false,
        error: null,
    });
    const [validatedData, setValidatedData] = useState<any>();

    const validateData = async (payload: any) => {
        try {
          const response = await axios.post('http://localhost:5173/validateData', {
            payload,
          });
    
          setResult({ success: true, error: null });
          setValidatedData(response.data);

        } catch (error:any) {
          if (error.response) {
            setResult({ success: false, error: error.response.data });
          } else {
            setResult({ success: false, error: 'Something went wrong' });
          }
        }
      };
      return {result, validateData, validatedData}

}

export default useValidateData;