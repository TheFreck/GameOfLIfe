import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import LifeGrid from '../pages/life';
import LifeHelpers from '../logic/life-helpers';
import LifeContext from './lifeContext';
import useAxios from '../communication/api';

export const Loop = ({ map, updateCell }) => {
    return <div>
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
    </div>;
};

export default Loop;