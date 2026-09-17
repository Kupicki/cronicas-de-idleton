<p align="center">
  <img src="public/assets/Logo.svg" alt="Crônicas de Idleton" width="360">
</p>

<p align="center">
  <strong>⚔️ Um Idle RPG Medieval de aventura, combate e exploração — direto no navegador.</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange?style=flat-square" alt="Status"></a>
  <a href="#"><img src="https://img.shields.io/badge/Engine-Alpine.js%20%2B%20Vite-06B6D4?style=flat-square" alt="Engine"></a>
  <a href="#"><img src="https://img.shields.io/badge/Licença-Privado-red?style=flat-square" alt="Licença"></a>
</p>

---

## 🐉 Sobre o Jogo

**Crônicas de Idleton** é um idle RPG medieval onde você gerencia um herói na vila de Idleton. Explore zonas perigosas, enfrente monstros, colete saques, melhore equipamentos no Ferreiro, aposte na Taverna, consulte o Oráculo e expanda seu domínio!

### ✨ Features

- **Combate automático** com sistema de zonas e bosses
- **Ferreiro** — Aprimore, forje e encante equipamentos
- **Taverna** — Jogos de azar (Cara/Coroa, Dados) e Domador de Pets
- **Oráculo** — Bênçãos e profecias com buffs temporários
- **Mercado** — Compra de materiais com preços dinâmicos
- **Companheiros** — Pets com expedições e bônus passivos
- **Torre dos Desafios** — Andares com modificadores e eventos
- **Bestiário** — Registro de monstros com marcos e títulos
- **Sistema de Ascensão** — Reinicie com bônus permanentes
- **Invasão da Vila** — Eventos de defesa com recompensas
- **Quadro de Missões** — Missões diárias com recompensas

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Alpine.js, Tailwind CSS v4, Canvas API |
| Build | Vite 8 |
| Backend (local) | Laravel 11, PHP 8.3+ |
| Deploy (web) | GitHub Pages + GitHub Actions |

## 🚀 Como Jogar

### Online (GitHub Pages)
> Em breve — o link será adicionado após o primeiro deploy.

### Local (Desenvolvimento)

```bash
# Instalar dependências
composer install
npm install

# Configurar ambiente
cp .env.example .env
php artisan key:generate

# Rodar o servidor
php artisan serve
npm run dev
```

Acesse `http://localhost:8000` no navegador.

## 📁 Estrutura do Projeto

```
resources/js/game/     # Engine completa do jogo (Alpine.js)
├── index.js           # Componente principal (gameData)
├── combat.js          # Lógica de combate
├── economy.js         # Economia, crafting e progressão
├── canvas.js          # Renderização Canvas (combate)
├── audio.js           # Efeitos sonoros
├── constants.js       # Dados de monstros, itens, skills
├── state.js           # Estado inicial padrão
├── ui.js              # Helpers de UI, save/load
├── quests.js          # Sistema de missões
├── lang/              # Internacionalização
└── visuals/           # Sistema visual (sprites, ícones)

public/assets/         # Assets visuais (sprites, ícones SVG/PNG)
```

## 👨‍💻 Autor

**Gabriel Kupicki** — [Agência GTK](https://agenciagtk.com.br)

---

<p align="center">
  <em>Forjado com 🔥 e muita ☕ em Joinville, SC</em>
</p>
