export const LoopHelpers = {
    getLoop: ({map,loopId,frame}) => {
        console.log("loopHousing isRunning: ", isRunning);
        if(instance && isRunning){
            setLoopId(setTimeout(() => ({
                frame: frame+1,

            }),500));
        }
        else{
            clearInterval(loopId);
        }
    },
    getLife: async (LifeApi, prev, cb) => {
        LifeApi.post("/generation",
        prev,
            yup => {
                console.log("cb: ", yup);
            cb(yup);
        },
        nope => {
            cb(nope);
        });
    }
}

export default LoopHelpers;