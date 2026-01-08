(async () => {

    const socket = io();
    const canvas = document.querySelector('.whiteboard');
    const colors = document.querySelectorAll('.color');
    const context = canvas.getContext('2d');

    const current = {
        color: 'black'
    };
    let drawing = false;

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    // Use the throttle function to limit the number of events per second
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
    
    // Touch support for mobile devices
    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

    colors.forEach(color => color.addEventListener('click', onColorUpdate, false));

    socket.on('drawing', onDrawingEvent);

    window.addEventListener('resize', onResize, false);
    onResize();

    function drawLine(x0, y0, x1, y1, color, emit) {
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.stroke();
        context.closePath();

        if (!emit) return;
        const w = canvas.width;
        const h = canvas.height;

        socket.emit('drawing', {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: color
        });
    }

    function onMouseDown(e) {
        drawing = true;
        current.x = e.clientX || e.touches[0].clientX;
        current.y = e.clientY || e.touches[0].clientY;
    }

    function onMouseUp(e) {
        if (!drawing) return;
        drawing = false;
        drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
    }

    function onMouseMove(e) {
        if (!drawing) return;
        drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
        current.x = e.clientX || e.touches[0].clientX;
        current.y = e.clientY || e.touches[0].clientY;
    }

    function onColorUpdate(e) {
        current.color = e.target.className.split(' ')[1];
    }

    // Limit the number of events per second
    function throttle(callback, delay) {
        let previousCall = Date.now();
        return function(...args) {
            const time = Date.now();

            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback(...args);
            }
        };
    }

    function onDrawingEvent(data) {
        const w = canvas.width;
        const h = canvas.height;
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    }

    // Make the canvas fill its parent
    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

})();
