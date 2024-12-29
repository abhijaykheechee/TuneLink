console.log("content.js running");
let videoLink, songName;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.link) {
    console.log("Message received from background = ", request.resultLink);
    songName = request.info;
    videoLink = request.link;

    sendResponse("Link Received");
    console.log("Response sent to background");
  } else if (request.type === "msg_from_popup") {
    console.log("Message received from popup");
    sendResponse({ lin: videoLink, inf: songName });
    return true;
  }
  return true;
});
