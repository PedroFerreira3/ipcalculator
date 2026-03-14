import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      navbar: {
        cidrReference: 'CIDR Reference',
        rfc1918: 'RFC 1918',
      },
      hero: {
        kicker: 'IPv4 Toolkit',
        title: 'IP Calculator',
        subtitle: 'Enter an address in CIDR or IP + netmask format to calculate network details.',
      },
      input: {
        ipAddress: 'IP Address',
        maskFormat: 'Mask format',
        cidrBit: 'CIDR Bit',
        netmask: 'Netmask',
        commonPresets: 'Common presets',
        selectPreset: 'Select a preset...',
        calculate: 'Calculate',
        copyInput: 'Copy formatted input',
        copied: 'Copied!',
        randomIp: 'Generate random IP and mask',
        clearCidr: 'Clear CIDR bit',
        errors: {
          fillIpOctets: 'Fill all IP octets',
          enterCidr: 'Enter a CIDR bit between 0 and 32',
          fillMaskOctets: 'Fill all netmask octets',
          unableToParse: 'Unable to parse input',
        },
      },
      result: {
        title: 'Network Result',
        copyAll: 'Copy all as table',
        copied: 'Copied!',
        decimal: 'Decimal',
        binary: 'Binary',
        fields: {
          address: 'Address',
          netmask: 'Netmask',
          network: 'Network',
          broadcast: 'Broadcast',
          hostMin: 'Host Min',
          hostMax: 'Host Max',
          wildcard: 'Wildcard',
          hostsPerNet: 'Hosts / Net',
        },
        hint: {
          title: 'Network Result',
          description: 'Fill in the IP address and mask, then click Calculate to see the network details.',
          example1: '192.168.1.10/24',
          example2: '192.168.1.10 255.255.255.0',
        },
      },
      ranges: {
        title: 'IP Ranges Reserved for Internal Use (Private Networks)',
        ariaLabel: 'Private IPv4 ranges',
        colClass: 'Class',
        colStart: 'Starting IP',
        colEnd: 'Ending IP',
        colMask: 'Subnet Mask',
      },
      footer: {
        note: 'IPv4 network analysis tool — results are for informational purposes only',
      },
      help: {
        title: 'How to use',
        close: 'Close',
        steps: [
          {
            title: 'Enter the IP Address',
            description: 'Fill in each of the 4 octets (0–255). Use Tab or "." to move between fields. You can also paste a full address like 192.168.1.10.',
          },
          {
            title: 'Choose the mask format',
            description: 'Use "Bit / CIDR" to enter a prefix like /24, or "Netmask" to enter a dotted mask like 255.255.255.0. Both formats produce the same result.',
          },
          {
            title: 'Use presets for common masks',
            description: 'The "Common presets" dropdown lets you quickly pick standard masks (/8, /16, /24, etc.) without typing.',
          },
          {
            title: 'Generate a random address',
            description: 'Click the dice button (top-right of the form) to auto-fill a random IP and mask — useful for testing.',
          },
          {
            title: 'Calculate',
            description: 'Click "Calculate" to compute the network details: network address, broadcast, host range, wildcard mask, and total hosts.',
          },
          {
            title: 'Read the results',
            description: 'Switch between Decimal and Binary tabs to see the values in different formats. Use the copy icon on each row to copy individual values, or the copy icon next to "Network Result" to copy everything as a table.',
          },
        ],
      },
    },
  },
  es: {
    translation: {
      navbar: {
        cidrReference: 'Referencia CIDR',
        rfc1918: 'RFC 1918',
      },
      hero: {
        kicker: 'Herramienta IPv4',
        title: 'Calculadora IP',
        subtitle: 'Ingrese una dirección en formato CIDR o IP + máscara de red para calcular los detalles de la red.',
      },
      input: {
        ipAddress: 'Dirección IP',
        maskFormat: 'Formato de máscara',
        cidrBit: 'Bit CIDR',
        netmask: 'Máscara de red',
        commonPresets: 'Presets comunes',
        selectPreset: 'Seleccionar preset...',
        calculate: 'Calcular',
        copyInput: 'Copiar entrada formateada',
        copied: '¡Copiado!',
        randomIp: 'Generar IP y máscara aleatorias',
        clearCidr: 'Limpiar bit CIDR',
        errors: {
          fillIpOctets: 'Complete todos los octetos de IP',
          enterCidr: 'Ingrese un bit CIDR entre 0 y 32',
          fillMaskOctets: 'Complete todos los octetos de la máscara',
          unableToParse: 'No se pudo analizar la entrada',
        },
      },
      result: {
        title: 'Resultado de Red',
        copyAll: 'Copiar todo como tabla',
        copied: '¡Copiado!',
        decimal: 'Decimal',
        binary: 'Binario',
        fields: {
          address: 'Dirección',
          netmask: 'Máscara',
          network: 'Red',
          broadcast: 'Broadcast',
          hostMin: 'Host Mín',
          hostMax: 'Host Máx',
          wildcard: 'Comodín',
          hostsPerNet: 'Hosts / Red',
        },
        hint: {
          title: 'Resultado de Red',
          description: 'Complete la dirección IP y la máscara, luego haga clic en Calcular para ver los detalles de la red.',
          example1: '192.168.1.10/24',
          example2: '192.168.1.10 255.255.255.0',
        },
      },
      ranges: {
        title: 'Rangos IP Reservados para Uso Interno (Redes Privadas)',
        ariaLabel: 'Rangos IPv4 privados',
        colClass: 'Clase',
        colStart: 'IP Inicial',
        colEnd: 'IP Final',
        colMask: 'Máscara de subred',
      },
      footer: {
        note: 'Herramienta de análisis de redes IPv4 — los resultados son solo informativos',
      },
      help: {
        title: 'Cómo usar',
        close: 'Cerrar',
        steps: [
          {
            title: 'Ingrese la dirección IP',
            description: 'Complete cada uno de los 4 octetos (0–255). Use Tab o "." para moverse entre campos. También puede pegar una dirección completa como 192.168.1.10.',
          },
          {
            title: 'Elija el formato de máscara',
            description: 'Use "Bit / CIDR" para ingresar un prefijo como /24, o "Máscara de red" para ingresar una máscara como 255.255.255.0. Ambos formatos producen el mismo resultado.',
          },
          {
            title: 'Use presets para máscaras comunes',
            description: 'El desplegable "Presets comunes" le permite seleccionar rápidamente máscaras estándar (/8, /16, /24, etc.) sin escribir.',
          },
          {
            title: 'Genere una dirección aleatoria',
            description: 'Haga clic en el botón de dado (arriba a la derecha) para auto-completar una IP y máscara aleatorias — útil para pruebas.',
          },
          {
            title: 'Calcular',
            description: 'Haga clic en "Calcular" para obtener los detalles de la red: dirección de red, broadcast, rango de hosts, máscara wildcard y total de hosts.',
          },
          {
            title: 'Lea los resultados',
            description: 'Alterne entre las pestañas Decimal y Binario para ver los valores en distintos formatos. Use el ícono de copiar en cada fila para copiar valores individuales, o el ícono junto a "Resultado de Red" para copiar todo como tabla.',
          },
        ],
      },
    },
  },
  'pt-BR': {
    translation: {
      navbar: {
        cidrReference: 'Referência CIDR',
        rfc1918: 'RFC 1918',
      },
      hero: {
        kicker: 'Ferramenta IPv4',
        title: 'Calculadora IP',
        subtitle: 'Insira um endereço no formato CIDR ou IP + máscara de rede para calcular os detalhes da rede.',
      },
      input: {
        ipAddress: 'Endereço IP',
        maskFormat: 'Formato da máscara',
        cidrBit: 'Bit CIDR',
        netmask: 'Máscara de rede',
        commonPresets: 'Presets comuns',
        selectPreset: 'Selecionar preset...',
        calculate: 'Calcular',
        copyInput: 'Copiar entrada formatada',
        copied: 'Copiado!',
        randomIp: 'Gerar IP e máscara aleatórios',
        clearCidr: 'Limpar bit CIDR',
        errors: {
          fillIpOctets: 'Preencha todos os octetos do IP',
          enterCidr: 'Insira um bit CIDR entre 0 e 32',
          fillMaskOctets: 'Preencha todos os octetos da máscara',
          unableToParse: 'Não foi possível interpretar a entrada',
        },
      },
      result: {
        title: 'Resultado da Rede',
        copyAll: 'Copiar tudo como tabela',
        copied: 'Copiado!',
        decimal: 'Decimal',
        binary: 'Binário',
        fields: {
          address: 'Endereço',
          netmask: 'Máscara',
          network: 'Rede',
          broadcast: 'Broadcast',
          hostMin: 'Host Mín',
          hostMax: 'Host Máx',
          wildcard: 'Wildcard',
          hostsPerNet: 'Hosts / Rede',
        },
        hint: {
          title: 'Resultado da Rede',
          description: 'Preencha o endereço IP e a máscara e clique em Calcular para ver os detalhes da rede.',
          example1: '192.168.1.10/24',
          example2: '192.168.1.10 255.255.255.0',
        },
      },
      ranges: {
        title: 'Faixas de IP Reservadas para Uso Interno (Redes Privadas)',
        ariaLabel: 'Faixas IPv4 privadas',
        colClass: 'Classe',
        colStart: 'IP Inicial',
        colEnd: 'IP Final',
        colMask: 'Máscara de sub-rede',
      },
      footer: {
        note: 'Ferramenta de análise de redes IPv4 — os resultados são apenas informativos',
      },
      help: {
        title: 'Como usar',
        close: 'Fechar',
        steps: [
          {
            title: 'Insira o Endereço IP',
            description: 'Preencha cada um dos 4 octetos (0–255). Use Tab ou "." para navegar entre os campos. Você também pode colar um endereço completo como 192.168.1.10.',
          },
          {
            title: 'Escolha o formato da máscara',
            description: 'Use "Bit / CIDR" para inserir um prefixo como /24, ou "Máscara de rede" para inserir uma máscara como 255.255.255.0. Os dois formatos produzem o mesmo resultado.',
          },
          {
            title: 'Use presets para máscaras comuns',
            description: 'O dropdown "Presets comuns" permite selecionar rapidamente máscaras padrão (/8, /16, /24, etc.) sem precisar digitar.',
          },
          {
            title: 'Gere um endereço aleatório',
            description: 'Clique no botão de dado (canto superior direito do formulário) para preencher automaticamente um IP e máscara aleatórios — útil para testes.',
          },
          {
            title: 'Calcular',
            description: 'Clique em "Calcular" para obter os detalhes da rede: endereço de rede, broadcast, faixa de hosts, máscara wildcard e total de hosts.',
          },
          {
            title: 'Leia os resultados',
            description: 'Alterne entre as abas Decimal e Binário para ver os valores em formatos diferentes. Use o ícone de copiar em cada linha para copiar valores individuais, ou o ícone ao lado de "Resultado da Rede" para copiar tudo como tabela.',
          },
        ],
      },
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
