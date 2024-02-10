
"use client";
import React, { useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useGesture, useHover, useMove } from "@use-gesture/react";
import Icons from '../../assets/icons';
import Image from "next/image";

type Props = {};

const calcX = (y: number, ly: number) => -(y - ly - window.innerHeight / 2) / 20;
const calcY = (x: number, lx: number) => (x - lx - window.innerWidth / 2) / 20;

const Title = (props: Props) => {
    const [isActive, setIsActive] = useState(false);

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
            className='flex justify-center items-center w-[700px] h-[700px]'
            style={{
                transform: isActive ? '' : 'perspective(600px)',
                rotateX,
                rotateY,
                rotateZ,
            }}
        >
            <Image
                src={Icons.logo}
                alt="icons"
                className="w-[300px] h-[300px] object-contain cursor-pointer"
                onClick={() => setIsActive(!isActive)}
            />
        </animated.div>
    )
};

export default Title;
