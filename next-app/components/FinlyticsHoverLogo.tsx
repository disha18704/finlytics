"use client";

import { useEffect } from "react";

export default function FinlyticsHoverLogo() {
  useEffect(() => {
    const mouseMask = document.querySelector(
      ".finlytics-outline_mouseMask"
    ) as HTMLElement;
    const mouseMask1 = document.querySelector(
      ".finlytics-outline_mouseMask.finlytics-outline_second"
    ) as HTMLElement;
    const mouseMask2 = document.querySelector(
      ".finlytics-outline_mouseMask.finlytics-outline_third"
    ) as HTMLElement;
    const container = document.querySelector(
      ".finlytics-outline_second"
    ) as HTMLElement;

    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const { offsetWidth, offsetHeight } = container;

      const r = Math.round((x / offsetWidth) * 255);
      const g = Math.round((y / offsetHeight) * 255);
      const b = 150;

      [mouseMask, mouseMask1, mouseMask2]
        .filter((mask): mask is HTMLElement => mask !== null)
        .forEach((mask) => {
          mask.style.transform = `translate(${x}px, ${y}px)`;
          mask.style.background = `rgb(${r}, ${g}, ${b})`;
        });
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="finlytics-hover-container">
      <section className="finlytics-outline">
        <div className="row">
          <div className="finlytics-outline_second">
            <div className="finlytics-outline_logo">
              <svg
                className="finlytics-outline_outline"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1050 159.89"
              >
                <mask id="stroke">
                  <rect x="0" y="0" width="1050" height="159.89" fill="#fff" />
                  <path
                    d="M0.45 156.593V3.148h92.006v16.484H19.03v51.847h66.536v16.484H19.032v68.631zM142.862 3.148v153.446h-18.58V3.148zm158.934 0v153.446h-17.982L200.199 36.116h-1.5v120.478h-18.58V3.148h17.982l83.916 120.778h1.501V3.147zm37.184 153.446V3.148h18.58V140.11h71.329v16.484zM437.263 3.149h21.278l42.557 71.625h1.798l42.559 -71.629h21.278l-55.444 90.21v63.24h-18.581V93.357zm154.795 16.484V3.149h115.085v16.484H658.89v136.961h-18.58V19.632zM754.401 3.149v153.444h-18.58V3.148zm160.733 47.95h-18.581q-1.649 -8.016 -5.769 -14.085a38.4 38.4 0 0 0 -9.89 -10.19q-5.769 -4.197 -12.813 -6.293t-14.685 -2.098q-13.935 0 -25.25 7.042 -11.238 7.044 -17.908 20.756 -6.594 13.709 -6.594 33.641 0 19.929 6.594 33.641 6.67 13.711 17.908 20.753 11.314 7.044 25.25 7.044 7.643 0 14.685 -2.098 7.045 -2.097 12.813 -6.218a39.4 39.4 0 0 0 9.89 -10.266q4.121 -6.143 5.769 -14.085h18.581q-2.098 11.763 -7.643 21.054t-13.785 15.808q-8.242 6.446 -18.506 9.816 -10.191 3.373 -21.805 3.373 -19.63 0 -34.916 -9.59 -15.283 -9.592 -24.05 -27.274t-8.767 -41.958 8.767 -41.957 24.05 -27.272q15.286 -9.593 34.916 -9.592 11.612 0 21.805 3.373 10.263 3.369 18.506 9.89 8.242 6.446 13.785 15.733 5.545 9.214 7.643 21.054Zm113.942 -9.59q-1.349 -11.391 -10.94 -17.682 -9.588 -6.295 -23.525 -6.295 -10.19 0 -17.832 3.297 -7.569 3.297 -11.838 9.066 -4.197 5.769 -4.197 13.112 0 6.143 2.923 10.564 2.998 4.345 7.642 7.27a54.7 54.7 0 0 0 9.741 4.72 121 121 0 0 0 9.366 2.921l15.585 4.197q5.993 1.572 13.337 4.345 7.418 2.775 14.161 7.567 6.818 4.721 11.238 12.139t4.42 18.206q0 12.437 -6.519 22.478 -6.444 10.039 -18.88 15.959 -12.363 5.917 -30.047 5.917 -16.484 0 -28.546 -5.319 -11.989 -5.319 -18.88 -14.836 -6.819 -9.515 -7.717 -22.103h19.18q0.748 8.692 5.846 14.385 5.168 5.621 13.036 8.391 7.942 2.697 17.082 2.697 10.64 0 19.106 -3.445 8.466 -3.523 13.413 -9.742 4.945 -6.293 4.945 -14.683 0 -7.645 -4.271 -12.438 -4.271 -4.797 -11.24 -7.792t-15.06 -5.244l-18.879 -5.397q-17.983 -5.169 -28.472 -14.76 -10.49 -9.593 -10.49 -25.102 0 -12.887 6.968 -22.477 7.044 -9.668 18.882 -14.984 11.912 -5.396 26.597 -5.396 14.836 0 26.373 5.321 11.539 5.242 18.282 14.385 6.819 9.141 7.194 20.753z"
                    stroke="#000"
                    fill="#fff"
                    strokeWidth="1"
                  />
                </mask>
                <rect
                  x="0"
                  y="0"
                  width="1050"
                  height="159.89"
                  mask="url(#stroke)"
                  fill="#050505"
                />
              </svg>
              <div className="finlytics-outline_gradient"></div>
              <div
                className="finlytics-outline_mouseMask"
                style={{
                  transform: "translate(20, 20)",
                  background: "rgb(243, 33, 33)",
                }}
              >
                <img
                  alt=""
                  loading="lazy"
                  width="200"
                  height="200"
                  decoding="async"
                  style={{ color: "transparent" }}
                  srcSet="cursor_mask.webp 1x, cursor_mask.webp 2x"
                  src="cursor_mask.webp"
                />
              </div>
              <div
                className="finlytics-outline_mouseMask finlytics-outline_second"
                style={{
                  transform: "translate(20, 20)",
                  background: "rgb(243, 33, 33)",
                }}
              >
                <img
                  alt=""
                  loading="lazy"
                  width="200"
                  height="200"
                  decoding="async"
                  style={{ color: "transparent" }}
                  srcSet="cursor_mask.webp 1x, cursor_mask.webp 2x"
                  src="cursor_mask.webp"
                />
              </div>
              <div
                className="finlytics-outline_mouseMask finlytics-outline_third"
                style={{
                  transform: "translate(20, 20)",
                  background: "rgb(243, 33, 33)",
                }}
              >
                <img
                  alt=""
                  loading="lazy"
                  width="200"
                  height="200"
                  decoding="async"
                  style={{ color: "transparent" }}
                  srcSet="cursor_mask.webp 1x, cursor_mask.webp 2x"
                  src="cursor_mask.webp"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
