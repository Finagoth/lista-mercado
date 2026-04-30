# 🛒 Lista de Compras

Aplicação web para organizar as compras do mercado com controle de produtos, quantidades e preços — tudo salvo automaticamente no navegador.

![Preview](https://img.shields.io/badge/status-concluído-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 📋 Sobre o projeto

A ideia surgiu da necessidade de ter uma ferramenta objetiva para montar a lista de mercado com controle real de quanto será gasto antes mesmo de sair de casa. Diferente de projetos apenas demonstrativos, esta aplicação resolve um problema cotidiano de forma direta e prática.

---

## ✨ Funcionalidades

- ➕ Adicionar produtos com nome, quantidade e preço unitário
- ➕➖ Controlar a quantidade de cada item diretamente na lista
- 💰 Cálculo automático do subtotal por item e do total geral
- ✏️ Editar nome, quantidade e preço de qualquer item
- ✕ Cancelar edição sem perder os dados anteriores
- 🗑️ Remover itens individualmente ou limpar toda a lista
- 💾 Persistência com `localStorage` — a lista é mantida ao recarregar a página

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica da aplicação |
| CSS3 | Estilização, animações e responsividade |
| JavaScript | Lógica, manipulação do DOM e persistência |
| localStorage | Armazenamento dos dados no navegador |

---

## 📁 Estrutura de arquivos

```
lista-compras/
├── index.html   # Estrutura HTML da aplicação
├── style.css    # Estilos, layout e animações
└── app.js       # Lógica da aplicação
```

---

## 🚀 Como usar

Não requer instalação, build ou servidor. Basta:

1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/lista-compras.git
```

2. Abrir o arquivo `index.html` no navegador

Pronto. A aplicação já está funcionando.

---

## 📱 Layout

O projeto é totalmente responsivo e funciona em dispositivos móveis e desktop. O design utiliza uma paleta de cores quente com tipografia **Playfair Display** e **DM Sans**.

---

## 🧠 Decisões técnicas

- **Sem frameworks** — JavaScript puro para manter o projeto leve e sem dependências
- **Arquivos separados** — HTML, CSS e JS com responsabilidades bem definidas
- **Código em português** — variáveis, funções e textos escritos em pt-BR para maior acessibilidade
- **localStorage** — persistência simples e eficaz sem necessidade de backend
- **Sem comentários no código** — nomes de funções e variáveis autoexplicativos

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com 🧡 por [seu nome](https://github.com/Finagoth)
