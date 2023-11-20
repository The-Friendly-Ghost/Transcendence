"use client"
import React, { useRef, useEffect } from 'react'

function Canvas(props: any) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const draw = (ctx: any, frameCount: number) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = '#000000'
        ctx.beginPath()
        ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI)
        ctx.fill()
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        let frameCount: number = 0;
        let animationFrameId: number;

        if (canvas != null) {
            const context = canvas.getContext('2d');
            //Our first draw
            //Our draw came here
            const render = () => {
                frameCount++
                draw(context, frameCount)
                animationFrameId = window.requestAnimationFrame(render)
            }
            render()

            return () => {
                window.cancelAnimationFrame(animationFrameId)
            }
            // if (context != null) {
            //     draw(context);
            // context.fillStyle = '#000000';
            // context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            // }
        }
    }, [draw])

    return (
        <canvas ref={canvasRef} {...props} />
    )
}

export default Canvas
