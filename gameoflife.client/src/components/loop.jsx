import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import LifeGrid from '../pages/life';
import LifeHelpers from '../logic/life-helpers';
import LifeContext from './lifeContext';
import useAxios from '../communication/api';

export const Loop = ({ instance,map }) => {
    const context = useContext(LifeContext);
    const [loopInstance, setLoopInstance] = useState(0);
    const [parentInstance, setParentInstance] = useState(0);
    const [life, setLife] = useState(map);
    const [frame, setFrame] = useState(0);
    const lifeApi = useAxios(`https://localhost:7163`);
    const loopRef = useRef({});

    useEffect(() => {
        console.log("loop");
        if (!instance || !map.length) return;
        const loopIns = Math.floor(Math.random() * 100);
        console.log("app instance from loop: ", instance);
        console.log("set loop instance: ", loopIns);
        console.log("loop map: ", map);
        setLife(map);
        setLoopInstance(loopIns);
        setParentInstance(instance);
        loopRef.current.instance = loopIns;
        return () => {
            console.log("shut it")
        }
    }, []);

    const updateCell = (cell) => {
        if (!instance || !map.length) return;
        life[0][cell.row][cell.col] = !life[0][cell.row][cell.col];
    }

    const setTheLife = (theLife) => {
        if (!instance || !loopInstance) return;
        console.log("******************");
        console.log("old life: ", life);
        console.log("new life: ", theLife);
        let newLife = life.concat(theLife);
        console.log("blended life: ", newLife);
        setLife(newLife);
        console.log("******************");
    };

    const getLife = async (num, latest, cb) => {
        if (!instance || !loopInstance) return;
        if (!life[0]) return;
        console.log("get life: ", life);
        await lifeApi.post(`/${num}/generations`,
            latest,
            yup => {
                console.log("got life: ", yup);
                setTheLife(yup);
                setTimeout(cb(yup),1000);
            },
            nope => {
                console.error("nope: ", nope);
            });
    };

    useEffect(() => {
        getLife(100, life[life.length - 1], (back) => {
            console.log("useEffect get life: ", back);
        })
    }, [life]);

    useEffect(() => {
        if (!parentInstance || !loopInstance) return;
        console.log("loopInstance: ", loopInstance);
        console.log("parentInstance: ", parentInstance);
    }, [loopInstance, parentInstance]);

    const nextGen = async () => {
        if (!parentInstance || !loopInstance) return;
        if (loopInstance && context.isRunning) {
            setFrame(frame + 1);
            await getLife(10, life[frame], map => {
                console.log("%%%%%%%%%%%%%%%%%");
                console.log("life has been set: ", map);
                console.log("%%%%%%%%%%%%%%%%%");
            });
        }
        else {
            console.log("not running: ", context.intervalId);
        }
    };

    useEffect(() => {
        if (!parentInstance || !loopInstance) return;
        if (!context.isRunning || !instance || !loopInstance) {
            console.log("stopped");
            clearInterval(loopRef.current?.intervalId);
            loopRef.current.intervalId = null;
        }
        else {
            console.log("running");
            if (loopInstance && !loopRef.current.intervalId) {
                loopRef.current.intervalId = setInterval(nextGen, context.militicks);
            }
        }
    }, [context.isRunning,loopInstance, parentInstance]);

    const LifeGridCallback = useCallback(() => {
        if (!parentInstance || !loopInstance) return <div>I'm still loading</div>;
        return <div ref={loopRef}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1010"
                height="1010"
                viewBox="0 0 100 100"
            >
                <LifeGrid
                    instance={loopInstance}
                    life={map[frame]}
                    updateCell={updateCell}
                >
                    {console.log("^^^^^^^^^^^^^^^^^^^") }
                    {console.log("instance: ", instance)}
                    {console.log("frame: ", frame)}
                    {console.log("map: ", map)}
                    {console.log("^^^^^^^^^^^^^^^^^^^")}
                </LifeGrid>
            </svg>
    </div>
    }
    ,[loopRef.current?.intervalId, context.isRunning, loopInstance,instance]);

    return (<LifeGridCallback />);
};

export default Loop;