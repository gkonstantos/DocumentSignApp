import { useContext } from "react";
import { FilesContext } from "../../context/FilesContext/context";

export const useGetFilesProv = () => useContext(FilesContext);

export default useGetFilesProv;