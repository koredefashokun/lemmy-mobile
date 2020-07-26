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
        ListHeaderComponent={
          <View style={{ padding: 20 }}>
            <Text style={styles.header}>Your sites</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.row,
              item.wsUri === activeSite?.wsUri
                ? { backgroundColor: '#444444' }
                : {}
            ]}
          >
            <View
              style={[
                styles.rowTile,
                item.wsUri === activeSite?.wsUri
                  ? { borderWidth: 4, borderColor: '#DEDEDE' }
                  : {}
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
    backgroundColor: '#222222'
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DEDEDE'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: 50,
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  rowTile: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowTileText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DEDEDE'
  },
  rowText: {
    fontSize: 17,
    color: '#DEDEDE'
  }
});

export default SiteSelector;
