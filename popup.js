document.addEventListener("DOMContentLoaded", () => {
  let link = document.getElementById("youtube-link");
  let songInfo = document.getElementById("spotify-details");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "msg_from_popup" },
      (response) => {
        console.log(response);
        songInfo.innerHTML = response.inf;
        link.href = `${response.lin}`;
      }
    );
  });
});

// function linkClick(link) {
//   chrome.tabs.create({ url: link });
// }
