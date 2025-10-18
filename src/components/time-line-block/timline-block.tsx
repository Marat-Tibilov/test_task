import React, { useEffect, useRef, useState } from "react";
import { TimelinePeriod } from "./types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./timeline-block.scss";
import gsap from "gsap";

interface TimelineBlockProps {
    periods: TimelinePeriod[];
    title?: string;
}

const TimelineBlock: React.FC<TimelineBlockProps> = ({  periods,   title = "Исторические даты" }) => {
    const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
    const currentPeriod = periods[currentPeriodIndex];
    const yearsRef = useRef<HTMLDivElement | null>(null);
    const circleRef = useRef<HTMLDivElement | null>(null);
    const [radius, setRadius] = useState(0);

    // вычисляем радиус
    useEffect(() => {
        const calcRadius = () => {
            if (!circleRef.current) return;
            const rect = circleRef.current.getBoundingClientRect();
            setRadius(Math.min(rect.width, rect.height) / 2 - 40);
        };
        calcRadius();
        window.addEventListener("resize", calcRadius);
        return () => window.removeEventListener("resize", calcRadius);
    }, []);

    // анимация годов при смене
    useEffect(() => {
        if (yearsRef.current) {
            gsap.fromTo(
                yearsRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );
        }
    }, [currentPeriodIndex]);

    const getCirclePointPosition = (
        index: number,
        total: number,
        r: number
    ) => {
        const angle = index * (360 / total) - 90;
        const rad = (angle * Math.PI) / 180;
        return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
    };

    const handleNext = () =>
        setCurrentPeriodIndex((prev) =>
            prev < periods.length - 1 ? prev + 1 : prev
        );

    const handlePrev = () =>
        setCurrentPeriodIndex((prev) => (prev > 0 ? prev - 1 : prev));

    const handleClickPoint = (index: number) => setCurrentPeriodIndex(index);

    return (
        <div className="timeline-block">
            <h2 className="timeline-title">{title}</h2>

            <div className="circle-wrap" ref={circleRef}>
                <div className="dynamic-years" ref={yearsRef}>
                    <span className="year-start">{currentPeriod.startYear}</span>
                    <span className="divider"> — </span>
                    <span className="year-end">{currentPeriod.endYear}</span>
                </div>

                {periods.map((_, i) => {
                    const pos = getCirclePointPosition(i, periods.length, radius);
                    const isActive = i === currentPeriodIndex;
                    return (
                        <button
                            key={i}
                            className={`circle-point ${isActive ? "active" : ""}`}
                            style={{
                                left: `calc(50% + ${pos.x}px)`,
                                top: `calc(50% + ${pos.y}px)`,
                            }}
                            onClick={() => handleClickPoint(i)}
                        >
                            {isActive ? <span>{i + 1}</span> : ""}
                        </button>
                    );
                })}
            </div>

            <div className="bottom-section">
                <button
                    className="nav-btn small left"
                    onClick={handlePrev}
                    disabled={currentPeriodIndex === 0}
                >
                    &lt;
                </button>

                <Swiper
                    spaceBetween={40}
                    slidesPerView={3}
                    className="timeline-swiper"
                >
                    {currentPeriod.events.map((event, i) => (
                        <SwiperSlide key={i}>
                            <div className="event-item">
                                <div className="event-year">{event.year}</div>
                                <div className="event-description">{event.description}</div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    className="nav-btn small right"
                    onClick={handleNext}
                    disabled={currentPeriodIndex === periods.length - 1}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default TimelineBlock;
