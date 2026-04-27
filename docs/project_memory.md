# 🌑 MoonArk | Memória do Projeto

Este documento serve como o repositório central de conhecimento sobre a evolução, arquitetura e decisões técnicas do projeto **MoonArk**.

## 🚀 Visão Geral
A MoonArk é uma plataforma de arquivamento de dados interestelar e IA cognitiva, projetada para preservar o conhecimento humano fora da Terra. O site foi desenvolvido com foco em estética premium, performance e resiliência.

---

## 🛠 Stack Tecnológica
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (via CDN).
- **Backend/Serviços**:
    - **Firebase Hosting**: Hospedagem global com URLs limpas.
    - **Firebase Auth**: Autenticação robusta (Google e E-mail/Senha).
    - **Firebase Analytics**: Monitoramento de tráfego.
    - **Google Groups**: Gerenciamento de comunidade e newsletter.
    - **Google Apps Script (GAS)**: Sincronização inicial e lógica de backend legado.

---

## 🏛 Arquitetura e Estrutura de Arquivos

### Arquivos Principais
- `index.html`: Página inicial (Missão) e ponto de entrada do Hosting.
- `tech.html`: Detalhes da infraestrutura tecnológica e IA.
- `partner.html`: Ecossistema de parceiros e integrações.
- `invest.html`: Portal para investidores e consultoria.
- `Código.js`: Lógica legado para Google Apps Script.

### Configurações
- `firebase.json`: Configurações de Hosting (cleanUrls, ignore patterns).
- `.firebaserc`: Vínculo com o projeto `moonark-project`.
- `.clasp.json`: Sincronização com o ambiente Google Apps Script.

---

## ✅ Conquistas e Implementações

### 1. Design & UI
- **Alinhamento**: Todos os botões "Acessar Terminal" foram fixados à direita para um layout limpo.
- **Otimização de Imagens**: Ícones externos (como o do Google no Login) foram convertidos para **Data URLs (Base64)** otimizadas, reduzindo requisições HTTP e garantindo carregamento instantâneo.
- **Menus**: Navegação reativada em todas as páginas com transições suaves e estados ativos.

### 2. Infraestrutura Firebase
- **Deploy**: Migração concluída do Google Sites/GAS para **Firebase Hosting**.
- **URLs Limpas**: Configuração de rotas sem a extensão `.html` (ex: `/tech` em vez de `/tech.html`).
- **Autenticação**:
    - Implementação de `onAuthStateChanged` robusto para atualizar o UI do Terminal em tempo real.
    - Configuração de persistência local para manter o usuário logado entre as páginas.

### 3. Comunicação
- **Integração Google Groups**: Formulários de newsletter e links de contato redirecionam para o grupo oficial `moonark-project`.

---

## 🔗 Links Essenciais
- **Site Live**: [https://moonark-project.web.app](https://moonark-project.web.app)
- **Console Firebase**: [https://console.firebase.google.com/project/moonark-project/](https://console.firebase.google.com/project/moonark-project/)
- **Comunidade/Newsletter**: [https://groups.google.com/g/moonark-project](https://groups.google.com/g/moonark-project)

---

## 📅 Histórico de Mudanças Recentes
- **2026-04-27**: Publicação inicial no Firebase Hosting e limpeza de URLs.
- **2026-04-27**: Implementação do sistema de login unificado e persistente.
- **2026-04-27**: Otimização de ativos gráficos para strings Base64 de baixo peso.

---

## 🔮 Próximos Passos Sugeridos
- [ ] Implementar o painel real do "Terminal" após o login.
- [ ] Configurar um domínio personalizado (`moonark.ai` ou similar).
- [ ] Adicionar internacionalização (Inglês/Português).
- [ ] Integrar Firestore para gerenciar dados específicos dos usuários do terminal.

---
*Última atualização: 27 de Abril de 2026*
