import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type Atendimento = {
  id: number;
  horario: string;
  animal: string;
  motivo: string;
  tutor: string;
  urgencia: string;
};

const ATENDIMENTOS_DIA: Atendimento[] = [
  {
    id: 1,
    horario: '09:00',
    animal: 'Rex',
    motivo: 'Check-up de rotina',
    tutor: 'Ana Silva',
    urgencia: 'Baixa',
  },
  {
    id: 2,
    horario: '10:30',
    animal: 'Thor',
    motivo: 'Retorno pós-cirúrgico',
    tutor: 'Carlos Mendes',
    urgencia: 'Média',
  },
  {
    id: 3,
    horario: '13:00',
    animal: 'Mimosa',
    motivo: 'Emergência respiratória',
    tutor: 'Fazenda Esperança',
    urgencia: 'Alta',
  },
  {
    id: 4,
    horario: '15:00',
    animal: 'Luna',
    motivo: 'Vacinação V4',
    tutor: 'Mariana Costa',
    urgencia: 'Baixa',
  },
];

export default function DashboardScreen(): React.ReactElement {
  const [modalMenuVisivel, setModalMenuVisivel] = useState<boolean>(false);
  const [temaEscuro, setTemaEscuro] = useState<boolean>(true);

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
        overlay: 'rgba(0, 0, 0, 0.60)',
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
        overlay: 'rgba(0, 0, 0, 0.35)',
      };

  function alternarTema(): void {
    setTemaEscuro(!temaEscuro);
  }

  function abrirMenu(): void {
    setModalMenuVisivel(true);
  }

  function fecharMenu(): void {
    setModalMenuVisivel(false);
  }

  function abrirConfiguracoes(): void {
    fecharMenu();

    Alert.alert(
      'Configurações',
      'A tela de configurações será conectada posteriormente.'
    );
  }

  function abrirRelatorios(): void {
    fecharMenu();

    Alert.alert(
      'Relatórios',
      'A área de relatórios será implementada posteriormente.'
    );
  }

  function abrirPerfil(): void {
    fecharMenu();

    Alert.alert(
      'Perfil',
      'Use a aba Perfil no menu inferior para acessar os dados do veterinário.'
    );
  }

  function verTodosAtendimentos(): void {
    Alert.alert(
      'Agenda do Dia',
      'Esta versão inicial possui dados fictícios. A integração real será feita depois.'
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

        <View>
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
          <Text style={styles.numeroResumo}>12</Text>
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
          <Text style={[styles.numeroResumo, { color: cores.texto }]}>48</Text>
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

      {ATENDIMENTOS_DIA.map((atendimento) => (
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
              <Text style={[styles.iconeHorario, { color: cores.textoSecundario }]}>
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
          <View style={[styles.modalOverlay, { backgroundColor: cores.overlay }]}>
            <View
              style={[
                styles.menuLateral,
                {
                  backgroundColor: cores.card,
                  borderColor: cores.borda,
                },
              ]}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.menuHeader}>
                <Text style={[styles.menuTitulo, { color: cores.texto }]}>
                  Menu
                </Text>

                <TouchableHighlight
                  style={[
                    styles.botaoFechar,
                    {
                      backgroundColor: cores.cardSecundario,
                      borderColor: cores.borda,
                    },
                  ]}
                  underlayColor={cores.destaque}
                  onPress={fecharMenu}
                >
                  <Text style={[styles.textoFechar, { color: cores.texto }]}>
                    ×
                  </Text>
                </TouchableHighlight>
              </View>

              <TouchableHighlight
                style={[
                  styles.itemMenu,
                  {
                    backgroundColor: cores.cardSecundario,
                    borderColor: cores.borda,
                  },
                ]}
                underlayColor={cores.destaque}
                onPress={alternarTema}
              >
                <Text style={[styles.textoItemMenu, { color: cores.texto }]}>
                  {temaEscuro ? '☀ Tema claro' : '☾ Tema escuro'}
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={[
                  styles.itemMenu,
                  {
                    backgroundColor: cores.cardSecundario,
                    borderColor: cores.borda,
                  },
                ]}
                underlayColor={cores.destaque}
                onPress={abrirConfiguracoes}
              >
                <Text style={[styles.textoItemMenu, { color: cores.texto }]}>
                  ⚙ Configurações
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={[
                  styles.itemMenu,
                  {
                    backgroundColor: cores.cardSecundario,
                    borderColor: cores.borda,
                  },
                ]}
                underlayColor={cores.destaque}
                onPress={abrirRelatorios}
              >
                <Text style={[styles.textoItemMenu, { color: cores.texto }]}>
                  📄 Relatórios
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={[
                  styles.itemMenu,
                  {
                    backgroundColor: cores.cardSecundario,
                    borderColor: cores.borda,
                  },
                ]}
                underlayColor={cores.destaque}
                onPress={abrirPerfil}
              >
                <Text style={[styles.textoItemMenu, { color: cores.texto }]}>
                  👤 Perfil
                </Text>
              </TouchableHighlight>
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
  modalOverlay: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  menuLateral: {
    width: '74%',
    height: '100%',
    borderRightWidth: 1,
    paddingTop: 58,
    paddingLeft: 18,
    paddingRight: 18,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  menuTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  botaoFechar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoFechar: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  itemMenu: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    paddingLeft: 16,
    marginBottom: 12,
  },
  textoItemMenu: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});