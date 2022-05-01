import dayjs from "dayjs";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { moviesDataContextDispatch } from "../contexts/MoviesDataProvider";
import { styleContext, Styles } from "../contexts/StyleProvider";
import { MoviesDataService } from "../DataService/MoviesDataService";
import useInputSlider from "../hooks/useInputSlider";
import { CardPosition } from "../pages/MainPage";
import { MoviesDataLoaded } from "../types/context";
import { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

const ContentRoot = styled(motion.div)<typeof Styles & { topOffset: number, position: HorizontalPosition }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: ${(props) => props.topOffset}px;
  overflow: hidden;
  pointer-events: none;
  /* z-index: ${props => {
    switch (props.position){
      case 'top':
      case 'bottom': {
        return -1
      }
      default:
        return 1
    }
  }}; */
`;

const ContainerStyle = `
  width: 54vw;
  margin: 0 auto;
`;

const ContentGenreTitle = styled(motion.h2)<typeof Styles>`
  ${ContainerStyle}

  user-select: none;
  font-size: 5.6rem;
  font-weight: 600;
  line-height: 6.6rem;

  color: ${({ colors }) => colors.accent};
`;

const CardsContainer = styled(motion.main)<typeof Styles>`
  ${ContainerStyle}

  height: 57vh;
  position: relative;

  margin-top: 32px;
  /* overflow: hidden; */
`;

export type HorizontalPosition = "top" | "center" | "bottom";

type MoviesSliderProps = {
  topOffset: number;
  data: MoviesDataLoaded["data"][0];
  position: HorizontalPosition;
}

const MoviesSlider = ({ topOffset, data, position }: MoviesSliderProps) => {
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
            movies,
          },
        });
      } catch {
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
            })),
          },
        });
      }
    })();

    const tmp = Array.from(Array(oneBunchLoad)).map(
      (__, index) =>
        ({
          isLoading: true,
          id: currentTime.toISOString() + index,
          loadStarted: currentTime,
        } as Movie)
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
    () =>
      dispatch({
        type: "change-index",
        payload: {
          genre,
          type: "increment",
        },
      }),
    () =>
      dispatch({
        type: "change-index",
        payload: {
          genre,
          type: "decriment",
        },
      })
  );
  const style = useContext(styleContext);

  return (
    <ContentRoot
      position={position}
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
      {...style}
      topOffset={topOffset}
    >
      <ContentGenreTitle {...style}>{genre.name}:</ContentGenreTitle>

      <CardsContainer {...style}>
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
            key={movieData.id}
          />
        ))}
      </CardsContainer>
    </ContentRoot>
  );
};

export default MoviesSlider;
