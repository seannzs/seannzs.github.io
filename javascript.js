let currentType = "";
const webhook = "https://discord.com/api/webhooks/1501586415941582918/ALwCGRA0veR8KS-Lrix7Gdeky7gPagBN_ViHmU-R4O0HKFLPUIT5jbGir0SEm9N1tm8j";

// Animasi GSAP saat load awal
window.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline();
    tl.from(".sidebar", { duration: 1, x: -100, opacity: 0, ease: "expo.out" })
      .from(".hero-card", { duration: 1.2, y: 50, opacity: 0, ease: "power4.out" }, "-=0.5")
      .from(".nav-links li", { duration: 0.4, x: -30, opacity: 0, stagger: 0.1 }, "-=0.8")
      .from(".right-panel", { duration: 1, x: 100, opacity: 0, ease: "expo.out" }, "-=1");
});

// Fitur Upload Media
document.getElementById('uploadInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const grid = document.getElementById('memberGallery');
        const container = document.createElement('div');
        container.className = 'g-item';

        if (file.type.startsWith('image/')) {
            container.innerHTML = `<img src="${event.target.result}">`;
        } else {
            container.innerHTML = `<video src="${event.target.result}" controls></video>`;
        }

        grid.prepend(container);
        gsap.from(container, { scale: 0.5, opacity: 0, duration: 0.6, ease: "back.out" });
        
        // Update Counter
        const counter = document.getElementById('galleryCount');
        counter.innerText = parseInt(counter.innerText) + 1;
        
        showToast("Media berhasil ditambahkan!");
    };
    reader.readAsDataURL(file);
});

// Modal Control
function openModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = "block";
    gsap.from(".modal-box", { y: -50, opacity: 0, duration: 0.4 });
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

function setFeedbackType(type, btn) {
    currentType = type;
    document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Kirim ke Discord
async function sendToDiscord() {
    const text = document.getElementById('feedbackText').value;
    if (!currentType || !text.trim()) return showToast("Isi kategori & pesan!");

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = "Mengirim...";

    try {
        await fetch(webhook, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                embeds: [{
                    title: `Feedback: ${currentType}`,
                    description: text,
                    color: currentType === "Kritik" ? 15548997 : 5763719,
                    footer: { text: "Echo Lounge Hub System" },
                    timestamp: new Date()
                }]
            })
        });
        showToast("Pesan dikirim! 🚀");
        document.getElementById('feedbackText').value = "";
        closeModal('feedbackModal');
    } catch {
        showToast("Gagal mengirim pesan.");
    }
    btn.disabled = false;
    btn.innerText = "KIRIM PESAN";
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.add('active');
    setTimeout(() => t.classList.remove('active'), 3000);
        }
