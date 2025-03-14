import React from "react";
import UserProfile from "./pages/MainPage";
import ProjectList from "./pages/Profile";
import BottomNav from "./pages/ProjectManagement";
import Header from "./pages/TeamApplicants";

const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen w-full flex flex-col items-center p-4">
      <Header />
      <UserProfile />
      <div className="w-full mt-4 space-y-4">
        <ProjectList />
      </div>
      <BottomNav />
    </div>
  );
};

export default App;
