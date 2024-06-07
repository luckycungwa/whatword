import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Input,
  Chip,
  Button,
  Tabs,
  Tab,
  Card,
  CardBody,
  Divider,
  Spinner,
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import DailyWordList from "./DailyWordsList";
import wordList from '../data/wordList.json';
import levenshtein from 'js-levenshtein';

// Function to get similar words using Levenshtein distance and prefix match
const getSimilarWords = (input, wordList) => {
  // const maxDistance = 2; // Maximum Levenshtein distance to consider
  const lowerInput = input.toLowerCase();
  const prefixLength = Math.max(2, Math.floor(lowerInput.length / 2)); // Ensure prefix is at least 2 characters

  const words = Object.values(wordList).flat(); // Flatten the wordList to get all words
  const filteredWords = words.filter(word => word.toLowerCase().startsWith(lowerInput.substring(0, prefixLength)));
  
  // Sort by Levenshtein distance and return the top suggestions
  const sortedWords = filteredWords.sort((a, b) => levenshtein(lowerInput, a.toLowerCase()) - levenshtein(lowerInput, b.toLowerCase()));
  return sortedWords.slice(0, 8); // Limit to top 8 suggestions
};

const SearchResults = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedWords, setSuggestedWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // const [hasExamples, setHasExamples] = useState(false);

  const inputRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true before making API request
    setError(""); // Clear previous errors

    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
      );
      setSearchResults(response.data);
      setSuggestedWords([]); // Clear suggested words if the search is successful
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If word not found, suggest similar words from the local word list
        const similarWords = getSimilarWords(searchTerm, wordList);
        if (similarWords.length > 0) {
          setSuggestedWords(similarWords);
        } else {
          setError("No similar words found.");
        }
      } else {
        setError("Error fetching search results. Please try again.");
        console.error("Error fetching search results:", error);
      }
    } finally {
      setIsLoading(false); // Disable loading state after completing API request
    }
  };

  const handleSuggestedWordClick = (word) => {
    // Fill the search bar with the selected word & actiavte focus the search bar
    inputRef.current.focus();
    setSearchTerm(word);
    handleSearch();
  };

  const handleChipClick = (word) => {
    inputRef.current.focus();
    setSearchTerm(word);
    // Scroll the user to the search bar
    document.getElementById("top-section").scrollIntoView({ behavior: "smooth" });
  };

  const renderChips = (words, onClick) => {
    return words.map((word, index) => (
      <Chip
        size="sm"
        key={index}
        onClick={() => handleChipClick(word)}
        // onClick={() => {inputRef.current.focus()}}
        className="text-xs smb-8 clickable px-2 cursor-pointer"
      >
        {word}
      </Chip>
    ));
  };

  return (
    <div className="flex flex-col w-full h-auto transition-all justify-between">
      <form onSubmit={handleSearch} className="flex xl:w-1/2 xl:mx-auto mt-4 justify-center sm:px-24 h-auto" >
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          placeholder="Find a word..."
          bordered
          clearable
          onChange={(e) => setSearchTerm(e.target.value)}
          list="suggested-words"
          autoComplete="on"
          className="tracking-wide md:w-1/1 xl:1/2"
          startContent={<FaSearch className="fas fa-search mr-1" size={16} />}
        />
        <datalist id="suggested-words">
          {suggestedWords.map((word, index) => (
            <option key={index} value={word} />
          ))}
        </datalist>
        <Button className="ml-2 w-1/4" variant="bordered" onClick={handleSearch}>
          Search
        </Button>
        {isLoading && <Spinner color="default" className="w-full h-full justify-center align-center transition-all absolute z-100" />}
      </form>
      
      {/* Error Message */}
      {error && (
        <p className="mt-4" color="error">
          {error}
        </p>
      )}

      {/* Suggested Words when the word was misspelled */}
      {suggestedWords.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <p className="text-sm font-bold">Did you mean:</p>
          {renderChips(suggestedWords, handleSuggestedWordClick)}
        </div>
      )}

      {/* Search Results Container */}
      <section className="my-6">
        <Tabs
          variant="highlight"
          // placement="top"
          className="tracking-wider font-bold"
        >
          {searchResults.map((result, index) => (
            <Tab key={index} title={result.word}>
              <Card className="px-4 py-4">
                <CardBody>
                  <div className="flex flex-col gap-2">
                    {result.phonetics.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <div className="flex row gap-2">
                          <p className="text-lg tracking-wider capitalize font-bold">
                            {result.word}
                          </p>
                          {result.phonetics.map((phonetic, idx) => (
                            <div key={idx}>
                              {idx > 0 &&
                                result.phonetics[idx - 1].text !==
                                  phonetic.text && null}
                              <p className="text-lg tracking-wider">
                                {phonetic.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {result.meanings.map((meaning, idx) => (
                    <div key={idx}>
                      <h4 className="text-md mb-1 mt-6 italic">
                        ({meaning.partOfSpeech})
                      </h4>
                      <Divider className="mb-2" />
                      {/* Definition Container */}
                      {meaning.definitions.map((definition, i) => (
                        <div key={i} className="flex flex-col gap-2">
                          {/* Definition | List*/}
                          <li className="text-sm list-disc pl-1">
                            {definition.definition}
                          </li>
                          {/* Synonyms Chips */}
                          <div>
                            {definition.synonyms &&
                              definition.synonyms.length > 0 && (
                                <div
                                  className="flex flex-wrap gap-2"
                                  key={index}
                                >
                                  {renderChips(
                                    definition.synonyms,
                                    handleSuggestedWordClick
                                  )}
                                </div>
                              )}
                          </div>
                          {/* Antonyms Chips */}
                          <div>
                            {definition.antonyms &&
                              definition.antonyms.length > 0 && (
                                <div className="" key={index}>
                                  {renderChips(
                                    definition.antonyms,
                                    handleSuggestedWordClick
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Examples Section */}
                  <div className="mt-4">
                    <Divider className="mb-4" />
                    {result.meanings.map((meaning, idx) => {
  // Check if there are any examples, if not we don't show the titpe 'example'
  const hasExamples = meaning.definitions.some(definition => definition.example);

  return (
    <div key={idx}>
      {hasExamples && <h3 className="text-md mb-1 italic">Examples</h3>}
      {meaning.definitions.map((definition, i) => (
        <div
          key={i}
          className="flex flex-col tracking-normal"
        >
          {definition.example && ( // Conditionally render the example
            <p className="text-xs text-lighter mb-0.5">
              {definition.example}
            </p>
          )}
        </div>
      ))}
    </div>
  );
})}
                  </div>
                </CardBody>
              </Card>
            </Tab>
          ))}
        </Tabs>
      </section>
      <div>
        {/* Render daily suggestions or results for searched item */}
        <div className="flex flex-col gap-4  sm:px-24 items-center ">
          <p className="text-small tracking-wide font-bold">
            Try one of these words:
          </p>
          <DailyWordList setSearchTerm={setSearchTerm} />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
