function render(cls = true) {
    // if(cls) ctx.clearRect(0, 0, cnv.width, cnv.height);
    if (cls) {
        ctx.save();
        ctx.fillStyle = '#ddd';
        ctx.fillRect(0, 0, canvasDesing.width, canvasDesing.height);
        ctx.restore();
    }
    fa.render(ctx);
    return;
}
