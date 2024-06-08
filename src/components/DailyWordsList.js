import React, { useState, useEffect } from "react";
import { Chip,} from "@nextui-org/react";
import { generate } from "random-words";
import ScrollToTop from "react-scroll-to-top";
import { FaArrowUp } from "react-icons/fa";

const DailyWordList = ({ setSearchTerm }) => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    // Generate random words only once when the component mounts
    const randomWords = generate({ exactly: 4 });
    setWords(randomWords);
  }, []); // Empty dependency array ensures this effect runs only once

  const handleChipClick = (word) => {
    // Fill the search bar with the selected word
    setSearchTerm(word);
    // Scroll the user to the search bar
    document.getElementById("top-section").scrollIntoView({ behavior: "smooth" });
  };

  const renderChips = () => {
    return words.map((word, index) => (
      <Chip
        key={index}
        color="default"
        variant="bordered"
        onClick={() => handleChipClick(word)}
        className="clickable  px-2 capitalize"
        shadow="0px 4px 4px rgba(0, 0, 0, 0.1)" // Customize shadow color here
        
      >
        {word}
      </Chip>
    ));
  };

  return (
    <div className="flex">
      {/* Render the chips */}
      <div className="flex flex-wrap gap-2">
        {renderChips()}
      </div>
      
      {/* Scroll to top button */}
      <div className="fixed bottom-4 right-4 justify-center z-100 ">
        <ScrollToTop className="" component={<FaArrowUp className="to-top-btn flex text-lg justify-content -center center align-self-center" />} smooth color="#000000" />
      </div>
      
    </div>
  );
};

export default DailyWordList;
