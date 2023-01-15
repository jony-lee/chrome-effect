document.onkeydown = function(e) {
    if (!e.altKey) {
        return
    }
    if (e.code == "KeyF") {
        e.preventDefault()
        document.querySelector('input[type="text"],input[type="search"],input[autocomplete]').focus()
        document.querySelector('input[type="text"],input[type="search"],input[autocomplete]').select()
    }
    console.log(e);
    if (e.code == "KeyC") {
        setTimeout(() => {
            chrome.runtime.sendMessage({
                message: 'capture'
            }, (res) => {
                console.log(res);
                var [header, base64] = res.image.split(',')
                var [_, type] = /data:(.*);base64/.exec(header)
                var binary = atob(base64)
                var array = Array.from({ length: binary.length })
                    .map((_, index) => binary.charCodeAt(index))
                navigator.clipboard.write([
                    new ClipboardItem({
                        // jpeg is not supported on write, though the encoding is preserved
                        'image/png': new Blob([new Uint8Array(array)], { type: 'image/png' })
                    })
                ]).then(() => {
                    Toast("全屏已复制到剪贴板中")
                })
            })
        }, 50)
    }
}

function Toast(msg, duration) {
    duration = isNaN(duration) ? 2000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "color: rgb(255,255,255);background-color: rgb(17 140 0 / 74%);padding: 10px 15px;margin: 0 0 2% 2%;border-radius: 4px;position: fixed; top: 10%;right:10px;width: 220px;text-align: center;z-level:9999";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}