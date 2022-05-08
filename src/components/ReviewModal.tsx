import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import quoteIcon from "../svg/quoteIcon";
import starIcon from "../svg/starIcon";
import { ReviewModalProps } from "../types/props";
import { getFormattedRating } from "../utils/utils";
import ModalContainer from "./ModalContainer";

const ReviewCard = styled.article<{ rating?: number }>`
  background-color: ${(props) => {
    if (!props?.rating) return props.theme.colors.reviewCards.none;
    if (props?.rating <= 5) return props.theme.colors.reviewCards.bad;
    return props.theme.colors.reviewCards.good;
  }};
  border-radius: ${(props) => props.theme.borderRadiuses.default};

  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 100%;
  height: 800px;
  max-height: 80vh;
  width: 800px;
  max-width: 80vw;
  padding: 30px;
  position: relative;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
`;

const ReviewerName = styled.h4`
  font-family: "IBM Plex Mono", monospace;
  font-size: 30px;
  font-weight: 700;
  line-height: 39px;
`;

const ReviewRating = styled.span`
  display: flex;
  gap: 3px;
  justify-content: space-between;
  align-items: center;
  font-size: 30px;
  font-weight: 300;
  line-height: 37px;
  text-align: center;
`;

const ReviewText = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: left;
  overflow-y: scroll;

  flex: 1 1;

  scrollbar-width: thin;
  scrollbar-color: #FFF #A6A6A6;
  padding-right: 10px;

  transition: border-color 150ms ease-in-out;
  border-color: transparent;
  &:hover {
    border-color: #a0a0a0;
  }

  &::-webkit-scrollbar{
    /* add border to act as background-color */
    border-right-style: inset;
    /* sum viewport dimensions to guarantee border will fill scrollbar */
    border-right-width: calc(100vw + 100vh);
    /* inherit border-color to inherit transitions */
    border-color: inherit;
    border-radius: 3px;
  }

  &::-webkit-scrollbar {
    width: min(1vw, 4px);
  }

  &::-webkit-scrollbar-track {
  }
  
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #FFF;
  }

`;
const StarIcon = styled(starIcon)<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

const QuoteIcon = styled(quoteIcon)`
  top: 0;
  transform: translateY(calc(-50%));
  position: absolute;
  width: 47px;
  height: 35.08px;
`

const ReviewModal = ({ handleClose, review }: ReviewModalProps) => {
  return (
    <ModalContainer handleClose={handleClose}>
      <ReviewCard
        onClick={(ev) => ev.stopPropagation()}
        rating={review?.author_details?.rating}
      >
        <QuoteIcon />
        <ReviewHeader>
          <ReviewerName>{review.author}</ReviewerName>
          {review.author_details.rating && (
            <ReviewRating>
              <StarIcon size={20.5} />
              {getFormattedRating(review.author_details.rating)}
            </ReviewRating>
          )}
        </ReviewHeader>
        <ReviewText>
          <ReactMarkdown>{review.content}</ReactMarkdown>
        </ReviewText>
      </ReviewCard>
    </ModalContainer>
  );
};

export default ReviewModal;
