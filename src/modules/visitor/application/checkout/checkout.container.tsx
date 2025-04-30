"use client";
import React, { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { outputs } from '@/config/output';
import CheckoutView from './checkout.view';

function CheckoutContainer() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
    const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null); // Add this new state

    const { mutate: checkin, isSuccess, isError, error, data } = useMutation({
        mutationKey: ['checkin'],
        mutationFn: (formData: FormData) => {
            return outputs.checkinOutput.checkout(formData);
        },
        onSuccess:(data)=>{
            alert(data?.message)
        },
        onError: (e)=>{
            alert(e.message)
        }
    })

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
        }
    };
    useEffect(() => {
        startCamera();
    }, []);

    // Modify captureImage to return a Promise<Blob>
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
            const imageBlob = await captureImage();  // <-- wait until you get the blob
            const formData = new FormData();
            formData.append('file', imageBlob, 'webcam.jpg');
            checkin(formData);
        } catch (error) {
            console.error('Error capturing image:', error);
        }
    };
    
    return (
        <>
            <CheckoutView
                capturedImageUrl={capturedImageUrl}
                capturedImage={capturedImage}
                onSend={onCheckin}
                canvasRef={canvasRef}
                videoRef={videoRef}
                startCamera={startCamera}
                captureImage={captureImage} />
        </>
    )
}

export default CheckoutContainer
