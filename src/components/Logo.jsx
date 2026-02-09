import React from 'react';
import { Link } from 'react-router-dom';
import logoIcon from '../assets/logo/logo.png';

/**
 * Professional Logo Component for ApniCar
 * 
 * @param {string} variant - 'light' (for light bg, dark text) or 'dark' (for dark bg, light text)
 * @param {string} className - Additional classes
 */
export default function Logo({ variant = 'light', className = '' }) {
    // Colors
    const iconBg = '#2563EB'; // Blue Background for Icon

    // Text colors based on variant
    const textPrimary = variant === 'light' ? '#0F172A' : '#F8FAFC'; // Dark Navy or White
    const textAccent = '#2563EB'; // Professional Blue for "Car"

    return (
        <Link
            to="/"
            className={`logo-container ${className}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                textDecoration: 'none',
                userSelect: 'none'
            }}
        >
            {/* Icon Box */}
            <div style={{
                // Removed background color to show original icon
                borderRadius: '8px', // Rounded edges
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1/1',
                height: '100%',
                // Removed padding to maximize icon size
                boxShadow: 'none'
            }} className="logo-icon-box">
                <img
                    src={logoIcon}
                    alt="ApniCar Icon"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        // Removed filter to keep original colors
                    }}
                />
            </div>

            {/* Text */}
            <div style={{
                fontFamily: '"Outfit", sans-serif', // Using Outfit as requested (Modern, premium)
                fontSize: '1.5rem',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '-0.03em', // Tight letter spacing
                height: '100%',
            }} className="logo-text">
                <span style={{ fontWeight: 500, color: textPrimary }}>Apni</span>
                <span style={{ fontWeight: 600, color: variant === 'dark' ? '#60A5FA' : textAccent }}>Car</span>
                {/* Lighter blue for dark mode readability, requested blue for light mode */}
            </div>

            <style>{`
                /* Responsive Sizing Logic */
                .logo-container { height: 34px; }
                .logo-text { font-size: 1.5rem; }
                
                @media (max-width: 768px) {
                    .logo-container { height: 26px; }
                    .logo-text { font-size: 1.25rem; }
                    .logo-icon-box { padding: 5px !important; borderRadius: 6px !important; }
                }
            `}</style>
        </Link>
    );
}
