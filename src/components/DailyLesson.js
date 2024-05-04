// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Chip, Card, CardBody, Divider } from "@nextui-org/react";
// import { ToastBar, Toaster, toast } from "react-hot-toast";
// import { FaCheck } from "react-icons/fa";

// const DailyLesson = () => {
//   const [word, setWord] = useState("");
//   const [scrambledWords, setScrambledWords] = useState([]);
//   const [selectedChip, setSelectedChip] = useState("");

//   useEffect(() => {
//     const fetchRandomWord = async () => {
//       try {
//         const response = await axios.get(
//           "https://random-word-api.herokuapp.com/word"
//         );
//         setWord(response.data);
//         generateScrambledWords(response.data);
//       } catch (error) {
//         console.error("Error fetching random word:", error);
//       }
//     };

//     fetchRandomWord();
//   }, []);

//   const generateScrambledWords = (originalWord) => {
//     if (typeof originalWord !== "string") {
//       console.error("Error: Invalid word received from API");
//       return; // Handle the error gracefully, e.g., set an empty state
//     }

//     const scrambledWords = [];
//     scrambledWords.push(originalWord); // Add the correct word

//     // Generate 3 additional scrambled words
//     for (let i = 0; i < 3; i++) {
//       let scrambled = originalWord
//         .split("")
//         .sort(() => Math.random() - 0.5)
//         .join("");
//       while (scrambled === originalWord || scrambledWords.includes(scrambled)) {
//         scrambled = originalWord
//           .split("")
//           .sort(() => Math.random() - 0.5)
//           .join("");
//       }
//       scrambledWords.push(scrambled);
//     }

//     setScrambledWords(scrambledWords.sort(() => Math.random() - 0.5)); // Shuffle the options
//   };

//   const handleChipClick = (chip) => {
//     setSelectedChip(chip);
//     if (scrambledWords.length > 0) {
//       // Check if data is available
//       if (chip === word) {
//         console.log("Correct! Word submitted:", word);
//         toast.success("Correct!");
//       } else {
//         console.log("Try again!");
//         toast.error("Try again!");
//       }
//     }
//   };

//   return (
//     <>
//       <Toaster />
//       <div className="container">
//         {" "}
//         {/* Add a container for responsiveness */}
//         <Card className="max-w-[600px] min-h-[400px] p-4">
//           <CardBody>
//             <p className="text-xl tracking-widest align-middle text-center uppercase">
//               Choose the most correct answer!
//             </p>
//             <Divider className=" mb-4" />
//             <Chip
//               // iternary function to check if the selected word is correct & enable startContent
//               startContent={
//                 selectedChip === word ? (
//                   <FaCheck size={16} className="m-1" color="#00e900" />
//                 ) : null
//               }
//               className="mt-2 text-center capitalize justify-center align-middle align-center"
//               onClick={() => handleChipClick(word)}
//             >
//               {word}
//             </Chip>

//             <div className="grid grid-cols-2 gap-4">
//               {/* display game option MCQ of 3 scrambled words and the correct word here!*/}
//               {scrambledWords.map((chip, index) => (
//           <Chip
//             key={index}
//             startContent={
//               selectedChip === chip ? (
//                 <FaCheck size={16} className="m-1" color="#00e900" />
//               ) : null
//             }
//             className="mt-2 text-center capitalize justify-center align-middle align-center"
//             onClick={() => handleChipClick(chip)}
//           >
//             {chip}
//           </Chip>
//         ))}
//             </div>
//           </CardBody>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default DailyLesson;
