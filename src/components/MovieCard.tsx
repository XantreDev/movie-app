import { Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import useCombineCallbacksByState from "../hooks/useCombineCallbacksByState";
import { CardPosition } from "../pages/MainPage";
import starIcon from "../svg/starIcon";
import stopwatchIcon from "../svg/stopwatchIcon";
import { LoadedMovie, Movie } from "../types/movie";
import { getFormattedRating, redirectToMovie } from "../utils/utils";

const Card = styled(motion.article)`
  z-index: 1;
  user-select: none;
  /* user-drag: none; */
  cursor: pointer;
  pointer-events: all;

  border-radius: ${({ theme: { borderRadiuses } }) => borderRadiuses.default};
  background-color: ${({ theme: { colors } }) => colors.tint};
  inset: 0;
  position: absolute;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  align-items: flex-end;
  justify-content: flex-end;

  box-shadow: 0px 6px 4px rgba(0, 0, 0, 0.3);

  img {
    user-drag: none;
    -webkit-user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    pointer-events: none;

    position: absolute;
    width: 100%;
    height: 100%;

    object-fit: cover;
  }
`;

const CardRating = styled.div`
  /* margin: 24px 40px 0 0; */
  /* z-index: 1; */
  display: flex;
  gap: 2.5px;
  justify-content: center;
  align-items: center;
  min-width: 70px;
  color: ${({ theme: { colors } }) => colors.textBright};

  font-size: 3rem;
  font-weight: 300;
  line-height: 3.6rem;
  filter: drop-shadow(2px 4px 4px hsla(0, 0%, 0%, 0.4));
`;

const StarIcon = styled(starIcon)`
  margin-top: 2.5px;
  width: 20px;
  height: 20px;
`;

const CardRatingText = styled.div``;

const CardBadge = styled.div`
  z-index: 1;
  background: hsla(0, 0%, 0%, 0.3);
  backdrop-filter: blur(10px);
  width: 100%;
  min-height: 80px;
  padding: 0 40px;
  border-radius: ${({ theme: { borderRadiuses } }) => borderRadiuses.cardBadge};

  color: ${({ theme: { colors } }) => colors.textBright};

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StopwatchIcon = styled(stopwatchIcon)`
  width: 22px;
  height: 22px;
`;

const CardTimer = styled.div`
  background: ${({ theme: { colors } }) => colors.textBright};
  height: 32px;
  width: 78px;
  display: flex;
  gap: 2.5px;

  border-radius: 70px;

  padding-left: 2.5px;
  justify-content: center;
  align-items: center;
`;

const TimerTime = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  letter-spacing: 0.05em;

  color: ${({ theme: { colors } }) => colors.background};
`;

const CardInfo = styled.div`
  color: ${({ theme: { colors } }) => colors.textBright};
  max-width: calc(100% - 80px - 5px);
`;
const CardTitle = styled.h4`
  font-size: 24px;
  font-weight: 400;
  line-height: 28px;
  text-align: left;

  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
  white-space: nowrap;
`;
const CardBirthday = styled.div`
  font-size: 14px;
  font-weight: 300;
  line-height: 17px;
  display: inline;
`;

const SkeletonContainer = styled.div<{ isFailed: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  &::after {
    display: ${(props) => (props.isFailed ? "block" : "none")};
    content: "Loading failed :(";
    font-size: 36px;
    font-weight: 400;
    color: ${({ theme: { colors } }) => colors.text};

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  /* & > * {
    padding: 10px 20px;
    width: 100%; 
  } */
`;

const variants = {
  left: { x: "-54vw", scale: 0.8 },
  center: { x: "0", scale: 1 },
  right: { x: "54vw", scale: 0.8 },
  lefter: { x: `-${54 * 2}vw`, scale: 0.6 },
  righter: { x: `${54 * 2}vw`, scale: 0.6 },
};

const getFormattedReleaseDate = ({ releaseDate: date }: LoadedMovie) => {
  if (date === "Unknown") return date;

  return date.format("MMM YYYY");
};

export type MovieCardProps = {
  movieData: Movie;
  position: CardPosition;
  onClick: () => void;
};

const MovieCard = ({ position, movieData, onClick }: MovieCardProps) => {
  const { isLoading } = movieData;
  let isFailed: boolean;
  if ("isFailed" in movieData) {
    isFailed = movieData.isFailed;
  }
  const navigate = useNavigate();
  const handleClick = useCombineCallbacksByState(
    [
      {
        callback: () => redirectToMovie(navigate, movieData.id),
        target: "center",
        isNeedToUse: !isLoading && !isFailed,
      },
      {
        callback: onClick,
      },
    ],
    position
  );

  if (position === "invisible") return <></>;

  return (
    <Card
      variants={variants}
      animate={position}
      // style={{display: ['lefter', 'righter'].includes(getPosition(index)) ? 'none' : 'flex'}}
      transition={{
        // type: 'tween'

        type: `spring`,
        mass: 1,
        damping: 40,
        stiffness: 200,
        velocity: 1.8,
      }}
      initial={false}
      onClick={handleClick}
    >
      {(() => {
        const isNeedToShowSkeleton = isFailed || isLoading;
        if (isNeedToShowSkeleton) {
          return (
            <SkeletonContainer isFailed={isFailed}>
              <Skeleton
                sx={{ bgcolor: "grey.900" }}
                animation="wave"
                variant="rectangular"
                height={"calc(100% - 80px)"}
              />
              <Skeleton
                sx={{ bgcolor: "grey.900" }}
                animation="wave"
                variant="text"
                height={"80px"}
              />
            </SkeletonContainer>
          );
        }
        const movieDataAsLoaded = movieData as LoadedMovie;

        return (
          <>
            <img src={movieDataAsLoaded.img} alt="" />
            <CardBadge>
              <CardInfo>
                <CardTitle>{movieDataAsLoaded.name}</CardTitle>
                <CardBirthday>
                  {getFormattedReleaseDate(movieDataAsLoaded)}
                </CardBirthday>
              </CardInfo>
              <CardRating>
                <StarIcon />
                <CardRatingText>
                  {getFormattedRating(movieDataAsLoaded.rating)}
                </CardRatingText>
              </CardRating>
              {/* <CardTimer >
                <StopwatchIcon />
                <TimerTime >11:22</TimerTime>
              </CardTimer> */}
            </CardBadge>
          </>
        );
      })()}
    </Card>
  );
};

export default MovieCard;
