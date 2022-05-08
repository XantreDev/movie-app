import dayjs from "dayjs";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { moviesDataContextDispatch } from "../contexts/MoviesDataProvider";
import { Styles } from "../contexts/StyleProvider";
import { MoviesDataService } from "../DataService/MoviesDataService";
import useInputSlider from "../hooks/useInputSlider";
import { CardPosition } from "../pages/MainPage";
import { MoviesDataLoaded } from "../types/context";
import { Movie } from "../types/movie";
import MovieCard from "./MovieCard";
import { Keys } from "./../constants/keys"
import { notificationContext } from "./NotificationsProvider";

const ContentRoot = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: ${({ theme: { dimmensions: {searchHeight, searchTopOffset} } }) => searchHeight + searchTopOffset}px;
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
  font-size: 5.6rem;
  font-weight: 600;
  line-height: 6.6rem;

  color: ${({ theme: { colors }}) => colors.accent};
`;

const CardsContainer = styled(motion.main)`
  ${ContainerStyle}

  height: 57vh;
  position: relative;

  margin-top: 32px;
  /* overflow: hidden; */
`;

export type HorizontalPosition = "top" | "center" | "bottom";

type MoviesSliderProps = {
  data: MoviesDataLoaded["data"][0];
  position: HorizontalPosition;
}

const MoviesSlider = ({ data, position }: MoviesSliderProps) => {
  const { currentCenter: centerIndex, movies: moviesData, genre } = data;

  const offset = 5;
  const oneBunchLoad = 20;

  const dispatch = useContext(moviesDataContextDispatch);

  const whereNeedToLoadData = () => {
    if (moviesData.length === 0) return "right";
    if (Math.abs(moviesData.length - centerIndex) <= offset) {
      return "right";
    }
    if (centerIndex <= offset) {
      return "left";
    }

    return "nowhere";
  };
  const targetPageRef = useRef<number>(1);

  const notificationDispatch = useContext(notificationContext)

  useEffect(() => {
    const whereLoad = whereNeedToLoadData();

    if (whereLoad === "nowhere") return;

    const currentTime = dayjs();
    (async () => {
      const targetPage = targetPageRef.current;
      targetPageRef.current++;
      try {
        const movies = await MoviesDataService.getMoviesDiscoverPage(
          targetPage,
          genre
        );
        dispatch({
          type: "set-loaded-movies",
          payload: {
            genre,
            loadStarted: currentTime,
            movies: movies.map((movieData) => ({
              ...movieData,
              key: `${movieData.id}-${genre.id}`
            }))
          },
        });
      } catch {
        notificationDispatch({
          type: 'append-notification',
          payload: {
            duration: 5,
            id: +dayjs(),
            text: "Some feed movies loaded with error"
          }
        })
        dispatch({
          type: "set-loaded-movies",
          payload: {
            genre,
            loadStarted: currentTime,
            movies: Array.from(Array(oneBunchLoad)).map((__, index) => ({
              isFailed: true,
              isLoading: false,
              id: currentTime.toISOString() + index,
              loadStarted: currentTime,
              key: currentTime.toISOString() + index
            })),
          },
        });
      }
    })();

    const tmp: Movie[] = Array.from(Array(oneBunchLoad)).map(
      (__, index) =>
        ({
          isLoading: true,
          id: currentTime.toISOString() + index,
          loadStarted: currentTime,
          key: currentTime.toISOString() + index
        })
    );

    dispatch({
      type: "add-movies-at-row",
      payload: {
        genre,
        direction: whereLoad,
        movies: tmp,
      },
    });
    // if (whereLoad === "left") {
    //   setMoviesData((prev) => [...tmp, ...prev]);
    //   setCenterIndex((prev) => prev + oneBunchLoad);
    // }
    // if (whereLoad === "right") {
    //   setMoviesData((prev) => [...prev, ...tmp]);
    // }
  }, [centerIndex]);

  const getPosition = (index): CardPosition => {
    switch (index) {
      case centerIndex - 1:
        return "left";
      case centerIndex + 1:
        return "right";
      case centerIndex:
        return "center";
      case centerIndex - 2:
        return "lefter";
      case centerIndex + 2:
        return "righter";
      default:
        return "invisible";
    }
  };

  useInputSlider(
    {
      key: Keys.ArrowRight,
      callback: () =>
        dispatch({
          type: "change-index",
          payload: {
            genre,
            type: "increment",
          },
        }),
    },
    {
      key: Keys.ArrowLeft,
      callback: () =>
        dispatch({
          type: "change-index",
          payload: {
            genre,
            type: "decriment",
          },
        }),
    }
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
      <ContentGenreTitle >{genre.name}:</ContentGenreTitle>

      <CardsContainer >
        {moviesData.map((movieData, index) => (
          <MovieCard
            position={getPosition(index)}
            movieData={movieData}
            onClick={() => {
              if (index === centerIndex) return;

              dispatch({
                type: "change-index",
                payload: {
                  type: index < centerIndex ? "decriment" : "increment",
                  genre,
                },
              });
            }}
            key={movieData.key}
          />
        ))}
      </CardsContainer>
    </ContentRoot>
  );
};

export default MoviesSlider;
