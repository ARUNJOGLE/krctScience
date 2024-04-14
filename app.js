function fetchData() {
  Papa.parse("myData.csv", {
    download: true,
    header: true,
    complete: function (results) {
      const today = new Date();
      const index = today.getDate() % results.data.length; // Change content daily

      const {
        Title,
        AuthorName,
        Information,
        LatestTrends,
        MoreInfoLink,
        ImageOfAuthor,
      } = results.data[index];

      document.getElementById("titleAuthor").innerHTML = `
        <h2>${Title}</h2>
        <p>${AuthorName}</p>
      `;
      document.getElementById("info").innerHTML = `
        <h3>Information</h3>
        <p>${Information}</p>
        <p>Latest Trends: ${LatestTrends}</p>
      `;
      document.getElementById("authorImage").src = ImageOfAuthor;
      document.getElementById("authorImage").alt = `${AuthorName} Image`;
      document.getElementById("moreInfoBtn").href = MoreInfoLink;

      // Schedule next update
      calculateNextUpdate();
    },
    error: function (error) {
      console.error("Error parsing CSV:", error);
    },
  });
}

function calculateNextUpdate() {
  const now = new Date();
  const ISTOffset = 5.5; // IST is UTC+5:30
  const nowUTC = now.getTime() + now.getTimezoneOffset() * 60000;
  const nowIST = new Date(nowUTC + 3600000 * ISTOffset);

  let nextUpdate = new Date(nowIST);
  nextUpdate.setDate(nowIST.getDate() + (nowIST.getHours() >= 6 ? 1 : 0)); // If after 6:00 AM, set for next day
  nextUpdate.setHours(6, 0, 0, 0); // Set to 6:00 AM

  const delay = nextUpdate - nowIST; // Calculate delay until next update

  setTimeout(fetchData, delay);
}

// Initialize
fetchData();

// Function to update date and time
function updateDateTime() {
  const now = new Date();
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata", // IST timezone
  };
  const formattedDateTime = now.toLocaleString("en-US", options);
  document.getElementById("datetime").textContent = formattedDateTime;
}

// Update date and time every second
setInterval(updateDateTime, 1000);

// Initial call to update date and time immediately
updateDateTime();
