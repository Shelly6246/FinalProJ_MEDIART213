document.addEventListener("DOMContentLoaded", () => {
    // 获取所有位置点图标和内容区域
    const spotIcons = document.querySelectorAll(".spot-icon");
    const contentArea = document.getElementById("content-area");
    
    // 跟踪每个图标的状态：0=默认图注，1=内容
    const spotStates = {};
    
    // 存储默认图注的HTML，用于切换回来
    const defaultMessageHTML = `
        <div class="default-message">
            <img src="asset/buslegend2.gif" alt="Click a spot on the map">
        </div>
    `;
    
    // 定义位置点数据 - 完全灵活的结构
    // 每个位置点可以有任意数量和类型的内容
    const spotData = {
        // 位置点1：包含GIF文字、文字、图片
        1: [
            { 
                type: "giftext", 
                value: "asset/gongbeixiaoquzhan1.gif",
                style: {
                    width: "250px",
                    height: "auto",
                    margin: "180px auto",
                    display: "block"
                }
            },
            { 
                type: "text", 
                value: "Line 198 and Line 70",
                style: {
                    fontSize: "16px",
                    lineHeight: "0",
                    textAlign: "center",
                    padding: "0px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "5px",
                    margin: "10px 0"
                }
            },
            { 
                type: "image", 
                value: "asset/DSC00029.jpg",
                style: {
                    width: "100%",
                    maxWidth: "350px",
                    height: "auto",
                    margin: "20px auto",
                    display: "block",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }
            }
        ],
        
        2: [
            { 
                type: "giftext", 
                value: "asset/huangchaohuayuanxi1.gif",
                style: {
                    width: "250px",
                    height: "auto",
                    margin: "180px auto",
                    display: "block"
                }
            },
            { 
                type: "text", 
                value: "Line 70",
                style: {
                    fontSize: "16px",
                    lineHeight: "0",
                    textAlign: "center",
                    padding: "0px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "5px",
                    margin: "10px 0"
                }
            },
            { 
                type: "image", 
                value: "asset/DSC00221.jpg",
                style: {
                    width: "100%",
                    maxWidth: "350px",
                    height: "auto",
                    margin: "20px auto",
                    display: "block",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }
            }
        ],
        
        // 位置点3：多个图片和文字混合
        3: [
            { 
                type: "text", 
                value: "TBC",
                style: {
                    fontSize: "18px",
                    textAlign: "center",
                    marginBottom: "20px",
                    fontWeight: "bold"
                }
            }
        ]
    };
    
    // 初始化所有图标状态为默认图注
    spotIcons.forEach(icon => {
        const spotId = icon.getAttribute("data-id");
        spotStates[spotId] = 0; // 0表示显示默认图注
    });
    
    // 创建内容元素
    function createContentElement(item) {
        const element = document.createElement("div");
        
        switch(item.type) {
            case "title":
                element.className = "content-item item-title";
                element.innerHTML = `<h2>${item.value}</h2>`;
                break;
                
            case "text":
                element.className = "content-item item-text";
                element.textContent = item.value;
                break;
                
            case "image":
                element.className = "content-item item-image";
                const img = document.createElement("img");
                img.src = item.value;
                img.alt = "Content Image";
                element.appendChild(img);
                break;
                
            case "giftext":
                element.className = "content-item item-giftext";
                const gifImg = document.createElement("img");
                gifImg.src = item.value;
                gifImg.alt = "Animated Text";
                element.appendChild(gifImg);
                break;
                
            case "custom":
                // 自定义HTML，直接插入
                element.innerHTML = item.value;
                break;
                
            case "columns":
                element.className = "content-item item-columns";
                if (item.columns && Array.isArray(item.columns)) {
                    item.columns.forEach(column => {
                        const colDiv = document.createElement("div");
                        colDiv.className = "item-column";
                        colDiv.textContent = column.value;
                        element.appendChild(colDiv);
                    });
                }
                break;
                
            case "list":
                element.className = "content-item";
                const list = document.createElement("ul");
                list.className = "item-list";
                if (item.items && Array.isArray(item.items)) {
                    item.items.forEach(itemText => {
                        const li = document.createElement("li");
                        li.textContent = itemText;
                        list.appendChild(li);
                    });
                }
                element.appendChild(list);
                break;
                
            default:
                // 默认作为普通文本处理
                element.className = "content-item";
                element.textContent = item.value;
        }
        
        // 应用自定义样式（关键添加！）
        if (item.style) {
            Object.keys(item.style).forEach(styleKey => {
                element.style[styleKey] = item.style[styleKey];
            });
        }
        
        return element;
    }
    
    // 显示位置点内容
    function showSpotContent(spotId) {
        const data = spotData[spotId];
        
        if (!data) {
            // 如果没有定义数据，显示默认消息
            contentArea.innerHTML = defaultMessageHTML;
            return;
        }
        
        // 清空内容区域
        contentArea.innerHTML = '';
        
        // 创建内容容器
        const container = document.createElement("div");
        container.className = "content-container";
        
        // 添加所有内容项
        data.forEach(item => {
            const contentElement = createContentElement(item);
            container.appendChild(contentElement);
        });
        
        // 将内容添加到显示区域
        contentArea.appendChild(container);
        
        // 更新状态为显示内容
        spotStates[spotId] = 1;
    }
    
    // 显示默认图注
    function showDefaultMessage() {
        contentArea.innerHTML = defaultMessageHTML;
    }
    
    // 为每个位置点图标添加点击事件
    spotIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const spotId = icon.getAttribute("data-id");
            
            // 切换状态
            if (spotStates[spotId] === 0) {
                // 当前显示默认图注，切换到内容
                showSpotContent(spotId);
            } else {
                // 当前显示内容，切换回默认图注
                showDefaultMessage();
                spotStates[spotId] = 0;
            }
            
            // 为当前点击的图标添加视觉反馈
            icon.style.transform = "translate(-50%, -50%) scale(1.2)";
            setTimeout(() => {
                icon.style.transform = "translate(-50%, -50%) scale(1)";
            }, 300);
        });
    });
    
    // 键盘导航支持
    document.addEventListener("keydown", (e) => {
        // 数字键1-4对应位置点
        if (e.key >= '1' && e.key <= '4') {
            const spotId = e.key;
            const icon = document.querySelector(`.spot-icon[data-id="${spotId}"]`);
            
            if (icon) {
                // 模拟点击
                icon.click();
            }
        }
    });
});