import React, { Suspense, useCallback, useEffect, useState } from 'react';
import './App.css';
import Loop from './components/loop';
import LifeContext from './components/lifeContext';

function App() {
    const [isRunning, setIsRunning] = useState(false);
    const [width, setWidth] = useState(3);
    const [height, setHeight] = useState(3);
    const [edgeBuffer, setEdgeBuffer] = useState(1);
    const [intervalId, setIntervalId] = useState(0);
    const [readyToGo, setReadyToGo] = useState(false);
    const [instance, setInstance] = useState(0);
    const [blankMap, setBlankMap] = useState([]);
    const militicks = 1000;


    useEffect(() => {
        setInstance(Math.floor(Math.random() * 100));
        let newLife = [];
        for (let i = 0; i < height + 2 * edgeBuffer; i++) {
            newLife[i] = [];
            for (let j = 0; j < width + 2 * edgeBuffer; j++) {
                newLife[i].push(false);
            }
        }
        setBlankMap([newLife]);
        setReadyToGo(true);
    }, []);

    useEffect(() => {
        if (!instance) return;
        console.log("app instance state update: ", instance);
    }, [instance]);

    const startStop = () => {
        console.log("start/stop pressed");
        if (!instance || !readyToGo || !blankMap[0].length) return;
        console.log("start/stop");
        setIsRunning(!isRunning);
    }

    const LoopCallback = useCallback(() => {
        console.log("loopcallback instance: ", instance);
        console.log("loopcallback readyToGo: ", readyToGo);
        console.log("loopcallback blankMap: ", blankMap);
        console.log("loopcallback blankMap length: ", blankMap.length);
        if (!instance || !readyToGo || !blankMap[0].length) return;
        console.log(`loopcallback instance: ${instance}; readyToGo: ${readyToGo}; blankMap: ${blankMap}`);
        return <Loop instance={instance} map={blankMap} />;
    }, [readyToGo, isRunning,blankMap,instance]);

    return (
            <LifeContext.Provider
                value={{
                    isRunning,
                    militicks,
                }}
            >
                <button
                    type='button'
                    onClick={startStop}
                >
                    next generation
                </button>
            <h1 id="tabelLabel">Game of Life</h1>
                <LoopCallback />
            </LifeContext.Provider>
    );
}

export default App;