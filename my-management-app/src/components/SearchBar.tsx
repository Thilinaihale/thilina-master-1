// SearchBar.tsx
import React from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  width: 100%;
  max-width: 300px;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SearchBar: React.FC = () => {
  return (
    <SearchContainer>
      <SearchInput type="text" placeholder="Search..." />
    </SearchContainer>
  );
};

export default SearchBar;
