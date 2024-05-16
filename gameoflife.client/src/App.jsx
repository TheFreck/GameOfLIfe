import React, { Suspense, useCallback, useEffect, useState } from 'react';
import './App.css';
import Loop from './components/loop';
import LifeContext from './components/lifeContext';
import LoopHousing from './components/loopHousing';

function App() {
    const [isRunning, setIsRunning] = useState(false);
    const [width, setWidth] = useState(20);
    const [height, setHeight] = useState(20);
    const [edgeBuffer, setEdgeBuffer] = useState(1);
    const [readyToGo, setReadyToGo] = useState(false);
    const [instance, setInstance] = useState(0);
    const [mapArray, setMapArray] = useState([[]]);
    const militicks = 1000;


    useEffect(() => {
        if(instance) return;
        initialize(Math.floor(Math.random()*100));
    }, []);

    //useEffect(() => {
    //    if (!instance) return;
    //}, [instance]);

    //useEffect(() => {
    //    if(!blankMap[0].length) return;
    //},[blankMap]);

    useEffect(() => {
        if(!instance || !mapArray[0].length) return;
    },[readyToGo]);

    useEffect(() => {
        console.log("isRunning changed: ", isRunning);
    },[isRunning]);

    const setMap = newMap => {
        mapArray.push(newMap);
        setMapArray(mapArray);
    }

    const initialize = (init) => {
        let newLife = [];
        for (let i = 0; i < height + 2 * edgeBuffer; i++) {
            newLife[i] = [];
            for (let j = 0; j < width + 2 * edgeBuffer; j++) {
                newLife[i].push(false);
            }
        }
        setMapArray([newLife]);
        setInstance(init);
        setReadyToGo(true);
    }

    const startStop = () => {
        if (!instance || !readyToGo) return;
        console.log("start/stop");
        setIsRunning(!isRunning);
    }

    const LoopCallback = useCallback(() => {
        if (!readyToGo || !instance) return;
        console.log("app isRunning: ", isRunning);
        return <LoopHousing isRunning={isRunning} instance={instance} startStop={startStop} />;
    }, [readyToGo,isRunning]);

    return (
            <LifeContext.Provider
                value={{
                    isRunning,
                    instance,
                    setInstance,
                    militicks,
                }}
            >
            <h1 id="tabelLabel">Game of Life</h1>
                <LoopCallback />
            </LifeContext.Provider>
    );
}

export default App;