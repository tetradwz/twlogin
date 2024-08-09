document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('calculator-input');
    const resultDiv = document.getElementById('result');
    const buttons = document.querySelectorAll('.calculator-button');
    let currentInput = '';
    let previousResult = '';

    // Event listener for button clicks
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const action = button.getAttribute('data-action');

            if (action === 'C') {
                currentInput = '';
                input.value = '';
                resultDiv.textContent = '';
            } else if (action === '=') {
                try {
                    // Replace sqrt( with Math.sqrt( and evaluate
                    const evaluatedInput = currentInput.replace(/sqrt\(/g, 'Math.sqrt(');
                    previousResult = eval(evaluatedInput);
                    resultDiv.textContent = `Sonuç: ${previousResult}`;
                    currentInput = previousResult;
                    input.value = currentInput;
                } catch (error) {
                    resultDiv.textContent = 'Hatalı ifade';
                }
            } else {
                currentInput += action;
                input.value = currentInput;
            }
        });
    });

    // Handle keyboard input
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const button = document.getElementById('calculate-btn');
            button.click();
        } else if (/[\d+\-*/.^]/.test(event.key)) {
            const button = Array.from(buttons).find(btn => btn.getAttribute('data-action') === event.key);
            if (button) button.click();
        } else if (event.key === 'Backspace') {
            currentInput = currentInput.slice(0, -1);
            input.value = currentInput;
        } else if (event.key === 'Escape') {
            const button = Array.from(buttons).find(btn => btn.getAttribute('data-action') === 'C');
            if (button) button.click();
        }
    });

    // Handle paste
    document.addEventListener('paste', function(event) {
        event.preventDefault();
        const pastedData = event.clipboardData.getData('text');
        currentInput += pastedData;
        input.value = currentInput;
    });
});
