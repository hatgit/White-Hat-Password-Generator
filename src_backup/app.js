
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('generate').addEventListener('click', function () {
      console.log("Generate button clicked");
      const length = document.getElementById('password-length').value;
      const includeUppercase = document.getElementById('includeUppercase').checked;
      const includeLowercase = document.getElementById('includeLowercase').checked;
      const includeNumbers = document.getElementById('includeNumbers').checked;
      const includeSymbols = document.getElementById('includeSymbols').checked;
      const includeBinary = document.getElementById('includeBinary').checked;
  
      const generatedPassword = generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, includeBinary);
      updatePasswordOutput(generatedPassword);
      document.getElementById('password').value = generatedPassword;
    
      const entropy = calculateEntropy(generatedPassword, includeUppercase, includeLowercase, includeNumbers, includeSymbols, includeBinary);
    
      let securityLevel = '';
    
      if (entropy >= 512) {
        securityLevel = ' (Alien Proof)';
      } else if (entropy >= 256) {
        securityLevel = ' (Quantum Secure)';
      } else if (entropy >= 128) {
        securityLevel = ' (Very Strong)';
      } else if (entropy >= 64) {
        securityLevel = ' (Strong)';
      } else if (entropy >= 32) {
        securityLevel = ' (Moderate)';
      } else if (entropy >= 17) {
        securityLevel = ' (Very Weak)';
      } else {
        securityLevel = ' (Weakest)';
      }
    
      document.getElementById('entropy').innerText = `Entropy: ${entropy.toFixed(2)} bits of security${securityLevel}`;
    
      updateEntropyClass(entropy);
  });
  function generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, includeBinary) {
    let charset = '';
  
    if (includeLowercase) {
      charset += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (includeUppercase) {
      charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (includeNumbers) {
      charset += '0123456789';
    }
    if (includeSymbols) {
      charset += '!@#$%^&*()';
    }
    if (includeBinary) {
      charset += '01';
    }
  
    let password = '';
    const randomArray = new Uint32Array(length);
    crypto.getRandomValues(randomArray);
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(randomArray[i] % n);
    }
  
    const passwordOutput = document.getElementById('password');
    passwordOutput.value = password;
    passwordOutput.style.setProperty('--padding-multiplier', Math.max(Math.ceil(password.length / 10), 1));
    
    window.generatedPassword = generatePassword;
    return password;
  }
  
  
  // Get the password generation form and add an event listener to it
  const form = document.getElementById('password-generation-form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
  
    // Get the form values
    const length = parseInt(document.getElementById('password-length').value);
    const includeUppercase = document.getElementById('include-uppercase').checked;
    const includeLowercase = document.getElementById('include-lowercase').checked;
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSymbols = document.getElementById('include-symbols').checked;
    const includeBinary = document.getElementById('include-binary').checked;
  
    // Generate the password
    const password = generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, includeBinary);
  
    // Update the password display
    const passwordOutput = document.getElementById('password-output');
    passwordOutput.textContent = password;
  });
    
   
  
    
    function calculateEntropy(password, includeUppercase, includeLowercase, includeNumbers, includeSymbols, includeBinary) {
      let charsetSize = 0;
    
      if (includeLowercase) {
        charsetSize += 26;
      }
      if (includeUppercase) {
        charsetSize += 26;
      }
      if (includeNumbers) {
        charsetSize += 10;
      }
      if (includeSymbols) {
        charsetSize += 10; // You can adjust this value based on the number of symbols you're using.
      }
      if (includeBinary) {
        charsetSize += 2;
      }
    
      return Math.log2(Math.pow(charsetSize, password.length));
    }
    
    function updatePasswordOutput(password) {
      const passwordOutput = document.getElementById('password');
      passwordOutput.value = password;
      passwordOutput.style.setProperty('--padding-multiplier', Math.max(Math.ceil(password.length / 10), 1));
      passwordOutput.setAttribute('rows', Math.ceil(password.length / 30)); // Add this line
      adjustPasswordHeight(); 
    }
    
    function updateEntropyClass(entropy) {
      const entropyElement = document.getElementById('password-container');
      entropyElement.classList.remove('purple', 'indigo', 'blue', 'green', 'yellow', 'orange', 'red');
    
      if (entropy >= 512) {
        entropyElement.classList.add('purple');
      } else if (entropy >= 256) {
        entropyElement.classList.add('indigo');
      } else if (entropy >= 128) {
        entropyElement.classList.add('blue');
      } else if (entropy >= 64) {
        entropyElement.classList.add('green');
      } else if (entropy >= 32) {
        entropyElement.classList.add('yellow');
      } else if (entropy >= 17) {
        entropyElement.classList.add('orange');
      } else {
        entropyElement.classList.add('red');
      }
    }
  
    function adjustPasswordHeight() {
      const passwordOutput = document.getElementById('password');
      passwordOutput.style.height = 'auto'; // Reset the height before setting the new height
      passwordOutput.style.height = passwordOutput.scrollHeight + 'px';
    };


    document.getElementById('darkModeToggle').addEventListener('change', function() {
      const darkMode = this.checked;
      localStorage.setItem('darkMode', darkMode);
      setDarkMode(darkMode);
    });
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.getElementById('darkModeToggle').checked = savedDarkMode;
    
    function setDarkMode(darkMode) {
      if (darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }

    document.addEventListener('DOMContentLoaded', function() {
      const darkModeIcon = document.getElementById('dark-mode-icon');
    
      if (darkModeIcon) {
        darkModeIcon.addEventListener('mouseenter', function() {
          showTooltip('Toggle dark mode');
        });
        
        darkModeIcon.addEventListener('mouseleave', function() {
          hideTooltip();
        });
      }
    });
    
    
    function showTooltip(text) {
      const tooltip = document.createElement('div');
      tooltip.setAttribute('id', 'tooltip');
      tooltip.style.position = 'absolute';
      tooltip.style.padding = '3px';
      tooltip.style.borderRadius = '3px';
      tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      tooltip.style.color = 'white';
      tooltip.style.fontSize = '12px';
      tooltip.style.zIndex = 1000;
      tooltip.style.top = '25px';
      tooltip.style.left = '5px';
      tooltip.innerHTML = text;
    
      document.getElementById('dark-mode-icon').appendChild(tooltip);
    }
    
    function hideTooltip() {
      const tooltip = document.getElementById('tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    }
    
    function toggleInfoText(element) {
      const infoText = element.parentElement.nextElementSibling;
      if (infoText.style.display === "block") {
        infoText.style.display = "none";
      } else {
        infoText.style.display = "block";
      }
    }
    
 
    async function copyPassword() {
      const passwordOutput = document.getElementById('password');
      const password = passwordOutput.value;
    
      try {
        await navigator.clipboard.writeText(password);
        console.log('Password copied to clipboard');
        alert('Password copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy password: ', err);
        alert('Failed to copy password. Please try again.');
      }
    }
    if (document.getElementById('copy-password-btn')) {
      document.getElementById('copy-password-btn').addEventListener('click', copyPassword);
    }
    });
    
    
    



    
