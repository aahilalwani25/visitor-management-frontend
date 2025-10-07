import React from 'react'

interface Props {
    videoRef: React.RefObject<HTMLVideoElement | null>
    canvasRef: React.RefObject<HTMLCanvasElement | null>
    capturedImage: Blob | null
    capturedImageUrl: string | null
    faceStatus: string
}
function FaceRecognitionView({ ...props }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 text-black">
    <h1 className="text-2xl font-bold mb-4">Face Check-in</h1>

    {/* Step Instructions */}
    <div className="mb-6 text-center">
        <p className="text-lg font-semibold mb-1">Step 1: Align your face in the camera frame</p>
        <p className="text-sm text-black">
            Make sure your head is centered and clearly visible
        </p>
    </div>

    {/* Video & Canvas Wrapper */}
    <div className="relative w-[640px] h-[480px] border-4 border-blue-500 rounded-lg overflow-hidden">
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

        {/* Overlay guidance text */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded">
            Please center your face
        </div>
    </div>

    {/* Captured Image Preview */}
    {props.capturedImageUrl && (
        <div className="mt-6">
            <p className="text-sm text-gray-400 mb-1">Captured Snapshot:</p>
            <img
                src={props.capturedImageUrl}
                alt="Captured"
                className="w-[240px] h-auto rounded border"
            />
        </div>
    )}

    {/* Face Status */}
    <div className="mt-4 text-sm italic text-green-400">{props.faceStatus}</div>
</div>

    )
}
export default FaceRecognitionView