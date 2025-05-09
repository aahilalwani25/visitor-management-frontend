import React from 'react'

interface Props {
    videoRef: React.RefObject<HTMLVideoElement | null>
    canvasRef: React.RefObject<HTMLCanvasElement | null>
    captureImage: () => void
    startCamera: () => Promise<void>
    onSend: () => Promise<void>
    capturedImage: Blob | null
    capturedImageUrl: string | null
    faceStatus: string
}
function CheckinView({ ...props }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className='text-xl text-white'>{props.faceStatus}</h1>
            <div className="relative w-[640px] h-[480px]">
                <video
                    ref={props.videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                />
                <canvas
                    ref={props.canvasRef}
                    width={640}
                    height={480}
                    className="absolute top-0 left-0 z-10"
                />
            </div>
            <canvas ref={props.canvasRef} width="480" height="360" style={{ display: 'none' }} />
            {props.capturedImageUrl && (
                <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-1">Captured Snapshot:</p>
                    <img
                        src={props.capturedImageUrl}
                        alt="Captured"
                        className="w-[240px] h-auto rounded border"
                    />
                </div>
            )}
        </div>

    )
}

export default CheckinView
