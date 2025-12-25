/* =============================
   FADE-IN ANIMATION
============================== */
document.addEventListener("DOMContentLoaded", () => {
    const fadeEls = document.querySelectorAll(".fade-in");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log("🎬 Fading in:", entry.target.id);
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px -20% 0px"
        });

        setTimeout(() => {
            fadeEls.forEach(el => observer.observe(el));
        }, 300);

        console.log(`✨ Fade-in elements detected: ${fadeEls.length}`);
    } else {
        fadeEls.forEach(el => el.classList.add("visible"));
    }
});

/* =============================
   PLANT QUIZ
============================== */
const plantQuizData = [
    {
        question: "How often should you water a succulent?",
        options: ["Every day", "Every 1-2 weeks", "Every month", "Twice a day"],
        correct: 1
    },
    {
        question: "Which plant is known for purifying air?",
        options: ["Cactus", "Snake Plant", "Venus Flytrap", "Bonsai"],
        correct: 1
    },
    {
        question: "What does yellow leaves usually indicate?",
        options: ["Too much sun", "Overwatering", "Needs fertilizer", "Too cold"],
        correct: 1
    },
    {
        question: "Which plant grows from the top of a pineapple?",
        options: ["Aloe Vera", "Bromeliad", "Pineapple Plant", "Agave"],
        correct: 2
    },
    {
        question: "What's the best light for most indoor plants?",
        options: ["Direct sunlight", "Complete darkness", "Bright indirect light", "UV light"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;

// DOM Elements
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreEl = document.getElementById('score');
const currentQEl = document.getElementById('currentQ');
const resultEl = document.getElementById('quizResult');
const quizBodyEl = document.getElementById('quizBody');
const quizFooterEl = document.getElementById('quizFooter');
const finalScoreEl = document.getElementById('finalScore');
const resultMessageEl = document.getElementById('resultMessage');

// Start Quiz Function (called from HTML button)
function startPlantQuiz() {
    const wrapper = document.getElementById('plantQuizWrapper');
    wrapper.classList.remove('hidden');
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    resetQuiz();
}

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    scoreEl.textContent = score;
    
    quizBodyEl.classList.remove('hidden');
    quizFooterEl.classList.remove('hidden');
    resultEl.classList.add('hidden');
    
    loadQuestion();
}

function loadQuestion() {
    const q = plantQuizData[currentQuestion];
    questionEl.textContent = q.question;
    currentQEl.textContent = currentQuestion + 1;

    optionsEl.innerHTML = '';
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => selectAnswer(index));
        optionsEl.appendChild(btn);
    });

    nextBtn.disabled = true;
}

function selectAnswer(selected) {
    const q = plantQuizData[currentQuestion];
    const buttons = optionsEl.querySelectorAll('.option-btn');

    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === q.correct) {
            btn.classList.add('correct');
        } else if (index === selected) {
            btn.classList.add('wrong');
        }
    });

    if (selected === q.correct) {
        score++;
        scoreEl.textContent = score;
    }

    nextBtn.disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < plantQuizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizBodyEl.classList.add('hidden');
    quizFooterEl.classList.add('hidden');
    resultEl.classList.remove('hidden');

    finalScoreEl.textContent = score;

    if (score === 5) {
        resultMessageEl.textContent = "🌟 Perfect! You're a plant expert!";
    } else if (score >= 3) {
        resultMessageEl.textContent = "🌱 Great job! You know your plants!";
    } else {
        resultMessageEl.textContent = "🌿 Keep learning about plants!";
    }
}

// Event Listeners
if (nextBtn) {
    nextBtn.addEventListener('click', nextQuestion);
}
if (restartBtn) {
    restartBtn.addEventListener('click', resetQuiz);
}

/* =============================
   RECIPE CARDS
============================== */
function flipCard(card) {
    card.classList.toggle('flipped');
}

document.querySelectorAll('.recipe-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            flipCard(card);
        }
    });
});

const recipeBtn = document.getElementById('toggleRecipesBtn');
const recipeWrapper = document.getElementById('recipeWrapper');

if (recipeBtn && recipeWrapper) {
    recipeBtn.addEventListener('click', () => {
        recipeWrapper.classList.toggle('hidden');
        recipeWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

function closeRecipes() {
    document.getElementById('recipeWrapper').classList.add('hidden');
}

/* =============================
   LIGHTBOX
============================== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

if (lightbox && lightboxImg) {
    document.querySelectorAll('.hobby-gallery img').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.remove('hidden');
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.classList.add('hidden');
    });
}