/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";
import { Snowman, Snowdog, Snow, SnowFlake } from "./06-08-snowobjects.js";
import { GrForklift, GrBulldozer } from "./07-09-constructionobjects.js";
import { 
    TudorGable, 
    Gazebo, 
    PineTree, 
    SnowyPineTree, 
    FallOakTree, 
    CherryBlossomTree, 
    Bush, 
    Disco, 
    BirdView,
    Building1,
    Building1Inside
} from "./08-06-buildings.js";
import { BugGrBee, BugGrFly, Flower } from "./07-06-bugs.js";
import { Wagon } from "./08-07-car.js";
import { GrTireSwing,} from "./07-08-parkobjects.js";
import * as T from "../libs/CS559-Three/build/three.module.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";

/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}

// make the world
let div = document.getElementById("div1");

let world = new GrWorld({
    where: div,
    width: 800,
    height: 600,
    groundplanesize: 20 // make the ground plane big enough for a world of stuff
});

world.groundplane.mesh.geometry = new T.CylinderGeometry(26, 26, 0.1, 32);

// world background
let texture_loader = new T.TextureLoader();

let skyBackground = texture_loader.load("../images/sky.png");
skyBackground.mapping = T.EquirectangularReflectionMapping;
world.scene.background = skyBackground;

// light
world.renderer.shadowMap.enabled = true;
world.groundplane.mesh.receiveShadow = true;

let light = new T.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 6);
light.castShadow = true;
light.shadow.mapSize.width = 2048; 
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 100;
light.shadow.camera.left = -30;
light.shadow.camera.right = 30;
light.shadow.camera.top = 30;
light.shadow.camera.bottom = -30;

world.scene.add(light);

let water_normal = texture_loader.load("../images/Water_002_SD/Water_002_NORM.jpg");
water_normal.wrapS = T.RepeatWrapping;
water_normal.wrapT = T.RepeatWrapping;
water_normal.repeat.set(10, 50);
let water_displacement = texture_loader.load("../images/Water_002_SD/Water_002_DISP.png");
water_displacement.wrapS = T.RepeatWrapping;
water_displacement.wrapT = T.RepeatWrapping;
water_displacement.repeat.set(10, 50);
let river_texture = texture_loader.load("../images/river.png");

// river
let riverGeometry = new T.PlaneGeometry(5, 25, 100, 100);

let riverMaterial = new T.MeshStandardMaterial({
    color: 0x0044ff,
    transparent: true,
    opacity: 0.75,
    side: T.DoubleSide,
    depthWrite: false,
    map: river_texture,
});
let riverShader = shaderMaterial("../shaders/water.vs", "../shaders/water.fs", {
    uniforms: {
        time: { value: 0 },
        map: {value: river_texture},
        normalMap: { value: water_normal },
        displacementMap: {value: water_displacement},
        color: { value: new T.Color(0x1E90FF) },
        lightDir: {value: new T.Vector3(0, 10, 6).normalize()},
    },
    opacity: 0.75,
    transparent: true,
});

let time = 0;
let riverCtr = 0;
class River extends GrObject {
    constructor () {

        let river_group = new T.Group();

        let river = new T.Mesh(riverGeometry, riverShader);
        river.rotation.x = -Math.PI / 2;
        river.position.y = 0.1; // slightly above the ground
        river.receiveShadow = true;
        river.castShadow = true;
        river_group.add(river);

        let river2 = river.clone();
        river2.position.y = 0.08;
        river_group.add(river2);

        let river_bottom = new T.Mesh(riverGeometry, riverMaterial);
        river_bottom.rotation.x = -Math.PI /2;
        river_bottom.position.y = 0;
        river_group.add(river_bottom);

        super(`River - ${riverCtr++}`, river_group);
        this.river = river;
    }
    stepWorld(delta) {
        time += delta * 0.001; // increment time based on delta time
        this.river.material.uniforms.time.value = time; // update the shader uniform
        this.river.material.uniforms.lightDir.value.copy(light.position).normalize(); // update light direction
    }
    /**
       * return a plausible lookfrom/lookat pair to look at this object
       * this makes a guess based on the bounding box, but an object may
       * want to override to give a better view
       *
       * Returns an array of 6 numbers (lookfrom X,Y,Z, lookat X, Y, Z)
       *
       * @returns {Array<Number>}
       */
      lookFromLookAt() {
        const bbox = new T.Box3();
        bbox.setFromObject(this.objects[0]);
        const x = (bbox.max.x + bbox.min.x) / 2;
        const y = (bbox.max.y + bbox.min.y) / 2;
        const z = (bbox.max.z + bbox.min.z) / 2;
    
        // make the box a little bigger to deal with think/small objects
        const dx = bbox.max.x - x + 0.05;
        const dy = bbox.max.y - y + 0.05;
        const dz = bbox.max.z - z + 0.05;
    
        const d = Math.max(dx, dy, dz);
    
        // originally, this was 3*d, but that was too far away
        const fx = x + d;
        const fy = y + d;
        const fz = z + d;
    
        return [fx, fy, fz, x, y, z];
      }
}

let river = new River();
river.setPos(-22,0,0);
world.add(river);

// bushes around the river

// bushes near center
for(let i = 0; i < 10; i++) {
    let bush = new Bush();
    bush.setPos(-22.3 + i/(i/4+2), 0.3, -12 + i*1.5);
    bush.objects[0].rotateY(-i * (Math.PI / 80.0) + Math.PI/10.0);
    world.add(bush);
}

let bush1 = new Bush();
bush1.setPos(-22.35 + 10/(10/4+2), 0.3, -11.95 +10*1.5);
bush1.objects[0].rotateY(-Math.PI/50.0);
world.add(bush1);

for(let i = 0; i < 5; i++) {
    let bush = new Bush();
    bush.setPos(-22.2 + i/(i/8+2), 0.3, 12.1 - i*1.5);
    bush.objects[0].rotateY(i * (Math.PI / 80.0) - Math.PI/10.0);
    world.add(bush);
}

let bush = new Bush();
bush.setPos(-22.2 + 5/(5/8+2), 0.3, 12.1-5*1.5);
bush.objects[0].rotateY(-Math.PI/30.0);
world.add(bush);

// bushes near edge
for(let i = 0; i < 8; i++) {
    let bush = new Bush();
    bush.setPos(-24.1 + i/(i+2), 0.3, -8.9 + i*1.5);
    bush.objects[0].rotateY(-i * (Math.PI / 80.0) + Math.PI/12.0);
    world.add(bush);
}
for(let i = 0; i < 5; i++) {
    let bush = new Bush();
    bush.setPos(-24.1 + i/(i+2), 0.3, 8.9 - i*1.5);
    bush.objects[0].rotateY(i * (Math.PI / 80.0) - Math.PI/12.0);
    world.add(bush);
}

//  ******** TREES AND BUILDINGS ********

// houses in a circle
for (let i = 0; i < 12; i++) {
    
    let house;
    let y;
    
    if (i % 2 == 0) {
        house = new TudorGable();
        house.setScale(1.25, 1.25, 1.25);
        y = 0;
        house.objects[0].rotateY(-Math.PI/2 - i * (Math.PI / 6));
        house.setPos(10 * Math.cos((i * Math.PI) / 6), y, 10 * Math.sin((i * Math.PI) / 6));
        world.add(house);
    }
    else {
        house = new T.Group();
        let exterior = new Building1().objects[0];
        let interior = new Building1Inside().objects[0];
        house.add(exterior);
        house.add(interior);
        y = 1.25
        house.rotateY(-Math.PI/2 - i * (Math.PI / 6));
        house.position.set(10 * Math.cos((i * Math.PI) / 6), y, 10 * Math.sin((i * Math.PI) / 6));
        world.scene.add(house);
    }
    
    
}

let gazebo = new Gazebo();
gazebo.setScale(1.5, 1.5, 1.5);
gazebo.setPos(0, 0, 0);
gazebo.objects[0].rotateY(-Math.PI/4);
world.add(gazebo);

let disco = new Disco(4,world);
disco.setScale(0.35, 0.35, 0.35);
disco.setPos(0, 1.6, 0);
world.add(disco);

// Sine noise function to create a smooth noise effect
let sine_noise = (x) => {
    let a = Math.sin(x)*10000;
    return a - Math.floor(a); // get only fraction bit
}

// Trees placed in a circle, influenced by noise
let fall_tree_group = [];
for (let i = 0; i < 12; i++) {

    let noise = sine_noise(i * Math.PI / 6);

    // scale affected by noise
    let scale = 1 + noise/2;
    let x = 10 * Math.cos((i * Math.PI) / 6);
    let z = 10 * Math.sin((i * Math.PI + noise) / 6);

    // depending on which quadrant the tree is in, change the type of tree
    let tree;

    if (x <= 0) {
        if (z <= 0) {
            tree = new FallOakTree(null);
            fall_tree_group.push(tree);
        }
        else {
            tree = new PineTree();
        }
    }
    else {
        if (z <= 0) {
            tree = new SnowyPineTree();
        }
        else {
            tree = new CherryBlossomTree();
        }
    }

    tree.setScale(scale, scale, scale);

    tree.objects[0].rotateY(-Math.PI/2 - i * (Math.PI / 6));

    tree.setPos(x, 0, z);
    tree.objects[0].translateX(noise * 5 + 15); // add some noise to the x position
    tree.objects[0].translateZ(-noise * 5 + 15); // add some noise to the z position

    world.add(tree);
}

for (let i = 0; i < 12; i++) {

    let noise = sine_noise(i * Math.PI / 6);

    // scale affected by noise
    let scale = 1 + (1- noise/2);
    let x = 15 * Math.cos((i * Math.PI) / 6);
    let z = 15 * Math.sin((i * Math.PI + noise) / 6);
    
    // depending on which quadrant the tree is in, change the type of tree
    let tree;

    if (x <= 0) {
        if (z <= 0) {
            tree = new PineTree();
        }
        else {
            tree = new CherryBlossomTree();
        }
    }
    else {
        if (z <= 0) {
            tree = new FallOakTree(null);
            fall_tree_group.push(tree);
        }
        else {
            tree = new SnowyPineTree();
        }
    }

    tree.setScale(scale, scale, scale);

    tree.objects[0].rotateY(-Math.PI/2 - i * (Math.PI / 6));
    tree.setPos(x, 0, z);
    tree.objects[0].translateX(noise * 5 -1); // add some noise to the x position
    tree.objects[0].translateZ(-noise * 5 +1); // add some noise to the z position
    
    world.add(tree);
}

let bird = new BirdView(25);
bird.setPos(-1,1,2);
world.add(bird);

// ********* SUMMER - bugs, flowers  ************
let bee = new BugGrBee(-15,1,-15,1);
bee.setScale(0.2, 0.2, 0.2);
world.add(bee);

let beeFlower = new Flower({ scale:[0.1,0.1,0.1], stemLength: 5, type: -1}, bee.objects[0]);
beeFlower.setPos(-15, .2, -15);
world.add(beeFlower);

let fly = new BugGrFly(-15,1,-10,1);
fly.setScale(0.2, 0.2, 0.2);
world.add(fly);

let flyFlower = new Flower({ scale:[0.1,0.1,0.1], stemLength: 5, type: -1}, fly.objects[0]);
flyFlower.setPos(-15, .2, -8);
world.add(flyFlower);

/**
 * creates a ring of flowers, whose sizes and positions are determined by sine noise
 * @param {Number} xCenter 
 * @param {Number} zCenter 
 */
function flowerRing(xCenter, zCenter, radius=4.5, useRing=false) {
    for (let i = 0; i < 12; i++) {

        let noise = sine_noise(i * Math.PI / 6);
    
        // scale affected by noise
        let scale = noise/16 + 0.075;
        if (scale > 0.5) {
            scale = 0.5;
        }

        let x = radius*Math.cos((i * Math.PI) / 6) + xCenter;
        let z = radius*Math.sin((i * Math.PI + noise) / 6) + zCenter;
        
        // depending on which quadrant the tree is in, change the type of tree
        let flower = new Flower({ scale:[1,1,1], stemLength: 5, type: -1}, null);
    
        flower.setScale(scale, scale, scale);
    
        flower.setPos(x, 3*scale, z);

        if (!useRing) {
            flower.objects[0].translateX(noise * 2 -1); // add some noise to the x position
            flower.objects[0].translateZ(-noise * 2); // add some noise to the z position
        }
        else {
            flower.objects[0].rotateY(-Math.PI/2 - i * (Math.PI / 6));
        }

        world.add(flower);
    }
}

flowerRing(-15, -15, 3, false);
flowerRing(-12,-12,3,false);
flowerRing(-16,-10,3,false);
flowerRing(-15, -15, 2, false);
flowerRing(-6,-14,2,false);
flowerRing(-10,-12,2,false);
flowerRing(-6,-20,2,false);
flowerRing(-10,-20,2,false);
flowerRing(0, -20, 2, false);

// ********* FALL - playground *********
let tireSwing = new GrTireSwing({size: 0.4, x: 15, z: -15, ry: Math.PI/4});
world.add(tireSwing);

// fallen leaves
let fall_leaves_texture = texture_loader.load("../images/fallen_leaves.png");
fall_leaves_texture.colorSpace = T.SRGBColorSpace;

let fall_leaves_material = new T.MeshStandardMaterial({
    map: fall_leaves_texture,
    transparent: true,
    depthWrite: false, // prevents transparent section from being written with the wrong color behind it
});

let fall_leaves_geometry = new T.PlaneGeometry(15, 5, 100, 100);

let fall_leaves_count = 0;

class FallenLeaves extends GrObject {
    constructor(x,y,z) {
        let fall_leaves = new T.Mesh(fall_leaves_geometry, fall_leaves_material);
        fall_leaves.position.set(x,y,z);
        fall_leaves.rotateY(-Math.PI/4);
        fall_leaves.rotateX(-Math.PI / 2);
        fall_leaves.receiveShadow = true;
        fall_leaves.castShadow = true;

        super(`Fallen Leaves - ${fall_leaves_count++}`, fall_leaves);
    }
}
// fallen leaves to north
let fallen_leaves = new FallenLeaves(12,0,-13);
fallen_leaves.objects[0].renderOrder = 1;
world.add(fallen_leaves);
let fallen_leaves2 = new FallenLeaves(9,0,-13);
world.add(fallen_leaves2);
fallen_leaves2.objects[0].renderOrder = 2;
let fallen_leaves3 = new FallenLeaves(15,0,-14);
world.add(fallen_leaves3);
fallen_leaves3.objects[0].renderOrder = 3;

// fallen leaves to the west
let fallen_leaves4 = new FallenLeaves(20,0,-7);
fallen_leaves4.objects[0].rotateZ(-Math.PI/8);
world.add(fallen_leaves4);
fallen_leaves4.objects[0].renderOrder = 4;
let fallen_leaves5 = new FallenLeaves(18,0,-5);
fallen_leaves5.objects[0].rotateZ(-Math.PI/8);
world.add(fallen_leaves5);
fallen_leaves5.objects[0].renderOrder = 5;
let fallen_leaves6 = new FallenLeaves(15,0,-3);
fallen_leaves6.objects[0].rotateZ(-Math.PI/8);
world.add(fallen_leaves6);
fallen_leaves6.objects[0].renderOrder = 6;

// fallen leaves near houses
let fallen_leaves7 = new FallenLeaves(7,0,-5);
fallen_leaves7.objects[0].rotateZ(-Math.PI/16);
world.add(fallen_leaves7);
fallen_leaves7.objects[0].renderOrder = 7;
let fallen_leaves8 = new FallenLeaves(5,0,-2);
fallen_leaves8.objects[0].rotateZ(-Math.PI/16);
world.add(fallen_leaves8);
fallen_leaves8.objects[0].renderOrder = 8;
let fallen_leaves9 = new FallenLeaves(11,0,-5);
fallen_leaves9.objects[0].rotateZ(-Math.PI/16);
world.add(fallen_leaves9);
fallen_leaves9.objects[0].renderOrder = 9;
let fallen_leaves10 = new FallenLeaves(8,0,-9);
fallen_leaves10.objects[0].rotateZ(-Math.PI/16);
world.add(fallen_leaves10);
fallen_leaves10.objects[0].renderOrder = 10;
let fallen_leaves11 = new FallenLeaves(10,0,-2);
fallen_leaves11.objects[0].rotateZ(-Math.PI/16);
world.add(fallen_leaves11);
fallen_leaves11.objects[0].renderOrder = 11;


// ******** WINTER - snowman, snowdog, snowflakes **********
let snowman = new Snowman();
snowman.setScale(0.2, 0.2, 0.2);
snowman.setPos(13, 0, 10);
world.add(snowman);

let snowdog = new Snowdog();
snowdog.setScale(0.2, 0.2, 0.2);
snowdog.setPos(10, 0, 11);
world.add(snowdog);

let snowflake_group = [];

/**
 * creates a ring of snow drifts, whose sizes are determined by sine noise
 * @param {Number} xCenter 
 * @param {Number} zCenter 
 */
function snowRing(xCenter, zCenter, yCenter=0) {
    for (let i = 0; i < 12; i++) {

        let noise = sine_noise(i * Math.PI / 6);
    
        // scale affected by noise
        let scaleX = noise/4 + 0.75;
        let scaleY = (1-noise)/20 + 0.05;
        let scaleZ = noise/2 + 0.6;
        let x = 5*Math.cos((i * Math.PI) / 6) + xCenter;
        let z = 5*Math.sin((i * Math.PI + noise) / 6) + zCenter;
        
        // depending on which quadrant the tree is in, change the type of tree
        let snow = new Snow();
    
        snow.setScale(scaleX, scaleY, scaleZ);
    
        snow.objects[0].rotateY(-Math.PI/2 - i * (Math.PI / 6));
        snow.setPos(x, 0, z);
        world.add(snow);

        let y = noise*20 + yCenter + xCenter/2 + zCenter/2;

        let snowflake = new SnowFlake(x,y,z,noise);
        world.add(snowflake);

        snowflake_group.push(snowflake.objects[0]);
    }
}

snowRing(14,13,17);
snowRing(5, 11.5,1);
snowRing(6, 16.5,3);
snowRing(10, 12.5,5);
snowRing(9.3, 16.2,7);
snowRing(8, 9.5,9);
snowRing(3, 14.5,11);
snowRing(5, 18.5,13);
snowRing(0, 19.5,15);

// vehicle
let wagon = new Wagon(1.5,1, world,5);
wagon.setPos(0, 1.2, 0);
world.add(wagon);

let world_camera = world.active_camera;

let wagonCamera = new T.PerspectiveCamera(45, 1, 0.1, 1000);

// ******* SPRING - construction vehicles *********

let forklift = new GrForklift({ x: -12, z: 13 });
forklift.objects[0].rotateY(Math.PI/2);
world.add(forklift);

let bulldozer = new GrBulldozer({ x: -15, z: 10 });
world.add(bulldozer);

// upon clicking a button, switch cameras
document.addEventListener('keydown', (event) => {
    if (event.key === 'b') {
        if (world.active_camera === world_camera) {
            world.active_camera = bird.camera;
        } else {
            world.active_camera = world_camera;
        }
    }
    // if (event.key === 'c') {
    //     if (world.active_camera === world_camera) {
    //         world.active_camera = wagonCamera; // Switch to the wagon camera
    //     } else {
    //         world.active_camera = world_camera; // Switch to the default camera
    //     }
    // }


    // move forklift
    if (event.key === 'w') {
        forklift.objects[0].position.z -= 0.1;
    }
    if (event.key === 's') {
        forklift.objects[0].position.z += 0.1;
    }
    if (event.key === 'd') {
        forklift.objects[0].position.x += 0.1;
    }
    if (event.key === 'a') {
        forklift.objects[0].position.x -= 0.1;
    }
    if (event.key === 'q') {
        forklift.objects[0].rotation.y += 0.1;
    }
    if (event.key === 'e') {
        forklift.objects[0].rotation.y -= 0.1;
    }
    if (event.key === 'r') {
        if (forklift.arm.position.y < 1.8) {
            forklift.arm.position.y += 0.1;
        }
    }
    if (event.key === 'f') {
        if (forklift.arm.position.y > 0) {
            forklift.arm.position.y -= 0.1;
        }
    }

    // move bulldozer
    if (event.key === 'i') {
        bulldozer.objects[0].position.z -= 0.1;
    }
    if (event.key === 'k') {
        bulldozer.objects[0].position.z += 0.1;
    }
    if (event.key === 'l') {
        bulldozer.objects[0].position.x += 0.1;
    }
    if (event.key === 'j') {
        bulldozer.objects[0].position.x -= 0.1;
    }
    if (event.key === 'u') {
        bulldozer.objects[0].rotation.y += 0.1;
    }
    if (event.key === 'o') {
        bulldozer.objects[0].rotation.y -= 0.1;
    }
    if (event.key === 'y') {
        if (bulldozer.arm.rotation.z > -Math.PI/2) {
            bulldozer.arm.rotation.z -= 0.1;
        }
    }
    if (event.key === 'h') {
        if (bulldozer.arm.rotation.z < 0) {
            bulldozer.arm.rotation.z += 0.1;
        }
    }
    if (event.key === 't') {
        if (bulldozer.digger.rotation.z > -Math.PI/2) {
            bulldozer.digger.rotation.z -= 0.1;
        }
    }
    if (event.key === 'g') {
        if (bulldozer.digger.rotation.z < 0) {
            bulldozer.digger.rotation.z += 0.1;
        }
    }

});

highlight("River - 0");
highlight("Bush-0");
highlight("Gazebo-0");
highlight("Bee - 0");
highlight("Fly - 0");
highlight("Disco-0");
highlight("Fall Oak Tree-0");
highlight("Cherry Blossom Tree-0");
highlight("Snowy Pine Tree-1");


///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);

// now make it go!
world.go({
    predraw: () => {

        // Calculate the position in front of the reflectiveBox
        // let offset = new T.Vector3(0, 2, 0); // Adjust the offset as needed
        // let reflectiveBoxWorldPosition = new T.Vector3();
        // wagon.reflectiveBox.getWorldPosition(reflectiveBoxWorldPosition);
        // let cameraPosition = reflectiveBoxWorldPosition.clone().add(offset);

        // // Update the wagon camera's position and orientation
        // wagonCamera.position.copy(cameraPosition);
        // wagonCamera.lookAt(reflectiveBoxWorldPosition);
        

    }

});

let objLoader = new OBJLoader();
let apple = await objLoader.loadAsync("../objects/apple.obj");
apple.scale.set(0.05, 0.05, 0.05);

let apple_mat = new T.MeshStandardMaterial({
    color: 0xFF0000,
    metalness: 0.5,
    roughness: 0.65,
});

let stem_mat = new T.MeshStandardMaterial({
    color: 0x8B4513,
});

apple.children[0].material = apple_mat; // apple base is the first child
apple.children[1].material = stem_mat; // stem is the second child

for (let i = 0; i < fall_tree_group.length; i++) {
    let tree = fall_tree_group[i];
    for (let j = 0; j < tree.apples.length; j++) {
        // remove the temporary berries
        let berry = tree.apples[j]
        tree.objects[0].remove(berry);
        world.scene.remove(berry);

        // place the apple
        let apple_clone = apple.clone();
        tree.apples[j] = apple_clone;
        tree.objects[0].add(apple_clone);
        apple_clone.position.set(berry.position.x, berry.position.y, berry.position.z);
        apple_clone.rotation.set(berry.rotation.x, berry.rotation.y, berry.rotation.z);
    }
}