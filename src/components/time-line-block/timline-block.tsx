import React, { useState, useEffect } from 'react';
import { TimelinePeriod } from './types';
import './timeline-block.module.scss';

interface TimelineBlockProps {
    periods: TimelinePeriod[];
    title?: string;
}

const TimelineBlock: React.FC<TimelineBlockProps> = ({periods, title = "Исторические даты"}) => {
    const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
    const currentPeriod = periods[currentPeriodIndex];

    // Инициализация Swiper
    useEffect(() => {
        // Здесь будет инициализация Swiper
        // Пока оставим заглушку
    }, [currentPeriodIndex]);

    const handlePeriodChange = (index: number) => {
        setCurrentPeriodIndex(index);
    };

    return (
        <div className="timeline-block">
            <div className="timeline-header">
                <h2>{title}</h2>
            </div>

            <div className="timeline-main">
                <div className="timeline-controls">
                    <div className="year-display">
                        <span className="start-year">{periods[0].startYear}</span>
                        <span className="end-year">{periods[0].endYear}</span>
                    </div>

                    <div className="timeline-circle">
                        {periods.map((period, index) => (
                            <button
                                key={index}
                                className={`circle-point ${index === currentPeriodIndex ? 'active' : ''}`}
                                onClick={() => handlePeriodChange(index)}
                                style={{
                                    transform: `rotate(${index * (360 / periods.length)}deg) translate(150px) rotate(-${index * (360 / periods.length)}deg)`
                                }}
                            >
                                <span className="point-number">{index + 1}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="timeline-content">
                    <div className="current-years">
                        {currentPeriod.startYear} - {currentPeriod.endYear}
                    </div>

                    <div className="swiper-container">
                        <div className="swiper-wrapper">
                            {currentPeriod.events.map((event, index) => (
                                <div key={index} className="event-slide">
                                    <div className="event-year">{event.year}</div>
                                    <div className="event-description">{event.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineBlock;