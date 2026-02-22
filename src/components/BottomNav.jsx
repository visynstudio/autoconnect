import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Search, PlusCircle, Bookmark, User } from 'lucide-react';

export default function BottomNav() {
    const location = useLocation();

    const tabs = [
        { path: '/', label: 'Home', icon: HomeIcon },
        { path: '/browse', label: 'Browse', icon: Search },
        { path: '/add-vehicle', label: 'Sell', icon: PlusCircle },
        { path: '/saved', label: 'Saved', icon: Bookmark },
        { path: '/dashboard', label: 'Profile', icon: User },
    ];

    return (
        <div className="bottom-nav">
            {tabs.map((tab) => {
                const isActive = location.pathname === tab.path ||
                    (tab.path !== '/' && location.pathname.startsWith(tab.path));
                const Icon = tab.icon;

                return (
                    <Link to={tab.path} key={tab.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                        <div className="icon-wrapper">
                            <Icon size={24} />
                        </div>
                        <span className="nav-label">{tab.label}</span>
                    </Link>
                );
            })}

            <style>{`
                .bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: 0 auto;
                    width: 100%;
                    max-width: 480px; /* match app max-width */
                    background: white;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 8px 0;
                    padding-bottom: env(safe-area-inset-bottom, 8px);
                    border-top: 1px solid var(--border);
                    border-radius: 16px 16px 0 0;
                    box-shadow: 0 -4px 10px rgba(0,0,0,0.03);
                    z-index: 1000;
                }

                .nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    color: var(--text-muted);
                    flex: 1;
                    text-decoration: none;
                    transition: color 0.2s;
                    -webkit-tap-highlight-color: transparent;
                }

                .nav-item.active {
                    color: var(--accent);
                }

                .icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s;
                }
                
                .nav-item:active .icon-wrapper {
                    transform: scale(0.9);
                }

                .nav-label {
                    font-size: 0.7rem;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}
