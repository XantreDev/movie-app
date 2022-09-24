import dayjs from "dayjs";
import { motion } from "framer-motion";
import { noop } from "lodash-es";
import React, { useCallback, useContext, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import styled from "styled-components";

import { moviesDataContextDispatch } from "../contexts/MoviesDataProvider";
import { MoviesDataService } from "../DataService/MoviesDataService";
import useInputSlider from "../hooks/useInputSlider";
import useRowLastPage from "../hooks/useRowLastPage";
import { CardPosition } from "../pages/MainPage";
import { MoviesDataLoaded } from "../types/context";
import { Movie } from "../types/movie";
import { Keys } from "./../constants/keys";
import MovieCard from "./MovieCard";
import { notificationContext } from "./NotificationsProvider";
import useCentralIndex from "./useCentralIndex";

const ContentRoot = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: ${({
    theme: {
      dimmensions: { searchHeight, searchTopOffset },
    },
  }) => searchHeight + searchTopOffset}px;
  overflow: hidden;
  pointer-events: none;
`;

const ContainerStyle = `
  width: 54vw;
  margin: 0 auto;
`;

const ContentGenreTitle = styled(motion.h2)`
  ${ContainerStyle}

  user-select: none;
  font-size: clamp(2rem, 8vw, 5.6rem);
  font-weight: 600;
  line-height: calc(clamp(2rem, 8vw, 5.6rem) * 1.2);

  @media screen and (max-width: 500px) {
    transform: translateX(-15%);
  }

  color: ${({ theme: { colors } }) => colors.accent};
`;

const CardsContainer = styled(motion.main)`
  ${ContainerStyle}

  height: 57vh;
  position: relative;

  margin-top: 32px;
`;

export type HorizontalPosition = "top" | "center" | "bottom";

type MoviesSliderProps = {
  data: MoviesDataLoaded["data"][0];
  position: HorizontalPosition;
};

const MoviesSlider = ({ data, position }: MoviesSliderProps) => {
  const { movies: moviesData, genre } = data;

  const offset = 5;
  const oneBunchLoad = 20;
  const { centralIndex, decriment, increment, unsafeChange } = useCentralIndex(
    genre.id
  );

  const dispatch = useContext(moviesDataContextDispatch);

  const whereNeedToLoadData = useCallback(() => {
    if (moviesData.length === 0) return "right";
    if (Math.abs(moviesData.length - centralIndex) <= offset) {
      return "right";
    }
    if (centralIndex <= offset) {
      return "left";
    }

    return "nowhere";
  }, [moviesData, centralIndex]);

  const { ref } = useSwipeable({
    onSwipedLeft: position === "center" ? increment : noop,
    onSwipedRight: position === "center" ? decriment : noop,
    trackMouse: false,
  });

  useEffect(() => {
    ref(document as unknown as HTMLElement);
  });

  const [getTargetPage, incrementTargetPage] = useRowLastPage(genre.id);

  const notificationDispatch = useContext(notificationContext);

  useEffect(() => {
    const whereLoad = whereNeedToLoadData();

    if (whereLoad === "nowhere") return;

    const currentTime = dayjs();
    (async () => {
      const localTargetPage = getTargetPage();
      incrementTargetPage();
      try {
        const movies = await MoviesDataService.getMoviesDiscoverPage(
          localTargetPage,
          genre
        );
        dispatch({
          type: "set-loaded-movies",
          payload: {
            genre,
            loadStarted: currentTime,
            movies: movies.map((movieData) => ({
              ...movieData,
              key: `${movieData.id}-${genre.id}`,
            })),
          },
        });
      } catch {
        notificationDispatch({
          type: "append-notification",
          payload: {
            duration: 5,
            id: +dayjs(),
            text: "Some feed movies loaded with error",
          },
        });
        dispatch({
          type: "set-loaded-movies",
          payload: {
            genre,
            loadStarted: currentTime,
            movies: Array.from(Array(oneBunchLoad)).map((__, index) => ({
              isFailed: true,
              isLoading: false,
              id: currentTime.toISOString() + genre.id + index,
              loadStarted: currentTime,
              key: currentTime.toISOString() + genre.id + index,
            })),
          },
        });
      }
    })();

    const tmp: Movie[] = Array.from(Array(oneBunchLoad)).map((__, index) => ({
      isLoading: true,
      id: currentTime.toISOString() + genre.id + index,
      loadStarted: currentTime,
      key: currentTime.toISOString() + genre.id + index,
    }));

    dispatch({
      type: "add-movies-at-row",
      payload: {
        genre,
        direction: whereLoad,
        movies: tmp,
      },
    });
    if (whereLoad === "left") {
      unsafeChange(oneBunchLoad);
    }

    // if (whereLoad === "left") {
    //   setMoviesData((prev) => [...tmp, ...prev]);
    //   setCenterIndex((prev) => prev + oneBunchLoad);
    // }
    // if (whereLoad === "right") {
    //   setMoviesData((prev) => [...prev, ...tmp]);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centralIndex]);

  const getPosition = (index): CardPosition => {
    switch (index) {
      case centralIndex - 1:
        return "left";
      case centralIndex + 1:
        return "right";
      case centralIndex:
        return "center";
      case centralIndex - 2:
        return "lefter";
      case centralIndex + 2:
        return "righter";
      default:
        return "invisible";
    }
  };

  useInputSlider(
    {
      key: Keys.ArrowRight,
      callback: increment,
    },
    {
      key: Keys.ArrowLeft,
      callback: decriment,
    },
    position === "center"
  );
  return (
    <ContentRoot
      initial={false}
      animate={position}
      variants={{
        top: {
          opacity: 0,
          // y: `calc(-80vh + ${topOffset}px)`,
          y: `-80vh`,
        },
        center: {
          opacity: 1,
          // y: `${topOffset}px`,
          y: `0vh`,
        },
        bottom: {
          opacity: 0,
          // y: `calc(80vh + ${topOffset}px)`,
          y: `80vh`,
        },
      }}
      transition={{
        type: `spring`,
        mass: 1,
        damping: 40,
        stiffness: 200,
        velocity: 1.8,
      }}
    >
      <ContentGenreTitle>{genre.name}:</ContentGenreTitle>

      <CardsContainer>
        {moviesData.map((movieData, index) => (
          <MovieCard
            position={getPosition(index)}
            movieData={movieData}
            onClick={() => {
              if (index === centralIndex) return;

              index < centralIndex ? decriment() : increment();
            }}
            key={movieData.key}
          />
        ))}
      </CardsContainer>
    </ContentRoot>
  );
};

export default MoviesSlider;
