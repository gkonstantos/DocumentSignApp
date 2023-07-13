import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { FilesContext } from "../../context/FilesContext/context";

export const useGetFilesProv = () => useContext(FilesContext);

export default useGetFilesProv;