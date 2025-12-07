const draggables = document.querySelectorAll(".draggable");

draggables.forEach((el) => {
  let isDragging = false;
  let offsetX, offsetY;
  let lastClickTime = 0;
  let startX, startY;
  
  // 检查元素是否在链接内
  const parentLink = el.closest('a');
  const hasLink = parentLink !== null;

  el.addEventListener("mousedown", (e) => {
    // 如果是右键点击，直接返回
    if (e.button !== 0) return;
    
    e.stopPropagation();
    isDragging = false;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    startX = e.clientX;
    startY = e.clientY;
    
    // 如果是链接元素，暂时禁用点击
    if (hasLink) {
      parentLink.style.pointerEvents = 'none';
    }
    
    el.style.cursor = "grabbing";
    el.style.zIndex = 1000; // 确保拖拽时在最上层
  });

  document.addEventListener("mousemove", (e) => {
    if (!startX || !startY) return;
    
    // 计算移动距离
    const moveX = Math.abs(e.clientX - startX);
    const moveY = Math.abs(e.clientY - startY);
    
    // 如果移动距离超过阈值，则视为拖拽
    if (moveX > 5 || moveY > 5) {
      isDragging = true;
      
      // 更新位置
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", (e) => {
    if (!startX || !startY) return;
    
    if (!isDragging && hasLink) {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastClickTime;
      
      // 如果是双击（300ms内点击两次）
      if (timeDiff < 300) {
        // 防止默认行为并导航到链接
        e.preventDefault();
        window.location.href = parentLink.href;
      }
      
      lastClickTime = currentTime;
    }
    
    // 拖拽结束后恢复点击功能
    if (hasLink) {
      setTimeout(() => {
        parentLink.style.pointerEvents = 'auto';
      }, 50);
    }
    
    // 重置状态
    isDragging = false;
    el.style.cursor = "grab";
    el.style.zIndex = "auto";
    startX = null;
    startY = null;
  });
});

// 保持原有的滚动画布惯性代码不变
let isPanning = false;
let panStartX, panStartY, scrollLeft, scrollTop;
let velocityX = 0, velocityY = 0;
let panLastX = 0, panLastY = 0;
let inertiaInterval = null;

window.addEventListener("mousedown", (e) => {
  // 如果点击的是可拖拽元素，不触发画布拖拽
  if (e.target.classList.contains("draggable")) return;

  isPanning = true;
  panStartX = e.pageX;
  panStartY = e.pageY;
  scrollLeft = window.scrollX;
  scrollTop = window.scrollY;
  panLastX = panStartX;
  panLastY = panStartY;

  document.body.style.cursor = "grabbing";

  if (inertiaInterval) clearInterval(inertiaInterval);
});

window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;

  const x = e.pageX;
  const y = e.pageY;
  const walkX = x - panStartX;
  const walkY = y - panStartY;
  window.scrollTo(scrollLeft - walkX, scrollTop - walkY);

  velocityX = x - panLastX;
  velocityY = y - panLastY;
  panLastX = x;
  panLastY = y;
});

window.addEventListener("mouseup", () => {
  if (!isPanning) return;
  isPanning = false;
  document.body.style.cursor = "default";

  inertiaInterval = setInterval(() => {
    window.scrollBy(-velocityX * 0.5, -velocityY * 0.5);
    velocityX *= 0.9;
    velocityY *= 0.9;

    if (Math.abs(velocityX) < 0.5 && Math.abs(velocityY) < 0.5) {
      clearInterval(inertiaInterval);
    }
  }, 16);
});