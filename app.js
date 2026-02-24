// State Management for User Responses
const state = {
    symptom: null,
    duration: null,
    pain: 5,
    medication: null,
    conditions: null,
    shortnessOfBreath: null,
    currentScreenIndex: 0
};

// Flow screens ordered exactly as they appear in the flow
const screens = [
    'screen-expectation',
    'screen-q1',
    'screen-q2',
    'screen-q3',
    'screen-q4',
    'screen-q5',
    'screen-q6',
    'screen-result'
];

/**
 * Navigation Tabs Initialization
 */
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab
        button.classList.add('active');
        const targetId = button.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

/**
 * Screen Transition Logic
 */
function showScreen(screenId) {
    // Hide all flow screens
    document.querySelectorAll('.flow-screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.remove('drop-in');
    });
    
    // Show target screen
    const target = document.getElementById(screenId);
    if(target) {
        target.classList.add('active');
        // Small delay to trigger smooth drop-in animation
        setTimeout(() => {
            target.classList.add('drop-in');
        }, 50);
    }
}

function nextScreen() {
    state.currentScreenIndex++;
    if(state.currentScreenIndex < screens.length) {
        showScreen(screens[state.currentScreenIndex]);
        // If it's the result screen, compute outcomes immediately
        if (screens[state.currentScreenIndex] === 'screen-result') {
            generateAssessment();
        }
    }
}

/**
 * Question Handlers
 */
function startTriage() {
    nextScreen();
}

function answerQ1(symptom) {
    state.symptom = symptom;
    nextScreen();
}

function answerQ2(duration) {
    state.duration = duration;
    nextScreen();
}

function updateSliderValue(val) {
    document.getElementById('slider-val-display').innerText = val;
    state.pain = parseInt(val);
}

function answerQ3() {
    nextScreen();
}

function answerQ4(val) {
    state.medication = val;
    nextScreen();
}

function answerQ5(val) {
    state.conditions = val;
    nextScreen();
}

function answerQ6(val) {
    state.shortnessOfBreath = val;
    nextScreen();
}

/**
 * Core Assessment Logic (Triage Simulation)
 */
function generateAssessment() {
    let riskLevel = 'Low Risk';
    let icon = '🟢';
    let message = 'Your symptoms appear mild. Rest and monitor your condition. Consult a physician if symptoms worsen.';
    let colorClass = 'risk-low';

    // Determining urgency criteria
    const isHighRisk = state.symptom === 'Chest Pain' || 
                       state.shortnessOfBreath === 'Yes' || 
                       state.pain >= 8;

    const isModerateRisk = state.pain >= 5 || 
                           state.symptom === 'Stomach Pain' || 
                           (state.symptom === 'Fever' && state.duration === 'More than 3 days') ||
                           (state.conditions && state.conditions !== 'None');

    if (isHighRisk) {
        riskLevel = 'High Risk';
        icon = '🔴';
        message = `Based on your responses (including ${state.symptom} or severe pain), please seek immediate medical attention or visit an emergency room right away.`;
        colorClass = 'risk-high';
    } else if (isModerateRisk) {
        riskLevel = 'Moderate Risk';
        icon = '🟡';
        message = 'Based on your symptoms, this may require a general physician consultation within 24 hours. Consider booking a virtual or in-person appointment.';
        colorClass = 'risk-moderate';
    }

    // Update UI Elements with results
    const riskLevelEl = document.getElementById('risk-level');
    riskLevelEl.innerText = riskLevel;
    riskLevelEl.className = 'risk-level ' + colorClass;
    
    document.getElementById('risk-icon').innerText = icon;
    document.getElementById('risk-message').innerText = message;
}

/**
 * Reset Handler
 */
function resetFlow() {
    // Reset state values
    state.symptom = null;
    state.duration = null;
    state.pain = 5;
    state.medication = null;
    state.conditions = null;
    state.shortnessOfBreath = null;
    state.currentScreenIndex = 0;
    
    // Reset slider UI
    document.getElementById('pain-slider').value = 5;
    updateSliderValue(5);

    // Return to the first expectation screen
    showScreen(screens[0]);
}
