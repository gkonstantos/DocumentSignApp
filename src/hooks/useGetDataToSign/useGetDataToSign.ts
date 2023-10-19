import axios from "axios";
import { useState } from "react";


type GetDataResult = {
    success: boolean;
    error: string | null;
}

export const useGetDataToSign = () => {
    const [result, setResult] = useState<GetDataResult>({
        success: false,
        error: null,
    });
    const [data, setData] = useState<any>();

    const getData = async (username:string, filename: string) => {
        try {
          const response = await axios.post('http://localhost:5173/getData', {
            username, filename
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
      return {result, getData, data}

}

export default useGetDataToSign;