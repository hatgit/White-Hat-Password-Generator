document.addEventListener('DOMContentLoaded', function () {

  // -- Elements --
  const passwordOutput = document.getElementById('password');
  const copyBtn = document.getElementById('copy-btn');
  const outputCard = document.getElementById('output-card');
  const entropyText = document.getElementById('entropy-text');
  const strengthDesc = document.getElementById('strength-description');

  // Inputs
  const lengthSlider = document.getElementById('length-slider');
  const lengthValDisplay = document.getElementById('length-val');

  const includeUppercase = document.getElementById('includeUppercase');
  const includeLowercase = document.getElementById('includeLowercase');
  const includeNumbers = document.getElementById('includeNumbers');
  const includeSymbols = document.getElementById('includeSymbols');
  const includeBinary = document.getElementById('includeBinary');
  const advancedMode = document.getElementById('advancedMode');

  // -- Initialization --
  // Generate valid password on load
  generateAndDisplay();

  // -- Event Listeners --

  // Advanced Mode Toggle
  advancedMode.addEventListener('change', function () {
    if (this.checked) {
      lengthSlider.max = 1024;
    } else {
      // If current value is > 128, reset it
      if (parseInt(lengthSlider.value) > 128) {
        lengthSlider.value = 128;
        lengthValDisplay.textContent = 128;
        generateAndDisplay();
      }
      lengthSlider.max = 128;
    }
  });

  // Slider Change (Live update)
  lengthSlider.addEventListener('input', function () {
    lengthValDisplay.textContent = this.value;
    generateAndDisplay();
  });

  // Toggle Changes
  const toggles = [includeUppercase, includeLowercase, includeNumbers, includeSymbols, includeBinary];
  toggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      // Ensure at least one is checked to avoid infinite loops or empty passwords
      if (!anyChecked()) {
        toggle.checked = true; // Revert
        return;
      }
      generateAndDisplay();
    });
  });

  // Copy Button
  copyBtn.addEventListener('click', async function () {
    if (!passwordOutput.value) return;

    try {
      await navigator.clipboard.writeText(passwordOutput.value);
      // Show feedback
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.classList.remove('copied');
      }, 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  });

  // -- Functions --

  function anyChecked() {
    return includeUppercase.checked || includeLowercase.checked ||
      includeNumbers.checked || includeSymbols.checked || includeBinary.checked;
  }

  function generateAndDisplay() {
    const length = parseInt(lengthSlider.value);

    const pwd = generatePassword(
      length,
      includeUppercase.checked,
      includeLowercase.checked,
      includeNumbers.checked,
      includeSymbols.checked,
      includeBinary.checked
    );

    passwordOutput.value = pwd;

    // Auto-resize if needed (simple version)
    passwordOutput.style.height = 'auto';
    passwordOutput.style.height = (passwordOutput.scrollHeight + 2) + 'px';

    updateEntropyUI(pwd);
  }

  function generatePassword(length, upper, lower, nums, syms, binary) {
    let charset = '';
    if (lower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (nums) charset += '0123456789';
    if (syms) charset += '!@#$%^&*()';
    if (binary) charset += '01';

    if (charset === '') return '';

    let password = '';
    const randomArray = new Uint32Array(length);
    crypto.getRandomValues(randomArray);

    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(randomArray[i] % n);
    }
    return password;
  }

  function updateEntropyUI(password) {
    // Calculate Entropy
    let poolSize = 0;
    if (includeLowercase.checked) poolSize += 26;
    if (includeUppercase.checked) poolSize += 26;
    if (includeNumbers.checked) poolSize += 10;
    if (includeSymbols.checked) poolSize += 10;
    if (includeBinary.checked) poolSize += 2;

    if (poolSize === 0 || password.length === 0) {
      updateStrengthVisuals(0, '', '');
      return;
    }

    // Use log laws: log(a^b) = b * log(a) to avoid Infinity from Math.pow()
    const entropy = password.length * Math.log2(poolSize);

    // Revised Logic & Educational Descriptions
    let label = '';
    let desc = '';
    let colorClass = '';

    if (entropy >= 512) {
      label = '(Alien Proof)';
      colorClass = 'strength-alien';
      desc = 'Mind-bogglingly long. Secure against any civilization in the universe.';
    } else if (entropy >= 256) {
      label = '(Quantum Secure)';
      colorClass = 'strength-quantum';
      desc = 'Sourced from a range larger than the number of atoms in the universe.';
    } else if (entropy >= 128) {
      label = '(Very Strong)';
      colorClass = 'strength-strong';
      desc = 'As secure as a modern cryptocurrency wallet private key.';
    } else if (entropy >= 64) {
      label = '(Strong)';
      colorClass = 'strength-good';
      desc = 'Strong, but theoretically susceptible to future quantum attacks.';
    } else if (entropy >= 45) { // Bumped threshold for "Moderate"
      label = '(Moderate)';
      colorClass = 'strength-moderate';
      desc = 'Decent for non-critical accounts, but could be cracked with significant resources.';
    } else if (entropy >= 28) {
      label = '(Weak)'; // Renamed from "Very Weak"
      colorClass = 'strength-weak';
      desc = 'Can likely be brute-forced cracked in a few hours or days.';
    } else {
      label = '(Weakest)';
      colorClass = 'strength-bad';
      desc = 'Instant crack. Do not use for anything sensitive.';
    }

    entropyText.textContent = `${entropy.toFixed(2)} bits ${label}`;
    if (strengthDesc) {
      strengthDesc.textContent = desc;
    }

    // Update Visual Color Class
    outputCard.classList.remove('strength-alien', 'strength-quantum', 'strength-strong', 'strength-good', 'strength-moderate', 'strength-weak', 'strength-bad');
    outputCard.classList.add(colorClass);
  }

});
