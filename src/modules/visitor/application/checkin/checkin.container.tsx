"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CheckinView from './checkin.view';
import { useMutation } from '@tanstack/react-query';
import { outputs } from '@/config/output';
import { useRouter } from 'next/navigation';
import * as faceapi from '@vladmandic/face-api';
function CheckinContainer() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
    const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
    const [faceStatus, setFaceStatus] = useState<string>('Align your face with the camera');
    const detectingRef = useRef(false);
    const router = useRouter();
    const { mutate: checkin } = useMutation({
        mutationKey: ['checkin'],
        mutationFn: (formData: FormData) => outputs.checkinOutput.checkin(formData),
        onSuccess: (data) => {
            setFaceStatus(data?.message);
            detectingRef.current = false;
            if (data?.data?.new_user_id) {
                router.push(`/create-visitor/${data?.data?.new_user_id}`);
            }
        },
        onError: (e) => {
            setFaceStatus(e?.message);
            console.error(e);
            detectingRef.current = false;
        }
    });
    const loadModels = useCallback(async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    }, []);
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.width = 640;
                videoRef.current.height = 480;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
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
        }
    };

    const detectFace = async () => {
        if (!videoRef.current || !canvasRef.current || detectingRef.current) return;
        const detection = await faceapi.detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
        );
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context?.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
        if (detection && context) {
            const { x, y, width, height } = detection.box;
            // Draw green box
            context.strokeStyle = 'lime';
            context.lineWidth = 3;
            context.strokeRect(x, y, width, height);
            setFaceStatus('Face detected! Stay still...');
            detectingRef.current = true;
            await onCheckin();
        } else {
            setFaceStatus('Align your face with the camera');
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await loadModels();
            await startCamera();
        };
        initialize();
        const interval = setInterval(() => detectFace(), 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <CheckinView
            capturedImageUrl={capturedImageUrl}
            capturedImage={capturedImage}
            onSend={onCheckin}
            canvasRef={canvasRef}
            videoRef={videoRef}
            startCamera={startCamera}
            captureImage={captureImage}
            faceStatus={faceStatus} // :point_left: new prop for user feedback
        />
    );
}
export default CheckinContainer;