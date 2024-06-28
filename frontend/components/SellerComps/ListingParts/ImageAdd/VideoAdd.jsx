"use client";
import { formatSeconds, shortenFilename } from "@/components/utils/jsutils";
import {
    IconCircleArrowLeft,
    IconCircleArrowRight,
    IconPlayerPause,
    IconPlayerPlay,
    IconVideo,
} from "@tabler/icons-react";
import { IconPhotoScan, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
// import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { fetchFile, toBlobURL } from "@ffmpeg/util";
import ReactPlayer from "react-player";
import Script from "next/script";
// import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
// import { fetchFile } from "@ffmpeg/util";

import "./VideoAddCss.css";
import DraggableDiv from "./DraggableDiv";
import VideoEditor from "./VideoEditor";
// import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import LoadingSpin from "./LoadingSpin";
import Whammy from "whammy";

// const ffmpeg = createFFmpeg({
//     log: true,
//     // corePath: "/ffmpeg-core.js",

//     // MEMFS: true, // Enable in-memory filesystem
//     // TOTAL_MEMORY: 268435456, // Set total memory (256MB in this example)
// });

// ffmpeg.load();

// const MediaStreamRecorder = dynamic(() => import("msr"), { ssr: false });

export default function VideoAdd({ formData, setFormData }) {
    const t = useTranslations();
    // const ffmpegRef = useRef(new FFmpeg());
    const playerRef = useRef();
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(60);
    const [playing, setPlaying] = useState(true);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [progressOfProcessing, setProgressOfProcessing] = useState(1);

    useEffect(() => {
        if (playerRef.current && isFinite(startTime)) {
            playerRef.current.seekTo(startTime, "seconds");
        }
    }, [startTime, endTime]);

    const [localEditVideo, setLocalEditVideo] = useState(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0]; // Get the selected file

        // Check if the file is an image
        if (file && file.type.startsWith("video/")) {
            setLocalEditVideo(null);
            setProcessingVideo(false);
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const duration = video.duration;
                console.log("MESHURE DURATION", duration);

                if (duration > 60) {
                    toast.warning(
                        "Video is more than 1 minute and we need to cut that.",
                        { className: "fs-14" }
                    );
                    // Video duration is more than 60 seconds
                    setLocalEditVideo({
                        file: file,
                        url: URL.createObjectURL(file),
                        isFile: true,
                    });
                } else {
                    // Video duration is 60 seconds or less
                    const shortenedFilename = shortenFilename(file.name);
                    const newFile = new File([file], shortenedFilename, {
                        type: file.type,
                    });
                    // file["name"] = shortenedFilename;
                    const newVideo = {
                        file: newFile,
                        url: URL.createObjectURL(newFile),
                        isFile: true,
                    };
                    console.log("NEW VIDEO DIYYANi", newVideo);

                    setFormData({
                        ...formData,
                        video: newVideo,
                    });
                }
            };

            video.src = URL.createObjectURL(file);
        } else {
            // If the file is not an image, show an error message
            toast.error("Please select a video", { className: "fs-14" });
        }
    };

    const imageAddLabelRef = useRef();

    const deleteVideo = () => {
        setFormData({
            ...formData,
            video: null,
        });
        setLocalEditVideo(null);
    };

    const handleChangeTime = (start, end) => {
        // Ensure start is more than 1 and less than end time
        const newStart = Math.round(
            Math.max(0, Math.min(Number(start), Number(end) - 2))
        );
        console.log("GELYAN START BILEN END", start, end);
        // Ensure end is more than start time and less than or equal to duration
        const newEnd = Math.round(
            Math.min(Math.max(Number(end), newStart + 2), duration)
        );

        console.log("NEW START AND NEW END", newStart, newEnd);

        // Ensure the difference between start and end is less than 60
        if (newEnd - newStart > 60) {
            console.log("newEnd - newStart > 60");
            // If the end time exceeds the maximum allowed range, adjust the start time
            setStartTime(Math.max(0, newEnd - 60));
            setEndTime(newEnd);
        } else if (newEnd - newStart < 2) {
            console.log("newEnd - newStart < 2");
            // If the difference is less than 2 seconds, adjust the end time
            setEndTime(Math.min(newStart + 2, duration));
            setStartTime(newStart);
        } else if (newStart < startTime && newStart >= 0) {
            console.log("newStart < startTime && newStart >= 0");
            // If the new start time is lower, adjust the end time to maintain the range
            const adjustedEndTime = Math.min(newStart + 59, duration);
            setStartTime(newStart);
            setEndTime(adjustedEndTime);
        } else {
            console.log("GOOD");
            // Set the start and end times within the allowed range
            setStartTime(newStart);
            setEndTime(newEnd);
        }
        // Give me function that will set both start and  end time according to these rules
        // start should be more than 1 and less than end time
        // end time should be more thatn start time and maximum of duration
        // difference between them must be less than 60
    };

    useEffect(() => {
        console.log("\nBASDAKY IBERYANIMIZ");
        if (duration) {
            handleChangeTime(0, 59);
        }
    }, [formData, playerRef, duration]);

    const [interValId, setIntervalId] = useState(null);

    // const mainImageUrl = formData.mainImage ? (formData.mainImage.isFile ? formData.mainImage.url : formData.mainImage.file) : null;
    const startTimeRef = useRef(startTime);
    const endTimeRef = useRef(endTime);

    // Update refs whenever startTime or endTime changes
    useEffect(() => {
        startTimeRef.current = startTime;
        endTimeRef.current = endTime;
    }, [startTime, endTime]);
    const containerRef = useRef(null);

    const [processVideoType, setProcessVideoType] = useState("Fast");

    const [processingVideo, setProcessingVideo] = useState(false);

    //Trim functionality of the video
    // const handleTrim = async () => {
    //     // if (ffmpegRef) {
    //     setProcessingVideo(true);
    //     // await ffmpeg.load()
    //     console.log("LOADED FFMPEG");
    //     // const ffmpeg = ffmpegRef.current;
    //     if (!ffmpeg.isLoaded) {
    //         await ffmpeg.load();
    //     }

    //     console.log("FFMPEG", ffmpeg);

    //     const { name, type } = localEditVideo.file;
    //     const shortenedFilename = shortenFilename(name);
    //     const fileData = new Uint8Array(
    //         await localEditVideo.file.arrayBuffer()
    //     );
    //     console.log("FILE DATA", fileData);
    //     //Write video to memory
    //     ffmpeg.FS(
    //         "writeFile",
    //         shortenedFilename,
    //         await fetchFile(localEditVideo.file)
    //     );
    //     console.log(ffmpeg.FS("readdir", "/")); // This should list the files, including your input file

    //     const videoFileType = type.split("/")[1];
    //     console.log("VIDEO FILE TYPE", videoFileType);

    //     console.log("EXECUTing");
    //     let data = null;
    //     let additionalArgs = [];
    //     if (processVideoType === "Fast") {
    //         additionalArgs.push("-acodec");
    //         additionalArgs.push("copy");
    //         additionalArgs.push("-vcodec");
    //         additionalArgs.push("copy");
    //     }
    //     await ffmpeg.run(
    //         "-i",
    //         shortenedFilename,
    //         "-ss",
    //         `${formatSeconds(startTime)}`,
    //         "-to",
    //         `${formatSeconds(endTime)}`,
    //         ...additionalArgs,
    //         // "-acodec",
    //         // "copy",
    //         // "-vcodec",
    //         // "copy",
    //         `out.${videoFileType}`
    //     );
    //     // await ffmpeg.load();
    //     data = ffmpeg.FS("readFile", `out.${videoFileType}`);
    //     //Run the ffmpeg command to trim video
    //     // try {
    //     //     data = await ffmpeg.readFile(`out.${videoFileType}`);
    //     // } catch (error) {
    //     //     console.log("ERROR", error);
    //     // }
    //     console.log("EXECUTED");
    //     //Convert data to url and store in videoTrimmedUrl state
    //     console.log("DATA", data);

    //     const url = URL.createObjectURL(
    //         new Blob([data.buffer], { type: localEditVideo.file.type })
    //     );
    //     console.log("URL", url);
    //     const newFile = new File(
    //         [data.buffer],
    //         `trimmed_${shortenedFilename}`,
    //         { type: type }
    //     );
    //     console.log("NEW FILE", newFile);
    //     setProcessingVideo(false);

    //     return { url, file: newFile };
    //     // }
    // };

    useEffect(() => {
        let interval;

        if (processingVideo) {
            const startedProcessingTime = Date.now();

            interval = setInterval(() => {
                setProgressOfProcessing((currentProgress) => {
                    const rightNow = Date.now();
                    const elapsed = rightNow - startedProcessingTime;
                    const duration = (endTime - startTime) * 1000;
                    const progress = Math.min((elapsed / duration) * 100, 100);

                    if (progress < 100) {
                        return progress.toFixed(2);
                    } else {
                        clearInterval(interval); // Clear interval when progress reaches 100
                        return 100;
                    }
                });
            }, 1000);
        } else {
            setProgressOfProcessing(0); // Reset progress when processingVideo is false
        }

        return () => {
            if (interval) {
                clearInterval(interval); // Clear interval on component unmount or when processingVideo becomes false
            }
        };
    }, [processingVideo]);

    const handleCut = async () => {
        setProcessingVideo(true);

        const videoElement = document.createElement("video");
        videoElement.src = localEditVideo.url;

        // const originalMutedState = videoElement.muted; // Store the original muted state
        // videoElement.muted = true; // Mute the video temporarily

        await videoElement.play();

        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(videoElement);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0; // Mute the sound
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const stream = videoElement.captureStream();
        const chunks = [];
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };
        // setInterval(() => {
        //     if (progressOfProcessing < 100) {
        //         setProgressOfProcessing(progressOfProcessing + 1);
        //     }
        // }, 1000);
        return new Promise((resolve, reject) => {
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "video/webm" });
                const url = URL.createObjectURL(blob);
                const newFile = new File(
                    [blob],
                    `trimmed_${localEditVideo.file.name}`,
                    {
                        type: localEditVideo.file.type,
                    }
                );
                gainNode.gain.value = 1; // Restore the sound

                setProcessingVideo(false);
                resolve({ url, file: newFile });
            };

            mediaRecorder.onerror = (e) => {
                gainNode.gain.value = 1; // Restore the sound

                setProcessingVideo(false);
                reject(e);
            };

            // Start recording and stop after the specified duration
            mediaRecorder.start();
            setTimeout(() => {
                mediaRecorder.stop();
                videoElement.pause();
            }, (endTime - startTime) * 1000);

            // Seek to the start time and play the video
            videoElement.currentTime = startTime;
            // videoElement.muted = true;
            videoElement.play();
        });
    };

    // const handleCut = async () => {
    //     setProcessingVideo(true);
    //     console.log("E basladyk Bismillah");
    //     const videoElement = document.createElement("video");
    //     videoElement.src = localEditVideo.url;
    //     await videoElement.play();
    //     console.log("VIDEONA BALSTDYK", videoElement);
    //     const canvas = document.createElement("canvas");
    //     canvas.width = videoElement.videoWidth;
    //     canvas.height = videoElement.videoHeight;
    //     const ctx = canvas.getContext("2d");
    //     console.log("CANVAS CREATE ETDIK", ctx);
    //     const stream = canvas.captureStream(30); // 30 FPS
    //     const chunks = [];
    //     const mediaRecorder = new MediaRecorder(stream);
    //     console.log("MEDIA RECORDER BAR", mediaRecorder);
    //     mediaRecorder.ondataavailable = (e) => {
    //         chunks.push(e.data);
    //         console.log("CHUNKSLARY DOLLURDYK", chunks);
    //     };

    //     return new Promise((resolve, reject) => {
    //         console.log("PROMISE OKLADYK");
    //         mediaRecorder.onstop = () => {
    //             console.log("STOPDA");
    //             const blob = new Blob(chunks, { type: "video/webm" });
    //             const url = URL.createObjectURL(blob);
    //             const newFile = new File(
    //                 [blob],
    //                 `trimmed_${localEditVideo.file.name}`,
    //                 {
    //                     type: localEditVideo.file.type,
    //                 }
    //             );
    //             console.log("STOPDA WE new filymyz", newFile);
    //             setProcessingVideo(false);
    //             resolve({ url, file: newFile });
    //         };

    //         mediaRecorder.onerror = (e) => {
    //             console.log("OSIBKA CYKDY", e);
    //             setProcessingVideo(false);
    //             reject(e);
    //         };

    //         // Start recording
    //         mediaRecorder.start();
    //         console.log("MEDIA RECORDER YAZYP BASLADY");
    //         // Seek and capture frames
    //         let currentTime = startTime;
    //         const captureFrame = () => {
    //             console.log("HER FRAME CAPTURE EDYAN");
    //             if (currentTime > endTime) {
    //                 mediaRecorder.stop();
    //                 console.log(
    //                     "MEDIA RECORDER OCURYAN SEBABI BOLDY WAGT",
    //                     currentTime,
    //                     endTime
    //                 );
    //                 return;
    //             }
    //             videoElement.currentTime = currentTime;
    //             console.log("CURRENT TIME", currentTime);

    //             currentTime += 1 / 30; // Advance by one frame (assuming 30 FPS)
    //         };

    //         videoElement.addEventListener("seeked", () => {
    //             ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    //             captureFrame();
    //             console.log("SEEKD DIYYAR NAME ZATDYGYNAM BILEMOK");
    //         });

    //         captureFrame();
    //     });
    // };

    // const handleTrim = async () => {
    //     const frameRate = 30;
    //     console.log("Inside handleTrim");
    //     const video = document.createElement("video");
    //     video.src = URL.createObjectURL(localEditVideo.file);
    //     await video.play();
    //     console.log("VIDEO", video);
    //     const canvas = document.createElement("canvas");
    //     canvas.width = video.videoWidth;
    //     canvas.height = video.videoHeight;
    //     const ctx = canvas.getContext("2d");
    //     console.log("CTX", ctx);
    //     const encoder = new Whammy.Video(frameRate);
    //     let currentTimeHere = startTime;
    //     console.log("CURRENT TIME", currentTimeHere);
    //     return new Promise((resolve, reject) => {
    //         const captureFrame = () => {
    //             console.log("CAPTURE FRAME");
    //             if (currentTimeHere >= endTime) {
    //                 // Encoding is complete
    //                 const output = encoder.compile();
    //                 const outputBlob = new Blob([output], {
    //                     type: "video/webm",
    //                 });
    //                 const outputUrl = URL.createObjectURL(outputBlob);
    //                 const outputFile = new File([outputBlob], "trimmed.webm", {
    //                     type: "video/webm",
    //                 });
    //                 console.log("VERY GOOD", outputFile);
    //                 resolve({ url: outputUrl, file: outputFile });
    //                 return;
    //             }

    //             video.currentTime = currentTimeHere;
    //             video.addEventListener(
    //                 "seeked",
    //                 () => {
    //                     ctx.drawImage(video, 0, 0);
    //                     encoder.add(canvas); // Corrected line
    //                     currentTimeHere += 1 / frameRate;
    //                     captureFrame();
    //                     console.log("SEEKED", currentTimeHere);
    //                 },
    //                 { once: true }
    //             );
    //         };

    //         captureFrame();
    //     });
    // };

    // const handleCut = async () => {
    //     setProcessingVideo(true);

    //     const videoElement = document.createElement("video");
    //     videoElement.src = localEditVideo.url;
    //     videoElement.load(); // Ensure the video is loaded

    //     await new Promise(
    //         (resolve) => (videoElement.oncanplaythrough = resolve)
    //     ); // Wait for video to be ready to play through

    //     const audioContext = new AudioContext();
    //     const source = audioContext.createMediaElementSource(videoElement);
    //     const gainNode = audioContext.createGain();
    //     gainNode.gain.value = 0; // Mute the sound
    //     source.connect(gainNode);
    //     gainNode.connect(audioContext.destination);

    //     const stream = videoElement.captureStream();
    //     const chunks = [];
    //     const mediaRecorder = new MediaRecorder(stream);

    //     mediaRecorder.ondataavailable = (e) => {
    //         chunks.push(e.data);
    //     };

    //     return new Promise((resolve, reject) => {
    //         mediaRecorder.onstop = () => {
    //             const blob = new Blob(chunks, { type: "video/webm" });
    //             const url = URL.createObjectURL(blob);
    //             const newFile = new File(
    //                 [blob],
    //                 `trimmed_${localEditVideo.file.name}`,
    //                 {
    //                     type: localEditVideo.file.type,
    //                 }
    //             );

    //             setProcessingVideo(false);
    //             resolve({ url, file: newFile });
    //         };

    //         mediaRecorder.onerror = (e) => {
    //             setProcessingVideo(false);
    //             reject(e);
    //         };

    //         mediaRecorder.start();
    //         setTimeout(() => {
    //             mediaRecorder.stop();
    //             videoElement.pause();
    //         }, (endTime - startTime) * 1000);

    //         videoElement.currentTime = startTime;
    //         videoElement.onseeked = () => {
    //             videoElement.play();
    //         };
    //     });
    // };

    const saveLocalVideo = async () => {
        const { file, url } = await handleCut(); // Await the trimmed video data
        // const { file, url } = await handleTrim(); // Await the trimmed video data
        // const { file, url } = await handleTrim(); // Await the trimmed video data

        const newVideo = {
            file: file,
            url: url,
            isFile: true,
        };
        console.log("NEW VIDEO DIYYANi", newVideo);

        setFormData({
            ...formData,
            video: newVideo,
        });
        setLocalEditVideo(null);
    };

    return (
        <>
            {" "}
            {/* <Script>
                if (!crossOriginIsolated) SharedArrayBuffer = ArrayBuffer
            </Script> */}
            <div className="border-bottom my-4"></div>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mt-3 fw-bold">{t("videoaddtitle")}</h4>
                    <div className="text-muted fs-14 mb-3">
                        {t("videoadddescription")}
                    </div>
                </div>
                <div>
                    <div
                        role="button"
                        className="border bg-white fs-15 px-3 py-2 rounded-small"
                        onClick={() => imageAddLabelRef.current.click()}
                    >
                        <span className="d-none d-md-inline">
                            <IconVideo size={20} className="me-1" />{" "}
                            {t("addvideo")}
                        </span>
                        <span className="d-inline d-md-none">
                            {t("addvideo")}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mx-3 mt-4 border p-3 fs-15 bg-white shadow-sm rounded-small">
                <div>
                    <label
                        className="d-none"
                        htmlFor="mainVideo"
                        ref={imageAddLabelRef}
                    ></label>

                    <input
                        type="file"
                        id="mainVideo"
                        className="d-none"
                        onChange={(e) => handleFileChange(e)}
                        name="mainVideo"
                        accept="video/*"
                    />
                </div>
                <div className="row  flex-wrap">
                    {processingVideo && (
                        <LoadingSpin
                            tip={`${t(
                                "processingVideo"
                            )} ${progressOfProcessing}%`}
                        />
                    )}
                    {!processingVideo &&
                        !formData?.video &&
                        !localEditVideo && (
                            <div className="px-1 mx-auto col-md-6">
                                <div
                                    role="button"
                                    onClick={() =>
                                        imageAddLabelRef.current.click()
                                    }
                                    className=" rounded-small p-2 text-center"
                                >
                                    <img
                                        src="/video_player_placeholder.gif"
                                        alt=""
                                        className="img-fluid"
                                    />
                                    <div className="pt-2">{t("video")}</div>
                                </div>
                            </div>
                        )}

                    {!processingVideo && formData?.video && !localEditVideo && (
                        <div
                            className="px-1 text-center rounded-small position-relative"
                            style={{
                                width: "100%", // Use 100% width for responsiveness
                                paddingTop: "56.25%", // Maintain 16:9 aspect ratio
                                position: "relative", // Position relative for absolute positioning of children
                            }}
                        >
                            <ReactPlayer
                                url={`${
                                    formData.video.url
                                        ? formData.video.url
                                        : formData.video.file
                                }`}
                                width="100%"
                                height="100%"
                                controls
                                style={{
                                    position: "absolute", // Absolute position to fill the parent container
                                    top: 0,
                                    left: 0,
                                }}
                            />
                            <div
                                role="button"
                                className="position-absolute rounded-small"
                                style={{ top: "10px", right: "20px" }}
                                onClick={() => deleteVideo()}
                            >
                                <IconTrash className="text-main" />
                            </div>
                        </div>
                    )}

                    {!processingVideo && localEditVideo && (
                        <div className="px-1 text-center rounded-small position-relative">
                            {/* <Script
                                src={
                                    "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2/dist/ffmpeg.min.js"
                                }
                                onLoad={() => {
                                    setLoadedScript(true);
                                }}
                            /> */}
                            <div
                                className={`rounded-small 
                                       border border-2 border-main mx-auto position-relative
                                `}
                                role="button"
                                style={{
                                    width: "100%", // Use 100% width for responsiveness
                                    paddingTop: "56.25%", // Maintain 16:9 aspect ratio
                                    position: "relative", // Position relative for absolute positioning of children
                                }}
                            >
                                <ReactPlayer
                                    url={`${localEditVideo.url}`}
                                    // width={640}
                                    // height={360}
                                    width="100%"
                                    height="100%"
                                    playing={playing}
                                    controls
                                    onDuration={(videoDuration) =>
                                        setDuration(videoDuration)
                                    }
                                    onPlay={() => setPlaying(true)}
                                    onPause={() => setPlaying(false)}
                                    onProgress={(progress) =>
                                        setCurrentTime(progress.playedSeconds)
                                    }
                                    config={{
                                        file: {
                                            attributes: {
                                                controlsList: "nodownload",
                                            },
                                            forceVideo: true,
                                            startTime: startTime,
                                            endTime: endTime,
                                        },
                                    }}
                                    style={{
                                        position: "absolute", // Absolute position to fill the parent container
                                        top: 0,
                                        left: 0,
                                    }}
                                    ref={playerRef}
                                />
                                {/* <div className="">
                                    Time: {currentTime.toFixed(2)}
                                </div> */}
                            </div>

                            <div ref={containerRef}>
                                <div
                                    className="d-flex mt-3 user-select-none"
                                    style={{
                                        width: `${
                                            containerRef?.current?.offsetWidth
                                                ? containerRef?.current
                                                      ?.offsetWidth
                                                : 0
                                        }px`,
                                        position: "relative",
                                    }}
                                >
                                    {/* <div className="border border-main  border-right pe-2"></div> */}
                                    {startTime && (
                                        <div
                                            className="bg-gray text-gray d-flex justify-content-center my-auto mx-1 rounded"
                                            style={{
                                                width: `${
                                                    (startTime * 100) / duration
                                                }%`,
                                            }}
                                        >
                                            {formatSeconds(startTime)}
                                        </div>
                                    )}

                                    <DraggableDiv
                                        containerWidth={
                                            containerRef?.current?.offsetWidth
                                                ? containerRef?.current
                                                      ?.offsetWidth
                                                : 0
                                        }
                                        givingValue={startTime}
                                        duration={duration}
                                        onMove={(
                                            newX,
                                            containerWidth,
                                            divWidth
                                        ) => {
                                            const newStartTime = Math.floor(
                                                (newX /
                                                    (containerWidth -
                                                        divWidth)) *
                                                    duration
                                            );
                                            handleChangeTime(
                                                newStartTime,
                                                endTime
                                            );
                                        }}
                                    >
                                        <div className="  pb-1 rounded-small">
                                            <div className="d-none">
                                                {formatSeconds(startTime)}
                                            </div>
                                            <div className="d-flex gap-1 px-1 d-none">
                                                <div
                                                    onClick={() =>
                                                        handleChangeTime(
                                                            startTime - 1,
                                                            endTime
                                                        )
                                                    }
                                                    onMouseEnter={() => {
                                                        let interva =
                                                            setInterval(() => {
                                                                const currentStartTime =
                                                                    startTimeRef.current;
                                                                const currentEndTime =
                                                                    endTimeRef.current;
                                                                handleChangeTime(
                                                                    currentStartTime -
                                                                        1,
                                                                    currentEndTime
                                                                );
                                                            }, 100);
                                                        setIntervalId(interva);
                                                    }}
                                                    onMouseLeave={() => {
                                                        if (interValId) {
                                                            clearInterval(
                                                                interValId
                                                            );
                                                            setIntervalId(null);
                                                        }
                                                    }}
                                                    className="btn btn-main p-0 rounded-small mt-2"
                                                >
                                                    <IconCircleArrowLeft
                                                        size={16}
                                                    />
                                                </div>
                                                <div
                                                    onClick={() =>
                                                        handleChangeTime(
                                                            startTime + 1,
                                                            endTime
                                                        )
                                                    }
                                                    onMouseEnter={() => {
                                                        let interva =
                                                            setInterval(() => {
                                                                const currentStartTime =
                                                                    startTimeRef.current;
                                                                const currentEndTime =
                                                                    endTimeRef.current;
                                                                handleChangeTime(
                                                                    currentStartTime +
                                                                        1,
                                                                    currentEndTime
                                                                );
                                                            }, 100);
                                                        setIntervalId(interva);
                                                    }}
                                                    onMouseLeave={() => {
                                                        if (interValId) {
                                                            clearInterval(
                                                                interValId
                                                            );
                                                            setIntervalId(null);
                                                        }
                                                    }}
                                                    className="btn btn-main p-0 rounded-small mt-2"
                                                >
                                                    <IconCircleArrowRight
                                                        size={16}
                                                        stroke={2}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </DraggableDiv>

                                    <div
                                        style={{
                                            width: `${
                                                ((endTime - startTime) * 100) /
                                                duration
                                            }%`,
                                            // margin: "0px 15px !important",
                                        }}
                                        className="bg-main  text-white d-flex justify-content-center my-auto mx-1 rounded"
                                    >
                                        {formatSeconds(endTime - startTime)}
                                    </div>

                                    <DraggableDiv
                                        containerWidth={
                                            containerRef?.current?.offsetWidth
                                                ? containerRef?.current
                                                      ?.offsetWidth
                                                : 0
                                        }
                                        givingValue={endTime}
                                        duration={duration}
                                        onMove={(
                                            newX,
                                            containerWidth,
                                            divWidth
                                        ) => {
                                            const newEndTime = Math.floor(
                                                (newX /
                                                    (containerWidth -
                                                        divWidth)) *
                                                    duration
                                            );
                                            handleChangeTime(
                                                startTime,
                                                newEndTime
                                            );
                                        }}
                                    >
                                        <div className="  pb-1 rounded-small">
                                            <div className="d-none">
                                                {formatSeconds(endTime)}
                                            </div>
                                        </div>
                                    </DraggableDiv>
                                    {parseInt(
                                        duration.toFixed(2) - endTime.toFixed(2)
                                    ) > 0 ? (
                                        <div
                                            className="bg-gray text-gray d-flex justify-content-center my-auto mx-1 "
                                            style={{
                                                width: `${
                                                    ((duration - endTime) *
                                                        100) /
                                                    duration
                                                }%`,
                                            }}
                                        >
                                            {formatSeconds(duration - endTime)}{" "}
                                        </div>
                                    ) : (
                                        <div
                                            style={{ marginLeft: "10px" }}
                                        ></div>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex flex-column justify-content-center align-items-center user-select-none mt-3">
                                <div className="">
                                    <div
                                        className={`border  rounded-5 mb-2 p-2 border-3  ${
                                            playing ? "border-main" : ""
                                        }`}
                                        role="button"
                                        onClick={() => setPlaying(!playing)}
                                    >
                                        {playing ? (
                                            <IconPlayerPause className="text-main" />
                                        ) : (
                                            <IconPlayerPlay className="text-secondary" />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    {formatSeconds(startTime)}-
                                    {formatSeconds(endTime)}
                                </div>
                            </div>

                            <div className="text-main fw-bold">
                                {formatSeconds(endTime - startTime)}
                            </div>

                            {/* <div class="form-check form-switch align-items-center my-3 d-flex gap-2 ps-0 justify-content-center">
                                <label
                                    class="form-check-label fw-medium fs-15"
                                    for="processVideoType"
                                >
                                    Fast
                                </label>
                                <input
                                    class="form-check-input main-form-check shadow-none mx-1"
                                    type="checkbox"
                                    role="button"
                                    checked={processVideoType === "Quality"}
                                    onClick={() =>
                                        setProcessVideoType(
                                            processVideoType === "Fast"
                                                ? "Quality"
                                                : "Fast"
                                        )
                                    }
                                    id="processVideoType"
                                />
                                <label
                                    class="form-check-label fw-medium fs-15"
                                    for="processVideoType"
                                >
                                    Quality
                                </label>
                            </div> */}

                            <div
                                className="btn btn-main rounded-small fs-14 fw-bold mt-3"
                                onClick={() => saveLocalVideo()}
                            >
                                {t("CartItem.save")}
                            </div>
                            <div
                                role="button"
                                className="position-absolute rounded-small"
                                style={{ top: "10px", right: "20px" }}
                                onClick={() => deleteVideo()}
                            >
                                <IconTrash className="text-main" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
