chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'generate-password') {
    // Get the active element
    const activeElement = document.activeElement;

    // Generate password using existing function
    const password = generatePassword(
      14, // Default password length
      true, // includeUppercase
      true, // includeLowercase
      true, // includeNumbers
      true, // includeSymbols
      false // includeBinary
    );

    // Set the value of the active element to the generated password
    activeElement.value = password;
  }
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

  // Find the password input field
  const passwordInput = document.querySelector('input[type="password"]');
  if (passwordInput) {
    // Set the value of the password input field to the generated password
    passwordInput.value = password;
  }


  return password;
}

console.log('Content script injected');

function findActiveElement() {
  let activeElement = document.activeElement;
  while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }
  return activeElement;
}

function findActiveElement() {
  const activeElement = document.activeElement;
  if (activeElement.tagName === 'IFRAME') {
    return activeElement.contentDocument.activeElement;
  } else {
    return activeElement; 
    console.log('No password input field found');
  }
}

  
  
