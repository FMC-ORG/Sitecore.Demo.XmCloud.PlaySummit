import Image from 'next/image';
import * as FEAAS from '@sitecore-feaas/clientside/react';
import remotePatterns from 'lib/image-remote-patterns.json';

const FEAASScripts = (): React.JSX.Element => {
  const shouldOptimize = (src: string): boolean => {
    if (!src.startsWith('http')) return true;
    const url = new URL(src);
    return remotePatterns.some((pattern) => {
      const hostname = pattern.hostname.replace(/\./g, '\\.').replace(/\*/g, '.*');
      return (
        pattern.protocol.replace(/:$/, '') === url.protocol.slice(0, -1) &&
        new RegExp(`^${hostname}$`).test(url.hostname)
      );
    });
  };

  FEAAS.setElementImplementation('img', (attributes: Record<string, string>) => {
    const { src, alt, ...imgAttributes } = attributes;
    delete imgAttributes.children;
    return (
      <Image
        height={1920}
        width={1200}
        unoptimized={!shouldOptimize(src)}
        src={src}
        alt={alt}
        {...imgAttributes}
      />
    );
  });
  return <></>;
};
export default FEAASScripts;
