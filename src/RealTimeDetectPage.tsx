"use strict";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Image, Rect } from 'react-konva';
import useDefectDetection from './useDefectDetection'; // 假设 Hook 文件名为 useDefectDetection.ts

const getDefectColor = (confidence: number) => {
    if (confidence > 0.8) return 'red';
    if (confidence > 0.5) return 'orange';
    return 'green';
};

const RealTimeDetectPage: React.FC = () => {
    const [selectedDefect, setSelectedDefect] = useState<number | null>(null);
    const [imageDisplaySize, _] = useState({ width: 700, height: 500 }); //初始大小
    const [scaleFactor, setScaleFactor] = useState({ x: 1, y: 1 });
    const imgRef = useRef<HTMLImageElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null); // Add videoRef

    const handleDefectClick = (index: number) => {
        setSelectedDefect(index);
    };

    // 获取当前帧的函数
    const getCurrentFrame = useCallback(() => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                // 优先使用 toBlob，因为它更适合二进制数据传输
                return new Promise<string | Blob | null>(resolve => {
                    canvas.toBlob(blob => {
                        resolve(blob);
                    },'image/jpeg');
                });

            }
        }
        return new Promise<null>((_) => {});
    }, []);

    const { isLoading, inspectState, gettingDefectionError } = useDefectDetection({
        getCurrentFrame: getCurrentFrame,
        throttleInterval: 1000
    });


    // 初始化摄像头
    useEffect(() => {
        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment",
                        width: { ideal: imageDisplaySize.width }, // 设置期望的宽度
                        height: { ideal: imageDisplaySize.height } // 设置期望的高度
                    }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play();
                        // 实际的视频大小可能与请求的理想值不同，需要更新
                        const actualWidth = videoRef.current?.videoWidth;
                        const actualHeight = videoRef.current?.videoHeight;

                        if(actualWidth && actualHeight){
                            setScaleFactor({
                                x: imageDisplaySize.width / actualWidth,
                                y: imageDisplaySize.height / actualHeight,
                            });
                        }

                    };
                }


            } catch (err) {
                console.error('Error accessing camera:', err);
            }
        };

        initCamera();

        // 清理函数
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
            }

        };
    }, [imageDisplaySize.height, imageDisplaySize.width]);

    useEffect(() => {
        const updateImage = () => {
            const newImg = new window.Image();
            newImg.onload = () => {
                imgRef.current = newImg;
                // 更新显示尺寸，以防万一图片尺寸发生变化
                const imgWidth = newImg.width;
                const imgHeight = newImg.height;

                setScaleFactor({
                    x: imageDisplaySize.width/imgWidth,
                    y: imageDisplaySize.height/imgHeight
                })
            };

        }

    }, [imageDisplaySize.width, imageDisplaySize.height]);


    return (
        <section className="bg-sodium-100 w-full flex flex-col items-center gap-4 p-6">
            <header className="w-full h-[37px] bg-sodium-200 rounded-full ml-4 mr-4" >
                {gettingDefectionError}
            </header>
            <div className="flex w-full gap-4 pl-4 pr-4 justify-between">
                {/* 图像标注区域 */}

                <div className="w-[700px] rounded-2xl inset-shadow-2xs bg-sodium-400 relative">
                    {/* 放置 video 元素 */}
                    <video
                        ref={videoRef}
                        width={imageDisplaySize.width}
                        height={imageDisplaySize.height}
                        style={{ borderRadius: '1rem' , zIndex:1}}
                        autoPlay
                        muted
                        playsInline
                    ></video>

                    <Stage
                        width={imageDisplaySize.width}
                        height={imageDisplaySize.height}
                        className="rounded-2xl"
                        style={{
                            position: 'absolute',
                            zIndex: 2,           // Konva 在上层
                            pointerEvents: 'none', // 避免遮挡视频交互（可选）
                            left: 0,
                            top: 0,
                        }}
                    >
                        <Layer className="rounded-2xl">


                            {inspectState.defects.map((defect, index) => {
                                const [x, y, width, height, maxConf] = defect;

                                return (
                                    <Rect
                                        key={index}
                                        x={x * scaleFactor.x}
                                        y={y * scaleFactor.y}
                                        width={width * scaleFactor.x}
                                        height={height * scaleFactor.y}
                                        stroke={selectedDefect === index ? 'yellow' : getDefectColor(maxConf)}
                                        strokeWidth={selectedDefect === index ? 3 : 2}
                                        opacity={0.8}
                                        onClick={() => handleDefectClick(index)}
                                        onTap={() => handleDefectClick(index)}
                                    />
                                );
                            })}
                        </Layer>
                    </Stage>
                </div>

                {/* 检测结果侧边栏 */}
                <aside className="w-[292px] h-[500px] rounded-2xl shadow-2xs">
                    <header className="bg-sodium-300 rounded-t-2xl w-full h-[10%] m-0 flex items-center justify-center">
                        <p>检测结果</p>
                    </header>

                    <div className="rounded-b-xl w-full overflow-y-scroll h-[90%] bg-sodium-200">
                        {inspectState.defects.map((defect, index) => {
                            const [, , , , maxConf, ...classConfs ] = defect;
                            const classes = ['缺陷A', '缺陷B', '缺陷C', '缺陷D'];

                            return (
                                <div
                                    key={index}
                                    className={`grid-cols-6 border-b-1 border-b-sodium-400 flex flex-row justify-start items-center p-2 ${
                                        selectedDefect === index ? 'bg-sodium-300' : ''
                                    }`}
                                    onClick={() => handleDefectClick(index)}
                                >
                                    <svg width="50" height="50">
                                        <circle
                                            cx="10"
                                            cy="10"
                                            r="10"
                                            fill={getDefectColor(maxConf)}
                                        />
                                    </svg>
                                    <div className="col-span-4 text-sm">
                                        {classes.map((cls, i) => (
                                            <span key={cls} className="mr-2">
                        {cls}: {(classConfs[i] * 100).toFixed(1)}%
                      </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </aside>
            </div>

            <footer className="w-full h-[46px] bg-sodium-200 text-sodium-300 rounded-full flex justify-start items-center p-4 ml-4 mr-4">
                <p>检出缺陷数量：{inspectState.defects.length.toString().padStart(4, '0')}</p>
            </footer>
        </section>
    );
};

export default RealTimeDetectPage;

