import React, { useState } from 'react';

const Search = () => {
    const [movies, setMovies] = useState([])
    
    return (
  <div>
      {
          movies.map(movie => 
                <SearchCard {...movie}/>
            )
      }
  </div>);
};

export default Search;
