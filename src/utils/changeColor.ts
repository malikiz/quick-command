export async function changeColor() {
  chrome.storage.sync.set({color: "#3aa757"}, ()=>{});

  await chrome.tabs.query({active: true, currentWindow: true},
    (
      result => {
        const firstTabId = result[0].id

        if (firstTabId) {
          chrome.tabs.executeScript(firstTabId, { file: 'scripts/changeBgColor.js' }, function () {
            if (chrome.runtime.lastError) {
              console.error("Script injection failed: " + chrome.runtime.lastError.message);
            }
          })
        }
      }
    ));

}