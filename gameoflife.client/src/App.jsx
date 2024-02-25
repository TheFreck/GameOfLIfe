import { useEffect, useState } from 'react';
import './App.css';
import LifeGrid from './pages/life';

function App() {
    
    return (
        <div>
            <h1 id="tabelLabel">Game of Life</h1>
            <LifeGrid />
        </div>
    );
}

export default App;