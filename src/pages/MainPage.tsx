import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import React, { RefCallback,useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from 'react-helmet-async'
import { useSwipeable } from "react-swipeable";
import styled, { AnyStyledComponent, StyledComponent } from "styled-components";

import MovieCard from "../components/MovieCard";
import MoviesSlider, { HorizontalPosition } from "../components/MoviesSlider";
import NotificationsProvider, { notificationContext } from "../components/NotificationsProvider";
import SearchBar from "../components/SearchBar";
import { Keys } from "../constants/keys";
import { transitionProps } from "../constants/props";
import { indexesRefContext,moviesDataContext } from "../contexts/MoviesDataProvider";
import { Styles } from "../contexts/StyleProvider";
import { MoviesDataService } from "../DataService/MoviesDataService";
import useInputSlider from "../hooks/useInputSlider";
import useRowIndex from "../hooks/useRowIndex";
import arrowDownIcon from "../svg/arrowDownIcon";
import searchIcon from "../svg/searchIcon";
import starIcon from "../svg/starIcon";
import stopwatchIcon from "../svg/stopwatchIcon";
import { MoviesDataLoaded } from "../types/context";
import { Movie } from "../types/movie";


const ArrowDownIcon = styled(arrowDownIcon)`
  width: 39px;
  height: 39px;
`;
const ArrowUpIcon = styled(ArrowDownIcon)`
  transform: rotate(180deg);
`;

// const BottomButtonContainer = styled.div`
//   ${ContainerStyle}
//   margin-top: 32px;
//   height: 80px;
//   position: relative;
// `

// const TopContentContainer = styled.div`
//   ${ContainerStyle}
//   position: relative;
// `

const Button = styled.div`
  position: relative;
  overflow: hidden;
  padding: 9px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 80px;
  border-radius: ${(props) => props.theme.borderRadiuses.default};

  opacity: 1;

  box-shadow: 0px 4px 6px 0px #0000001a;

  background: ${(props) => props.theme.colors.tint};
  cursor: pointer;

  transition: opacity 300ms, height 0ms 0ms, width 0ms 0ms;

  z-index: 1;
  &[data-is-invisible="true"] {
    height: 0;
    width: 0;
    opacity: 0;

    transition: opacity 300ms, height 0ms 300ms, width 0ms 300ms;
  }

  &::after {
    z-index: -1;
    content: "";
    position: absolute;
    inset: -50px;
    transform-origin: center center;
    transform: rotate(45deg) translateX(-100%);
    background: ${(props) => props.theme.colors.accent};

    transition: transform 0.5s ease-in-out;
  }
  &:hover::after {
    transform: rotate(45deg) translateX(0);
  }
`;

const Navigation = styled.nav`
  z-index: 0;
  position: absolute;
  pointer-events: none;

  right: 40px;
  top: 120px;
  bottom: 40px;

  & * {
    pointer-events: all;
  }

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export type CardPosition =
  | "left"
  | "center"
  | "right"
  | "lefter"
  | "righter"
  | "invisible";

  
const MainPage = () => {
  const data = useContext(moviesDataContext);
  const { isGeneresLoading } = data;

  const [ rowIndex, setRowIndex ] = useRowIndex()

  const canChangeRowTo = useCallback((index: number) => {
    return data.isGeneresLoading === false && data.data.length > index && index >= 0
  }, [data]);
    
  const { rowIncrease, rowDecrease } = useMemo(() => ({
    rowDecrease: () => setRowIndex((index) => canChangeRowTo(index - 1) ? index - 1 : index),
    rowIncrease: () => setRowIndex((index) => canChangeRowTo(index + 1) ? index + 1 : index),
  }), [canChangeRowTo])

  useInputSlider({
    key: Keys.ArrowDown,
    callback: rowIncrease
  }, {
    key: Keys.ArrowUp,
    callback: rowDecrease
  })

  const { ref } = useSwipeable({
    onSwipedDown: rowDecrease,
    onSwipedUp: rowIncrease
  })

  useEffect(() => {
    ref(document as unknown as HTMLElement)
  })


  return (
      <>
        <Helmet>
          <title>Movies explorer</title>
        </Helmet>
        <motion.div 
          {...transitionProps}
        >
        {isGeneresLoading === false && (
          <>
            {rowIndex - 1 >= 0 && (
              <MoviesSlider
                key={data.data[rowIndex - 1].genre.id}
                position={"top" as HorizontalPosition}
                data={data.data[rowIndex - 1]}
              />
            )}
            <MoviesSlider
              key={data.data[rowIndex].genre.id}
              position={"center" as HorizontalPosition}
              data={data.data[rowIndex]}
            />
            {rowIndex + 1 < data.data.length && (
              <MoviesSlider
                key={data.data[rowIndex + 1].genre.id}
                position={"bottom"}
                data={data.data[rowIndex + 1]}
              />
            )}
            <Navigation>
              <Button
                onClick={rowDecrease}
                data-is-invisible={!canChangeRowTo(rowIndex - 1)}
                
              >
                <ArrowUpIcon />{" "}
              </Button>
              <Button
                onClick={rowIncrease}
                data-is-invisible={!canChangeRowTo(rowIndex + 1)}
                
              >
                <ArrowDownIcon />
              </Button>
            </Navigation>
          </>
        )}
        </motion.div>
      </>
  );
};

export default MainPage;
