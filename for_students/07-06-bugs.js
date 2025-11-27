/*jshint esversion: 6 */
// @ts-check

import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";

let bee_texture = new T.TextureLoader().load("../images/bee.png");
let fly_eye = new T.TextureLoader().load("../images/cubes.png");

let flowerVectors = [new T.Vector2(1,1), new T.Vector2(0.9,0.9), new T.Vector2(0.8,0.8), new T.Vector2(0.7,0.7), new T.Vector2(0.6,0.6), new T.Vector2(0.5,0.5), new T.Vector2(0.4,0.4), new T.Vector2(0.3,0.3), new T.Vector2(0.2,0.2), new T.Vector2(0.1,0.1), new T.Vector2(0,0)];
let flower_rot = [Math.PI/2,0,0];
let stem_mat = new T.MeshStandardMaterial({ color: "darkgreen", side: T.DoubleSide });

class Bug {
    constructor(scale, rotation, position, matBody, 
        matEye, matPropeller, tailSize, func, propellerPos, propellerRot) {
        this.scale = scale;
        this.rotation = rotation;
        this.position = position;
        this.matBody = matBody;
        this.matEye = matEye;
        this.matPropeller = matPropeller;
        this.tailSize = tailSize;
        this.func = func;
        this.propellerPos = propellerPos;
        this.propellerRot = propellerRot;
    }
}

let bugCtr = 0;
export class BugGr extends GrObject {

    constructor(bugObj) {

        let bugGr;
        if (bugObj.bugType == 0) {
            bugGr = new BugGrBee();
        }
        else if (bugObj.bugType == 1) {
            bugGr = new BugGrFly();
        }
        
        else {
            bugGr = makeBug(bugObj.bug);
        }

        super(`Bug - ${bugCtr++}`, [bugGr]);
        this.bug = bugGr;
    }

}

let beeCtr = 0;
export class BugGrBee extends GrObject {
    constructor(x,y,z,speed=1) {

        let scale = [0.5,0.5,0.5];
        let rotation = [0,0,Math.PI / 2];
        let position = [0,2,0];
        let bee_mat = new T.MeshStandardMaterial({ map: bee_texture });
        let eye_mat = new T.MeshStandardMaterial({ color: "black" });
        let propeller_pos = [[.9,.5,-.5],[.9,.5,.5], [.7,.5,.5],[.7,.5,-.5]];
        let propeller_rot = [[Math.PI/4,0,0],[-Math.PI/4,0,0], [-Math.PI/4,0,0],[Math.PI/4,0,0]];

        let bug = new Bug(scale, rotation, position, bee_mat, eye_mat, eye_mat, 0.5, makePropellerWing, propeller_pos, propeller_rot);

        let bee_group = new T.Group();
        let bee = makeBug(bug);
        bee_group.add(bee);

        super(`Bee - ${beeCtr++}`, bee_group);
        this.bug = bee_group;
        this.theta = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = speed;
        this.rideable = this.objects[0];
    }

    stepWorld(delta, timeOfDay) {

        // move in a circle
        this.theta += delta/100*this.speed;
        let x = 3 * Math.cos(this.theta);
        let z = 3 * Math.sin(this.theta);
        this.bug.position.x = x + this.x;
        this.bug.position.z = z + this.z;
        this.bug.position.y = this.y + Math.sin(this.theta * 2) * 0.5;
        this.bug.rotation.y = -this.theta+Math.PI/2-Math.PI/2;
        this.bug.children[0].rotation.y = Math.PI/2;

        // move bug's propellers
        for (let i = 0; i < 4; i++) {
            let prop = this.bug.children[0].children[i];
            let direction = 1;
            if (i % 2 == 1) {
                direction = -1;
            }

            prop.children[0].rotation.x = -4*direction * this.theta;
        }

    }
}

let flyCtr = 0;
export class BugGrFly extends GrObject {
    constructor(x,y,z,speed=1) {

        let scaleFly = [0.25,0.25,0.25];
        let rotationFly = [0,0,Math.PI / 2];
        let positionFly = [4,1,-2];
        let fly_mat = new T.MeshPhongMaterial({ color: "#AEB5D8", shininess: 10 });
        let fly_eye_mat = new T.MeshPhongMaterial({ color: "red", normalMap: fly_eye, shininess: 10});
        let fly_propeller_pos = [[0,-1,-1],[0,-1,1], [0,1,-1],[0,1,1]];
        let fly_propeller_rot = [[Math.PI/4,0,0],[-Math.PI/4,0,0], [Math.PI*3/4,0,0],[-Math.PI*3/4,0,0]];

        let bug = new Bug(scaleFly, rotationFly, positionFly, fly_mat, fly_eye_mat, fly_eye_mat, .8, makePropellerArm, fly_propeller_pos, fly_propeller_rot);

        let fly_group = new T.Group();
        let fly = makeBug(bug);
        fly_group.add(fly); // enables better positioning of the drive camera
        
        super(`Fly - ${flyCtr++}`, fly_group);
        this.bug = fly_group;

        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = speed;
        this.theta = 0;
        this.rideable = this.objects[0];
    }

    stepWorld( delta, timeOfDay) {
        // move fly in a sine wave pattern
        this.theta += delta/1500 * this.speed;

        // this.bug.position.y = 1.5 + Math.sin(this.theta * 2) * 0.5 + this.y;
        // this.bug.rotation.y += Math.cos(this.theta/10)/10;
        // this.bug.position.x = -3 * Math.cos(this.theta) + this.x;
        // this.bug.position.z = -3 * Math.cos(this.theta*2) + this.z;

        // move in a circle
        this.theta += delta/100*this.speed;
        let x = 2.5 * Math.cos(-this.theta);
        let z = 2.5 * Math.sin(-this.theta);
        this.bug.position.x = x + this.x;
        this.bug.position.z = z + this.z;
        this.bug.position.y = this.y + Math.sin(-this.theta * 2) * 0.5;
        this.bug.rotation.y = this.theta-Math.PI/2 -Math.PI/2;

        // move fly's propellers
        for (let i = 0; i < 4; i++) {
            let prop = this.bug.children[0].children[i];
            let direction = 1;
            if (i % 2 == 1) {
                direction = -1;
            }

            prop.children[0].rotation.x = -4*direction * this.theta;
        }
    }
}

let flowerCtr = 0;
export class Flower extends GrObject {
    constructor({scale, stemLength, type}, bug) {

        let flower_head = new T.Group();
        let flower;

        if (type == 0) {
            flower = makeFlower([0.5,0.5,0.5], flower_rot, stem_mat, flowerVectors, 3);
        }

        else if (type == 1) {
            flower = makeFlower([0.25,0.25,0.25], flower_rot, stem_mat, flowerVectors, 3);
        }

        else {
            flower = makeFlower(scale, flower_rot, stem_mat, flowerVectors, stemLength);
        }

        // add stem
        let stemGeom = new T.CylinderGeometry(0.1, 0.1, stemLength, 32);
        let stem = new T.Mesh(stemGeom, stem_mat);
        stem.position.set(0, -stemLength/2*scale[1]+scale[1]/10,0);
        stem.scale.set(scale[0], scale[1], scale[2]);

        flower_head.add(flower);

        let flower_group = new T.Group();
        flower_group.add(stem);
        flower_group.add(flower_head);

        super(`Flower - ${flowerCtr++}`, [flower_group]);
        this.flower = flower_head;
        this.bug = bug;
    }
    stepWorld(delta, timeOfDay) {
        if (this.bug == null) return;
        this.flower.lookAt(this.bug.position);
    }
}

/**
 * 
 * @param {Bug} bugInfo 
 * @returns 
 */
function makeBug(bugInfo) {

    let scale = bugInfo.scale;
    let rotation = bugInfo.rotation;
    let position = bugInfo.position;
    let material = bugInfo.matBody;
    let eyeMaterial = bugInfo.matEye;
    let propellerMaterial = bugInfo.matPropeller;
    let tailSize = bugInfo.tailSize;
    let func = bugInfo.func;
    let pos1 = bugInfo.propellerPos[0];
    let pos2 = bugInfo.propellerPos[1];
    let pos3 = bugInfo.propellerPos[2];
    let pos4 = bugInfo.propellerPos[3];
    let rot1 = bugInfo.propellerRot[0];
    let rot2 = bugInfo.propellerRot[1];
    let rot3 = bugInfo.propellerRot[2];
    let rot4 = bugInfo.propellerRot[3];

    let bugGeom = new T.CapsuleGeometry(1,2);
    let bug = new T.Mesh(bugGeom, material);
    bug.scale.set(scale[0], scale[1], scale[2]);
    bug.rotation.set(rotation[0], rotation[1], rotation[2]);
    bug.position.set(position[0], position[1], position[2]);

    // add propellers
    func(bug, pos1, rot1);
    func(bug, pos2, rot2);
    func(bug, pos3, rot3);
    func(bug, pos4, rot4);

    // add tail
    let tailGeom = new T.ConeGeometry(tailSize, 1);
    let tailMaterial = new T.MeshStandardMaterial({ color: "black" , metalness: 0.5, roughness: 0.5});
    let tail = new T.Mesh(tailGeom, tailMaterial);
    bug.add(tail);
    tail.rotation.set(Math.PI,0,0);
    tail.position.set(0,-2,0);

    // add black eyes
    let eyeGeom = new T.SphereGeometry(0.4, 32, 32);
    let eye1 = new T.Mesh(eyeGeom, eyeMaterial);
    bug.add(eye1);
    eye1.position.set(0.5,1.75,0.5);
    eye1.rotateX(Math.PI/2);
    let eye2 = new T.Mesh(eyeGeom, eyeMaterial);
    bug.add(eye2);
    eye2.position.set(0.5,1.75,-0.5);
    eye2.rotateX(Math.PI/2);

    // attenae
    let attenaeGeom = new T.CylinderGeometry(0.1, 0.1, 2);
    let attenaeMaterial = new T.MeshStandardMaterial({ color: "black" });
    let attenae1 = new T.Mesh(attenaeGeom, attenaeMaterial);
    bug.add(attenae1);
    attenae1.position.set(.25,2,0.15);
    attenae1.rotation.set(Math.PI/8,0,Math.PI/8);
    let attenae2 = new T.Mesh(attenaeGeom, attenaeMaterial);
    bug.add(attenae2);
    attenae2.position.set(.25,2,-0.15);
    attenae2.rotation.set(-Math.PI/8,0,Math.PI/8);

    // wings
    let wingGeom = new T.CylinderGeometry(1, 1, 0.1, 32);
    let wingMaterial = new T.MeshStandardMaterial({ color: "#F0F070", transparent: true, opacity: 0.5 });
    let wing1 = new T.Mesh(wingGeom, wingMaterial);
    bug.add(wing1);
    wing1.position.set(.75,0,1);
    wing1.rotation.set(-Math.PI/4,0,Math.PI/2);
    wing1.scale.set(1,1,0.5);
    let wing2 = new T.Mesh(wingGeom, wingMaterial);
    bug.add(wing2);
    wing2.position.set(.75,0,-1);
    wing2.rotation.set(Math.PI/4,0,Math.PI/2);
    wing2.scale.set(1,1,0.5);

    return bug;
}

function makePropellerArm(bug, position, rotation) {
    let propGeom = new T.CylinderGeometry(0.1, 0.1, 2.2);
    let propMaterial = new T.MeshStandardMaterial({ color: "blue" });
    let prop1 = new T.Mesh(propGeom, propMaterial);
    bug.add(prop1);
    prop1.position.set(position[0], position[1], position[2]);
    prop1.rotation.set(rotation[0], rotation[1], rotation[2]);

    let group = new T.Group();
    prop1.add(group);
    group.position.set(-0.1, -1.2, 0);

    let bladeGeom = new T.BoxGeometry(0.1, 1, 0.2);
    let bladeMaterial = new T.MeshStandardMaterial({ color: "black" });
    let blade = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade);
    blade.position.set(0, -0.5, 0);
    let blade2 = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade2);
    blade2.rotateX(Math.PI / 2);
    blade2.position.set(0, 0, -0.5);
    let blade3 = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade3);
    blade3.position.set(0, 0.5, 0);
    let blade4 = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade4);
    blade4.rotateX(Math.PI / 2);
    blade4.position.set(0, 0, 0.5);
}

function makePropellerWing(bug, position, rotation) {
    let prop1 = new T.Group();
    bug.add(prop1);
    prop1.position.set(position[0], position[1], position[2]);
    prop1.rotation.set(rotation[0], rotation[1], rotation[2]);

    let group = new T.Group();
    prop1.add(group);
    group.position.set(-0.1, -1.2, 0);

    let bladeGeom = new T.BoxGeometry(0.1, .4, 0.2);
    let bladeMaterial = new T.MeshStandardMaterial({ color: "black" });
    let blade = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade);
    blade.position.set(0, -0.35, 0);
    let blade2 = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade2);
    blade2.rotateX(Math.PI / 2);
    blade2.position.set(0, 0, -0.35);
    let blade3 = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade3);
    blade3.position.set(0, 0.35, 0);
    let blade4 = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade4);
    blade4.rotateX(Math.PI / 2);
    blade4.position.set(0, 0, 0.35);
}

function makeFlower(scale, rotation,  material, flowerVectors, stemLength) {

    let flowerGroup = new T.Group();
    flowerGroup.scale.set(scale[0], scale[1], scale[2]);
    flowerGroup.rotation.set(rotation[0], rotation[1], rotation[2]);

    let flowerGeom = new T.LatheGeometry(flowerVectors, 32);
    let flower = new T.Mesh(flowerGeom, material);
    flower.position.set(0,0,0);

    // // add stem
    // let stemGeom = new T.CylinderGeometry(0.1, 0.1, stemLength, 32);
    // let stem = new T.Mesh(stemGeom, material);
    // stem.position.set(0, -stemLength/2, stemLength/2 - 0.1);
    // stem.scale.set(scale[0], scale[1], scale[2]);
    //stem.rotation.set(-rotation[0]+0.3, -rotation[1], -rotation[2]);
    //flowerGroup.add(stem);

    // add petals
    let petalGeom = new T.CylinderGeometry(1, 1, 0.2, 32);
    let petalMaterial = new T.MeshStandardMaterial({ color: "#F0F040", side: T.DoubleSide });

    for (let i = 0; i < 8; i++) {
        let petal = new T.Mesh(petalGeom, petalMaterial);
        petal.scale.set(1, 1, 0.75); // Scale petals to be thinner
        petal.position.set(0, 1.5, 0); // Position petals at the correct height
        petal.rotation.set(0, i*Math.PI/4,0); // Rotate petals to face outward
        petal.rotateX(Math.PI/4); // Rotate petals to face outward
        petal.translateX(1); // Move petals outward from the center
        flowerGroup.add(petal);
    }

    flowerGroup.add(flower);

    return flowerGroup;
}


// animation loop
// function animateLoop(timestamp) {
//     if (currTime == 0) {
//         currTime = timestamp;
//     }

//     let delta = (timestamp - currTime) / 1000;

//     // move bug1 in a circle
//     let theta = timestamp / 1000;
//     let x = 3 * Math.cos(theta);
//     let z = 3 * Math.sin(theta);
//     bug.position.x = x;
//     bug.position.z = z;
//     bug.rotation.y = -theta+Math.PI/2;
//     flowerGroup.lookAt(bug.position);

//     // move bug's propellers
//     for (let i = 0; i < 4; i++) {
//         let prop = bug.children[i];
//         let direction = 1;
//         if (i % 2 == 1) {
//             direction = -1;
//         }

//         prop.children[0].rotation.x = -4*direction * theta;
//     }

    
    

//     currTime = timestamp;

//     renderer.render(scene, camera);
//     window.requestAnimationFrame(animateLoop);
//   }
//window.requestAnimationFrame(animateLoop);