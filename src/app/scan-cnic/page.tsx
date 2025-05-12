"use client";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ws } from "@/config/socketConfig";
import { outputs } from "@/config/output";

// Define the possible types for the mutation result
type MutationResult = string;

export default function IDCardDetection() {
  const [detectionResult, setDetectionResult] = useState<string | null>(null);
  const [isDetectSuccessful, setIsDetectSuccessful] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);


  const { mutate: scanCnic, isPending } = useMutation({
    mutationKey: ['checkin'],
    onSuccess: (data) => {
      console.log(data)
      alert(data?.message)
    },
    onError: (data) => {
      if(data.message!=="'NoneType' object is not iterable"){
        alert(data?.message)
      }
    },
    mutationFn: (formData: FormData) => {
      return outputs.checkinOutput.scanCnic(formData);
    }
  })

  // Custom mutation with WebSocket communication
  useEffect(() => {
    ws.addEventListener("open", () => {
      console.log("Socket connected");
    });

    ws.addEventListener("message", (event) => {
      console.log("Message from server:", event.data);
      setIsLoading(false);
      setDetectionResult(event.data);

      if (event.data === "True") {
        setIsDetectSuccessful(true);
        // ✅ Prepare FormData to pass to scanCnic
        if (canvasRef.current) {
          canvasRef.current.toBlob((blob) => {
            if (blob) {
              const formData = new FormData();
              formData.append("file", blob, "cnic.jpg");
              scanCnic(formData);  // ✅ Now with the image
            }
          }, "image/jpeg");
        }
      }

      // Clear result after 3s
      setTimeout(() => {
        setDetectionResult(null);
        setIsDetectSuccessful(false);
      }, 3000);
    });



    return () => {
      ws.close(); // clean up
    };
  }, []);

  // Start webcam and capture a frame every few seconds
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Unable to access webcam.");
      }
    };

    startWebcam();
  }, []);

  // Capture frame and send to WebSocket
  useEffect(() => {
    if (detectionResult === null && !isDetectSuccessful) {
      const captureFrame = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;

        // Set canvas dimensions to match video frame
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        if (context) {
          // Draw the current video frame onto the canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert the canvas content to a Blob
          canvas.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64data = reader.result?.toString().split(",")[1]; // remove data:image/jpeg;base64,
                if (base64data) {
                  ws.send(base64data);
                  setIsLoading(true);
                }
              };
              reader.readAsDataURL(blob);
            }
          }, "image/jpeg");
        }
      };

      // Capture a frame every 3 seconds
      const interval = setInterval(captureFrame, 3000);
      return () => clearInterval(interval);
    }

  }, [detectionResult]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-2xl">
        {/* Camera feed with visual guides */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Card placement guide */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-dashed border-green-400 rounded-lg w-[65%] h-2/3 opacity-60 pointer-events-none"></div>
          </div>

          {/* Processing overlay */}
          {isPending && (
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
        <canvas ref={canvasRef} style={{display:"none"}} />

        {/* Status information */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm text-center">
          {/* <p className={`text-lg font-medium ${isLoading ? 'text-blue-600' : 'text-gray-800'}`}>
            {detectionResult}
          </p> */}
          {!isPending && (
            <p className="mt-2 text-sm text-gray-600">
              Align your card with the box
            </p>
          )}
        </div>
      </div>
    </div>

  );
}