import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useGraph, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

export default function Cursor(props) {
  const group = useRef()
  const sphereRef = useRef() // New ref for the sphere
  const { scene, animations } = useGLTF('/phoenix_bird/cursor.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, group)
  const [mouse, setMouse] = useState([0, 0]);
  const { viewport } = useThree();

  // Mouse tracking variables
  const target = useRef([0, 0]);
  const dampFactor = 0.01;
  const rotationDamp = 0.01;
  const baseRotation = [-Math.PI / 2, 0, 0.053];

  // Variables for sphere rotation
  const sphereRotation = useRef({ x: 0, y: 0, z: 0 });
  const lastMousePos = useRef([0, 0]);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => action.play());
    }
  }, [actions]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Calculate mouse movement delta for sphere rotation
      const deltaX = x - lastMousePos.current[0];
      const deltaY = y - lastMousePos.current[1];

      // Store current position for next frame
      lastMousePos.current = [x, y];

      // Update rotation based on movement direction
      sphereRotation.current.x += deltaY * 5; // Vertical movement = X rotation
      sphereRotation.current.y += deltaX * 5; // Horizontal movement = Y rotation

      target.current = [x, y];
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const aspectAdjustX = viewport.aspect;

    // Update bird position with damping
    setMouse(([prevX, prevY]) => {
      const [tx, ty] = target.current;
      // 1) Smooth position for bird
      const newX = prevX + (tx - prevX) * dampFactor;
      const newY = prevY + (ty - prevY) * dampFactor;

      group.current.position.set(
        newX * 3.85 * aspectAdjustX - 0.3,
        newY * 3.85 - 0.2,
        0
      );
      group.current.scale.set(0.001, 0.001, 0.001);

      // Movement delta and rotation calculations for the bird
      const dx = tx - prevX;
      const dy = ty - prevY;
      const speed = Math.hypot(dx, dy);

      let motionAngle = Math.atan2(dy, dx);
      const maxTilt = 0.5;
      const tiltStrength = 0.5;
      let rawTilt = (motionAngle - baseRotation[2]) * tiltStrength;
      rawTilt = Math.max(-maxTilt, Math.min(maxTilt, rawTilt));
      const desiredZ = baseRotation[2] + rawTilt;
      const threshold = 0.05;
      const targetZ = Math.abs(dy) < threshold ? 0 : desiredZ;
      group.current.rotation.z += (targetZ - group.current.rotation.z) * rotationDamp;
      const targetY = dx < -threshold ? Math.PI : 0;
      group.current.rotation.y += (targetY - group.current.rotation.y) * rotationDamp;

      return [newX, newY];
    });

    // Update sphere position and rotation (no damping - direct positioning)
    if (sphereRef.current) {
      const [tx, ty] = target.current;

      // Position sphere exactly at cursor position
      sphereRef.current.position.set(
        tx * 3.85 * aspectAdjustX,
        ty * 3.85,
        0
      );

      // Apply rotation based on mouse movement
      sphereRef.current.rotation.x = 2 * sphereRotation.current.x;
      sphereRef.current.rotation.y = 2 * sphereRotation.current.y;
      sphereRef.current.rotation.z += 0.01; // Constant slow rotation on Z axis
    }
  });

  return (
    <>
      {/* Low-poly sphere cursor */}
      {/* Glow effect group */}
      <group ref={sphereRef}>
        {/* Inner Glow Layer */}
        <mesh>
          <sphereGeometry args={[0.12, 8, 6]} /> {/* Slightly larger */}
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.2} // Adjust opacity for glow intensity
            blending={THREE.AdditiveBlending} // Additive blending for glow
            depthWrite={false} // Prevent glow from obscuring things behind it incorrectly
          />
        </mesh>
        {/* Outer Glow Layer (Optional, for softer glow) */}
        <mesh>
          <sphereGeometry args={[0.15, 8, 6]} /> {/* Even larger */}
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.1} // Lower opacity for outer layer
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Outermost Dark Layer (for clear visibility of the inner glow) */}
        <mesh>
          <sphereGeometry args={[0.3, 8, 6]} /> {/* Even larger */}
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.1} // Lower opacity for outer layer
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Original Wireframe Sphere */}
        <mesh>
          <sphereGeometry args={[0.1, 5, 5]} /> {/* Original size */}
          <meshStandardMaterial color="#ffffff" wireframe={true} transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Phoenix bird cursor with damping */}
      <group ref={group} {...props} dispose={null}>
        <group name="Sketchfab_Scene" position={[0, 0.25, 0]}>
          <group name="Sketchfab_model" position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0.053]}>
            <group name="5f59736c86d4457fa045aec4aea6b7e0fbx" rotation={[Math.PI / 2, 0, 0]}>
              <group name="Object_2">
                <group name="RootNode">
                  <group name="Object_4">
                    <primitive object={nodes._rootJoint} />
                    <skinnedMesh name="Object_7" geometry={nodes.Object_7.geometry} material={materials.MatI_Ride_FengHuang_01a} skeleton={nodes.Object_7.skeleton} />
                    <skinnedMesh name="Object_8" geometry={nodes.Object_8.geometry} material={materials.MatI_Ride_FengHuang_01b} skeleton={nodes.Object_8.skeleton} />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </>
  )
}

useGLTF.preload('/phoenix_bird/cursor.glb')