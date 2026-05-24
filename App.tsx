import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './src/screen/LoginScreen';
import CadastroScreen from './src/screen/CadastroScreen';
import RecuperarSenhaScreen from './src/screen/RecuperarSenhaScreen';

import DashboardScreen from './src/screen/DashboardScreen';
import RegistroClinicoScreen from './src/screen/RegistroClinicoScreen';
import HistoricoClinicoScreen from './src/screen/HistoricoClinicoScreen';
import PerfilScreen from './src/screen/PerfilScreen';

const Tab = createBottomTabNavigator();

function AppTabs(): React.ReactElement {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#8A96A8',
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Início"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ focused }: any) => (
              <View style={focused ? styles.activeBar : styles.inactiveBar}>
                <Text style={styles.tabIcon}>⌂</Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Registro"
          component={RegistroClinicoScreen}
          options={{
            tabBarIcon: ({ focused }: any) => (
              <View style={focused ? styles.activeBar : styles.inactiveBar}>
                <Text style={styles.tabIcon}>＋</Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Histórico"
          component={HistoricoClinicoScreen}
          options={{
            tabBarIcon: ({ focused }: any) => (
              <View style={focused ? styles.activeBar : styles.inactiveBar}>
                <Text style={styles.tabIcon}>▤</Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{
            tabBarIcon: ({ focused }: any) => (
              <View style={focused ? styles.activeBar : styles.inactiveBar}>
                <Text style={styles.tabIcon}>●</Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App(): React.ReactElement {
  const [logado, setLogado] = useState<boolean>(false);
  const [telaAuth, setTelaAuth] = useState<string>('login');

  if (logado === true) {
    return <AppTabs />;
  }

  if (telaAuth === 'cadastro') {
    return (
      <CadastroScreen
        onVoltarLogin={() => setTelaAuth('login')}
        onRecuperarSenha={() => setTelaAuth('recuperarSenha')}
      />
    );
  }

  if (telaAuth === 'recuperarSenha') {
    return (
      <RecuperarSenhaScreen
        onVoltarLogin={() => setTelaAuth('login')}
        onCadastro={() => setTelaAuth('cadastro')}
      />
    );
  }

  return (
    <LoginScreen
      onLogin={() => setLogado(true)}
      onCadastro={() => setTelaAuth('cadastro')}
      onRecuperarSenha={() => setTelaAuth('recuperarSenha')}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#07111F',
    borderTopColor: '#1C2B3A',
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
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
    color: '#FFFFFF',
    fontSize: 20,
  },
});