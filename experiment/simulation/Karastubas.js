class KaratsubaMultiplication {
    constructor() {
        this.x = '';
        this.y = '';
        this.steps = [];
        this.currentStep = 0;
        this.isRunning = false;
        this.animationSpeed = 1000;
        
        // Challenge system
        this.challengeActive = false;
        this.currentChallenge = null;
        this.challengeBases = [3, 4, 5, 6, 7, 8];  // Different bases for challenges
        
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    setupEventListeners() {
        // Floating panel controls
        const controlsButton = document.getElementById('controlsButton');
        const controlsPanel = document.getElementById('controlsPanel');
        const controlsPanelClose = document.getElementById('controlsPanelClose');
        
        const infoButton = document.getElementById('infoButton');
        const infoPanel = document.getElementById('infoPanel');
        const infoPanelClose = document.getElementById('infoPanelClose');
        
        if (controlsButton && controlsPanel) {
            controlsButton.addEventListener('click', () => this.togglePanel(controlsPanel, infoPanel));
            controlsPanelClose.addEventListener('click', () => controlsPanel.classList.remove('active'));
        }
        
        if (infoButton && infoPanel) {
            infoButton.addEventListener('click', () => this.togglePanel(infoPanel, controlsPanel));
            infoPanelClose.addEventListener('click', () => infoPanel.classList.remove('active'));
        }
        
        // Close panels when clicking outside
        document.addEventListener('click', (event) => {
            if (controlsPanel && !controlsPanel.contains(event.target) && 
                !controlsButton.contains(event.target) && 
                controlsPanel.classList.contains('active')) {
                controlsPanel.classList.remove('active');
            }
            if (infoPanel && !infoPanel.contains(event.target) && 
                !infoButton.contains(event.target) && 
                infoPanel.classList.contains('active')) {
                infoPanel.classList.remove('active');
            }
        });
    }
    
    togglePanel(panel, otherPanel) {
        const isActive = panel.classList.contains('active');
        if (otherPanel && otherPanel.classList.contains('active')) {
            otherPanel.classList.remove('active');
        }
        if (isActive) {
            panel.classList.remove('active');
        } else {
            panel.classList.add('active');
        }
    }
    
    updateInputs() {
        const inputX = document.getElementById('inputX');
        const inputY = document.getElementById('inputY');
        
        if (inputX && inputY) {
            this.x = inputX.value.replace(/\D/g, '');
            this.y = inputY.value.replace(/\D/g, '');
            inputX.value = this.x;
            inputY.value = this.y;
        }
    }
    
    startVisualization() {
        this.updateInputs();
        
        if (!this.x || !this.y) {
            alert('Please enter both numbers');
            return;
        }
        
        if (this.x.length > 8 || this.y.length > 8) {
            alert('Please use numbers with 8 digits or less for better visualization');
            return;
        }
        
        this.steps = [];
        this.currentStep = 0;
        this.isRunning = true;
        this.challengeActive = false;
        
        // Generate all steps
        this.generateSteps(this.x, this.y, 0);
        
        // Update UI
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stepBtn').disabled = false;
        document.getElementById('prevBtn').disabled = true;
        
        this.displayCurrentStep();
        this.updateDisplay();
    }
    
    startStepByStep() {
        this.updateInputs();
        
        if (!this.x || !this.y) {
            // If no inputs, show default example and start
            this.x = '1234';
            this.y = '5678';
            document.getElementById('inputX').value = this.x;
            document.getElementById('inputY').value = this.y;
        }
        
        if (this.x.length > 8 || this.y.length > 8) {
            alert('Please use numbers with 8 digits or less for better visualization');
            return;
        }
        
        // If not already started, initialize
        if (this.steps.length === 0) {
            this.isRunning = true;
            this.challengeActive = false;
            this.currentStep = 0;
            
            // Generate all steps
            this.generateSteps(this.x, this.y, 0);
            
            // Update UI
            document.getElementById('stepBtn').disabled = false;
            document.getElementById('prevBtn').disabled = true;
        }
        
        // Move to next step
        this.stepForward();
        this.updateDisplay();
    }
    
    generateSteps(x, y, depth) {
        const stepId = this.steps.length;
        
        // Clean and validate inputs
        x = x.toString().replace(/\D/g, '') || '0';
        y = y.toString().replace(/\D/g, '') || '0';
        
        // Pad numbers to same length
        const maxLen = Math.max(x.length, y.length);
        x = x.padStart(maxLen, '0');
        y = y.padStart(maxLen, '0');
        
        const step = {
            id: stepId,
            depth: depth,
            x: x,
            y: y,
            type: 'start',
            description: `Multiplying ${x} × ${y}`,
            n: maxLen
        };
        
        this.steps.push(step);
        
        // Base case
        if (maxLen <= 1) {
            const xVal = parseInt(x) || 0;
            const yVal = parseInt(y) || 0;
            const result = xVal * yVal;
            this.steps.push({
                id: stepId + 0.5,
                depth: depth,
                type: 'base',
                description: `Base case: ${x} × ${y} = ${result}`,
                result: result.toString(),
                x: x,
                y: y
            });
            return result.toString();
        }
        
        // Split the numbers
        const m = Math.floor(maxLen / 2);
        const a = x.substring(0, maxLen - m) || '0';
        const b = x.substring(maxLen - m) || '0';
        const c = y.substring(0, maxLen - m) || '0';
        const d = y.substring(maxLen - m) || '0';
        
        this.steps.push({
            id: stepId + 0.1,
            depth: depth,
            type: 'split',
            description: `Split numbers at position ${m} from the right (like cutting a word)`,
            a: a, b: b, c: c, d: d,
            m: m,
            x: x,
            y: y
        });
        
        // Three recursive calls
        const z0 = this.generateSteps(b, d, depth + 1);
        const z2 = this.generateSteps(a, c, depth + 1);
        
        // Calculate (a+b) and (c+d)
        const aVal = parseInt(a) || 0;
        const bVal = parseInt(b) || 0;
        const cVal = parseInt(c) || 0;
        const dVal = parseInt(d) || 0;
        
        const aPlusB = (aVal + bVal).toString();
        const cPlusD = (cVal + dVal).toString();
        
        this.steps.push({
            id: stepId + 0.2,
            depth: depth,
            type: 'addition',
            description: `Calculate (a+b) = ${a} + ${b} = ${aPlusB}, (c+d) = ${c} + ${d} = ${cPlusD}`,
            aPlusB: aPlusB,
            cPlusD: cPlusD,
            a: a, b: b, c: c, d: d
        });
        
        const z1Temp = this.generateSteps(aPlusB, cPlusD, depth + 1);
        
        // Calculate z1 = z1_temp - z2 - z0
        const z1TempVal = parseInt(z1Temp) || 0;
        const z2Val = parseInt(z2) || 0;
        const z0Val = parseInt(z0) || 0;
        const z1 = (z1TempVal - z2Val - z0Val).toString();
        
        this.steps.push({
            id: stepId + 0.3,
            depth: depth,
            type: 'z1_calculation',
            description: `z₁ = (a+b)(c+d) - z₂ - z₀ = ${z1Temp} - ${z2} - ${z0} = ${z1}`,
            z1Temp: z1Temp,
            z2: z2,
            z0: z0,
            z1: z1
        });
        
        // Final combination
        const result = this.combineResults(z2, z1, z0, m);
        
        this.steps.push({
            id: stepId + 0.4,
            depth: depth,
            type: 'combine',
            description: `Result = z₂×10^${2*m} + z₁×10^${m} + z₀ = ${z2}×10^${2*m} + ${z1}×10^${m} + ${z0} = ${result}`,
            z2: z2,
            z1: z1,
            z0: z0,
            m: m,
            result: result
        });
        
        return result;
    }
    
    combineResults(z2, z1, z0, m) {
        const z2Val = parseInt(z2) || 0;
        const z1Val = parseInt(z1) || 0;
        const z0Val = parseInt(z0) || 0;
        
        const term1 = z2Val * Math.pow(10, 2 * m);
        const term2 = z1Val * Math.pow(10, m);
        const term3 = z0Val;
        return (term1 + term2 + term3).toString();
    }
    
    displayCurrentStep() {
        const visualArea = document.getElementById('visualizationArea');
        
        if (this.currentStep >= this.steps.length) {
            this.completeVisualization();
            return;
        }
        
        const step = this.steps[this.currentStep];
        
        let content = `<div class="space-y-4">`;
        
        // Algorithm step with blue theme
        content += `<div class="bg-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
            <div class="flex justify-between items-center">
                <h3 class="font-semibold text-blue-800">Algorithm Step ${this.currentStep + 1} of ${this.steps.length}</h3>
                <div class="text-sm text-blue-600">Karatsuba Multiplication</div>
            </div>
            <p class="text-blue-700 mt-2">${step.description}</p>
        </div>`;
        
        // Show step details based on type
        switch (step.type) {
            case 'start':
                content += this.renderStartStep(step);
                break;
            case 'split':
                content += this.renderSplitStep(step);
                break;
            case 'addition':
                content += this.renderAdditionStep(step);
                break;
            case 'z1_calculation':
                content += this.renderZ1CalculationStep(step);
                break;
            case 'combine':
                content += this.renderCombineStep(step);
                break;
            case 'base':
                content += this.renderBaseStep(step);
                break;
        }
        
        // Generate and display challenge if not active
        if (!this.challengeActive && ['split', 'addition', 'z1_calculation', 'combine', 'base'].includes(step.type)) {
            this.generateChallenge(step);
            content += this.renderChallenge();
        }
        
        // Navigation buttons
        content += `<div class="flex justify-center gap-2 mt-6">
            <button onclick="stepBackward()" class="btn bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" 
                    ${this.currentStep === 0 ? 'disabled' : ''}>
                ← Previous Step
            </button>
            <button onclick="stepForward()" class="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    ${this.currentStep >= this.steps.length - 1 ? 'disabled' : ''}>
                ${this.challengeActive ? 'Submit Answer' : 'Next Step →'}
            </button>
        </div>`;
        
        content += `</div>`;
        visualArea.innerHTML = content;
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Focus on challenge input if present
        if (this.challengeActive) {
            setTimeout(() => {
                const input = document.getElementById('challengeInput');
                if (input) {
                    input.focus();
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            this.submitChallenge();
                        }
                    });
                }
            }, 100);
        }
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const stepBtn = document.getElementById('stepBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentStep === 0;
        }
        if (stepBtn) {
            stepBtn.disabled = this.currentStep >= this.steps.length - 1;
        }
    }
    
    updateNavigationButtonText() {
        // Find the forward navigation button and update its text
        const forwardButtons = document.querySelectorAll('button[onclick="stepForward()"]');
        forwardButtons.forEach(button => {
            button.textContent = this.challengeActive ? 'Submit Answer' : 'Next Step →';
        });
    }
    
    renderStartStep(step) {
        const displayX = step.x || 'undefined';
        const displayY = step.y || 'undefined';
        const displayN = step.n || 0;
        
        return `<div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-center">
                <div class="text-2xl font-mono font-bold text-blue-800 mb-2">${displayX} × ${displayY}</div>
                <div class="text-sm text-blue-600">Numbers have ${displayN} digits each</div>
                ${step.depth > 0 ? `<div class="text-xs text-blue-500 mt-1">Recursive call at depth ${step.depth}</div>` : ''}
            </div>
        </div>`;
    }
    
    renderSplitStep(step) {
        const displayX = step.x || 'undefined';
        const displayY = step.y || 'undefined';
        const displayA = step.a || '0';
        const displayB = step.b || '0';
        const displayC = step.c || '0';
        const displayD = step.d || '0';
        const displayM = step.m || 0;
        
        return `<div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold text-green-800 mb-3">Number Splitting</h4>
            
            <!-- Clear position explanation -->
            <div class="bg-blue-50 p-3 rounded-lg mb-4">
                <div class="text-sm text-blue-700">
                    <strong>Split position ${displayM}:</strong> We count ${displayM} digits from the RIGHT (not zero-indexed).
                    <br>• <strong>High part:</strong> All digits to the LEFT of the split
                    <br>• <strong>Low part:</strong> The rightmost ${displayM} digits
                    <br><em>Example: "1234" split at position 2 → High="12", Low="34"</em>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white p-3 rounded border-l-4 border-green-500">
                    <div class="text-center">
                        <div class="text-sm text-gray-600 mb-1">First Number (x)</div>
                        <div class="text-lg font-mono">${displayX} = ${displayA} × 10^${displayM} + ${displayB}</div>
                        <div class="text-sm text-green-600 mt-1">
                            <span class="bg-green-100 px-2 py-1 rounded">High: ${displayA}</span> | 
                            <span class="bg-green-200 px-2 py-1 rounded">Low: ${displayB}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 rounded border-l-4 border-blue-500">
                    <div class="text-center">
                        <div class="text-sm text-gray-600 mb-1">Second Number (y)</div>
                        <div class="text-lg font-mono">${displayY} = ${displayC} × 10^${displayM} + ${displayD}</div>
                        <div class="text-sm text-blue-600 mt-1">
                            <span class="bg-blue-100 px-2 py-1 rounded">High: ${displayC}</span> | 
                            <span class="bg-blue-200 px-2 py-1 rounded">Low: ${displayD}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
    
    renderAdditionStep(step) {
        const displayA = step.a || '0';
        const displayB = step.b || '0';
        const displayC = step.c || '0';
        const displayD = step.d || '0';
        const displayAPlusB = step.aPlusB || '0';
        const displayCPlusD = step.cPlusD || '0';
        
        return `<div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-800 mb-3">Addition for Karatsuba's Trick</h4>
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white p-3 rounded text-center">
                    <div class="text-lg font-mono">(a + b) = ${displayA} + ${displayB} = ${displayAPlusB}</div>
                    <div class="text-sm text-gray-600">Will be used in recursive multiplication</div>
                </div>
                <div class="bg-white p-3 rounded text-center">
                    <div class="text-lg font-mono">(c + d) = ${displayC} + ${displayD} = ${displayCPlusD}</div>
                    <div class="text-sm text-gray-600">Will be used in recursive multiplication</div>
                </div>
            </div>
        </div>`;
    }
    
    renderZ1CalculationStep(step) {
        const displayZ1Temp = step.z1Temp || '0';
        const displayZ2 = step.z2 || '0';
        const displayZ0 = step.z0 || '0';
        const displayZ1 = step.z1 || '0';
        
        return `<div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold text-purple-800 mb-3">Karatsuba's Key Calculation</h4>
            <div class="bg-white p-4 rounded">
                <div class="text-center space-y-2">
                    <div class="text-lg font-mono">z₁ = (a+b)(c+d) - z₂ - z₀</div>
                    <div class="text-lg font-mono">z₁ = ${displayZ1Temp} - ${displayZ2} - ${displayZ0}</div>
                    <div class="text-xl font-mono font-bold text-purple-700">z₁ = ${displayZ1}</div>
                </div>
                <div class="text-sm text-gray-600 mt-3 text-center">
                    This clever substitution gives us ad + bc with only 3 multiplications!
                </div>
            </div>
        </div>`;
    }
    
    renderCombineStep(step) {
        const displayZ2 = step.z2 || '0';
        const displayZ1 = step.z1 || '0';
        const displayZ0 = step.z0 || '0';
        const displayM = step.m || 0;
        const displayResult = step.result || '0';
        
        return `<div class="bg-orange-50 p-4 rounded-lg">
            <h4 class="font-semibold text-orange-800 mb-3">Final Combination</h4>
            <div class="bg-white p-4 rounded">
                <div class="text-center space-y-2">
                    <div class="text-lg font-mono">x × y = z₂ × 10^${2*displayM} + z₁ × 10^${displayM} + z₀</div>
                    <div class="text-lg font-mono">= ${displayZ2} × 10^${2*displayM} + ${displayZ1} × 10^${displayM} + ${displayZ0}</div>
                    <div class="text-xl font-mono font-bold text-orange-700">= ${displayResult}</div>
                </div>
            </div>
        </div>`;
    }
    
    renderBaseStep(step) {
        const displayDescription = step.description || 'Base case multiplication';
        const displayResult = step.result || '0';
        
        return `<div class="bg-gray-100 p-4 rounded-lg">
            <div class="text-center">
                <div class="text-lg font-mono font-bold">${displayDescription}</div>
                <div class="text-sm text-gray-600 mt-1">Base case - direct multiplication</div>
                <div class="text-lg font-mono font-bold text-green-600 mt-2">Result: ${displayResult}</div>
            </div>
        </div>`;
    }
    
    // Utility: Convert a string in any base to decimal
    baseToDecimal(str, base) {
        // Handles both numbers and strings
        return parseInt(str, base);
    }

    // Utility: Convert a decimal number to a string in any base
    decimalToBase(num, base) {
        // Handles both numbers and strings
        return Number(num).toString(base);
    }
    
    generateChallenge(step) {
        if (this.challengeActive) return;
        
        const challengeBase = this.challengeBases[Math.floor(Math.random() * this.challengeBases.length)];
        
        // Helper for consistent base notation with smaller subscript
        const baseNotation = (num, base) => `(${num.toString(base)})<sub>${base}</sub>`;
        
        // Create challenge based on step type
        const challengeCreators = {
            split: () => this.createSplitChallenge(step, challengeBase, baseNotation),
            addition: () => this.createAdditionChallenge(step, challengeBase, baseNotation),
            base: () => this.createBaseChallenge(step, challengeBase, baseNotation),
            z1_calculation: () => this.createZ1Challenge(step, challengeBase, baseNotation),
            combine: () => this.createCombineChallenge(step, challengeBase, baseNotation)
        };
        
        const creator = challengeCreators[step.type];
        if (creator) {
            this.currentChallenge = creator();
            this.challengeActive = true;
        }
    }
    
    createSplitChallenge(step, base, baseNotation) {
        const num = Math.random() < 0.5 ? parseInt(step.x || '0') : parseInt(step.y || '0');
        const m = step.m || 0;
        const numInBase = num.toString(base);
        
        // Calculate split parts
        const high = numInBase.length <= m ? '0' : numInBase.substring(0, numInBase.length - m);
        const low = numInBase.substring(Math.max(0, numInBase.length - m));
        
        const isHigh = Math.random() < 0.5;
        const partName = isHigh ? 'HIGH' : 'LOW';
        const answer = isHigh ? (high || '0') : (low || '0');
        
        return {
            type: 'split',
            base: base,
            question: `Convert ${baseNotation(num, 10)} to base ${base}, then split at position ${m} from right. What is the ${partName} part?`,
            correctAnswer: answer,
            explanation: `${baseNotation(num, 10)} = ${baseNotation(num, base)}. Split at position ${m}: HIGH = ${baseNotation(high || '0', base)}, LOW = ${baseNotation(low || '0', base)}.`
        };
    }
    
    createAdditionChallenge(step, base, baseNotation) {
        const nums = [
            [parseInt(step.a || '0'), parseInt(step.b || '0')],
            [parseInt(step.c || '0'), parseInt(step.d || '0')]
        ];
        const [n1, n2] = nums[Math.floor(Math.random() * nums.length)];
        const sum = n1 + n2;
        
        return {
            type: 'addition',
            base: base,
            question: `${baseNotation(n1, base)} + ${baseNotation(n2, base)} = ?<sub>${base}</sub>`,
            correctAnswer: sum.toString(base),
            explanation: `${baseNotation(n1, base)} + ${baseNotation(n2, base)} = ${baseNotation(sum, base)} (decimal: ${n1} + ${n2} = ${sum})`
        };
    }
    
    createBaseChallenge(step, base, baseNotation) {
        const x = parseInt(step.x || '0');
        const y = parseInt(step.y || '0');
        const result = x * y;
        
        return {
            type: 'base',
            base: base,
            question: `${baseNotation(x, base)} × ${baseNotation(y, base)} = ?<sub>${base}</sub>`,
            correctAnswer: result.toString(base),
            explanation: `${baseNotation(x, base)} × ${baseNotation(y, base)} = ${baseNotation(result, base)} (decimal: ${x} × ${y} = ${result})`
        };
    }
    
    createZ1Challenge(step, base, baseNotation) {
        const z1Temp = parseInt(step.z1Temp || '0');
        const z2 = parseInt(step.z2 || '0');
        const z0 = parseInt(step.z0 || '0');
        const result = z1Temp - z2 - z0;
        
        return {
            type: 'z1_calculation',
            base: base,
            question: `${baseNotation(z1Temp, base)} - ${baseNotation(z2, base)} - ${baseNotation(z0, base)} = ?<sub>${base}</sub>`,
            correctAnswer: result.toString(base),
            explanation: `${baseNotation(z1Temp, base)} - ${baseNotation(z2, base)} - ${baseNotation(z0, base)} = ${baseNotation(result, base)} (decimal: ${z1Temp} - ${z2} - ${z0} = ${result})`
        };
    }
    
    createCombineChallenge(step, base, baseNotation) {
        const z2 = parseInt(step.z2 || '0');
        const z1 = parseInt(step.z1 || '0');
        const z0 = parseInt(step.z0 || '0');
        const m = step.m || 0;
        const result = z2 * Math.pow(10, 2*m) + z1 * Math.pow(10, m) + z0;
        
        return {
            type: 'combine',
            base: base,
            question: `${baseNotation(z2, base)} × ${base}<sup>${2*m}</sup> + ${baseNotation(z1, base)} × ${base}<sup>${m}</sup> + ${baseNotation(z0, base)} = ?<sub>${base}</sub>`,
            correctAnswer: result.toString(base),
            explanation: `${baseNotation(z2, base)} × ${base}<sup>${2*m}</sup> + ${baseNotation(z1, base)} × ${base}<sup>${m}</sup> + ${baseNotation(z0, base)} = ${baseNotation(result, base)} (decimal: ${result})`
        };
    }
    
    renderChallenge() {
        if (!this.currentChallenge) return '';
        
        const challenge = this.currentChallenge;
        
        return `<div class="bg-orange-100 p-4 rounded-lg border-l-4 border-orange-500 mt-4">
            <div class="flex items-center justify-between">
                <h3 class="font-semibold text-orange-800">Challenge Question</h3>
                <div class="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded">
                    ${challenge.type.replace('_', ' ').toUpperCase()}
                </div>
            </div>
            <p class="text-orange-700 mt-2 font-medium">${challenge.question}</p>
            <div class="flex gap-2 mt-3">
                <input type="text" id="challengeInput" class="flex-1 px-3 py-2 border border-orange-300 rounded font-mono" 
                       placeholder="Type your answer here...">
                <button onclick="showHint()" class="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    Hint
                </button>
                <button onclick="skipChallenge()" class="btn bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">
                    Skip
                </button>
            </div>
            <div id="challengeFeedback" class="mt-3"></div>
            <div id="challengeHint" class="hidden bg-blue-50 p-3 rounded-lg mt-3">
                <div class="font-semibold text-blue-800 mb-1">💡 Detailed Hint:</div>
                <div class="text-sm text-blue-700" id="hintText"></div>
            </div>
        </div>`;
    }
    
    showHint() {
        if (!this.currentChallenge) return;
        
        const hintDiv = document.getElementById('challengeHint');
        const hintText = document.getElementById('hintText');
        
        let hint = '';
        const challenge = this.currentChallenge;
        const base = challenge.base || 10;
        
        switch (challenge.type) {
            case 'split':
                if (challenge.base === 10) {
                    hint = `<strong>Splitting numbers:</strong><br>
                           1. Count positions from the RIGHT of the number<br>
                           2. HIGH part = everything to the LEFT of split position<br>
                           3. LOW part = everything to the RIGHT (including split position)<br>
                           <em>Example: "1234" split at position 2 → HIGH="12", LOW="34"</em><br>
                           ${challenge.hint ? '<br><strong>Specific hint:</strong> ' + challenge.hint : ''}`;
                } else {
                    hint = `<strong>Converting to base ${base}:</strong><br>
                           1. Divide the number by ${base} repeatedly<br>
                           2. Collect remainders from bottom to top<br>
                           3. Write the remainders in reverse order<br>
                           <strong>Then splitting:</strong> Count from right, split into high and low parts<br>
                           <em>Example: 25 ÷ ${base} = ${Math.floor(25/base)} remainder ${25%base}</em>`;
                }
                break;
            case 'addition':
                hint = `<strong>Addition in base ${base}:</strong><br>
                       1. Add column by column from right to left<br>
                       2. If sum ≥ ${base}, write (sum - ${base}) and carry 1<br>
                       3. Continue until all columns are done<br>
                       <em>Quick method: Convert to decimal, add, then convert back to base ${base}</em>`;
                break;
            case 'z1_calculation':
                hint = `<strong>Subtraction in base ${base}:</strong><br>
                       1. Convert all numbers to decimal first<br>
                       2. Perform the subtraction: a - b - c<br>
                       3. Convert the result back to base ${base}<br>
                       <em>Quick method: Use calculator for decimal math, then convert final answer</em>`;
                break;
            case 'combine':
                hint = `<strong>Powers and combination in base ${base}:</strong><br>
                       1. Calculate each term in decimal first<br>
                       2. ${base}^1 = ${base}, ${base}^2 = ${base*base}, etc.<br>
                       3. Multiply and add all terms<br>
                       4. Convert final result to base ${base}<br>
                       <em>Use a calculator for the decimal math, then convert the final answer</em>`;
                break;
            case 'base':
                hint = `<strong>Multiplication in base ${base}:</strong><br>
                       <strong>Method 1 (Recommended):</strong><br>
                       1. Convert both numbers to decimal<br>
                       2. Multiply in decimal: ${challenge.question.includes('×') ? challenge.question.split('×')[0].trim().split(' ').pop() : 'first'} = ${challenge.question.includes('×') ? parseInt(challenge.question.split('×')[0].trim().split(' ').pop(), base) : '?'} (decimal), ${challenge.question.includes('×') ? challenge.question.split('×')[1].trim().split(' ')[0] : 'second'} = ${challenge.question.includes('×') ? parseInt(challenge.question.split('×')[1].trim().split(' ')[0], base) : '?'} (decimal)<br>
                       3. Result: ${challenge.question.includes('×') ? parseInt(challenge.question.split('×')[0].trim().split(' ').pop(), base) * parseInt(challenge.question.split('×')[1].trim().split(' ')[0], base) : '?'} (decimal)<br>
                       4. Convert back to base ${base}<br>
                       <strong>Method 2:</strong> Use base ${base} multiplication with carrying<br>
                       <em>Remember: ${base} in decimal = 10 in base ${base}</em>`;
                break;
            default:
                hint = 'Follow the mathematical operations step by step.';
        }
        
        hintText.innerHTML = hint;
        hintDiv.classList.remove('hidden');
    }

    submitChallenge() {
        const input = document.getElementById('challengeInput');
        const feedback = document.getElementById('challengeFeedback');
        if (!input || !this.currentChallenge) return;
        const userAnswer = input.value.trim();
        const correctAnswer = this.currentChallenge.correctAnswer;
        // Normalize both answers by removing leading zeros and lowercasing for base > 10
        const norm = s => (s + '').replace(/^0+/, '').toLowerCase() || '0';
        if (norm(userAnswer) === norm(correctAnswer)) {
            feedback.innerHTML = `
                <div class="bg-green-100 text-green-800 p-3 rounded">
                    <div class="font-semibold">✓ Correct!</div>
                    <div class="text-sm">${this.currentChallenge.explanation}</div>
                    <div class="text-sm mt-2 text-green-600">Click \"Next Step\" below to continue.</div>
                </div>
            `;
            this.challengeActive = false;
        } else {
            feedback.innerHTML = `
                <div class="bg-red-100 text-red-800 p-3 rounded">
                    <div class="font-semibold">✗ Incorrect</div>
                    <div class="text-sm">Your answer: ${userAnswer}</div>
                    <div class="text-sm">Expected: ${correctAnswer}</div>
                    <div class="text-sm mt-1">${this.currentChallenge.explanation}</div>
                    <div class="flex gap-2 mt-3">
                        <button onclick=\"tryAgain()\" class=\"btn bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm\">
                            Try Again
                        </button>
                    </div>
                </div>
            `;
        }
        this.updateNavigationButtonText();
    }
    
    skipChallenge() {
        const feedback = document.getElementById('challengeFeedback');
        if (feedback && this.currentChallenge) {
            feedback.innerHTML = `
                <div class="bg-blue-100 text-blue-800 p-3 rounded">
                    <div class="font-semibold">Challenge Skipped</div>
                    <div class="text-sm">Correct answer: ${this.currentChallenge.correctAnswer}</div>
                    <div class="text-sm mt-1">${this.currentChallenge.explanation}</div>
                    <div class="text-sm mt-2 text-blue-600">Click "Next Step" below to continue.</div>
                </div>
            `;
        }
        this.challengeActive = false;
        
        // Update the display to refresh the navigation button text
        this.updateNavigationButtonText();
    }
    
    tryAgain() {
        const input = document.getElementById('challengeInput');
        const feedback = document.getElementById('challengeFeedback');
        if (input) input.value = '';
        if (feedback) feedback.innerHTML = '';
        if (input) input.focus();
    }
    
    stepForward() {
        // If there's an active challenge, try to submit it first
        if (this.challengeActive) {
            const input = document.getElementById('challengeInput');
            if (input && input.value.trim()) {
                this.submitChallenge();
                return;
            } else {
                // Show message if no answer is entered
                const feedback = document.getElementById('challengeFeedback');
                if (feedback) {
                    feedback.innerHTML = `
                        <div class="bg-yellow-100 text-yellow-800 p-3 rounded">
                            <div class="font-semibold">⚠️ Please enter an answer</div>
                            <div class="text-sm">Enter your answer above and try again, or click "Skip" to skip this challenge.</div>
                        </div>
                    `;
                }
                return;
            }
        }
        
        this.currentStep++;
        this.displayCurrentStep();
        this.updateDisplay();
    }
    
    stepBackward() {
        if (this.challengeActive) {
            this.challengeActive = false;
        }
        
        if (this.currentStep > 0) {
            this.currentStep--;
            this.displayCurrentStep();
            this.updateDisplay();
        }
    }
    
    completeVisualization() {
        const finalResult = this.steps.length > 0 ? 
            (this.steps[this.steps.length - 1].result || 'undefined') : 'undefined';
        
        document.getElementById('visualizationArea').innerHTML = `
            <div class="text-center py-8">
                <div class="text-2xl font-bold text-green-700 mb-4">Algorithm Complete!</div>
                <div class="text-lg text-gray-600 mb-4">
                    Final result: ${this.x} × ${this.y} = ${finalResult}
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                    <div class="text-sm text-green-800">
                        Karatsuba's algorithm used ${this.countMultiplications()} recursive multiplications
                        instead of ${Math.pow(Math.max(this.x.length, this.y.length), 2)} for classical method.
                    </div>
                </div>
                <div class="mt-4">
                    <button onclick="stepBackward()" class="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        ← Go to Previous Step
                    </button>
                </div>
            </div>
        `;
        
        // Reset UI buttons
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stepBtn').disabled = true;
        document.getElementById('prevBtn').disabled = false;
    }
    
    countMultiplications() {
        return this.steps.filter(step => step.type === 'base').length;
    }
    
    resetVisualization() {
        this.steps = [];
        this.currentStep = 0;
        this.isRunning = false;
        this.challengeActive = false;
        
        document.getElementById('visualizationArea').innerHTML = `
            <div class="text-center text-gray-500 py-8">
                Enter two numbers and click "Start Algorithm" to begin visualization
            </div>
        `;
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stepBtn').disabled = true;
        document.getElementById('prevBtn').disabled = true;
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        document.getElementById('stepCount').textContent = this.currentStep + 1;
        document.getElementById('totalOps').textContent = this.countMultiplications();
    }
    
    generateNewExample() {
        const examples = [
            ['12', '34'],
            ['123', '456'],
            ['1234', '5678'],
            ['12345', '67890']
        ];
        
        const example = examples[Math.floor(Math.random() * examples.length)];
        document.getElementById('inputX').value = example[0];
        document.getElementById('inputY').value = example[1];
        this.updateInputs();
    }
    
    loadExample(type) {
        const examples = {
            'simple': ['12', '34'],
            'medium': ['1234', '4321'],
            'large': ['12345678', '87654321']
        };
        
        if (examples[type]) {
            document.getElementById('inputX').value = examples[type][0];
            document.getElementById('inputY').value = examples[type][1];
            this.updateInputs();
        }
    }
    
    updateSpeed() {
        const slider = document.getElementById('speedSlider');
        this.animationSpeed = parseInt(slider.value);
        document.getElementById('speedValue').textContent = this.animationSpeed;
    }
    
    clearAll() {
        this.resetVisualization();
        document.getElementById('inputX').value = '';
        document.getElementById('inputY').value = '';
        this.x = '';
        this.y = '';
    }
    
    getFormatHint(challenge) {
        const base = challenge.base || 10;
        const baseLabel = base === 10 ? 'decimal' : `base ${base}`;
        
        // Add conversion reminder for non-decimal bases
        const conversionReminder = base !== 10 ? ` | Reminder: ${base}₁₀ = 10₍${base}₎` : '';
        
        switch (challenge.type) {
            case 'split':
                return `Digits in ${baseLabel} (e.g., "12" or "${(23).toString(base)}")${conversionReminder}`;
            case 'addition':
                return `Sum in ${baseLabel} (e.g., "${(25).toString(base)}")${conversionReminder}`;
            case 'z1_calculation':
                return `Result in ${baseLabel} (e.g., "${(15).toString(base)}" - may need conversion)${conversionReminder}`;
            case 'combine':
                return `Final result in ${baseLabel} (e.g., "${(7006652).toString(base)}")${conversionReminder}`;
            case 'base':
                return `Product in ${baseLabel} (e.g., "${(42).toString(base)}")${conversionReminder}`;
            default:
                return `Answer in ${baseLabel}${conversionReminder}`;
        }
    }
}

// Global instance
let karatsubaApp;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    karatsubaApp = new KaratsubaMultiplication();
});

// Global functions for HTML onclick handlers
function updateInputs() {
    if (karatsubaApp) karatsubaApp.updateInputs();
}

function startVisualization() {
    if (karatsubaApp) karatsubaApp.startVisualization();
}

function startStepByStep() {
    if (karatsubaApp) karatsubaApp.startStepByStep();
}

function stepForward() {
    if (karatsubaApp) karatsubaApp.stepForward();
}

function stepBackward() {
    if (karatsubaApp) karatsubaApp.stepBackward();
}

function resetVisualization() {
    if (karatsubaApp) karatsubaApp.resetVisualization();
}

function generateNewExample() {
    if (karatsubaApp) karatsubaApp.generateNewExample();
}

function loadExample(type) {
    if (karatsubaApp) karatsubaApp.loadExample(type);
}

function updateSpeed() {
    if (karatsubaApp) karatsubaApp.updateSpeed();
}

function clearAll() {
    if (karatsubaApp) karatsubaApp.clearAll();
}

function submitChallenge() {
    if (karatsubaApp) karatsubaApp.submitChallenge();
}

function skipChallenge() {
    if (karatsubaApp) karatsubaApp.skipChallenge();
}

function showHint() {
    if (karatsubaApp) karatsubaApp.showHint();
}

function tryAgain() {
    if (karatsubaApp) karatsubaApp.tryAgain();
}

function acceptAndContinue() {
    if (karatsubaApp) karatsubaApp.acceptAndContinue();
}