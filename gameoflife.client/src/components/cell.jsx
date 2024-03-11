import React, { useContext, useEffect, useState } from 'react';

export const Cell = ({ state, row, col, size, updateCell, instance }) => {
    const [isAlive, setIsAlive] = useState(state);
    const [cellInstance, setCellInstance] = useState(0);

    useEffect(() => {
        setCellInstance(instance);
    },[]);
    const cellClick = () => {
        setIsAlive(!isAlive);
        updateCell({col,row});
    };
    return cellInstance && <rect x={col*size} y={row*size} width={size} height={size} stroke="black" strokeWidth={.1} fill={isAlive ? 'black' : 'white'} onClick={cellClick} />;
};

export default Cell;