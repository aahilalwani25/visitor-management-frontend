import React from 'react'

interface Props {
    videoRef: React.RefObject<HTMLVideoElement | null>
    canvasRef: React.RefObject<HTMLCanvasElement | null>
    captureImage: () => void
    startCamera: () => Promise<void>
    onSend: () => Promise<void>
    capturedImage: Blob | null
    capturedImageUrl: string | null
}

function ScanCnicView({ ...props }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <video ref={props.videoRef} autoPlay playsInline width="320" height="240" className="border" />
            <canvas ref={props.canvasRef} width="320" height="240" style={{ display: 'none' }} />

            <div className="mt-4 space-x-2">
                <button onClick={props.onSend} className="px-4 py-2 bg-purple-500 text-white rounded">
                    Scan
                </button>
            </div>
        </div>
    )
}

export default ScanCnicView
