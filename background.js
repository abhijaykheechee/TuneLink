console.log("background.js running");

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.title) {
    let changedTitle = changeInfo.title;
    let resultLink, searchQuery;

    if (!changedTitle.includes("•")) {
      resultLink = "A song is not playing on Spotify";
    } else {
      try {
        const [name, artists] = extractSongInfo(changedTitle);
        searchQuery = name + " - " + artists.join(",");
        const ytLink = await fetchLink(searchQuery);
        resultLink = "https://www.youtube.com/watch?v=" + ytLink;
      } catch (error) {
        resultLink = "Error fetching YouTube Link";
      }

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let activeTab = tabs[0];
        console.log(`Sending message to content.js for ${activeTab.title}`);
        chrome.tabs.sendMessage(
          activeTab.id,
          {
            link: resultLink,
            info: searchQuery,
          },
          function (response) {
            console.log(response);
          }
        );
      });
    }
  }
});

function extractSongInfo(info) {
  if (info.includes("•")) {
    let arr = info.split("•");
    let name = arr[0].trim();
    let artists = arr[1].trim().split(",");
    return [name, artists];
  }
}

async function fetchLink(searchQuery) {
  const youtubeApiKey = YOUR_YOUTUBE_API_KEY;
  try {
    const result = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&q=${searchQuery}&part=snippet&type=video`
    );
    const data = await result.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      if (videoId) {
        return videoId;
      } else {
        console.log("No video ID found");
      }
    } else {
      console.log("No search results");
    }
  } catch (error) {
    console.log("fetchLink error = ", error);
  }
}
