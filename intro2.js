document.addEventListener("DOMContentLoaded", () => {

  const sequence = ["text-1", "text-2", "text-3", "next-button"];
  let index = 0;

  function showNext() {
    if (index >= sequence.length) return;

    const block = document.getElementById(sequence[index]);
    block.style.opacity = "1";

    index++;

    // 最后出现 next 按钮，停止全屏点击
    if (index === sequence.length) {
      document.removeEventListener("click", clickHandler);

      document.getElementById("next-page").addEventListener("click", () => {
        window.location.href = "index2.html";
      });
    }
  }

  function clickHandler(e) {
    if (e.target.id === "next-page") return;
    showNext();
  }

  // 初始显示第一段
  showNext();

  document.addEventListener("click", clickHandler);
});


