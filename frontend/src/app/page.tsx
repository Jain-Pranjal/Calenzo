import React from "react";
import CalenzoLanding from "@/components/LandingPage";
import CalenzoNavbar from "@/components/Navbar";
import CalenzoFooter from "@/components/Footer";
const page = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#030303]">
        <CalenzoNavbar />
        <main className="flex-grow">
          <CalenzoLanding />
        </main>
        <CalenzoFooter />
      </div>
    </>
  );
};

export default page;
