import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from './src/screen/DashboardScreen';
import RegistroClinicoScreen from './src/screen/RegistroClinicoScreen';
import HistoricoClinicoScreen from './src/screen/HistoricoClinicoScreen';
import PerfilScreen from './src/screen/PerfilScreen';

const Tab = createBottomTabNavigator();

type AppTabsProps = {
  temaEscuro: boolean;
  alternarTema: () => void;
};

function AppTabs(props: AppTabsProps): React.ReactElement {
  const coresTab = props.temaEscuro
    ? {
        fundo: '#07111F',
        borda: '#1C2B3A',
        ativo: '#FFFFFF',
        inativo: '#8A96A8',
      }
    : {
        fundo: '#FFFFFF',
        borda: '#B8C6D6',
        ativo: '#008B7A',
        inativo: '#6B7A8C',
      };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: coresTab.fundo,
              borderTopColor: coresTab.borda,
            },
          ],
          tabBarActiveTintColor: coresTab.ativo,
          tabBarInactiveTintColor: coresTab.inativo,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Início"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={focused ? styles.activeBar : styles.inactiveBar}>
                <Text
                  style={[
                    styles.tabIcon,
                    { color: focused ? coresTab.ativo : coresTab.inativo },
                  ]}
                >
                  ⌂
                </Text>
              </View>
            ),
          }}
        >
          {() => (
            <DashboardScreen
              temaEscuro={props.temaEscuro}
              alternarTema={props.alternarTema}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Registro"
          component={RegistroClinicoScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={focused ? styles.activeBar : styles.inactiveBar}>
                <Text
                  style={[
                    styles.tabIcon,
                    { color: focused ? coresTab.ativo : coresTab.inativo },
                  ]}
                >
                  ＋
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Histórico"
          component={HistoricoClinicoScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={focused ? styles.activeBar : styles.inactiveBar}>
                <Text
                  style={[
                    styles.tabIcon,
                    { color: focused ? coresTab.ativo : coresTab.inativo },
                  ]}
                >
                  ▤
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={focused ? styles.activeBar : styles.inactiveBar}>
                <Text
                  style={[
                    styles.tabIcon,
                    { color: focused ? coresTab.ativo : coresTab.inativo },
                  ]}
                >
                  ●
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App(): React.ReactElement {
  const [temaEscuro, setTemaEscuro] = useState<boolean>(true);

  function alternarTema(): void {
    setTemaEscuro((valorAnterior) => !valorAnterior);
  }

  return (
    <AppTabs
      temaEscuro={temaEscuro}
      alternarTema={alternarTema}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 88,
    paddingBottom: 26,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeBar: {
    borderTopWidth: 3,
    borderTopColor: '#FFFFFF',
    paddingTop: 4,
    width: 48,
    alignItems: 'center',
  },
  inactiveBar: {
    borderTopWidth: 3,
    borderTopColor: 'transparent',
    paddingTop: 4,
    width: 48,
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 20,
  },
});