import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

type ConfiguracoesApp = {
  temaClaro: boolean;
  notificacoesAtivas: boolean;
  modoDemonstrativo: boolean;
  atualizadoEm: string;
};

const CHAVE_CONFIGURACOES = '@animed:configuracoesApp';
const CHAVE_REGISTROS = '@animed:registrosClinicos';
const CHAVE_PERFIL = '@animed:perfilUsuario';

const CONFIGURACOES_PADRAO: ConfiguracoesApp = {
  temaClaro: false,
  notificacoesAtivas: true,
  modoDemonstrativo: true,
  atualizadoEm: new Date().toISOString(),
};

export default function ConfiguracoesScreen(): React.ReactElement {
  const [configuracoes, setConfiguracoes] =
    useState<ConfiguracoesApp>(CONFIGURACOES_PADRAO);

  const [totalRegistros, setTotalRegistros] = useState<number>(0);

  const cores = configuracoes.temaClaro
    ? {
        fundo: '#F2F6FA',
        card: '#FFFFFF',
        campo: '#EAF2F7',
        borda: '#B8C6D6',
        texto: '#102033',
        textoSecundario: '#6B7A8C',
        destaque: '#008B7A',
        destaqueClaro: '#00A693',
        perigo: '#C62828',
      }
    : {
        fundo: '#07111F',
        card: '#172232',
        campo: '#171A22',
        borda: '#23415A',
        texto: '#FFFFFF',
        textoSecundario: '#8A96A8',
        destaque: '#008B7A',
        destaqueClaro: '#00C2A8',
        perigo: '#D62828',
      };

  useEffect(() => {
    carregarConfiguracoes();
    carregarResumoLocal();
  }, []);

  async function carregarConfiguracoes(): Promise<void> {
    try {
      const dadosSalvos = await AsyncStorage.getItem(CHAVE_CONFIGURACOES);

      if (dadosSalvos !== null) {
        const configuracoesSalvas: ConfiguracoesApp = JSON.parse(dadosSalvos);
        setConfiguracoes(configuracoesSalvas);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as configurações.');
    }
  }

  async function carregarResumoLocal(): Promise<void> {
    try {
      const registrosSalvos = await AsyncStorage.getItem(CHAVE_REGISTROS);

      if (registrosSalvos === null) {
        setTotalRegistros(0);
        return;
      }

      const registros = JSON.parse(registrosSalvos);

      if (Array.isArray(registros)) {
        setTotalRegistros(registros.length);
      } else {
        setTotalRegistros(0);
      }
    } catch (error) {
      setTotalRegistros(0);
    }
  }

  async function salvarConfiguracoes(
    novasConfiguracoes: ConfiguracoesApp
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        CHAVE_CONFIGURACOES,
        JSON.stringify(novasConfiguracoes)
      );

      setConfiguracoes(novasConfiguracoes);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as configurações.');
    }
  }

  function atualizarConfiguracao(
    campo: keyof ConfiguracoesApp,
    valor: boolean
  ): void {
    const novasConfiguracoes: ConfiguracoesApp = {
      ...configuracoes,
      [campo]: valor,
      atualizadoEm: new Date().toISOString(),
    };

    salvarConfiguracoes(novasConfiguracoes);
  }

  function confirmarLimpezaRegistros(): void {
    Alert.alert(
      'Limpar registros clínicos',
      'Essa ação apagará todos os registros clínicos salvos localmente. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: limparRegistrosClinicos,
        },
      ]
    );
  }

  async function limparRegistrosClinicos(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHAVE_REGISTROS);

      setTotalRegistros(0);

      Alert.alert('Registros clínicos', 'Os registros foram removidos.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível limpar os registros clínicos.');
    }
  }

  function confirmarRestaurarPerfil(): void {
    Alert.alert(
      'Restaurar perfil',
      'Essa ação apagará os dados editados do perfil e voltará para o perfil padrão. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: restaurarPerfil,
        },
      ]
    );
  }

  async function restaurarPerfil(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHAVE_PERFIL);

      Alert.alert('Perfil', 'Os dados do perfil foram restaurados.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível restaurar o perfil.');
    }
  }

  function confirmarLimparTudo(): void {
    Alert.alert(
      'Limpar todos os dados',
      'Essa ação apagará configurações, perfil e registros clínicos salvos no dispositivo. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar tudo',
          style: 'destructive',
          onPress: limparTodosOsDados,
        },
      ]
    );
  }

  async function limparTodosOsDados(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        CHAVE_CONFIGURACOES,
        CHAVE_REGISTROS,
        CHAVE_PERFIL,
      ]);

      setConfiguracoes(CONFIGURACOES_PADRAO);
      setTotalRegistros(0);

      Alert.alert('Dados locais', 'Todos os dados locais foram removidos.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível limpar os dados locais.');
    }
  }

  function formatarDataAtualizacao(dataIso: string): string {
    try {
      const data = new Date(dataIso);

      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = String(data.getFullYear());

      const hora = String(data.getHours()).padStart(2, '0');
      const minuto = String(data.getMinutes()).padStart(2, '0');

      return dia + '/' + mes + '/' + ano + ' às ' + hora + ':' + minuto;
    } catch (error) {
      return 'Não informado';
    }
  }

  return (
    <ScrollView
      style={{ backgroundColor: cores.fundo }}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: cores.fundo },
      ]}
    >
      <Text style={[styles.titulo, { color: cores.texto }]}>
        Configurações
      </Text>

      <Text style={[styles.subtitulo, { color: cores.textoSecundario }]}>
        Gerencie preferências, dados locais e modo demonstrativo.
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.tituloSecao, { color: cores.texto }]}>
          Preferências do aplicativo
        </Text>

        <View style={styles.linhaConfiguracao}>
          <View style={styles.areaTextoConfiguracao}>
            <Text style={[styles.nomeConfiguracao, { color: cores.texto }]}>
              Tema claro
            </Text>

            <Text
              style={[
                styles.descricaoConfiguracao,
                { color: cores.textoSecundario },
              ]}
            >
              Alterna a aparência visual desta tela.
            </Text>
          </View>

          <Switch
            value={configuracoes.temaClaro}
            onValueChange={(valor) =>
              atualizarConfiguracao('temaClaro', valor)
            }
            trackColor={{ false: '#31445F', true: '#008B7A' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.divisor} />

        <View style={styles.linhaConfiguracao}>
          <View style={styles.areaTextoConfiguracao}>
            <Text style={[styles.nomeConfiguracao, { color: cores.texto }]}>
              Notificações
            </Text>

            <Text
              style={[
                styles.descricaoConfiguracao,
                { color: cores.textoSecundario },
              ]}
            >
              Simula notificações de retornos e consultas.
            </Text>
          </View>

          <Switch
            value={configuracoes.notificacoesAtivas}
            onValueChange={(valor) =>
              atualizarConfiguracao('notificacoesAtivas', valor)
            }
            trackColor={{ false: '#31445F', true: '#008B7A' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.divisor} />

        <View style={styles.linhaConfiguracao}>
          <View style={styles.areaTextoConfiguracao}>
            <Text style={[styles.nomeConfiguracao, { color: cores.texto }]}>
              Modo demonstrativo
            </Text>

            <Text
              style={[
                styles.descricaoConfiguracao,
                { color: cores.textoSecundario },
              ]}
            >
              Mantém o app usando dados locais e mockados.
            </Text>
          </View>

          <Switch
            value={configuracoes.modoDemonstrativo}
            onValueChange={(valor) =>
              atualizarConfiguracao('modoDemonstrativo', valor)
            }
            trackColor={{ false: '#31445F', true: '#008B7A' }}
            thumbColor="#FFFFFF"
          />
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
        <Text style={[styles.tituloSecao, { color: cores.texto }]}>
          Armazenamento local
        </Text>

        <View style={styles.itemResumo}>
          <Text style={[styles.textoResumo, { color: cores.textoSecundario }]}>
            Registros clínicos salvos
          </Text>

          <Text style={[styles.valorResumo, { color: cores.texto }]}>
            {totalRegistros}
          </Text>
        </View>

        <View style={styles.itemResumo}>
          <Text style={[styles.textoResumo, { color: cores.textoSecundario }]}>
            Banco local
          </Text>

          <Text style={[styles.valorResumo, { color: cores.texto }]}>
            AsyncStorage
          </Text>
        </View>

        <View style={styles.itemResumo}>
          <Text style={[styles.textoResumo, { color: cores.textoSecundario }]}>
            Última alteração
          </Text>

          <Text style={[styles.valorResumo, { color: cores.texto }]}>
            {formatarDataAtualizacao(configuracoes.atualizadoEm)}
          </Text>
        </View>

        <TouchableHighlight
          style={[
            styles.botaoSecundario,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
            },
          ]}
          underlayColor="#1C2B3A"
          onPress={carregarResumoLocal}
        >
          <Text style={[styles.textoBotaoSecundario, { color: cores.texto }]}>
            Atualizar resumo
          </Text>
        </TouchableHighlight>
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
        <Text style={[styles.tituloSecao, { color: cores.texto }]}>
          Manutenção dos dados
        </Text>

        <TouchableHighlight
          style={[
            styles.botaoSecundario,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
            },
          ]}
          underlayColor="#1C2B3A"
          onPress={confirmarRestaurarPerfil}
        >
          <Text style={[styles.textoBotaoSecundario, { color: cores.texto }]}>
            Restaurar perfil padrão
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={[
            styles.botaoSecundario,
            {
              backgroundColor: cores.campo,
              borderColor: cores.borda,
            },
          ]}
          underlayColor="#1C2B3A"
          onPress={confirmarLimpezaRegistros}
        >
          <Text style={[styles.textoBotaoSecundario, { color: cores.texto }]}>
            Limpar registros clínicos
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={[styles.botaoPerigo, { backgroundColor: cores.perigo }]}
          underlayColor="#8B0000"
          onPress={confirmarLimparTudo}
        >
          <Text style={styles.textoBotaoPerigo}>
            Limpar todos os dados locais
          </Text>
        </TouchableHighlight>
      </View>

      <View
        style={[
          styles.cardInfo,
          {
            backgroundColor: cores.card,
            borderColor: cores.borda,
          },
        ]}
      >
        <Text style={[styles.tituloSecao, { color: cores.texto }]}>
          Sobre o Animed
        </Text>

        <Text style={[styles.textoInfo, { color: cores.textoSecundario }]}>
          Versão 1.0.0
        </Text>

        <Text style={[styles.textoInfo, { color: cores.textoSecundario }]}>
          Aplicativo mobile para registro e acompanhamento clínico veterinário.
        </Text>

        <Text style={[styles.textoInfo, { color: cores.textoSecundario }]}>
          Dados armazenados localmente em modo demonstrativo.
        </Text>
      </View>
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
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  cardInfo: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  tituloSecao: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  linhaConfiguracao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  areaTextoConfiguracao: {
    flex: 1,
    paddingRight: 14,
  },
  nomeConfiguracao: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descricaoConfiguracao: {
    fontSize: 12,
    lineHeight: 17,
  },
  divisor: {
    height: 1,
    backgroundColor: '#23415A',
    marginTop: 14,
    marginBottom: 14,
  },
  itemResumo: {
    marginBottom: 12,
  },
  textoResumo: {
    fontSize: 13,
    marginBottom: 3,
  },
  valorResumo: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  botaoSecundario: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  textoBotaoSecundario: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  botaoPerigo: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  textoBotaoPerigo: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textoInfo: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
  },
});