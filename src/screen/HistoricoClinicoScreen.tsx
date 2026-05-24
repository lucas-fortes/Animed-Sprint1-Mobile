import React, { useCallback, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import { RegistroClinico } from '../model/RegistroClinico';

const CHAVE_REGISTROS = '@animed:registrosClinicos';

export default function HistoricoClinicoScreen(): React.ReactElement {
  const [registrosHistorico, setRegistrosHistorico] = useState<RegistroClinico[]>(
    []
  );

  const [cpfBusca, setCpfBusca] = useState<string>('');
  const [dataBusca, setDataBusca] = useState<string>('');

  const cores = {
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
    baixo: '#00A693',
  };

  function obterDataHoje(): string {
    const hoje = new Date();

    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = String(hoje.getFullYear());

    return dia + '/' + mes + '/' + ano;
  }

  function converterDataParaNumero(data: string): number {
    if (data.length !== 10) {
      return 0;
    }

    const partes = data.split('/');

    if (partes.length !== 3) {
      return 0;
    }

    const dia = partes[0];
    const mes = partes[1];
    const ano = partes[2];

    return Number(ano + mes + dia);
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

  function alterarCpfBusca(valor: string): void {
    const contemCaracterInvalido = /[^0-9.-]/.test(valor);

    if (contemCaracterInvalido) {
      Alert.alert(
        'Atenção',
        'Digite somente números no formato 000.000.000-00.'
      );
    }

    setCpfBusca(formatarCpf(valor));
  }

  function alterarDataBusca(valor: string): void {
    const numeros = valor.replace(/\D/g, '').slice(0, 8);

    if (numeros.length <= 2) {
      setDataBusca(numeros);
      return;
    }

    if (numeros.length <= 4) {
      setDataBusca(numeros.slice(0, 2) + '/' + numeros.slice(2));
      return;
    }

    setDataBusca(
      numeros.slice(0, 2) +
      '/' +
      numeros.slice(2, 4) +
      '/' +
      numeros.slice(4, 8)
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

  async function carregarHistorico(): Promise<void> {
    try {
      const dadosSalvos = await AsyncStorage.getItem(CHAVE_REGISTROS);

      if (dadosSalvos === null) {
        setRegistrosHistorico([]);
        return;
      }

      const registros: RegistroClinico[] = JSON.parse(dadosSalvos);

      const dataHoje = obterDataHoje();
      const dataHojeNumero = converterDataParaNumero(dataHoje);

      const registrosAnteriores = registros.filter((registro) => {
        const dataRegistroNumero = converterDataParaNumero(registro.dataRetorno);

        return (
          registro.dataRetorno !== dataHoje &&
          dataRegistroNumero > 0 &&
          dataRegistroNumero < dataHojeNumero
        );
      });

      const registrosOrdenados = registrosAnteriores.sort((a, b) => {
        const dataA = converterDataParaNumero(a.dataRetorno);
        const dataB = converterDataParaNumero(b.dataRetorno);

        if (dataA !== dataB) {
          return dataB - dataA;
        }

        return b.id - a.id;
      });

      setRegistrosHistorico(registrosOrdenados.slice(0, 20));
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível carregar o histórico de consultas.'
      );
    }
  }

  async function pesquisarHistorico(): Promise<void> {
    try {
      const cpfNumerico = cpfBusca.replace(/\D/g, '');

      if (cpfBusca.trim() !== '' && cpfNumerico.length !== 11) {
        Alert.alert('Atenção', 'Digite um CPF válido para pesquisar.');
        return;
      }

      if (dataBusca.trim() !== '' && dataBusca.length !== 10) {
        Alert.alert('Atenção', 'Digite a data no formato dd/mm/aaaa.');
        return;
      }

      const dadosSalvos = await AsyncStorage.getItem(CHAVE_REGISTROS);

      if (dadosSalvos === null) {
        setRegistrosHistorico([]);

        Alert.alert(
          'Histórico vazio',
          'Nenhuma consulta foi registrada até o momento.'
        );

        return;
      }

      const registros: RegistroClinico[] = JSON.parse(dadosSalvos);

      if (registros.length === 0) {
        setRegistrosHistorico([]);

        Alert.alert(
          'Histórico vazio',
          'Nenhuma consulta foi registrada até o momento.'
        );

        return;
      }

      const dataHoje = obterDataHoje();
      const dataHojeNumero = converterDataParaNumero(dataHoje);

      if (dataBusca === dataHoje) {
        setRegistrosHistorico([]);

        Alert.alert(
          'Consulta de hoje',
          'As consultas de hoje aparecem no Dashboard, não no Histórico.'
        );

        return;
      }

      let registrosAnteriores = registros.filter((registro) => {
        const dataRegistroNumero = converterDataParaNumero(registro.dataRetorno);

        return (
          registro.dataRetorno !== dataHoje &&
          dataRegistroNumero > 0 &&
          dataRegistroNumero < dataHojeNumero
        );
      });

      if (cpfBusca.trim() !== '') {
        const tutorExiste = registros.some(
          (registro) => registro.cpfTutor.replace(/\D/g, '') === cpfNumerico
        );

        if (tutorExiste === false) {
          setRegistrosHistorico([]);

          Alert.alert(
            'Tutor não encontrado',
            'Nenhum tutor foi encontrado com o CPF informado.'
          );

          return;
        }

        registrosAnteriores = registrosAnteriores.filter(
          (registro) => registro.cpfTutor.replace(/\D/g, '') === cpfNumerico
        );
      }

      if (dataBusca.trim() !== '') {
        const existeConsultaNaData = registrosAnteriores.some(
          (registro) => registro.dataRetorno === dataBusca
        );

        if (existeConsultaNaData === false) {
          setRegistrosHistorico([]);

          if (cpfBusca.trim() !== '') {
            Alert.alert(
              'Nenhuma consulta encontrada',
              'Esse tutor não possui consultas registradas nessa data.'
            );
          } else {
            Alert.alert(
              'Nenhuma consulta encontrada',
              'Não houve consultas registradas nessa data.'
            );
          }

          return;
        }

        registrosAnteriores = registrosAnteriores.filter(
          (registro) => registro.dataRetorno === dataBusca
        );
      }

      if (registrosAnteriores.length === 0) {
        setRegistrosHistorico([]);

        if (cpfBusca.trim() !== '') {
          Alert.alert(
            'Nenhuma consulta encontrada',
            'Esse tutor não possui consultas anteriores registradas.'
          );
        } else {
          Alert.alert(
            'Nenhuma consulta encontrada',
            'Nenhuma consulta anterior foi encontrada.'
          );
        }

        return;
      }

      const registrosOrdenados = registrosAnteriores.sort((a, b) => {
        const dataA = converterDataParaNumero(a.dataRetorno);
        const dataB = converterDataParaNumero(b.dataRetorno);

        if (dataA !== dataB) {
          return dataB - dataA;
        }

        return b.id - a.id;
      });

      setRegistrosHistorico(registrosOrdenados.slice(0, 20));
    } catch (error) {
      setRegistrosHistorico([]);

      Alert.alert(
        'Erro',
        'Não foi possível pesquisar o histórico de consultas.'
      );
    }
  }

  function limparFiltros(): void {
    setCpfBusca('');
    setDataBusca('');
    carregarHistorico();
  }

  function visualizarRegistro(registro: RegistroClinico): void {
    Alert.alert(
      registro.nomeAnimal,
      'Tutor: ' +
      registro.nomeTutor +
      '\nCPF: ' +
      registro.cpfTutor +
      '\nData: ' +
      registro.dataRetorno +
      '\nEspécie: ' +
      registro.especie +
      '\nRaça: ' +
      (registro.raca.trim() === '' ? 'Não informada' : registro.raca) +
      '\nIdade: ' +
      registro.idade +
      '\nPeso: ' +
      registro.peso +
      ' kg' +
      '\nUrgência: ' +
      registro.urgencia +
      '\n\nObservações:\n' +
      registro.observacoes
    );
  }

  useFocusEffect(
    useCallback(() => {
      carregarHistorico();
    }, [])
  );

  return (
    <ScrollView
      style={{ backgroundColor: cores.fundo }}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: cores.fundo },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.titulo, { color: cores.texto }]}>
        Histórico Clínico
      </Text>

      <Text style={[styles.subtitulo, { color: cores.textoSecundario }]}>
        Consulte os últimos atendimentos já realizados.
      </Text>

      <View
        style={[
          styles.cardFiltro,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.tituloSecao, { color: cores.texto }]}>
          Pesquisar consultas
        </Text>

        <Text style={[styles.label, { color: cores.texto }]}>
          CPF do tutor
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
          placeholder="000.000.000-00"
          placeholderTextColor={cores.textoSecundario}
          value={cpfBusca}
          onChangeText={alterarCpfBusca}
          keyboardType="default"
          maxLength={14}
        />

        <Text style={[styles.label, { color: cores.texto }]}>
          Data da consulta
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
          placeholder="dd/mm/aaaa"
          placeholderTextColor={cores.textoSecundario}
          value={dataBusca}
          onChangeText={alterarDataBusca}
          keyboardType="default"
          maxLength={10}
        />

        <View style={styles.linhaBotoes}>
          <TouchableHighlight
            style={[
              styles.botaoPesquisar,
              { backgroundColor: cores.destaque },
            ]}
            underlayColor="#006F62"
            onPress={pesquisarHistorico}
          >
            <Text style={styles.textoBotao}>Pesquisar</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={[
              styles.botaoLimpar,
              {
                backgroundColor: cores.campo,
                borderColor: cores.borda,
              },
            ]}
            underlayColor="#1C2B3A"
            onPress={limparFiltros}
          >
            <Text style={[styles.textoBotaoLimpar, { color: cores.texto }]}>
              Limpar
            </Text>
          </TouchableHighlight>
        </View>
      </View>

      <View style={styles.cabecalhoLista}>
        <Text style={[styles.tituloSecao, { color: cores.texto }]}>
          Últimas consultas
        </Text>

        <Text style={[styles.contador, { color: cores.textoSecundario }]}>
          {registrosHistorico.length} registros
        </Text>
      </View>

      {registrosHistorico.length === 0 ? (
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
            Nenhuma consulta anterior encontrada.
          </Text>
        </View>
      ) : (
        registrosHistorico.map((registro) => (
          <TouchableHighlight
            key={registro.id}
            style={[
              styles.cardRegistro,
              {
                backgroundColor: cores.card,
                borderColor: cores.borda,
              },
            ]}
            underlayColor={cores.campo}
            onPress={() => visualizarRegistro(registro)}
          >
            <View>
              <View style={styles.linhaTopoRegistro}>
                <View>
                  <Text style={[styles.nomeAnimal, { color: cores.texto }]}>
                    {registro.nomeAnimal}
                  </Text>

                  <Text
                    style={[
                      styles.nomeTutor,
                      { color: cores.textoSecundario },
                    ]}
                  >
                    Tutor: {registro.nomeTutor}
                  </Text>
                </View>

                <View
                  style={[
                    styles.tagUrgencia,
                    { backgroundColor: corUrgencia(registro.urgencia) },
                  ]}
                >
                  <Text style={styles.textoTagUrgencia}>
                    {registro.urgencia.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.linhaDetalhes}>
                <Text
                  style={[styles.textoDetalhe, { color: cores.textoSecundario }]}
                >
                  CPF: {registro.cpfTutor}
                </Text>

                <Text
                  style={[styles.textoDetalhe, { color: cores.textoSecundario }]}
                >
                  Data: {registro.dataRetorno}
                </Text>
              </View>

              <Text style={[styles.motivo, { color: cores.texto }]}>
                {registro.observacoes}
              </Text>
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
    paddingTop: 58,
    paddingBottom: 120,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    marginBottom: 22,
  },
  cardFiltro: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
  },
  tituloSecao: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
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
  linhaBotoes: {
    flexDirection: 'row',
    marginTop: 14,
  },
  botaoPesquisar: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  botaoLimpar: {
    width: 105,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  textoBotaoLimpar: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  cabecalhoLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contador: {
    fontSize: 13,
  },
  cardVazio: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
  textoVazio: {
    fontSize: 14,
    textAlign: 'center',
  },
  cardRegistro: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  linhaTopoRegistro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  nomeAnimal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nomeTutor: {
    fontSize: 13,
  },
  tagUrgencia: {
    borderRadius: 12,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
  },
  textoTagUrgencia: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  linhaDetalhes: {
    marginBottom: 10,
  },
  textoDetalhe: {
    fontSize: 13,
    marginBottom: 3,
  },
  motivo: {
    fontSize: 14,
    lineHeight: 20,
  },
});