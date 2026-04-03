// ===============================
// Swiper：ループあり・戻っても同じ画像・ちらつき無し
// ＋ クリック時「ふわっ」遷移
// ===============================

// ===== 追加：効果音 =====
const seNext = new Audio("sound/cursor.mp3");
const sePrev = new Audio("sound/cursor.mp3");
const seClick = new Audio("sound/yoroshiku.mp3");

function playSE(audio){
  audio.currentTime = 0;
  audio.play();
}
// ===== 追加ここまで =====

const SAVE_KEY = "swiperIndex";
const swiperEl = document.querySelector(".swiper");

// まず非表示のまま開始（CSS: .swiper は opacity:0、.is-ready で表示）
swiperEl.classList.remove("is-ready");

// 保存値（本物の番号）を先に取得
const savedIndex = Number(sessionStorage.getItem(SAVE_KEY) ?? 0);

// Swiper 初期化
const swiper = new Swiper(".swiper", {
  direction: "horizontal",
  loop: true,
  initialSlide: savedIndex,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  on: {
    init() {
      // loopのクローンずれ補正（アニメ無し）
      this.slideToLoop(savedIndex, 0, false);
    },
    imagesReady() {
      // 画像が揃ったら表示（ちらつき防止）
      swiperEl.classList.add("is-ready");
    },
  },
});

// ===== 追加：矢印クリックで音 =====
document.querySelector(".swiper-button-next").addEventListener("click", function(){
  playSE(seNext);
});

document.querySelector(".swiper-button-prev").addEventListener("click", function(){
  playSE(sePrev);
});
// ===== 追加ここまで =====

// スライド変更時に「本物の番号」を保存
swiper.on("slideChange", () => {
  sessionStorage.setItem(SAVE_KEY, String(swiper.realIndex));
});

// クリックで別ページへ行くとき：保存＋ふわっとしてから遷移
document.querySelectorAll(".swiper-link").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();

    // ★ 追加：画像クリックで yoroshiku.mp3
    playSE(seClick);

    // どの画像からでも正しく保存
    sessionStorage.setItem(SAVE_KEY, String(swiper.realIndex));

    // “ふわっ”演出（CSSで .swiper.is-leaving を作る）
    swiperEl.classList.add("is-leaving");

    // 少し待ってから移動
    const url = a.getAttribute("href");
    setTimeout(() => {
      location.href = url;
    }, 1500);
  });
});

// 戻る対策（bfcache）：正しい位置へ（アニメ無し）→表示
window.addEventListener("pageshow", () => {
  const idx = Number(sessionStorage.getItem(SAVE_KEY) ?? 0);
  swiper.slideToLoop(idx, 0, false);
  swiperEl.classList.add("is-ready");
});