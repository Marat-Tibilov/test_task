import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./timeline-block.scss";
import gsap from "gsap";

interface Period {
    startYear: number;
    endYear: number;
    events: { year: number; description: string }[];
}

const TimelineBlock: React.FC<{ periods: Period[] }> = ({ periods }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const circleRef = useRef<HTMLDivElement | null>(null);
    const [radius, setRadius] = useState(0);

    useEffect(() => {
        const resize = () => {
            if (!circleRef.current) return;
            const r = circleRef.current.offsetWidth / 2;
            setRadius(r);
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        gsap.fromTo(
            ".dynamic-years",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
    }, [activeIndex]);

    const current = periods[activeIndex];

    const getPosition = (i: number, total: number, r: number) => {
        const angle = (i * (360 / total) - 90) * (Math.PI / 180);
        return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
    };

    return (
        <div className="timeline-block">
            <div className="cross-lines" />

            <h2 className="timeline-title">
                исторические <br /> даты
            </h2>

            <div className="circle-wrap" ref={circleRef}>
                <div className="dynamic-years">
                    <span className="year-start">{current.startYear}</span>
                    <span className="year-end">{current.endYear}</span>
                </div>

                {periods.map((_, i) => {
                    const pos = getPosition(i, periods.length, radius - 10);
                    const active = i === activeIndex;
                    return (
                        <button
                            key={i}
                            className={`circle-point ${active ? "active" : ""}`}
                            style={{
                                left: `calc(50% + ${pos.x}px)`,
                                top: `calc(50% + ${pos.y}px)`,
                            }}
                            onClick={() => setActiveIndex(i)}
                        >
                            {active ? <span>{i + 1}</span> : ""}
                        </button>
                    );
                })}
            </div>

            <div className="bottom-section">
                <button
                    className="nav-btn small left"
                    onClick={() => setActiveIndex((p) => Math.max(p - 1, 0))}
                    disabled={activeIndex === 0}
                >
                    &lt;
                </button>

                <Swiper spaceBetween={40} slidesPerView={3} className="timeline-swiper">
                    {current.events.map((e, i) => (
                        <SwiperSlide key={i}>
                            <div className="event-item">
                                <div className="event-year">{e.year}</div>
                                <div className="event-description">{e.description}</div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    className="nav-btn small right"
                    onClick={() =>
                        setActiveIndex((p) => Math.min(p + 1, periods.length - 1))
                    }
                    disabled={activeIndex === periods.length - 1}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default TimelineBlock;
