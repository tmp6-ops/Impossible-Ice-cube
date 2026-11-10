/**
 * IMPOSSIBLE ICE CUBE CHALLENGE
 * Game Logic, Audio Synthesizer, 10 Progressively Difficult Challenges & Evaluation System
 */

(function () {
    'use strict';

    // ==========================================
    // AUDIO SYNTHESIZER (Web Audio API)
    // No external mp3 dependencies needed!
    // ==========================================
    class SoundFX {
        constructor() {
            this.ctx = null;
            this.enabled = true;
        }

        init() {
            if (!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playChime(correct = true) {
            if (!this.enabled) return;
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            if (correct) {
                // Happy crystalline sparkle sound
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.1); // G5
                osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.22); // C6

                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

                osc.start(now);
                osc.stop(now + 0.5);
            } else {
                // Sad slush sizzle / buzz
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);

                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

                osc.start(now);
                osc.stop(now + 0.35);
            }
        }

        playCreativeChime() {
            if (!this.enabled) return;
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const notes = [440, 554.37, 659.25, 880]; // A major magic
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);

                gain.gain.setValueAtTime(0.2, now + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.3);
            });
        }

        playPop() {
            if (!this.enabled) return;
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.08);
        }

        playTick() {
            if (!this.enabled) return;
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, now);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.03);
        }

        playVictory() {
            if (!this.enabled) return;
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            melody.forEach((f, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now + i * 0.12);

                gain.gain.setValueAtTime(0.25, now + i * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.4);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + i * 0.12);
                osc.stop(now + i * 0.12 + 0.4);
            });
        }
    }

    const sound = new SoundFX();

    // ==========================================
    // 10 INCREASINGLY DIFFICULT CHALLENGES
    // Each with exact answers, creative answers, and hints
    // ==========================================
    const CHALLENGES = [
        {
            level: 1,
            difficulty: "Level 1: The Warmup",
            prompt: "What is an ice cube's greatest fear in the world?",
            hint: "Think about what turns ice into a puddle or liquid!",
            timeLimit: 30,
            validate: function (input) {
                const clean = input.toLowerCase().trim();
                const correctTerms = ["heat", "fire", "sun", "warmth", "melting", "melt", "hot", "summer", "microwave", "oven", "boiling", "boil", "temperature"];
                const creativeTerms = ["global warming", "hairdryer", "spicy food", "lava", "hot coffee", "sauna", "friction", "hell"];

                if (creativeTerms.some(t => clean.includes(t))) {
                    return {
                        status: "creative",
                        title: "GENIUS ANSWER! ✨",
                        explanation: `"${input}" would make Pip sweat bullets! That's hilariously deadly for an ice cube.`
                    };
                }
                if (correctTerms.some(t => clean.includes(t))) {
                    return {
                        status: "correct",
                        title: "CORRECT! ❄️",
                        explanation: "Spot on! Heat and high temperatures are the mortal enemy of all ice cubes."
                    };
                }
                return {
                    status: "incorrect",
                    title: "NOT QUITE! 💧",
                    explanation: "Think of what causes ice to vanish or liquify. Heat or sunlight!"
                };
            }
        },
        {
            level: 2,
            difficulty: "Level 2: Cold Chemistry",
            prompt: "At what exact temperature does an ice cube begin to melt? (Include units like 0°C or 32°F)",
            hint: "In Celsius it is zero degrees, or 32 in Fahrenheit.",
            timeLimit: 25,
            validate: function (input) {
                const clean = input.toLowerCase().replace(/\s+/g, '');
                if (clean.includes("0c") || clean.includes("0°c") || clean.includes("32f") || clean.includes("32°f") || clean === "0" || clean === "32" || clean.includes("273k") || clean.includes("273.15k")) {
                    return {
                        status: "correct",
                        title: "CORRECT! 🧊",
                        explanation: "0°C (32°F / 273.15 K) is the precise melting point of pure water ice at 1 atm."
                    };
                }
                if (clean.includes("roomtemp") || clean.includes("warm") || clean.includes("positive") || clean.includes(">0")) {
                    return {
                        status: "creative",
                        title: "CREATIVE OBSERVATION! 💡",
                        explanation: "Anything above 0°C will certainly do the job! That is pragmatically correct."
                    };
                }
                return {
                    status: "incorrect",
                    title: "BRRR... WRONG! ❌",
                    explanation: "Remember: 0° Celsius or 32° Fahrenheit is when water freezes or melts!"
                };
            }
        },
        {
            level: 3,
            difficulty: "Level 3: The Float Riddle",
            prompt: "Why does an ice cube float on top of water instead of sinking to the bottom?",
            hint: "It has to do with ice being less heavy per volume (density).",
            timeLimit: 25,
            validate: function (input) {
                const clean = input.toLowerCase().trim();
                const densityWords = ["less dense", "density", "lower density", "lighter", "expands", "hydrogen bond", "buoyant", "buoyancy"];
                const creativeWords = ["it has good vibes", "magic", "trapped air", "swim", "swimming", "it wants to breathe"];

                if (creativeWords.some(w => clean.includes(w))) {
                    return {
                        status: "creative",
                        title: "SUPER CREATIVE! 🌊",
                        explanation: `"${input}" - While water molecules expanding is the scientific cause, we love your imagination!`
                    };
                }
                if (densityWords.some(w => clean.includes(w))) {
                    return {
                        status: "correct",
                        title: "NAILED IT! 🧊",
                        explanation: "Water expands when it freezes, making ice about 9% less dense than liquid water!"
                    };
                }
                return {
                    status: "incorrect",
                    title: "SINKING DOWN! ❌",
                    explanation: "Hint: It is because ice has lower 'density' than liquid water!"
                };
            }
        },
        {
            level: 4,
            difficulty: "Level 4: The Speed Freeze",
            prompt: "What scientific effect states that hot water can sometimes freeze FASTER than cold water?",
            hint: "Named after a Tanzanian high school student who rediscovered it in 1963. Starts with 'M'.",
            timeLimit: 25,
            validate: function (input) {
                const clean = input.toLowerCase().replace(/[^a-z]/g, '');
                if (clean.includes("mpemba") || clean.includes("pemba")) {
                    return {
                        status: "correct",
                        title: "ASTRONOMICAL BRAIN! 🧪",
                        explanation: "The Mpemba Effect! Named after Erasto Mpemba who noticed warm ice cream mix froze faster."
                    };
                }
                if (clean.includes("evaporation") || clean.includes("convection") || clean.includes("thermodynamics") || clean.includes("supercooling")) {
                    return {
                        status: "creative",
                        title: "PHYSICS EXPERT! 🔬",
                        explanation: "You named one of the leading theoretical explanations for the Mpemba Effect!"
                    };
                }
                return {
                    status: "incorrect",
                    title: "FROZEN STIFF! ❌",
                    explanation: "It's the 'Mpemba Effect'!"
                };
            }
        },
        {
            level: 5,
            difficulty: "Level 5: Quick Math in the Freezer",
            prompt: "If 1 ice cube melts in 10 minutes, how many minutes will it take for 5 identical ice cubes in the same sunny spot to melt together?",
            hint: "Think carefully! Do they melt one by one, or all at the exact same time?",
            timeLimit: 20,
            validate: function (input) {
                const clean = input.toLowerCase().trim();
                if (clean === "10" || clean.includes("10 min") || clean.includes("ten") || clean.includes("same time")) {
                    return {
                        status: "correct",
                        title: "CLEVER THINKER! 🧠",
                        explanation: "10 minutes! They all melt simultaneously in parallel under the same heat, not in series!"
                    };
                }
                if (clean.includes("50") || clean.includes("fifty")) {
                    return {
                        status: "incorrect",
                        title: "CLASSIC TRAP! 🪤",
                        explanation: "You fell for the classic multiplier! 5 cubes melt side-by-side at once, so it still takes ~10 minutes!"
                    };
                }
                if (clean.includes("less") || clean.includes("depends") || clean.includes("touching") || clean.includes("pile") || clean.includes("cluster")) {
                    return {
                        status: "creative",
                        title: "OUTSIDE THE BOX! 💡",
                        explanation: "True! If grouped together, their collective cooling could slightly alter the rate. Very sharp!"
                    };
                }
                return {
                    status: "incorrect",
                    title: "NOT QUITE! ❌",
                    explanation: "Hint: Since all 5 are in the sun together, they melt at the same time: 10 minutes!"
                };
            }
        },
        {
            level: 6,
            difficulty: "Level 6: Cold Wordplay Riddle",
            prompt: "I have no flesh, no feathers, no scales, no bone. Yet I have fingers and thumbs of my own. When it gets freezing cold, you put me on. What am I?",
            hint: "Something you wear on your hands during snowy winter.",
            timeLimit: 20,
            validate: function (input) {
                const clean = input.toLowerCase().trim();
                if (clean.includes("glove") || clean.includes("mitten")) {
                    return {
                        status: "correct",
                        title: "RIDDLE SOLVED! 🧤",
                        explanation: "A glove! It keeps your fingers toasty when handling icy cubes."
                    };
                }
                if (clean.includes("pocket") || clean.includes("sock") || clean.includes("hand warmer")) {
                    return {
                        status: "creative",
                        title: "VERY RESOURCEFUL! 🧦",
                        explanation: "Good alternative hand-warmer, though gloves have the actual fingers and thumbs!"
                    };
                }
                return {
                    status: "incorrect",
                    title: "FROSTBITE! ❌",
                    explanation: "What has fingers and thumbs and keeps hands warm? A glove!"
                };
            }
        },
        {
            level: 7,
            difficulty: "Level 7: The Coolest Word Challenge",
            prompt: "Type a single word that starts with 'ICE' and has at least 7 letters. (e.g., ICEBERG)",
            hint: "Try words like ICEBOUND, ICEBREAKER, ICESKATING, ICECAP...",
            timeLimit: 20,
            validate: function (input) {
                const clean = input.toUpperCase().trim();
                const validList = [
                    "ICEBERG", "ICEBERGS", "ICEBOUND", "ICEBREAKER", "ICEBREAKERS",
                    "ICECAP", "ICECAPS", "ICECREAM", "ICEFIELD", "ICEFIELDS",
                    "ICEHOUSE", "ICEHOUSES", "ICEMAKER", "ICEMAKERS", "ICESKATE",
                    "ICESKATER", "ICESKATERS", "ICESKATING", "ICESTORM", "ICESTORMS",
                    "ICEWATER", "ICICLE", "ICINESS"
                ];

                if (clean.startsWith("ICE") && clean.length >= 7) {
                    return {
                        status: "correct",
                        title: "CHILLING VOCABULARY! 📖",
                        explanation: `"${clean}" is a fantastic ${clean.length}-letter icy word! Pip is impressed.`
                    };
                }
                if (clean.length < 7 && clean.startsWith("ICE")) {
                    return {
                        status: "incorrect",
                        title: "TOO SHORT! 📏",
                        explanation: `"${clean}" only has ${clean.length} letters. We asked for at least 7 letters!`
                    };
                }
                if (clean.includes("FROZEN") || clean.includes("GLACIER") || clean.includes("BLIZZARD")) {
                    return {
                        status: "creative",
                        title: "CHILLY BUT RULE BROKEN! ❄️",
                        explanation: `"${clean}" is very cold, but it must start with the literal letters "ICE"!`
                    };
                }
                return {
                    status: "incorrect",
                    title: "MELTED WORD! ❌",
                    explanation: "It must begin with 'ICE' and have at least 7 letters (like ICEBERG or ICEBREAKER)."
                };
            }
        },
        {
            level: 8,
            difficulty: "Level 8: The Bartender's Paradox",
            prompt: "Why is an ice cube in a high-end cocktail crystal clear, while home freezer ice cubes are cloudy and white inside?",
            hint: "What gets trapped in home ice as it freezes too fast from all sides? (Gas/Air/Minerals)",
            timeLimit: 25,
            validate: function (input) {
                const clean = input.toLowerCase().trim();
                const trappedAir = ["air", "bubbles", "oxygen", "gas", "minerals", "impurities", "freezes from outside", "directional", "speed", "fast"];
                const creativeWords = ["magic", "love", "distilled", "boiled water", "pure water", "cloud", "filtered"];

                if (clean.includes("air") || clean.includes("bubble") || clean.includes("impurity") || clean.includes("mineral") || clean.includes("direction")) {
                    return {
                        status: "correct",
                        title: "CONNOISSEUR LEVEL! 🍸",
                        explanation: "Home ice freezes rapidly from all sides, trapping microscopic air bubbles & minerals in the center! Cocktail ice freezes directionally and slowly."
                    };
                }
                if (creativeWords.some(c => clean.includes(c))) {
                    return {
                        status: "creative",
                        title: "CREATIVE MIXOLOGIST! 🧊",
                        explanation: "Using boiled or distilled water helps reduce dissolved gases, giving clearer ice!"
                    };
                }
                return {
                    status: "incorrect",
                    title: "CLOUDY GUESS! ❌",
                    explanation: "It's because trapped air bubbles and dissolved gases get pushed into the center as it freezes!"
                };
            }
        },
        {
            level: 9,
            difficulty: "Level 9: The Impossible Glass Paradox",
            prompt: "A glass is filled to the absolute brim with water, and an ice cube is floating in it. When the ice cube completely melts, will the water OVERFLOW, DECREASE, or stay the SAME?",
            hint: "Recall Archimedes' principle: floating objects displace their exact weight in water.",
            timeLimit: 25,
            validate: function (input) {
                const clean = input.toLowerCase().trim();
                if (clean.includes("same") || clean.includes("remain") || clean.includes("equal") || clean.includes("neither")) {
                    return {
                        status: "correct",
                        title: "ARCHIMEDES GENIUS! ⚖️",
                        explanation: "Stay the SAME! The ice cube displaces a volume of water equal to its own melted mass!"
                    };
                }
                if (clean.includes("decrease") || clean.includes("less") || clean.includes("lower") || clean.includes("evaporat")) {
                    return {
                        status: "creative",
                        title: "CLEVER PHYSICIST ANGLE! 🔬",
                        explanation: "If you account for evaporation or slight thermal contraction of water near 4°C, you could argue a tiny decrease! Accepted for depth!"
                    };
                }
                if (clean.includes("overflow") || clean.includes("spill") || clean.includes("over")) {
                    return {
                        status: "incorrect",
                        title: "PHYSICS COUNTER-INTUITIVE! ❌",
                        explanation: "It will NOT overflow! Ice expands when frozen, so when it melts back to liquid, it fits perfectly into the exact volume it was displacing!"
                    };
                }
                return {
                    status: "incorrect",
                    title: "TRY AGAIN! ❌",
                    explanation: "Choose between: OVERFLOW, DECREASE, or STAY THE SAME."
                };
            }
        },
        {
            level: 10,
            difficulty: "Level 10: The Ultimate Impossible Ice Master",
            prompt: "Pip the Ice Cube wants to survive for 100 years. Give Pip one foolproof, scientific, or wonderfully creative survival plan!",
            hint: "Where in the universe or on Earth is it so cold that ice NEVER melts?",
            timeLimit: 30,
            validate: function (input) {
                const clean = input.toLowerCase().trim();
                if (clean.length < 3) {
                    return {
                        status: "incorrect",
                        title: "TOO BRIEF! ❌",
                        explanation: "Pip needs a real plan to survive for a century!"
                    };
                }

                const scienceCold = ["space", "deep space", "moon", "pluto", "antarctica", "south pole", "liquid nitrogen", "cryogenic", "glacier", "freezer", "sub zero", "vacuum", "neptune", "comet"];
                const creativeSurvival = ["eat", "drink", "freeze time", "stasis", "become vapor", "thermos", "ice age", "hibernate", "cryosleep", "igloo", "refreeze", "don't melt"];

                if (scienceCold.some(s => clean.includes(s))) {
                    return {
                        status: "correct",
                        title: "UNSTOPPABLE MASTER SURVIVOR! 🌌",
                        explanation: `"${input}" - Outstanding! Storing Pip in deep space or cryogenic nitrogen keeps him frozen for eternity!`
                    };
                }

                // Any thoughtful answer gets creative bonus on final challenge!
                return {
                    status: "creative",
                    title: "BRILLIANT CREATIVE PLAN! 🌟",
                    explanation: `"${input}" - A unique plan for Pip! Pip gives your creative survival strategy a standing frozen ovation!`
                };
            }
        }
    ];

    // ==========================================
    // GAME STATE
    // ==========================================
    const state = {
        currentLevelIndex: 0,
        score: 0,
        creativeCount: 0,
        hintsLeft: 3,
        timeRemaining: 30,
        timerInterval: null,
        totalGameSeconds: 0,
        totalTimerInterval: null,
        answeredCorrectly: false,
        pokeCount: 0
    };

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const levelIndicator = document.getElementById('levelIndicator');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerBox = document.getElementById('timerBox');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const progressBarFill = document.getElementById('progressBarFill');
    const levelNodes = document.getElementById('levelNodes');

    const iceCube = document.getElementById('iceCube');
    const cubeWrapper = document.getElementById('cubeWrapper');
    const cubeFace = document.querySelector('.cube-face');
    const cubeStatusTag = document.getElementById('cubeStatusTag');
    const moodEmoji = document.getElementById('moodEmoji');
    const moodText = document.getElementById('moodText');
    const sweatDrop = document.getElementById('sweatDrop');
    const freezeFrost = document.getElementById('freezeFrost');
    const dripsContainer = document.getElementById('dripsContainer');
    const frostParticles = document.getElementById('frostParticles');
    const snowContainer = document.getElementById('snowContainer');

    const difficultyTag = document.getElementById('difficultyTag');
    const hurryWarning = document.getElementById('hurryWarning');
    const challengePrompt = document.getElementById('challengePrompt');
    const challengeHint = document.getElementById('challengeHint');
    const answerForm = document.getElementById('answerForm');
    const answerInput = document.getElementById('answerInput');
    const clearInputBtn = document.getElementById('clearInputBtn');
    const hintBtn = document.getElementById('hintBtn');
    const hintCount = document.getElementById('hintCount');
    const submitBtn = document.getElementById('submitBtn');
    const nextBtn = document.getElementById('nextBtn');
    const extraActions = document.getElementById('extraActions');

    const verdictBanner = document.getElementById('verdictBanner');
    const verdictIcon = document.getElementById('verdictIcon');
    const verdictBadge = document.getElementById('verdictBadge');
    const verdictExplanation = document.getElementById('verdictExplanation');

    const victoryModal = document.getElementById('victoryModal');
    const finalScoreVal = document.getElementById('finalScoreVal');
    const creativeCountVal = document.getElementById('creativeCountVal');
    const totalTimeVal = document.getElementById('totalTimeVal');
    const playAgainBtn = document.getElementById('playAgainBtn');

    const timeoutModal = document.getElementById('timeoutModal');
    const retryLevelBtn = document.getElementById('retryLevelBtn');
    const restartGameBtn = document.getElementById('restartGameBtn');

    // ==========================================
    // SNOWFLAKE BACKGROUND GENERATOR
    // ==========================================
    function initSnowflakes() {
        const flakeChars = ['❄', '❅', '❆', '•', '💧'];
        const maxFlakes = 22;

        for (let i = 0; i < maxFlakes; i++) {
            createSnowflake(flakeChars);
        }
    }

    function createSnowflake(flakeChars) {
        const flake = document.createElement('div');
        flake.className = 'falling-flake';
        flake.textContent = flakeChars[Math.floor(Math.random() * flakeChars.length)];
        flake.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 14 + 10;
        flake.style.fontSize = size + 'px';
        const duration = Math.random() * 8 + 6;
        flake.style.animationDuration = duration + 's';
        flake.style.animationDelay = Math.random() * 5 + 's';
        flake.style.opacity = (Math.random() * 0.6 + 0.3).toString();

        snowContainer.appendChild(flake);

        flake.addEventListener('animationiteration', () => {
            flake.style.left = Math.random() * 100 + 'vw';
        });
    }

    // ==========================================
    // LEVEL PROGRESS NODES
    // ==========================================
    function setupProgressNodes() {
        levelNodes.innerHTML = '';
        for (let i = 0; i < CHALLENGES.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'node-dot';
            dot.id = `node-${i}`;
            levelNodes.appendChild(dot);
        }
        updateProgressTracker();
    }

    function updateProgressTracker() {
        const total = CHALLENGES.length;
        const current = state.currentLevelIndex;
        const percent = ((current) / (total - 1)) * 100;
        progressBarFill.style.width = Math.max(10, percent) + '%';

        for (let i = 0; i < total; i++) {
            const dot = document.getElementById(`node-${i}`);
            if (!dot) continue;
            dot.classList.remove('completed', 'current');
            if (i < current) {
                dot.classList.add('completed');
            } else if (i === current) {
                dot.classList.add('current');
            }
        }
    }

    // ==========================================
    // LOAD & DISPLAY CHALLENGE
    // ==========================================
    function loadLevel(index) {
        if (index >= CHALLENGES.length) {
            triggerVictory();
            return;
        }

        const challenge = CHALLENGES[index];
        state.currentLevelIndex = index;
        state.answeredCorrectly = false;
        state.timeRemaining = challenge.timeLimit;

        // UI Reset
        levelIndicator.textContent = `${challenge.level} / ${CHALLENGES.length}`;
        difficultyTag.textContent = challenge.difficulty;
        challengePrompt.textContent = challenge.prompt;
        challengeHint.textContent = `💡 Hint available if you get stuck.`;
        challengeHint.classList.add('hidden');

        answerInput.value = '';
        answerInput.disabled = false;
        answerInput.focus();

        submitBtn.classList.remove('hidden');
        submitBtn.disabled = false;
        nextBtn.classList.add('hidden');
        verdictBanner.classList.add('hidden');
        hurryWarning.classList.add('hidden');
        timerBox.classList.remove('urgent');

        // Cube Expression Reset
        setCubeMood('normal');
        updateProgressTracker();

        // Extra Action shortcuts for specific levels (e.g. Level 9 choices)
        renderExtraLevelButtons(challenge);

        // Start Countdown Timer
        startLevelTimer();
    }

    function renderExtraLevelButtons(challenge) {
        extraActions.innerHTML = '';
        if (challenge.level === 9) {
            extraActions.classList.remove('hidden');
            const options = ["STAY THE SAME", "OVERFLOW", "DECREASE"];
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'mini-choice-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => {
                    answerInput.value = opt;
                    submitAnswer();
                });
                extraActions.appendChild(btn);
            });
        } else if (challenge.level === 5) {
            extraActions.classList.remove('hidden');
            const options = ["10 minutes", "50 minutes", "2 minutes"];
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'mini-choice-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => {
                    answerInput.value = opt;
                    submitAnswer();
                });
                extraActions.appendChild(btn);
            });
        } else {
            extraActions.classList.add('hidden');
        }
    }

    // ==========================================
    // COUNTDOWN TIMER SYSTEM
    // ==========================================
    function startLevelTimer() {
        clearInterval(state.timerInterval);
        updateTimerDisplay();

        state.timerInterval = setInterval(() => {
            state.timeRemaining--;
            updateTimerDisplay();

            if (state.timeRemaining <= 7 && state.timeRemaining > 0) {
                sound.playTick();
                timerBox.classList.add('urgent');
                hurryWarning.classList.remove('hidden');
                setCubeMood('sweating');
                spawnMeltDrip();
            }

            if (state.timeRemaining <= 0) {
                clearInterval(state.timerInterval);
                handleTimeOut();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = `${state.timeRemaining}s`;
    }

    function handleTimeOut() {
        sound.playChime(false);
        setCubeMood('melted');
        timeoutModal.classList.remove('hidden');
    }

    // ==========================================
    // CUBE MOODS & EXPRESSIONS
    // ==========================================
    function setCubeMood(mood) {
        cubeFace.className = 'cube-face';
        iceCube.classList.remove('happy', 'shivering', 'melted');
        sweatDrop.classList.remove('visible');
        freezeFrost.classList.remove('visible');

        switch (mood) {
            case 'happy':
                cubeFace.classList.add('happy-face');
                iceCube.classList.add('happy');
                freezeFrost.classList.add('visible');
                moodEmoji.textContent = '🥳';
                moodText.textContent = 'Pip is super thrilled & frozen solid!';
                break;
            case 'creative':
                cubeFace.classList.add('happy-face');
                iceCube.classList.add('happy');
                freezeFrost.classList.add('visible');
                moodEmoji.textContent = '🌟';
                moodText.textContent = 'Pip is amazed by your clever genius!';
                break;
            case 'confused':
                cubeFace.classList.add('confused-face');
                moodEmoji.textContent = '🤔';
                moodText.textContent = 'Pip is scratching his frosty head...';
                break;
            case 'sad':
                cubeFace.classList.add('sad-face');
                iceCube.classList.add('shivering');
                sweatDrop.classList.add('visible');
                moodEmoji.textContent = '😰';
                moodText.textContent = 'Pip is warming up! Give him a better answer!';
                break;
            case 'sweating':
                cubeFace.classList.add('surprised');
                iceCube.classList.add('shivering');
                sweatDrop.classList.add('visible');
                moodEmoji.textContent = '🔥';
                moodText.textContent = 'HURRY! Pip is sweating and about to melt!';
                break;
            case 'melted':
                cubeFace.classList.add('sad-face');
                iceCube.classList.add('melted');
                moodEmoji.textContent = '🫠';
                moodText.textContent = 'Pip has completely liquified into a warm puddle!';
                break;
            case 'poked':
                cubeFace.classList.add('surprised');
                moodEmoji.textContent = '😆';
                moodText.textContent = 'Brrr! Stop tickling my ice facets!';
                break;
            default:
                moodEmoji.textContent = '🧊';
                moodText.textContent = 'Pip is chill and ready for your answer!';
                break;
        }
    }

    function spawnMeltDrip() {
        const drip = document.createElement('div');
        drip.className = 'melt-droplet';
        const size = Math.random() * 6 + 4;
        drip.style.width = size + 'px';
        drip.style.height = size + 'px';
        drip.style.left = (Math.random() * 80 + 10) + 'px';
        dripsContainer.appendChild(drip);

        setTimeout(() => {
            drip.remove();
        }, 1400);
    }

    // ==========================================
    // ANSWER EVALUATION & FEEDBACK
    // ==========================================
    function submitAnswer() {
        const inputVal = answerInput.value.trim();
        if (!inputVal) {
            answerInput.focus();
            shakeElement(answerInput);
            return;
        }

        const currentChallenge = CHALLENGES[state.currentLevelIndex];
        const verdict = currentChallenge.validate(inputVal);

        // Display verdict banner
        verdictBanner.className = `verdict-banner ${verdict.status}`;
        verdictBanner.classList.remove('hidden');
        verdictBadge.textContent = verdict.title;
        verdictExplanation.textContent = verdict.explanation;

        if (verdict.status === 'correct') {
            sound.playChime(true);
            setCubeMood('happy');
            state.score += 100 + (state.timeRemaining * 5);
            scoreDisplay.textContent = `${state.score} pts`;
            clearInterval(state.timerInterval);

            // Lock input, show next button
            answerInput.disabled = true;
            submitBtn.classList.add('hidden');
            nextBtn.classList.remove('hidden');
            nextBtn.focus();

        } else if (verdict.status === 'creative') {
            sound.playCreativeChime();
            setCubeMood('creative');
            state.creativeCount++;
            state.score += 150 + (state.timeRemaining * 8); // Extra reward for creativity
            scoreDisplay.textContent = `${state.score} pts`;
            clearInterval(state.timerInterval);

            // Lock input, show next button
            answerInput.disabled = true;
            submitBtn.classList.add('hidden');
            nextBtn.classList.remove('hidden');
            nextBtn.focus();

        } else {
            // Incorrect
            sound.playChime(false);
            setCubeMood('sad');
            shakeElement(verdictBanner);
            spawnMeltDrip();
        }
    }

    function shakeElement(el) {
        el.style.transform = 'translateX(-8px)';
        setTimeout(() => { el.style.transform = 'translateX(8px)'; }, 80);
        setTimeout(() => { el.style.transform = 'translateX(-6px)'; }, 160);
        setTimeout(() => { el.style.transform = 'translateX(6px)'; }, 240);
        setTimeout(() => { el.style.transform = 'translateX(0)'; }, 320);
    }

    // ==========================================
    // NEXT LEVEL / VICTORY
    // ==========================================
    function nextLevel() {
        sound.playPop();
        state.currentLevelIndex++;
        loadLevel(state.currentLevelIndex);
    }

    function triggerVictory() {
        clearInterval(state.timerInterval);
        clearInterval(state.totalTimerInterval);
        sound.playVictory();

        finalScoreVal.textContent = state.score;
        creativeCountVal.textContent = state.creativeCount;
        totalTimeVal.textContent = `${state.totalGameSeconds}s`;

        victoryModal.classList.remove('hidden');
    }

    function restartFullGame() {
        state.currentLevelIndex = 0;
        state.score = 0;
        state.creativeCount = 0;
        state.hintsLeft = 3;
        state.totalGameSeconds = 0;
        scoreDisplay.textContent = '0 pts';
        hintCount.textContent = '3';

        victoryModal.classList.add('hidden');
        timeoutModal.classList.add('hidden');

        clearInterval(state.totalTimerInterval);
        state.totalTimerInterval = setInterval(() => {
            state.totalGameSeconds++;
        }, 1000);

        setupProgressNodes();
        loadLevel(0);
    }

    // ==========================================
    // INTERACTION & LISTENERS
    // ==========================================
    answerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (nextBtn.classList.contains('hidden')) {
            submitAnswer();
        } else {
            nextLevel();
        }
    });

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        submitAnswer();
    });

    nextBtn.addEventListener('click', () => {
        nextLevel();
    });

    clearInputBtn.addEventListener('click', () => {
        answerInput.value = '';
        answerInput.focus();
    });

    hintBtn.addEventListener('click', () => {
        sound.playPop();
        if (state.hintsLeft > 0) {
            challengeHint.classList.remove('hidden');
            challengeHint.textContent = `💡 Hint: ${CHALLENGES[state.currentLevelIndex].hint}`;
            state.hintsLeft--;
            hintCount.textContent = state.hintsLeft;
            setCubeMood('confused');
        } else {
            challengeHint.classList.remove('hidden');
            challengeHint.textContent = `🚫 No hints left! Trust your icy intuition.`;
        }
    });

    // Poke the Ice Cube for fun animation!
    cubeWrapper.addEventListener('click', () => {
        sound.playPop();
        state.pokeCount++;
        setCubeMood('poked');
        setTimeout(() => {
            if (!nextBtn.classList.contains('hidden')) {
                setCubeMood('happy');
            } else {
                setCubeMood('normal');
            }
        }, 900);
    });

    // Sound toggle
    soundToggleBtn.addEventListener('click', () => {
        sound.enabled = !sound.enabled;
        soundToggleBtn.textContent = sound.enabled ? '🔊' : '🔇';
        soundToggleBtn.title = sound.enabled ? 'Mute Sound' : 'Enable Sound';
        if (sound.enabled) sound.playPop();
    });

    // Modals
    playAgainBtn.addEventListener('click', () => {
        sound.playPop();
        restartFullGame();
    });

    retryLevelBtn.addEventListener('click', () => {
        sound.playPop();
        timeoutModal.classList.add('hidden');
        loadLevel(state.currentLevelIndex);
    });

    restartGameBtn.addEventListener('click', () => {
        sound.playPop();
        restartFullGame();
    });

    // Global Key shortcuts
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !nextBtn.classList.contains('hidden')) {
            nextLevel();
        }
    });

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        initSnowflakes();
        setupProgressNodes();

        state.totalTimerInterval = setInterval(() => {
            state.totalGameSeconds++;
        }, 1000);

        loadLevel(0);
    }

    window.addEventListener('DOMContentLoaded', init);

})();
