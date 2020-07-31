import React from 'react';
import { AppLoading } from 'expo';
import AsyncStorage from '@react-native-community/async-storage';

export interface Site {
  wsUri: string;
  name: string;
}

interface SiteContextValue {
  loading: boolean;
  sites: Site[];
  activeSite?: Site;
  setActiveSite(site: Site): void;
  addSite(site: Site): void;
  removeSite(wsUri: string): void;
}

export const SitesContext = React.createContext<SiteContextValue>({
  loading: true,
  sites: [],
  activeSite: undefined,
  setActiveSite: () => {},
  addSite: () => {},
  removeSite: () => {}
});

export const SitesProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [sites, setSites] = React.useState<Site[]>([]);
  const [activeSite, setActiveSite] = React.useState<Site | undefined>();

  const setDefaultSite = async () => {
    const savedSites = await AsyncStorage.getItem('sites');
    if (savedSites) {
      const parsedSites = JSON.parse(savedSites);
      setActiveSite(parsedSites[0]);
    }
  };

  const loadActiveSite = async () => {
    const savedActiveSite = await AsyncStorage.getItem('activeSite');
    if (savedActiveSite) {
      const parsedActiveSite = JSON.parse(savedActiveSite);
      setActiveSite(parsedActiveSite);
    } else {
      setDefaultSite();
    }
  };

  const loadSites = async () => {
    const savedSites = await AsyncStorage.getItem('sites');
    if (savedSites) {
      const parsedSites = JSON.parse(savedSites);
      setSites(parsedSites);
    } else {
      setSites([]);
    }
  };

  React.useEffect(() => {
    (async () => {
      await Promise.all([loadActiveSite(), loadSites()]);
      setLoading(false);
    })();
  }, []);

  React.useEffect(() => {
    if (activeSite) {
      AsyncStorage.setItem('activeSite', JSON.stringify(activeSite));
    } else {
      setDefaultSite();
    }
  }, [activeSite]);

  React.useEffect(() => {
    AsyncStorage.setItem('sites', JSON.stringify(sites));
  }, [sites]);

  React.useEffect(() => {
    console.log('activeSite changed: ', activeSite);
  }, [activeSite]);

  const addSite = (site: Site) => {
    setSites([...sites, site]);
    setActiveSite(site);
  };

  const removeSite = (wsUri: string) => {
    setSites(sites.filter((site) => site.wsUri !== wsUri));
  };

  return (
    <SitesContext.Provider
      value={{
        loading,
        sites,
        activeSite,
        setActiveSite,
        addSite,
        removeSite
      }}
    >
      {loading ? <AppLoading /> : children}
    </SitesContext.Provider>
  );
};
