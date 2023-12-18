"use client"
import React, { useRef } from 'react'

function Canvas(props: any) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    return (
        <canvas ref={canvasRef} {...props} />
    )
}

export default Canvas
