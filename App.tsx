import React, { useState } from 'react';

import {
  Image,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import LoginScreen from './src/screen/LoginScreen';
import CadastroScreen from './src/screen/CadastroScreen';
import RecuperarSenhaScreen from './src/screen/RecuperarSenhaScreen';
import DashboardScreen from './src/screen/DashboardScreen';
import RegistroClinicoScreen from './src/screen/RegistroClinicoScreen';
import HistoricoClinicoScreen from './src/screen/HistoricoClinicoScreen';
import PerfilScreen from './src/screen/PerfilScreen';
import ConfiguracoesScreen from './src/screen/ConfiguracoesScreen';

const Tab = createBottomTabNavigator();
const navigationRef = createNavigationContainerRef<any>();

type AppTabsProps = {
  temaEscuro: boolean;
  alternarTema: () => void;
  onSair: () => void;
};;

function AppTabs(props: AppTabsProps): React.ReactElement {
  const [modalMenuVisivel, setModalMenuVisivel] = useState<boolean>(false);

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

  const coresMenu = props.temaEscuro
    ? {
      fundo: '#0B1526',
      fundoItem: '#0B1526',
      fundoAtivo: '#12384A',
      borda: '#1D3147',
      texto: '#FFFFFF',
      textoSecundario: '#CBD5E1',
      overlay: 'rgba(0, 0, 0, 0.55)',
    }
    : {
      fundo: '#FFFFFF',
      fundoItem: '#FFFFFF',
      fundoAtivo: '#DDF7F3',
      borda: '#B8C6D6',
      texto: '#102033',
      textoSecundario: '#516173',
      overlay: 'rgba(0, 0, 0, 0.35)',
    };

  function abrirMenu(): void {
    setModalMenuVisivel(true);
  }

  function fecharMenu(): void {
    setModalMenuVisivel(false);
  }
  function sairSistema(): void {
    fecharMenu();
    props.onSair();
  }

  function navegarPara(tela: string): void {
    fecharMenu();

    if (navigationRef.isReady()) {
      navigationRef.navigate(tela);
    }
  }

  function renderizarIcone(
    focused: boolean,
    icone: string
  ): React.ReactElement {
    return (
      <View
        style={[
          focused ? styles.activeBar : styles.inactiveBar,
          {
            borderTopColor: focused ? coresTab.ativo : 'transparent',
          },
        ]}
      >
        <Text
          style={[
            styles.tabIcon,
            { color: focused ? coresTab.ativo : coresTab.inativo },
          ]}
        >
          {icone}
        </Text>
      </View>
    );
  }

  function renderizarBotaoHeader(): React.ReactElement {
    return (
      <TouchableHighlight
        style={[
          styles.botaoHeaderMenu,
          {
            backgroundColor: props.temaEscuro ? '#171A22' : '#FFFFFF',
            borderColor: props.temaEscuro ? '#23415A' : '#B8C6D6',
          },
        ]}
        underlayColor={props.temaEscuro ? '#12384A' : '#DDF7F3'}
        onPress={abrirMenu}
      >
        <Feather name="menu" size={24} color={coresTab.ativo} />
      </TouchableHighlight>
    );
  }

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: route.name !== 'Início',
            headerTitle: '',
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: coresTab.fundo,
              height: 78,
            },
            headerLeft: renderizarBotaoHeader,
            headerLeftContainerStyle: {
              paddingLeft: 18,
            },
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
          })}
        >
          <Tab.Screen
            name="Início"
            options={{
              tabBarIcon: ({ focused }) => renderizarIcone(focused, '⌂'),
            }}
          >
            {() => (
              <DashboardScreen
                temaEscuro={props.temaEscuro}
                alternarTema={props.alternarTema}
                onAbrirMenu={abrirMenu}
                onAbrirPerfil={() => navegarPara('Perfil')}
                onAbrirHistorico={() => navegarPara('Histórico')}
                onAbrirConfiguracoes={() => navegarPara('Configurações')}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="Registro"
            options={{
              tabBarIcon: ({ focused }) => renderizarIcone(focused, '＋'),
            }}
          >
            {() => <RegistroClinicoScreen temaEscuro={props.temaEscuro} />}
          </Tab.Screen>

          <Tab.Screen
            name="Histórico"
            options={{
              tabBarIcon: ({ focused }) => renderizarIcone(focused, '▤'),
            }}
          >
            {() => <HistoricoClinicoScreen temaEscuro={props.temaEscuro} />}
          </Tab.Screen>

          <Tab.Screen
            name="Perfil"
            options={{
              tabBarIcon: ({ focused }) => renderizarIcone(focused, '●'),
            }}
          >
            {() => <PerfilScreen temaEscuro={props.temaEscuro} />}
          </Tab.Screen>

          <Tab.Screen
            name="Configurações"
            options={{
              tabBarButton: () => null,
              tabBarItemStyle: {
                display: 'none',
              },
            }}
          >
            {() => (
              <ConfiguracoesScreen
                temaEscuro={props.temaEscuro}
                alternarTema={props.alternarTema}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>

      <Modal
        visible={modalMenuVisivel}
        transparent={true}
        animationType="fade"
        onRequestClose={fecharMenu}
      >
        <TouchableWithoutFeedback onPress={sairSistema}>
          <View
            style={[
              styles.drawerOverlay,
              { backgroundColor: coresMenu.overlay },
            ]}
          >
            <View
              style={[
                styles.drawerContainer,
                {
                  backgroundColor: coresMenu.fundo,
                  borderRightColor: coresMenu.borda,
                },
              ]}
              onStartShouldSetResponder={() => true}
            >
              <View
                style={[
                  styles.drawerHeader,
                  { borderBottomColor: coresMenu.borda },
                ]}
              >
                <View style={styles.areaMarcaMenu}>
                  <View
                    style={[
                      styles.logoMenuContainer,
                      {
                        backgroundColor: props.temaEscuro
                          ? '#FFFFFF'
                          : '#F2F6FA',
                        borderColor: coresMenu.borda,
                      },
                    ]}
                  >
                    <Image
                      source={require('./assets/Animed_Logo.png')}
                      style={styles.logoMenuImagem}
                    />
                  </View>

                  <Text style={[styles.nomeMenu, { color: coresMenu.texto }]}>
                    Animed
                  </Text>
                </View>

                <TouchableHighlight
                  style={styles.botaoFecharMenu}
                  underlayColor={coresMenu.fundoAtivo}
                  onPress={fecharMenu}
                >
                  <Feather
                    name="x"
                    size={20}
                    color={coresMenu.textoSecundario}
                  />
                </TouchableHighlight>
              </View>

              <View style={styles.drawerItens}>
                <TouchableHighlight
                  style={[
                    styles.itemDrawer,
                    { backgroundColor: coresMenu.fundoAtivo },
                  ]}
                  underlayColor={coresMenu.fundoAtivo}
                  onPress={() => navegarPara('Início')}
                >
                  <View style={styles.conteudoItemDrawer}>
                    <Ionicons
                      name="home-outline"
                      size={18}
                      color="#00C2A8"
                      style={styles.iconeDrawer}
                    />

                    <Text style={[styles.textoDrawer, styles.textoAtivoDrawer]}>
                      Início
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={[
                    styles.itemDrawer,
                    { backgroundColor: coresMenu.fundoItem },
                  ]}
                  underlayColor={coresMenu.fundoAtivo}
                  onPress={() => navegarPara('Perfil')}
                >
                  <View style={styles.conteudoItemDrawer}>
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={coresMenu.textoSecundario}
                      style={styles.iconeDrawer}
                    />

                    <Text
                      style={[styles.textoDrawer, { color: coresMenu.texto }]}
                    >
                      Perfil
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={[
                    styles.itemDrawer,
                    { backgroundColor: coresMenu.fundoItem },
                  ]}
                  underlayColor={coresMenu.fundoAtivo}
                  onPress={() => navegarPara('Histórico')}
                >
                  <View style={styles.conteudoItemDrawer}>
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color={coresMenu.textoSecundario}
                      style={styles.iconeDrawer}
                    />

                    <Text
                      style={[styles.textoDrawer, { color: coresMenu.texto }]}
                    >
                      Histórico
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={[
                    styles.itemDrawer,
                    { backgroundColor: coresMenu.fundoItem },
                  ]}
                  underlayColor={coresMenu.fundoAtivo}
                  onPress={() => navegarPara('Configurações')}
                >
                  <View style={styles.conteudoItemDrawer}>
                    <Ionicons
                      name="settings-outline"
                      size={18}
                      color={coresMenu.textoSecundario}
                      style={styles.iconeDrawer}
                    />

                    <Text
                      style={[styles.textoDrawer, { color: coresMenu.texto }]}
                    >
                      Configurações
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>

              <View
                style={[
                  styles.drawerRodape,
                  { borderTopColor: coresMenu.borda },
                ]}
              >
                <View style={styles.linhaTemaMenu}>
                  <View style={styles.conteudoItemDrawer}>
                    <Feather
                      name="sun"
                      size={17}
                      color={coresMenu.textoSecundario}
                      style={styles.iconeDrawer}
                    />

                    <Text
                      style={[styles.textoDrawer, { color: coresMenu.texto }]}
                    >
                      Tema Claro
                    </Text>
                  </View>

                  <Switch
                    value={!props.temaEscuro}
                    onValueChange={props.alternarTema}
                    trackColor={{ false: '#31445F', true: '#008B7A' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <TouchableHighlight
                  style={styles.itemSair}
                  underlayColor={props.temaEscuro ? '#27151A' : '#FCE8EA'}
                  onPress={fecharMenu}
                >
                  <View style={styles.conteudoItemDrawer}>
                    <MaterialCommunityIcons
                      name="logout"
                      size={18}
                      color="#FF5A6A"
                      style={styles.iconeDrawer}
                    />

                    <Text style={styles.textoSair}>Sair</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

type TelaAutenticacao = 'login' | 'cadastro' | 'recuperarSenha';

export default function App(): React.ReactElement {
  const [temaEscuro, setTemaEscuro] = useState<boolean>(true);
  const [usuarioLogado, setUsuarioLogado] = useState<boolean>(false);
  const [telaAutenticacao, setTelaAutenticacao] =
    useState<TelaAutenticacao>('login');

  function alternarTema(): void {
    setTemaEscuro((valorAnterior) => !valorAnterior);
  }

  function entrarNoSistema(): void {
    setUsuarioLogado(true);
  }

  function sairDoSistema(): void {
    setUsuarioLogado(false);
    setTelaAutenticacao('login');
  }

  function abrirCadastro(): void {
    setTelaAutenticacao('cadastro');
  }

  function abrirRecuperarSenha(): void {
    setTelaAutenticacao('recuperarSenha');
  }

  function voltarParaLogin(): void {
    setTelaAutenticacao('login');
  }

  if (usuarioLogado === false) {
    if (telaAutenticacao === 'cadastro') {
      return <CadastroScreen onVoltarLogin={voltarParaLogin} />;
    }

    if (telaAutenticacao === 'recuperarSenha') {
      return <RecuperarSenhaScreen onVoltarLogin={voltarParaLogin} />;
    }

    return (
      <LoginScreen
        onLogin={entrarNoSistema}
        onCadastro={abrirCadastro}
        onRecuperarSenha={abrirRecuperarSenha}
      />
    );
  }

  return (
    <AppTabs
      temaEscuro={temaEscuro}
      alternarTema={alternarTema}
      onSair={sairDoSistema}
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
    paddingTop: 4,
    width: 48,
    alignItems: 'center',
  },
  inactiveBar: {
    borderTopWidth: 3,
    paddingTop: 4,
    width: 48,
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 20,
  },
  botaoHeaderMenu: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerOverlay: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  drawerContainer: {
    width: '62%',
    height: '100%',
    borderRightWidth: 1,
  },
  drawerHeader: {
    height: 66,
    paddingLeft: 20,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  areaMarcaMenu: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMenuContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoMenuImagem: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  nomeMenu: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoFecharMenu: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerItens: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  itemDrawer: {
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    paddingLeft: 12,
    marginBottom: 8,
  },
  conteudoItemDrawer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconeDrawer: {
    marginRight: 12,
  },
  textoDrawer: {
    fontSize: 14,
    fontWeight: '500',
  },
  textoAtivoDrawer: {
    color: '#00C2A8',
    fontWeight: 'bold',
  },
  drawerRodape: {
    marginTop: 'auto',
    paddingTop: 14,
    paddingBottom: 22,
    paddingLeft: 18,
    paddingRight: 18,
    borderTopWidth: 1,
  },
  linhaTemaMenu: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemSair: {
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  textoSair: {
    color: '#FF5A6A',
    fontSize: 14,
    fontWeight: 'bold',
  },
});