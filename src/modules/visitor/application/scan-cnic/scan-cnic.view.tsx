import React from 'react'

interface Props {
    videoRef: React.RefObject<HTMLVideoElement | null>
    canvasRef: React.RefObject<HTMLCanvasElement | null>
    capturedImageUrl: string | null
    message: string
    isProcessing: boolean
}

function ScanCnicView({ ...props }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-2xl">
                {/* Camera feed with visual guides */}
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                    <video 
                        ref={props.videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Card placement guide */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="border-2 border-dashed border-green-400 rounded-lg w-3/4 h-2/3 opacity-60 pointer-events-none"></div>
                    </div>
                    
                    {/* Processing overlay */}
                    {props.isProcessing && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                            <div className="text-center text-white p-6">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                                <h3 className="text-xl font-semibold">Processing ID Card</h3>
                                <p className="mt-2 text-green-300">Please wait...</p>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Hidden canvas */}
                <canvas ref={props.canvasRef} style={{ display: 'none' }} />
                
                {/* Status information */}
                <div className="mt-6 p-4 bg-white rounded-lg shadow-sm text-center">
                    <p className={`text-lg font-medium ${props.isProcessing ? 'text-blue-600' : 'text-gray-800'}`}>
                        {props.message}
                    </p>
                    {props.isProcessing && (
                        <p className="mt-2 text-sm text-gray-600">
                            This usually takes 2-3 seconds
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ScanCnicView