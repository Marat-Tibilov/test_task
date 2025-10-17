import React from 'react';
import TimelineBlock from "./components/time-line-block/timline-block";
import {timelineData} from "./components/time-line-block/data";

const App: React.FC = () => {

    const data = [
        { label: '2000', events: ['A', 'B', 'C'] },
        { label: '2005', events: ['D', 'E'] },
        { label: '2010', events: ['F', 'G', 'H'] },
        { label: '2015', events: ['I'] },
        { label: '2020', events: ['J', 'K'] },
        { label: '2025', events: ['L', 'M', 'N'] }
    ];

    return (
        <div className="container">
            <TimelineBlock periods={timelineData} />
        </div>
    );
};

export default App;
