import { Mesh } from '@babylonjs/core';
import { forwardRef, useMemo } from 'react';
import { Model } from 'react-babylonjs';

interface StoneMetadata {
  basePath: string;
  filename: string;
  objectName: string;
  materialName: string;
  physicsBox: [number, number, number];
}

export const stoneMetadata: Record<string, StoneMetadata> = {
  'rock-big': {
    basePath: '/models/',
    filename: 'rock-big.gltf',
    objectName: 'Object.123',
    materialName: 'skatter_rock_01 [imported]',
    physicsBox: [0.3, 0.25, 0.3],
  },
  'rock-black': {
    basePath: '/models/',
    filename: 'rock-black.glb',
    objectName: 'Object.074',
    materialName: 'skatter_gravel_01',
    physicsBox: [0.3, 0.3, 0.3],
  },
  'rock-gray': {
    basePath: '/models/',
    filename: 'rock-gray.gltf',
    objectName: 'Object.065',
    materialName: 'skatter_gravel_01',
    physicsBox: [0.3, 0.3, 0.3],
  },
  'rock-irregular': {
    basePath: '/models/',
    filename: 'rock-irregular.gltf',
    objectName: 'Object.034',
    materialName: 'skatter_gravel_01',
    physicsBox: [0.3, 0.3, 0.3],
  },
};

// useGLTF.preload(assetUrl(stoneMetadata['rock-big'].path));
// useGLTF.preload(assetUrl(stoneMetadata['rock-black'].path));
// useGLTF.preload(assetUrl(stoneMetadata['rock-gray'].path));
// useGLTF.preload(assetUrl(stoneMetadata['rock-irregular'].path));

function assetUrl(path) {
  return process.env.PUBLIC_URL + path;
}
