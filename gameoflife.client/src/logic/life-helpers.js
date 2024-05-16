const LifeHelpers = {
    getLife: async (LifeApi, prev, cb) => {
        LifeApi.post("/generation",
        prev,
        yup => {
            cb(yup);
        },
        nope => {
            cb(nope);
        });
    }
}

export default LifeHelpers;