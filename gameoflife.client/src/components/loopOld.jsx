import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import LifeGrid from '../pages/life';
import LifeHelpers from '../logic/life-helpers';
import LifeContext from './lifeContext';
import useAxios from '../communication/api';

export const Loop = ({ map,isRunning }) => {
    const context = useContext(LifeContext);
    const loopInstance = Math.floor(Math.random() * 100);
    const [parentInstance,setParentInstance] = useState(null);
    const [life, setLife] = useState(map);
    const [frame, setFrame] = useState(0);
    const [ready, setReady] = useState(false);
    const lifeApi = useAxios(`https://localhost:7163`);
    const loopRef = useRef({loopComplete: false, intervalId: null});

    useEffect(() => {
        if (!map.length) return;
        initialize(() => {
            console.log("initializing loop");
            setLife(map);
        }).then((inst) => {
            if(context.instance !== inst) return console.log("initialize wrong instance");
            console.log("before setting ready: ", inst);
            setReady(true);
        }).then(() => {
            if(ready) console.log("should be ready now: ", ready);
            else console.log("not ready yet: ", ready);
        });
        
        return () => {
            console.log("shut it down instance: ", context.instance);
            console.log("shut it down ref: ", loopRef.current);
        }
    }, []);

    const initialize = async (cb) => {
        console.log("initialize loop");
        loopRef.current.loopComplete = true;
        loopRef.current.intervalId = 0;
        context.setInstance(loopInstance);
        setParentInstance(loopInstance);
        cb();
        return await loopInstance;
    };

    useEffect(() => {
        console.log("life: ", life);
    },[life]);

    useEffect(() => {
        console.log("ready: ", ready);
    },[ready]);

    useEffect(() => {
        console.log("parentInstance: ", parentInstance);
    },[parentInstance]);

    const updateCell = (cell) => {
        if(!ready) return console.log("not ready to updateCell");
        if (!context.instance || !map.length) return;
        life[cell.row][cell.col] = !life[cell.row][cell.col];
    };

    useEffect(() => {
        if(!ready) return console.log("not ready to set the loopComplete");
        console.log("loopComplete: ", loopRef.current);
    },[loopRef.current.loopComplete]);

    const getLifeAsync = async (num, latest,cb) => {
        if(context.instance !== loopInstance) return console.log("get life async wrong instance");
        if(!ready) return console.log("not ready to get a life");
        if (!context.instance || !loopInstance || !life || loopRef.current.loopComplete) return;
        await lifeApi.post(`/${num}/generations`,
        latest,
        yup => {
                setFrame(frame+1);
                cb(yup);
            },
            nope => {
                cb(console.error("nope: ", nope));
            });
    };

    const nextGenAsync = async () => {
        if(!ready) return console.log("not ready to get the next generation");
        if (!parentInstance || !loopInstance || !loopRef.current.loopComplete) return;
        loopRef.current.loopComplete = false;
        console.log("nextGen loopComplete 3: ", loopRef.current.loopComplete);
        if (loopInstance && isRunning) {
            return await getLifeAsync(1, life, finished => {
                setLife(finished);
                console.log("generation complete");
            });
        }
        else {
            return console.log("not running: ", context.intervalId);
        }
    };

    useEffect(() => {
        if(!ready) return console.log("not ready to update life");
        console.log("life updated: ", life);
    },[life]);

    useEffect(() => {
        if(!ready) return console.log("not ready to start the loop");
        if (!parentInstance || !loopInstance || !loopRef.current.loopComplete) return;
        if (!isRunning || !context.instance) {
            loopRef.current.loopComplete = false;
            console.log("stopped");
            clearInterval(loopRef.current?.intervalId);
            loopRef.current.intervalId = null;
        }
        else {
            if (loopInstance && !loopRef.current.intervalId) {
                console.log("running 2");
                loopRef.current.loopComplete = true;
                // loopRef.current.intervalId = setInterval(() => {
                //     loopRef.current.loopComplete = false;
                //     nextGenAsync().then(done => {
                //         loopRef.current.loopComplete = true;
                //     });
                // }, context.militicks);
                () => {
                    loopRef.current.loopComplete = false;
                    nextGenAsync().then(done => {
                        loopRef.current.loopComplete = true;
                        console.log("done: ", done);
                    });
                }
            }
        }
    }, [isRunning,loopInstance, parentInstance]);

    const SumpinCallback = useCallback(() => {
        if(!ready) return <div>Not Ready Yet...</div>;
        console.log("sumpin callback intervalId: ", loopRef.current.intervalId);
        console.log("sumpin callback loopInstance: ", loopInstance);
        console.log("sumpin callback life: ", life);
        console.log("sumpin callback loopComplete: ", loopRef.current.loopComplete);
        return <div>it shows: {loopInstance}</div>;
    },[ready]);

    const LifeGridCallback = useCallback((life) => {
        if (!parentInstance || !loopInstance || !life.length || !loopRef.current.loopComplete) {
            console.log("************************");
            console.log("parentInstance: ", parentInstance);
            console.log("loopInstance: ", loopInstance);
            console.log("life: ", life);
            console.log("map: ", map);
            console.log("loopComplete: ", loopRef.current.loopComplete);
            console.log("************************");
            return <div>I'm still loading</div>;
        }
        
        console.log("render life: ", life);
        return <div ref={loopRef}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1010"
                height="1010"
                viewBox="0 0 100 100"
            >
                <LifeGrid
                    instance={loopInstance}
                    life={map}
                    updateCell={updateCell}
                />
            </svg>
    </div>
    }
    ,[/* loopRef.current.intervalId, loopInstance,life,loopRef.current.loopComplete, */ready]);

    return (<LifeGridCallback />);

    // return <SumpinCallback />;
};

export default Loop;