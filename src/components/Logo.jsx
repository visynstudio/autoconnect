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
                fontFamily: '"Outfit", sans-serif',
                fontSize: '1.5rem',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.1rem',
                letterSpacing: '-0.01em',
                height: '100%',
                whiteSpace: 'nowrap',
            }} className="logo-text">
                <span style={{ fontWeight: 600, color: textPrimary }}>Apni</span>
                <span style={{ fontWeight: 800, color: variant === 'dark' ? '#60A5FA' : textAccent }}>Car</span>
            </div>

            <style>{`
                /* Responsive Sizing Logic */
                .logo-container { height: 34px; }
                .logo-text { font-size: 1.5rem; }
                
                @media (max-width: 768px) {
                    .logo-container { height: 26px; }
                    .logo-text { font-size: 1.2rem; }
                    .logo-icon-box { border-radius: 4px !important; }
                }
            `}</style>
        </Link>
    );
}
