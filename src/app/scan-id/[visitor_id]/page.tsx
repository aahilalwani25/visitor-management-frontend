"use client";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { outputs } from "@/config/output";
import { useParams, useRouter } from "next/navigation";
import { CreateUserFormData } from "@/modules/visitor/visitor";
import { CLEAR_RESULT, EVERY_SECOND_DETECTION } from "@/constants";


export default function IDCardDetection() {
  const [detectionResult, setDetectionResult] = useState<string | null>(null);
  const [isDetectSuccessful, setIsDetectSuccessful] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const detectionCountRef = useRef(0); // <-- NEW
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const params = useParams();
  const visitor_id = params?.visitor_id?.toString();
  const router = useRouter();

  const onCreateUser = (data: CreateUserFormData): Promise<CreateUserSuccess> => {
    return outputs.checkinOutput.createVisitor(data);
  };

  const { mutate: onSubmitUserInformation, isPending: isCreateUserPending } = useMutation({
    mutationKey: ['create-visitor'],
    mutationFn: onCreateUser,
    onSuccess: (data) => {
      alert(data?.message);
      detectionCountRef.current = 0;
      router.replace('/');
    },
    onError: (e) => {
      alert(e.message)
    }
  });

  const { mutate: scanCnic, isPending } = useMutation({
    mutationKey: ['checkin'],
    onSuccess: (data) => {
      onSubmitUserInformation({
        full_name: data?.data?.full_name!,
        cnic: data?.data?.cnic,
        check_in: new Date().toISOString(),
        user_id: visitor_id!
      })
    },
    onError: (data) => {
      if (data.message !== "'NoneType' object is not iterable") {
        alert(data?.message)
        detectionCountRef.current = 0;
      }
    },
    mutationFn: (formData: FormData) => {
      return outputs.checkinOutput.scanCnic(formData);
    }
  })

  // Custom mutation with WebSocket communication
  useEffect(() => {
    if (!wsRef.current) {
      const socket = new WebSocket("ws://localhost:8000/ws/detect-cnic");
      wsRef.current = socket;

      socket.addEventListener("open", () => {
        console.log("Socket connected");
      });

      socket.addEventListener("message", (event) => {
        console.log("Message from server:", event.data);
        setDetectionResult(event.data);

        if (event.data === "True") {
          if (detectionCountRef.current >= 3) {
            setIsDetectSuccessful(true);
            if (canvasRef.current) {
              canvasRef.current.toBlob((blob) => {
                if (blob) {
                  const formData = new FormData();
                  formData.append("file", blob, "cnic.jpg");
                  scanCnic(formData);
                }
              }, "image/jpeg");
            }
          } else {
            detectionCountRef.current += 1;
          }
        }

        setTimeout(() => {
          setDetectionResult(null);
          setIsDetectSuccessful(false);
        }, CLEAR_RESULT);
      });

      socket.addEventListener("close", () => {
        console.log("Socket closed");
      });

      socket.addEventListener("error", (err) => {
        console.error("Socket error:", err);
      });
    }

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
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
                  console.log("sendingggggg");
                  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(base64data);
                  }
                }
              };
              reader.readAsDataURL(blob);
            }
          }, "image/jpeg");
        }
      };

      // Capture a frame every 1 seconds
      const interval = setInterval(captureFrame, EVERY_SECOND_DETECTION);
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
            <div className={`border-4 border-dashed ${detectionCountRef.current >= 2 ? "border-green-600" : "border-red-600"} rounded-lg w-[65%] h-2/3 opacity-60 pointer-events-none`}></div>
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
        <canvas ref={canvasRef} style={{ display: "none" }} />

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