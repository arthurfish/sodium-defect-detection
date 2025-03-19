import { useState } from 'react';
import {InspectState} from "./types.ts";
import * as React from "react";

interface Props {
    setInspectState: React.Dispatch<React.SetStateAction<InspectState | null>>;
}

export default function UploadWidget({setInspectState}: Props){
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = async (file: File) => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            // 调用后端处理接口
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('处理失败');


            // 解析响应数据
            //console.log(`raw text: ${await response.text()}`);
            const responseJson = await response.json();
            const [processed_image, coordinates ] = [responseJson['image'], responseJson['defects']]
            console.log(coordinates)
            // 调用外部传入的存储函数
            setInspectState({
                image: processed_image,
                defects: coordinates
            });

            // 触发完成回调
        } catch (error) {
            console.error('上传错误:', error);
            alert('文件处理失败，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="m-2 w-full flex">
            <input
                type="file"
                id="upload-input"
                className="hidden"
                accept="image/jpeg, image/png"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                }}
                disabled={isLoading}
            />

            <label
                htmlFor="upload-input"
                className={`ml-auto flex items-center rounded-xl px-4 py-2 space-x-2 
          ${
                    isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-sodium-400 hover:bg-sodium-300 cursor-pointer'
                } 
          text-sodium-100`}
            >
        <span className="whitespace-nowrap">
          {isLoading ? '处理中...' : '上传图片开始检测'}
        </span>

                {isLoading ? (
                    <div className="animate-spin">
                        {/* 替换为普通 img 标签 */}
                        <img
                            src="/loading.svg"
                            alt="加载中"
                            width={24}
                            height={24}
                            className="flex-shrink-0"
                        />
                    </div>
                ) : (
                    <img
                        src="/upload.svg"
                        alt="上传图标"
                        width={24}
                        height={24}
                        className="flex-shrink-0"
                    />
                )}
            </label>
        </div>
    );
}
