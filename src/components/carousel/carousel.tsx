import React, { useEffect, useState } from "react";
import './Carousel.css';
// Carousel component to display a horizontal scrolling list of images
export default function Carousel() {
    const [images, setImages] = useState<string[]>([]);
    const [startIdx, setStartIdx] = useState(0);
    // Dynamically import all images from the assets folder
    useEffect(() => {
        const imported = import.meta.glob('/src/assets/*.{jpg,png,JPG,PNG}', { eager: true });
        const imgs = Object.values(imported).map((mod: any) => mod.default);
        setImages(imgs);
    }, []);

    if (images.length === 0) return null;
    // Constants
    const IMG_WIDTH = 300;
    const IMG_GAP = 5;
    const VISIBLE_COUNT = 4;
    const containerWidth = IMG_WIDTH * VISIBLE_COUNT + IMG_GAP * (VISIBLE_COUNT - 1);
    const translateX = -(startIdx * (IMG_WIDTH + IMG_GAP));
    const canPrev = startIdx > 0;
    const canNext = startIdx + VISIBLE_COUNT <= images.length;

    return (
        <div 
            className="Carousel-container position-relative" 
            style={{ overflow: 'hidden', width: containerWidth}}
        >
            <button 
            // Previous button
                className="Carousel-btn-prev" 
                onClick={() => setStartIdx(s => s - 1)}
                disabled={!canPrev}
            >
                <i className="fa fa-chevron-left"></i>
            </button>
            <div
                className="Carousel-track d-flex align-items-center"
                style={{
                    gap: IMG_GAP,
                    transform: `translateX(${translateX}px)`,
                    transition: 'transform 0.5s ease-out'
                }}>
                {images.map((src, i) => (
                    <img 
                        key={i} 
                        src={src} 
                        alt={`carousel-${i}`} 
                        className="Carousel-item" 
                    />
                ))}
            </div>
            <button 
                className="Carousel-btn-next" 
                onClick={() => setStartIdx(s => s + 1)}
                disabled={!canNext}
            >
                <i className="fa fa-chevron-right"></i>
            </button>
        </div>
    );
}

