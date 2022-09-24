import "react-medium-image-zoom/dist/styles.css";

import { Skeleton } from "@mui/material";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import Zoom from "react-medium-image-zoom";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import ActorsList from "../components/ActorsList";
import { modalContext } from "../components/ModalProvider";
import { notificationContext } from "../components/NotificationsProvider";
import ReviewModal from "../components/ReviewModal";
import { MoviesDataService } from "../DataService/MoviesDataService";
import useLazyBackgroundImage from "../hooks/useLazyBackgroundImage";
import quoteIcon from "../svg/quoteIcon";
import starIcon from "../svg/starIcon";
import { MovieDetails } from "../types/movieDetails";
import { RequestStatus } from "../types/movieSearchResults";
import { formatRutime, getFormattedRating } from "../utils/utils";

const DetailsContainer = styled(motion.div)`
  max-width: min(1200px, 90%);
  margin: 0 auto;
  padding-top: ${({
    theme: {
      dimmensions: {
        searchHeight,
        searchTopOffset,
        searchCardsOffsetFromSearchBar,
      },
    },
  }) => searchHeight + searchTopOffset + searchCardsOffsetFromSearchBar}px;
  /* min-height: 100vh; */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const DetailsRoot = styled(motion.article)`
  flex: 1 0 100%;

  background-color: ${({ theme: { colors } }) => colors.background};
  width: 100%;
  padding: 80px;

  @media screen and (max-width: 600px) {
    padding: 40px;
  }

  height: 100%;
  border-radius: ${({ theme: { borderRadiuses } }) =>
      Array(2).fill(borderRadiuses.default).join(" ")}
    0 0;
`;

const DetailsFlexRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DetailsFlexColumns = styled.div`
  display: flex;
  gap: 40px;
  justify-content: space-between;
  width: 100%;

  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Poster = styled(motion.div)<{ imageUrl: string }>`
  user-select: none;
  height: 660px;
  width: 528px;
  max-width: 100%;
  border-radius: ${({ theme: { borderRadiuses } }) => borderRadiuses.default};

  @media screen and (max-width: 900px) {
    width: 100%;
  }

  background-image: url(${({ imageUrl }) => imageUrl});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
`;

const Rating = styled.div`
  background-color: ${({ theme: { colors } }) => colors.accent};
  position: absolute;
  padding: 8px 12px;
  right: 8px;
  top: 15px;
  width: 82px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${(props) => props.theme.borderRadiuses.default};

  color: white;
  font-size: 25px;
  font-weight: 300;
  line-height: 29px;
`;

const StarIcon = styled(starIcon)<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

const Details = styled.div`
  display: flex;
  max-width: 420px;
  @media screen and (max-width: 900px) {
    max-width: 100%;
  }

  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  line-height: 57px;

  text-overflow: ellipsis;
`;

const AdditionalInfo = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 15px;
  font-weight: 300;
  line-height: 18px;
  flex-shrink: 0;
`;

const Generes = styled.div`
  display: flex;
  gap: 15px;
  overflow: hidden;
  flex-flow: row wrap;
  height: 30px;
  justify-content: right;
`;

const GenereCard = styled.a`
  display: block;
  font-size: 14px;
  font-weight: 300;
  line-height: 17px;
  color: white;
  text-align: center;
  max-width: fit-content;
  white-space: nowrap;

  flex: 0 1 33%;

  padding: 5px;
  border: 1px solid ${({ theme: { colors } }) => colors.accent};
  border-radius: 5px;
`;

const Overview = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  color: white;
`;

const Images = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;

  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  padding: 10px 0;
`;

const ImagesContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 10px;

  & > * {
    flex: 0 1 33%;
  }
`;

const ImageRect = styled.img`
  object-fit: cover;
  overflow: hidden;
  object-position: center;
  width: 100%;
  /* aspect-ratio: 1 / 1; */
  border-radius: ${({ theme: { borderRadiuses } }) => borderRadiuses.cardBadge};
`;

const Reviews = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 35px;

  font-size: 32px;
  font-weight: 700;
  line-height: 38px;
`;
const QuoteIcon = styled(quoteIcon)`
  top: 0;
  transform: translateY(calc(-50%));
  position: absolute;
`;

const ReviewCards = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px 20px;

  & > * {
    flex: 1 1 calc(calc(800px - 100%) * 99999);
  }
`;

const ReviewCard = styled.article<{ rating?: number }>`
  background-color: ${(props) => {
    if (!props?.rating) return props.theme.colors.reviewCards.none;
    if (props?.rating <= 5) return props.theme.colors.reviewCards.bad;
    return props.theme.colors.reviewCards.good;
  }};

  cursor: pointer;
  padding: 10px 20px;
  border-radius: ${(props) => props.theme.borderRadiuses.cardBadge};
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media screen and (min-width: 800px) {
    max-width: 50%;
  }
  height: 200px;
  position: relative;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
`;

const ReviewerName = styled.h4`
  font-family: "IBM Plex Mono", monospace;
  font-size: 17px;
  font-weight: 700;
  line-height: 22px;
`;

const ReviewRating = styled.span`
  display: flex;
  gap: 3px;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  line-height: 19px;
  text-align: center;
`;
const ReviewText = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  text-overflow: -o-ellipsis-lastline;
`;

const BackgroundImage = styled(motion.div)<{
  backgroundUrl: string;
  isLoaded: boolean;
}>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* opacity: ${(props) => (props.isLoaded ? 1 : 0)}; */
  transition: filter 500ms ease-in-out;
  background-image: url(${(props) => props.backgroundUrl});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  filter: blur(2px) opacity(${(props) => (props.isLoaded ? "100%" : "0%")});
  z-index: 0;

  &::after {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    content: "";
    background-color: rgba(0 0 0 / 0.5);
  }
`;

const CustomSkeleton = styled(Skeleton)`
  flex: 1 0 100%;
  border-radius: ${({ theme: { borderRadiuses } }) =>
      Array(2).fill(borderRadiuses.default).join(" ")}
    0 0;
`;

const DetailsPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const [details, setDetails] = useState<MovieDetails>({
    status: RequestStatus.Loading,
  });

  const notificationDispatch = useContext(notificationContext);

  useEffect(() => {
    (async () => {
      try {
        const data = await MoviesDataService.getMovieDetails(+movieId);
        setDetails({
          status: RequestStatus.Finished,
          data,
        });
      } catch {
        notificationDispatch({
          type: "append-notification",
          payload: {
            id: +dayjs(),
            duration: 5,
            text: "Page load failed, check your internet connection",
          },
        });
        setDetails({
          status: RequestStatus.Error,
        });
      }
    })();
  }, []);

  const { getImageUrl } = MoviesDataService;

  const [isLoaded, backgroundUrl] = useLazyBackgroundImage(
    details?.status !== RequestStatus.Finished
      ? ""
      : getImageUrl(details.data.backdrop_path, "original")
  );

  const [isPosterLoaded, posterUrl] = useLazyBackgroundImage(
    details?.status !== RequestStatus.Finished
      ? ""
      : getImageUrl(details?.data?.images?.posters?.[0]?.file_path, "original")
  );

  const dispatchModal = useContext(modalContext);

  return (
    <>
      <Helmet>
        <title>
          {details.status !== RequestStatus.Finished
            ? "Loading"
            : details.data.title}
        </title>
      </Helmet>
      <BackgroundImage
        isLoaded={isLoaded}
        backgroundUrl={backgroundUrl}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      />
      <DetailsContainer>
        <AnimatePresence>
          {details.status !== RequestStatus.Finished ? (
            <motion.div
              style={{ display: "contents" }}
              key="details-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <CustomSkeleton
                sx={{
                  bgcolor: "grey.900",
                  opacity: "inherit",
                }}
                variant="rectangular"
              />
            </motion.div>
          ) : (
            <DetailsRoot
              key="details-root"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <DetailsFlexRows>
                <DetailsFlexColumns>
                  <Poster
                    initial={{ opacity: 0 }}
                    variants={{
                      isNotLoaded: { opacity: 0 },
                      isLoaded: { opacity: 1 },
                    }}
                    animate={isPosterLoaded ? "isLoaded" : "isNotLoaded"}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    imageUrl={posterUrl}
                  >
                    <Rating>
                      <StarIcon size={16.5} />
                      {getFormattedRating(details.data.vote_average)}
                    </Rating>
                  </Poster>
                  <Details>
                    <Title>{details.data.title}</Title>
                    <AdditionalInfo>
                      <MetaInfo>
                        <div>{dayjs(details.data.release_date).year()}</div>
                        <div>{formatRutime(details.data.runtime)}</div>
                      </MetaInfo>
                      <Generes>
                        {details.data.genres.map((genreDetails) => (
                          <GenereCard key={genreDetails.id}>
                            {genreDetails.name}
                          </GenereCard>
                        ))}
                      </Generes>
                    </AdditionalInfo>
                    <Overview>{details.data.overview}</Overview>
                    <Images>
                      Images
                      <ImagesContainer>
                        {details.data.images.backdrops
                          .slice(0, 3)
                          .map((image) => (
                            <Zoom
                              overlayBgColorEnd="rgba(255 255 255 / .5)"
                              zoomMargin={40}
                              key={image.file_path}
                            >
                              <ImageRect
                                src={getImageUrl(image.file_path, "original")}
                              />
                            </Zoom>
                          ))}
                      </ImagesContainer>
                    </Images>
                    <ActorsList data={details.data} />
                  </Details>
                </DetailsFlexColumns>
                {+details?.data?.reviews?.results?.length > 0 && (
                  <Reviews>
                    Reviews
                    <ReviewCards>
                      {details.data.reviews.results
                        .slice(0, 3)
                        .map((review) => (
                          <ReviewCard
                            rating={review?.author_details?.rating}
                            key={review.id}
                            onClick={() => {
                              console.log(1);
                              dispatchModal({
                                type: "open-modal",
                                payload: (
                                  <ReviewModal
                                    handleClose={() =>
                                      dispatchModal({
                                        type: "close-modal",
                                      })
                                    }
                                    review={review}
                                  />
                                ),
                              });
                            }}
                          >
                            <QuoteIcon />
                            <ReviewHeader>
                              <ReviewerName>{review.author}</ReviewerName>
                              {review.author_details.rating && (
                                <ReviewRating>
                                  <StarIcon size={11} />
                                  {getFormattedRating(
                                    review.author_details.rating
                                  )}
                                </ReviewRating>
                              )}
                            </ReviewHeader>
                            <ReviewText>
                              <ReactMarkdown>{review.content}</ReactMarkdown>
                            </ReviewText>
                          </ReviewCard>
                        ))}
                    </ReviewCards>
                  </Reviews>
                )}
              </DetailsFlexRows>
            </DetailsRoot>
          )}
        </AnimatePresence>
      </DetailsContainer>
    </>
  );
};

export default DetailsPage;
