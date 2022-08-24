import { useEffect, useState } from 'react';
import { XRButton } from './XRButton';

function XRWatch({ onGl, onIsPresenting }) {
  // const gl = useThree((state) => state.gl);
  // const { isPresenting } = useXR();

  // useEffect(() => {
  //   onIsPresenting?.(isPresenting);
  // }, [isPresenting, onIsPresenting]);

  // useEffect(() => {
  //   onGl?.(gl);
  // }, [gl, onGl]);

  return null;
}

export function XRCanvas({ children, configurations, onConfiguration, buttonContent, ...rest }) {
  // const [gl, setGl] = useState(null);
  // const [isPresenting, setIsPresenting] = useState(false);
  // return (
  //   <>
  //     <Canvas id="vr" vr {...rest}>
  //       <XR>
  //         <InteractionManager>
  //           <XRWatch onGl={setGl} onIsPresenting={setIsPresenting} />
  //           {children}
  //         </InteractionManager>
  //       </XR>
  //     </Canvas>
  //     {!isPresenting && gl && (
  //       <XRButton
  //         gl={gl}
  //         configurations={configurations}
  //         onConfiguration={onConfiguration}
  //         buttonContent={buttonContent}
  //       />
  //     )}
  //   </>
  // );
}
