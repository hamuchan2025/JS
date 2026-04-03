const hole = document.getElementById("hole");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("start");

let score = 0;
let time = 10;
let gameTimer = null;
let moleTimeout = null;
let isActive = false;
let isPlaying = false;

// 白に戻す
function clearHole() {
  hole.classList.remove("active");
  isActive = false;
}

// モグラ出す
function showMole() {
  if (!isPlaying) return;

  clearHole();

  hole.classList.add("active");
  isActive = true;

  const showTime = Math.floor(Math.random() * 1600) + 800;

  moleTimeout = setTimeout(() => {
    clearHole();

    const waitTime = Math.floor(Math.random() * 1400) + 600;

    moleTimeout = setTimeout(showMole, waitTime);
  }, showTime);
}

// クリック
hole.addEventListener("click", () => {
  if (!isPlaying) return;

  if (isActive) {
    score++;
    scoreEl.textContent = score;

    clearTimeout(moleTimeout);
    clearHole();

    const nextTime = Math.floor(Math.random() * 700) + 300;
    moleTimeout = setTimeout(showMole, nextTime);
  }
});

// スタート
startBtn.addEventListener("click", () => {

  clearInterval(gameTimer);
  clearTimeout(moleTimeout);

  score = 0;
  time = 10;
  isPlaying = true;

  scoreEl.textContent = score;
  timeEl.textContent = time;
  clearHole();

  // ★ここがカウントダウン
  gameTimer = setInterval(() => {
    time--;
    timeEl.textContent = time;

    if (time <= 0) {
      clearInterval(gameTimer);
      clearTimeout(moleTimeout);
      clearHole();
      isPlaying = false;
      timeEl.textContent = 0;
      alert("終了！スコア：" + score);
    }
  }, 1000);

  showMole();
});