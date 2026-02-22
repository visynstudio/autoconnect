import { Link } from 'react-router-dom';
import { Search, Bell, X, Info } from 'lucide-react';
import Logo from './Logo';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function timeAgo(dateString) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diff = (new Date(dateString) - new Date()) / 1000;
    if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
    if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
    if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
    return rtf.format(Math.round(diff / 86400), 'day');
}

export default function Header() {
    const [notifications, setNotifications] = useState([]);
    const [showPanel, setShowPanel] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserAndNotifications = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                loadNotifications(user.id);
            }
        };
        fetchUserAndNotifications();

        // Optional: subscribe to real-time changes if we had that set up
    }, []);

    const loadNotifications = async (userId) => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);
        if (!error && data) {
            setNotifications(data);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleNotificationClick = async (notif) => {
        if (!notif.is_read) {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notif.id);

            if (!error) {
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
            }
        }
    };
    return (
        <header className="app-header">
            <div className="header-content">
                <div style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                    <Logo variant="light" />
                </div>

                <div className="header-actions">
                    <Link to="/browse" className="icon-btn">
                        <Search size={22} />
                    </Link>
                    <div className="notification-wrapper">
                        <button className="icon-btn" onClick={() => setShowPanel(!showPanel)}>
                            <Bell size={22} />
                            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                        </button>

                        {/* Slide Down Panel */}
                        {showPanel && user && (
                            <div className="notif-panel animate-slide-down">
                                <div className="notif-header">
                                    <h3>Notifications</h3>
                                    <button onClick={() => setShowPanel(false)} className="close-panel-btn">
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="notif-list">
                                    {notifications.length === 0 ? (
                                        <div className="notif-empty">
                                            <Bell size={24} color="#cbd5e1" />
                                            <p>No notifications yet.</p>
                                        </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                className={`notif-item ${!notif.is_read ? 'unread' : ''}`}
                                                onClick={() => handleNotificationClick(notif)}
                                            >
                                                <div className="notif-icon-box">
                                                    <Info size={16} />
                                                </div>
                                                <div className="notif-content">
                                                    <p className="notif-title">{notif.title}</p>
                                                    <p className="notif-msg">{notif.message}</p>
                                                    <span className="notif-time">
                                                        {timeAgo(notif.created_at)}
                                                    </span>
                                                </div>
                                                {!notif.is_read && <div className="unread-dot"></div>}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .app-header {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    background-color: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid var(--border);
                    height: 56px;
                    display: flex;
                    align-items: center;
                    padding: 0 16px;
                    padding-top: env(safe-area-inset-top, 0);
                    width: 100%;
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .icon-btn {
                    color: var(--text-main);
                    padding: 4px;
                    background: none;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    cursor: pointer;
                    -webkit-tap-highlight-color: transparent;
                }

                .notification-wrapper {
                    position: relative;
                }

                .notif-badge {
                    position: absolute;
                    top: 0px;
                    right: 4px;
                    background: #ef4444;
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 800;
                    height: 16px;
                    min-width: 16px;
                    padding: 0 4px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid white;
                }

                .notif-panel {
                    position: absolute;
                    top: 48px;
                    right: -16px; /* Align to edge on mobile */
                    width: 100vw;
                    max-width: 360px;
                    background: white;
                    border-radius: 0 0 16px 16px;
                    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.15);
                    border: 1px solid var(--border);
                    border-top: none;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    z-index: 2000;
                }

                @media (min-width: 480px) {
                    .notif-panel {
                        right: 0;
                        width: 360px;
                        border-radius: 16px;
                        border-top: 1px solid var(--border);
                    }
                }

                .notif-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    border-bottom: 1px solid var(--border);
                    background: #f8fafc;
                }

                .notif-header h3 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .close-panel-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    padding: 4px;
                    display: flex;
                }

                .notif-list {
                    max-height: 400px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                .notif-empty {
                    padding: 40px 20px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    color: var(--text-muted);
                    font-weight: 500;
                }
                .notif-empty p { margin: 0; }

                .notif-item {
                    display: flex;
                    gap: 12px;
                    padding: 16px;
                    border-bottom: 1px solid var(--border);
                    background: white;
                    transition: background 0.2s;
                    cursor: pointer;
                    align-items: flex-start;
                }

                .notif-item:last-child {
                    border-bottom: none;
                }

                .notif-item.unread {
                    background: #f0fdf4;
                }

                .notif-icon-box {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: #dcfce7;
                    color: #16a34a;
                    display: flex;
                    flex-shrink: 0;
                    align-items: center;
                    justify-content: center;
                }

                .notif-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .notif-title {
                    margin: 0;
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: var(--primary);
                }

                .notif-msg {
                    margin: 0;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    line-height: 1.3;
                }

                .notif-time {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .unread-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #2563eb;
                    margin-top: 6px;
                    flex-shrink: 0;
                }

                .animate-slide-down {
                    animation: slideDownPanel 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                    transform-origin: top right;
                }

                @keyframes slideDownPanel {
                    from { opacity: 0; transform: scale(0.95) translateY(-10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </header>
    );
}
