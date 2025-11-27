/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { Vector3 } from "../libs/CS559-Three/src/Three.Core.js";

let wagonWood = new T.TextureLoader().load("../images/wagon_wood.jpg");
let rotWagonWood = wagonWood.clone();
rotWagonWood.center = new T.Vector2(0.5, 0.5);
rotWagonWood.rotation = Math.PI/2;

let env = new T.TextureLoader().load("../images/dirt_road.png");
env.mapping = T.EquirectangularReflectionMapping;

// define your vehicles here - remember, they need to be imported
// into the "main" program
export class SpiritTrain extends GrObject {

}

let wagonCtr = 0;
export class Wagon extends GrObject {
    constructor(speed, scale = 1, world, pathRadius = 5) {

        // let cubeRenderer = new T.WebGLCubeRenderTarget(128);
        // cubeRenderer.fromEquirectangularTexture(world.renderer, env);
        // let camera = new T.CubeCamera(1, 1000, cubeRenderer);
        // camera.position.set(0, 0, 0);

        let material = new T.MeshStandardMaterial({ map: wagonWood });
        let rot_mat = new T.MeshStandardMaterial({ map: rotWagonWood });

        let width = 1;
        let length = 2;
        let height = .75;
        let depth = .1;

        // different sides to the wagon
        let frontSide = new T.BoxGeometry(width+depth, height, depth);
        let backSide = new T.BoxGeometry(width+depth, height, depth);
        let leftSide = new T.BoxGeometry(depth, height, length);
        let rightSide = new T.BoxGeometry(depth, height, length);
        let bottomSide = new T.BoxGeometry(width, depth, length);

        let front = new T.Mesh(frontSide, material);
        front.position.set(0, 0, length/2 + depth/2);
        let back = new T.Mesh(backSide, material);
        back.position.set(0, 0, -length/2 - depth/2);
        let left = new T.Mesh(leftSide, rot_mat);
        left.position.set(.5, 0, 0);
        let right = new T.Mesh(rightSide, rot_mat);
        right.position.set(-.5, 0, 0);
        let bottom = new T.Mesh(bottomSide, material);
        bottom.position.set(0, -height/2 + depth/2, 0);

        // add seating
        let seatGeom = new T.BoxGeometry(1, .1, .5);
        let seat1 = new T.Mesh(seatGeom, material);
        seat1.position.set(0, height/5, 0.25);

        // add wheels with spokes
        let radius = .5;
        let tube = .05;
        let wheelRotVector = new Vector3(0, 1, 0);

        // bar between wheel1 and wheel2
        let frontWheelBar = createWheelBar(createSpokedWheel(radius, tube), 
                                        createSpokedWheel(radius, tube), width, height*3/2, 
                                        length-.3, radius*2, tube);

        frontWheelBar.rotateOnWorldAxis(wheelRotVector, -Math.PI/16);

        let backWheelBar = createWheelBar(createSpokedWheel(radius, tube),
                                        createSpokedWheel(radius, tube), width, height*3/2,
                                        -length+.3, radius*2, -tube);
        backWheelBar.rotateOnWorldAxis(wheelRotVector, Math.PI/16);

        // wheel box
        let wheelBox = new T.BoxGeometry(1, .3, 2);
        let wheelMat = new T.MeshStandardMaterial({color: "#505050", metalness: 1, roughness: 0});
        let box = new T.Mesh(wheelBox, wheelMat);
        box.position.set(0, -height/2 -0.1, 0);

        // reflective part
        // let reflectiveGeom = new T.SphereGeometry(.1);
        // let reflectiveMat = new T.MeshStandardMaterial({ metalness: 1, roughness: 0});
        // let reflectiveBox = new T.Mesh(reflectiveGeom, reflectiveMat);
        // reflectiveBox.position.set(0, 0, 1.1);

        let group = new T.Group();
        group.add(front);
        group.add(back);
        group.add(left);
        group.add(right);
        group.add(seat1);
        group.add(bottom);
        group.add(box);
        //group.add(reflectiveBox)

        group.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;
        });

        group.add(frontWheelBar);
        group.add(backWheelBar);
        group.position.y = (height/2+radius*3/2)*scale;
        group.position.x = -3;
        group.position.z = 1;
        group.scale.set(scale, scale, scale);

        super(`Wagon - ${wagonCtr++}`, group);
        this.wagon = group;
        this.frontWheelBar = frontWheelBar;
        this.backWheelBar = backWheelBar;
        //this.reflectiveBox = reflectiveBox;
        this.speed = speed || 0;
        this.movement = 0;
        this.scale = scale;

        this.center = new T.Vector3(0, 0, 0);
        this.radius = pathRadius;

        //this.camera = camera;
        this.world = world;
        this.rideable = this.wagon;
    }

    /**
   * StepWorld method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {

    // move wagon
    this.movement -= this.speed * delta/1000;

    let x = this.center.x + this.radius * Math.sin(this.movement);
    let z = this.center.z + this.radius * Math.cos(this.movement);

    // Update the wagon's position
    this.wagon.position.set(x, this.wagon.position.y, z);

    this.wagon.rotation.y = this.movement - Math.PI/2;

    // rotate wheels
    let angle = this.speed * -delta/200

    this.frontWheelBar.rotateY(angle);
    this.backWheelBar.rotateY(angle);

    // reflection
    // let xCam = this.wagon.position.x + this.reflectiveBox.position.x;
    // let yCam = this.wagon.position.y + this.reflectiveBox.position.y;
    // let zCam = this.wagon.position.z + this.reflectiveBox.position.z;
    // this.camera.position.set(xCam, yCam, zCam);

    // this.wagon.visible = false;
    // try {
    //     this.camera.update(this.world.renderer, this.world.scene);
    // } catch (err) {
    //     console.error("Error updating CubeCamera:", err);
    // }
    // this.wagon.visible = true;

  }

}

function createSpokedWheel(radius, tube) {

    let mat = new T.MeshStandardMaterial({ color: "black", metalness: .75, roughness: 0.5});

    let radialSegments = 10;
    let tubularSegments = 20;

    let wheelGeom = new T.TorusGeometry(radius, tube, radialSegments, tubularSegments);
    let wheel = new T.Mesh(wheelGeom, mat);

    let wheelCenter = new T.CylinderGeometry(2*tube, 2*tube, 2*tube, radialSegments);
    let center = new T.Mesh(wheelCenter, mat);
    center.rotateX(Math.PI/2);

    let wheelGroup = new T.Group();
    wheelGroup.add(wheel);
    wheelGroup.add(center);

    let spokeGeom = new T.CylinderGeometry(.04, .04, radius, radialSegments);

    let spoke1 = new T.Mesh(spokeGeom, mat);
    spoke1.rotateZ(0);
    spoke1.position.set(0, radius/2, 0);
    wheelGroup.add(spoke1);

    let spoke2 = new T.Mesh(spokeGeom, mat);
    spoke2.rotateZ(2*Math.PI/5);
    spoke2.position.set(-radius*2/5-0.01, 0.08, 0);
    wheelGroup.add(spoke2);

    let spoke3 = new T.Mesh(spokeGeom, mat);
    spoke3.rotateZ(-2*Math.PI/5);
    spoke3.position.set(radius*2/5+0.01, 0.08, 0);
    wheelGroup.add(spoke3);

    let spoke4 = new T.Mesh(spokeGeom, mat);
    spoke4.rotateZ(4*Math.PI/5);
    spoke4.position.set(-radius*1/5-0.06, -0.21, 0);
    wheelGroup.add(spoke4);

    let spoke5 = new T.Mesh(spokeGeom, mat);
    spoke5.rotateZ(-4*Math.PI/5);
    spoke5.position.set(radius*1/5+0.06, -0.21, 0);
    wheelGroup.add(spoke5);

    wheelGroup.children.forEach((child) => {
        child.receiveShadow = true;
        child.castShadow = true;
    });

    return wheelGroup;
    
}

/**
 * Returns a bar with two spoke wheels attached to it
 * Rotate this bar around the Y axis to get the desired wheel movement for animation
 * 
 * @returns 
 */
function createWheelBar (wheel1, wheel2, width, height, length, radius, tube) {
    // place wheels on the bar
    wheel1.position.set(0, width/2 + radius/3, 0);
    wheel1.rotateX(Math.PI/2);

    wheel2.position.set(0, -width/2 - radius/3, 0);
    wheel2.rotateX(Math.PI/2);

    // bar between wheel1 and wheel2
    let material = new T.MeshStandardMaterial({ color: "black" });
    let barGeom = new T.CylinderGeometry(.04, .04, 5/3*width, 10);

    let bar = new T.Mesh(barGeom, material);
    bar.position.set(0, -height/2 + tube/2, length/2 - tube/2);
    bar.rotateZ(Math.PI/2);
    bar.rotateY(Math.PI/2);
    bar.add(wheel1);
    bar.add(wheel2);
    bar.castShadow = true;
    bar.receiveShadow = true;

    return bar;
}

export class MotorCycle extends GrObject {

}

