import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
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
  const [modalEstadoVisivel, setModalEstadoVisivel] = useState<boolean>(false);

  const cores = temaEscuro
    ? {
      fundo: '#07111F',
      fundoCampo: '#171A22',
      fundoModal: '#111820',
      borda: '#23415A',
      texto: '#FFFFFF',
      textoSecundario: '#8A96A8',
      destaque: '#008B7A',
      destaqueBorda: '#00C2A8',
      link: '#00C2FF',
      overlay: 'rgba(0, 0, 0, 0.60)',
    }
    : {
      fundo: '#F2F6FA',
      fundoCampo: '#FFFFFF',
      fundoModal: '#FFFFFF',
      borda: '#B8C6D6',
      texto: '#102033',
      textoSecundario: '#6B7A8C',
      destaque: '#008B7A',
      destaqueBorda: '#00A693',
      link: '#0077CC',
      overlay: 'rgba(0, 0, 0, 0.35)',
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
      const contemCaracterInvalido = /[^0-9.-]/.test(valor);

      if (contemCaracterInvalido) {
        Alert.alert(
          'Atenção',
          'Digite somente números no formato 000.000.000-00.'
        );
      }

      setDocumento(formatarCpf(valor));
    } else {
      const contemCaracterInvalido = /\D/.test(valor);

      if (contemCaracterInvalido) {
        Alert.alert('Atenção', 'Digite somente números no campo CRMV.');
      }

      setDocumento(valor.replace(/\D/g, '').slice(0, 10));
    }
  }

  function alterarTipoAcesso(tipo: string): void {
    setTipoAcesso(tipo);
    setDocumento('');
  }

  function selecionarEstado(uf: string): void {
    setUfCrmv(uf);
    setModalEstadoVisivel(false);
  }

  function alternarTema(): void {
    setTemaEscuro(!temaEscuro);
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
    <KeyboardAvoidingView
      style={[
        styles.keyboardContainer,
        { backgroundColor: cores.fundo },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ backgroundColor: cores.fundo }}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: cores.fundo },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <TouchableHighlight
          style={[
            styles.botaoTema,
            {
              backgroundColor: temaEscuro ? '#0E1726' : '#EAF2F7',
              borderColor: temaEscuro ? '#1E3A4F' : '#B8C6D6',
            },
          ]}
          underlayColor={cores.destaque}
          onPress={alternarTema}
        >
          <Text
            style={[
              styles.iconeTema,
              { color: temaEscuro ? '#00C2A8' : '#008B7A' },
            ]}
          >
            {temaEscuro ? '☾' : '☀'}
          </Text>
        </TouchableHighlight>

        <View style={styles.areaLogo}>
          <Image
            source={require('../../assets/Animed_Logo.png')}
            style={styles.logo}
          />

          <Text style={[styles.nomeApp, { color: cores.texto }]}>
            Animed
          </Text>

          <Text style={[styles.subtitulo, { color: cores.textoSecundario }]}>
            Acesse sua conta para continuar
          </Text>
        </View>

        <Text style={[styles.label, { color: cores.texto }]}>
          Tipo de acesso
        </Text>

        <View style={styles.linhaTipos}>
          <TouchableHighlight
            style={[
              styles.botaoTipo,
              {
                backgroundColor: cores.fundoCampo,
                borderColor: cores.borda,
              },
              tipoAcesso === 'CPF'
                ? {
                  backgroundColor: cores.destaque,
                  borderColor: cores.destaqueBorda,
                }
                : null,
            ]}
            underlayColor={cores.destaque}
            onPress={() => alterarTipoAcesso('CPF')}
          >
            <Text
              style={[
                styles.textoBotaoTipo,
                { color: tipoAcesso === 'CPF' ? '#FFFFFF' : cores.texto },
              ]}
            >
              CPF
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={[
              styles.botaoTipo,
              {
                backgroundColor: cores.fundoCampo,
                borderColor: cores.borda,
              },
              tipoAcesso === 'CRMV'
                ? {
                  backgroundColor: cores.destaque,
                  borderColor: cores.destaqueBorda,
                }
                : null,
            ]}
            underlayColor={cores.destaque}
            onPress={() => alterarTipoAcesso('CRMV')}
          >
            <Text
              style={[
                styles.textoBotaoTipo,
                { color: tipoAcesso === 'CRMV' ? '#FFFFFF' : cores.texto },
              ]}
            >
              CRMV
            </Text>
          </TouchableHighlight>
        </View>

        <Text style={[styles.label, { color: cores.texto }]}>
          {tipoAcesso === 'CPF' ? 'CPF' : 'Número do CRMV'}
        </Text>

        {tipoAcesso === 'CPF' ? (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: cores.fundoCampo,
                borderColor: cores.borda,
                color: cores.texto,
              },
            ]}
            placeholder="000.000.000-00"
            placeholderTextColor={cores.textoSecundario}
            value={documento}
            onChangeText={alterarDocumento}
            keyboardType="numeric"
            secureTextEntry={true}
            maxLength={14}
          />
        ) : (
          <View style={styles.linhaCrmv}>
            <TextInput
              style={[
                styles.inputCrmv,
                {
                  backgroundColor: cores.fundoCampo,
                  borderColor: cores.borda,
                  color: cores.texto,
                },
              ]}
              placeholder="Digite seu CRMV"
              placeholderTextColor={cores.textoSecundario}
              value={documento}
              onChangeText={alterarDocumento}
              keyboardType="numeric"
              secureTextEntry={true}
              maxLength={5}

            />

            <TouchableHighlight
              style={[
                styles.botaoUf,
                {
                  backgroundColor: cores.fundoCampo,
                  borderColor: cores.borda,
                },
              ]}
              underlayColor={cores.destaque}
              onPress={() => setModalEstadoVisivel(true)}
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
              backgroundColor: cores.fundoCampo,
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
          visible={modalEstadoVisivel}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalEstadoVisivel(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalEstadoVisivel(false)}>
            <View
              style={[styles.modalOverlay, { backgroundColor: cores.overlay }]}
            >
              <View
                style={[
                  styles.modalCardEstados,
                  {
                    backgroundColor: cores.fundoModal,
                    borderColor: cores.borda,
                  },
                ]}
                onStartShouldSetResponder={() => true}
              >
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitulo, { color: cores.texto }]}>
                    Selecione o Estado
                  </Text>

                  <TouchableHighlight
                    style={[
                      styles.botaoFecharX,
                      {
                        backgroundColor: cores.fundoCampo,
                        borderColor: cores.borda,
                      },
                    ]}
                    underlayColor={cores.destaque}
                    onPress={() => setModalEstadoVisivel(false)}
                  >
                    <Text style={[styles.textoFecharX, { color: cores.texto }]}>
                      ×
                    </Text>
                  </TouchableHighlight>
                </View>

                <ScrollView style={styles.listaEstados}>
                  {ESTADOS_BRASIL.map((uf) => (
                    <TouchableHighlight
                      key={uf}
                      style={[
                        styles.itemModal,
                        {
                          backgroundColor:
                            ufCrmv === uf ? cores.destaque : cores.fundoCampo,
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
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 88,
    paddingBottom: 140,
    justifyContent: 'center',
  },
  botaoTema: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeTema: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  areaLogo: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 124,
    height: 92,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  nomeApp: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  label: {
    width: '100%',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  linhaTipos: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 8,
  },
  botaoTipo: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textoBotaoTipo: {
    fontWeight: 'bold',
    fontSize: 15,
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
  linhaCrmv: {
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
    marginBottom: 18,
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
  modalCardEstados: {
    width: '90%',
    maxHeight: '70%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botaoFecharX: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoFecharX: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 24,
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
});