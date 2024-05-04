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
      <div
        className="w-full h-auto  bootom-0 flex-col gap-12 mb-0 my-container"
        id="search-bar"
      >
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
        <div className="sticky sm:mx-14 max-sm:mx-8 md:mx-16  xs:mx-16 2xl:mx-24 xl:mx-24 transition-all h-auto ">
          {/*  */}
          <SearchResults searchTerm={searchTerm} className="flex-col flex grow justify-center h-1/2 flex-grow" />
        </div>
        <div className="relative w-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
