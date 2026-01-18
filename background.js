const generatePassword = (length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, includeBinary) => {
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

  return password;
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeBackgroundColor({ color: '#041734' });
  chrome.action.setIcon({ path: "icon-128.png" });

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "generatePassword",
      title: "Generate Secure Password",
      contexts: ["editable"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generatePassword") {
    const password = generatePassword(18, true, true, true, true, false);

    // Attempt to send message
    chrome.tabs.sendMessage(tab.id, { action: "insert-password", password })
      .catch(err => {
        // If connection fails (e.g. extension reloaded), inject script and retry
        console.log("Injection missing, re-injecting passwordGenerator.js...");

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["passwordGenerator.js"]
        }).then(() => {
          // Retry sending message after successful injection
          chrome.tabs.sendMessage(tab.id, { action: "insert-password", password });
        }).catch(err => console.error("Script injection failed: ", err));
      });
  }
});
