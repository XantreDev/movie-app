import React from 'react';
import Card from './../Card/Card';
import styles from './CardsList.module.scss';

const CardsList = ({children}) => {
  return (   
    <div 
        onWheel={wheel => {console.log(wheel)}}
        className={styles.list}
    >
        {children}
    </div>    
  )
};

export default CardsList;
