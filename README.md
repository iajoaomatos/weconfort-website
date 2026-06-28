# WeConfort® - Biotecnologia Canina & Felina (Website Estático)

Este é o website oficial do **WeConfort®**, um suplemento alimentar de alta sinergia desenvolvido pela **Wepharm®** focado no suporte clínico e controlo de processos crónicos de cães e gatos, especialmente em idade geriátrica.

O projeto foi construído para apresentar alta performance visual, micro-interações fluidas e efeitos de profundidade inovadores (Glassmorphic 3D Depth Card).

## 🚀 Tecnologias Utilizadas

* **HTML5**: Estrutura semântica com foco em SEO.
* **Tailwind CSS (via CDN)**: Framework utilitário para estilização e responsividade instantânea.
* **GSAP & ScrollTrigger**: Utilizados para a interpolação de frames de vídeo com base no scroll do utilizador (efeito de cinema dinâmico interativo).
* **Iconify**: Biblioteca unificada para carregamento otimizado de ícones modernos.

## 📂 Estrutura do Projeto

* `index.html`: Página principal e ponto de entrada da aplicação.
* `assets/`: Pasta pública contendo os ficheiros de média e recursos.
  * `css/`: Folhas de estilo externas (contém o `styles.css` com as animações e estilos visuais).
  * `js/`: Scripts JavaScript modulares (contém o `main.js` com GSAP e interações).
  * `img/`: Pasta organizada contendo as imagens do produto e logos em alta resolução.
  * `video/`: Pasta contendo as animações de vídeo otimizadas para o ScrollTrigger.
* `templates/`: Diretório contendo referências de desenvolvimento e guias visuais.
  * `design system.html`: Design System completo do projeto (guia tipográfico, paleta de cores e componentes).
* `.gitignore`: Ficheiro de configuração para evitar a monitorização de ficheiros de lixo do sistema (como `.DS_Store`) ou configurações locais do editor.

## 💻 Funcionalidades em Destaque

1. **Interpolação de Vídeo Controlada por Scroll (GSAP)**:
   O vídeo de fundo no cabeçalho reproduz de forma suave à medida que o utilizador faz scroll na página, criando uma experiência tridimensional dinâmica de "desdobramento do produto".
2. **Glassmorphic 3D Depth Card**:
   Card 3D simulando profundidade física ao mexer o rato (efeito tilt interativo com lanterna radial dinâmica).
3. **Banda de Logotipos Infinita (Marquee)**:
   Carrossel infinito e suave de produtos integrados na We Series da Wepharm.
4. **Design System Integrado**:
   Totalmente fiel ao guia visual da marca com as cores institucionais (Magenta, Teal, Clinical Dark/White).

## 🌍 Como Executar Localmente

Como o website utiliza recursos de carregamento assíncrono (ScrollTrigger de vídeo local e Lazy Loading), deve ser executado a partir de um servidor web local (como a extensão *Live Server* do VS Code, *http-server* em Node.js ou *Python -m http.server*) para evitar restrições de CORS no carregamento dos vídeos e assets.

1. Clone o repositório.
2. Inicie o seu servidor local na raiz do projeto.
3. Aceda a `http://localhost:<porta>` no seu navegador.

## 🛠️ Deploy em Produção

O website está pronto para deploy imediato em qualquer plataforma de alojamento estático, tais como:
* **Vercel**
* **Netlify**
* **GitHub Pages** (basta apontar a branch principal e ativar o alojamento de páginas).
