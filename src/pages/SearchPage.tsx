import { Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useDebounce } from "use-debounce";

import { MoviesDataService } from "../DataService/MoviesDataService";
import starIcon from "../svg/starIcon";
import {
  CardData,
  MoviesSearchRequest,
  RequestStatus
} from "../types/movieSearchResults";
import { getDetailsMovieUrl, getFormattedRating } from "../utils/utils";

export type SearchPageProps = {
  data: MoviesSearchRequest;
};

const SearchCard = styled(motion.div)`
  width: 240px;
  height: 320px;
  background-color: ${({ theme: { colors } }) => colors.tint};
  position: relative;

  border-radius: ${({ theme }) => theme.borderRadiuses.default};

  display: flex;
  flex-direction: column-reverse;
  overflow: hidden;
  cursor: pointer;
`;

const SearchCardBadgeWrapper = styled.div`
  height: 100%;
  position: relative;

  backdrop-filter: blur(4px);
  border-radius: ${({ theme: { borderRadiuses } }) => borderRadiuses.cardBadge};

  background-color: rgba(0 0 0 / 0.3);
  transition: transform 200ms ease-in-out;
  transform: translateY(calc(100% - 50px));
  *:hover > & {
    transform: translateY(0);
  }

  &::after {
    content: "Learn more...";
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    white-space: nowrap;
    transform: translate(-50%, -50%);
    font-size: 20px;
    color: white;
    font-weight: 500;
  }
`;

const SearchCardBadge = styled.div`
  display: flex;
  background-color: rgba(0 0 0 / 0.3);
  border-radius: ${({ theme: { borderRadiuses } }) => borderRadiuses.cardBadge};
  padding: 10px;
  gap: 15px;
  align-items: center;
  height: 50px;
  width: 100%;
`;

const SearchContainer = styled(motion.div)`
  position: relative;
  padding-top: ${({
    theme: {
      dimmensions: {
        searchHeight,
        searchTopOffset,
        searchCardsOffsetFromSearchBar,
      },
    },
  }) => searchHeight + searchTopOffset + searchCardsOffsetFromSearchBar}px;
  padding-bottom: 40px;

  margin: 0 auto;
  width: 80vw;
  display: grid;

  grid-template-columns: repeat(auto-fill, min(240px, 70vw));
  gap: 50px 40px;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;

    & > * {
      flex-shrink: 0;
    }
  }
`;

const CardBackground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;

  background-position: center;
  background-size: cover;
`;

const CardTitle = styled.div`
  width: 140px;
  text-overflow: ellipsis;
  overflow: hidden;

  color: white;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  white-space: nowrap;
`;

const CardBadgeDivider = styled.span`
  height: 100%;
  width: 1px;
  background-color: rgba(255, 255, 255, 0.8);
  filter: blur(0.3px);
`;

const StarIcon = styled(starIcon)`
  width: 10px;
  height: 10px;
`;

const RatingSection = styled.span`
  font-size: 14px;
  font-weight: 300;
  line-height: 14px;
  color: hsla(0, 0%, 100%, 0.9);

  display: inline-flex;
  gap: 3px;
  align-items: center;
`;

const SearchPage = () => {
  const { searchQuery: searchRequestNotDebounced } = useParams();
  const [searchRequest] = useDebounce(searchRequestNotDebounced, 300);
  const [searchResults, setSearchResults] = useState<MoviesSearchRequest>({
    status: RequestStatus.Loading,
  });

  useEffect(() => {
    if (!searchRequest.length) {
      return;
    }

    setSearchResults({ status: RequestStatus.Loading });

    const isNeedToSearchController = new AbortController();

    (async () => {
      try {
        const result = await MoviesDataService.findMovieByQuery(
          searchRequest,
          isNeedToSearchController.signal
        );

        if (isNeedToSearchController.signal.aborted) return;

        setSearchResults({
          data: result,
          status: RequestStatus.Finished,
        });
      } catch {
        setSearchResults({
          status: RequestStatus.Error,
        });
      }
    })();

    return () => isNeedToSearchController.abort();
  }, [searchRequest]);

  const data = searchResults;

  const cards = useMemo<CardData[]>(() => {
    if (data.status !== RequestStatus.Finished) {
      return Array(10).fill({ isLoading: true } as CardData);
    }
    return data.data;
  }, [data]);

  const navigate = useNavigate();
  const redirectToMovie = (id: number | string) =>
    navigate(getDetailsMovieUrl(id));

  return (
    <>
      <Helmet>
        <title>{searchRequest}</title>
      </Helmet>
      <SearchContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 30,
        }}
      >
        {cards.map((cardData, index) => (
          <SearchCard
            onClick={() =>
              cardData.isLoading ? null : redirectToMovie(cardData.id)
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ type: "tween" }}
            key={index}
          >
            {cardData.isLoading ? (
              <Skeleton
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: 0,
                  height: "100%",
                }}
                variant="rectangular"
              />
            ) : (
              <CardBackground
                style={{
                  backgroundImage: `url(${
                    cardData.posterUrl ?? cardData.backdropUrl
                  })`,
                }}
              ></CardBackground>
            )}

            <SearchCardBadgeWrapper>
              <SearchCardBadge>
                {cardData.isLoading ? (
                  <Skeleton
                    sx={{ width: "100%", bgcolor: "grey.800" }}
                    variant="text"
                  />
                ) : (
                  <>
                    <CardTitle>{cardData.title}</CardTitle>
                    <CardBadgeDivider />
                    <RatingSection>
                      <StarIcon />
                      {getFormattedRating(cardData.vote_average)}
                    </RatingSection>
                  </>
                )}
              </SearchCardBadge>
            </SearchCardBadgeWrapper>
          </SearchCard>
        ))}
      </SearchContainer>
    </>
  );
};

export default SearchPage;
