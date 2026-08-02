// Simple calculator behavior
(function(){
  const display = document.getElementById('display');
  const buttons = Array.from(document.querySelectorAll('.btn'));
  let expression = '';

  function updateDisplay(){
    display.textContent = expression === '' ? '0' : expression;
  }

  function appendValue(v){
    // Prevent multiple leading zeros like "00"
    if (v === '0' && expression === '0') return;
    // If current display is '0' and user types digit, replace it
    if (/\d/.test(v) && expression === '0') {
      expression = v;
    } else {
      expression += v;
    }
    updateDisplay();
  }

  function clearAll(){
    expression = '';
    updateDisplay();
  }

  function deleteLast(){
    expression = expression.slice(0, -1);
    updateDisplay();
  }

  function safeEvaluate(expr){
    // Allow only digits, whitespace, parentheses, and arithmetic operators . +-*/ 
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
      throw new Error('Invalid characters');
    }
    // Avoid sequences like "++" or "**" (simple check)
    if (/[\+\-*/]{2,}/.test(expr.replace(/\s+/g,''))) {
      throw new Error('Malformed expression');
    }
    // Evaluate using Function in a controlled way
    // This still executes JS expressions, so we rely on the character whitelist above.
    // For production-grade calculators consider a proper expression parser.
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${expr});`)();
  }

  function calculate(){
    if (expression.trim() === '') return;
    try{
      const result = safeEvaluate(expression);
      expression = String(result);
      updateDisplay();
    }catch(err){
      display.textContent = 'Error';
      setTimeout(updateDisplay, 1000);
      expression = '';
    }
  }

  // Button clicks
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-value');
      const action = btn.getAttribute('data-action');

      if (action === 'clear') return clearAll();
      if (action === 'delete') return deleteLast();
      if (action === 'equals') return calculate();
      if (value) return appendValue(value);
    });
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if ((key >= '0' && key <= '9') || key === '.') {
      appendValue(key);
      e.preventDefault();
      return;
    }
    if (key === '+' || key === '-' || key === '*' || key === '/') {
      appendValue(key);
      e.preventDefault();
      return;
    }
    if (key === 'Enter' || key === '=') {
      calculate();
      e.preventDefault();
      return;
    }
    if (key === 'Backspace') {
      deleteLast();
      e.preventDefault();
      return;
    }
    if (key === 'Escape') {
      clearAll();
      e.preventDefault();
      return;
    }
    if (key === '(' || key === ')') {
      appendValue(key);
      e.preventDefault();
      return;
    }
  });

  // Initialize
  updateDisplay();
})();