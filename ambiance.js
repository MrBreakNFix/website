document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'ambiance-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const dots = [];
    const numDots = 200;
    const maxDistance = 200;
    const speedMultiplier = 1.2;

    function init() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        for (let i = 0; i < numDots; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * speedMultiplier,
                vy: (Math.random() - 0.5) * speedMultiplier
            });
        }
        animate();

        // Gradually reveal the canvas
        canvas.style.opacity = '1';
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < numDots; i++) {
            const dot = dots[i];
            dot.x += dot.vx;
            dot.y += dot.vy;

            if (dot.x < 0 || dot.x > canvas.width) {
                dot.vx *= -1;
            }
            if (dot.y < 0 || dot.y > canvas.height) {
                dot.vy *= -1;
            }

            ctx.beginPath();
            ctx.fillStyle = '#333333'; // Darker dots
            ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < numDots; j++) {
                const dot2 = dots[j];
                const distance = Math.sqrt((dot.x - dot2.x) ** 2 + (dot.y - dot2.y) ** 2);
                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(51, 51, 51, ${1 - distance / maxDistance})`; // Darker lines
                    ctx.moveTo(dot.x, dot.y);
                    ctx.lineTo(dot2.x, dot2.y);
                    ctx.stroke();
                }
            }
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    }

    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
});
