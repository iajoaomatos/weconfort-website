document.addEventListener("DOMContentLoaded", () => {
    // Inicializar GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 1. Animação de Entrada Inicial (Blur-in via CSS)
    setTimeout(() => {
        document.querySelectorAll('#hero-panel .reveal-up').forEach(el => {
            el.classList.add('reveal-active');
        });
    }, 100);

    // Configuração do vídeo e interpolação de scrub otimizada
    const video = document.getElementById("hero-video");
    video.pause();

    const videoProxy = { time: 0 };
    let targetTime = 0;
    let isSeeking = false;
    let lastSeekAttempt = 0;

    // Loop de interpolação suave (LERP) executado via requestAnimationFrame
    function smoothVideoScrub() {
        const now = performance.now();

        // Timeout de segurança: se o seek demorar mais de 150ms, assume que desbloqueou
        if (isSeeking && (now - lastSeekAttempt > 150)) {
            isSeeking = false;
        }

        if (!isSeeking) {
            const diff = targetTime - video.currentTime;
            // Se a diferença for superior a 0.01s (aprox. 1 frame)
            if (Math.abs(diff) > 0.01) {
                const step = diff * 0.25; // interpolação ágil de 25% da distância por frame
                video.currentTime += step;
                isSeeking = true;
                lastSeekAttempt = now;
            }
        }
        requestAnimationFrame(smoothVideoScrub);
    }

    // Ouvir quando o browser conclui o seek para libertar a próxima atualização
    video.addEventListener("seeked", () => {
        isSeeking = false;
    });

    // Iniciar o loop de sincronização de frames do vídeo
    requestAnimationFrame(smoothVideoScrub);

    function initScrollTimeline() {
        const duration = video.duration || 14;

        // Timeline unificada vinculada ao ScrollTrigger com pin: true
        const mainTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "#hero-pin-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.2, // scrub imediato para dar resposta instantânea ao scroll
                pin: "#hero-panel",
                anticipatePin: 1,
            }
        });

        // 1. Controle do progresso do vídeo (currentTime)
        mainTimeline.to(videoProxy, {
            time: duration,
            ease: "none",
            duration: duration,
            onUpdate: () => {
                targetTime = videoProxy.time;
            }
        }, 0);

        // 2. Animação de saída dos textos iniciais (0s a 3s do vídeo)
        mainTimeline.to(".hero-left-content > *", {
            y: -50,
            opacity: 0,
            filter: "blur(15px)",
            stagger: 0.05,
            ease: "power1.inOut",
            duration: 3
        }, 0);

        // 3. Entrada e saída do Bloco Técnico A (Esquerda - de 4s a 9s)
        mainTimeline.to("#tech-block-a", {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power1.out",
            duration: 2.5
        }, 4);
        mainTimeline.to("#tech-block-a", {
            opacity: 0,
            y: -40,
            filter: "blur(15px)",
            ease: "power1.in",
            duration: 1.5
        }, 7.5);

        // 4. Entrada e saída do Bloco Técnico B (Direita - de 9.5s a 14s)
        mainTimeline.to("#tech-block-b", {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power1.out",
            duration: 2.5
        }, 9.5);
        mainTimeline.to("#tech-block-b", {
            opacity: 0,
            y: -40,
            filter: "blur(15px)",
            ease: "power1.in",
            duration: 1.5
        }, 12.5);
    }

    // Inicializar timeline quando metadados estiverem disponíveis
    if (video.readyState >= 1) {
        initScrollTimeline();
    } else {
        video.addEventListener("loadedmetadata", () => {
            initScrollTimeline();
        });
    }

    // Revelar conteúdo da segunda secção
    ScrollTrigger.create({
        trigger: "#details-section",
        start: "top 75%",
        onEnter: () => {
            document.querySelectorAll('#details-section .reveal-up').forEach(el => {
                el.classList.add('reveal-active');
            });
        }
    });

    // Revelar conteúdo da terceira secção & Lazy Load do Vídeo
    ScrollTrigger.create({
        trigger: "#science-video-section",
        start: "top 75%",
        onEnter: () => {
            document.querySelectorAll('#science-video-section .reveal-up').forEach(el => {
                el.classList.add('reveal-active');
            });

            const s3Video = document.getElementById("section-3-video");
            if (s3Video && !s3Video.src) {
                s3Video.src = s3Video.getAttribute("data-src");
                s3Video.load();
                s3Video.play().catch(e => console.log("Section 3 background video autoplay blocked: ", e));
            }
        }
    });

    // Animação Parallax 3D com Rato (Tilt Effect)
    const cardContainer = document.getElementById("details-tilt-card");
    const mainCard = cardContainer.querySelector(".glass-card-3d");
    const chassisCard = document.getElementById("details-card-chassis");
    const productImg = document.getElementById("details-product-img");
    const cardGlow = document.getElementById("details-card-glow");

    cardContainer.addEventListener("mousemove", (e) => {
        if (window.innerWidth < 1024) return; // Desativa em ecrãs pequenos / toque

        const rect = cardContainer.getBoundingClientRect();
        const x = e.clientX - rect.left; // posição X dentro do elemento
        const y = e.clientY - rect.top;  // posição Y dentro do elemento

        // Define as variáveis CSS para o reflexo de luz interna
        mainCard.style.setProperty("--mouse-x", `${x}px`);
        mainCard.style.setProperty("--mouse-y", `${y}px`);

        // Normaliza as coordenadas (-0.5 a 0.5)
        const normX = (x / rect.width) - 0.5;
        const normY = (y / rect.height) - 0.5;

        // Limites de rotação 3D (graus máximos)
        const maxRotateX = 14;
        const maxRotateY = 14;

        // Suavização das rotações do cartão principal via GSAP
        gsap.to(mainCard, {
            rotateX: -normY * maxRotateX,
            rotateY: normX * maxRotateY,
            x: normX * 12,
            y: normY * 12,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
        });

        // Movimento do card traseiro (Chassis) - Cria efeito de profundidade (lag)
        gsap.to(chassisCard, {
            rotateX: -normY * maxRotateX * 0.7,
            rotateY: normX * maxRotateY * 0.7,
            x: -normX * 12,
            y: -normY * 12,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
        });

        // A imagem do produto desloca-se de forma independente para maior imersão
        gsap.to(productImg, {
            x: normX * 22,
            y: normY * 22,
            rotationZ: normX * 3,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
        });

        // Movimento do Glow colorido de fundo
        gsap.to(cardGlow, {
            left: `${x}px`,
            top: `${y}px`,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
        });
    });

    cardContainer.addEventListener("mouseleave", () => {
        // Reposiciona todos os elementos na posição inicial com amortecimento elástico
        gsap.to(mainCard, {
            rotateX: 0,
            rotateY: 0,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.6)",
            overwrite: "auto"
        });

        gsap.to(chassisCard, {
            rotateX: 0,
            rotateY: 0,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.6)",
            overwrite: "auto"
        });

        gsap.to(productImg, {
            x: 0,
            y: 0,
            rotationZ: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.6)",
            overwrite: "auto"
        });

        gsap.to(cardGlow, {
            left: "50%",
            top: "50%",
            opacity: 0.5,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto"
        });
    });

    // Animação da Lanterna (Flashlight Effect) e Tilt 3D na Box da Secção 3
    const scienceGlowBox = document.getElementById("science-glow-box");
    if (scienceGlowBox) {
        scienceGlowBox.addEventListener("mousemove", (e) => {
            if (window.innerWidth < 1024) return;

            const rect = scienceGlowBox.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Luz interna
            scienceGlowBox.style.setProperty("--mouse-x", `${x}px`);
            scienceGlowBox.style.setProperty("--mouse-y", `${y}px`);

            // Rotação 3D
            const normX = (x / rect.width) - 0.5;
            const normY = (y / rect.height) - 0.5;
            const maxRotateX = 10;
            const maxRotateY = 10;

            gsap.to(scienceGlowBox, {
                rotateX: -normY * maxRotateX,
                rotateY: normX * maxRotateY,
                x: normX * 10,
                y: normY * 10,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        scienceGlowBox.addEventListener("mouseleave", () => {
            gsap.to(scienceGlowBox, {
                rotateX: 0,
                rotateY: 0,
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.6)",
                overwrite: "auto"
            });
        });
    }
});
