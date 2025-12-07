// 获取元素
const introText = document.getElementById("introText");
const continueBtn = document.getElementById("continueBtn");

const nextContent = document.getElementById("nextContent");
const photos = nextContent.querySelectorAll("img");

const goNext = document.getElementById("goNext"); // 跳转按钮

let firstClickDone = false;

// 只有点击“点击继续”按钮时才触发下一段
continueBtn.addEventListener("click", () => {
    if (!firstClickDone) {
        firstClickDone = true;

        // 第一段淡出
        introText.style.opacity = 0;
        introText.style.transition = "1s";

        // 第二段淡入
        setTimeout(() => {
            nextContent.classList.remove("hidden");
            nextContent.style.opacity = 1;

            // 图片逐张淡入
            photos.forEach((img, i) => {
                setTimeout(() => {
                    img.style.opacity = 1;
                    img.style.transform = "scale(1)";
                }, i * 300);
            });

            // 按钮最后出现
            setTimeout(() => {
                goNext.style.opacity = 1;
            }, photos.length * 300 + 800);

        }, 1000);
    }
});

// 只有点击这个按钮才跳转
goNext.addEventListener("click", () => {
    window.location.href = "intro2.html"; // ←修改你的下一页
});

