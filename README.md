# Starian Tech Challenge — Angular 21

> Teste técnico para a vaga de Desenvolvedor Frontend na **Starian**. Aplicação SPA construída com **Angular 21**, consumindo a [Fake Store API](https://fakestore-eapi.com) para simular um painel administrativo completo com autenticação, gestão de produtos, usuários e carrinhos.

---

## 🔌 Cobertura de APIs

CRUD completo em todos os domínios disponíveis na Fake Store API:

| Domínio | Operações |
|---|---|
| **Auth** | Login (JWT), Register |
| **Usuário logado** | Visualização de perfil via token |
| **Produtos** | Listar, adicionar, editar, excluir |
| **Usuários** | Listar, adicionar, editar, excluir, visualizar carrinhos |
| **Carrinhos** | Listar por usuário, adicionar, editar, excluir, gerenciar itens |

> **Extra — Dashboard analítico:** além do CRUD, os dados de produtos são utilizados para gerar um painel com cards de estatísticas (total de produtos, média de preço, melhor avaliado) e gráficos de distribuição por categoria e produtos mais bem avaliados.

---

## ⚠️ Fake Store API — Limitações

**Mutações não persistem dados.** POST/PUT/DELETE retornam sucesso simulado, mas o próximo GET traz os dados originais. Após criar, editar ou excluir um registro a tela não reflete a alteração — mas via DevTools (Network) é possível confirmar que o payload foi enviado corretamente e a resposta retornou com status e body esperados. Essa é uma **limitação da API**, não da implementação.

---

## ⚙️ Decisões Técnicas

**Dependências externas mínimas** —  Todos os componentes de UI foram construídos manualmente para demonstrar componentização. De toda a suite PrimeNG, foi utilizado somente o `DialogService` para abertura de modais.

**Angular 21 — APIs modernas**
- `Signal Forms` recurso de formularios Angular 21 para gerenciamento de formulários reativos integrados ao sistema de Signals
- `httpResource()` para todas as leituras GET, expondo `isLoading`, `value()` e `error()` como Signals nativamente — conforme orientação da documentação oficial
- `HttpClient` com Observables para mutações (POST, PUT, DELETE) — todas as requisições possuem tratamento de erro com feedback visual ao usuário via `ToastrService` e estado de loading controlado por Signal
- `signal()` e `computed()` para todo o estado local e derivado — sem `BehaviorSubject` ou stores externas
- `effect()` para efeitos reativos como persistência no `localStorage` e reposicionamento de tooltip
- `input()`, `output()`, `model()`, `contentChild()` substituindo as APIs baseadas em decorators
- `inject()` funcional em todos os serviços — sem constructor injection
- Controle de fluxo nativo `@if`, `@for`, `@switch` — sem `*ngIf` ou `*ngFor`
- Standalone Components como padrão, sem declaração explícita de `standalone: true` (Angular 20+)

**Filtros e Ordenação no Frontend** — a Fake Store API não possui endpoints de filtro ou ordenação. Toda essa lógica foi implementada com `computed()` e Signals sobre os dados em memória: filtro por texto, filtro por categoria (multi-seleção) e ordenação por coluna.

**Padronização de Styles** — sistema de design com tokens SCSS centralizados (`_variables.scss`) cobrindo cores semânticas, espaçamentos, tipografia, bordas, sombras, z-indexes e transições. Cada componente importa apenas o que precisa via `@use`.

---

## 🗂 Arquitetura

Feature-Based + Atomic Design:

```
src/app/
├── core/      
├── features/
│   ├── auth/        
│   └── starian-project-hub/
│       ├── layout/   
│       ├── pages/   
│       └── services/ 
└── shared/
    ├── components/
    │   ├── atoms/     
    │   ├── molecules/ 
    │   └── organisms/ 
    ├── directives/    
    ├── services/     
    └── utils/         
```

---

## 🔐 Autenticação & Guards

- JWT armazenado no `sessionStorage` e mantido como `signal()` no `TokenService` — o ideal em produção seria `httpOnly cookie`, mas a Fake Store API retorna o token apenas no body da resposta, sem suporte a cookies, o que torna essa abordagem inviável no contexto do desafio
- `isAuthenticated` e `userId` são `computed()` derivados do token, consumidos diretamente pelos guards e pelo `httpResource` do perfil
- `authenticatedGuard` e `unauthenticatedGuard` como `CanMatchFn` — sem classes
- `authInterceptor` injeta `Authorization: Bearer <token>` em todas as requisições e redireciona para `/login` em caso de `401`
- Todas as páginas privadas carregam via `loadComponent` (lazy loading)

---

## 🚀 Como Executar

### 🌐 Demo online

**[https://starian-tech-challenge.vercel.app](https://starian-tech-challenge.vercel.app)**

**Credenciais de teste:** `johnd / m38rmF$` · `mor_2314 / 83r5^_` · `kevinryan / kev02937@`

### Localmente

```bash
npm install && npm start  
```

---

## 🧪 Testes Unitários (Jest)

Configurado com **Jest** + `jest-preset-angular`.

```bash
npm test                 
npm run test:coverage   
```

Coverage proxima a 80%, cobrindo guards, interceptor, services (auth, token, filtros, integração, toastr), componentes (tabela, botão, inputs, sidebar, avatar, tag, confirm-modal), diretivas (sort, numbers-only) e utils.

---

<p align="center">Desenvolvido por <strong>Eduardo Maciel</strong> · Angular 21 · 2025</p>
