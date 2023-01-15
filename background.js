const color = "#3aa757";
// 插件后端,和插件前端交互
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color });
    console.log(`[Coloring] default background color is set to: ${color}`);
});

// 后端添加一个监听,如有capture事件,就捕获截图,返回给前端
chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req.message === 'capture') {
        chrome.storage.sync.get((config) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
                chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (image) => {
                    // image is base64
                    res({ message: 'image', image })
                })
            })
        })
    }
    return true
})