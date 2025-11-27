/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";

// textures
let textureLoader = new T.TextureLoader();

let tudorTexture = textureLoader.load("../images/tudorRefined.jpg");
let tudor_bump = textureLoader.load("../images/tudorRefinedBump.jpg");
let tudor_back = textureLoader.load("../images/tudorBack.png");
let tudor_back_bump = textureLoader.load("../images/tudorBackBump.png");
let tudorWall = textureLoader.load("../images/tudor_wall.jpg");
let roof = textureLoader.load("../images/redShingles.jpg");
let blueRoof = textureLoader.load("../images/blueShingles.jpg");
let treeTexture = textureLoader.load("../images/tree_depth.png");
let trunkTexture = textureLoader.load("../images/carrot_texture.png");
let cubes = textureLoader.load("../images/cubes.png");
let wood = textureLoader.load("../images/wagon_wood.jpg");

wood.colorSpace = T.SRGBColorSpace;

// DISCO INFORMATION
let stringMat = new T.MeshStandardMaterial({color: "#000000"});

// TREE INFORMATION
let pine_trunk = new T.CylinderGeometry(.1, .1, 1, 32);
let pine_leaves = new T.ConeGeometry(.5, 1.5, 32);
let pine_trunk_mat = new T.MeshStandardMaterial({color: "#8B4513", bumpMap: trunkTexture, bumpScale: 1});
let pine_leaves_mat = new T.MeshStandardMaterial({color: "#005000", bumpMap: treeTexture, bumpScale: 1});
let snowy_pine_leaves_mat = new T.MeshStandardMaterial({color: "#F0F0FF", bumpMap: treeTexture, bumpScale: 1});
let cherry_trunk_mat = new T.MeshStandardMaterial({color: "#612712", bumpMap: trunkTexture, bumpScale: 1});
let cherry_leaves_mat = new T.MeshStandardMaterial({color: "#FE1691", bumpMap: treeTexture, bumpScale: 1});

let fallLeafShader = shaderMaterial("../shaders/fall_leaves.vs","../shaders/fall_leaves.fs", {
    uniforms: {
        color: { value: new T.Vector3(255/255,140/255,0/255) },
        time: { value: 0 },
        lightDir: {value: new T.Vector3(0, 10, 6).normalize()},
    }
});

let fallLeafGeom = new T.SphereGeometry(.5, 32, 32);

let berry_geom = new T.SphereGeometry(.1, 32, 32);
let berry_mat = new T.MeshStandardMaterial({color: "#FF0000", roughness: 0.5, metalness: 0.2});

// GAZEBO INFORMATION
let gazebo_base_geom = new T.CylinderGeometry(1, 1, .25, 32);
let gazebo_base_mat = new T.MeshStandardMaterial({color: "#FEFCF2", bumpMap: wood, bumpScale: 2});

let gazebo_pillar_geom = new T.CylinderGeometry(.1, .1, 1.25, 32);
let gazebo_pillar_mat = new T.MeshStandardMaterial({color: "#FEFCF2", bumpMap: wood, bumpScale: 2});
let gazebo_railing_geom = new T.BoxGeometry(.1, .05, 1.25, 32);
let gazebo_fence_geom = new T.BoxGeometry(.1, .35, .05, 32);

// draw triangular roofs between the pillars
let gazebo_roof_geom = new T.BufferGeometry();
const gazebo_roof_vertices = [
    [1.2, 1, 0],
    [0, 1, 1.2],
    [-1.2, 1, 0],
    [0, 1, -1.2],
    [0, 2, 0]
];
const gazebo_roof_positions = new Float32Array([
    // roof 1, 0, 4
    ...gazebo_roof_vertices[1],
    ...gazebo_roof_vertices[0],
    ...gazebo_roof_vertices[4],

    // roof 0, 3, 4
    ...gazebo_roof_vertices[0],
    ...gazebo_roof_vertices[3],
    ...gazebo_roof_vertices[4],

    // roof 3, 2, 4
    ...gazebo_roof_vertices[3],
    ...gazebo_roof_vertices[2],
    ...gazebo_roof_vertices[4],

    // roof 2, 1, 4
    ...gazebo_roof_vertices[2],
    ...gazebo_roof_vertices[1],
    ...gazebo_roof_vertices[4]

]);

gazebo_roof_geom.setAttribute('position', new T.BufferAttribute(gazebo_roof_positions, 3));

const gazebo_roof_uv = new Float32Array([
    // roof 0, 1, 4
    0, 0,
    1, 0,
    1/2, 1,

    // roof 0, 3, 4
    0, 0,
    1, 0,
    1/2, 1,

    // roof 3, 2, 4
    0, 0,
    1, 0,
    1/2, 1,

    // roof 2, 1, 4
    0, 0,
    1, 0,
    1/2, 1

])

gazebo_roof_geom.setAttribute('uv', new T.BufferAttribute(gazebo_roof_uv, 2));

gazebo_roof_geom.computeVertexNormals();

let gazebo_roof_mat = new T.MeshStandardMaterial({map: blueRoof, bumpMap: blueRoof, bumpScale: 5, color: "#6FD9FF", side: T.DoubleSide});

// HOUSE INFORMATION

// gable sides of the house
let tudor_front_mat = new T.MeshStandardMaterial({ map: tudorTexture, bumpMap: tudor_bump, bumpScale: 5 });
let tudor_back_mat = new T.MeshStandardMaterial({ map: tudor_back, bumpMap: tudor_back_bump, bumpScale: 5 });
let tudor_gable_buf = new T.BufferGeometry();

const tudor_gable_vertices = [
    [-1, 0, .25],
    [1, 0, .25],
    [-1, 2, .25],
    [1, 2, .25],
    [-1, 0, 0],
    [1, 0, 0],
    [-1, 2, 0],
    [1, 2, 0],
    [0, 3, .25],
    [0, 3, 0]
];

const tudor_gable_positions = new Float32Array([
    // front 0, 1, 2
    ...tudor_gable_vertices[0],
    ...tudor_gable_vertices[1],
    ...tudor_gable_vertices[2],

    // front 1, 3, 2
    ...tudor_gable_vertices[1],
    ...tudor_gable_vertices[3],
    ...tudor_gable_vertices[2],

    // right 1, 5, 3
    ...tudor_gable_vertices[1],
    ...tudor_gable_vertices[5],
    ...tudor_gable_vertices[3],

    // right 5, 7, 3
    ...tudor_gable_vertices[5],
    ...tudor_gable_vertices[7],
    ...tudor_gable_vertices[3],

    // back 5, 4, 7
    ...tudor_gable_vertices[5],
    ...tudor_gable_vertices[4],
    ...tudor_gable_vertices[7],

    // back 4, 6, 7
    ...tudor_gable_vertices[4],
    ...tudor_gable_vertices[6],
    ...tudor_gable_vertices[7],

    // left 4, 0, 6
    ...tudor_gable_vertices[4],
    ...tudor_gable_vertices[0],
    ...tudor_gable_vertices[6],

    // left 0, 2, 6
    ...tudor_gable_vertices[0],
    ...tudor_gable_vertices[2],
    ...tudor_gable_vertices[6],

    // bottom 0, 4, 1
    ...tudor_gable_vertices[0],
    ...tudor_gable_vertices[4],
    ...tudor_gable_vertices[1],

    // bottom 4, 5, 1
    ...tudor_gable_vertices[4],
    ...tudor_gable_vertices[5],
    ...tudor_gable_vertices[1],

    // tip front 2, 3, 8
    ...tudor_gable_vertices[2],
    ...tudor_gable_vertices[3],
    ...tudor_gable_vertices[8],

    // tip back 7, 6, 9
    ...tudor_gable_vertices[7],
    ...tudor_gable_vertices[6],
    ...tudor_gable_vertices[9],

    // tip right 3, 7, 8
    ...tudor_gable_vertices[3],
    ...tudor_gable_vertices[7],
    ...tudor_gable_vertices[8],

    // tip right 7, 9, 8
    ...tudor_gable_vertices[7],
    ...tudor_gable_vertices[9],
    ...tudor_gable_vertices[8],

    // tip left 6, 2, 9
    ...tudor_gable_vertices[6],
    ...tudor_gable_vertices[2],
    ...tudor_gable_vertices[9],

    // tip left 2, 8, 9
    ...tudor_gable_vertices[2],
    ...tudor_gable_vertices[8],
    ...tudor_gable_vertices[9]

]);

const tudor_gable_uv = new Float32Array([
    // front 0, 1, 2
    130/649, 0/649,
    575/649, 0/649,
    130/649, 400/649,

    // front 1, 3, 2
    575/649, 0/649,
    575/649, 400/649,
    130/649, 400/649,

    // right 1, 5, 3
    130/649, 200/649,
    280/649, 200/649,
    130/649, 300/649,

    // right 5, 7, 3
    280/649, 200/649,
    280/649, 300/649,
    130/649, 300/649,

    // back 5, 4, 7
    130/649, 0/649,
    575/649, 0/649,
    130/649, 400/649,

    // back 4, 6, 7
    575/649, 0/649,
    575/649, 400/649,
    130/649, 400/649,

    // left 4, 0, 6
    130/649, 200/649,
    280/649, 200/649,
    130/649, 300/649,

    // left 0, 2, 6
    280/649, 200/649,
    280/649, 300/649,
    130/649, 300/649,

    // bottom 0, 4, 1
    130/649, 200/649,
    280/649, 200/649,
    130/649, 300/649,

    // bottom 4, 5, 1
    280/649, 200/649,
    280/649, 300/649,
    130/649, 300/649,

    // tip front 2, 3, 8
    130/649, 400/649,
    575/649, 400/649,
    350/649, 649/649,

    // tip back 7, 6, 9
    130/649, 400/649,
    575/649, 400/649,
    350/649, 649/649,

    // UNSEEN WALL EDGES
    // tip right 3, 7, 8
    130/649, 400/649,
    575/649, 400/649,
    350/649, 649/649,

    // tip right 7, 9, 8
    130/649, 400/649,
    575/649, 400/649,
    350/649, 649/649,

    // tip left 6, 2, 9
    130/649, 400/649,
    575/649, 400/649,
    350/649, 649/649,

    // tip left 2, 8, 9
    130/649, 400/649,
    575/649, 400/649,
    350/649, 649/649,

]);

tudor_gable_buf.setAttribute('position', new T.BufferAttribute(tudor_gable_positions, 3));
tudor_gable_buf.setAttribute('uv', new T.BufferAttribute(tudor_gable_uv, 2));
tudor_gable_buf.computeVertexNormals();

// rectangular sides of the house
let tudor_side_mat = new T.MeshStandardMaterial({color: "#FEFCF2", map: tudorWall, bumpMap: tudorWall, bumpScale: 5, side: T.DoubleSide});

let tudor_side_buf = new T.BufferGeometry();

const tudor_side_vertices = [
    [0, 0, .25],
    [2, 0, .25],
    [0, 2, .25],
    [2, 2, .25],
];

const tudor_side_positions = new Float32Array([
    // front 0, 1, 2
    ...tudor_side_vertices[0],
    ...tudor_side_vertices[1],
    ...tudor_side_vertices[2],

    // front 1, 3, 2
    ...tudor_side_vertices[1],
    ...tudor_side_vertices[3],
    ...tudor_side_vertices[2]
]);

const tudor_side_uv = new Float32Array([
    // front 0, 1, 2
    0/649, 0/649,
    649/649, 0/649,
    0/649, 649/649,

    // front 1, 3, 2
    649/649, 0/649,
    649/649, 649/649,
    0/649, 649/649,

]);

tudor_side_buf.setAttribute('position', new T.BufferAttribute(tudor_side_positions, 3));
tudor_side_buf.setAttribute('uv', new T.BufferAttribute(tudor_side_uv, 2));
tudor_side_buf.computeVertexNormals();

// roof of the house
let tudor_roof_mat = new T.MeshStandardMaterial({ map: roof, bumpMap: roof, bumpScale: 5, color: "#FF6E6F", side: T.DoubleSide });

let tudor_roof_buf = new T.BufferGeometry();

const tudor_roof_vertices = [
    [0, 2, .25],
    [2, 2, .25],
    [2, 3, -.76],
    [0, 3, -.76],
];

const tudor_roof_positions = new Float32Array([
    // roof 0, 1, 2
    ...tudor_roof_vertices[0],
    ...tudor_roof_vertices[1],
    ...tudor_roof_vertices[2],

    // roof 2, 3, 0
    ...tudor_roof_vertices[2],
    ...tudor_roof_vertices[3],
    ...tudor_roof_vertices[0],

]);

const tudor_roof_uv = new Float32Array([
    // roof 0, 1, 2
    0/649, 0/649,
    575/649, 0/649,
    575/649, 400/649,

    // roof 2, 3, 0
    575/649, 400/649,
    0/649, 400/649,
    0/649, 0/649,

]);

tudor_roof_buf.setAttribute('position', new T.BufferAttribute(tudor_roof_positions, 3));
tudor_roof_buf.setAttribute('uv', new T.BufferAttribute(tudor_roof_uv, 2));
tudor_roof_buf.computeVertexNormals();

export class BirdView extends GrObject {
    constructor(pathRadius = 10) {
        
        let bird = new T.Group();

        let body = new T.Group();
        bird.add(body);
 
        let head = new T.SphereGeometry(.25, 32, 32);
        //let headMesh = new T.Mesh(head, material);
        let headMesh = new T.Group();
        headMesh.position.set(0.3, -.75, -0.75);
        body.add(headMesh);

        let camera = new T.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 10, 0);

        super("Bird's Eye View", bird);

        this.bird = body;
        this.head = headMesh;
        this.camera = camera;
        this.pathRadius = pathRadius;
    }

    stepWorld(delta, timeOfDay) {
        // move the camera around the scene
        let time = performance.now() / 1000;
        this.bird.position.set(this.pathRadius * Math.sin(time/3), 20+Math.sin(time/2), this.pathRadius * Math.cos(time/3));
        this.bird.rotation.set(0, time/3, 0);

        let birdCoord = new T.Vector3();
        this.bird.getWorldPosition(birdCoord);
        let headCoord = new T.Vector3();
        this.bird.children[0].getWorldPosition(headCoord);


        this.camera.position.copy(birdCoord);
        this.camera.lookAt(headCoord);
    }
}

let discoCtr = 0;
export class Disco extends GrObject {

    constructor(string_length=4, world) {

        let renderTarget = new T.WebGLCubeRenderTarget(128);
        let camera = new T.CubeCamera(0.1, 1000, renderTarget);

        // sphere with a disco ball texture
        let sphere = new T.SphereGeometry(1, 32, 32);
        let disco_mat = new T.MeshStandardMaterial({ normalMap: cubes, roughness: 0.2, metalness: 0.8, envMap: renderTarget.texture });
        let mesh = new T.Mesh(sphere, disco_mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // string to hang the disco ball
        let string = new T.CylinderGeometry(.05, .05, string_length, 32);
        let stringMesh = new T.Mesh(string, stringMat);
        stringMesh.position.set(0, string_length/2 + .9, 0);
        stringMesh.castShadow = true;
        stringMesh.receiveShadow = true;
        mesh.add(stringMesh); // add the string to the disco ball while keeping the reflection on the ball

        // using a group like this does not work due to the GrObject framework
        // the groundplane will not be reflected in the camera if you use this and add it to the super() call
        // let group = new T.Group();
        // group.add(mesh);
        // group.add(stringMesh);

        super(`Disco-${discoCtr++}`, mesh);

        camera.position.copy(mesh.position);

        this.camera = camera;
        this.world = world;
        this.disco = mesh;
    }

    stepWorld(delta, timeOfDay) {
        // make the disco ball reflect the scene
        this.disco.visible = false;

        this.camera.position.copy(this.disco.position);

        try {
            this.camera.update(this.world.renderer, this.world.scene);
        } catch (err) {
            console.error("Error updating CubeCamera:", err);
        }

        this.disco.visible = true;
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
    
        const fx = x + d * 3 - 3;
        const fy = y + d * 3 - 4;
        const fz = z + d * 3 + 1;
    
        return [fx, fy, fz, x, y, z];
      }
}

let pineTreeCtr = 0;
export class PineTree extends GrObject {

    constructor() {

        let tree = new T.Group();

        let trunk = new T.Mesh(pine_trunk, pine_trunk_mat);
        trunk.position.set(0, .5, 0);
        trunk.receiveShadow = true;
        trunk.castShadow = true;

        let top = new T.Mesh(pine_leaves, pine_leaves_mat);
        top.position.set(0, 1.5, 0);
        top.receiveShadow = true;
        top.castShadow = true;

        tree.add(trunk);
        tree.add(top);

        super(`Pine Tree-${pineTreeCtr++}`, tree);

    }

}

let snowyPineTreeCtr = 0;
export class SnowyPineTree extends GrObject {

    constructor() {

        let tree = new T.Group();

        let trunk = new T.Mesh(pine_trunk, pine_trunk_mat);
        trunk.position.set(0, .5, 0);
        trunk.receiveShadow = true;
        trunk.castShadow = true;

        let top = new T.Mesh(pine_leaves, pine_leaves_mat);
        top.position.set(0, 1.5, 0);
        top.receiveShadow = true;
        top.castShadow = true;

        let snow = new T.Mesh(pine_leaves, snowy_pine_leaves_mat);
        snow.scale.set(.75, .75, .75);
        snow.position.set(0, 1.75, 0);
        snow.receiveShadow = true;
        snow.castShadow = true;

        tree.add(trunk);
        tree.add(top);
        tree.add(snow);

        super(`Snowy Pine Tree-${snowyPineTreeCtr++}`, tree);

    }

}

let fallOakCtr = 0;
export class FallOakTree extends GrObject {

    constructor(apple) {

        let tree = new T.Group();

        let trunk = new T.Mesh(pine_trunk, pine_trunk_mat);
        trunk.position.set(0, .5, 0);
        trunk.receiveShadow = true;
        trunk.castShadow = true;

        //let leafMat = new T.MeshStandardMaterial({color: "#FF8C00"});
        let leaf1 = new T.Mesh(fallLeafGeom, fallLeafShader);
        leaf1.position.set(0, 1.5, 0);
        leaf1.receiveShadow = true;
        leaf1.castShadow = true;
        let leaf2 = new T.Mesh(fallLeafGeom, fallLeafShader);
        leaf2.position.set(.25, 1, 0);
        leaf2.scale.set(1.25, 1, 1.25);
        leaf2.receiveShadow = true;
        leaf2.castShadow = true;
        let leaf3 = new T.Mesh(fallLeafGeom, fallLeafShader);
        leaf3.position.set(-.25, 1, 0);
        leaf3.scale.set(1.25, 1, 1.25);
        leaf3.receiveShadow = true;
        leaf3.castShadow = true;

        tree.add(trunk);
        tree.add(leaf1);
        tree.add(leaf2);
        tree.add(leaf3);

        // place apples on tree
        let apple1,apple2,apple3,apple4;

        if (apple) {
            apple1 = apple.clone();
            apple1.position.set(0, 1.45, .5);
            apple1.receiveShadow = true;
            apple1.castShadow = true;
            apple1.rotation.set(0, -Math.PI/2, 0);
            
            apple2 = apple.clone();
            apple2.position.set(0, 1.45, -.5);
            apple2.receiveShadow = true;
            apple2.castShadow = true;
            apple2.rotation.set(0, Math.PI/2, 0);
            
            apple3 = apple.clone();
            apple3.position.set(.87, 1, 0);
            apple3.rotation.set(0, 0, 0);
            apple3.receiveShadow = true;
            apple3.castShadow = true;
            
            apple4 = apple.clone();
            apple4.position.set(-.87, 1, 0);
            apple4.rotation.set(0, Math.PI, 0);
            apple4.receiveShadow = true;
            apple4.castShadow = true;

            tree.add(apple1);
            tree.add(apple2);
            tree.add(apple3);
            tree.add(apple4);
        }
        // add apple placeholders
        else {
            
            apple1 = new T.Mesh(berry_geom, berry_mat);
            apple1.position.set(0, 1.45, .5);
            apple1.receiveShadow = true;
            apple1.castShadow = true;
            apple1.rotation.set(0, -Math.PI/2, 0);
            
            apple2 = apple1.clone();
            apple2.position.set(0, 1.45, -.5);
            apple2.receiveShadow = true;
            apple2.castShadow = true;
            apple2.rotation.set(0, Math.PI/2, 0);
            
            apple3 = apple1.clone();
            apple3.position.set(.87, 1, 0);
            apple3.rotation.set(0, 0, 0); // prevents issues when copying rotations later
            apple3.receiveShadow = true;
            apple3.castShadow = true;
            
            apple4 = apple1.clone();
            apple4.position.set(-.87, 1, 0);
            apple4.rotation.set(0, Math.PI, 0);
            apple4.receiveShadow = true;
            apple4.castShadow = true;

            tree.add(apple1);
            tree.add(apple2);
            tree.add(apple3);
            tree.add(apple4);
        }

        super(`Fall Oak Tree-${fallOakCtr++}`, tree);

        this.time = 0;
        this.apples = [apple1,apple2,apple3,apple4];

    }

    stepWorld(delta, timeOfDay) {
        this.time += delta / 1000;
        this.objects[0].children[1].material.uniforms.time.value = this.time;
    }
}

let cherryBlossomCtr = 0;
export class CherryBlossomTree extends GrObject {

    constructor() {

        let tree = new T.Group();
        let scale_group = new T.Group();

        let trunk = new T.Mesh(pine_trunk, cherry_trunk_mat);
        trunk.position.set(0, 1, 0);
        trunk.scale.set(1, 2, 1);
        trunk.receiveShadow = true;
        trunk.castShadow = true;

        let leafBase = new T.Mesh(fallLeafGeom, cherry_leaves_mat);
        leafBase.position.set(0, 2.5, 0);
        leafBase.scale.set(2.25, 2, 4);
        leafBase.receiveShadow = true;
        leafBase.castShadow = true;
        let leafCrown = new T.Mesh(fallLeafGeom, cherry_leaves_mat);
        leafCrown.position.set(0, 3, 0);
        leafCrown.scale.set(2, 1.75, 3);
        leafCrown.receiveShadow = true;
        leafCrown.castShadow = true;

        let branch = new T.Mesh(pine_trunk, cherry_trunk_mat);
        branch.position.set(0, 1.4, -0.5);
        branch.scale.set(0.95,2,0.95);
        branch.rotateX(-Math.PI/6);
        branch.receiveShadow = true;
        branch.castShadow = true;
        let branch2 = new T.Mesh(pine_trunk, cherry_trunk_mat);
        branch2.position.set(0, 1.87, .75);
        branch2.scale.set(0.9,2,0.9);
        branch2.rotateX(Math.PI/4);
        branch2.receiveShadow = true;
        branch2.castShadow = true;

        scale_group.add(trunk);
        scale_group.add(leafCrown);
        scale_group.add(leafBase);
        scale_group.add(branch);
        scale_group.add(branch2);

        scale_group.scale.set(0.5, 0.5, 0.5);

        tree.add(scale_group);

        super(`Cherry Blossom Tree-${cherryBlossomCtr++}`, tree);

    }

}

let bushCtr = 0;
export class Bush extends GrObject {
    constructor() {
        let bush = new T.Group();

        let leaf1 = new T.Mesh(fallLeafGeom, pine_leaves_mat);
        leaf1.position.set(0, 0.5, 0);
        leaf1.receiveShadow = true;
        leaf1.castShadow = true;
        let leaf2 = new T.Mesh(fallLeafGeom, pine_leaves_mat);
        leaf2.position.set(.25, 0, 0);
        leaf2.scale.set(1.25, 1, 1.25);
        leaf2.receiveShadow = true;
        leaf2.castShadow = true;
        let leaf3 = new T.Mesh(fallLeafGeom, pine_leaves_mat);
        leaf3.position.set(-.25, 0, 0);
        leaf3.scale.set(1.25, 1, 1.25);
        leaf3.receiveShadow = true;
        leaf3.castShadow = true;

        // add berries
        let berry1 = new T.Mesh(berry_geom, berry_mat);
        berry1.position.set(0, 0.5, .5);
        berry1.receiveShadow = true;
        berry1.castShadow = true;
        let berry2 = new T.Mesh(berry_geom, berry_mat);
        berry2.position.set(0, 0.5, -.5);
        berry2.receiveShadow = true;
        berry2.castShadow = true;
        let berry3 = new T.Mesh(berry_geom, berry_mat);
        berry3.position.set(.5, 0.5, 0);
        berry3.receiveShadow = true;
        berry3.castShadow = true;
        let berry4 = new T.Mesh(berry_geom, berry_mat);
        berry4.position.set(-.5, 0.5, 0);
        berry4.receiveShadow = true;
        berry4.castShadow = true;
        let berry5 = new T.Mesh(berry_geom, berry_mat);
        berry5.position.set(.5, 0.2, .5);
        berry5.receiveShadow = true;
        berry5.castShadow = true;
        let berry6 = new T.Mesh(berry_geom, berry_mat);
        berry6.position.set(-.5, 0.2, .5);
        berry6.receiveShadow = true;
        berry6.castShadow = true;
        let berry7 = new T.Mesh(berry_geom, berry_mat);
        berry7.position.set(.5, 0.2, -.5);
        berry7.receiveShadow = true;
        berry7.castShadow = true;
        let berry8 = new T.Mesh(berry_geom, berry_mat);
        berry8.position.set(-.5, 0.2, -.5);
        berry8.receiveShadow = true;
        berry8.castShadow = true;

        bush.add(leaf1);
        bush.add(leaf2);
        bush.add(leaf3);
        bush.add(berry1);
        bush.add(berry2);
        bush.add(berry3);
        bush.add(berry4);
        bush.add(berry5);
        bush.add(berry6);
        bush.add(berry7);
        bush.add(berry8);

        bush.rotateY(Math.PI/2);

        super(`Bush-${bushCtr++}`, bush);
    }
}

let gazeboCtr = 0;
export class Gazebo extends GrObject {
    constructor() {

        // cylindrical base
        let base = new T.Mesh(gazebo_base_geom, gazebo_base_mat);
        base.castShadow = true;
        base.receiveShadow = true;

        // add pillars evenly spaced around the base
        let pillar1 = new T.Mesh(gazebo_pillar_geom, gazebo_pillar_mat);
        pillar1.position.set(1-.1, 0.75, 0);
        pillar1.castShadow = true;
        pillar1.receiveShadow = true;

        let pillar2 = new T.Mesh(gazebo_pillar_geom, gazebo_pillar_mat);
        pillar2.position.set(-1+.1, 0.75, 0);
        pillar2.castShadow = true;
        pillar2.receiveShadow = true;

        let pillar3 = new T.Mesh(gazebo_pillar_geom, gazebo_pillar_mat);
        pillar3.position.set(0, 0.75, 1-.1);
        pillar3.castShadow = true;
        pillar3.receiveShadow = true;

        let pillar4 = new T.Mesh(gazebo_pillar_geom, gazebo_pillar_mat);
        pillar4.position.set(0, 0.75, -1+.1);
        pillar4.castShadow = true;
        pillar4.receiveShadow = true;

        // add railings between the pillars
        let railing1 = new T.Mesh(gazebo_railing_geom, gazebo_pillar_mat);
        railing1.rotation.set(0, Math.PI/4, 0);
        railing1.position.set(1-.5, 0.6, -.4);
        pillar1.add(railing1);

        let railing1_below = new T.Mesh(gazebo_railing_geom, gazebo_pillar_mat);
        railing1.add(railing1_below);
        railing1_below.position.set(0, -.4, 0);

        let railing2 = new T.Mesh(gazebo_railing_geom, gazebo_pillar_mat);
        railing2.rotation.set(0, -Math.PI/4, 0);
        railing2.position.set(-1+.5, 0.6, -.4);
        pillar2.add(railing2);

        let railing2_below = new T.Mesh(gazebo_railing_geom, gazebo_pillar_mat);
        railing2.add(railing2_below);
        railing2_below.position.set(0, -.4, 0);

        let railing3 = new T.Mesh(gazebo_railing_geom, gazebo_pillar_mat);
        railing3.rotation.set(0, Math.PI/4, 0);
        railing3.position.set(-0.5, 0.6, 1-.6);
        pillar3.add(railing3);

        let railing3_below = new T.Mesh(gazebo_railing_geom, gazebo_pillar_mat);
        railing3.add(railing3_below);
        railing3_below.position.set(0, -.4, 0);

        // add fences to the railings
        let fence1_1 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence1_1.position.set(0, -.2, -.075);
        railing1.add(fence1_1);
        let fence1_2 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence1_2.position.set(0, -.2, -.075+.4);
        railing1.add(fence1_2);
        let fence1_3 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence1_3.position.set(0, -.2, -.075-.4);
        railing1.add(fence1_3);
        let fence1_4 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence1_4.position.set(0, -.2, -.075+.2);
        railing1.add(fence1_4);
        let fence1_5 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence1_5.position.set(0, -.2, -.075-.2);
        railing1.add(fence1_5);

        let fence2_1 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence2_1.position.set(0, -.2, -.075);
        railing2.add(fence2_1);
        let fence2_2 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence2_2.position.set(0, -.2, -.075+.4);
        railing2.add(fence2_2);
        let fence2_3 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence2_3.position.set(0, -.2, -.075-.4);
        railing2.add(fence2_3);
        let fence2_4 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence2_4.position.set(0, -.2, -.075+.2);
        railing2.add(fence2_4);
        let fence2_5 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence2_5.position.set(0, -.2, -.075-.2);
        railing2.add(fence2_5);

        let fence3_1 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence3_1.position.set(0, -.2, 0.075);
        railing3.add(fence3_1);
        let fence3_2 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence3_2.position.set(0, -.2, 0.075+.4);
        railing3.add(fence3_2);
        let fence3_3 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence3_3.position.set(0, -.2, 0.075-.4);
        railing3.add(fence3_3);
        let fence3_4 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence3_4.position.set(0, -.2, 0.075+.2);
        railing3.add(fence3_4);
        let fence3_5 = new T.Mesh(gazebo_fence_geom, gazebo_pillar_mat);
        fence3_5.position.set(0, -.2, 0.075-.2);
        railing3.add(fence3_5);

        // cast and receive shadows for the fences
        railing1.children.forEach(function(fence) {
            fence.castShadow = true;
            fence.receiveShadow = true;
        });

        railing1.castShadow = true;
        railing1.receiveShadow = true;

        railing2.children.forEach(function(fence) {
            fence.castShadow = true;
            fence.receiveShadow = true;
        });

        railing2.castShadow = true;
        railing2.receiveShadow = true;

        railing3.children.forEach(function(fence) {
            fence.castShadow = true;
            fence.receiveShadow = true;
        });

        railing3.castShadow = true;
        railing3.receiveShadow = true;
        
        // add roof
        let roof = new T.Mesh(gazebo_roof_geom, gazebo_roof_mat);
        roof.position.set(0, .25, 0);
        roof.castShadow = true;
        roof.receiveShadow = true;

        let group = new T.Group();
        group.add(base);
        group.add(pillar1);
        group.add(pillar2);
        group.add(pillar3);
        group.add(pillar4);
        group.add(railing1);
        group.add(railing2);
        group.add(railing3);
        group.add(roof);

        super(`Gazebo-${gazeboCtr++}`, group);
    }
}

let tudorCtr = 0;
export class TudorGable extends GrObject {
    constructor() {

        let length = 2;
        let depth = .25;

        let front = tudorFront();

        let side1 = tudorSide();
        side1.rotateY(Math.PI / 2);
        side1.position.set(length/2-depth+.01, 0, depth);

        let side2 = tudorSide();
        side2.rotateY(-Math.PI / 2);
        side2.position.set(-length/2+depth-0.01, 0, -length+depth);

        let back = tudorBack();
        back.position.set(0, 0, -length+depth);

        let group = new T.Group();
        group.add(front);
        group.add(side1);
        group.add(side2);
        group.add(back);

        super(`Tudor Gable-${tudorCtr++}`, group);
    }
}

function tudorFront() {

        let house = new T.Mesh(tudor_gable_buf, tudor_front_mat);
        house.receiveShadow = true;
        house.castShadow = true;

        return house;

}

function tudorBack() {

    let house = new T.Mesh(tudor_gable_buf, tudor_back_mat);
    house.receiveShadow = true;
    house.castShadow = true;

    return house;

}

function tudorSide() {

    let house = new T.Mesh(tudor_side_buf, tudor_side_mat);
    house.receiveShadow = true;
    house.castShadow = true;

    let roofMesh = new T.Mesh(tudor_roof_buf, tudor_roof_mat);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;

    let group = new T.Group();
    group.add(house);
    group.add(roofMesh);

    return group;
}

// SOURCE: Peyton Howardsmith (2025)
// load in roof
let homeTexture = textureLoader.load("../images/house2.png");
let insideHomeTexture = textureLoader.load("../images/house1.png");
let woodGrain = textureLoader.load("../images/woodGrain2.jpg");
let outsideAlphaMap = textureLoader.load("../images/outsideAlphaMap.png");
let insideAlphaMap = textureLoader.load("../images/outsideAlphaMap.png");

let cottageCtr = 0;
class Building1 extends GrObject {
    constructor() {
        let geometry = new T.BufferGeometry();

        // create points
        let A = [-2, 1, 2];
        let B = [1, 2, 2];
        let C = [2, 1, 2];
        let D = [-2, -1, 2];
        let E = [2, -1, 2];
        let F = [-2, 1, -2];
        let G = [-2, -1, -2];
        let H = [2, 1, -2];
        let I = [2, -1, -2];
        let J = [1, 2, -2];

        // create vertices
        const vertices = new Float32Array( [
            // front
            ...A,
            ...B,
            ...C,
            ...D,
            ...E,

            // left side
            ...A,
            ...D,
            ...F,
            ...G,

            // right side
            ...C,
            ...E,
            ...H,
            ...I,

            // back
            ...H,
            ...I,
            ...F,
            ...G,
            ...J,

            // roof left
            ...F,
            ...A,
            ...J,
            ...B,

            // roof right
            ...J,
            ...B,
            ...H,
            ...C            
        ]);

        geometry.setAttribute('position', new T.BufferAttribute(vertices, 3));

        // create faces
        geometry.setIndex([
            1, 0, 2,  2, 0, 3,  4, 2, 3,
            6, 5, 7,  7, 8, 6,
            11, 10, 12,  9, 10, 11,
            13, 15, 17,  14, 15, 13,  16, 15, 14,
            21, 20, 18,  21, 18, 19,
            23, 24, 22,  23, 25, 24
        ]);

        // compute normals
        geometry.computeVertexNormals();

        // set uvs
        const uv = new Float32Array([
            // front
            1/4, 1/2,  2/3, 2/3,  3/4, 1/2,  1/4, 0,  3/4, 0,
            // left side
            1/4, 1/2,  1/4, 0,  0, 1/2,  0, 0,
            // right side
            3/4, 1/2,  3/4, 0,  1, 1/2,  1, 0,
            // back
            3/4, 1/2,  3/4, 0,  1/4, 1/2,  1/4, 0,  2/3, 2/3,
            // roof left
            0, 1,  0, 2/3,  2/3, 1,  2/3, 3/4,
            // roof right
            2/3, 1,  2/3, 3/4,  1, 1,  1, 2/3
        ]);

        geometry.setAttribute('uv', new T.BufferAttribute(uv, 2));

        // create material
        let material = new T.MeshStandardMaterial({
            map: homeTexture,
            alphaMap: outsideAlphaMap,
            transparent: true
        });

        // create mesh
        let mesh = new T.Mesh(geometry, material);
        mesh.renderOrder = 2;

        // name and mesh
        super(`Building1 - ${cottageCtr++}`, mesh);
    }
}


class Building1Inside extends GrObject {
    constructor() {
        let geometry = new T.BufferGeometry();

        // create points
        let A = [-2, 1, 2];
        let B = [1, 2, 2];
        let C = [2, 1, 2];
        let D = [-2, -1, 2];
        let E = [2, -1, 2];
        let F = [-2, 1, -2];
        let G = [-2, -1, -2];
        let H = [2, 1, -2];
        let I = [2, -1, -2];
        let J = [1, 2, -2];

        // create vertices
        const vertices = new Float32Array( [
            // front
            ...A,
            ...B,
            ...C,
            ...D,
            ...E,

            // left side
            ...A,
            ...D,
            ...F,
            ...G,

            // right side
            ...C,
            ...E,
            ...H,
            ...I,

            // back
            ...H,
            ...I,
            ...F,
            ...G,
            ...J,

            // roof left
            ...F,
            ...A,
            ...J,
            ...B,

            // roof right
            ...J,
            ...B,
            ...H,
            ...C            
        ]);

        geometry.setAttribute('position', new T.BufferAttribute(vertices, 3));

        // create faces
        geometry.setIndex([
            1, 0, 2,  2, 0, 3,  4, 2, 3,
            6, 5, 7,  7, 8, 6,
            11, 10, 12,  9, 10, 11,
            13, 15, 17,  14, 15, 13,  16, 15, 14,
            21, 20, 18,  21, 18, 19,
            23, 24, 22,  23, 25, 24
        ]);

        // compute normals
        geometry.computeVertexNormals();

        // set uvs
        const uv = new Float32Array([
            // front
            1/4, 1/2,  2/3, 2/3,  3/4, 1/2,  1/4, 0,  3/4, 0,
            // left side
            1/4, 1/2,  1/4, 0,  0, 1/2,  0, 0,
            // right side
            3/4, 1/2,  3/4, 0,  1, 1/2,  1, 0,
            // back
            3/4, 1/2,  3/4, 0,  1/4, 1/2,  1/4, 0,  2/3, 2/3,
            // roof left
            0, 1,  0, 2/3,  2/3, 1,  2/3, 3/4,
            // roof right
            2/3, 1,  2/3, 3/4,  1, 1,  1, 2/3
        ]);

        geometry.setAttribute('uv', new T.BufferAttribute(uv, 2));

        // create material
        let material = new T.MeshStandardMaterial({
            map: insideHomeTexture,
            side: T.BackSide,
            alphaMap: insideAlphaMap,
            transparent: true
        });

        // create mesh
        let mesh = new T.Mesh(geometry, material);
        mesh.renderOrder = 1;

        // create floor
        let floorGeo = new T.PlaneGeometry(4, 4);
        let floorMat = new T.MeshStandardMaterial({map: woodGrain, side: T.BackSide});
        let floor = new T.Mesh(floorGeo, floorMat);
        floor.rotateX(Math.PI / 2);
        floor.position.set(0, -0.99, 0);
        mesh.add(floor);

        floor.receiveShadow = true;

        // name and mesh
        super("Building1", mesh);
    }
}

export { Building1, Building1Inside };