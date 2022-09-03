import { useCallback, useState } from 'react';
import {
  Engine,
  Scene,
  useClick,
  useHover,
  useBeforeRender,
  SceneEventArgs,
} from 'react-babylonjs';
import '@babylonjs/inspector';

// import { DefaultHandControllers } from './lib/react-xr-default-hands/DefaultHandControllers';
import { AllStones } from './AllStones';
// import { XRCanvas } from './xr/XRCanvas';
import { Ammo } from './lib/Ammo';

import './App.css';
import { AmmoJSPlugin, Vector3, Scene as BabylonJSCoreScene } from '@babylonjs/core';
import { Floor } from './Floor';
import '@babylonjs/loaders/glTF';

const physicsPlugin = new AmmoJSPlugin(true, Ammo);

const configurations = [
  {
    sessionType: 'immersive-ar',
    sessionInit: {
      requiredFeatures: ['local-floor'],
      optionalFeatures: ['hand-tracking'],
    },
    referenceSpace: 'local-floor',
  },
  {
    sessionType: 'immersive-vr',
    sessionInit: {
      requiredFeatures: ['local-floor'],
      optionalFeatures: ['hand-tracking'],
    },
    referenceSpace: 'local-floor',
  },
];

const gravityVector = new Vector3(0, -9.81, 0);

async function initXR(scene: BabylonJSCoreScene, configurations, onConfiguration) {
  let nav: any = navigator;

  if ('xr' in nav) {
    for (const config of configurations) {
      const type = config.sessionType;
      if (await nav.xr.isSessionSupported(type)) {
        try {
          scene.createDefaultXRExperienceAsync({
            uiOptions: {
              sessionMode: config.sessionType,
              referenceSpaceType: config.referenceSpace,
            },
            optionalFeatures: true,
          });
        } catch (error) {}

        onConfiguration(config);
        break;
      }
    }
  }
}

async function onSceneMount({ canvas, scene }: SceneEventArgs, initSceneXR) {
  scene.debugLayer.show();
  scene.enablePhysics(gravityVector, physicsPlugin);
  scene.getPhysicsEngine().setSubTimeStep(8);

  await initSceneXR(scene);
}

function App() {
  const [configurationChosen, setConfigurationChosen] = useState(configurations[1]);

  const initSceneXR = useCallback((scene) => {
    initXR(scene, configurations, setConfigurationChosen);
  }, []);

  const type = configurationChosen.sessionType === 'immersive-vr' ? 'vr' : 'ar';
  return (
    <div className="App">
      <main className="App-body">
        <Engine antialias canvasId="babylonJS" tabIndex={-1}>
          <Scene onSceneMount={(e) => onSceneMount(e, initSceneXR)}>
            <arcRotateCamera
              name="arc"
              target={new Vector3(0, 1, 0)}
              alpha={-Math.PI / 2}
              beta={0.5 + Math.PI / 4}
              radius={10}
            />
            {configurationChosen && (
              <>
                {/* <DefaultHandControllers /> */}
                <Floor invisible={type === 'ar'} />
                <hemisphericLight
                  name="main-hemispheric-light"
                  direction={new Vector3(0, 1, 0)}
                  intensity={0.3}
                />
                <pointLight
                  name="main-point-light"
                  intensity={1.5}
                  position={new Vector3(0, 3, -2)}
                >
                  <shadowGenerator
                    mapSize={1024}
                    useBlurExponentialShadowMap={true}
                    blurKernel={64}
                    blurScale={1}
                    shadowCastChildren
                  >
                    <AllStones />
                  </shadowGenerator>
                </pointLight>
              </>
            )}
          </Scene>
        </Engine>
      </main>
    </div>
  );
}

export default App;
