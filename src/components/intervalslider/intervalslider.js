import React from 'react';

export const IntervalSlider = (props) => {
    return(
        <input type='range' min='100' max='2000' value={props.intervalTime} onChange={props.change}/>
    )
}