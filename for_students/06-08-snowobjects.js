// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

let carrot_texture = new T.TextureLoader().load("../images/carrot_texture.png");
let snow_texture = new T.TextureLoader().load("../images/snow.png");

let baseGeo = new T.BoxGeometry(50,0.5,50);
let snow = new T.MeshStandardMaterial({color: "#FFFFFF", map: snow_texture, roughness: 0.6});
let snowmanBaseGeo = new T.SphereGeometry(4,32,32);
let coal = new T.CylinderGeometry(0.2,0.2,0.4,32);
let coalMaterial = new T.MeshStandardMaterial({color: "#101030"});
let armGeo = new T.CylinderGeometry(0.5,0.5,8,32);
let armMaterial = new T.MeshStandardMaterial({color: "#8B4513"});
let carrotGeo = new T.ConeGeometry(0.5,2,32);
let carrotMaterial = new T.MeshStandardMaterial({color: "#FF6600", bumpMap: carrot_texture, bumpScale: 2});

let snowmanCtr = 0;
export class Snowman extends GrObject {
    constructor() {
        // ground base
        let base = new T.Mesh(baseGeo, snow);
        base.receiveShadow = true;

        // snowman base
        let snowmanBase1 = new T.Mesh(snowmanBaseGeo, snow);
        snowmanBase1.receiveShadow = true;
        snowmanBase1.castShadow = true;
        snowmanBase1.position.set(0,2,0);

        let snowmanBase2 = new T.Mesh(snowmanBaseGeo, snow);
        snowmanBase2.receiveShadow = true;
        snowmanBase2.castShadow = true;
        snowmanBase2.position.set(0,6.75,0);
        snowmanBase2.scale.set(0.8,0.8,0.8);

        let snowmanBase3 = new T.Mesh(snowmanBaseGeo, snow);
        snowmanBase3.receiveShadow = true;
        snowmanBase3.castShadow = true;
        snowmanBase3.position.set(0,10.75,0);
        snowmanBase3.scale.set(0.6,0.6,0.6);

        // snowman carrot nose
        let carrot = new T.Mesh(carrotGeo, carrotMaterial);
        carrot.castShadow = true;
        carrot.receiveShadow = true;
        carrot.position.set(0,10.5,3);
        carrot.rotation.set(Math.PI/2,0,0);

        // snowman eyes
        let eye1 = new T.Mesh(coal, coalMaterial);
        eye1.castShadow = true;
        eye1.receiveShadow = true;
        eye1.position.set(-.8,11.5,2);
        eye1.rotation.set(Math.PI/2,0,0);

        let eye2 = new T.Mesh(coal, coalMaterial);
        eye2.castShadow = true;
        eye2.receiveShadow = true;
        eye2.position.set(.8,11.5,2);
        eye2.rotation.set(Math.PI/2,0,0);

        // snowman mouth
        let mouth = new T.Mesh(coal, coalMaterial);
        mouth.castShadow = true;
        mouth.receiveShadow = true;
        mouth.position.set(0,9.75,2.1);
        mouth.rotation.set(Math.PI/2,0,0);
        mouth.scale.set(1.5,1,1);

        // snowman buttons
        let button1 = new T.Mesh(coal, coalMaterial);
        button1.castShadow = true;
        button1.receiveShadow = true;
        button1.position.set(0,8.5,2.5);
        button1.rotation.set(Math.PI/2-.5,0,0);

        let button2 = new T.Mesh(coal, coalMaterial);
        button2.castShadow = true;
        button2.receiveShadow = true;
        button2.position.set(0,7.5,3);
        button2.rotation.set(Math.PI/2,0,0);

        let button3 = new T.Mesh(coal, coalMaterial);
        button3.castShadow = true;
        button3.receiveShadow = true;
        button3.position.set(0,6.5,3.1);
        button3.rotation.set(Math.PI/2+.2,0,0);

        // snowman arms
        let arm1 = new T.Mesh(armGeo, armMaterial);
        arm1.castShadow = true;
        arm1.receiveShadow = true;
        arm1.position.set(-3,8,0);
        arm1.rotation.set(0,0,Math.PI/4);

        let arm2 = new T.Mesh(armGeo, armMaterial);
        arm2.castShadow = true;
        arm2.receiveShadow = true;
        arm2.position.set(3,8,0);
        arm2.rotation.set(0,0,-Math.PI/4);

        // snowman hat
        let hatGeo = new T.CylinderGeometry(2,1.75,3,32);
        let hatMaterial = new T.MeshStandardMaterial({color: "#303030", side: T.DoubleSide, roughness: 1});
        let hatBase = new T.Mesh(hatGeo, hatMaterial);
        hatBase.castShadow = true;
        hatBase.receiveShadow = true;
        hatBase.position.set(0,14,0);

        let hatRingGeo = new T.CylinderGeometry(3,3,0.2,32);
        let hatRing = new T.Mesh(hatRingGeo, hatMaterial);
        hatRing.castShadow = true;
        hatRing.receiveShadow = true;
        hatRing.position.set(0,12.5,0);

        // create animation groups
        let hat = new T.Group;
        hat.add(hatBase);
        hat.add(hatRing);

        let head = new T.Group();
        head.add(carrot);
        head.add(eye1);
        head.add(eye2);
        head.add(mouth);
        head.add(hat);
        head.add(snowmanBase3);

        let middle = new T.Group();
        middle.add(snowmanBase2);
        middle.add(arm1);
        middle.add(arm2);
        middle.add(button1);
        middle.add(button2);
        middle.add(button3);

        let snowman = new T.Group();
        snowman.add(snowmanBase1);
        snowman.add(middle);
        snowman.add(head);

        super(`Snowman - ${snowmanCtr++}`, snowman);

        this.snowman = snowman;
        this.hat = hat;
        this.head = head;
        this.middle = middle;
        this.arm1 = arm1;
        this.arm2 = arm2;
        this.time = 0;
    }
    stepWorld(delta, timeOfDay) {

        this.time += delta/500;

        // wave arms
        let armAngle = Math.sin(this.time)/4;
        this.arm1.rotation.set(0,0,Math.PI/4 + armAngle);
        this.arm2.rotation.set(0,0,-Math.PI/4 - armAngle);

        // bob hat up and down
        let hatBob = Math.sin(this.time*2)/8;
        this.hat.position.y = hatBob;
    }
}

let snowdogCtr = 0;
export class Snowdog extends GrObject {
    constructor() {

        let dogBase = new T.Mesh(snowmanBaseGeo, snow);
        dogBase.scale.set(1,.75,1.5);
        dogBase.receiveShadow = true;
        dogBase.castShadow = true;
        dogBase.position.set(3,2,7);

        let dogMiddle = new T.Mesh(snowmanBaseGeo, snow);
        dogMiddle.scale.set(0.6,0.6,0.9);
        dogMiddle.receiveShadow = true;
        dogMiddle.castShadow = true;
        dogMiddle.position.set(0,-1,1);

        let dogTop = new T.Mesh(snowmanBaseGeo, snow);
        dogTop.scale.set(0.6,0.6,0.6);
        dogTop.receiveShadow = true;
        dogTop.castShadow = true;

        // coal dog eyes
        let dogEye1 = new T.Mesh(coal, coalMaterial);
        dogEye1.castShadow = true;
        dogEye1.receiveShadow = true;
        dogEye1.position.set(-1,1.5,1.4);
        dogEye1.rotation.set(Math.PI/4,0,Math.PI/4);
        dogEye1.scale.set(1.5,1,1.5);

        let dogEye2 = new T.Mesh(coal, coalMaterial);
        dogEye2.castShadow = true;
        dogEye2.receiveShadow = true;
        dogEye2.position.set(1,1.5,1.4);
        dogEye2.rotation.set(Math.PI/4,0,-Math.PI/4);
        dogEye2.scale.set(1.5,1,1.5);

        // dog coal nose
        let dogNose = new T.Mesh(coal, coalMaterial);
        dogNose.castShadow = true;
        dogNose.receiveShadow = true;
        dogNose.position.set(0,0.25,4);
        dogNose.rotation.set(Math.PI/4,0,0);
        dogNose.scale.set(1.5,1,1.5);

        // dog carrot ears
        let ear1 = new T.Mesh(carrotGeo, carrotMaterial);
        ear1.castShadow = true;
        ear1.receiveShadow = true;
        ear1.position.set(-2,2,1);
        ear1.rotation.set(Math.PI/4,0,Math.PI/4);

        let ear2 = new T.Mesh(carrotGeo, carrotMaterial);
        ear2.castShadow = true;
        ear2.receiveShadow = true;
        ear2.position.set(2,2,1);
        ear2.rotation.set(Math.PI/4,0,-Math.PI/4);

        // stick tail
        let tailStick = new T.Mesh(armGeo, armMaterial);
        tailStick.position.set(0, 2.5, -1);
        tailStick.scale.set(1, 0.5, 1);
        tailStick.castShadow = true;
        tailStick.receiveShadow = true;

        let tail = new T.Group();
        tail.position.set(3,4,4);
        tail.rotation.set(-Math.PI/4,0,0);
        tail.add(tailStick);

        let dogHead = new T.Group();
        dogHead.add(dogMiddle);
        dogHead.add(dogTop);
        dogHead.add(ear1);
        dogHead.add(ear2);
        dogHead.add(dogEye1);
        dogHead.add(dogEye2);
        dogHead.add(dogNose);
        dogHead.position.set(3,5,9);

        let snowDog = new T.Group();
        snowDog.add(dogBase);
        snowDog.add(dogHead);
        snowDog.add(tail);
        snowDog.rotation.set(0,Math.PI/4,0);

        super(`Snowdog - ${snowdogCtr++}`, snowDog);

        this.snowdog = snowDog;
        this.dogHead = dogHead;
        this.tail = tail;
        this.time = 0;
    }
    stepWorld(delta, timeOfDay) {

        this.time += delta / 500;

        let tailAngle = Math.sin(this.time*2)/2;
        this.tail.rotation.set(-Math.PI/4,0,tailAngle);

        // rotate dog head
        let headAngle = Math.sin(this.time)/2;

        if (headAngle > 0) {
            headAngle = Math.sin(this.time)/5;
        }

        this.dogHead.rotation.set(headAngle,0,0);

    }
}

let snowCtr = 0;
export class Snow extends GrObject {
    constructor() {
        let snow = new T.Group();

        let snowGeom = new T.SphereGeometry(3, 32, 32);
        let snowMat = new T.MeshStandardMaterial({color: "#FFFFFF", map: snow_texture, bumpMap: carrot_texture, bumpScale: .25});
        let snowMesh = new T.Mesh(snowGeom, snowMat);

        snowMesh.position.set(0, 1, 0);
        snowMesh.castShadow = true;
        snowMesh.receiveShadow = true;

        snow.add(snowMesh);

        super(`Snow-${snowCtr++}`, snow);
    }
}

export class SnowFlake extends GrObject {
    constructor(x = 0, y=0,z = 0, noise = 0) {
        let flake = new T.Group();

        let flakeGeom = new T.SphereGeometry(0.05, 32, 32);
        let flakeMat = new T.MeshStandardMaterial({color: "#FFFFFF"});
        let flakeMesh = new T.Mesh(flakeGeom, flakeMat);

        flakeMesh.castShadow = true;
        flakeMesh.receiveShadow = true;

        flake.add(flakeMesh);
        flake.position.set(x, y, z);

        super(`SnowFlake-${snowCtr++}`, flake);

        this.position = flake.position;
        this.noise = noise;
        this.time = 0;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    stepWorld(delta, timeOfDay) {
        this.time += delta / 100;
        //this.position.y -= Math.sin(time)/10;
        this.position.x = Math.sin(this.time/2+this.noise*3)/2 + this.x;
        this.position.z = Math.cos(this.time/2+this.noise*3)/2 + this.z;
        this.position.y = this.position.y - delta / 100;
        if (this.position.y < 0) {
            this.position.y = 20;
        }
    }
}

