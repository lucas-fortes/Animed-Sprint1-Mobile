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
  const [modalEstadosVisivel, setModalEstadosVisivel] = useState<boolean>(false);
  const [modalTemaVisivel, setModalTemaVisivel] = useState<boolean>(false);

  const cores = temaEscuro
    ? {
        fundo: '#07111F',
        fundoSecundario: '#111820',
        borda: '#23415A',
        texto: '#FFFFFF',
        textoSecundario: '#8A96A8',
        destaque: '#008B7A',
        destaqueBorda: '#00C2A8',
        link: '#00C2FF',
        sobreposicao: 'rgba(0, 0, 0, 0.60)',
        cardModal: '#0E1726',
      }
    : {
        fundo: '#F2F6FA',
        fundoSecundario: '#FFFFFF',
        borda: '#B8C6D6',
        texto: '#102033',
        textoSecundario: '#6B7A8C',
        destaque: '#008B7A',
        destaqueBorda: '#00A693',
        link: '#0077CC',
        sobreposicao: 'rgba(0, 0, 0, 0.35)',
        cardModal: '#FFFFFF',
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

  function alterarTipoAcesso(tipo: string): void {
    setTipoAcesso(tipo);
    setDocumento('');
  }

  function alterarTema(valor: boolean): void {
    setTemaEscuro(valor);
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
    const loginValido = validarLogin();

    if (loginValido === false) {
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
    Alert.alert(
      'Cadastro',
      'A tela de cadastro será configurada na próxima etapa.'
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: cores.fundo },
      ]}
    >
      <View style={styles.topo}>
        <View style={styles.topoEspaco} />

        <Image
          source={require('../../assets/Animed_Logo.png')}
          style={styles.logo}
        />

        <TouchableHighlight
          style={[
            styles.botaoMenu,
            {
              backgroundColor: cores.fundoSecundario,
              borderColor: cores.borda,
            },
          ]}
          underlayColor={cores.destaque}
          onPress={() => setModalTemaVisivel(true)}
        >
          <Text style={[styles.textoMenu, { color: cores.texto }]}>☰</Text>
        </TouchableHighlight>
      </View>

      <Text style={[styles.titulo, { color: cores.texto }]}>Login</Text>

      <Text style={[styles.label, { color: cores.texto }]}>Tipo de acesso</Text>

      <View style={styles.linhaBotoes}>
        <TouchableHighlight
          style={[
            styles.botaoTipo,
            {
              backgroundColor: cores.fundoSecundario,
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
              backgroundColor: cores.fundoSecundario,
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
              backgroundColor: cores.fundoSecundario,
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
                backgroundColor: cores.fundoSecundario,
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
                backgroundColor: cores.fundoSecundario,
                borderColor: cores.borda,
              },
            ]}
            underlayColor={cores.destaque}
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
            backgroundColor: cores.fundoSecundario,
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
        <Text style={styles.textoBotaoEntrar}>Entrar</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.botaoCadastro}
        underlayColor="transparent"
        onPress={abrirCadastro}
      >
        <Text style={[styles.textoCadastro, { color: cores.link }]}>
          Cadastre-se
        </Text>
      </TouchableHighlight>

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
                backgroundColor: cores.cardModal,
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
                    styles.itemEstado,
                    {
                      backgroundColor:
                        ufCrmv === uf ? cores.destaque : cores.fundoSecundario,
                      borderColor:
                        ufCrmv === uf ? cores.destaqueBorda : cores.borda,
                    },
                  ]}
                  underlayColor={cores.destaque}
                  onPress={() => selecionarEstado(uf)}
                >
                  <Text
                    style={[
                      styles.textoItemEstado,
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
                  backgroundColor: cores.fundoSecundario,
                  borderColor: cores.borda,
                },
              ]}
              underlayColor={cores.destaque}
              onPress={() => setModalEstadosVisivel(false)}
            >
              <Text style={[styles.textoFecharModal, { color: cores.texto }]}>
                Fechar
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalTemaVisivel}
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
              styles.modalTemaCard,
              {
                backgroundColor: cores.cardModal,
                borderColor: cores.borda,
              },
            ]}
          >
            <Text style={[styles.modalTitulo, { color: cores.texto }]}>
              Configurações
            </Text>

            <View
              style={[
                styles.linhaTema,
                {
                  backgroundColor: cores.fundoSecundario,
                  borderColor: cores.borda,
                },
              ]}
            >
              <View>
                <Text style={[styles.textoBotaoTema, { color: cores.texto }]}>
                  Tema escuro
                </Text>

                <Text
                  style={[
                    styles.textoTemaDescricao,
                    { color: cores.textoSecundario },
                  ]}
                >
                  {temaEscuro ? 'Ativado' : 'Desativado'}
                </Text>
              </View>

              <Switch
                value={temaEscuro}
                onValueChange={alterarTema}
                trackColor={{ false: '#B8C6D6', true: '#008B7A' }}
                thumbColor={temaEscuro ? '#FFFFFF' : '#F4F4F4'}
              />
            </View>

            <TouchableHighlight
              style={[
                styles.botaoFecharModal,
                {
                  backgroundColor: cores.fundoSecundario,
                  borderColor: cores.borda,
                },
              ]}
              underlayColor={cores.destaque}
              onPress={() => setModalTemaVisivel(false)}
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
    padding: 24,
  },
  topo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  topoEspaco: {
    width: 46,
  },
  logo: {
    width: 140,
    height: 80,
    resizeMode: 'contain',
  },
  botaoMenu: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoMenu: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 28,
  },
  label: {
    width: '100%',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  linhaBotoes: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 12,
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
  },
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 10,
  },
  linhaDocumento: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    marginTop: 18,
    marginBottom: 18,
  },
  textoBotaoEntrar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoCadastro: {
    padding: 8,
    alignSelf: 'center',
  },
  textoCadastro: {
    fontSize: 15,
    fontStyle: 'italic',
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
  modalTemaCard: {
    width: '85%',
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
  itemEstado: {
    height: 42,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  textoItemEstado: {
    fontWeight: 'bold',
  },
  linhaTema: {
    width: '100%',
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textoBotaoTema: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  textoTemaDescricao: {
    fontSize: 12,
    marginTop: 4,
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