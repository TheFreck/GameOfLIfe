import { useCallback, useEffect, useState } from "react";
import Loop from "./loop";
import LifeGrid from "../pages/life";
import LoopHelpers from "../logic/loopHelpers";
import useAxios from "../communication/api";


export const LoopHousing = ({ instance }) => {
    const [mapArray, setMapArray] = useState([[]]);
    const [frameTime, setFrameTime] = useState();
    const [frameId, setFrameId] = useState();
    const [width, setWidth] = useState(20);
    const [height, setHeight] = useState(20);
    const [edgeBuffer, setEdgeBuffer] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [updated, setUpdated] = useState(false);
    const LifeApi = useAxios("https://localhost:7163")

    useEffect(() => {
        if (!instance) return;
        console.log("loopHousing isRunning: ", isRunning);
        
    }, []);

    useEffect(() => {
        if (!instance) return;
        if (isRunning) {
            const frame = time => {
                console.log("previous: ", mapArray);
                LoopHelpers.getLife(LifeApi, mapArray[0], newMap => {
                    console.log("newMap: ", newMap);
                    mapArray.unshift(newMap)
                    setMapArray(mapArray);
                });
                setFrameTime(time);
                setTimeout(() => setFrameId(requestAnimationFrame(frame)), 500)
            }
            requestAnimationFrame(frame);
        }
        else {
            let newLife = [];
            for (let i = 0; i < height + 2 * edgeBuffer; i++) {
                newLife[i] = [];
                for (let j = 0; j < width + 2 * edgeBuffer; j++) {
                    newLife[i].push(false);
                }
            }
            console.log("instance: ", instance);
            console.log("before unshifting: ", mapArray);
            mapArray.unshift(newLife);
            console.log("after unshifting: ", mapArray);
            setMapArray(mapArray);
            setFrameId(0);
        }
        return () => {
            cancelAnimationFrame(frameId);
            console.log("dropping loop housing");
        }
    }, [isRunning]);

    useEffect(() => {
        console.log("updated");
    }, [updated]);

    const updateCell = (cell) => {
        mapArray[0][cell.row][cell.col] = !mapArray[0][cell.row][cell.col];
        setUpdated(!updated);
    };

    const LoopCallback = useCallback(() => {
        if (!mapArray.length) return;
        return <>
            <button
                type='button'
                onClick={() => setIsRunning(!isRunning)}
            >
                {isRunning ? "Stop" : "Start"}
            </button>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1010"
                height="1010"
                viewBox="0 0 100 100"
            >
                <LifeGrid
                    instance={instance}
                    life={mapArray[0]}
                    updateCell={updateCell}
                />
            </svg>
        </>
    }
        , [frameId,isRunning]);


    return <LoopCallback />
}

export default LoopHousing;