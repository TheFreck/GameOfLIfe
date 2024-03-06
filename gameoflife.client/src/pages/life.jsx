import React, { useCallback, useEffect, useState, useContext } from 'react';
import Cell from '../components/cell';
import LifeContext from '../components/lifeContext';

export const LifeGrid = ({ updateCell, instance,life }) => {
    const [gridInstance, setGridInstance] = useState(Math.floor(Math.random() * 100));
    const context = useContext(LifeContext);

    useEffect(() => {
        if (!instance || !life || !gridInstance) return;
        console.log("life grid life: ", life);
        setGridInstance(Math.floor(Math.random() * 100));
    }, []);

    useEffect(() => {
        console.log("checking life grid instance: ", gridInstance);
        if (!gridInstance || !life || !instance) return;
        console.log("life grid instance: ", gridInstance);
    }, [gridInstance]);

    const LifeGridCallback = useCallback(() => {
        if (!gridInstance || !life || !instance) return <div>...Loading the grid</div>;
        console.log("lifegridCallback life: ", life);
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
                        />
                    ))
                ))
            }
        </>
    }, [life, instance, gridInstance]);

    return <LifeGridCallback />;
}

export default LifeGrid;