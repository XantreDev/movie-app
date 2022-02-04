import { useState } from 'react';

export const useBound = ({value, bound}) => {
    const [ref, setRef] = useState(value)
    const boundRef = bound

    const setBoundedRef = (value) => {
        if (value < 0){ 
            setRef(0);
        }
        else if (value >= boundRef){
            setRef(boundRef - 1);
        } else{
            setRef(value)
        }
    }

    return [ref, setBoundedRef]
}

