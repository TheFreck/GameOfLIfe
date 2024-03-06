import React, { useContext, useState } from 'react';

export const Cell = ({ state, row, col, size, updateCell }) => {
    const [isAlive, setIsAlive] = useState(state);
    const cellClick = () => {
        setIsAlive(!isAlive);
        updateCell({col,row});
    };
    return <rect x={col*size} y={row*size} width={size} height={size} stroke="black" strokeWidth={.1} fill={isAlive ? 'black' : 'white'} onClick={cellClick} />;
};

export default Cell;