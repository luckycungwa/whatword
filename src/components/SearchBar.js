// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios'; // Assuming you're using it for suggestions
// import { FaSearch } from 'react-icons/fa';
// import { Input } from '@nextui-org/react';

// function SearchBar(props) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const timeoutRef = useRef(null); // Ref to store timeout ID

//   const fetchSuggestions = async (searchTerm) => {
//     setIsLoading(true); // Show loading indicator while fetching
//     try {
//       const response = await axios.get(
//         `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
//       );
  
//       // Check for empty response or non-JSON format
//       if (!response.data || typeof response.data !== 'object') {
//         setSuggestions(['No suggestions found.']); // Display a message
//         return; // Exit the function if no valid data
//       }
  
//       // Handle different response formats based on API documentation:
//       let suggestionsList = [];
//       if (response.data.length > 0 && response.data[0].hasOwnProperty('title')) {
//         // API might return an exact match first
//         suggestionsList.push(response.data[0].title);
//       } else {
//         // If no exact match, suggest similar words (if available)
//         suggestionsList = response.data.slice(0, 5).map((word) => word.word); // Get top 5 suggestions
//       }
  
//       // Check for empty suggestions and display appropriate message
//       if (suggestionsList.length === 0) {
//         setSuggestions(['No suggestions found.']); // Display a message
//       } else {
//         setSuggestions(suggestionsList);
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//       setSuggestions(['Error fetching suggestions. Please try again.']);
//     } finally {
//       setIsLoading(false); // Hide loading indicator after fetching
//     }
//   };
  

//   // Handle user input and debounced suggestions
//   const handleInputChange = (event) => {
//     setSearchTerm(event.target.value);

//     // Cancel any pending timeout
//     if (timeoutRef.current !== null) {
//       window.cancelAnimationFrame(timeoutRef.current);
//     }

//     // Schedule suggestion fetching after a short delay
//     timeoutRef.current = window.requestAnimationFrame(() => {
//       if (event.target.value.length >= 2) {
//         fetchSuggestions(event.target.value);
//       } else {
//         setSuggestions([]); // Clear suggestions on less than 2 characters
//       }
//     });
//   };

//   // Handle suggestion click (optional, based on your UI)
//   const handleSuggestionClick = (suggestion) => {
//     setSearchTerm(suggestion);
//     setSuggestions([]); // Hide suggestions on selection
//     // You can perform additional actions based on the selected suggestion,
//     // like submitting a search or navigating to a details page.
//   };

//   // Optional: Pre-fetch some popular word suggestions on initial load
//   useEffect(() => {
//     fetchSuggestions('');
//   }, []);

//   return (
//     <div className="search-bar">
//       <Input
//         type="text"
//         placeholder="Find a word..."
//         value={searchTerm}
//         onChange={handleInputChange}
//         bordered
//         clearable
//         autoComplete="off" // Turn off browser autocomplete
//         list="suggested-words"
//         className="text-black"
//         startContent={<FaSearch className="fas fa-search mr-1" size={16} />}
//       />
//       {isLoading && <div className="loading">Loading...</div>}
//       {suggestions.length > 0 && (
//         <datalist id="suggested-words">
//           {suggestions.map((word, index) => (
//             <option key={index} value={word} />
//           ))}
//         </datalist>
//       )}
//     </div>
//   );
// }

// export default SearchBar;
