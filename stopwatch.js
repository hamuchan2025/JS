// ====== 画面の部品を取る ======
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const lapsEl = document.getElementById("laps");

// ====== ストップウォッチの中身 ======
let startTime = 0;     // スタートした瞬間の時刻
let elapsed = 0;       // たまった時間（ms）
let timerId = null;    // setInterval の番号

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatTime(ms) {
  const totalCentis = Math.floor(ms / 10); // 1/100秒（センチ秒）
  const centis = totalCentis % 100;

  const totalSeconds = Math.floor(totalCentis / 100);
  const seconds = totalSeconds % 60;

  const minutes = Math.floor(totalSeconds / 60);

  return `${pad2(minutes)}:${pad2(seconds)}.${pad2(centis)}`;
}

function render() {
  timeEl.textContent = formatTime(elapsed);
}

function start() {
  if (timerId !== null) return; // 二重スタート防止

  startTime = Date.now() - elapsed; // 途中から再開できるように
  timerId = setInterval(() => {
    elapsed = Date.now() - startTime;
    render();
  }, 10);

  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetBtn.disabled = false;
  lapBtn.disabled = false;
}

function stop() {
  if (timerId === null) return;

  clearInterval(timerId);
  timerId = null;

  startBtn.disabled = false;
  stopBtn.disabled = true;
  // reset と lap は止めても使える
}

function reset() {
  stop(); // 動いてたら止める
  elapsed = 0;
  lapsEl.innerHTML = "";
  render();

  resetBtn.disabled = true;
  lapBtn.disabled = true;
}

function lap() {
  const li = document.createElement("li");
  li.textContent = formatTime(elapsed);
  lapsEl.prepend(li); // 上に追加
}

// ====== ボタンのイベント ======
startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);
resetBtn.addEventListener("click", reset);
lapBtn.addEventListener("click", lap);

// 最初の表示
render();
