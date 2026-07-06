/* ============================================================
   Sabih Shah Portfolio — main.js
   Vanilla JS: no framework needed for a single-page site.
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- Loader ---------------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => loader && loader.classList.add("done"), 400);
  });

  /* ---------------- Scroll progress + nav state ---------------- */
  const progressBar = document.getElementById("scroll-progress");
  const navbar = document.getElementById("navbar");
  const backToTop = document.getElementById("back-to-top");

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
    if (navbar) navbar.classList.toggle("scrolled", scrollTop > 12);
    if (backToTop) backToTop.classList.toggle("show", scrollTop > 600);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------------- Mobile menu ---------------- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobile-menu");
  burger?.addEventListener("click", () => {
    burger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });
  mobileMenu?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      mobileMenu.classList.remove("open");
    })
  );

  /* ---------------- Active section highlighting ---------------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------------- Reveal-on-scroll ---------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* stagger children with data-stagger */
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.transitionDelay = i * 70 + "ms";
    });
  });

  /* frame corner reveal for hover-frame elements on scroll into view (mobile touch affordance) */
  const frameObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll(".frame").forEach((el) => frameObserver.observe(el));

  /* ---------------- Hero role rotator ---------------- */
  const roles = ["Computer Vision Engineer", "AI / Deep Learning Developer", "Research Assistant", "Freelance ML Engineer"];
  const roleEl = document.getElementById("hero-role-text");
  if (roleEl) {
    let i = 0;
    let char = 0;
    let deleting = false;
    const tick = () => {
      const word = roles[i];
      if (!deleting) {
        char++;
        roleEl.textContent = word.slice(0, char);
        if (char === word.length) {
          deleting = true;
          setTimeout(tick, 1700);
          return;
        }
      } else {
        char--;
        roleEl.textContent = word.slice(0, char);
        if (char === 0) {
          deleting = false;
          i = (i + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 30 : 55);
    };
    tick();
  }

  /* ---------------- Copy email ---------------- */
  document.querySelectorAll(".copy-email").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const email = btn.getAttribute("data-email");
      navigator.clipboard?.writeText(email).then(() => showToast("Email copied to clipboard"));
    });
  });

  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /* ---------------- Certifications show more ---------------- */
  const certToggle = document.getElementById("cert-toggle");
  certToggle?.addEventListener("click", () => {
    const hiddenItems = document.querySelectorAll(".cert-hidden");
    const expanding = certToggle.getAttribute("data-expanded") === "false";
    hiddenItems.forEach((el) => el.classList.toggle("cert-hidden", !expanding));
    certToggle.setAttribute("data-expanded", expanding);
    certToggle.textContent = expanding ? "Show less" : "Show all 15 certifications";
  });

  /* ---------------- Mouse-follow glow (desktop only, subtle) ---------------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const glow = document.createElement("div");
    glow.id = "mouse-glow";
    glow.style.cssText = `
      position:fixed; width:420px; height:420px; border-radius:50%;
      background: radial-gradient(circle, rgba(99,102,241,0.10), transparent 70%);
      pointer-events:none; z-index:1; transform:translate(-50%,-50%);
      left:-500px; top:-500px; transition: left .18s ease-out, top .18s ease-out;
    `;
    document.body.appendChild(glow);
    window.addEventListener("mousemove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
  }

  /* ---------------- Background canvas: neural node network ---------------- */
  const canvas = document.getElementById("bg-canvas");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d");
    let w, h, nodes;
    const NODE_COUNT_BASE = 70;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = Math.min(window.innerHeight * 1.4, 1400);
      const count = Math.max(28, Math.min(NODE_COUNT_BASE, Math.floor((w * h) / 26000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
      }));
    }
    window.addEventListener("resize", resize);
    resize();

    const maxDist = 150;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const o = nodes[j];
          const dx = n.x - o.x, dy = n.y - o.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(99,102,241,${0.14 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(o.x, o.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,211,238,0.55)";
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------------- Skill card tilt (subtle) ---------------- */
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ============================================================
     Project data + modal
     ============================================================ */
  const projectData = {
  "facial-recognition": {
    title: "Facial Recognition Access Control System",
    tags: ["Computer Vision", "Access Control", "Deep Learning", "Deployment"],
    overview:
      "Led architecture and development of a real-time facial recognition system for access control, built on Nvidia Triton Inference Server for high-throughput model serving. FastAPI provides the interface layer, while Milvus vector database powers fast similarity search and retrieval of facial embeddings at scale.",
    features: [
      "Real-time facial recognition and matching",
      "Vector similarity search with Milvus",
      "FastAPI interface for integration",
      "Scalable inference with Nvidia Triton",
    ],
    technologies: ["Python", "FastAPI", "Nvidia Triton", "Milvus", "PyTorch", "Docker"],
    media: [{ type: "image", src: "images/fr_more.png" }],
    links: [],
  },
  "cv-analytics": {
    title: "Real-Time Video Analytics Platform",
    tags: ["Computer Vision", "Real-Time", "Infrastructure", "Tracking"],
    overview:
      "A high-performance real-time computer vision platform built on Nvidia DeepStream and GStreamer, orchestrated across Docker Swarm for horizontal scalability. A multiprocessing-based analytics dashboard gives precise, per-stream control over RTSP camera inputs, model selection and compute usage monitoring, backed by continuously trained and deployed YOLO models for detection and tracking.",
    features: [
      "Multi-stream RTSP ingestion and processing",
      "Dashboard for camera, model and compute management",
      "Docker Swarm orchestration for scalability",
      "Real-time YOLO detection and tracking",
    ],
    technologies: ["Python", "Nvidia DeepStream", "GStreamer", "Docker Swarm", "YOLO"],
    media: [{ type: "image", src: "images/vid-analytics.png" }],
    links: [],
  },
  "rag-chatbot": {
    title: "RAG Document Retrieval & Q/A Chatbot",
    tags: ["LLMs", "RAG", "Backend", "Vector Search"],
    overview:
      "An end-to-end document retrieval, processing and ingestion pipeline built with llama-index, feeding a Q/A chatbot for client-specific knowledge bases. Postgres with the pgvector extension stores vector indices for retrieval, while Postgres also handles staging for document processing. The entire stack is packaged and deployed via Docker Compose.",
    features: [
      "Automated document ingestion pipeline",
      "Vector-based semantic retrieval with pgvector",
      "Context-aware Q/A chatbot interface",
      "Containerized deployment via Docker Compose",
    ],
    technologies: ["Python", "Llama-Index", "Postgres", "pgvector", "Docker Compose"],
    media: [{ type: "image", src: "images/RAG_arch.png" }],
    links: [],
  },
  "llm-finetune": {
    title: "Fine-Tuned LLMs for Domain Generation",
    tags: ["LLMs", "Fine-Tuning", "NLP", "Healthcare"],
    overview:
      "Fine-tuned large language models including Llama-3 and Flan-T5 for causal language modeling and text classification tasks respectively, using parameter-efficient fine-tuning (PEFT) with the QLoRA technique to enable training on low-VRAM GPUs. This approach was applied to faithful, consistent SOAP note generation, alongside a separate Flan-T5-large deployment for text-to-YAML generation using AWS SageMaker with Weights & Biases monitoring.",
    features: [
      "QLoRA fine-tuning on low-VRAM hardware",
      "Causal language modeling with Llama-3",
      "Text classification with Flan-T5",
      "Training monitored via Weights & Biases",
    ],
    technologies: ["Python", "Hugging Face", "Llama-3", "Flan-T5", "QLoRA", "AWS SageMaker"],
    media: [{ type: "image", src: "images/llm.png" }],
    links: [],
  },
  "pose-estimation": {
    title: "YOLOv11 3D Pose Estimation",
    tags: ["Computer Vision", "Edge AI", "Stereo Vision", "Real-Time"],
    overview:
      "A 3D pose estimation system combining YOLOv11 detection with stereo vision equations, using Basler cameras as the capture source. The pipeline is optimized for real-time inference and deployed on an Nvidia Jetson AGX Orin as an edge inference server.",
    features: [
      "Stereo vision-based 3D pose reconstruction",
      "YOLOv11-based real-time detection",
      "Edge deployment on Jetson AGX Orin",
      "Optimized for low-latency inference",
    ],
    technologies: ["Python", "YOLOv11", "OpenCV", "Nvidia Jetson AGX Orin", "Basler Cameras"],
    media: [{ type: "image", src: "images/pose.png" }],
    links: [],
  },
  "multimodal-assessment": {
    title: "Real-Time Multimodal Human Interaction & Assessment Engine",
    tags: ["Multimodal AI", "Real-Time", "Computer Vision", "Audio Analysis"],
    overview:
"A fully offline, real-time assessment engine combining webcam-based body pose, face, hand, and gaze tracking with microphone-based voice analysis (pitch, pace, pauses, volume, energy, and intonation). Extracted features feed a configurable rule engine (JSON/YAML) with hot reloading for instant scoring updates. The architecture separates capture, feature extraction, assessment, scoring, feedback, configuration, and UI into modular components with documented interfaces, visual debugging, performance benchmarking (latency, FPS, CPU/GPU, RAM), and verified offline operation without external calls.",
    features: [
      "Real-time webcam and microphone capture",
      "Pose, face, hand and gaze/head-pose landmark tracking",
      "Voice feature extraction: pitch, pace, pauses, volume, energy, intonation",
      "Configurable, hot-reloadable assessment logic with real-time feedback events",
      "Visual debug overlay and local performance benchmarking",
      "Fully offline pipeline with verified no external calls",
    ],
    technologies: ["Python", "MediaPipe", "ONNX Runtime", "OpenCV", "sounddevice", "Silero VAD",  "PyQt6", "psutil", "gputils"],
    media: [{ type: "image", src: "images/voice-agent.png" }],
    links: [],
  },

};
  const modal = document.getElementById("project-modal");
  const modalTitle = modal?.querySelector(".modal-title");
  const modalTags = modal?.querySelector(".project_tags");
  const modalOverview = modal?.querySelector(".overview");
  const modalFeatures = modal?.querySelector(".features_list");
  const modalTech = modal?.querySelector(".tech_stack");
  const modalLinks = modal?.querySelector(".project_links");
  const modalMain = modal?.querySelector(".modal-media-main");
  const modalThumbs = modal?.querySelector(".modal-thumbs");

  function setMainMedia(item) {
    if (!modalMain) return;
    modalMain.innerHTML =
      item.type === "video"
        ? `<video src="${item.src}" autoplay loop muted playsinline controls></video>`
        : `<img src="${item.src}" alt="Project media" loading="lazy" />`;
  }

  function openProject(key) {
    const p = projectData[key];
    if (!p || !modal) return;
    modalTitle.textContent = p.title;
    modalTags.innerHTML = p.tags.map((t) => `<span>${t}</span>`).join("");
    modalOverview.textContent = p.overview;
    modalFeatures.innerHTML = p.features.map((f) => `<li>${f}</li>`).join("");
    modalTech.innerHTML = p.technologies.map((t) => `<span class="tech_item">${t}</span>`).join("");
    modalLinks.innerHTML = p.links
      .map((l) => `<a class="btn btn-sm ${l.primary ? "btn-primary" : "btn-ghost"}" href="${l.url}" target="_blank" rel="noopener">${l.title}</a>`)
      .join("");

    setMainMedia(p.media[0]);
    modalThumbs.innerHTML = p.media
      .map(
        (m, i) =>
          `<div class="modal-thumb ${i === 0 ? "active" : ""}" data-i="${i}">${
            m.type === "video" ? `<video src="${m.src}" muted></video>` : `<img src="${m.src}" alt="" />`
          }</div>`
      )
      .join("");
    modalThumbs.querySelectorAll(".modal-thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        modalThumbs.querySelectorAll(".modal-thumb").forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
        setMainMedia(p.media[+thumb.dataset.i]);
      });
    });

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeProject() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => (modalMain.innerHTML = ""), 300);
  }

  document.querySelectorAll("[data-project]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openProject(el.getAttribute("data-project"));
    });
  });
  modal?.querySelector(".modal-close")?.addEventListener("click", closeProject);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeProject();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("open")) closeProject();
  });
})();
