import React, { useState, useEffect } from "react";
import {
  Box,
  MenuList,
  Typography,
  TextField,
  MenuItem,
  Paper,
} from "@mui/material"; // Import Typography
import Autosuggest from "react-autosuggest";
import "./searchbar.css";
import useShopStore from "../../zustand/ShopStore";

const SearchBar = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    setSearchValue,
    searchValue,
    suggestions,
    setSuggestions,
    initialSuggestions,
    getInitialSuggestions,
  } = useShopStore();

  // Define your data source for suggestions here
  const getSuggestions = (value) => {
    getInitialSuggestions();
    // maximum of 5 suggestions at a time
    const filteredSuggestions = initialSuggestions
      .filter((option) => option.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);
    return filteredSuggestions;
  };
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
    setIsMenuOpen(true); // Open the menu when suggestions are available
  };
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
    setIsMenuOpen(false); // Close the menu when there are no suggestions
  };

  const onChange = (event, { newValue }) => {
    setSearchValue(newValue);
  };

  const inputProps = {
    placeholder: "Search Gleek.com",
    value: searchValue,
    onChange,
  };

  const renderItem = (suggestion) => {
    return (
      <Box className="suggestion-item">
        <Typography>{suggestion}</Typography>
      </Box>
    );
  };
  return (
    <div style={{ position: "relative" }}>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={renderItem}
        inputProps={inputProps}
        renderInputComponent={(inputProps) => (
          <TextField
            color="secondary"
            {...inputProps}
            size="small"
            variant="outlined"
            className="searchbar-field"
          />
        )}
      />
    </div>
  );
};
export default SearchBar;
