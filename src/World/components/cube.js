import { BoxBufferGeometry, MeshPhongMaterial, Mesh, BoxHelper } from "three";

function createCube(size) {
    const geometry = new BoxBufferGeometry(size, size, size);
    const material = new MeshPhongMaterial({ transparent: true });
    const cube = new Mesh(geometry, material);

    cube.tick = () => {};

    return cube;
}

function createCubeHelper(cube = createCube(50)) {
    const helper = new BoxHelper(cube, 0xffff00);

    return helper;
}

export { createCube, createCubeHelper };
