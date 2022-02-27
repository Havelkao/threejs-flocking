import { createRenderer } from "./systems/renderer";
import { createFlock, Boid } from "./components/Boid";
import { createSphere } from "./components/sphere";
import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { createControls } from "./systems/controls";
import { Loop } from "./systems/Loop";
import { Resizer } from "./systems/Resizer";

let camera;
let renderer;
let scene;
let loop;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();

        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);

        const controls = createControls(camera, renderer.domElement);
        loop.updatables.push(controls);

        const radius = 150;
        const sphere = createSphere(radius);
        scene.add(sphere);

        Boid.containerRadius = radius;
        const flock = createFlock(400);
        Boid.flock = flock;
        flock.forEach((boid) => {
            scene.add(boid.mesh);
            loop.updatables.push(boid.mesh);
        });

        new Resizer(container, camera, renderer);
    }

    // used by Loop
    render() {
        renderer.render(scene, camera);
    }

    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }
}

export { World };
