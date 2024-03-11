import React, { Suspense, useCallback, useEffect, useState } from 'react';
import './App.css';
import Loop from './components/loop';
import LifeContext from './components/lifeContext';

function App() {
    const [isRunning, setIsRunning] = useState(false);
    const [width, setWidth] = useState(5);
    const [height, setHeight] = useState(3);
    const [edgeBuffer, setEdgeBuffer] = useState(1);
    const [readyToGo, setReadyToGo] = useState(false);
    const [instance, setInstance] = useState(0);
    const [blankMap, setBlankMap] = useState([[]]);
    const militicks = 1000;


    useEffect(() => {
        if(instance) return;
        initialize(Math.floor(Math.random()*100));
    }, []);

    useEffect(() => {
        if (!instance) return;
    }, [instance]);

    useEffect(() => {
        if(!blankMap[0].length) return;
    },[blankMap]);

    useEffect(() => {
        if(!instance || !blankMap[0].length) return;
    },[readyToGo]);

    const setMap = map => {
        blankMap.push(map);
    }

    const initialize = (init) => {
        let newLife = [];
        for (let i = 0; i < height + 2 * edgeBuffer; i++) {
            newLife[i] = [];
            for (let j = 0; j < width + 2 * edgeBuffer; j++) {
                newLife[i].push(false);
            }
        }
        setBlankMap([newLife]);
        setInstance(init);
        setReadyToGo(true);
    }

    const startStop = (lfe) => {
        if (!instance || !readyToGo || !blankMap[0].length) return;
        console.log("start/stop: ", lfe);
        setIsRunning(!isRunning);
    }

    const updateCell = (cell) => {
        if(!readyToGo || isRunning) return;
        blankMap[0][cell.row][cell.col] = !blankMap[0][cell.row][cell.col];
        console.log(blankMap);
    };

    const LoopCallback = useCallback(() => {
        if (!readyToGo || !blankMap[0].length || !instance) return;
        return <Loop isRunning={isRunning} map={blankMap[0]} instance={instance} updateCell={updateCell} startStop={startStop} setMap={setMap} />;
    }, [readyToGo,isRunning,blankMap,instance]);

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