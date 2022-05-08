import React, { useContext, useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Paths } from '../constants/paths';
import searchIcon from '../svg/searchIcon';

const SearchRoot = styled.div`
  max-width: min(760px, 80vw);
  width: 100%;
  min-height: ${(props) => props.theme.dimmensions.searchHeight ?? 44}px;
  background: ${(props) => props.theme.colors.tint};

  position: absolute;
  top: ${props => props.theme.dimmensions.searchTopOffset}px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 24px 8px 24px;

  display: flex;
  align-items: center;
  gap: 15px;

  border-radius: ${({ theme: { borderRadiuses }}) => borderRadiuses.default};
  z-index: 10;
`;

const SearchField = styled.input`
  outline: none;
  border: none;
  background: none;
  width: 100%;

  font-weight: 500;
  font-size: 2rem;
  line-height: 2.37rem;
  color: ${props => props.theme.colors.text};

  &::placeholder {
    color: ${props => props.theme.colors.transparentText};
  }

  &::-webkit-search-cancel-button {
    --webkit-appearance: none;
    opacity: 0;
    pointer-events: none;
  }
`

const SearchIcon = styled(searchIcon)`
  width: 2rem;
  height: 2rem;
  & * {
    fill: ${props => props.theme.colors.transparentText}
  }
`


type SearchBarProps = {
}

const SearchBar = ({}: SearchBarProps) => {
  const navigate = useNavigate()
  const [searchRequest, setSearchRequest] = useState('')
  const location = useLocation()
  const prevSearchRequestRef = useRef<null | string>(null)

  useEffect(() => {
    if (searchRequest.length) {
      navigate(`/${Paths.Search}/${searchRequest}`, {
        replace: location.pathname.includes(Paths.Search)
      })
      prevSearchRequestRef.current = searchRequest
      return
    }

    if (prevSearchRequestRef.current !== null) {
      navigate(-1)
    }
  }, [searchRequest])

  useEffect(() => {
    if (location.pathname.includes(Paths.Details)){
      setSearchRequest('')
    }
  }, [location])

  return (
    <SearchRoot>
      <SearchIcon  />
      <SearchField
        
        type="search"
        placeholder="Search"
        value={searchRequest}
        onChange={(event) => setSearchRequest(event.target.value)}
      />
    </SearchRoot>
  );
};

export default SearchBar;