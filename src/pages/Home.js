import React, { useState } from "react";
import { Image, Input } from "@nextui-org/react";
import SearchResults from "../components/SearchResults";
import Footer from "../components/Footer";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const heroImage =
    "https://unsplash.com/photos/people-walking-inside-library-Y7d265_7i08";

  return (
    <>
      <div className="w-full h-full flex-col gap-12 transition-all w-fill mb-24 my-container">
        {/* <Image
          objectFit="cover"
          className="w-full h-full"
          alt="NextUI hero Image with delay"
          src={heroImage}
          fallbackSrc="https://via.placeholder.com/1920x1080"
        /> */}
        <div className="flex-col mt-24  ">
          <h1 className="text-5xl font-bold capitalize">Whatword?</h1>
          <p className="text-xl tracking-widest lowercase">
            {" "}
            Your friendly dictionary
          </p>
        </div>
        <div className="sticky sm:mx-14 max-sm:mx-8 md:mx-16  xs:mx-16 2xl:mx-24 xl:mx-24 transition-all">
        {/*  */}
          <SearchResults searchTerm={searchTerm} />
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Home;
