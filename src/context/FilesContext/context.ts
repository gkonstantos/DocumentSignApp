import { createContext } from "react";

export type FilesContextValues = {
    files: Array<any>;
  
}

export const FilesContext = createContext<FilesContextValues>({} as FilesContextValues);