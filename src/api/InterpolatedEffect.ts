import { easeCubicOut } from 'd3-ease';
import { useEffect } from 'react';
import useTransition from './useTransition';

interface Options {
  animationStepFunction: (progress: number) => number;
  animationDuration: number;
}

const defaultOptions: Options = {
  animationStepFunction: easeCubicOut,
  animationDuration: 600,
};

type Interpolator<Props> = (
  prev: Props,
  next: Props
) => ((progress: number) => Props) | Props | undefined;

export default <Props>(
  interpolator: Interpolator<Props>,
  options: Partial<Options> = {}
) => {
  const _options = {
    ...defaultOptions,
    ...options,
  };

  const useInterpolatedEffect = (props: Props) => {
    const [interpolated, startAnimation, isAnimating] = useTransition<Props>(
      props
    );

    useEffect(() => {
      const _interpolator = interpolator(interpolated, props);

      if (typeof _interpolator === 'function') {
        const fn = _interpolator as (progress: number) => Props;
        startAnimation({
          duration: _options.animationDuration,
          step: (progress: number) => {
            const easedProgress = _options.animationStepFunction(progress);
            return fn(easedProgress);
          },
        });
      } else if (_interpolator) {
        startAnimation(_interpolator);
      }

      // startAnimation has no dependencies
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    return [interpolated, isAnimating] as const;
  };

  return useInterpolatedEffect;
};
