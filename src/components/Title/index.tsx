
"use client";
import React, { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useGesture, useHover, useMove } from "@use-gesture/react";
import Icons from '../../assets/icons';
import Image from "next/image";

type Props = {};

const calcX = (y: number, ly: number) => -(y - ly - window.innerHeight / 2) / 20;
const calcY = (x: number, lx: number) => (x - lx - window.innerWidth / 2) / 20;

const Title = (props: Props) => {
    const [isActive, setIsActive] = useState(false);
    const [orientation, setOrientation] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

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
            x = Math.max(-15, Math.min(50, x));
            y = Math.max(-20, Math.min(20, y));

            setOrientation({ x, y });
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
                !isActive && api({
                    rotateX: calcX(py, y.get()),
                    rotateY: calcY(px, x.get()),
                })
                setMousePosition({ x: calcX(py, y.get()), y: calcY(px, x.get()) })
                console.log('x', calcX(py, y.get()), 'y', calcY(px, x.get()))
            },
            onHover: ({ hovering }) => {
                (!isActive && !hovering) && api({
                    rotateX: 0,
                    rotateY: 0,
                })
            },
        },
    )


    return (
        <animated.div
            {...bind()}
            className='flex justify-center items-center w-[800px] h-[800px] flex-col gap-5'
            style={{
                transform: 'perspective(800px)',
                rotateX: isActive ? orientation.x : rotateX,
                rotateY: isActive ? orientation.y : rotateY,
                rotateZ: isActive ? 0 : rotateZ,
            }}
        >
            <Image
                src={Icons.logo}
                alt="icons"
                className="w-[300px] h-[300px] object-contain cursor-pointer"
                onClick={() => setIsActive(!isActive)}
            />
            {/* <div>
                <p>x: {orientation.x.toFixed(4)}</p>
                <p>y: {orientation.y.toFixed(4)}</p>
            </div> */}
        </animated.div>
    )
};

export default Title;
