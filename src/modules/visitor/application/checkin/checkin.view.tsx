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
function CheckinView({ ...props }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="relative w-[480px] h-[360px] shadow-lg rounded-lg overflow-hidden border border-gray-300">
                <video ref={props.videoRef} autoPlay playsInline width="480" height="360" className="border" />
            </div>
            <canvas ref={props.canvasRef} width="480" height="360" style={{ display: 'none' }} />

            <div className="mt-4 space-x-2">
                <button onClick={props.onSend} className="cursor-pointer px-4 py-2 bg-purple-500 text-white rounded">
                    Check-in/Check-out
                </button>
            </div>
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
