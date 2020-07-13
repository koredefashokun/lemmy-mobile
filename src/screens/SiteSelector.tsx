import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SitesContext } from '../contexts/SitesContext';

const SiteSelector = () => {
  const { sites, activeSite } = React.useContext(SitesContext);

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(site) => site.wsUri}
        data={sites}
        ListHeaderComponent={<Text style={styles.header}>Your sites</Text>}
        renderItem={({ item }) => (
          <View
            style={[
              styles.row,
              item.wsUri === activeSite?.wsUri
                ? { backgroundColor: '#444444' }
                : {},
            ]}
          >
            <View
              style={[
                styles.rowTile,
                item.wsUri === activeSite?.wsUri
                  ? { borderWidth: 4, borderColor: '#DEDEDE' }
                  : {},
              ]}
            >
              <Text style={styles.rowTileText}>{item.name[0]}</Text>
            </View>
            <Text style={styles.rowText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 32,
    color: '#DEDEDE',
  },
  row: {
    flexDirection: 'row',
    height: 50,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  rowTile: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
  rowTileText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#DEDEDE',
  },
  rowText: {
    fontSize: 17,
    color: '#DEDEDE',
  },
});

export default SiteSelector;
