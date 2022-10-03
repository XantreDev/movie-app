import React, { useCallback, useMemo } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { GET_PATH, Pages, PATHS } from "../constants/paths";
import { usePage } from "../hooks/usePath";
import searchIcon from "../svg/searchIcon";

const SearchRoot = styled.div`
  max-width: min(760px, 80vw);
  width: 100%;
  min-height: ${(props) => props.theme.dimmensions.searchHeight ?? 44}px;
  background: ${(props) => props.theme.colors.tint};

  position: absolute;
  top: ${(props) => props.theme.dimmensions.searchTopOffset}px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 24px 8px 24px;

  display: flex;
  align-items: center;
  gap: 15px;

  border-radius: ${({ theme: { borderRadiuses } }) => borderRadiuses.default};
  z-index: 10;

  box-shadow: 2px 2px 6px rgb(0 0 0 / 0.4);
`;

const SearchField = styled.input`
  outline: none;
  border: none;
  background: none;
  width: 100%;

  font-weight: 500;
  font-size: 2rem;
  line-height: 2.37rem;
  color: ${(props) => props.theme.colors.text};

  &::placeholder {
    color: ${(props) => props.theme.colors.transparentText};
  }

  &::-webkit-search-cancel-button {
    --webkit-appearance: none;
    opacity: 0;
    pointer-events: none;
  }
`;

const SearchIcon = styled(searchIcon)`
  width: 2rem;
  height: 2rem;
  & * {
    fill: ${(props) => props.theme.colors.transparentText};
  }
`;

const useSearchQuery = () => (
  // eslint-disable-next-line no-sequences
  useLocation(), useMatch(PATHS.SEARCH)?.params?.searchQuery ?? ""
);

const SearchBar = () => {
  const searchQuery = useSearchQuery();
  const navigate = useNavigate();
  const isSearchPage = usePage() === Pages.Search;

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      if (isSearchPage && !newValue) {
        return navigate(PATHS.MAIN);
      }

      return navigate(GET_PATH.SEARCH(newValue), { replace: isSearchPage });
    },
    [isSearchPage, navigate]
  );

  return useMemo(
    () => (
      <SearchRoot>
        <SearchIcon />
        <SearchField
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={onChange}
        />
      </SearchRoot>
    ),
    [onChange, searchQuery]
  );
};

export default SearchBar;
