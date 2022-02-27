import { SphereBufferGeometry, MeshBasicMaterial, Mesh } from "three";

function createSphere(size) {
    const geometry = new SphereBufferGeometry(size);
    const material = new MeshBasicMaterial({ wireframe: true });
    const sphere = new Mesh(geometry, material);

    return sphere;
}

export { createSphere };
