import { Skeleton, SkeletonItem } from '@fluentui/react-components';

const Loading = () => {
  return (
    <Skeleton style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <SkeletonItem appearance='translucent' />
      <SkeletonItem appearance='translucent' />
      <SkeletonItem appearance='translucent' />
      <SkeletonItem appearance='translucent' />
    </Skeleton>
  );
};

export default Loading;
