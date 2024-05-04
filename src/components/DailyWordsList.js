import React from "react";
import { Chip } from "@nextui-org/react";
import { generate } from "random-words";

const DailyWordList = () => {
  // Generate an array of 4 random words using the generate function
  const words = generate({ exactly: 4 });

  return (
    <div className="flex flex-wrap gap-2 justify-start align-center wrap">
      {words.map((word, index) => (
        <Chip key={index} color="warning" variant="shadow" className="mt-0">
          {word}
        </Chip>
      ))}
    </div>
  );
};

export default DailyWordList;
