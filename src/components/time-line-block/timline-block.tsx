import React, { useState } from 'react';
import { TimelinePeriod } from './types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './timeline-block.scss';

interface TimelineBlockProps {
    periods: TimelinePeriod[];
    title?: string;
}

const TimelineBlock: React.FC<TimelineBlockProps> = ({
                                                         periods,
                                                         title = "Исторические даты"
                                                     }) => {
    const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
    const currentPeriod = periods[currentPeriodIndex];

    const handlePeriodChange = (index: number) => {
        setCurrentPeriodIndex(index);
    };

    // Рассчитываем позицию точки на круге
    const getCirclePointPosition = (index: number, total: number, radius: number) => {
        const angle = (index * 360) / total;
        const radian = ((angle - 90) * Math.PI) / 180; // начинаем с верха
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        return { x, y };
    };

    // Рассчитываем прогресс
    const progress = ((currentPeriodIndex + 1) / periods.length) * 100;

    return (
        <div className="timeline-block">
            <div className="timeline-header">
                <h2>{title}</h2>
                <div className="total-years">
                    {periods[0].startYear} - {periods[periods.length - 1].endYear}
                </div>
            </div>

            <div className="timeline-main">
                <div className="timeline-controls">
                    <div className="timeline-circle">
                        {/* Центральные года */}
                        <div className="center-years">
                            <div className="current-period">
                                {currentPeriod.startYear} - {currentPeriod.endYear}
                            </div>
                            <div className="progress">{Math.round(progress)}%</div>
                        </div>

                        {/* Точки на круге */}
                        {periods.map((period, index) => {
                            const position = getCirclePointPosition(index, periods.length, 160);
                            const isActive = index === currentPeriodIndex;

                            return (
                                <div
                                    key={index}
                                    className={`circle-point ${isActive ? 'active' : ''}`}
                                    style={{
                                        left: `calc(50% + ${position.x}px)`,
                                        top: `calc(50% + ${position.y}px)`,
                                    }}
                                    onClick={() => handlePeriodChange(index)}
                                >
                                    <div className="point-line"></div>
                                    <div className="point-number">{index + 1}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="timeline-content">
                    <div className="slider-container">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={80}
                            slidesPerView={1.5}
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            }}
                            pagination={{
                                clickable: true,
                                el: '.swiper-pagination'
                            }}
                        >
                            {currentPeriod.events.map((event, index) => (
                                <SwiperSlide key={index}>
                                    <div className="event-slide">
                                        <div className="event-year">{event.year}</div>
                                        <div className="event-description">{event.description}</div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Кастомная навигация */}
                        <div className="swiper-navigation">
                            <div className="swiper-pagination"></div>
                            <div className="swiper-buttons">
                                <button className="swiper-button-prev">←</button>
                                <button className="swiper-button-next">→</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineBlock;