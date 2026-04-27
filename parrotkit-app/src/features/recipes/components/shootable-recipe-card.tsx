import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import type { MockRecipe } from '@/core/mocks/parrotkit-data';
import { brandActionGradient } from '@/core/theme/colors';
import {
  getRecipeOwnershipLabel,
  getRecipePrimaryActionLabel,
  getRecipeShootProgressLabel,
  getRecipeVerificationLabel,
} from '@/features/recipes/lib/recipe-ownership';

type ShootableRecipeCardProps = {
  recipe: MockRecipe;
  mode?: 'hero' | 'grid';
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
};

export function ShootableRecipeCard({
  recipe,
  mode = 'grid',
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: ShootableRecipeCardProps) {
  const hero = mode === 'hero';
  const resolvedPrimaryLabel = primaryLabel ?? getRecipePrimaryActionLabel(recipe);
  const progressLabel = getRecipeShootProgressLabel(recipe);

  return (
    <View style={[styles.card, hero ? styles.heroCard : styles.gridCard]}>
      <ImageBackground
        imageStyle={styles.image}
        resizeMode="cover"
        source={{ uri: recipe.thumbnail }}
        style={hero ? styles.heroImage : styles.gridImage}
      >
        <LinearGradient
          colors={['rgba(2,6,23,0.04)', 'rgba(2,6,23,0.88)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{getRecipeOwnershipLabel(recipe)}</Text>
          </View>
          <View style={styles.badge}>
            <MaterialCommunityIcons color="#fff" name="check-decagram" size={13} />
            <Text style={styles.badgeText}>{getRecipeVerificationLabel(recipe)}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text numberOfLines={hero ? 2 : 3} style={hero ? styles.heroTitle : styles.gridTitle}>
            {recipe.title}
          </Text>
          <Text numberOfLines={2} style={styles.summary}>
            {recipe.summary}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{recipe.ownerHandle}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{progressLabel}</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable accessibilityRole="button" onPress={onPrimary} style={styles.primaryButton}>
              <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.primaryGradient}>
                <MaterialCommunityIcons color="#fff" name="video-outline" size={16} />
                <Text style={styles.primaryText}>{resolvedPrimaryLabel}</Text>
              </LinearGradient>
            </Pressable>

            {onSecondary && secondaryLabel ? (
              <Pressable accessibilityRole="button" onPress={onSecondary} style={styles.secondaryButton}>
                <Text style={styles.secondaryText}>{secondaryLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  body: {
    marginTop: 'auto',
    padding: 14,
  },
  card: {
    backgroundColor: '#020617',
    borderColor: 'rgba(15, 23, 42, 0.1)',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gridCard: {
    minHeight: 254,
  },
  gridImage: {
    minHeight: 254,
  },
  gridTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
  },
  heroCard: {
    minHeight: 300,
  },
  heroImage: {
    minHeight: 300,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  image: {
    borderRadius: 24,
  },
  metaDot: {
    color: 'rgba(255,255,255,0.54)',
    fontSize: 12,
    fontWeight: '800',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  metaText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '700',
  },
  primaryButton: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  primaryGradient: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secondaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  summary: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 8,
  },
});
