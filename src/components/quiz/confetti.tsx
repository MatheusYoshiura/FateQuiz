"use client";

import React, { useEffect, useState, useMemo } from 'react';

const ConfettiPiece = ({ id }: { id: number }) => {
    const [style, setStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        const x = Math.random() * 100;
        const y = Math.random() * -50 - 50; // Start off-screen
        const rotation = Math.random() * 360;
        const delay = Math.random() * 0.2;
        const duration = 0.8 + Math.random() * 0.5;
        const colors = ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        setStyle({
            left: `${x}vw`,
            top: `${y}vh`,
            transform: `rotate(${rotation}deg)`,
            backgroundColor: color,
            animation: `fall ${duration}s ${delay}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            opacity: 1,
            position: 'fixed',
            width: '10px',
            height: '20px',
            zIndex: 100,
        });
    }, [id]);

    return <div style={style} />;
};

export const Confetti = React.memo(({ count = 150 }: { count?: number }) => {
    const pieces = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);
    return (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
            {pieces.map(i => <ConfettiPiece key={i} id={i} />)}
        </div>
    );
});

Confetti.displayName = "Confetti";
