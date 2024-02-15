
"use client";
import React, { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useGesture, useHover, useMove } from "@use-gesture/react";
import Icons from '../../assets/icons';
import Image from "next/image";
import "./styles.css";

type Props = {};

const calcX = (y: number, ly: number) => -(y - ly - window.innerHeight / 2) / 20;
const calcY = (x: number, lx: number) => (x - lx - window.innerWidth / 2) / 20;

const Title = (props: Props) => {
    const [isActive, setIsActive] = useState(false);
    const [orientation, setOrientation] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [overlayPosition, setOverlayPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    // const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

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
                !isActive && api.start({
                    rotateX: calcX(py, y.get()),
                    rotateY: calcY(px, x.get()),
                })
                setPosition({ x: px - 1000, y: py - 500 });
            },
            onHover: ({ hovering }) => {
                (!isActive && !hovering) && api.start({
                    rotateX: 0,
                    rotateY: 0,
                })
            },
        },
    )

    // const pointer = useGesture({
    //     onMove: ({ xy }) => {
    //          setPosition({ x: xy[0] - 1000, y: xy[1] - 500 });
    //     },
    // });

    return (
        <animated.div
            {...bind()}
            className='flex justify-center items-center w-[800px] h-[800px] flex-col gap-5'
            style={{
                transform: 'perspective(1000px)',
                rotateX: isActive ? orientation.x : rotateX,
                rotateY: isActive ? orientation.y : rotateY,
                rotateZ: isActive ? 0 : rotateZ,
            }}
        >
            <div
                // {...pointer()}
                className="title w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
            >
                <div
                    className="title-hover w-[400px] h-[400px] md:w-[600px] md:h-[600px]"
                    style={{
                        top: isActive ? overlayPosition.y : position.y,
                        left: isActive ? overlayPosition.x : position.x,
                    }}
                />
                <Image
                    src={Icons.logo}
                    alt="icons"
                    className="w-[180px] h-[180px] md:w-[250px] md:h-[250px] object-contain cursor-pointer z-10"
                    onClick={() => setIsActive(!isActive)}
                />
            </div>
        </animated.div>
    )
};

export default Title;
