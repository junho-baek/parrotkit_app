import { useEffect, useMemo, useState } from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

type RotatingWordItem = {
  label: string;
  color: string;
};

type RotatingWordProps = {
  words: RotatingWordItem[];
  duration?: number;
  reserveSpace?: boolean;
  textStyle?: StyleProp<TextStyle>;
};

export function RotatingWord({
  words,
  duration = 2200,
  reserveSpace = true,
  textStyle,
}: RotatingWordProps) {
  const [index, setIndex] = useState(0);

  const widestWordLength = useMemo(
    () => words.reduce((max, word) => Math.max(max, word.label.length), 0),
    [words]
  );

  useEffect(() => {
    if (words.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [duration, words]);

  const currentWord = words[index] ?? words[0];

  return (
    <View
      style={{
        minHeight: 30,
        minWidth: reserveSpace ? Math.max(widestWordLength * 8.2, 108) : undefined,
        overflow: 'hidden',
      }}
    >
      <Animated.Text
        entering={FadeInUp.duration(220)}
        exiting={FadeOutDown.duration(220)}
        key={currentWord.label}
        style={[textStyle, { color: currentWord.color }]}
      >
        {currentWord.label}
      </Animated.Text>
    </View>
  );
}
