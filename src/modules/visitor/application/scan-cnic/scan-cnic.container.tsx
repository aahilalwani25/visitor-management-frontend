"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { outputs } from '@/config/output';
import ScanCnicView from './scan-cnic.view';

function ScanCnicContainer() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
    const [message, setMessage] = useState('Position your ID card in the frame');
    const [isProcessing, setIsProcessing] = useState(false);
    const [detectionCount, setDetectionCount] = useState(0);
    const detectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const frameAnalysisRef = useRef<number | null>(null);

    const { mutate: checkin } = useMutation({
        mutationKey: ['checkin'],
        onSuccess: (data) => {
            setMessage(data?.message || 'ID processed successfully');
            setIsProcessing(false);
            setDetectionCount(0);
            // Reset for next scan after 3 seconds
            setTimeout(() => setMessage('Position next ID card in frame'), 3000);
        },
        onError: (error: any) => {
            setMessage(error?.message || 'Processing failed. Reposition card.');
            setIsProcessing(false);
            setDetectionCount(0);
        },
        mutationFn: (formData: FormData) => {
            return outputs.checkinOutput.scanCnic(formData);
        }
    });

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment'
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setMessage('Position your ID card in frame');
            setDetectionCount(0);
        } catch (err: any) {
            console.error("Camera error:", err);
            setMessage(`Camera error: ${err.message || 'Please enable permissions'}`);
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            // Cleanup all resources
            if (detectionTimeoutRef.current) clearTimeout(detectionTimeoutRef.current);
            if (frameAnalysisRef.current) cancelAnimationFrame(frameAnalysisRef.current);
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    const captureImage = (): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');

            if (!video || !canvas || !ctx || video.readyState !== 4) {
                reject(new Error('Video not ready'));
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (blob) {
                    setCapturedImageUrl(URL.createObjectURL(blob));
                    resolve(blob);
                } else {
                    reject(new Error('Failed to create image blob'));
                }
            }, 'image/jpeg', 0.9);
        });
    };

    const detectCardPresence = async (blob: Blob): Promise<boolean> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(blob);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(false);

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                // Enhanced edge detection with Sobel operator
                const edgeThreshold = 50;
                let edgePixels = 0;
                const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
                const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

                // Analyze center 50% of image
                const startX = canvas.width * 0.25;
                const endX = canvas.width * 0.75;
                const startY = canvas.height * 0.25;
                const endY = canvas.height * 0.75;

                for (let y = startY; y < endY; y += 2) {
                    for (let x = startX; x < endX; x += 2) {
                        let pixelX = 0;
                        let pixelY = 0;

                        for (let i = -1; i <= 1; i++) {
                            for (let j = -1; j <= 1; j++) {
                                const idx = ((y + i) * canvas.width + (x + j)) * 4;
                                const intensity = (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3;
                                pixelX += intensity * sobelX[i + 1][j + 1];
                                pixelY += intensity * sobelY[i + 1][j + 1];
                            }
                        }

                        const gradient = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
                        if (gradient > edgeThreshold) edgePixels++;
                    }
                }

                const edgeDensity = edgePixels / ((endX - startX) * (endY - startY) / 4);
                resolve(edgeDensity > 0.1); // Adjust threshold as needed
            };

            img.onerror = () => resolve(false);
        });
    };

    const analyzeFrame = async () => {
        if (isProcessing) return;

        try {
            const blob = await captureImage();
            const hasCard = await detectCardPresence(blob);

            if (hasCard) {
                const newCount = detectionCount + 1;
                setDetectionCount(newCount);
                setMessage(`Verifying ID (${newCount}/3)`);

                if (newCount >= 3) {
                    setIsProcessing(true);
                    setMessage('Processing ID card...');

                    const formData = new FormData();
                    formData.append('file', blob, 'id_card.jpg');
                    checkin(formData);
                } else {
                    detectionTimeoutRef.current = setTimeout(() => {
                        frameAnalysisRef.current = requestAnimationFrame(analyzeFrame);
                    }, 300);
                }
            } else {
                setDetectionCount(0);
                setMessage('Position ID card in frame');
                frameAnalysisRef.current = requestAnimationFrame(analyzeFrame);
            }
        } catch (error) {
            console.error('Analysis error:', error);
            frameAnalysisRef.current = requestAnimationFrame(analyzeFrame);
        }
    };

    useEffect(() => {
        if (!isProcessing) {
            frameAnalysisRef.current = requestAnimationFrame(analyzeFrame);
        }
        return () => {
            if (frameAnalysisRef.current) {
                cancelAnimationFrame(frameAnalysisRef.current);
            }
        };
    }, [isProcessing, detectionCount]);

    return (
        <ScanCnicView
            videoRef={videoRef}
            canvasRef={canvasRef}
            capturedImageUrl={capturedImageUrl}
            message={message}
            isProcessing={isProcessing}
        />
    );
}

export default ScanCnicContainer;