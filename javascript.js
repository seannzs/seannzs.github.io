// Animasi Masuk dengan GSAP
window.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline();

    // Munculkan Sidebar
    tl.from(".sidebar", { duration: 1, x: -100, opacity: 0, ease: "expo.out" });
    
    // Munculkan Hero Card
    tl.from(".hero-card", { duration: 1.2, y: 50, opacity: 0, ease: "power4.out" }, "-=0.5");

    // Munculkan Menu Items satu per satu
    tl.from(".nav-links li", { 
        duration: 0.5, 
        x: -20, 
        opacity: 0, 
        stagger: 0.05, 
        ease: "power2.out" 
    }, "-=0.8");

    // Munculkan Features Grid
    tl.from(".f-card", { 
        duration: 0.8, 
        scale: 0.9, 
        opacity: 0, 
        stagger: 0.1, 
        ease: "back.out(1.7)" 
    }, "-=0.5");

    // Munculkan Right Sidebar
    tl.from(".right-sidebar", { duration: 1, x: 100, opacity: 0, ease: "expo.out" }, "-=1");
});

// Interaksi Hover pada Tombol
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, duration: 0.2 });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.2 });
    });
});
