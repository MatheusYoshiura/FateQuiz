"use client";

import React, { useEffect, useState, useMemo } from 'react';

const StarParticle = ({ id, color }: { id: number; color: string }) => {
    const [style, setStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        const angle = Math.random() * 360;
        const distance = 50 + Math.random() * 50;
        const finalX = Math.cos((angle * Math.PI) / 180) * distance;
        const finalY = Math.sin((angle * Math.PI) / 180) * distance;
        const duration = 0.5 + Math.random() * 0.5;
        const delay = Math.random() * 0.2;

        const initialStyle: React.CSSProperties = {
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '8px',
            height: '8px',
            backgroundColor: color,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 1,
        };

        const finalStyle: React.CSSProperties = {
            ...initialStyle,
            transform: `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px)) scale(1)`,
            opacity: 0,
            transition: `transform ${duration}s ${delay}s cubic-bezier(0.1, 0.75, 0.25, 1), opacity ${duration}s ${delay}s`,
        };
        
        setStyle(initialStyle);
        
        const timeoutId = setTimeout(() => {
            setStyle(finalStyle);
        }, 50);

        return () => clearTimeout(timeoutId);

    }, [id, color]);

    return <div style={style} />;
};

export const StarBurst = React.memo(({ count = 20 }: { count?: number }) => {
    const colors = ['hsl(var(--primary))', '#FFC700', '#FF0000', '#8A2BE2', '#00BFFF'];
    const particles = useMemo(() => 
        Array.from({ length: count }, (_, i) => ({
            id: i,
            color: colors[i % colors.length]
        })), [count]);

    return (
        <div className="pointer-events-none absolute inset-0 z-10">
            {particles.map(p => <StarParticle key={p.id} id={p.id} color={p.color} />)}
        </div>
    );
});

StarBurst.displayName = "StarBurst";
