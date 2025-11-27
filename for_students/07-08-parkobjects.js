/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";

let wood = new T.TextureLoader().load("../images/wagon_wood.jpg", function (texture) {
  texture.colorSpace = T.SRGBColorSpace;
});

let tire_texture = new T.TextureLoader().load("../images/tire.png", function (texture) {
  texture.wrapS = T.RepeatWrapping;
  texture.wrapT = T.RepeatWrapping;
  texture.repeat.set(2, 2);
});

let flyingSwingObCtr = 0;
// A simple merry-go-round.
/**
 * @typedef FlyingSwingProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrFlyingSwing extends GrObject {
  /**
   * @param {FlyingSwingProperties} params
   */
  constructor(params = {}) {
    let flyingSwing = new T.Group();

    let base_geom = new T.CylinderGeometry(3, 4, 5, 16);
    let base_mat = new T.MeshStandardMaterial({
      color: "pink",
      metalness: 0.7,
      roughness: 0.3
    });

    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(2.5);
    flyingSwing.add(base);

    let spin_geom = new T.CylinderGeometry(2.5, 2.5, 10, 32, 32);
    let spin_mat = new T.MeshStandardMaterial({
      color: "#FFD760",
      metalness: 0.3,
      roughness: 0.6
    });

    let spin_group = new T.Group();
    base.add(spin_group);
    spin_group.translateY(5);
    let spin = new T.Mesh(spin_geom, spin_mat);
    spin_group.add(spin);

    // add the tops
    
    let top_geom = new T.CylinderGeometry(7, 2.5, 2, 8, 4);
    let top_mat = new T.MeshStandardMaterial({
      color: "#FFD760",
      metalness: 0.3,
      roughness: 0.6
    });
    
    let top = new T.Mesh(top_geom, top_mat);
    top.translateY(0);

    let top2_geom = new T.CylinderGeometry(7, 7, 2, 8, 4);
    let top2 = new T.Mesh(top2_geom, top_mat);
    top2.translateY(1.5);

    let top3_geom = new T.CylinderGeometry(2.5, 7, 2, 8, 4);
    let top3 = new T.Mesh(top3_geom, top_mat);
    top3.translateY(3.5);

    let top_sphere_geom = new T.SphereGeometry(2.5, 8, 4);
    let top_sphere = new T.Mesh(top_sphere_geom, top_mat);

    let swivel_group = new T.Group;
    swivel_group.position.set(0, 6, 0);
    spin_group.add(swivel_group);
    swivel_group.add(top_sphere);
    swivel_group.add(top);
    swivel_group.add(top2);
    swivel_group.add(top3);

    // add swings
    let swing_geom = new T.CylinderGeometry(0.1, 0.1, 5, 16);
    let swing_mat = new T.MeshStandardMaterial({
      color: "#777777",
      metalness: 0.8,
      roughness: 0.2
    });

    let seat_geom = new T.TorusGeometry(0.6, 0.3, 16, 100);
    let seat_upper_geom = new T.TorusGeometry(0.6, 0.3, 16, 100, Math.PI);
    let seat_mat = new T.MeshStandardMaterial({
      color: "#7777FF",
      metalness: 0,
      roughness: 0.4,
      side: T.DoubleSide
    });

    for (let i = 0; i < 8; i++) {
      let swingStr1 = new T.Mesh(swing_geom, swing_mat);
      let swingStr2 = new T.Mesh(swing_geom, swing_mat);
      let seatBottom = new T.Mesh(seat_geom, seat_mat);
      let seatTop = new T.Mesh(seat_upper_geom, seat_mat);

      let swing_group = new T.Group();
      swing_group.add(swingStr1);
      swingStr1.add(swingStr2);
      swingStr1.add(seatBottom);
      swingStr1.add(seatTop);

      swingStr1.position.set(5,-6,0);
      swingStr2.position.set(-1,0,0);
      seatBottom.position.set(-.5,-2.5,0);
      seatBottom.rotation.set(Math.PI/2, 0, 0);
      seatTop.position.set(-.5,-2,0);
      seatTop.rotation.set(Math.PI/2, 0, 0);

      swing_group.rotateY((i * Math.PI) / 4);
      swing_group.rotateZ(Math.PI / 4);
      swivel_group.add(swing_group);
    }

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`FlyingSwing-${flyingSwingObCtr++}`, flyingSwing);
    this.whole_ob = flyingSwing;
    this.spin = spin_group;
    this.rotate = swivel_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    flyingSwing.scale.set(scale, scale, scale);

    this.time = 0; // initialize time for rocking
  }
  /**
   * StepWorld method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {

    this.time += delta / 1000; // Increment time

    // Calculate the rocking angle using a sine wave function
    let rockingAngle = Math.sin(this.time) * Math.PI / 8; // Adjust the amplitude as needed

    // Apply the rocking motion to the swivel group
    this.rotate.rotation.set(rockingAngle, 0, 0);

    // let angle = 0.01 * delta;
    // if (angle > this.rotate.rotation.x) {
    //   angle = (angle+this.rotate.rotation.x)/2;
    // }
    
    // this.rotate.rotation.set(angle, 0, 0);

    this.spin.rotateY(0.005 * delta);
  }

}

let simpleRoundaboutObCtr = 0;
// A simple merry-go-round.
/**
 * @typedef SimpleRoundaboutProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrSimpleRoundabout extends GrObject {
  /**
   * @param {SimpleRoundaboutProperties} params
   */
  constructor(params = {}) {
    let simpleRoundabout = new T.Group();

    let base_geom = new T.CylinderGeometry(0.5, 1, 0.5, 16);
    let base_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.5,
      roughness: 0.8
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.25);
    simpleRoundabout.add(base);

    let platform_geom = new T.CylinderGeometry(2, 1.8, 0.3, 8, 4);
    let platform_mat = new T.MeshStandardMaterial({
      color: "blue",
      metalness: 0.3,
      roughness: 0.6
    });

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.25);
    let platform = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(platform);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`SimpleRoundabout-${simpleRoundaboutObCtr++}`, simpleRoundabout);
    this.whole_ob = simpleRoundabout;
    this.platform = platform_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    simpleRoundabout.scale.set(scale, scale, scale);
  }
  /**
   * StepWorld method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    this.platform.rotateY(0.005 * delta);
  }

}

let roundaboutObCtr = 0;
// A colorful merry-go-round, with handles and differently-colored sections.
/**
 * @typedef ColoredRoundaboutProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrColoredRoundabout extends GrObject {
  /**
   * @param {ColoredRoundaboutProperties} params
   */
  constructor(params = {}) {
    let roundabout = new T.Group();

    let base_geom = new T.CylinderGeometry(0.5, 1, 0.5, 16);
    let base_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.5,
      roughness: 0.8
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.25);
    roundabout.add(base);

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.25);

    let section_geom = new T.CylinderGeometry(
      2,
      1.8,
      0.3,
      8,
      4,
      false,
      0,
      Math.PI / 2
    );
    let section_mat;
    let section;

    let handle_geom = buildHandle();
    let handle_mat = new T.MeshStandardMaterial({
      color: "#999999",
      metalness: 0.8,
      roughness: 0.2
    });
    let handle;

    // in the loop below, we add four differently-colored sections, with handles,
    // all as part of the platform group.
    let section_colors = ["red", "blue", "yellow", "green"];
    for (let i = 0; i < section_colors.length; i++) {
      section_mat = new T.MeshStandardMaterial({
        color: section_colors[i],
        metalness: 0.3,
        roughness: 0.6
      });
      section = new T.Mesh(section_geom, section_mat);
      handle = new T.Mesh(handle_geom, handle_mat);
      section.add(handle);
      handle.rotation.set(0, Math.PI / 4, 0);
      handle.translateZ(1.5);
      platform_group.add(section);
      section.rotateY((i * Math.PI) / 2);
    }

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Roundabout-${roundaboutObCtr++}`, roundabout);
    this.whole_ob = roundabout;
    this.platform = platform_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    roundabout.scale.set(scale, scale, scale);

    // This helper function defines a curve for the merry-go-round's handles,
    // then extrudes a tube along the curve to make the actual handle geometry.
    function buildHandle() {
      /**@type THREE.CurvePath */
      let handle_curve = new T.CurvePath();
      handle_curve.add(
        new T.LineCurve3(new T.Vector3(-0.5, 0, 0), new T.Vector3(-0.5, 0.8, 0))
      );
      handle_curve.add(
        new T.CubicBezierCurve3(
          new T.Vector3(-0.5, 0.8, 0),
          new T.Vector3(-0.5, 1, 0),
          new T.Vector3(0.5, 1, 0),
          new T.Vector3(0.5, 0.8, 0)
        )
      );
      handle_curve.add(
        new T.LineCurve3(new T.Vector3(0.5, 0.8, 0), new T.Vector3(0.5, 0, 0))
      );
      return new T.TubeGeometry(handle_curve, 64, 0.1, 8);
    }
  }
  /**
   * StepWorld Method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    this.platform.rotateY(0.005 * delta);
  }


}

let simpleSwingObCtr = 0;

// A basic, one-seat swingset.
/**
 * @typedef SimpleSwingProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrSimpleSwing extends GrObject {
  /**
   * @param {SimpleSwingProperties} params
   */
  constructor(params = {}) {
    let simpleSwing = new T.Group();
    addPosts(simpleSwing);

    // Here, we create a "hanger" group, which the swing chains will hang from.
    // The "chains" for the simple swing are just a couple thin cylinders.
    let hanger = new T.Group();
    simpleSwing.add(hanger);
    hanger.translateY(1.8);
    let chain_geom = new T.CylinderGeometry(0.05, 0.05, 1.4);
    let chain_mat = new T.MeshStandardMaterial({
      color: "#777777",
      metalness: 0.8,
      roughness: 0.2
    });
    let l_chain = new T.Mesh(chain_geom, chain_mat);
    let r_chain = new T.Mesh(chain_geom, chain_mat);
    hanger.add(l_chain);
    hanger.add(r_chain);
    l_chain.translateY(-0.75);
    l_chain.translateZ(0.4);
    r_chain.translateY(-0.75);
    r_chain.translateZ(-0.4);

    let seat_group = new T.Group();
    let seat_geom = new T.BoxGeometry(0.4, 0.1, 1);
    let seat_mat = new T.MeshStandardMaterial({
      color: "#554433",
      metalness: 0.1,
      roughness: 0.6
    });
    let seat = new T.Mesh(seat_geom, seat_mat);
    seat_group.add(seat);
    seat_group.position.set(0, -1.45, 0);
    hanger.add(seat_group);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`SimpleSwing-${simpleSwingObCtr++}`, simpleSwing);
    this.whole_ob = simpleSwing;
    this.hanger = hanger;
    this.seat = seat_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    simpleSwing.scale.set(scale, scale, scale);

    this.swing_max_rotation = Math.PI / 4;
    this.swing_direction = 1;

    // This helper function creates the 5 posts for a swingset frame,
    // and positions them appropriately.
    function addPosts(group) {
      let post_material = new T.MeshStandardMaterial({
        color: "red",
        metalness: 0.6,
        roughness: 0.5
      });
      let post_geom = new T.CylinderGeometry(0.1, 0.1, 2, 16);
      let flPost = new T.Mesh(post_geom, post_material);
      group.add(flPost);
      flPost.position.set(0.4, 0.9, 0.9);
      flPost.rotateZ(Math.PI / 8);
      let blPost = new T.Mesh(post_geom, post_material);
      group.add(blPost);
      blPost.position.set(-0.4, 0.9, 0.9);
      blPost.rotateZ(-Math.PI / 8);
      let frPost = new T.Mesh(post_geom, post_material);
      group.add(frPost);
      frPost.position.set(0.4, 0.9, -0.9);
      frPost.rotateZ(Math.PI / 8);
      let brPost = new T.Mesh(post_geom, post_material);
      group.add(brPost);
      brPost.position.set(-0.4, 0.9, -0.9);
      brPost.rotateZ(-Math.PI / 8);
      let topPost = new T.Mesh(post_geom, post_material);
      group.add(topPost);
      topPost.position.set(0, 1.8, 0);
      topPost.rotateX(-Math.PI / 2);
    }
  }
  /* stepWorld method - make the swing swing! */
    stepWorld(delta, timeOfDay) {
        // if we swing too far forward or too far backward, switch directions.
        if (this.hanger.rotation.z >= this.swing_max_rotation)
            this.swing_direction = -1;
        else if (this.hanger.rotation.z <= -this.swing_max_rotation)
            this.swing_direction = 1;
        this.hanger.rotation.z += this.swing_direction * 0.003 * delta;
    }

}

let swingObCtr = 0;

// A more complicated, one-seat swingset.
// This one has actual chain links for its chains,
// and uses a nicer animation to give a more physically-plausible motion.
/**
 * @typedef AdvancedSwingProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrAdvancedSwing extends GrObject {
  /**
   * @param {AdvancedSwingProperties} params
   */
  constructor(params = {}) {
    let swing = new T.Group();
    addPosts(swing);

    let hanger = new T.Group();
    swing.add(hanger);
    hanger.translateY(1.8);
    let l_chain = new T.Group();
    let r_chain = new T.Group();
    hanger.add(l_chain);
    hanger.add(r_chain);
    // after creating chain groups, call the function to add chain links.
    growChain(l_chain, 20);
    growChain(r_chain, 20);
    l_chain.translateZ(0.4);
    r_chain.translateZ(-0.4);

    let seat_group = new T.Group();
    let seat_geom = new T.BoxGeometry(0.4, 0.1, 1);
    let seat_mat = new T.MeshStandardMaterial({
      color: "#554433",
      metalness: 0.1,
      roughness: 0.6
    });
    let seat = new T.Mesh(seat_geom, seat_mat);
    seat_group.add(seat);
    seat_group.position.set(0, -1.45, 0);
    hanger.add(seat_group);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Swing-${swingObCtr++}`, swing);
    this.whole_ob = swing;
    this.hanger = hanger;
    this.seat = seat_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    swing.scale.set(scale, scale, scale);

    this.swing_angle = 0;

    // This helper function creates the 5 posts for a swingset frame,
    // and positions them appropriately.
    function addPosts(group) {
      let post_material = new T.MeshStandardMaterial({
        color: "red",
        metalness: 0.6,
        roughness: 0.5
      });
      let post_geom = new T.CylinderGeometry(0.1, 0.1, 2, 16);
      let flPost = new T.Mesh(post_geom, post_material);
      group.add(flPost);
      flPost.position.set(0.4, 0.9, 0.9);
      flPost.rotateZ(Math.PI / 8);
      let blPost = new T.Mesh(post_geom, post_material);
      group.add(blPost);
      blPost.position.set(-0.4, 0.9, 0.9);
      blPost.rotateZ(-Math.PI / 8);
      let frPost = new T.Mesh(post_geom, post_material);
      group.add(frPost);
      frPost.position.set(0.4, 0.9, -0.9);
      frPost.rotateZ(Math.PI / 8);
      let brPost = new T.Mesh(post_geom, post_material);
      group.add(brPost);
      brPost.position.set(-0.4, 0.9, -0.9);
      brPost.rotateZ(-Math.PI / 8);
      let topPost = new T.Mesh(post_geom, post_material);
      group.add(topPost);
      topPost.position.set(0, 1.8, 0);
      topPost.rotateX(-Math.PI / 2);
    }

    // Helper function to add "length" number of links to a chain.
    function growChain(group, length) {
      let chain_geom = new T.TorusGeometry(0.05, 0.015);
      let chain_mat = new T.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.8,
        roughness: 0.2
      });
      let link = new T.Mesh(chain_geom, chain_mat);
      group.add(link);
      for (let i = 0; i < length; i++) {
        let l_next = new T.Mesh(chain_geom, chain_mat);
        l_next.translateY(-0.07);
        link.add(l_next);
        l_next.rotation.set(0, Math.PI / 3, 0);
        link = l_next;
      }
    }
  }
  /**
   * StepWorld method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    // in this animation, use the sine of the accumulated angle to set current rotation.
    // This means the swing moves faster as it reaches the bottom of a swing,
    // and faster at either end of the swing, like a pendulum should.
    this.swing_angle += 0.005 * delta;
    this.hanger.rotation.z = (Math.sin(this.swing_angle) * Math.PI) / 4;
    this.seat.rotation.z = (Math.sin(this.swing_angle) * Math.PI) / 16;
  }

}

let tireSwingObCtr = 0;

// A basic, one-seat swingset.
/**
 * @typedef TireSwingProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [rx=0]
 * @property {number} [ry=0]
 * @property {number} [rz=0]
 * @property {number} [size=1]
 */
export class GrTireSwing extends GrObject {
  /**
   * @param {TireSwingProperties} params
   */
  constructor(params = {}) {
    let tireSwing = new T.Group();

    // add posts
    let post_material = new T.MeshStandardMaterial({color: "#AA6030", map: wood, roughness: 0.8});
    let post_geom = new T.BoxGeometry(0.5, 6, 0.5);

    let flPost = new T.Mesh(post_geom, post_material);
    flPost.rotation.set(Math.PI/16, 0, Math.PI/16);
    flPost.position.set(1, 2.75, -4);
    flPost.receiveShadow = true;
    flPost.castShadow = true;
    tireSwing.add(flPost);

    let frPost = new T.Mesh(post_geom, post_material);
    frPost.rotation.set(Math.PI/16, 0, -Math.PI/16);
    frPost.position.set(-1, 2.75, -4);
    frPost.receiveShadow = true;
    frPost.castShadow = true;
    tireSwing.add(frPost);

    let blPost = new T.Mesh(post_geom, post_material);
    blPost.rotation.set(-Math.PI/16, 0, Math.PI/16);
    blPost.position.set(1, 2.75, 4);
    blPost.receiveShadow = true;
    blPost.castShadow = true;
    tireSwing.add(blPost);

    let brPost = new T.Mesh(post_geom, post_material);
    brPost.rotation.set(-Math.PI/16, 0, -Math.PI/16);
    brPost.position.set(-1, 2.75, 4);
    brPost.receiveShadow = true;
    brPost.castShadow = true;
    tireSwing.add(brPost);

    let top_post_geom = new T.BoxGeometry(1.5, 7.5, 0.3);
    let topPost = new T.Mesh(top_post_geom, post_material);
    topPost.position.set(0, 5.75, 0);
    topPost.rotation.set(Math.PI/2, 0, 0);
    topPost.receiveShadow = true;
    topPost.castShadow = true;
    tireSwing.add(topPost);

    // add rope group
    let rope_group = new T.Group();
    rope_group.position.set(0, 5.75, 0);
    rope_group.rotation.set(Math.PI/14, 0, 0);
    tireSwing.add(rope_group);

    let rope_geom = new T.CylinderGeometry(0.05, 0.05, 4, 16);
    let rope_mat = new T.MeshStandardMaterial({color: "orange", roughness: 0.8});

    let fl_rope = new T.Mesh(rope_geom, rope_mat);
    fl_rope.position.set(0.5,-2,-0.5);
    fl_rope.rotation.set(Math.PI/12, 0, Math.PI/12);
    fl_rope.receiveShadow = true;
    fl_rope.castShadow = true;
    rope_group.add(fl_rope);

    let fr_rope = new T.Mesh(rope_geom, rope_mat);
    fr_rope.position.set(-0.5,-2,-0.5);
    fr_rope.rotation.set(Math.PI/12, 0, -Math.PI/12);
    fr_rope.receiveShadow = true;
    fr_rope.castShadow = true;
    rope_group.add(fr_rope);

    let bl_rope = new T.Mesh(rope_geom, rope_mat);
    bl_rope.position.set(0.5,-2,0.5);
    bl_rope.rotation.set(-Math.PI/12, 0, Math.PI/12);
    bl_rope.receiveShadow = true;
    bl_rope.castShadow = true;
    rope_group.add(bl_rope);

    let br_rope = new T.Mesh(rope_geom, rope_mat);
    br_rope.position.set(-0.5,-2,0.5);
    br_rope.rotation.set(-Math.PI/12, 0, -Math.PI/12);
    br_rope.receiveShadow = true;
    br_rope.castShadow = true;
    rope_group.add(br_rope);

    // tire
    let tire_geom = new T.TorusGeometry(1.25, 0.5, 16, 100);
    let tire_mat = new T.MeshStandardMaterial({color: "black", bumpMap: tire_texture, bumpScale: 5, roughness: 0.8});
    let tire = new T.Mesh(tire_geom, tire_mat);
    tire.position.set(0, -3.75, 0);
    tire.rotation.set(Math.PI/2, 0, 0);
    tire.receiveShadow = true;
    tire.castShadow = true;
    rope_group.add(tire);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`TireSwing-${tireSwingObCtr++}`, tireSwing);
    this.whole_ob = tireSwing;
    this.hanger = rope_group;
    this.tire = rope_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    this.whole_ob.rotation.x = params.rx ? Number(params.rx) : 0;
    this.whole_ob.rotation.y = params.ry ? Number(params.ry) : 0;
    this.whole_ob.rotation.z = params.rz ? Number(params.rz) : 0;
    let scale = params.size ? Number(params.size) : 1;
    tireSwing.scale.set(scale, scale, scale);

    this.swing_max_rotation = Math.PI / 4;
    this.swing_direction = 1;
    this.rideable = rope_group;

  }
  /* stepWorld method - make the swing swing! */
    stepWorld(delta, timeOfDay) {
        let worldY = new T.Vector3(0, 1, 0);
        this.tire.rotateOnWorldAxis(worldY, 0.02);
    }

}

let carouselObCtr = 0;
let horse_group_list = [];
let horse_direction_list = [1,-1,1,-1,1,-1,1,-1,1,-1];
let loader = new OBJLoader();
let colors = ["#BA75D5", "#0FCFFF", "#E38762", "#6EEE58", "pink"];
// A Carousel.
/**
 * @typedef CarouselProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 * @property {T.Group} [h1=null]
 * @property {T.Group} [h2=null]
 */
export class GrCarousel extends GrObject {
  /**
   * @param {CarouselProperties} params
   */
  constructor(params = {}) {
    let width = 3;
    let carousel = new T.Group();

    let base_geom = new T.CylinderGeometry(width, width, 1, 32);
    let base_mat = new T.MeshStandardMaterial({
      color: "lightblue",
      metalness: 0.3,
      roughness: 0.8
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.5);
    carousel.add(base);

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.5);

    let platform_geom = new T.CylinderGeometry(
      0.95 * width,
      0.95 * width,
      0.2,
      32
    );
    let platform_mat = new T.MeshStandardMaterial({
      color: "gold",
      metalness: 0.3,
      roughness: 0.8
    });
    let platform = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(platform);

    let cpole_geom = new T.CylinderGeometry(0.3 * width, 0.3 * width, 3, 16);
    let cpole_mat = new T.MeshStandardMaterial({
      color: "gold",
      metalness: 0.8,
      roughness: 0.5
    });
    let cpole = new T.Mesh(cpole_geom, cpole_mat);
    platform_group.add(cpole);
    cpole.translateY(1.5);

    let top_trim = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(top_trim);
    top_trim.translateY(3);

    let opole_geom = new T.CylinderGeometry(0.03 * width, 0.03 * width, 3, 16);
    let opole_mat = new T.MeshStandardMaterial({
      color: "#aaaaaa",
      metalness: 0.8,
      roughness: 0.5
    });

    let opole;
    let num_poles = 10;
    let poles = [];

    for (let i = 0; i < num_poles; i++) {
      opole = new T.Mesh(opole_geom, opole_mat);
      platform_group.add(opole);
      opole.translateY(1.5);
      opole.rotateY((2 * i * Math.PI) / num_poles);
      opole.translateX(0.8 * width);

      let horse_group = new T.Group();
      horse_group_list.push(horse_group);

      let horse;

      // switch between horse objects
      if (i % 2 == 0 && params.h1 != null) {
        horse = params.h1.clone();
        horse.rotateX(-Math.PI / 2);
        horse.rotateZ(Math.PI);
        // set horse color
        setMaterialColor(horse, colors[i % colors.length]);
        horse_group.add(horse);
        horse_direction_list.push(1);
      } 
      else if (params.h2 != null){
        horse = params.h2.clone();
        horse.rotateX(-Math.PI / 2);
        horse.rotateZ(Math.PI);
        // set horse color
        setMaterialColor(horse, colors[i % colors.length]);
        horse_group.add(horse);
        horse_direction_list.push(1);
      }     

      // add horse child to opole
      // let horse_geom = new T.BoxGeometry(0.75, 0.75, 1.25);
      // let horse_mat = new T.MeshStandardMaterial({
      //   color: "brown",
      //   metalness: 0.3,
      //   roughness: 0.8
      // });
      // let horse = new T.Mesh(horse_geom, horse_mat);
      opole.add(horse_group);
      platform.add(opole);

      poles.push(opole);
    }

    let roof_geom = new T.ConeGeometry(width, 0.5 * width, 32, 4);
    let roof = new T.Mesh(roof_geom, base_mat);
    carousel.add(roof);
    roof.translateY(4.8);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Carousel-${carouselObCtr++}`, carousel);
    this.whole_ob = carousel;
    this.platform = platform;
    this.poles = poles;
    this.time = 0;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    carousel.scale.set(scale, scale, scale);
  }

   /**
   * StepWorld method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
   stepWorld(delta, timeOfDay) {
    this.platform.rotateY(0.001 * delta);

    this.time += delta / 1000;


    for (let i = 0; i < this.poles.length; i++) {

      let pole = this.poles[i].children[0];

      if (i % 2 == 0) {
        pole.position.y = Math.sin(this.time * Math.PI/2)/2;
      }

      else {
          pole.position.y = -Math.sin(this.time * Math.PI/2)/2;
      }
    }
  }
}

/**
 * Sets the material color for all Mesh objects within the given object.
 * @param {T.Object3D} object - The object to set the material color for.
 * @param {string} color - The color to set.
 */
function setMaterialColor(object, color) {
  // let stack = [object];
  // while (stack.length > 0) {
  //   let obj = stack.pop();
  //   console.log(obj);
  //   if (obj instanceof T.Mesh) {
  //     obj.material = new T.MeshStandardMaterial({ color: color });
  //     console.log(obj.material);
  //   }
  //   if (obj.children) {
  //     stack.push(...obj.children);
  //   }
  // }
  object.traverse((child) => {
    if (child.isMesh) { // for some reason (child instanceof T.Mesh) doesn't work
      child.material = new T.MeshStandardMaterial({ color: color });
    }
  });
}

let simpleSwingSeatObCtr = 0;
/**
 * @typedef SimpleSwingSeatProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrSimpleSwingSeat extends GrObject {
  /**
   * @param {SimpleSwingSeatProperties} params
   */
  constructor(params = {}) {
    let simpleSwingSeat = new T.Group();

    let base_geom = new T.CylinderGeometry(0.5, 1, 1, 16);
    let base_mat = new T.MeshStandardMaterial({
      color: "#88FF88",
      metalness: 0.5,
      roughness: 0.3
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.5);
    simpleSwingSeat.add(base);

    let platform_geom = new T.TorusGeometry(0.7,0.5);
    let platform_mat = new T.MeshStandardMaterial({
      color: "#003300",
      metalness: 0.3,
      roughness: 0.6
    });

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.75);
    let platform = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(platform);
    platform_group.rotation.x = (Math.PI/2);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`SimpleSwingSeat-${simpleSwingSeatObCtr++}`, simpleSwingSeat);
    this.whole_ob = simpleSwingSeat;
    this.platform = platform_group;
    this.swing_direction = 1;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    simpleSwingSeat.scale.set(scale, scale, scale);
  }
  /**
   * StepWorld method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    this.platform.rotation.y += this.swing_direction * 0.005 * delta;
    if (this.platform.rotation.y >= Math.PI || this.platform.rotation.y <= 0) {
      this.swing_direction *= -1;
    }
  }

}

