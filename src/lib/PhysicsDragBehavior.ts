import {
  AbstractMesh,
  BaseSixDofDragBehavior,
  Mesh,
  PhysicsImpostor,
  PhysicsJoint,
  Quaternion,
  Vector3,
  TransformNode,
  MeshBuilder,
  DistanceJointData,
  Observable,
} from '@babylonjs/core';

import { Ammo } from './Ammo';

let tmpTransform = new Ammo.btTransform();

let tmpBabylonVec3 = new Vector3();
let tmpBabylonQuat = new Quaternion();

function getAmmoTransformFromBabylon(pos: Vector3, quat: Quaternion, destTransform) {
  const tmpAmmoPos = new Ammo.btVector3();
  tmpAmmoPos.setValue(pos.x, pos.y, pos.z);
  const tmpAmmoQuat = new Ammo.btQuaternion();
  tmpAmmoQuat.setValue(quat.x, quat.y, quat.z, quat.w);
  destTransform.setIdentity();
  destTransform.setOrigin(tmpAmmoPos);
  destTransform.setRotation(tmpAmmoQuat);
}

function printTransform(t) {
  const o = t.getOrigin();
  console.log(o.x(), o.y(), o.z());
  const r = t.getRotation();
  // console.log(r.x(), r.y(), r.z(), r.w());
}

export class PhysicsDragBehavior extends BaseSixDofDragBehavior {
  // protected _physicsWorld;

  // protected _pointerBody;
  protected _pointerNode: Mesh;
  protected _pointerImpostor: PhysicsImpostor;
  // protected _objectBody;
  protected _objectImpostor: PhysicsImpostor;
  // protected _pointerConstraint;
  protected _pointerJoint: PhysicsJoint;

  protected _startPosition;
  protected _startRotation;

  public onBeforeDragStartObservable = new Observable<{ position: Vector3 }>();

  attach(ownerNode: AbstractMesh): void {
    super.attach(ownerNode);

    ownerNode.isNearGrabbable = true;

    // this._objectBody = ownerNode.physicsImpostor.physicsBody;
    this._objectImpostor = ownerNode.physicsImpostor;

    // this._physicsWorld = this._scene._physicsEngine.getPhysicsPlugin().world;
  }

  public detach(): void {
    super.detach();

    if (this._ownerNode) {
      (this._ownerNode as Mesh).isNearGrabbable = false;
      // this._objectBody = null;
    }

    this._objectImpostor = null;
    // this._physicsWorld = null;
  }

  /*

  start:
  create a body for pointer
  get body for object
  create lock constraint (generic 6dof)
  set max forces

  drag:
  update position of pointer body

  end:
  detach lock constraint
  remove pointer body
  */

  protected _targetDragStart(
    worldPosition: Vector3,
    worldRotation: Quaternion,
    pointerId: number,
  ): void {
    this.onBeforeDragStartObservable.notifyObservers({ position: worldPosition });
    this._startPosition = worldPosition;
    this._startRotation = worldRotation;

    /*
    getAmmoTransformFromBabylon(worldPosition, worldRotation, tmpTransform);
    let motionState = new Ammo.btDefaultMotionState(tmpTransform);

    let colShape = new Ammo.btSphereShape(0.5);

    let inertia = new Ammo.btVector3(0, 0, 0);
    let ptBodyInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, colShape, inertia);
    let ptBody = (this._pointerBody = new Ammo.btRigidBody(ptBodyInfo));
    ptBody.setActivationState(4); // never sleeps
    ptBody.setCollisionFlags(2); // kinematic

    // set collision mask to 0 to collide with nothing
    this._physicsWorld.addRigidBody(this._pointerBody, 1, 0);
    */

    this._pointerNode = MeshBuilder.CreateSphere('pointer-sphere', { diameter: 0.2 });
    this._pointerNode.position.copyFrom(worldPosition);
    this._pointerNode.rotationQuaternion = new Quaternion();
    this._pointerNode.rotationQuaternion.copyFrom(worldRotation);
    // this._pointerNode.visibility = 0;

    this._pointerImpostor = new PhysicsImpostor(this._pointerNode, PhysicsImpostor.NoImpostor, {
      mass: 0,
    });

    this._objectImpostor.wakeUp();

    this._objectImpostor.setAngularVelocity(new Vector3(0, 0, 0));
    this._objectImpostor.setLinearVelocity(new Vector3(0, 0, 0));

    // this._objectImpostor.forceUpdate()
    // this._objectBody.setCollisionFlags(0);
    // this._objectBody.forceActivationState(4);
    // this._objectBody.activate();

    // const transformA = new Ammo.btTransform();
    // transformA.setIdentity();
    // const transformB = new Ammo.btTransform();
    // transformB.setIdentity();
    // const constraint = (this._pointerConstraint = new Ammo.btGeneric6DofConstraint(
    //   this._pointerBody,
    //   this._objectBody,
    //   transformA,
    //   transformB,
    //   false,
    // ));

    // this._physicsWorld.addConstraint(this._pointerConstraint, true);

    this._pointerImpostor.createJoint(this._objectImpostor, PhysicsJoint.DistanceJoint, {
      collision: false,
      maxDistance: 1,
    } as DistanceJointData);
    // this._scene.getPhysicsEngine().addJoint(this._objectImpostor, this._pointerImpostor, joint);
  }

  protected _targetDrag(
    worldDeltaPosition: Vector3,
    worldDeltaRotation: Quaternion,
    pointerId: number,
  ): void {
    // const ms = this._pointerBody.getMotionState();
    // if (ms) {
    //   worldDeltaPosition.addToRef(this._startPosition, tmpBabylonVec3);
    //   worldDeltaRotation.multiplyToRef(this._startRotation, tmpBabylonQuat);

    //   printTransform(
    //     this._objectBody.getMotionState().getWorldTransform() ??
    //       this._objectBody.getWorldTransform(),
    //   );

    //   const t = new Ammo.btTransform();
    //   getAmmoTransformFromBabylon(tmpBabylonVec3, tmpBabylonQuat, t);
    //   this._pointerBody.setWorldTransform(t);
    //   ms.setWorldTransform(t);
    // }
    const parent = this._pointerNode.parent;
    this._pointerNode.setParent(null);
    // this._pointerNode.position.copyFrom(worldDeltaPosition);
    // this._pointerNode.rotationQuaternion.copyFrom(worldDeltaRotation);
    this._startPosition.addToRef(worldDeltaPosition, this._pointerNode.position);
    this._startRotation.multiplyToRef(worldDeltaRotation, this._pointerNode.rotationQuaternion);
    this._pointerNode.setParent(parent);
  }

  protected _targetDragEnd(pointerId: number): void {
    this._pointerImpostor.dispose();
    this._pointerNode.dispose();

    this._pointerNode = null;
    this._pointerImpostor = null;

    // this._physicsWorld.removeConstraint(this._pointerConstraint);
    // this._physicsWorld.removeRigidBody(this._pointerBody);
    // this._pointerBody = null;

    this._startPosition = null;
    this._startRotation = null;
  }
}
