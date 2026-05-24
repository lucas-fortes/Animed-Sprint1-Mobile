import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

type PerfilUsuario = {
  nome: string;
  tipoAcesso: string;
  documento: string;
  ufCrmv: string;
  email: string;
  telefone: string;
  clinica: string;
  especialidade: string;
};

const CHAVE_PERFIL = '@animed:perfilUsuario';

const PERFIL_PADRAO: PerfilUsuario = {
  nome: 'Dr. Roberto',
  tipoAcesso: 'CRMV',
  documento: '12345',
  ufCrmv: 'SP',
  email: 'roberto@animed.com',
  telefone: '(11) 99999-0000',
  clinica: 'Clínica Animed',
  especialidade: 'Clínica geral veterinária',
};

type PerfilScreenProps = {
  temaEscuro?: boolean;
};

export default function PerfilScreen(
  props: PerfilScreenProps
): React.ReactElement {
  const temaEscuro = props.temaEscuro ?? true;

  const [perfil, setPerfil] = useState<PerfilUsuario>(PERFIL_PADRAO);
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);

  const cores = temaEscuro
    ? {
      fundo: '#07111F',
      card: '#172232',
      campo: '#171A22',
      borda: '#23415A',
      texto: '#FFFFFF',
      textoSecundario: '#8A96A8',
      destaque: '#008B7A',
      destaqueClaro: '#00C2A8',
      perigo: '#D62828',
      alerta: '#D99000',
    }
    : {
      fundo: '#F2F6FA',
      card: '#FFFFFF',
      campo: '#EAF2F7',
      borda: '#B8C6D6',
      texto: '#102033',
      textoSecundario: '#6B7A8C',
      destaque: '#008B7A',
      destaqueClaro: '#00A693',
      perigo: '#C62828',
      alerta: '#B87500',
    };

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil(): Promise<void> {
    try {
      const dadosSalvos = await AsyncStorage.getItem(CHAVE_PERFIL);

      if (dadosSalvos !== null) {
        const perfilSalvo: PerfilUsuario = JSON.parse(dadosSalvos);
        setPerfil(perfilSalvo);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
    }
  }

  async function salvarPerfil(): Promise<void> {
    if (validarPerfil() === false) {
      return;
    }

    try {
      await AsyncStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));

      setModoEdicao(false);

      Alert.alert('Perfil', 'Dados do perfil salvos com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados do perfil.');
    }
  }

  async function limparPerfil(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHAVE_PERFIL);

      setPerfil(PERFIL_PADRAO);
      setModoEdicao(false);

      Alert.alert('Perfil', 'Os dados do perfil foram restaurados.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível limpar os dados do perfil.');
    }
  }

  function validarPerfil(): boolean {
    if (perfil.nome.trim() === '') {
      Alert.alert('Atenção', 'Informe o nome do profissional.');
      return false;
    }

    if (perfil.documento.trim() === '') {
      Alert.alert('Atenção', 'Informe o CPF ou CRMV.');
      return false;
    }

    if (perfil.tipoAcesso === 'CPF' && perfil.documento.replace(/\D/g, '').length !== 11) {
      Alert.alert('Atenção', 'Digite um CPF válido no formato 000.000.000-00.');
      return false;
    }

    if (perfil.tipoAcesso === 'CRMV' && perfil.documento.replace(/\D/g, '').length < 4) {
      Alert.alert('Atenção', 'Digite um CRMV válido.');
      return false;
    }

    if (perfil.email.trim() === '') {
      Alert.alert('Atenção', 'Informe o e-mail.');
      return false;
    }

    if (perfil.telefone.trim() === '') {
      Alert.alert('Atenção', 'Informe o telefone.');
      return false;
    }

    return true;
  }

  function alterarCampo(campo: keyof PerfilUsuario, valor: string): void {
    setPerfil({
      ...perfil,
      [campo]: valor,
    });
  }

  function alterarTipoAcesso(tipo: string): void {
    setPerfil({
      ...perfil,
      tipoAcesso: tipo,
      documento: '',
      ufCrmv: tipo === 'CRMV' ? 'SP' : '',
    });
  }

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

  function formatarTelefone(valor: string): string {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 2) {
      return numeros;
    }

    if (numeros.length <= 7) {
      return '(' + numeros.slice(0, 2) + ') ' + numeros.slice(2);
    }

    return (
      '(' +
      numeros.slice(0, 2) +
      ') ' +
      numeros.slice(2, 7) +
      '-' +
      numeros.slice(7, 11)
    );
  }

  function alterarDocumento(valor: string): void {
    if (perfil.tipoAcesso === 'CPF') {
      const contemCaracterInvalido = /[^0-9.-]/.test(valor);

      if (contemCaracterInvalido) {
        Alert.alert(
          'Atenção',
          'Digite somente números no formato 000.000.000-00.'
        );
      }

      alterarCampo('documento', formatarCpf(valor));
    } else {
      const contemCaracterInvalido = /\D/.test(valor);

      if (contemCaracterInvalido) {
        Alert.alert('Atenção', 'Digite somente números no campo CRMV.');
      }

      alterarCampo('documento', valor.replace(/\D/g, '').slice(0, 10));
    }
  }

  function alterarTelefone(valor: string): void {
    const contemCaracterInvalido = /\D/.test(valor);

    if (contemCaracterInvalido) {
      Alert.alert('Atenção', 'Digite somente números no telefone.');
    }

    alterarCampo('telefone', formatarTelefone(valor));
  }

  function iniciaisNome(nome: string): string {
    const partes = nome.trim().split(' ');

    if (partes.length === 1) {
      return partes[0].slice(0, 2).toUpperCase();
    }

    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  return (
    <ScrollView
      style={{ backgroundColor: cores.fundo }}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: cores.fundo },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topo}>
        <Text style={[styles.titulo, { color: cores.texto }]}>
          Perfil
        </Text>

        <Text style={[styles.subtitulo, { color: cores.textoSecundario }]}>
          Dados do profissional logado.
        </Text>
      </View>
      <View
        style={[
          styles.cardPerfil,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <View style={styles.areaAvatar}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: cores.destaque },
            ]}
          >
            <Text style={styles.textoAvatar}>
              {iniciaisNome(perfil.nome)}
            </Text>
          </View>

          <Text style={[styles.nomePerfil, { color: cores.texto }]}>
            {perfil.nome}
          </Text>

          <Text style={[styles.descricaoPerfil, { color: cores.textoSecundario }]}>
            {perfil.especialidade}
          </Text>

          <Text style={[styles.descricaoPerfil, { color: cores.textoSecundario }]}>
            {perfil.clinica}
          </Text>
        </View>

        <View style={styles.linhaStatus}>
          <View
            style={[
              styles.tagStatus,
              { backgroundColor: cores.destaque },
            ]}
          >
            <Text style={styles.textoTagStatus}>ATIVO</Text>
          </View>

          <View
            style={[
              styles.tagDocumento,
              {
                backgroundColor: cores.campo,
                borderColor: cores.borda,
              },
            ]}
          >
            <Text style={[styles.textoDocumento, { color: cores.texto }]}>
              {perfil.tipoAcesso === 'CRMV'
                ? 'CRMV ' + perfil.ufCrmv + ' ' + perfil.documento
                : 'CPF ' + perfil.documento}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <View style={styles.cabecalhoCard}>
          <Text style={[styles.tituloSecao, { color: cores.texto }]}>
            Dados cadastrais
          </Text>

          <TouchableHighlight
            style={[
              styles.botaoEditar,
              {
                backgroundColor: modoEdicao ? cores.perigo : cores.destaque,
              },
            ]}
            underlayColor="#006F62"
            onPress={() => setModoEdicao(!modoEdicao)}
          >
            <Text style={styles.textoBotaoEditar}>
              {modoEdicao ? 'Cancelar' : 'Editar'}
            </Text>
          </TouchableHighlight>
        </View>

        <Text style={[styles.label, { color: cores.texto }]}>
          Nome
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
              color: cores.texto,
            },
          ]}
          placeholder="Nome do profissional"
          placeholderTextColor={cores.textoSecundario}
          value={perfil.nome}
          onChangeText={(valor) => alterarCampo('nome', valor)}
          editable={modoEdicao}
        />

        <Text style={[styles.label, { color: cores.texto }]}>
          Tipo de documento
        </Text>

        <View style={styles.linhaTipos}>
          <TouchableHighlight
            style={[
              styles.botaoTipo,
              {
                backgroundColor:
                  perfil.tipoAcesso === 'CPF' ? cores.destaque : cores.campo,
                borderColor:
                  perfil.tipoAcesso === 'CPF' ? cores.destaqueClaro : cores.borda,
              },
            ]}
            underlayColor={cores.destaque}
            onPress={() => {
              if (modoEdicao) {
                alterarTipoAcesso('CPF');
              }
            }}
          >
            <Text style={[styles.textoBotaoTipo, { color: cores.texto }]}>
              CPF
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={[
              styles.botaoTipo,
              {
                backgroundColor:
                  perfil.tipoAcesso === 'CRMV' ? cores.destaque : cores.campo,
                borderColor:
                  perfil.tipoAcesso === 'CRMV'
                    ? cores.destaqueClaro
                    : cores.borda,
              },
            ]}
            underlayColor={cores.destaque}
            onPress={() => {
              if (modoEdicao) {
                alterarTipoAcesso('CRMV');
              }
            }}
          >
            <Text style={[styles.textoBotaoTipo, { color: cores.texto }]}>
              CRMV
            </Text>
          </TouchableHighlight>
        </View>

        <Text style={[styles.label, { color: cores.texto }]}>
          {perfil.tipoAcesso === 'CPF' ? 'CPF' : 'Número do CRMV'}
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
              color: cores.texto,
            },
          ]}
          placeholder={perfil.tipoAcesso === 'CPF' ? '000.000.000-00' : 'Digite seu CRMV'}
          placeholderTextColor={cores.textoSecundario}
          value={perfil.documento}
          onChangeText={alterarDocumento}
          editable={modoEdicao}
          keyboardType="default"
          maxLength={perfil.tipoAcesso === 'CPF' ? 14 : 10}
        />

        {perfil.tipoAcesso === 'CRMV' ? (
          <>
            <Text style={[styles.label, { color: cores.texto }]}>
              UF do CRMV
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: cores.campo,
                  borderColor: cores.borda,
                  color: cores.texto,
                },
              ]}
              placeholder="SP"
              placeholderTextColor={cores.textoSecundario}
              value={perfil.ufCrmv}
              onChangeText={(valor) =>
                alterarCampo('ufCrmv', valor.toUpperCase().slice(0, 2))
              }
              editable={modoEdicao}
              maxLength={2}
            />
          </>
        ) : null}

        <Text style={[styles.label, { color: cores.texto }]}>
          E-mail
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
              color: cores.texto,
            },
          ]}
          placeholder="email@dominio.com"
          placeholderTextColor={cores.textoSecundario}
          value={perfil.email}
          onChangeText={(valor) => alterarCampo('email', valor)}
          editable={modoEdicao}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: cores.texto }]}>
          Telefone
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
              color: cores.texto,
            },
          ]}
          placeholder="(11) 99999-9999"
          placeholderTextColor={cores.textoSecundario}
          value={perfil.telefone}
          onChangeText={alterarTelefone}
          editable={modoEdicao}
          keyboardType="default"
          maxLength={15}
        />

        <Text style={[styles.label, { color: cores.texto }]}>
          Clínica
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
              color: cores.texto,
            },
          ]}
          placeholder="Nome da clínica"
          placeholderTextColor={cores.textoSecundario}
          value={perfil.clinica}
          onChangeText={(valor) => alterarCampo('clinica', valor)}
          editable={modoEdicao}
        />

        <Text style={[styles.label, { color: cores.texto }]}>
          Especialidade
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
              color: cores.texto,
            },
          ]}
          placeholder="Especialidade veterinária"
          placeholderTextColor={cores.textoSecundario}
          value={perfil.especialidade}
          onChangeText={(valor) => alterarCampo('especialidade', valor)}
          editable={modoEdicao}
        />

        {modoEdicao ? (
          <TouchableHighlight
            style={[styles.botaoSalvar, { backgroundColor: cores.destaque }]}
            underlayColor="#006F62"
            onPress={salvarPerfil}
          >
            <Text style={styles.textoBotaoSalvar}>Salvar Perfil</Text>
          </TouchableHighlight>
        ) : null}

        <TouchableHighlight
          style={[
            styles.botaoLimpar,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
            },
          ]}
          underlayColor="#1C2B3A"
          onPress={limparPerfil}
        >
          <Text style={[styles.textoBotaoLimpar, { color: cores.texto }]}>
            Restaurar dados padrão
          </Text>
        </TouchableHighlight>
      </View>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 58,
    paddingBottom: 120,
  },
  topo: {
    marginBottom: 22,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    marginBottom: 14,
  },
  cardPerfil: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  areaAvatar: {
    alignItems: 'center',
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  textoAvatar: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  nomePerfil: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  descricaoPerfil: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  linhaStatus: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  tagStatus: {
    borderRadius: 14,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  textoTagStatus: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  tagDocumento: {
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 8,
  },
  textoDocumento: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  cabecalhoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tituloSecao: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  botaoEditar: {
    minWidth: 84,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  textoBotaoEditar: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 8,
  },
  linhaTipos: {
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  botaoSalvar: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoLimpar: {
    height: 50,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  textoBotaoLimpar: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});