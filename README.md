# menu-cms

CMS (sistema de gerenciamento de conteúdo) do restaurante **Mater Burguer**. É a interface administrativa usada pela equipe para gerenciar o cardápio digital e acompanhar os pedidos.

O CMS consome a API NestJS (`menu-backend`) desenvolvida no primeiro bimestre. Nenhum dado fica fixo no código: tudo vem da API.

## Funcionalidades

| Área | O que faz |
|---|---|
| **Categorias** | Listar, cadastrar, editar e excluir (nome, ícone, ordem de exibição e situação) |
| **Produtos** | Listar, cadastrar, editar e excluir, com filtro por categoria, preço em reais e indicadores de vegetariano e novidade |
| **Mesas** | Listar, cadastrar, editar e excluir |
| **Comandas** | Listar as comandas em aberto (mesa, data de abertura e total acumulado) e abrir o detalhe de cada uma |
| **Pedidos** | Ver os pedidos de uma comanda (itens, quantidades, preços e totais) e alterar o status |
| **Kanban** (bônus) | Quadro com uma coluna por status; arrastar um cartão altera o status do pedido na API |

Todas as telas tratam os estados de carregamento, erro e lista vazia. Cada cadastro, edição, exclusão ou alteração de status mostra uma mensagem (toast) de sucesso ou erro.

## Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Axios**: uma única instância (`src/lib/axios.ts`), com o `baseURL` lido de `VITE_API_URL`
- **TanStack Query**: `useQuery` para as leituras e `useMutation` para as gravações, com `invalidateQueries` após o sucesso

## Como executar

### Pré-requisitos

- Node.js 20.19 ou superior
- O `menu-backend` rodando, por padrão em `http://localhost:3000`

### Passos

```bash
# 1. Instalar as dependências
npm install

# 2. Criar o arquivo de variáveis de ambiente a partir do exemplo
cp .env.example .env

# 3. Rodar em modo de desenvolvimento
npm run dev
```

Depois, acesse `http://localhost:5173`.

### Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_URL` | Endereço da API (menu-backend) | `http://localhost:3000` |

## Estrutura do projeto

O projeto segue a mesma organização do `menu-frontend` trabalhado em sala:

```
src/
├── cases/                  # um módulo por área do sistema
│   ├── categories/
│   ├── products/
│   ├── spots/              # mesas
│   ├── guest-checks/       # comandas
│   └── orders/             # pedidos e Kanban
│       ├── components/     # componentes da área (formulários, cartões...)
│       ├── dtos/           # tipos dos dados da API
│       ├── hooks/          # useQuery / useMutation (TanStack Query)
│       └── services/       # chamadas à API (Axios)
├── components/
│   ├── layout/             # menu lateral
│   ├── ui/                 # componentes do shadcn/ui
│   ├── confirm-delete-dialog.tsx
│   └── list-state.tsx      # estados de carregando / erro / vazio
├── lib/
│   ├── axios.ts            # instância única do Axios
│   ├── api-error.ts        # mensagem de erro da API para os toasts
│   └── format.ts           # formatação de moeda (R$) e data
└── pages/                  # uma página por rota
```

O caminho dos dados é sempre o mesmo: **página → hook (TanStack Query) → service (Axios) → API**.

## Dependências fora da stack obrigatória

| Dependência | Justificativa |
|---|---|
| `sonner` | É a biblioteca usada pelo componente de toast do shadcn/ui (`npx shadcn add sonner`). Mostra as mensagens de sucesso e erro após cada operação. |
| `next-themes` | Instalada automaticamente pelo componente `sonner` do shadcn/ui, que a usa para seguir o tema claro/escuro. |
| `@dnd-kit/core` | Arrastar e soltar (drag and drop) dos cartões no Kanban de pedidos (bônus). Biblioteca permitida no enunciado. |

Já eram usadas no `menu-frontend` em sala: `react-router-dom` (rotas e menu de navegação), `lucide-react` (ícones) e `cn` (junção de classes CSS). As demais (`@base-ui/react`, `class-variance-authority`, `tw-animate-css`, `@fontsource-variable/*`) são dependências do próprio shadcn/ui e do Tailwind.

## Rotas da API utilizadas

| Método | Rota | Uso |
|---|---|---|
| GET, POST, PATCH, DELETE | `/categories` | Categorias |
| GET, POST, PATCH, DELETE | `/products` (`?categoryId=`) | Produtos e filtro por categoria |
| GET, POST, PATCH, DELETE | `/spots` | Mesas |
| GET | `/guest-checks?status=OPENED` e `/guest-checks/:id` | Comandas em aberto e detalhe |
| GET | `/orders` (`?guestCheckId=`) | Pedidos (de uma comanda ou todos, no Kanban) |
| PATCH | `/orders/:id/status` | Alteração de status do pedido |

Para atender ao CMS, o `menu-backend` foi atualizado com os campos `icon` e `displayOrder` em categorias, os campos `vegetarian` e `isNew` em produtos, a listagem de comandas com o total acumulado, o filtro de pedidos por comanda e as transições livres entre os status (`NEW`, `PREPARING`, `READY`, `DELIVERED`).