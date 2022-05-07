import React, { useCallback, useContext, useMemo, useState } from "react";
import { ActorsListProps } from "../types/props";
import { MoviesDataService } from "../DataService/MoviesDataService";
import styled from "styled-components";
import { Styles } from "../contexts/StyleProvider";
import rightArrowIcon from "../svg/rightArrowIcon";
import leftArrowIcon from "../svg/leftArrowIcon";
import { motion, Variant, Variants } from "framer-motion";
import { getGoogleUrl } from "../utils/utils";

const { getImageUrl } = MoviesDataService;

const Actors = styled.section`
  width: 100%;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  color: white;
`;

const ActorsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  min-height: 152px;
  
  gap: 10px;
`;

const ActorCard = styled(motion.li)`
  position: absolute;
  top: 0;
  left: 0;
  width: calc((100% - 10px * 3) / 4);

  user-select: none;

  @media screen and (max-width: 600px) {
    width: calc((100% - 10px * 2) / 3);
  }

  @media screen and (max-width: 400px) {
    width: calc((100% - 10px) / 2);
  }
  
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;

const ActorCardImage = styled.img`
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1 / 1;
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
  position: relative;

  &[data-error="true"]{
    visibility: hidden;
    
    :after {
      visibility: visible;
      display: block;
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      background: ${props => props.theme.colors.tint};
      border-radius: inherit;
    }
  }
`;

const ActorCardName = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  line-clamp: 2;
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  text-align: center;
`;

const RightArrow = styled(rightArrowIcon)`
  cursor: pointer;
  min-width: 24px;
  height: 24px;
`;
const LeftArrow = styled(leftArrowIcon)`
  cursor: pointer;
  min-width: 24px;
  height: 24px;
`;

const ActorsCardsContainer = styled.ul`
  width: 100%;
  align-self: stretch;
  overflow-x: hidden;

  position: relative;
`

type VariationKeys = 'outLeft' | 'outRight' | '1' | '2' | '3' | '4'

const variation: {[key in VariationKeys]: Variant} = {
  outLeft: {
    x: `calc((100% + 10px) * -1)`,
    opacity: 0
  },
  1: {
    x: `calc((100% + 10px) * 0)`
  },
  2: {
    x: `calc((100% + 10px) * 1)`
  },
  3: {
    x: `calc((100% + 10px) * 2)`
  },
  4: {
    x: `calc((100% + 10px) * 3)`
  },
  outRight: {
    x: `calc((100% + 10px) * 4)`,
    opacity: 0
  }
}

const ActorsList = ({ data }: ActorsListProps) => {
  const cast = useMemo(() => data.credits.cast, [data])

  const [leftElement, setLeftElement] = useState(0)
  const getPlace = useCallback((index: number): VariationKeys => {
    if (index - leftElement < 0) return 'outLeft'
    if (index - leftElement >= 4) return 'outRight'
    return (index - leftElement + 1).toString() as VariationKeys  
  }, [leftElement])

  return (
    <Actors >
      <div style={{ marginLeft: "20px" }}>Actors</div>
      <ActorsContainer >
        <LeftArrow onClick={() => setLeftElement(value => value > 0 ? value - 1 : value)}/>
        <ActorsCardsContainer>
          {
            cast.map((value, index) => (
              <ActorCard 
                key={value.id} 
                
                // initial={false}
                animate={getPlace(index).toString()}
                variants={variation}
              >
                <a
                  style={{
                    display: 'contents',
                    color: 'inherit'
                  }}
                  href={getGoogleUrl(value.name)}
                  rel='noreferrer'
                  target='_blank'
                >
                  <ActorCardImage
                    onError={(ev) => {
                      (ev.target as HTMLImageElement)?.setAttribute?.('data-error', 'true')
                    }}
                    
                    src={getImageUrl(value.profile_path, "medium")}
                  />
                  <ActorCardName >{value.name}</ActorCardName>

                </a>
              </ActorCard>
            ))
          }

          </ActorsCardsContainer>       
          <RightArrow onClick={() => setLeftElement(value => value + 4 < cast.length ? value + 1 : value)} />
      </ActorsContainer>
    </Actors>
  );
};

export default ActorsList;
