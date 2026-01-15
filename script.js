// --- Configuration ---
const CHAOS_LEVEL = 1; // Scale of 0-1 for probabilities if needed
const PARTY_EMOJIS = ['🎉', '🎂', '🎈', '🎁', '🍰', '🕯️', '🤡'];
// Expanded color palette
const DOT_COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff4500', '#8a2be2', '#7fff00', '#d2691e', '#0f0e0fff'];
const MESSAGES = [
    "Happy Birthday!",
    "You're how old?",
    "Another year closer to death!",
    "Broth-ER?",
    "Surprise!",
    "Adrew? Who's Adrew?",
    "Error 404: Youth not found",
    "Have a great day!",
    "Chaos aligns for you today",
    "Click more dots!",
    "Is this annoying yet?",
    "Best wishes!",
    "BIRTHDAYYYYYY",
];

// --- Elements ---
const landingView = document.getElementById('landing-view');
const dotsView = document.getElementById('dots-view');
const banner = document.getElementById('chaos-banner');
const dotsGrid = document.getElementById('dots-grid');
const modal = document.getElementById('popup-modal');
const modalText = document.getElementById('modal-text');
const closeBtn = document.querySelector('.close-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const audio = document.getElementById('party-horn');

// --- State ---
let isDotsViewActive = false;

// --- Initialization ---
init();

function init() {
    setupBanner();
    setupDots();
    setupModal();
    setupGlobalChaos();
}

// --- Global Chaos ---
function setupGlobalChaos() {
    // Cursor Trail
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.8) { // Don't spawn on every frame, too heavy
            createCursorParticle(e.clientX, e.clientY);
        }
    });

    // Sound Board & Fake Loading (on click)
    document.addEventListener('click', () => {
        playSound();
        triggerFakeLoading();
    });
}

function createCursorParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('cursor-particle');
    particle.innerText = PARTY_EMOJIS[Math.floor(Math.random() * PARTY_EMOJIS.length)];
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1000);
}

function playSound() {
    // Create new Audio object each time to avoid concurrency issues with single element
    const sound = new Audio('https://gfxsounds.com/wp-content/uploads/2021/06/Party-horn.mp3');
    sound.volume = 0.1;
    sound.playbackRate = 0.5 + Math.random() * 1.5;
    sound.play().catch(e => {
        // console.log("Audio blocked", e);
    });
}

function triggerFakeLoading() {
    // 1 in 20 chance to trigger fake loading
    if (Math.random() < 0.10) {
        loadingOverlay.classList.remove('hidden');
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 500 + Math.random() * 1000); // 0.5s to 1.5s delay
    }
}

// --- Banner Logic ---
function setupBanner() {
    // Runaway logic - Aggressive
    banner.addEventListener('mouseover', () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Move across the entire screen
        // Using large ranges: -80% to +80% of viewport
        const xMove = (Math.random() - 0.5) * viewportWidth * 1.6;
        const yMove = (Math.random() - 0.5) * viewportHeight * 1.6;

        // Sometimes rotate the entire banner container nicely too
        const rotate = (Math.random() - 0.5) * 360;

        banner.style.transition = 'transform 0.2s cubic-bezier(0.1, 0.7, 1.0, 0.1)';
        banner.style.transform = `translate(${xMove}px, ${yMove}px) rotate(${rotate}deg)`;

        // Reset after a delay
        setTimeout(() => {
            banner.style.transition = 'transform 0.8s ease-out';
            // 30% chance to return to center
            if (Math.random() < 0.3) {
                banner.style.transform = 'translate(0, 0) rotate(0deg)';
            }
        }, 1200);
    });

    banner.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent global click handlers if needed
        playSound();
        transitionToDots();
    });
}

function transitionToDots() {
    landingView.classList.add('hidden');
    dotsView.classList.remove('hidden');
    isDotsViewActive = true;
    document.body.style.overflowY = 'auto'; // Enable scrolling for dots
}

// --- Dots Logic ---
function setupDots() {
    // Fill the screen with dots. 
    // Calculation: (Screen Width * Screen Height) / (Dot Size ^ 2) * Density Factor
    // Or just a fixed large number for chaos. Let's do fixed large number for standard "covered" feel.
    const dotCount = 500;

    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.innerText = "Happy Birthday";

        // Random styling
        const bg = DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)];
        dot.style.backgroundColor = bg;
        // Contrast text color
        dot.style.color = bg === '#ffffff' || bg === '#ffff00' || bg === '#00ffff' ? '#000' : '#fff';

        // Random tilt
        const rot = (Math.random() - 0.5) * 40; // -20 to 20 deg
        dot.style.transform = `rotate(${rot}deg)`;

        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal();
        });

        dotsGrid.appendChild(dot);
    }
}

// --- Modal Logic ---
let totalClicks = 0;
// CHEAT MODE FOR VERIFICATION
const COUNTDOWN_START = 34;
const COUNTUP_MID = 6;
const COUNTUP_MAX = 7; // Short countup

function setupModal() {
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function openModal() {
    totalClicks++;

    // Scale modal up slightly with each click
    const scale = 1 + (totalClicks * 0.02); // linear growth
    document.querySelector('.modal-content').style.transform = `scale(${scale})`; // Only this instance

    const countdownNumberEl = document.getElementById('countdown-number');
    countdownNumberEl.style.display = 'block';

    // Position randomizer for the number
    const rX = Math.floor(Math.random() * 80) + 10; // 10% to 90%
    const rY = Math.floor(Math.random() * 80) + 10;
    countdownNumberEl.style.left = `${rX}%`;
    countdownNumberEl.style.top = `${rY}%`;
    countdownNumberEl.style.transform = `rotate(${Math.random() * 40 - 20}deg)`; // Jitter rotation

    // Phase 1: Countdown 57 -> 0
    if (totalClicks <= COUNTDOWN_START) {
        const remaining = COUNTDOWN_START - totalClicks + 1; // 57 on 1st click
        const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        modalText.innerHTML = randomMsg;
        countdownNumberEl.innerText = remaining;
    }
    // Phase 2: Countup 1 -> 27
    else if (totalClicks <= COUNTDOWN_START + COUNTUP_MAX) {
        const currentCount = totalClicks - COUNTDOWN_START;
        modalText.innerHTML = "Enjoy your Spotify!<br>Keep clicking!";
        countdownNumberEl.innerText = currentCount;
    }
    // Phase 2: Countup 1 -> 27
    else if (totalClicks <= COUNTDOWN_START + COUNTUP_MAX + COUNTUP_MID) {
        const currentCount = totalClicks - COUNTDOWN_START;
        modalText.innerHTML = "Enjoy your Spotify!<br>Keep clicking!<br>Seriously keep clicking...";
        countdownNumberEl.innerText = currentCount;
    }
    // Phase 3: Final Surprise
    else {
        triggerFinalSurprise();
        return; // Don't show regular modal
    }

    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

function triggerFinalSurprise() {
    modal.classList.add('hidden'); // Close regular
    const finalModal = document.getElementById('final-modal');
    finalModal.classList.remove('hidden');
    spawnBalloons();
}

function spawnBalloons() {
    const container = document.querySelector('.balloons-container');
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

    // Spawn a bunch
    setInterval(() => {
        const b = document.createElement('div');
        b.classList.add('balloon');
        b.style.left = Math.random() * 100 + '%';
        b.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        b.style.animationDuration = (2 + Math.random() * 2) + 's';
        container.appendChild(b);

        setTimeout(() => b.remove(), 4000);
    }, 200);
}
