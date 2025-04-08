import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Typography, H1, H2, H3, Body1, Body2, Caption } from '@/components/ui/Typography';

export default function FontExample() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <H1>Jost Heading 1</H1>
        <H2>Jost Heading 2</H2>
        <H3>Jost Heading 3</H3>
        <Body1>This is Body1 text in Jost (default)</Body1>
        <Body2>This is Body2 text in Jost (default)</Body2>
        <Caption>This is Caption text in Jost (default)</Caption>
      </View>

      <View style={styles.section}>
        <H1 font="montserrat">Montserrat Heading 1</H1>
        <H2 font="montserrat">Montserrat Heading 2</H2>
        <H3 font="montserrat">Montserrat Heading 3</H3>
        <Body1 font="montserrat">This is Body1 text in Montserrat</Body1>
        <Body2 font="montserrat">This is Body2 text in Montserrat</Body2>
        <Caption font="montserrat">This is Caption text in Montserrat</Caption>
      </View>

      <View style={styles.section}>
        <Typography variant="h4" font="jost" weight="regular">Jost Regular</Typography>
        <Typography variant="h4" font="jost" weight="medium">Jost Medium</Typography>
        <Typography variant="h4" font="jost" weight="bold">Jost Bold</Typography>
      </View>

      <View style={styles.section}>
        <Typography variant="h4" font="montserrat" weight="regular">Montserrat Regular</Typography>
        <Typography variant="h4" font="montserrat" weight="medium">Montserrat Medium</Typography>
        <Typography variant="h4" font="montserrat" weight="bold">Montserrat Bold</Typography>
      </View>

      <View style={styles.section}>
        <Typography variant="body1" color="#8A3FFC">Custom Color Text</Typography>
        <Typography variant="body1" style={{ textDecorationLine: 'underline' }}>
          Custom Styled Text
        </Typography>
      </View>

      {/* Example of using with Tailwind/NativeWind */}
      <View style={styles.section}>
        <Typography variant="h5" className="text-primary font-bold">
          Using with Tailwind Classes
        </Typography>
        <Typography variant="body1" className="font-montserrat text-themeGrayDark">
          This text uses Montserrat via Tailwind class
        </Typography>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
  },
});
