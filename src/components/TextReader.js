import { Button } from "@nextui-org/react";
import React from "react";
import { HiOutlineSpeakerWave } from "react-icons/hi2";

const TextReader = ({ word }) => {
  const speak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };

  return (
    <div>
      <Button
        isIconOnly
        className=" w-auto p-0 m-0 justify-end"
        aria-label="Twitter"
        color="none"
        onClick={speak}
      >
        <HiOutlineSpeakerWave size={20} className="flex w-autopx-0 m-0 w-10" />
      </Button>
    </div>
  );
};

export default TextReader;
