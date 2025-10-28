'use client';
import React from 'react';

const BounceArrow = () => {
    const handleClick = () => {
        window.scrollBy({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    return (
        <button 
            className="bounce-arrow w-16 h-16 md:w-20 md:h-20 xl:w-24 xl:h-24 absolute left-1/2 bottom-24 md:bottom-12 -translate-x-1/2 z-50 bounce"
            onClick={handleClick}
            aria-label="Scroll down"
            type="button"
        >
            <svg filter="drop-shadow(0 0 4px rgba(0, 0, 0, 0.4))" fill="#ffffff" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M128,28A100,100,0,1,0,228,128,100.11332,100.11332,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.10416,92.10416,0,0,1,128,220Zm36.76953-88.76953a4,4,0,0,1,0,5.65674l-33.94141,33.9414a3.99971,3.99971,0,0,1-5.65625,0l-33.9414-33.9414a3.99992,3.99992,0,0,1,5.65674-5.65674L124,158.34326V88a4,4,0,0,1,8,0v70.34326l27.11279-27.11279A4,4,0,0,1,164.76953,131.23047Z"></path> </g></svg>
        </button>
    );
};
export default BounceArrow;

