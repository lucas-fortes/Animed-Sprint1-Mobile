import React, { useCallback, useState } from 'react';

import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
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

type DashboardProps = {
  temaEscuro?: boolean;
  alternarTema?: () => void;
  onAbrirMenu?: () => void;
  onAbrirPerfil?: () => void;
  onAbrirHistorico?: () => void;
  onAbrirConfiguracoes?: () => void;
};

const CHAVE_REGISTROS = '@animed:registrosClinicos';

export default function DashboardScreen(
  props: DashboardProps
): React.ReactElement {
  const [atendimentosDia, setAtendimentosDia] = useState<Atendimento[]>([]);

  const temaEscuro = props.temaEscuro ?? true;

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

  const coresMenu = temaEscuro
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

  function alternarTema(): void {
    if (typeof props.alternarTema === 'function') {
      props.alternarTema();
    }
  }

  function abrirMenu(): void {
  if (typeof props.onAbrirMenu === 'function') {
    props.onAbrirMenu();
  }
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

    if (urgencia === 'Emergência') {
      return '#8B0000';
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
          <Feather name="menu" size={24} color={cores.texto} />
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
          <Ionicons
            name="notifications-outline"
            size={24}
            color={cores.texto}
          />
        </TouchableHighlight>
      </View>

      <View style={styles.areaTitulo}>
        <View style={styles.linhaTituloCentral}>
          <Image
            source={require('../../assets/Animed_Logo.png')}
            style={styles.logo}
          />

          <Text style={[styles.titulo, { color: cores.texto }]}>
            Dashboard
          </Text>
        </View>

        <Text style={[styles.subtitulo, { color: cores.textoSecundario }]}>
          Resumo das Atividades Diárias
        </Text>
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

      {atendimentosDia.length === 0 ? (
        <View
          style={[
            styles.cardVazio,
            {
              backgroundColor: cores.card,
              borderColor: cores.borda,
            },
          ]}
        >
          <Text style={[styles.textoVazio, { color: cores.textoSecundario }]}>
            Nenhum atendimento cadastrado para hoje.
          </Text>
        </View>
      ) : (
        atendimentosDia.map((atendimento) => (
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
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={cores.textoSecundario}
                  style={styles.iconeHorario}
                />

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
                <Feather name="chevron-right" size={28} color={cores.texto} />
              </View>
            </View>
          </TouchableHighlight>
        ))
      )}
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  linhaTituloCentral: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: 'cover',
    marginRight: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 15,
    marginTop: 2,
    textAlign: 'center',
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
  cardVazio: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  textoVazio: {
    fontSize: 14,
    textAlign: 'center',
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
  drawerHeader: {
    height: 66,
    paddingLeft: 20,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
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