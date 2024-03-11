import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import LifeGrid from '../pages/life';
import LifeHelpers from '../logic/life-helpers';
import LifeContext from './lifeContext';
import useAxios from '../communication/api';

export const Loop = ({ map,isRunning, instance, updateCell,setMap }) => {
    const loopRef = useRef();
    const [ready, setReady] = useState(false);
    const [loopInstance, setLoopInstance] = useState(0);
    const [life, setLife] = useState([]);
    const [isDone, setIsDone] = useState(false);
    const [frame,setFrame] = useState(-1);

    const LifeApi = useAxios('https://localhost:7163');

    useEffect(() => {
        initialize(instance);
    },[]);

    useEffect(() => {
        if(!ready) return;
        console.log("ready: ", ready);
    },[ready]);

    useEffect(() => {
        if(!life.length) return;
        console.log("life updated: ", life);
    },[life]);

    useEffect(() => {
        if(!isDone || !life.length) return;
        console.log("isDone: ", isDone);
        console.log("life is done: ", life);
    },[isDone]);

    const initialize = (ins) => {
        setLife(map);
        setLoopInstance(ins);
        console.log("setting ready to true");
        setFrame(0);
        setReady(true);
    }
    
    const progress = () => {
        getLife(life, cb => {
            console.log("done");
            setIsDone(true);
            setFrame(frame+1);
        })
    }

    const getLife = async (prev, cb) => {
        console.log("previous life: ", prev);
        await LifeApi.post("/generation",
        prev,
        yup => {
            console.log("yup: ", yup);
            setLife(yup);
            setMap(cb);
            cb(yup);
        },
        nope => {
            cb(nope);
        });
    }

    const LifeGridCallback = useCallback(() =>{
        if(!loopInstance || !life.length) return;
        console.log("rendering life: ", life);
        return <div ref={loopRef}>
        <button
            type='button'
            onClick={progress}
        >
            next generation
        </button>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1010"
                height="1010"
                viewBox="0 0 100 100"
            >
                <LifeGrid
                    instance={loopInstance}
                    life={life}
                    updateCell={updateCell}
                />
            </svg>
    </div>
    }
    ,[ready,isRunning,isDone]);

    return (<LifeGridCallback />);
};

export default Loop;