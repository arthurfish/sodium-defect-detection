import os
import random
import time

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import base64
import numpy as np
from typing import List
import io

from starlette.responses import JSONResponse
from ultralytics import YOLO
import tempfile
from pathlib import Path

app = FastAPI()

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 加载YOLO模型（应用启动时加载一次）
model = YOLO("best.pt")  # 确保模型文件路径正确
model = model.to("cuda")


def process_results(results):
    """解析YOLO检测结果"""
    predictions = []

    for result in results:
        # 遍历每个检测结果
        for box in result.boxes:
            # 获取坐标 (xyxy格式)
            x, y, x2, y2 = box.xyxy.tolist()[0]

            # 获取置信度和类别
            conf = box.conf.item()
            cls_id = box.cls.item()

            # 转换为需要的格式（示例中包含各分类置信度）
            prediction = [
                x, y, abs(x2-x), abs(y2-y),
                conf,
                *[1.0 if i == cls_id else 0.0 for i in range(4)]  # 模拟4分类（根据实际类别修改）
            ]
            predictions.append(prediction)

    return predictions


from fastapi import UploadFile, HTTPException
import shutil
from pathlib import Path


@app.post("/upload")
async def upload_image(image: UploadFile = File(..., max_size=20 * 1024 * 1024)):
    print("received image", image)
    image_data = await image.read()

    # 生成Base64字符串
    image_base64 = base64.b64encode(image_data).decode("utf-8")

    try:
        # 验证文件类型
        if image.content_type not in {"image/jpeg", "image/png"}:
            raise ValueError("不支持的图片格式")

        # 创建临时目录
        upload_dir = Path("uploads")
        upload_dir.mkdir(exist_ok=True)

        # 保存临时文件
        temp_path = upload_dir / image.filename
        with temp_path.open("wb") as buffer:
            buffer.write(image_data)

        # 验证文件是否有效
        if temp_path.stat().st_size == 0:
            raise ValueError("上传文件为空")

        # 执行模型预测
        results = model.predict(temp_path, imgsz=640)
        print("results", results)
        processed_data = process_results(results)

        # 清理临时文件
        temp_path.unlink()

        return JSONResponse(content={
            "image": image_base64,
            "defects": processed_data
        })


    except ValueError as ve:
        import traceback
        traceback.print_exc()
        raise HTTPException(400, str(ve))
    except Exception as e:
        # 记录完整错误日志
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"处理失败: {str(e)}")


# 运行命令：uvicorn main:app --reload --port 8000

from fastapi import Body, HTTPException

@app.post("/upload_blob")
async def upload_image(
    image_data: bytes = Body(..., media_type="application/octet-stream", max_length=20 * 1024 * 1024)
):
    start_time = time.time()
    try:
        # 验证是否有数据
        if not image_data:
            raise HTTPException(status_code=400, detail="未接收到数据")

        # 验证文件类型（通过文件头）
        # 例如：检查是否为 JPEG 或 PNG
        file_header = image_data[:4]
        if file_header not in [b"\xFF\xD8\xFF\xE0", b"\x89PNG"]:
            raise HTTPException(status_code=400, detail="不支持的图片格式")

        # 生成Base64字符串
        image_base64 = base64.b64encode(image_data).decode("utf-8")

        # 保存临时文件（可选）
        temp_path = Path("uploads") / f"{random.randint(100, 10000000)}temp_image.jpg"
        with temp_path.open("wb") as buffer:
            buffer.write(image_data)

        # 执行模型预测

        results = model.predict(temp_path, imgsz=640)
        print(f"results: {results}")
        processed_data = process_results(results)

        # 清理临时文件
        temp_path.unlink()

        end_time = time.time()
        print("Time cost:", end_time - start_time)
        return {"image": image_base64, "defects": processed_data}

    except Exception as e:
        print(f"处理文件时出错: {str(e)}")
        raise HTTPException(status_code=500, detail="服务器内部错误")
