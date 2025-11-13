const songs = [
  { id: 1, title: "שיר לשבת – מנוחת הנשמה", file: "songs/1.md" },
  { id: 2, title: "שיר לשבת – נר ואור", file: "songs/2.md" },
  { id: 3, title: "שיר לשבת – כנפי השכינה", file: "songs/3.md" },
  { id: 4, title: "שיר לשבת – ניגון הלב", file: "songs/4.md" },
  { id: 5, title: "שיר לשבת – שבילי האור", file: "songs/5.md" },
  { id: 6, title: "שיר לשבת – ברכת השלום", file: "songs/6.md" },
  { id: 7, title: "שיר לשבת – מתנת השקט", file: "songs/7.md" },
  { id: 8, title: "שיר לשבת – נרות התקווה", file: "songs/8.md" },
  { id: 9, title: "שיר לשבת – זמני הנצח", file: "songs/9.md" },
  { id: 10, title: "שיר לשבת – אור מחבק", file: "songs/10.md" },
  { id: 11, title: "שיר לשבת – ברכות השקט", file: "songs/11.md" },
  { id: 12, title: "שיר לשבת – אור של תקווה", file: "songs/12.md" },
  { id: 13, title: "שיר לשבת – ניגון של חיבור", file: "songs/13.md" },
  { id: 14, title: "שיר לשבת – אור של אהבה", file: "songs/14.md" },
  { id: 15, title: "שיר לשבת – נשימה של רוגע", file: "songs/15.md" },
  { id: 16, title: "שיר לשבת – צליל של שלווה", file: "songs/16.md" },
  { id: 17, title: "שיר לשבת – זמן של יחד", file: "songs/17.md" },
];

async function loadSongs() {
  const container = document.getElementById("songs-container");

  for (const song of songs) {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    const card = document.createElement("div");
    card.className = "card song-card";
    card.onclick = () => openSong(song);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body text-center";

    try {
      const response = await fetch(song.file);
      const content = await response.text();

      // Extract emojis from title
      const emojiMatch = content.match(/🌟|🎶|🌅|✨|🕯️|🌸|🌼|🌿|🌙/g);
      const emojis = emojiMatch ? emojiMatch.join(" ") : "";

      cardBody.innerHTML = `
                <div class="emoji-title">${emojis}</div>
                <h5 class="card-title">${song.title}</h5>
            `;
    } catch (error) {
      cardBody.innerHTML = `
                <h5 class="card-title">${song.title}</h5>
            `;
    }

    card.appendChild(cardBody);
    col.appendChild(card);
    container.appendChild(col);
  }
}

async function openSong(song) {
  const modal = new bootstrap.Modal(document.getElementById("songModal"));
  const modalTitle = document.querySelector(".modal-title");
  const modalBody = document.querySelector(".modal-body");

  modalTitle.textContent = song.title;
  modalBody.innerHTML = '<div class="text-center">טוען...</div>';

  try {
    const response = await fetch(song.file);
    const content = await response.text();
    modalBody.innerHTML = marked.parse(content);
  } catch (error) {
    modalBody.innerHTML =
      '<div class="text-center text-danger">שגיאה בטעינת השיר</div>';
  }

  modal.show();
}

document.addEventListener("DOMContentLoaded", loadSongs);
