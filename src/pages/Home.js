import React, { useState } from "react";
import SearchResults from "../components/SearchResults";
import Footer from "../components/Footer";
import emailService from "../services/emailService";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <div id="top-section" className="flex flex-col min-h-screen my-container">
        <div className="flex flex-col items-center gap-4 mt-8 lg:mt-16  flex-grow">
          <h1 className="text-4xl font-bold capitalize">Whatword?</h1>
          <p className="text-sm tracking-widest lowercase">
            Your friendly dictionary
          </p>
        </div>
        <div className="w-full h-full px-4 xs:px-4 sm:px-16 md:mx-16 xs:mx-16 2xl:mx-auto xl:mx-auto flex-grow flex justify-between">
        <emailService/>
          <SearchResults
            searchTerm={searchTerm}
            className="flex-col flex grow justify-center h-1/2"
          />
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
