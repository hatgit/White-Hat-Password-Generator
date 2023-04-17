console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "insert-password") {
    const activeElement = document.activeElement;
    activeElement.value = request.password;
  }
});