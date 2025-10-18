import React from 'react';
import TimelineBlock from "./components/time-line-block/timline-block";
import {timelineData} from "./components/time-line-block/data";

const App: React.FC = () => {


    return (
        <div className="container">
            <TimelineBlock periods={timelineData} />
        </div>
    );
};

export default App;
