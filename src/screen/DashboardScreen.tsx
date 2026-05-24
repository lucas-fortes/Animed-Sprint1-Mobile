import React, { useCallback, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { RegistroClinico } from '../model/RegistroClinico';
type Atendimento = {
  id: number;
  horario: string;
  animal: string;
  motivo: string;
  tutor: string;
  urgencia: string;
};

const CHAVE_REGISTROS = '@animed:registrosClinicos';

export default function DashboardScreen(): React.ReactElement {
  const [modalMenuVisivel, setModalMenuVisivel] = useState<boolean>(false);
  const [temaEscuro, setTemaEscuro] = useState<boolean>(true);
  const [atendimentosDia, setAtendimentosDia] = useState<Atendimento[]>([]);

  const totalAtendimentosHoje = atendimentosDia.length;
  const totalOcorrenciasMes = atendimentosDia.length;

  const cores = temaEscuro
    ? {
      fundo: '#07111F',
      card: '#172232',
      cardSecundario: '#171A22',
      borda: '#23415A',
      texto: '#FFFFFF',
      textoSecundario: '#8A96A8',
      destaque: '#008B7A',
      destaqueClaro: '#00C2A8',
      perigo: '#D62828',
      alerta: '#D99000',
      baixo: '#00A693',
    }
    : {
      fundo: '#F2F6FA',
      card: '#FFFFFF',
      cardSecundario: '#EAF2F7',
      borda: '#B8C6D6',
      texto: '#102033',
      textoSecundario: '#6B7A8C',
      destaque: '#008B7A',
      destaqueClaro: '#00A693',
      perigo: '#C62828',
      alerta: '#B87500',
      baixo: '#008B7A',
    };
   function obterDataHoje(): string {
    const hoje = new Date();

    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = String(hoje.getFullYear());

    return dia + '/' + mes + '/' + ano;
  }

  async function carregarRegistrosDoDia(): Promise<void> {
    try {
      const dadosSalvos = await AsyncStorage.getItem(CHAVE_REGISTROS);

      if (dadosSalvos === null) {
        setAtendimentosDia([]);
        return;
      }

      const registros: RegistroClinico[] = JSON.parse(dadosSalvos);
      const dataHoje = obterDataHoje();

      const registrosDeHoje = registros.filter(
        (registro) => registro.dataRetorno === dataHoje
      );

      const atendimentosConvertidos: Atendimento[] = registrosDeHoje.map(
        (registro, index) => {
          return {
            id: registro.id,
            horario: String(index + 1).padStart(2, '0') + ':00',
            animal: registro.nomeAnimal,
            motivo: registro.observacoes,
            tutor: registro.nomeTutor,
            urgencia: registro.urgencia,
          };
        }
      );

      setAtendimentosDia(atendimentosConvertidos);
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível carregar os registros clínicos salvos.'
      );
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarRegistrosDoDia();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      carregarRegistrosDoDia();
    }, [])
  );

  function alternarTema(): void {
    setTemaEscuro(!temaEscuro);
  }

  function abrirMenu(): void {
    setModalMenuVisivel(true);
  }

  function fecharMenu(): void {
    setModalMenuVisivel(false);
  }

  function acessarInicio(): void {
    fecharMenu();
  }

  function acessarPerfil(): void {
    fecharMenu();

    Alert.alert('Perfil', 'Use a aba Perfil no menu inferior.');
  }

  function acessarHistorico(): void {
    fecharMenu();

    Alert.alert('Histórico', 'Use a aba Histórico no menu inferior.');
  }

  function acessarConfiguracoes(): void {
    fecharMenu();

    Alert.alert(
      'Configurações',
      'Tela de configurações será implementada depois.'
    );
  }

  function sairSistema(): void {
    fecharMenu();

    Alert.alert(
      'Sair',
      'A função de logout será implementada com autenticação.'
    );
  }

  function verTodosAtendimentos(): void {
    Alert.alert(
      'Agenda do Dia',
      'Existem ' +
      totalAtendimentosHoje +
      ' atendimentos cadastrados para hoje.'
    );
  }

  function visualizarAtendimento(atendimento: Atendimento): void {
    Alert.alert(
      atendimento.animal,
      'Horário: ' +
      atendimento.horario +
      '\nMotivo: ' +
      atendimento.motivo +
      '\nTutor: ' +
      atendimento.tutor +
      '\nUrgência: ' +
      atendimento.urgencia
    );
  }

  function corUrgencia(urgencia: string): string {
    if (urgencia === 'Alta') {
      return cores.perigo;
    }

    if (urgencia === 'Média') {
      return cores.alerta;
    }

    return cores.baixo;
  }

  return (
    <ScrollView
      style={{ backgroundColor: cores.fundo }}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: cores.fundo },
      ]}
    >
      <View style={styles.topo}>
        <TouchableHighlight
          style={[
            styles.botaoCircular,
            {
              backgroundColor: cores.cardSecundario,
              borderColor: cores.borda,
            },
          ]}
          underlayColor={cores.destaque}
          onPress={abrirMenu}
        >
          <Text style={[styles.iconeTopo, { color: cores.texto }]}>☰</Text>
        </TouchableHighlight>

        <View style={styles.areaUsuario}>
          <Text style={[styles.textoPequeno, { color: cores.textoSecundario }]}>
            Bom dia,
          </Text>

          <Text style={[styles.nomeUsuario, { color: cores.texto }]}>
            Dr. Roberto
          </Text>
        </View>

        <TouchableHighlight
          style={[
            styles.botaoCircular,
            {
              backgroundColor: cores.cardSecundario,
              borderColor: cores.borda,
            },
          ]}
          underlayColor={cores.destaque}
          onPress={() => Alert.alert('Notificações', 'Nenhuma notificação nova.')}
        >
          <Text style={[styles.iconeTopo, { color: cores.texto }]}>🔔</Text>
        </TouchableHighlight>
      </View>

      <View style={styles.areaTitulo}>
        <Image
          source={require('../../assets/Animed_Logo.png')}
          style={styles.logo}
        />

        <View style={styles.areaTextoTitulo}>
          <Text style={[styles.titulo, { color: cores.texto }]}>
            Dashboard
          </Text>

          <Text style={[styles.subtitulo, { color: cores.textoSecundario }]}>
            Resumo das suas atividades hoje
          </Text>
        </View>
      </View>

      <View style={styles.areaCards}>
        <View
          style={[
            styles.cardResumo,
            {
              backgroundColor: cores.destaque,
              borderColor: cores.destaqueClaro,
            },
          ]}
        >
          <Text style={styles.numeroResumo}>{totalAtendimentosHoje}</Text>

          <Text style={styles.textoResumo}>ATENDIMENTOS HOJE</Text>
        </View>

        <View
          style={[
            styles.cardResumo,
            {
              backgroundColor: cores.card,
              borderColor: cores.borda,
            },
          ]}
        >
          <Text style={[styles.numeroResumo, { color: cores.texto }]}>
            {totalOcorrenciasMes}
          </Text>

          <Text style={[styles.textoResumo, { color: cores.texto }]}>
            OCORRÊNCIAS NO MÊS
          </Text>
        </View>
      </View>

      <View style={styles.cabecalhoSecao}>
        <Text style={[styles.tituloSecao, { color: cores.texto }]}>
          Agenda do Dia
        </Text>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={verTodosAtendimentos}
        >
          <Text style={[styles.linkSecao, { color: cores.destaqueClaro }]}>
            Ver tudo
          </Text>
        </TouchableHighlight>
      </View>

      {atendimentosDia.map((atendimento) => (
        <TouchableHighlight
          key={atendimento.id}
          style={[
            styles.cardAtendimento,
            {
              backgroundColor: cores.card,
              borderColor: cores.borda,
            },
          ]}
          underlayColor={cores.cardSecundario}
          onPress={() => visualizarAtendimento(atendimento)}
        >
          <View style={styles.conteudoAtendimento}>
            <View
              style={[
                styles.marcadorUrgencia,
                { backgroundColor: corUrgencia(atendimento.urgencia) },
              ]}
            />

            <View
              style={[
                styles.caixaHorario,
                {
                  backgroundColor: cores.cardSecundario,
                  borderColor: cores.borda,
                },
              ]}
            >
              <Text
                style={[
                  styles.iconeHorario,
                  { color: cores.textoSecundario },
                ]}
              >
                ◷
              </Text>

              <Text style={[styles.horario, { color: cores.texto }]}>
                {atendimento.horario}
              </Text>
            </View>

            <View style={styles.infoAtendimento}>
              <View style={styles.linhaAnimal}>
                <Text style={[styles.nomeAnimal, { color: cores.texto }]}>
                  {atendimento.animal}
                </Text>

                <View
                  style={[
                    styles.tagUrgencia,
                    {
                      backgroundColor: corUrgencia(atendimento.urgencia),
                    },
                  ]}
                >
                  <Text style={styles.textoTagUrgencia}>
                    {atendimento.urgencia.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={[styles.motivo, { color: cores.texto }]}>
                {atendimento.motivo}
              </Text>

              <Text style={[styles.tutor, { color: cores.textoSecundario }]}>
                Tutor: {atendimento.tutor}
              </Text>
            </View>

            <View style={styles.areaSeta}>
              <Text style={[styles.seta, { color: cores.texto }]}>›</Text>
            </View>
          </View>
        </TouchableHighlight>
      ))}

      <Modal
        visible={modalMenuVisivel}
        transparent={true}
        animationType="fade"
        onRequestClose={fecharMenu}
      >
        <TouchableWithoutFeedback onPress={fecharMenu}>
          <View style={styles.drawerOverlay}>
            <View
              style={styles.drawerContainer}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.drawerHeader}>
                <View style={styles.areaMarcaMenu}>
                  <View style={styles.logoMenu}>
                    <Text style={styles.textoLogoMenu}>VM</Text>
                  </View>

                  <Text style={styles.nomeMenu}>VetMobile</Text>
                </View>

                <TouchableHighlight
                  style={styles.botaoFecharMenu}
                  underlayColor="#142638"
                  onPress={fecharMenu}
                >
                  <Text style={styles.textoFecharMenu}>×</Text>
                </TouchableHighlight>
              </View>

              <View style={styles.drawerItens}>
                <TouchableHighlight
                  style={[styles.itemDrawer, styles.itemDrawerAtivo]}
                  underlayColor="#12384A"
                  onPress={acessarInicio}
                >
                  <View style={styles.conteudoItemDrawer}>
                    <Text style={[styles.iconeDrawer, styles.textoAtivoDrawer]}>
                      ⌂
                    </Text>

                    <Text style={[styles.textoDrawer, styles.textoAtivoDrawer]}>
                      Início
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.itemDrawer}
                  underlayColor="#142638"
                  onPress={acessarPerfil}
                >
                  <View style={styles.conteudoItemDrawer}>
                    <Text style={styles.iconeDrawer}>♙</Text>

                    <Text style={styles.textoDrawer}>Perfil</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.itemDrawer}
                  underlayColor="#142638"
                  onPress={acessarHistorico}
                >
                  <View style={styles.conteudoItemDrawer}>
                    <Text style={styles.iconeDrawer}>◷</Text>

                    <Text style={styles.textoDrawer}>Histórico</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.itemDrawer}
                  underlayColor="#142638"
                  onPress={acessarConfiguracoes}
                >
                  <View style={styles.conteudoItemDrawer}>
                    <Text style={styles.iconeDrawer}>⚙</Text>

                    <Text style={styles.textoDrawer}>Configurações</Text>
                  </View>
                </TouchableHighlight>
              </View>

              <View style={styles.drawerRodape}>
                <View style={styles.linhaTemaMenu}>
                  <View style={styles.conteudoItemDrawer}>
                    <Text style={styles.iconeDrawer}>☼</Text>

                    <Text style={styles.textoDrawer}>Tema Claro</Text>
                  </View>

                  <Switch
                    value={!temaEscuro}
                    onValueChange={() => alternarTema()}
                    trackColor={{ false: '#31445F', true: '#008B7A' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <TouchableHighlight
                  style={styles.itemSair}
                  underlayColor="#27151A"
                  onPress={sairSistema}
                >
                  <View style={styles.conteudoItemDrawer}>
                    <Text style={styles.iconeSair}>↪</Text>

                    <Text style={styles.textoSair}>Sair</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 54,
    paddingBottom: 110,
  },
  topo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  botaoCircular: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeTopo: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  areaUsuario: {
    alignItems: 'center',
  },
  textoPequeno: {
    fontSize: 12,
  },
  nomeUsuario: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  areaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },
  areaTextoTitulo: {
    flex: 1,
  },
  logo: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginRight: 12,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 13,
    marginTop: 4,
  },
  areaCards: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  cardResumo: {
    flex: 1,
    minHeight: 86,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'center',
    marginRight: 10,
  },
  numeroResumo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  textoResumo: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  cabecalhoSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkSecao: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  cardAtendimento: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  conteudoAtendimento: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marcadorUrgencia: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  caixaHorario: {
    width: 70,
    height: 76,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconeHorario: {
    fontSize: 14,
    marginBottom: 4,
  },
  horario: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  infoAtendimento: {
    flex: 1,
  },
  linhaAnimal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nomeAnimal: {
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 8,
  },
  tagUrgencia: {
    borderRadius: 12,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 3,
    paddingBottom: 3,
  },
  textoTagUrgencia: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  motivo: {
    fontSize: 13,
    marginBottom: 5,
  },
  tutor: {
    fontSize: 12,
  },
  areaSeta: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seta: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  drawerContainer: {
    width: '62%',
    height: '100%',
    backgroundColor: '#0B1526',
    borderRightWidth: 1,
    borderRightColor: '#1D3147',
  },
  drawerHeader: {
    height: 66,
    paddingLeft: 20,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1D3147',
  },
  areaMarcaMenu: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMenu: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#008B7A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textoLogoMenu: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  nomeMenu: {
    color: '#FFFFFF',
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
  textoFecharMenu: {
    color: '#8A96A8',
    fontSize: 26,
    lineHeight: 28,
  },
  drawerItens: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  itemDrawer: {
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    paddingLeft: 12,
    marginBottom: 6,
  },
  itemDrawerAtivo: {
    backgroundColor: '#12384A',
  },
  conteudoItemDrawer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconeDrawer: {
    width: 26,
    color: '#CBD5E1',
    fontSize: 17,
    marginRight: 8,
  },
  textoDrawer: {
    color: '#FFFFFF',
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
    borderTopColor: '#1D3147',
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
  iconeSair: {
    width: 26,
    color: '#FF5A6A',
    fontSize: 18,
    marginRight: 8,
  },
  textoSair: {
    color: '#FF5A6A',
    fontSize: 14,
    fontWeight: 'bold',
  },
});