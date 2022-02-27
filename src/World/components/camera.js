import { PerspectiveCamera } from "three";

function createCamera(fov = 90, ar = window.innerWidth / window.innerHeight, near = 0.1, far = 1000) {
    const camera = new PerspectiveCamera(fov, ar, near, far);
    camera.position.set(100, 100, 100);

    return camera;
}

export { createCamera };
