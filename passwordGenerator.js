(function () {
  'use strict';

  // Prevent redeclaration if script is injected multiple times
  if (window.hasRunWhitelistPasswordGenerator) {
    return;
  }
  window.hasRunWhitelistPasswordGenerator = true;

  console.log('White Hat Password Generator: Content script loaded');

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const activeElement = getDeepActiveElement();
    if (!activeElement || (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA')) {
      return;
    }

    if (request.action === 'generate-password') {
      const password = generateSecurePassword(18, true, true, true, true, false);
      activeElement.value = password;
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (request.action === 'insert-password') {
      // Context menu sends the password directly
      activeElement.value = request.password;
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  // Helper to find the true active element (penetrating Shadow DOM)
  function getDeepActiveElement() {
    let el = document.activeElement;
    while (el && el.shadowRoot && el.shadowRoot.activeElement) {
      el = el.shadowRoot.activeElement;
    }
    return el;
  }

  function generateSecurePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, includeBinary) {
    let charset = '';

    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()';
    if (includeBinary) charset += '01';

    if (charset === '') return '';

    let password = '';
    const randomArray = new Uint32Array(length);
    crypto.getRandomValues(randomArray);
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(randomArray[i] % n);
    }
    return password;
  }
})();
