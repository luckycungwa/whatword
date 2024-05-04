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
      <Chip
        size="sm"
        key={index}
        onClick={() => onClick(word)}
        className="text-xs smb-8 clickable px-2"
      >
        {word}
      </Chip>
    ));
  };

  return (
    <div
      className="flex-col w-full h-full transition-all main-hero
    "
    >
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
                                  phonetic.text && <p>|</p>}
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
                            <p className=" text-xs text-lighter">
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
        {/* render daily suggestions or results for searched item */}
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
