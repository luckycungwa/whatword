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
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import DailyWordList from "./DailyWordsList";

const SearchResults = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedWords, setSuggestedWords] = useState([]);

  const handleSearch = async () => {
    // create auto complet function from available word in api

    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
      );
      setSearchResults(response.data);
      setSuggestedWords([]); // Clear suggested words if the search is successful
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If word not found, suggest similar words
        setSuggestedWords(["word1", "word2", "word3"]); // Replace with actual suggested words
      } else {
        console.error("Error fetching search results:", error);
      }
    }
  };

  const handleSuggestedWordClick = (word) => {
    setSearchTerm(word);
    handleSearch();
  };

  const renderChips = (words, onClick) => {
    return words.map((word, index) => (
      <Chip key={index} onClick={() => onClick(word)}>
        {word}
      </Chip>
    ));
  };

  return (
    <div
      className="flex-col w-full h-full transition-all main-hero
    "
    >
      <div className="flex max-w-full h-auto">
        <Input
          type="text"
          value={searchTerm}
          placeholder="Find a word..."
          bordered
          clearable
          onChange={(e) => setSearchTerm(e.target.value)}
          list="suggested-words"
          autoComplete="on"
          className=" tracking-wide"
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
      </div>

      

      <div className="mt-12">
        <Tabs
          variant="highlight"
          placement="top"
          className="tracking-wider font-bold"
        >
          {searchResults.map((result, index) => (
            <Tab key={index} title={result.word}>
              <Card className="px-4 py-4">
                <CardBody>
                  {result.phonetics.map((phonetic, idx) => (
                    <div key={idx}>
                      <div className="flex row gap-2">
                        <p className="text-lg tracking-wider capitalize font-bold">
                          {" "}
                          {result.word}{" "}
                        </p>
                        <p>|</p>
                        <p className="text-lg tracking-wider">
                          {phonetic.text}
                        </p>
                      </div>
                    </div>
                  ))}

                  {result.meanings.map((meaning, idx) => (
                    <div key={idx}>
                      <h4 className="text-md mb-1 mt-6 italic">
                        ({meaning.partOfSpeech})
                      </h4>
                      <Divider className="mb-2" />
                      {meaning.definitions.map((definition, i) => (
                        <div key={i} className="flex flex-col gap-2">
                          <p className="text-sm">{definition.definition}</p>
                          {definition.synonyms && (
                            <div className="flex flex-wrap gap-2">
                              <Chip
                                variant="light"
                                size="sm"
                                className="cursor-pointer text-sm"
                                key={index}
                                onClick={() =>
                                  handleSearch(definition.antonyms)
                                }
                              >
                                {renderChips(
                                  definition.synonyms,
                                  handleSuggestedWordClick
                                )}
                              </Chip>
                            </div>
                          )}
                          {definition.antonyms && (
                            <div className="flex flex-wrap gap-2">
                              <Chip
                                variant="light"
                                size="sm"
                                className="cursor-pointer"
                                key={index}
                                onClick={() =>
                                  handleSearch(definition.antonyms)
                                }
                              >
                                {renderChips(
                                  definition.antonyms,
                                  handleSuggestedWordClick
                                )}
                              </Chip>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Examples Section */}
                  <div className="mt-4">
                    <h4 className="text-md mb-1 italic">Examples</h4>
                    {result.meanings.map((meaning, idx) => (
                      <div key={idx}>
                        {meaning.definitions.map((definition, i) => (
                          <div key={i} className="flex flex-col gap-2">
                            <p className="text-sm">{definition.example}</p>
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

        {/* Display suggested words if word was misspelled */}
        {suggestedWords.length > 0 && (
          <div>
            <p>Word not found. Did you mean:</p>
            <div>
              {suggestedWords.map((word, index) => (
                <Chip
                  className="cursor-pointer"
                  key={index}
                  onClick={() => handleSuggestedWordClick(word)}
                >
                  {word}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        {/* render daily suggestions or results for searched item */}
      <div className="flex flex-col gap-4 mt-16">
        <p className="text-small tracking-wide font-bold">Try one of these words:</p>
        <DailyWordList />
      </div>
      </div>
    </div>
  );
};

export default SearchResults;
