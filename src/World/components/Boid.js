import { ShapeGeometry, MeshBasicMaterial, Mesh, SphereGeometry, DoubleSide, MathUtils, Vector3 } from "three";

export class Boid {
    static containerRadius;
    static flock;

    constructor() {
        if (!Boid.containerRadius) {
            console.error("You must set static property 'containerRadius' first");
            return;
        }
        this.velocity = new Vector3().randomDirection().multiplyScalar(MathUtils.randFloat(0, 3));
        this.acceleration = new Vector3(0, 0, 0);
        this.maxSpeed = 0.5;
        this.maxForce = 2;
        this.mesh = createSphere();
        const point = getRandomPointInSphere(Boid.containerRadius);
        this.mesh.position.set(point.x, point.y, point.z);
        this.mesh.tick = () => this.update();
    }

    align(flock) {
        let perceptionRadius = 10;
        let steering = new Vector3();
        let flockMembers = 0;
        for (let other of flock) {
            const distance = this.mesh.position.distanceTo(other.mesh.position);
            if (other != this && distance < perceptionRadius) {
                steering.add(other.velocity);
                flockMembers++;
            }
        }

        if (flockMembers > 0) {
            steering.divideScalar(flockMembers);
            steering.sub(this.velocity);
            steering.clampLength(0, this.maxForce);
        }

        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = 1;
        let steering = new Vector3();
        let total = 0;
        for (let other of boids) {
            const distance = this.mesh.position.distanceTo(other.mesh.position);
            if (other != this && distance <= perceptionRadius) {
                steering.add(other.mesh.position);
                total++;
            }
        }
        if (total > 0) {
            steering.divideScalar(total);
            steering.sub(this.mesh.position);
            steering.sub(this.velocity);
        }
        return steering;
    }

    separation(flock) {
        let perceptionRadius = 3;
        let steering = new Vector3(0, 0, 0);
        let total = 0;
        for (let other of flock) {
            const distance = this.mesh.position.distanceTo(other.mesh.position);
            if (other != this && distance < perceptionRadius) {
                let diff = new Vector3().subVectors(this.mesh.position, other.mesh.position);
                diff.divideScalar(distance);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.divideScalar(total);
            steering.sub(this.velocity);
            // steering.normalize();
        }
        return steering;
    }

    flock(flock) {
        this.acceleration.add(this.align(flock));
        this.acceleration.add(this.cohesion(flock));
        this.acceleration.add(this.separation(flock));
    }

    edges() {
        if (this.mesh.position.length() >= Boid.containerRadius) {
            // this.acceleration.add(new Vector3(0, 0, 0).sub(this.mesh.position));
            const opposite = this.mesh.position.multiplyScalar(-1);
            this.mesh.position.set(opposite.x, opposite.y, opposite.z);
        }
    }

    update() {
        this.flock(Boid.flock);
        this.edges();
        this.velocity.add(this.acceleration);
        this.velocity.normalize();
        this.mesh.position.add(this.velocity);
        this.acceleration.set(0, 0, 0);
    }
}

function createSphere() {
    const geometry = new SphereGeometry(0.5);
    const material = new MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const sphere = new Mesh(geometry, material);

    return sphere;
}

function createFlock(count) {
    const flock = [];

    for (let i = 0; i < count; i++) {
        const boid = new Boid();
        flock.push(boid);
    }

    return flock;
}

function getRandomPointInSphere(radius) {
    const vector = new Vector3(
        MathUtils.randFloatSpread(radius * 2),
        MathUtils.randFloatSpread(radius * 2),
        MathUtils.randFloatSpread(radius * 2)
    );

    if (vector.length() > radius) {
        return getRandomPointInSphere(radius);
    }
    return vector;
}

export { createSphere, createFlock };
