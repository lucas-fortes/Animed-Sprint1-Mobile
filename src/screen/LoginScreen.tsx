import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
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

    Alert.alert(
      'Login',
      'Login realizado em modo demonstrativo.',
      [
        {
          text: 'OK',
          onPress: () => props.onLogin(),
        },
      ]
    );
  }

  function abrirCadastro(): void {
    Alert.alert(
      'Cadastro',
      'A tela de cadastro será configurada na próxima etapa.'
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/logo-animed.png')}
        style={styles.logo}
      />

      <Text style={styles.titulo}>Login</Text>

      <Text style={styles.label}>Tipo de acesso</Text>

      <View style={styles.linhaBotoes}>
        <TouchableHighlight
          style={[
            styles.botaoTipo,
            tipoAcesso === 'CPF' ? styles.botaoTipoSelecionado : null,
          ]}
          underlayColor="#008B7A"
          onPress={() => alterarTipoAcesso('CPF')}
        >
          <Text style={styles.textoBotaoTipo}>CPF</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={[
            styles.botaoTipo,
            tipoAcesso === 'CRMV' ? styles.botaoTipoSelecionado : null,
          ]}
          underlayColor="#008B7A"
          onPress={() => alterarTipoAcesso('CRMV')}
        >
          <Text style={styles.textoBotaoTipo}>CRMV</Text>
        </TouchableHighlight>
      </View>

      <Text style={styles.label}>
        {tipoAcesso === 'CPF' ? 'CPF' : 'Número do CRMV'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={tipoAcesso === 'CPF' ? '000.000.000-00' : 'Digite seu CRMV'}
        placeholderTextColor="#8A96A8"
        value={documento}
        onChangeText={alterarDocumento}
        keyboardType="numeric"
        maxLength={tipoAcesso === 'CPF' ? 14 : 10}
      />

      {tipoAcesso === 'CRMV' && (
        <View style={styles.areaEstados}>
          <Text style={styles.label}>Estado do CRMV</Text>

          <View style={styles.estadosContainer}>
            {ESTADOS_BRASIL.map((uf) => (
              <TouchableHighlight
                key={uf}
                style={[
                  styles.botaoEstado,
                  ufCrmv === uf ? styles.botaoEstadoSelecionado : null,
                ]}
                underlayColor="#008B7A"
                onPress={() => setUfCrmv(uf)}
              >
                <Text style={styles.textoEstado}>{uf}</Text>
              </TouchableHighlight>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.label}>Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#8A96A8"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={true}
      />

      <TouchableHighlight
        style={styles.botaoEntrar}
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
        <Text style={styles.textoCadastro}>Cadastre-se</Text>
      </TouchableHighlight>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#07111F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 28,
  },
  label: {
    width: '100%',
    color: '#FFFFFF',
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
    backgroundColor: '#111820',
    borderWidth: 1,
    borderColor: '#23415A',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  botaoTipoSelecionado: {
    backgroundColor: '#008B7A',
    borderColor: '#00C2A8',
  },
  textoBotaoTipo: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#111820',
    borderWidth: 1,
    borderColor: '#23415A',
    borderRadius: 14,
    color: '#FFFFFF',
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 10,
  },
  areaEstados: {
    width: '100%',
  },
  estadosContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  botaoEstado: {
    width: '18%',
    height: 38,
    backgroundColor: '#111820',
    borderWidth: 1,
    borderColor: '#23415A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginBottom: 8,
  },
  botaoEstadoSelecionado: {
    backgroundColor: '#008B7A',
    borderColor: '#00C2A8',
  },
  textoEstado: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  botaoEntrar: {
    width: '100%',
    height: 54,
    backgroundColor: '#008B7A',
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
  },
  textoCadastro: {
    color: '#00C2FF',
    fontSize: 15,
    fontStyle: 'italic',
  },
});