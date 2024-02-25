import React, { useCallback, useEffect, useState } from 'react';
import { useAxios } from '../assets/api';
import Cell from '../components/cell';

export const LifeGrid = () => {
    const api = useAxios("https://localhost:7163");

    const [life,setLife] = useState([]);
    
    useEffect(() => {
        let newLife = [];
        for(let i=0; i<102; i++){
            newLife[i] = [];
            for(let j=0; j<102; j++){
                newLife[i].push(false);
            }
        }
        setLife(newLife);
    },[]);

    const updateState = (cell) => {
        life[cell.row][cell.col] = !life[cell.row][cell.col];
    }

    const callApi = () => {
        api.getWithUrl("/getLife",yup => console.log("yup: ", yup), nope => console.log("nope: ", nope));

    }

    const nextGen = () => {
        api.post("/generation",life, yup => {
            setLife(yup);
        },
        nope => {
            console.error("nope ", nope);
        })
    }
    
    const GridCallback = useCallback(() => (<>
        <button
            type='button'
            onClick={nextGen}
        >
            next generation   
        </button>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1010"
            height="1010"
            viewBox="0 0 100 100"
        >
            {
                life.map((row,i) => (
                    (i>0 && i<=life.length-2) &&
                    row.map((cell,j) => (
                        (j>0 && j<=row.length-2) && 
                        <Cell 
                            key={`cell-[${i}][${j}]`} 
                            state={cell} 
                            row={i} 
                            col={j} 
                            isSvg={true} 
                            size={1} 
                            toggleLife={updateState}
                        />
                    ))
                ))
            }
        </svg>
        </>),
        [life]);

    return <GridCallback />;
}

export default LifeGrid;