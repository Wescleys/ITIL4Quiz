# ITIL 4 Foundation Practice App 🚀

![ITIL 4](https://img.shields.io/badge/ITIL-4%20Foundation-blue)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)

Um aplicativo moderno e responsivo projetado para ajudar profissionais a dominarem os conceitos do **ITIL 4 Foundation** através de simulados realistas, cronometrados e com feedback detalhado.

## ✨ Principais Funcionalidades

- **🎯 Simulados Realistas:** Banco de questões focado no exame oficial, com padrão de 40 questões.
- **⏱️ Simulador de Pressão:** Cronômetro regressivo de 60 minutos para treinar o gerenciamento de tempo.
- **📊 Dashboard de Evolução:** Acompanhe sua média de acertos, simulados realizados e dias restantes para sua meta.
- **🔄 Sincronização em Nuvem:** Seus resultados e revisões de questões são salvos via Supabase e sincronizados entre Web e Mobile.
- **🧐 Revisão Profunda:** Analise cada questão após o término, verificando erros, acertos e explicações detalhadas.
- **📱 Experiência Híbrida:** Disponível como Web App e aplicativo Android (APK).

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React + Vite
- **Estilização:** Tailwind CSS + Framer Motion (animações premium)
- **Backend/Auth:** Supabase
- **Mobile:** Ionic Capacitor
- **Ícones:** Lucide React

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado
- Android Studio (para gerar o APK)

### Instalação
```bash
# Clone o repositório
git clone https://github.com/Wescleys/ITIL4Quiz.git

# Entre na pasta
cd ITIL4Quiz

# Instale as dependências
npm install
```

### Script de Desenvolvimento
```bash
npm run dev
```

### Build e Deploy (Web)
```bash
npm run build
npm run deploy
```

### Sincronização Mobile (APK)
```bash
# Gera o build e sincroniza com a pasta android
npm run build
npx cap sync
npx cap open android
```

## 📝 Licença
Este projeto foi desenvolvido para fins educacionais e de prática para a certificação ITIL 4 Foundation.

---
Desenvolvido por [Wescleys](https://github.com/Wescleys)
