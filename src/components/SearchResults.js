import React, { useState } from "react";
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
  // Alert,
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import DailyWordList from "./DailyWordsList";   //get the random words for start suugestion
import wordList from '../data/wordList.json'; //stores all random words for misspelling
import levenshtein from 'js-levenshtein'; //damn i didnt know this efficient tool. damn :D

// Function to get similar words using Levenshtein distance
const getSimilarWords = (input, wordList) => {
  const maxDistance = 3; // Maximum Levenshtein | common letter of tghe searched word
  const lowerInput = input.toLowerCase();
  const words = Object.values(wordList).flat(); // Flatten the wordList to get all words
  return words.filter(word => levenshtein(lowerInput, word.toLowerCase()) <= maxDistance);
};

const SearchResults = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedWords, setSuggestedWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setIsLoading(true); // Set loading state to true before making API request
    setError(""); // Remove previous errors

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
          setSuggestedWords(similarWords.length > 5 ? similarWords.slice(0, 8) : similarWords);
          // setSuggestedWords(similarWords);
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
    setSearchTerm(word);
    handleSearch();
  };

  const handleChipClick = (word) => {
    setSearchTerm(word);
    // Scroll the user to the search bar
    document.getElementById("search-bar").scrollIntoView({ behavior: "smooth" });
  };

  const renderChips = (words, onClick) => {
    return words.map((word, index) => (
      <Chip
        size="sm"
        key={index}
        onClick={() => handleChipClick(word)}
        className="text-xs smb-8 clickable px-2 cursor-pointer"
      >
        {word}
      </Chip>
    ));
  };

  return (
    <div className="flex-col w-full h-full transition-all main-hero">
      <div className="flex max-w-full h-auto" id="search-bar">
        <Input
          type="text"
          value={searchTerm}
          placeholder="Find a word..."
          bordered
          clearable
          onChange={(e) => setSearchTerm(e.target.value)}
          list="suggested-words"
          autoComplete="on"
          className="tracking-wide"
          startContent={<FaSearch className="fas fa-search mr-1" size={16} />}
        />
        <datalist id="suggested-words">
          {suggestedWords.map((word, index) => (
            <option key={index} value={word} />
          ))}
        </datalist>
        <Button className="ml-2" variant="bordered" onClick={handleSearch}>
          Search
        </Button>
        {isLoading && <Spinner color="default" className="w-full h-full justify-center align-center transition-all absolute z-100" />}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-4" color="error">
          {error}
        </p>
      )}

      {/* Suggested Words when the word was mispelled */}
      {suggestedWords.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <p className="text-sm font-bold">Did you mean:</p>
          {renderChips(suggestedWords, handleSuggestedWordClick)}
        </div>
      )}

      {/* Search Results Container */}
      <section className="mt-12">
        <Tabs
          variant="highlight"
          placement="top"
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
                    <h4 className="text-md mb-1 italic">Examples</h4>
                    {result.meanings.map((meaning, idx) => (
                      <div key={idx}>
                        {meaning.definitions.map((definition, i) => (
                          <div
                            key={i}
                            className="flex flex-col tracking-normal"
                          >
                            <p className="text-xs text-lighter">
                              {definition.example}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Tab>
          ))}
        </Tabs>
      </section>
      <div>
        {/* Render daily suggestions or results for searched item */}
        <div className="flex flex-col gap-4 mt-16">
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
