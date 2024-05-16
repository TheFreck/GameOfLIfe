import React, { useCallback, useEffect, useState, useContext } from 'react';
import Cell from '../components/cell';
import LifeContext from '../components/lifeContext';

export const LifeGrid = ({ updateCell, instance,life }) => {
    const [gridInstance, setGridInstance] = useState(0);

    useEffect(() => {
        console.log("life grid: ", life);
        if (!instance || !life.length || gridInstance) return;
        setGridInstance(instance);
    }, []);

    const LifeGridCallback = useCallback(() => {
        if (!gridInstance || !life) return <div>...Loading the grid</div>;
        return <>
            {
                instance && gridInstance && life && life.length > 0 &&
                life.map((row, i) => (
                    (i > 0 && i <= life.length - 2) &&
                    row.map((cell, j) => (
                        (j > 0 && j <= row.length - 2) &&
                        <Cell
                            key={`cell-[${i}][${j}]`}
                            state={cell}
                            row={i}
                            col={j}
                            isSvg={true}
                            size={5}
                            updateCell={updateCell}
                            instance={gridInstance}
                        />
                    ))
                ))
            }
        </>
    }, [life, gridInstance]);

    return <LifeGridCallback />;
}

export default LifeGrid;