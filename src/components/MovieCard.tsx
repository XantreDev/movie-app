import { Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { useContext } from "react";
import styled from "styled-components";
import { styleContext, Styles } from "../contexts/StyleProvider";
import { CardPosition } from "../pages/MainPage";
import starIcon from "../svg/starIcon";
import stopwatchIcon from "../svg/stopwatchIcon";
import { LoadedMovie, Movie, ReleaseDate } from "../types/movie";

const Card = styled(motion.article)<typeof Styles>`
  z-index: 1;
  user-select: none;
  /* user-drag: none; */
  cursor: pointer;
  pointer-events: all;

  border-radius: ${(props) => props.borderRadiuses.default};
  background-color: ${({ colors }) => colors.tint};
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

const CardRating = styled.div<typeof Styles>`
  /* margin: 24px 40px 0 0; */
  /* z-index: 1; */
  display: flex;
  gap: 2.5px;
  justify-content: center;
  align-items: center;
  min-width: 70px;
  color: ${({ colors }) => colors.textBright};

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

const CardRatingText = styled.div<typeof Styles>``;

const CardBadge = styled.div<typeof Styles>`
  z-index: 1;
  background: hsla(0, 0%, 0%, 0.3);
  backdrop-filter: blur(10px);
  width: 100%;
  min-height: 80px;
  padding: 0 40px;
  border-radius: ${({ borderRadiuses }) => borderRadiuses.cardBadge};

  color: ${({ colors }) => colors.textBright};

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StopwatchIcon = styled(stopwatchIcon)`
  width: 22px;
  height: 22px;
`;

const CardTimer = styled.div<typeof Styles>`
  background: ${({ colors }) => colors.textBright};
  height: 32px;
  width: 78px;
  display: flex;
  gap: 2.5px;

  border-radius: 70px;

  padding-left: 2.5px;
  justify-content: center;
  align-items: center;
`;

const TimerTime = styled.div<typeof Styles>`
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  letter-spacing: 0.05em;

  color: ${({ colors }) => colors.background};
`;

const CardInfo = styled.div<typeof Styles>`
  color: ${({ colors }) => colors.textBright};
  max-width: calc(100% - 80px - 5px);
`;
const CardTitle = styled.h4<typeof Styles>`
  font-size: 24px;
  font-weight: 400;
  line-height: 28px;
  text-align: left;

  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
  white-space: nowrap;
`;
const CardBirthday = styled.div<typeof Styles>`
  font-size: 14px;
  font-weight: 300;
  line-height: 17px;
  display: inline;
`;

const SkeletonContainer = styled.div<typeof Styles & { isFailed: boolean }>`
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
    color: ${({ colors }) => colors.text};

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
  const style = useContext(styleContext);
  const { isLoading } = movieData;
  let isFailed: boolean;
  if ("isFailed" in movieData) {
    isFailed = movieData.isFailed;
  }
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
      onClick={onClick}
      {...style}
    >
      {(() => {
        const isNeedToShowSkeleton = isFailed || isLoading;
        if (isNeedToShowSkeleton) {
          return (
            <SkeletonContainer {...style} isFailed={isFailed}>
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
            <CardBadge {...style}>
              <CardInfo {...style}>
                <CardTitle {...style}>{movieDataAsLoaded.name}</CardTitle>
                <CardBirthday {...style}>
                  {getFormattedReleaseDate(movieDataAsLoaded)}
                </CardBirthday>
              </CardInfo>
              <CardRating {...style}>
                <StarIcon />
                <CardRatingText {...style}>
                  {movieDataAsLoaded.rating}
                </CardRatingText>
              </CardRating>
              {/* <CardTimer {...style}>
                <StopwatchIcon />
                <TimerTime {...style}>11:22</TimerTime>
              </CardTimer> */}
            </CardBadge>
          </>
        );
      })()}
    </Card>
  );
};

export default MovieCard;
