import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage, LoginPage } from "../../pages";
import { MyFilesPage } from "../../pages/MyFilesPage";
import { UploadPage } from "../../pages/UploadPage";
import { MyProfilePage } from "../../pages/MyProfilePage";
import { HomeLayout } from "../../pages/HomeLayout";



export const AppRouter:React.FC = () => {

    return(
        <Routes>
            <Route element={<HomeLayout/>}>
                <Route path="/"   element={<HomePage />} />
                <Route path="files"   element={<MyFilesPage />} />
                <Route path="upload"   element={<UploadPage />} />
                <Route path="profile"   element={<MyProfilePage />} />
            </Route>
        </Routes>
    )
}


export default AppRouter;