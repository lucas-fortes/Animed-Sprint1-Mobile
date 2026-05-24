import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

const ESTADOS_BRASIL: string[] = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export default function LoginScreen(props: any): React.ReactElement {
  const [tipoAcesso, setTipoAcesso] = useState<string>('CPF');
  const [documento, setDocumento] = useState<string>('');
  const [ufCrmv, setUfCrmv] = useState<string>('SP');
  const [senha, setSenha] = useState<string>('');
  const [temaEscuro, setTemaEscuro] = useState<boolean>(true);
  const [modalTipoVisivel, setModalTipoVisivel] = useState<boolean>(false);
  const [modalEstadosVisivel, setModalEstadosVisivel] = useState<boolean>(false);

  const cores = temaEscuro
    ? {
        fundo: '#07111F',
        card: '#111820',
        input: '#171A22',
        borda: '#23415A',
        texto: '#FFFFFF',
        textoSecundario: '#8A96A8',
        destaque: '#008B7A',
        destaqueBorda: '#00C2A8',
        link: '#00C2FF',
        modalFundo: '#0E1726',
        sobreposicao: 'rgba(0, 0, 0, 0.60)',
      }
    : {
        fundo: '#F2F6FA',
        card: '#FFFFFF',
        input: '#FFFFFF',
        borda: '#B8C6D6',
        texto: '#102033',
        textoSecundario: '#6B7A8C',
        destaque: '#008B7A',
        destaqueBorda: '#00A693',
        link: '#0077CC',
        modalFundo: '#FFFFFF',
        sobreposicao: 'rgba(0, 0, 0, 0.35)',
      };

  function formatarCpf(valor: string): string {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 3) {
      return numeros;
    }

    if (numeros.length <= 6) {
      return numeros.slice(0, 3) + '.' + numeros.slice(3);
    }

    if (numeros.length <= 9) {
      return (
        numeros.slice(0, 3) +
        '.' +
        numeros.slice(3, 6) +
        '.' +
        numeros.slice(6)
      );
    }

    return (
      numeros.slice(0, 3) +
      '.' +
      numeros.slice(3, 6) +
      '.' +
      numeros.slice(6, 9) +
      '-' +
      numeros.slice(9, 11)
    );
  }

  function alterarDocumento(valor: string): void {
    if (tipoAcesso === 'CPF') {
      setDocumento(formatarCpf(valor));
    } else {
      setDocumento(valor.replace(/\D/g, '').slice(0, 10));
    }
  }

  function selecionarTipoAcesso(tipo: string): void {
    setTipoAcesso(tipo);
    setDocumento('');
    setModalTipoVisivel(false);
  }

  function selecionarEstado(uf: string): void {
    setUfCrmv(uf);
    setModalEstadosVisivel(false);
  }

  function validarLogin(): boolean {
    const documentoNumerico = documento.replace(/\D/g, '');

    if (documento.trim() === '') {
      Alert.alert('Atenção', 'Informe seu CPF ou CRMV.');
      return false;
    }

    if (tipoAcesso === 'CPF' && documentoNumerico.length !== 11) {
      Alert.alert('Atenção', 'Digite um CPF válido no formato 000.000.000-00.');
      return false;
    }

    if (tipoAcesso === 'CRMV' && documentoNumerico.length < 4) {
      Alert.alert('Atenção', 'Digite um número de CRMV válido.');
      return false;
    }

    if (senha.trim() === '') {
      Alert.alert('Atenção', 'Informe sua senha.');
      return false;
    }

    return true;
  }

  function entrar(): void {
    if (validarLogin() === false) {
      return;
    }

    Alert.alert('Login', 'Login realizado em modo demonstrativo.', [
      {
        text: 'OK',
        onPress: () => props.onLogin(),
      },
    ]);
  }

  function abrirCadastro(): void {
    props.onCadastro();
  }

  function abrirRecuperarSenha(): void {
    props.onRecuperarSenha();
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: cores.fundo },
      ]}
    >
      <View style={styles.areaTema}>
        <Text style={[styles.textoTema, { color: cores.texto }]}>
          Tema claro
        </Text>

        <Switch
          value={!temaEscuro}
          onValueChange={(valor: boolean) => setTemaEscuro(!valor)}
          trackColor={{ false: '#334155', true: '#008B7A' }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.areaLogo}>
        <Image
          source={require('../../assets/Animed_Logo.png')}
          style={styles.logo}
        />

        <Text style={[styles.nomeApp, { color: cores.texto }]}>Animed</Text>

        <Text style={[styles.subtitulo, { color: cores.textoSecundario }]}>
          Acesse sua conta para continuar
        </Text>
      </View>

      <TouchableHighlight
        style={[
          styles.selectTipo,
          {
            backgroundColor: cores.input,
            borderColor: cores.borda,
          },
        ]}
        underlayColor={cores.card}
        onPress={() => setModalTipoVisivel(true)}
      >
        <View style={styles.selectConteudo}>
          <Text style={[styles.selectTexto, { color: cores.texto }]}>
            {tipoAcesso === 'CPF' ? 'Acesso via CPF' : 'Acesso via CRMV'}
          </Text>

          <Text style={[styles.selectSeta, { color: cores.textoSecundario }]}>
            ▼
          </Text>
        </View>
      </TouchableHighlight>

      <Text style={[styles.label, { color: cores.texto }]}>
        {tipoAcesso === 'CPF' ? 'CPF' : 'Número do CRMV'}
      </Text>

      {tipoAcesso === 'CPF' ? (
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cores.input,
              borderColor: cores.borda,
              color: cores.texto,
            },
          ]}
          placeholder="000.000.000-00"
          placeholderTextColor={cores.textoSecundario}
          value={documento}
          onChangeText={alterarDocumento}
          keyboardType="numeric"
          maxLength={14}
        />
      ) : (
        <View style={styles.linhaDocumento}>
          <TextInput
            style={[
              styles.inputCrmv,
              {
                backgroundColor: cores.input,
                borderColor: cores.borda,
                color: cores.texto,
              },
            ]}
            placeholder="Digite seu CRMV"
            placeholderTextColor={cores.textoSecundario}
            value={documento}
            onChangeText={alterarDocumento}
            keyboardType="numeric"
            maxLength={10}
          />

          <TouchableHighlight
            style={[
              styles.botaoUf,
              {
                backgroundColor: cores.input,
                borderColor: cores.borda,
              },
            ]}
            underlayColor={cores.card}
            onPress={() => setModalEstadosVisivel(true)}
          >
            <Text style={[styles.textoUf, { color: cores.texto }]}>
              {ufCrmv} ▼
            </Text>
          </TouchableHighlight>
        </View>
      )}

      <Text style={[styles.label, { color: cores.texto }]}>Senha</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: cores.input,
            borderColor: cores.borda,
            color: cores.texto,
          },
        ]}
        placeholder="Digite sua senha"
        placeholderTextColor={cores.textoSecundario}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={true}
      />

      <TouchableHighlight
        style={[styles.botaoEntrar, { backgroundColor: cores.destaque }]}
        underlayColor="#006F62"
        onPress={entrar}
      >
        <Text style={styles.textoBotaoEntrar}>Entrar no Sistema</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.botaoLink}
        underlayColor="transparent"
        onPress={abrirRecuperarSenha}
      >
        <Text style={[styles.textoLink, { color: cores.link }]}>
          Esqueceu a senha?
        </Text>
      </TouchableHighlight>

      <View style={styles.areaCadastro}>
        <Text style={[styles.textoConta, { color: cores.textoSecundario }]}>
          Não tem uma conta?
        </Text>

        <TouchableHighlight
          style={styles.botaoCadastro}
          underlayColor="transparent"
          onPress={abrirCadastro}
        >
          <Text style={[styles.textoCadastro, { color: cores.destaque }]}>
            Cadastre-se
          </Text>
        </TouchableHighlight>
      </View>

      <Modal
        visible={modalTipoVisivel}
        transparent={true}
        animationType="fade"
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: cores.sobreposicao },
          ]}
        >
          <View
            style={[
              styles.modalCardPequeno,
              {
                backgroundColor: cores.modalFundo,
                borderColor: cores.borda,
              },
            ]}
          >
            <Text style={[styles.modalTitulo, { color: cores.texto }]}>
              Tipo de acesso
            </Text>

            <TouchableHighlight
              style={[
                styles.itemModal,
                {
                  backgroundColor:
                    tipoAcesso === 'CPF' ? cores.destaque : cores.input,
                  borderColor:
                    tipoAcesso === 'CPF' ? cores.destaqueBorda : cores.borda,
                },
              ]}
              underlayColor={cores.destaque}
              onPress={() => selecionarTipoAcesso('CPF')}
            >
              <Text
                style={[
                  styles.textoItemModal,
                  { color: tipoAcesso === 'CPF' ? '#FFFFFF' : cores.texto },
                ]}
              >
                Acesso via CPF
              </Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={[
                styles.itemModal,
                {
                  backgroundColor:
                    tipoAcesso === 'CRMV' ? cores.destaque : cores.input,
                  borderColor:
                    tipoAcesso === 'CRMV' ? cores.destaqueBorda : cores.borda,
                },
              ]}
              underlayColor={cores.destaque}
              onPress={() => selecionarTipoAcesso('CRMV')}
            >
              <Text
                style={[
                  styles.textoItemModal,
                  { color: tipoAcesso === 'CRMV' ? '#FFFFFF' : cores.texto },
                ]}
              >
                Acesso via CRMV
              </Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={[
                styles.botaoFecharModal,
                {
                  backgroundColor: cores.input,
                  borderColor: cores.borda,
                },
              ]}
              underlayColor={cores.card}
              onPress={() => setModalTipoVisivel(false)}
            >
              <Text style={[styles.textoFecharModal, { color: cores.texto }]}>
                Fechar
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalEstadosVisivel}
        transparent={true}
        animationType="fade"
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: cores.sobreposicao },
          ]}
        >
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: cores.modalFundo,
                borderColor: cores.borda,
              },
            ]}
          >
            <Text style={[styles.modalTitulo, { color: cores.texto }]}>
              Selecione o Estado
            </Text>

            <ScrollView style={styles.listaEstados}>
              {ESTADOS_BRASIL.map((uf) => (
                <TouchableHighlight
                  key={uf}
                  style={[
                    styles.itemModal,
                    {
                      backgroundColor:
                        ufCrmv === uf ? cores.destaque : cores.input,
                      borderColor:
                        ufCrmv === uf ? cores.destaqueBorda : cores.borda,
                    },
                  ]}
                  underlayColor={cores.destaque}
                  onPress={() => selecionarEstado(uf)}
                >
                  <Text
                    style={[
                      styles.textoItemModal,
                      { color: ufCrmv === uf ? '#FFFFFF' : cores.texto },
                    ]}
                  >
                    {uf}
                  </Text>
                </TouchableHighlight>
              ))}
            </ScrollView>

            <TouchableHighlight
              style={[
                styles.botaoFecharModal,
                {
                  backgroundColor: cores.input,
                  borderColor: cores.borda,
                },
              ]}
              underlayColor={cores.card}
              onPress={() => setModalEstadosVisivel(false)}
            >
              <Text style={[styles.textoFecharModal, { color: cores.texto }]}>
                Fechar
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 34,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  areaTema: {
    position: 'absolute',
    top: 18,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoTema: {
    fontSize: 12,
    marginRight: 8,
  },
  areaLogo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  nomeApp: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 14,
    marginTop: 6,
  },
  label: {
    width: '100%',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  selectTipo: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    justifyContent: 'center',
    marginBottom: 12,
  },
  selectConteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
  },
  selectTexto: {
    fontSize: 15,
    fontWeight: '600',
  },
  selectSeta: {
    fontSize: 12,
  },
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 8,
  },
  linhaDocumento: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputCrmv: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 16,
    marginRight: 8,
  },
  botaoUf: {
    width: 82,
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoUf: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  botaoEntrar: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    marginBottom: 22,
  },
  textoBotaoEntrar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoLink: {
    padding: 8,
    alignSelf: 'center',
  },
  textoLink: {
    fontSize: 14,
  },
  areaCadastro: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  textoConta: {
    fontSize: 14,
    marginRight: 4,
  },
  botaoCadastro: {
    padding: 4,
  },
  textoCadastro: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '90%',
    maxHeight: '70%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  modalCardPequeno: {
    width: '88%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
  },
  listaEstados: {
    marginBottom: 12,
  },
  itemModal: {
    height: 46,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  textoItemModal: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  botaoFecharModal: {
    height: 46,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  textoFecharModal: {
    fontWeight: 'bold',
  },
});