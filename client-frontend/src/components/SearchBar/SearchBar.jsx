import React, { useState } from "react";
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

const SearchBar = (props) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define your data source for suggestions here
  const getSuggestions = (value) => {
    // Elastic Search Recommendations
    // Past search queries
    const suggestions = ["Option 1", "Option 2", "Option 3"];
    return suggestions.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase()),
    );
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
    setValue(newValue);
  };

  const inputProps = {
    placeholder: "Search Gleek.com",
    value,
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
