import React, { useReducer, useRef, useEffect } from "react";
import styles from "./Carousel_dest.module.css";
// Slide data
const slides = [
    {
        title: "Eiffel Tower",
        subtitle: "France",
        description: "Paris' iconic symbol of romance, art, and unforgettable views.",
        image: "https://i.postimg.cc/cHMCS8fG/paris.png"
    },
    {
        title: "Sheikh Zayed Grand Mosque",
        subtitle: "Abu Dhabi: UAE",
        description: "A stunning blend of Islamic art, peace, and architectural grandeur.",
        image: "https://i.postimg.cc/59D4R3hQ/abu-dhabi.png"
    },
    {
        title: "Mt Fuji",
        subtitle: "Japan",
        description: "Sacred peak, where nature meets timeless beauty",
        image: "https://i.postimg.cc/6QHKKkrR/Japan.jpg"
    },
    {
        title: "La Sagrada Familia",
        subtitle: "Barcelona",
        description: "Gaudí’s masterpiece blending faith, art, and architectural wonder",
        image: "https://i.postimg.cc/Bvvf6PWG/barcelona.png"
    },
    {
        title: "Grand Canyon National Park",
        subtitle: "Arizona",
        description: "Nature’s epic masterpiece carved in time and stone",
        image: "https://i.postimg.cc/k4dNsK70/Grand-Canyon-National-Park.png"
    },
    {
        title: "Colosseum",
        subtitle: "Rome",
        description: "Eternal City where ancient history and vibrant life meet.",
        image: "https://i.postimg.cc/HL3WvCmT/rome.png"
    },
    {
        title: "The Matterhorn",
        subtitle: "Switzerland",
        description: "Zermatt’s iconic peak, where alpine beauty touches the sky",
        image: "https://i.postimg.cc/FR7fjKLM/switzerland.png"
    },
];
function useTilt(active) {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current || !active) {
            return;
        }

        const state = {
            rect: undefined,
            mouseX: undefined,
            mouseY: undefined
        };

        let el = ref.current;

        const handleMouseMove = (e) => {
            if (!el) {
                return;
            }
            if (!state.rect) {
                state.rect = el.getBoundingClientRect();
            }
            state.mouseX = e.clientX;
            state.mouseY = e.clientY;
            const px = (state.mouseX - state.rect.left) / state.rect.width;
            const py = (state.mouseY - state.rect.top) / state.rect.height;

            el.style.setProperty("--px", px);
            el.style.setProperty("--py", py);
        };

        el.addEventListener("mousemove", handleMouseMove);

        return () => {
            el.removeEventListener("mousemove", handleMouseMove);
        };
    }, [active]);

    return ref;
}

const initialState = {
    slideIndex: 0
};

const slidesReducer = (state, event) => {
    if (event.type === "NEXT") {
        return {
            ...state,
            slideIndex: (state.slideIndex + 1) % slides.length
        };
    }
    if (event.type === "PREV") {
        return {
            ...state,
            slideIndex:
                state.slideIndex === 0 ? slides.length - 1 : state.slideIndex - 1
        };
    }
};

function Slide({ slide, offset }) {
    const active = offset === 0 ? true : null;
    const ref = useTilt(active);

    return (
        <div
            ref={ref}
            className={styles.slide}
            data-active={active}
            style={{
                "--offset": offset,
                "--dir": offset === 0 ? 0 : offset > 0 ? 1 : -1
            }}
        >
            <div
                className={styles.slideBackground}
                style={{
                    backgroundImage: `url('${slide.image}')`
                }}
            />
            <div
                className={styles.slideContent}
                style={{
                    backgroundImage: `url('${slide.image}')`,
                    "--notCentered": offset === 0 ? 0 : 1
                }}
            >
                <div className={styles.slideContentInner}>
                    <h2 className={styles.slideTitle}>{slide.title}</h2>
                    <h3 className={styles.slideSubtitle}>{slide.subtitle}</h3>
                    <p className={styles.slideDescription}>{slide.description}</p>
                </div>
            </div>
        </div>
    );
}

export default function Carousel_dest() {
    const [state, dispatch] = useReducer(slidesReducer, initialState);

    return (
        <div className={styles.slides}>
            <button onClick={() => dispatch({ type: "NEXT" })}>‹</button>

            {[...slides, ...slides, ...slides].map((slide, i) => {
                let offset = slides.length + (state.slideIndex - i);
                return <Slide slide={slide} offset={offset} key={i} />;
            })}
            <button onClick={() => dispatch({ type: "PREV" })}>›</button>
        </div>
    );
}