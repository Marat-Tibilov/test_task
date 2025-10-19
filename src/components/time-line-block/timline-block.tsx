import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./timeline-block.scss";

interface Period {
    startYear: number;
    endYear: number;
    events: { year: number; description: string }[];
}

const TimelineBlock: React.FC<{ periods: Period[] }> = ({ periods }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const circleRef = useRef<HTMLDivElement | null>(null);
    const swiperRef = useRef<any>(null);
    const [radius, setRadius] = useState(220);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!circleRef.current || isMobile) return;
        const r = circleRef.current.offsetWidth / 2;
        setRadius(r);
    }, [isMobile]);

    const current = periods[activeIndex];
    const allEvents = periods.flatMap((period) => period.events);

    // Для мобилки показываем все события текущего периода
    const currentEvents = periods[activeIndex]?.events || [];

    return (
        <div className="timeline-block">
            {!isMobile ? (
                // ПК ВЕРСИЯ
                <>
                    <div className="cross-lines">
                        <div className="vertical-left"></div>
                        <div className="vertical-right"></div>
                    </div>

                    <h2 className="timeline-title">
                        исторические <br /> даты
                    </h2>

                    <div className="circle-wrap" ref={circleRef}>
                        <div className="dynamic-years">
                            <span className="year-start">{current.startYear}</span>
                            <span className="year-end">{current.endYear}</span>
                        </div>
                    </div>

                    <div className="circle-points-container">
                        {periods.map((_, index) => {
                            const pos = getPointPosition(index, periods.length, radius);
                            const isActive = index === activeIndex;

                            return (
                                <button
                                    key={index}
                                    className={`circle-point ${isActive ? "active" : ""}`}
                                    style={{
                                        left: `calc(50% + ${pos.x}px)`,
                                        top: `calc(50% + ${pos.y}px)`,
                                    }}
                                    data-number={index + 1}
                                    onClick={() => setActiveIndex(index)}
                                />
                            );
                        })}
                    </div>

                    <div className="bottom-section">
                        <button
                            className="nav-btn small left"
                            onClick={() => swiperRef.current?.slidePrev()}
                        >
                            &lt;
                        </button>

                        <Swiper
                            spaceBetween={60}
                            slidesPerView={3}
                            className="timeline-swiper"
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                            {allEvents.map((event, index) => (
                                <SwiperSlide key={index}>
                                    <div className="event-item">
                                        <div className="event-year">{event.year}</div>
                                        <div className="event-description">{event.description}</div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <button
                            className="nav-btn small right"
                            onClick={() => swiperRef.current?.slideNext()}
                        >
                            &gt;
                        </button>
                    </div>
                </>
            ) : (
                // МОБИЛЬНАЯ ВЕРСИЯ - ПРОСТОЙ LAYOUT
                <>
                    <h2 className="timeline-title">
                        исторические <br /> даты
                    </h2>

                    <div className="mobile-layout">
                        <div className="mobile-years">
                            <span className="year-start">{current.startYear}</span>
                            <span className="year-end">{current.endYear}</span>
                        </div>

                        <div className="mobile-events">
                            {currentEvents.map((event, index) => (
                                <div key={index} className="mobile-event">
                                    <div className="event-year">{event.year}</div>
                                    <div className="event-description">{event.description}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mobile-pagination">
                            {String(activeIndex + 1).padStart(2, '0')}/{String(periods.length).padStart(2, '0')}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    function getPointPosition(index: number, total: number, r: number) {
        const angle = (index * (360 / total) - 90) * (Math.PI / 180);
        return {
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r,
        };
    }
};

export default TimelineBlock;