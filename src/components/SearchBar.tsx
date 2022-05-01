import React, { useContext } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { styleContext, Styles } from '../contexts/StyleProvider';
import searchIcon from '../svg/searchIcon';

const SearchRoot = styled.div<
  typeof Styles & { minHeight: number; top: number }
>`
  max-width: min(760px, 80vw);
  width: 100%;
  min-height: ${(props) => props.minHeight ?? 44}px;
  background: ${(props) => props.colors.tint};

  position: absolute;
  top: ${props => props.top}px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 24px 8px 24px;

  display: flex;
  align-items: center;
  gap: 15px;

  border-radius: ${(props) => props.borderRadiuses.default};
  z-index: 10;
`;

const SearchField = styled.input<typeof Styles>`
  outline: none;
  border: none;
  background: none;
  width: 100%;

  font-weight: 500;
  font-size: 2rem;
  line-height: 2.37rem;
  color: ${props => props.colors.text};

  &::placeholder {
    color: ${props => props.colors.transparentText};
  }

  &::-webkit-search-cancel-button {
    --webkit-appearance: none;
    opacity: 0;
    pointer-events: none;
  }
`

const SearchIcon = styled(searchIcon)<typeof Styles>`
  width: 2rem;
  height: 2rem;
  & * {
    fill: ${props => props.colors.transparentText}
  }
`


type SearchBarProps = {
  searchRequest: string,
  setSearchRequest: React.Dispatch<React.SetStateAction<string>>,
}

const SearchBar = ({
  searchRequest,
  setSearchRequest,
}: SearchBarProps) => {
  const style = useContext(styleContext);
  const { searchHeight: height, searchTopOffset: topOffset } = style.dimmensions
  return (
    <SearchRoot top={topOffset} minHeight={height} {...style}>
      <SearchIcon {...style} />
      <SearchField
        {...style}
        type="search"
        placeholder="Search"
        value={searchRequest}
        onChange={(event) => setSearchRequest(event.target.value)}
      />
    </SearchRoot>
  );
};

export default SearchBar;