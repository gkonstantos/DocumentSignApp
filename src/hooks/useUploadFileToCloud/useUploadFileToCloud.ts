import axios from "axios";
import { response } from "express";
import { useState } from "react";

type UploadResult = {
    success: boolean |null;
    error: string | null;
}

export const useUploadFileToCloud = () => {
    const [res, setRes] = useState<UploadResult>({
        success: null,
        error: null,
    });
    const [publicUrl, setPublicUrl] = useState<string>('');

    const cloudFile = async (formData: FormData) => {
        try {
            const response = await axios.post('http://localhost:5173/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				  },
			});
    
            setRes({ success: true, error: null });
            setPublicUrl(response.data);

        } catch (error:any) {
          if (error.response) {
            setRes({ success: false, error: error.response.data });
          } else {
            setRes({ success: false, error: 'Something went wrong' });
          }
        }
      };
      return {res, cloudFile,publicUrl};
}

export default useUploadFileToCloud;