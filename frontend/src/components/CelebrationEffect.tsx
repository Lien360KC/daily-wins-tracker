import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

export interface CelebrationRef {
  fire: () => void;
}

interface CelebrationEffectProps {
  autoFire?: boolean;
}

export const CelebrationEffect = forwardRef<CelebrationRef, CelebrationEffectProps>(
  ({ autoFire = false }, ref) => {
    const confettiRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      fire: () => {
        if (confettiRef.current) {
          confettiRef.current.start();
        }
      },
    }));

    useEffect(() => {
      if (autoFire && confettiRef.current) {
        const timer = setTimeout(() => {
          confettiRef.current.start();
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [autoFire]);

    return (
      <View style={styles.container} pointerEvents="none">
        <ConfettiCannon
          ref={confettiRef}
          count={150}
          origin={{ x: width / 2, y: -20 }}
          autoStart={false}
          fadeOut={true}
          fallSpeed={3000}
          explosionSpeed={350}
          colors={[
            '#4D94FF',
            '#34D399',
            '#FBBF24',
            '#F87171',
            '#A78BFA',
            '#F472B6',
            '#22D3EE',
            '#FB923C',
          ]}
        />
      </View>
    );
  }
);

CelebrationEffect.displayName = 'CelebrationEffect';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
});
