import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BlobInspectState } from "./types.ts";

interface UseDefectDetectionOptions {
    getCurrentFrame: () => Promise<string | Blob | null>;
    throttleInterval?: number;
}

function useDefectDetection(options: UseDefectDetectionOptions) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inspectState, setInspectState] = useState<BlobInspectState>({ defects: [] });
    const [isReady, setIsReady] = useState(true);

    const sendImage = useCallback(async (imageData: string | Blob) => {
        if (!isReady) return;
        console.log("sendImage Invoked.");

        setIsReady(false);
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                "http://localhost:8000/upload_blob",
                imageData instanceof Blob ? imageData : { image: imageData },
                {
                    headers: {
                        'Content-Type': imageData instanceof Blob
                            ? 'application/octet-stream'
                            : 'application/json',
                    }
                }
            );

            // Validate response format
            if (response.data?.defects?.every?.(
                (item: any) => Array.isArray(item) && item.every(Number.isFinite)
            )) {
                setInspectState({ defects: response.data.defects });
            }
        } catch (err: any) {
            setError(err.message || 'Defect detection failed');
        } finally {
            setIsLoading(false);
            // 节流控制 + 自动触发下一次
            setTimeout(async () => {
                const nextFrame = await options.getCurrentFrame();
                setIsReady(true);
                if (nextFrame) sendImage(nextFrame);
            }, options.throttleInterval ?? 1000);
        }
    }, [isReady, options.getCurrentFrame, options.throttleInterval]);

    // 初始化请求
    useEffect(() => {
        const init = async () => {
            const frame = await options.getCurrentFrame();
            sendImage(frame!);
        };
        init();
    }, []); // eslint-disable-line

    return { isLoading, inspectState, error };
}

export default useDefectDetection;
