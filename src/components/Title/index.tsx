
"use client";
import React, { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useGesture, useHover, useMove } from "@use-gesture/react";
import Icons from '../../assets/icons';
import Image from "next/image";
import "./styles.css";
import { isMobile } from "react-device-detect";

type Props = {};

const calcX = (y: number, ly: number) => -(y - ly - window.innerHeight / 2) / 10;
const calcY = (x: number, lx: number) => (x - lx - window.innerWidth / 2) / 10;

const calcMobileX = window.innerWidth / 8;
const calcMobileY = window.innerHeight / 4;

const Title = (props: Props) => {
    const [orientation, setOrientation] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [overlayPosition, setOverlayPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [isDrag, setIsDrag] = useState<boolean>(false);

    const [position, setPosition] = useState({ x: 0, y: 0 });

    // ? mobile orientation animation
    useEffect(() => {
        const handleOrientationEvent = (event: DeviceOrientationEvent) => {
            handleOrientation(event);
        };

        window.addEventListener("deviceorientation", handleOrientationEvent);
        return () => {
            window.removeEventListener("deviceorientation", handleOrientationEvent);
        };
    }, []);

    const handleOrientation = (event: DeviceOrientationEvent) => {
        let x = event.beta; // In degree in the range [-180,180)
        let y = event.gamma; // In degree in the range [-90,90)

        if (x && y) {
            // Normalize the values to fit within a range that matches your mouse pointer calculations
            x = (-x / 2) + 20; // offset by 20deg for beta
            y = y / 2;

            // Enforce hard limits for x and y
            // x = Math.max(-15, Math.min(50, x));
            // y = Math.max(-20, Math.min(20, y));

            setOrientation({ x, y });
        }

        if (event.beta && event.gamma) {
            setOverlayPosition({ x: event.gamma, y: event.beta });
        }
    }

    // ? mouse animation
    const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(
        () => ({
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
            zoom: 0,
            x: 0,
            y: 0,
            config: { mass: 5, tension: 350, friction: 40 },
        })
    )

    const bind = useGesture(
        {
            onMove({ xy: [px, py] }) {
                !isMobile && api.start({
                    rotateX: isDrag ? 0 : calcX(py, y.get()),
                    rotateY: isDrag ? 0 : calcY(px, x.get()),
                })
                setPosition({ x: px - 1050, y: py - 550 });
            },
            onHover: ({ hovering }) => {
                (!isMobile && !hovering) && api.start({
                    rotateX: 0,
                    rotateY: 0,
                })
            },
            onDrag: ({ down, offset: [ox, oy] }) => {
                if (down) {
                    setIsDrag(true);
                } else {
                    setIsDrag(false);
                }
                api.start({
                    config: { duration: 200 },
                    immediate: down,
                    x: down ? ox : 0,
                    y: down ? oy : 0,
                });
            },
        },
        {
            drag: {
                from: () => [x.get(), 0],
                bounds: {
                    left: isMobile ? -calcMobileX : -200,
                    right: isMobile ? calcMobileX : 200,
                    top: isMobile ? -calcMobileY : -200,
                    bottom: isMobile ? calcMobileY : 200
                },
            }
        }
    )


    return (
        <div
            className='flex justify-center items-center w-[800px] h-[800px] flex-col gap-5'
        >
            <animated.div
                {...bind()}
                className="title w-[300px] h-[300px] md:w-[450px] md:h-[450px] cursor-grab"
                style={{
                    x,
                    y,
                    transform: 'perspective(1000px)',
                    rotateX: isMobile ? orientation.x : rotateX,
                    rotateY: isMobile ? orientation.y : rotateY,
                    rotateZ: isMobile ? 0 : rotateZ,
                }}
            >
                <div
                    className="title-hover w-[400px] h-[400px] md:w-[600px] md:h-[600px]"
                    style={{
                        top: isMobile ? overlayPosition.y : position.y,
                        left: isMobile ? overlayPosition.x : position.x,
                    }}
                />
                <Image
                    src={Icons.logo}
                    alt="icons"
                    className="w-[180px] h-[180px] md:w-[250px] md:h-[250px] object-contain z-10"
                    onDragStart={(e) => e.preventDefault()}
                />
            </animated.div>
        </div>
    )
};

export default Title;
