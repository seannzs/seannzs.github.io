let fbType = "";
const webhook = "https://discord.com/api/webhooks/1501586415941582918/ALwCGRA0veR8KS-Lrix7Gdeky7gPagBN_ViHmU-R4O0HKFLPUIT5jbGir0SEm9N1tm8j";

// Fungsi Toggle Sidebar HP
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Animasi Masuk GSAP
window.addEventListener('DOMContentLoaded', () => {
    gsap.from(".hero-card", { duration: 1, y: 30, opacity: 0, ease: "power3.out" });
    gsap.from(".g-item", { duration: 0.8, scale: 0.8, opacity: 0, stagger: 0.1, ease: "back.out(1.7)" });
    gsap.from(".sidebar", { duration: 1, x: -100, opacity: 0, ease: "expo.out" });
});

// Fitur Upload Media
document.getElementById('uploadInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const grid = document.getElementById('memberGallery');
        const div = document.createElement('div');
        div.className = 'g-item';
        div.innerHTML = `<img src="${event.target.result}">`;
        grid.prepend(div);
        gsap.from(div, { scale: 0, opacity: 0, duration: 0.5 });
        showToast("Media berhasil diupload!");
    };
    reader.readAsDataURL(file);
});

// Logic Modal & Discord
function openModal(id) { document.getElementById(id).style.display = "block"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }
function setFeedbackType(type, btn) {
    fbType = type;
    document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

async function sendToDiscord() {
    const text = document.getElementById('feedbackText').value;
    if (!fbType || !text.trim()) return alert("Lengkapi data!");

    try {
        await fetch(webhook, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                embeds: [{ title: fbType, description: text, color: 6518771 }]
            })
        });
        showToast("Terkirim ke Discord!");
        closeModal('feedbackModal');
    } catch (err) { alert("Gagal kirim."); }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.add('active');
    setTimeout(() => t.classList.remove('active'), 3000);
    }
