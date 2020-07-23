import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NoSite = () => {
  const { navigate } = useNavigation();

  React.useEffect(() => {
    navigate('SiteSetup');
  }, []);

  return <View style={{ flex: 1 }} />;
};

export default NoSite;
