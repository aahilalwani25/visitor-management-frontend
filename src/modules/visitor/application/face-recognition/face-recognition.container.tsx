'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { outputs } from '@/config/output';
import { useRouter } from 'next/navigation';
import * as faceapi from '@vladmandic/face-api';
import FaceRecognitionView from './face-recognition.view';

function FaceRecognitionContainer() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
    const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
    const [faceStatus, setFaceStatus] = useState<string>('Align your face with the camera');

    const detectingRef = useRef(false);
    const isProcessingRef = useRef(false); // ✅ NEW REF to guard against multiple calls
    const router = useRouter();

    const closeCamera = () => {
        const videoElement = videoRef.current;
        if (videoElement && videoElement.srcObject instanceof MediaStream) {
            const stream = videoElement.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
        }
    };

    const { mutate: checkin } = useMutation({
        mutationKey: ['checkin'],
        mutationFn: (formData: FormData) => outputs.checkinOutput.checkin(formData),
        onSuccess: (data) => {
            detectingRef.current = false;
            isProcessingRef.current = false; // ✅ Reset processing flag
            closeCamera();
            if (data?.data?.new_user_id) {
                router.push(`/choose-entry-method/${data?.data?.new_user_id}`);
            } else if(data?.data?.existing_user_id) {
                router.push(`/checkin?message=${data?.message}`);
            } else {
                router.push(`/checkout?message=${data?.message}`);
            }
        },
        onError: (e) => {
            setFaceStatus(e?.message || 'Check-in failed.');
            console.error(e);
            detectingRef.current = false;
            isProcessingRef.current = false; // ✅ Reset on error
        }
    });

    const loadModels = useCallback(async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });

            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (video) {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();

                    const actualWidth = video.videoWidth;
                    const actualHeight = video.videoHeight;

                    video.width = actualWidth;
                    video.height = actualHeight;

                    if (canvas) {
                        canvas.width = actualWidth;
                        canvas.height = actualHeight;
                    }
                };
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setFaceStatus('Unable to access camera.');
        }
    };

    const captureImage = (): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if (!video || !canvas || !context) {
                reject(new Error('Missing video or canvas elements'));
                return;
            }
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (blob) {
                    const imageUrl = URL.createObjectURL(blob);
                    setCapturedImage(blob);
                    setCapturedImageUrl(imageUrl);
                    resolve(blob);
                } else {
                    reject(new Error('Failed to capture image'));
                }
            }, 'image/jpeg');
        });
    };

    const onCheckin = async () => {
        // ✅ Prevent multiple triggers
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        try {
            setFaceStatus('Processing...');
            const imageBlob = await captureImage();
            const formData = new FormData();
            formData.append('file', imageBlob, 'webcam.jpg');
            checkin(formData);
        } catch (error) {
            console.error('Error capturing image:', error);
            setFaceStatus('Error capturing image.');
            detectingRef.current = false;
            isProcessingRef.current = false; // Reset on error
        }
    };

    useEffect(() => {
        let detectionStartTime: number | null = null;
        let intervalId: NodeJS.Timeout;

        const detectContinuously = async () => {
            if (!videoRef.current || !canvasRef.current || detectingRef.current || isProcessingRef.current) return;

            const detection = await faceapi.detectSingleFace(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions()
            );

            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context?.clearRect(0, 0, canvas.width, canvas.height);

            if (detection) {
                const { x, y, width, height } = detection.box;
                context!.strokeStyle = 'lime';
                context!.lineWidth = 3;
                context!.strokeRect(x, y, width, height);

                setFaceStatus('Face detected! Hold still...');
                const now = Date.now();

                if (!detectionStartTime) {
                    detectionStartTime = now;
                } else if (now - detectionStartTime > 2000) {
                    detectingRef.current = true;
                    setFaceStatus('Capturing...');
                    await onCheckin(); // Only called once due to isProcessingRef
                }
            } else {
                setFaceStatus('Align your face with the camera');
                detectionStartTime = null;
            }
        };

        const initialize = async () => {
            await loadModels();
            await startCamera();
            intervalId = setInterval(detectContinuously, 200);
        };

        initialize();

        return () => {
            clearInterval(intervalId);
            closeCamera();
        };
    }, []);

    return (
        <FaceRecognitionView
            capturedImageUrl={capturedImageUrl}
            capturedImage={capturedImage}
            canvasRef={canvasRef}
            videoRef={videoRef}
            faceStatus={faceStatus}
        />
    );
}

export default FaceRecognitionContainer;
