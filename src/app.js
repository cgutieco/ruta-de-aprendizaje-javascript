import {marked} from "marked";
import { normalizeToString } from "./utils/normalizeToString.js";

// ============================================
// Configuration
// ============================================

const DOCS_BASE_PATH = "/src/docs";

const CHAPTER_METADATA = {
    temario: {title: "📋 Temario Completo", order: 0},
    "capitulo-1": {title: "Capítulo 1 — Fundamentos esenciales", order: 1},
    "capitulo-2": {title: "Capítulo 2 — Funciones avanzadas", order: 2},
    "capitulo-3": {title: "Capítulo 3 — Internals del motor JS", order: 3},
    "capitulo-4": {title: "Capítulo 4 — Objetos y Prototipos", order: 4},
    "capitulo-5": {title: "Capítulo 5 — Arrays e Iteradores", order: 5},
    "capitulo-6": {title: "Capítulo 6 — DOM Avanzado", order: 6},
    "capitulo-7": {title: "Capítulo 7 — Asincronía profesional", order: 7},
    "capitulo-8": {title: "Capítulo 8 — Arquitectura y Módulos", order: 8},
    "capitulo-9": {title: "Capítulo 9 — Estructuras de Datos", order: 9},
    "capitulo-10": {title: "Capítulo 10 — Patrones de Diseño", order: 10},
    "capitulo-11": {title: "Capítulo 11 — Mini React desde 0", order: 11},
    "capitulo-12": {title: "Capítulo 12 — Manejo de errores", order: 12},
    "capitulo-13": {title: "Capítulo 13 — Testing y Calidad", order: 13},
    "capitulo-14": {title: "Capítulo 14 — Performance", order: 14},
    "capitulo-15": {title: "Capítulo 15 — Seguridad Frontend", order: 15},
    "capitulo-16": {title: "Capítulo 16 — Build & Deploy", order: 16},
};

// ============================================
// State Management
// ============================================

let docsStructure = [];
let currentTopic = null;

// ============================================
// Theme Management
// ============================================

function initTheme() {
    document.documentElement.dataset.theme = localStorage.getItem("theme") || "light";
}

function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem("theme", newTheme);
}

// ============================================
// Fetch Documentation Structure
// ============================================

async function fetchDocsStructure() {
    try {
        const chapters = Object.keys(CHAPTER_METADATA).sort(
            (a, b) => CHAPTER_METADATA[a].order - CHAPTER_METADATA[b].order
        );

        const structure = [];

        for (const chapterKey of chapters) {
            const metadata = CHAPTER_METADATA[chapterKey];

            try {
                const topics = await fetchChapterTopics(chapterKey);

                if (topics.length > 0) {
                    structure.push({
                        id: chapterKey,
                        title: metadata.title,
                        order: metadata.order,
                        topics: topics,
                    });
                }
            } catch (error) {
                console.warn(`Could not load chapter: ${chapterKey}`, error);
            }
        }

        return structure;
    } catch (error) {
        console.error("Error fetching docs structure:", error);
        return [];
    }
}

async function fetchChapterTopics(chapterKey) {
    const topicMap = {
        temario: [{file: "temario.md", title: "Temario Completo"}],
        "capitulo-1": [
            {file: "01-que-es-javascript.md", title: "¿Qué es JavaScript?"},
            {
                file: "02-primitivos-vs-referencias.md",
                title: "Primitivos vs Referencias",
            },
            {
                file: "03-variables-hoisting-shadowing.md",
                title: "Variables, Hoisting, Shadowing",
            },
            {file: "04-operadores-y-coercion.md", title: "Operadores y Coerción"},
            {file: "05-control-de-flujo.md", title: "Control de Flujo"},
            {file: "06-funciones.md", title: "Funciones"},
            {file: "07-scope.md", title: "Scope"},
            {
                file: "08-call-stack-memory-heap.md",
                title: "Call Stack y Memory Heap",
            },
            {file: "09-strict-mode.md", title: "Strict Mode"},
        ],
        "capitulo-2": [
            {file: "01-closures.md", title: "Closures en Profundidad"},
            {file: "02-high-order-functions.md", title: "High Order Functions"},
            {file: "03-currying-composicion.md", title: "Currying y Composición"},
            {file: "04-iife.md", title: "IIFE"},
            {
                file: "05-pureza-efectos-secundarios.md",
                title: "Pureza y Efectos Secundarios",
            },
            {file: "06-inmutabilidad.md", title: "Inmutabilidad Avanzada"},
            {file: "07-shallow-equality.md", title: "Shallow Equality"},
        ],
        "capitulo-3": [
            {file: "01-motores-modernos.md", title: "Motores Modernos 2025"},
            {file: "02-memory-management.md", title: "Memory Management"},
            {file: "03-hidden-classes.md", title: "Hidden Classes"},
            {file: "04-inline-caching.md", title: "Inline Caching"},
            {file: "05-jit-compilation.md", title: "JIT Compilation"},
            {
                file: "06-monomorfismo-polimorfismo.md",
                title: "Monomorfismo vs Polimorfismo",
            },
            {file: "07-codigo-optimizable.md", title: "Código Optimizable"},
        ],
        "capitulo-4": [
            {file: "01-objetos.md", title: "Creación y Manipulación de Objetos"},
            {file: "02-property-descriptors.md", title: "Property Descriptors"},
            {file: "03-constructor-functions.md", title: "Constructor Functions"},
            {file: "04-prototype-chain.md", title: "Prototype Chain"},
            {file: "05-clases.md", title: "Clases ES6+"},
            {file: "06-encapsulacion.md", title: "Encapsulación"},
            {
                file: "07-polimorfismo-composicion.md",
                title: "Polimorfismo y Composición",
            },
            {file: "08-symbols.md", title: "Symbols y Metaprogramación"},
            {file: "09-patrones-creacionales.md", title: "Patrones Creacionales"},
        ],
        "capitulo-5": [
            {file: "01-destructuring.md", title: "Destructuring Profundo"},
            {file: "02-spread-rest.md", title: "Spread/Rest Avanzado"},
            {file: "03-metodos-arrays.md", title: "Métodos Avanzados de Arrays"},
            {file: "04-iterators-generators.md", title: "Iterators y Generators"},
            {file: "05-for-in-for-of.md", title: "for...in vs for...of"},
            {file: "06-weakmap-weakset.md", title: "WeakMap y WeakSet"},
            {file: "07-json-avanzado.md", title: "JSON Avanzado"},
            {file: "08-clonacion.md", title: "Clonación Profunda"},
        ],
        "capitulo-6": [
            {
                file: "01-seleccion-manipulacion.md",
                title: "Selección y Manipulación DOM",
            },
            {file: "02-eventos.md", title: "Eventos y Event Delegation"},
            {file: "03-reflow-repaint.md", title: "Reflow y Repaint"},
            {file: "04-template-rendering.md", title: "Template Literal Rendering"},
            {file: "05-document-fragment.md", title: "DocumentFragment"},
            {file: "06-shadow-dom.md", title: "Shadow DOM"},
            {file: "07-virtual-dom.md", title: "Virtual DOM Básico"},
        ],
        "capitulo-7": [
            {file: "01-callback-hell.md", title: "Callback Hell"},
            {file: "02-promises.md", title: "Promises y Microtasks"},
            {file: "03-async-await.md", title: "Async/Await Avanzado"},
            {file: "04-event-loop.md", title: "Event Loop"},
            {file: "05-fetch-api.md", title: "Fetch API y Streaming"},
            {file: "06-abort-controller.md", title: "AbortController"},
            {file: "07-error-handling-async.md", title: "Manejo de Errores Async"},
            {file: "08-websockets.md", title: "WebSockets Básico"},
            {file: "09-web-workers.md", title: "Web Workers"},
        ],
        "capitulo-8": [
            {file: "01-es-modules.md", title: "ES Modules"},
            {file: "02-organizacion.md", title: "Organización de Código"},
            {file: "03-mvc.md", title: "MVC en JavaScript"},
            {file: "04-mvvm.md", title: "MVVM"},
            {file: "05-dependency-injection.md", title: "Dependency Injection"},
            {file: "06-clean-architecture.md", title: "Clean Architecture"},
        ],
        "capitulo-9": [
            {file: "01-big-o.md", title: "Big-O Notation"},
            {file: "02-listas-enlazadas.md", title: "Listas Enlazadas"},
            {file: "03-hash-tables.md", title: "Hash Tables"},
            {file: "04-arboles.md", title: "Árboles (BST)"},
            {file: "05-grafos.md", title: "Grafos Básico"},
            {file: "06-recursividad.md", title: "Recursividad Profunda"},
            {file: "07-memoizacion.md", title: "Memoización"},
            {file: "08-optimizacion.md", title: "Optimización Algorítmica"},
        ],
        "capitulo-10": [
            {file: "01-observer-pattern.md", title: "Observer Pattern"},
            {file: "02-publish-subscribe.md", title: "Publish/Subscribe"},
            {file: "03-strategy-pattern.md", title: "Strategy Pattern"},
            {file: "04-adapter-pattern.md", title: "Adapter Pattern"},
            {file: "05-decorator-pattern.md", title: "Decorator Pattern"},
            {file: "06-flyweight-pattern.md", title: "Flyweight Pattern"},
            {file: "07-composite-pattern.md", title: "Composite Pattern"},
            {file: "08-command-pattern.md", title: "Command Pattern"},
            {file: "09-state-pattern.md", title: "State Pattern"},
        ],
        "capitulo-11": [
            {file: "01-virtual-dom-basics.md", title: "Virtual DOM Basics"},
            {
                file: "02-componentes-funcionales.md",
                title: "Componentes Funcionales",
            },
            {file: "03-render-y-commit.md", title: "Render y Commit"},
            {
                file: "04-reconciliacion-diffing.md",
                title: "Reconciliación y Diffing",
            },
            {file: "05-implementando-usestate.md", title: "Implementando useState"},
            {file: "06-sistema-reactividad.md", title: "Sistema de Reactividad"},
            {file: "07-router-minimalista.md", title: "Router Minimalista"},
        ],
        "capitulo-12": [
            {file: "01-try-catch-avanzado.md", title: "Try/Catch Avanzado"},
            {
                file: "02-errores-sincronos-vs-asincronos.md",
                title: "Errores Síncronos vs Asíncronos",
            },
            {file: "03-custom-errors.md", title: "Custom Errors"},
            {file: "04-logging-estructurado.md", title: "Logging Estructurado"},
            {file: "05-error-boundaries.md", title: "Error Boundaries"},
            {file: "06-errores-promises-async.md", title: "Errores en Promises"},
            {file: "07-reporte-errores-produccion.md", title: "Reporte de Errores"},
        ],
        "capitulo-13": [
            {file: "01-mentalidad-tdd.md", title: "Mentalidad TDD"},
            {file: "02-unit-testing.md", title: "Unit Testing"},
            {file: "03-mocking-spies-cobertura.md", title: "Mocking y Spies"},
            {file: "04-testing-dom.md", title: "Testing de DOM"},
            {file: "05-pruebas-integracion.md", title: "Pruebas de Integración"},
            {file: "06-ci-basico.md", title: "CI Básico"},
        ],
        "capitulo-14": [
            {
                file: "01-web-performance-profiling.md",
                title: "Web Performance Profiling",
            },
            {file: "02-memoizacion-caching.md", title: "Memoización y Caching"},
            {file: "03-web-workers.md", title: "Web Workers"},
            {file: "04-optimizacion-render.md", title: "Optimización del Render"},
            {
                file: "05-motor-js-optimizaciones.md",
                title: "Optimizaciones del Motor JS",
            },
            {file: "06-garbage-collector.md", title: "Garbage Collector"},
            {
                file: "07-estructuras-datos-performantes.md",
                title: "Estructuras de Datos Performantes",
            },
        ],
        "capitulo-15": [
            {file: "01-xss-attacks.md", title: "XSS Attacks"},
            {file: "02-csrf.md", title: "CSRF"},
            {file: "03-cors-profundo.md", title: "CORS Profundo"},
            {file: "04-sanitizacion-datos.md", title: "Sanitización de Datos"},
            {
                file: "05-content-security-policy.md",
                title: "Content Security Policy",
            },
            {file: "06-cookies-seguras.md", title: "Cookies Seguras"},
            {file: "07-seguridad-fetch.md", title: "Seguridad en Fetch"},
            {file: "08-hardening-frontend.md", title: "Hardening Frontend"},
            {file: "09-seguridad-modulos.md", title: "Seguridad de Módulos"},
        ],
        "capitulo-16": [
            {file: "01-bundlers-modernos.md", title: "Bundlers Modernos"},
            {file: "02-tree-shaking.md", title: "Tree Shaking"},
            {file: "03-estructura-proyecto.md", title: "Estructura de Proyecto"},
            {file: "04-variables-entorno.md", title: "Variables de Entorno"},
            {file: "05-build-produccion.md", title: "Build para Producción"},
            {file: "06-deploy.md", title: "Deploy"},
            {file: "07-ci-cd.md", title: "CI/CD"},
        ],
    };

    const topics = topicMap[chapterKey] || [];

    return topics.map((topic, index) => ({
        id: `${chapterKey}/${topic.file}`,
        title: topic.title,
        file: topic.file,
        path: `${DOCS_BASE_PATH}/${chapterKey}/${topic.file}`,
        order: index,
    }));
}

// ============================================
// Render Sidebar
// ============================================

function renderSidebar(structure) {
    const sidebarNav = document.getElementById("sidebarNav");

    if (structure.length === 0) {
        sidebarNav.innerHTML =
            '<div class="loading">No se encontró contenido</div>';
        return;
    }

    sidebarNav.innerHTML = structure
        .map(
            (chapter) => `
    <div class="chapter" data-chapter="${chapter.id}">
      <div class="chapter-header">
        <span class="chapter-title">${chapter.title}</span>
        <svg class="chapter-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
      <div class="chapter-topics">
        ${chapter.topics
                .map(
                    (topic) => `
          <a href="#${topic.id}" class="topic-link" data-topic="${topic.id}">
            ${topic.title}
          </a>
        `
                )
                .join("")}
      </div>
    </div>
  `
        )
        .join("");

    const headers = document.querySelectorAll(".chapter-header");
    for (const header of headers) {
        header.addEventListener("click", () => {
            const chapter = header.closest(".chapter");
            chapter.classList.toggle("expanded");
        });
    }

    for (const link of document.querySelectorAll(".topic-link")) {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const topicId = link.dataset.topic;
            void loadTopic(topicId);

            globalThis.location.hash = topicId;
        });
    }
}

// ============================================
// Load and Render Markdown Content
// ============================================

async function loadTopic(topicId) {
    const contentWrapper = document.getElementById("contentWrapper");

    contentWrapper.innerHTML = '<div class="loading">Cargando...</div>';

    try {
        let topicPath = null;
        for (const chapter of docsStructure) {
            const topic = chapter.topics.find((t) => t.id === topicId);
            if (topic) {
                topicPath = topic.path;
                break;
            }
        }

        if (!topicPath) {
            console.error("Topic not found");
            contentWrapper.innerHTML = `
                <div class="markdown-content">
                    <h1>Error</h1>
                    <p>No se pudo encontrar el tema solicitado.</p>
                </div>
            `;
            return;
        }

        const response = await fetch(topicPath);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            contentWrapper.innerHTML = `
                <div class="markdown-content">
                    <h1>Error</h1>
                    <p>No se pudo cargar el contenido. Código: ${response.status}</p>
                </div>
            `;
            return;
        }

        const markdown = await response.text();

        const html = marked.parse(markdown);

        contentWrapper.innerHTML = `<div class="markdown-content">${normalizeToString(html)}</div>`;

        for (const link of document.querySelectorAll(".topic-link")) {
            link.classList.remove("active");
        }
        document
            .querySelector(`[data-topic="${topicId}"]`)
            ?.classList.add("active");

        const activeLink = document.querySelector(`[data-topic="${topicId}"]`);
        if (activeLink) {
            const chapter = activeLink.closest(".chapter");
            chapter?.classList.add("expanded");
        }

        document.querySelector(".main-content").scrollTop = 0;

        currentTopic = topicId;
    } catch (error) {
        console.error("Error loading topic:", error);
        contentWrapper.innerHTML = `
      <div class="markdown-content">
        <h1>Error</h1>
        <p>No se pudo cargar el contenido. Por favor, intenta de nuevo.</p>
      </div>
    `;
    }
}

// ============================================
// Handle URL Hash Navigation
// ============================================

function handleHashChange() {
    const hash = globalThis.location.hash.slice(1); // Remove the '#'

    if (hash && docsStructure.length > 0) {
        void loadTopic(hash);
    }
}

// ============================================
// Initialize Application
// ============================================

async function startApp() {
    initTheme();

    document.getElementById("themeToggle").addEventListener("click", toggleTheme);

    docsStructure = await fetchDocsStructure();
    renderSidebar(docsStructure);

    if (globalThis.location.hash) {
        handleHashChange();
    } else if (docsStructure.length > 0 && docsStructure[0].topics.length > 0) {
        const firstTopic = docsStructure[0].topics[0];
        void loadTopic(firstTopic.id);
        globalThis.location.hash = firstTopic.id;
    }

    globalThis.addEventListener("hashchange", handleHashChange);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        void startApp();
    });
} else {
    await startApp();
}
