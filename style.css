:root {
    --bg-main: #05070a;
    --bg-side: #0d1117;
    --card: #161b22;
    --accent: #6366f1;
    --white: #ffffff;
    --gray: #8b949e;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg-main); color: var(--white); font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }

/* Sidebar & Navigation */
.sidebar {
    width: 280px; height: 100vh; background: var(--bg-side);
    position: fixed; left: 0; top: 0; z-index: 1000;
    padding: 40px 25px; border-right: 1px solid rgba(255,255,255,0.05);
    transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-area { text-align: center; margin-bottom: 40px; }
.main-logo { width: 65px; background: white; border-radius: 18px; padding: 5px; margin-bottom: 12px; }
.logo-area h2 { font-size: 18px; font-weight: 800; }
.logo-area span { font-size: 10px; color: var(--accent); font-weight: 700; }

.nav-links { list-style: none; margin-top: 20px; }
.nav-links li { 
    padding: 14px 18px; border-radius: 12px; margin-bottom: 8px; 
    color: var(--gray); cursor: pointer; font-weight: 600; transition: 0.3s;
}
.nav-links li:hover, .nav-links li.active { background: var(--accent); color: white; }
.nav-links li i { margin-right: 12px; }

/* Content Layout */
.main-content { margin-left: 280px; padding: 40px; min-height: 100vh; }

.hero { 
    background: var(--card); padding: 50px; border-radius: 28px; 
    border: 1px solid rgba(255,255,255,0.05); margin-bottom: 35px;
}
.hero h1 { font-size: 42px; line-height: 1.1; margin: 15px 0; font-weight: 800; }
.tag { font-size: 11px; font-weight: 800; color: var(--accent); opacity: 0.8; }
.hero p { color: var(--gray); margin-bottom: 30px; }

.action-btns { display: flex; gap: 15px; }
.btn-main { background: var(--accent); color: white; border: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; cursor: pointer; }
.btn-sub { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.1); padding: 14px 28px; border-radius: 12px; cursor: pointer; }

/* Gallery Grid */
.gallery-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-top: 20px; }
.media-card { border-radius: 20px; overflow: hidden; height: 220px; border: 1px solid rgba(255,255,255,0.05); }
.media-card img, .media-card video { width: 100%; height: 100%; object-fit: cover; }

/* Responsive Mobile */
.mobile-toggle {
    position: fixed; top: 20px; left: 20px; z-index: 1010;
    width: 45px; height: 45px; background: var(--accent);
    border: none; color: white; border-radius: 12px; display: none;
}

@media (max-width: 992px) {
    .mobile-toggle { display: block; }
    .sidebar { left: -280px; }
    .sidebar.active { left: 0; }
    .main-content { margin-left: 0; padding: 85px 20px 20px; }
    .overlay.active { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index: 999; display: block; }
    .hero { padding: 30px; }
    .hero h1 { font-size: 30px; }
}

/* Modals & Toasts */
.modal-bg { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index: 2000; backdrop-filter: blur(5px); }
.modal-box { background: var(--card); padding: 35px; border-radius: 24px; max-width: 450px; width: 90%; margin: 15% auto; position: relative; }
.close-x { position: absolute; right: 20px; top: 15px; cursor: pointer; font-size: 24px; color: var(--gray); }

.type-select { display: flex; gap: 10px; margin: 20px 0; }
.type-opt { flex:1; padding: 12px; border-radius: 10px; background: rgba(255,255,255,0.05); color: white; border: 1px solid transparent; cursor: pointer; }
.type-opt.active { background: var(--accent); border-color: var(--white); }
textarea { width: 100%; height: 120px; background: #000; color: white; border-radius: 12px; padding: 15px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px; }

#notif { position: fixed; bottom: -60px; left: 50%; transform: translateX(-50%); background: var(--accent); color: white; padding: 12px 30px; border-radius: 50px; font-weight: 700; transition: 0.5s; z-index: 3000; }
#notif.active { bottom: 30px; }
