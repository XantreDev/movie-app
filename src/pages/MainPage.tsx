import { motion } from 'framer-motion';
import React, { useContext, useState, useEffect, useRef } from 'react';
import styled, { AnyStyledComponent, StyledComponent } from 'styled-components';
import SearchBar from '../components/SearchBar';
import { styleContext, Styles } from '../contexts/StyleProvider';
import searchIcon from '../svg/searchIcon';
import arrowDownIcon from '../svg/arrowDownIcon'
import starIcon from '../svg/starIcon';
import stopwatchIcon from '../svg/stopwatchIcon';
import { Movie } from '../types/movie'
import dayjs from 'dayjs';
import { MoviesDataService } from '../DataService/MoviesDataService';
import MovieCard from '../components/MovieCard';

const RootDiv = styled.div<typeof Styles>`
  width: 100vw;
  height: 100vh;
  background: ${(props) => props.colors.background};
`


const ContentRoot = styled(motion.div)<typeof Styles & { top: number }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: ${props => props.top}px;
  padding-top: min(6.3vh, 90px);
  overflow: hidden;
`
const ContainerStyle = `
  width: 54vw;
  margin: 0 auto;
`

const BottomButtonContainer = styled.div`
  ${ContainerStyle}
  margin-top: 32px;
  height: 80px;
  position: relative;
`

const TopContentContainer = styled.div`
  ${ContainerStyle}
  position: relative;
`

const ContentGenreTitle = styled(motion.h2)<typeof Styles>`
  ${ContainerStyle}

  font-size: 5.6rem;
  font-weight: 600;
  line-height: 6.6rem;

  color: ${({colors}) => colors.accent};
`

const CardsContainer = styled(motion.main)<typeof Styles>`
  ${ContainerStyle}

  height: 57vh;
  position: relative;

  margin-top: 32px;
  /* overflow: hidden; */
  
`


const ArrowDownIcon = styled(arrowDownIcon)`
  width: 39px;
  height: 39px;
`
const ArrowUpIcon = styled(ArrowDownIcon)`
  transform: rotate(180deg);
`

const Button = styled.div<typeof Styles>`
  position: relative;
  overflow: hidden;
  padding: 9px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 80px;
  border-radius: ${props => props.borderRadiuses.default};

  box-shadow: 0px 4px 6px 0px #0000001A;

  background: ${props => props.colors.tint};
  cursor: pointer;

  z-index: 1;
  &::after{
    z-index: -1;
    content: '';
    position: absolute;
    inset: -50px;
    transform-origin: center center;
    transform: rotate(45deg) translateX(-100%);
    background: ${props => props.colors.accent};

    transition: transform .5s ease-in-out;
  } &:hover::after{
    transform: rotate(45deg) translateX(0);
  }
`

const Navigation = styled.nav`
  position: absolute;

  right: 40px;
  top: 120px;
  bottom: 40px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`



export type CardPosition = 'left' | 'center' | 'right' | 'lefter' | 'righter' | 'invisible'

const MainPage = () => {
  const style = useContext(styleContext)  
  const [searchRequest, setSearchRequest] = useState('')

  const searchTopOffset = 40, searchHeight = 44 

  const [centerIndex, setCenterIndex] = useState(10)

  const [moviesData, setMoviesData] = useState<Movie[]>([])

  const offset = 5
  const oneBunchLoad = 20

  const whereNeedToLoadData = () => {
    if (moviesData.length === 0) return 'right'
    if (Math.abs(moviesData.length - centerIndex) <= offset) {
      return 'right'
    }
    if (centerIndex <= offset) {
      return 'left'
    }

    return 'nowhere'
  }
  const targetPageRef = useRef<number>(1)

  useEffect(() => {
    const whereLoad = whereNeedToLoadData()

    if (whereLoad === 'nowhere') return
    
    const currentTime = dayjs();
    (async () => {
      const targetPage = targetPageRef.current
      targetPageRef.current++
      try {
        const movies = await MoviesDataService.getMoviesDiscoverPage(
          targetPage
        );
        setMoviesData((data) => {
          const startIndex = data.findIndex(
            (value) => value.isLoading && value.loadStarted.isSame(currentTime)
            );
          return data.map((value, index) => {
            if (value.isLoading && value.loadStarted.isSame(currentTime)) {
              return movies[index - startIndex];
            }
            return value;
          })}
        );
      } catch {
        setMoviesData(prev => prev.map(value => {
          if (!value.isLoading){
            return value
          }
          if (value.loadStarted.isSame(currentTime)){
            return {
              ...value,
              isFailed: true,
              isLoading: true,
            }
          } 

          return value
        }))
      }
    })();

    const tmp = Array.from(Array(oneBunchLoad)).map((__, index) => ({
      isLoading: true,
      id: currentTime.toISOString() + index,
      loadStarted: currentTime
    } as Movie))

    if (whereLoad === 'left') {
      setMoviesData(prev => ([...tmp, ...prev]))
      setCenterIndex(prev => prev + oneBunchLoad)
    } 
    if (whereLoad === 'right') {
      setMoviesData(prev => ([...prev, ...tmp]))
    }

  }, [centerIndex])

  const getPosition = (index): CardPosition => {
    switch (index){
      case (centerIndex - 1):
        return 'left'
      case (centerIndex + 1):
        return 'right'
      case (centerIndex):
        return 'center'
      case (centerIndex - 2):
        return 'lefter'
      case (centerIndex + 2):
        return 'righter'
      default:
        return 'invisible'
    }
  }


  return (
    <RootDiv {...style}>
      <SearchBar
        height={searchHeight}
        searchRequest={searchRequest}
        setSearchRequest={setSearchRequest}
        topOffset={searchTopOffset}
      />

      <ContentRoot {...style} top={searchTopOffset + searchHeight}>
        <ContentGenreTitle {...style}>Action:</ContentGenreTitle>

        <CardsContainer {...style}>
          {moviesData
            .map((movieData, index) => (
              <MovieCard
                position={getPosition(index)}
                movieData={movieData}
                onClick={() => setCenterIndex(index)}
                key={movieData.id}
              />
            ))}
        </CardsContainer>
      </ContentRoot>
      <Navigation>
        <Button {...style}><ArrowUpIcon/> </Button>
        <Button {...style}><ArrowDownIcon/></Button>
      </Navigation>
    </RootDiv>
  );
};

export default MainPage;
