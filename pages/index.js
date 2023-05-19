import React, { useRef } from "react";
import GIF from "gif.js";

export default function Index() {
  const videoRef = useRef(null);
  const capturedImagesRef = useRef([]);
  const gifPreviewRef = useRef(null);

  const startCapture = () => {
    capturedImagesRef.current = []; // 이미지 배열 초기화

    const captureInterval = setInterval(() => {
      captureImage();

      if (capturedImagesRef.current.length >= 10) {
        clearInterval(captureInterval);
        createGif();
      }
    }, 1000); // 1초마다 이미지 캡처
  };

  const captureImage = () => {
    // 비디오 요소 가져오기
    const video = videoRef.current;

    // Canvas 요소 생성 및 크기 설정
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;

    // Canvas에 현재 비디오 화면 그리기
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, 100, 100);

    // 이미지를 Blob 형식으로 변환
    canvas.toBlob((blob) => {
      // 이미지를 배열에 추가
      capturedImagesRef.current.push(blob);
    }, "image/jpeg", 0.8);
  };

  const createGif = () => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: 400,
      height: 300,
    });

    capturedImagesRef.current.forEach((image) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        gif.addFrame(reader.result, { delay: 300 });
      };
      reader.readAsDataURL(image);
    });

    gif.on("finished", (blob) => {
      gifPreviewRef.current.src = URL.createObjectURL(blob);
      gifPreviewRef.current.style.display = "block";
    });

    gif.render();
  };

  return (
    <div>
      <h1>카메라 영상 미리보기, 이미지 캡처 및 GIF 생성</h1>
      <video ref={videoRef} width="400" height="300" autoPlay></video>
      <button onClick={startCapture}>시작</button>
      <div>
        {capturedImagesRef.current.map((image, index) => (
          <img key={index} src={URL.createObjectURL(image)} alt={`Image ${index}`} width="100" height="100" />
        ))}
      </div>
      <img ref={gifPreviewRef} style={{ display: "none" }} alt="GIF Preview" />
    </div>
  );
}
