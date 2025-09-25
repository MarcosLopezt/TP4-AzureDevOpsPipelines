# DECISIONES – TP4 CI con Azure Pipelines (Self-Hosted)

## 1) Stack elegido y estructura del repo

**Frontend:** Vite (JS vanilla).  
**Backend:** Node.js + Express.

- Vite permite un build rápido con configuración mínima y una salida clara.
- Express ofrece un backend simple y suficiente para healthchecks, endpoints y demostrar CI.

## 2) Diseño del pipeline

**Formato:** YAML  
**Pool:** `SelfHosted` (agente self-hosted en mi máquina).  
**Triggers:** `push` y `PR` hacia `main`.

**Stage:** `CI`

- **Job `Build_Front`**
  - `checkout` del repo
  - `NodeTool@0` (Node 20)
  - `npm install` + `npm run build` en `front/`
  - Publicación de artefacto del front:
    - Publicar toda la carpeta `front/` → artefacto **`front_bundle`**
- **Job `Build_Back`**

  - `checkout` del repo
  - `NodeTool@0` (Node 20)
  - `npm install`, `npm test --if-present`, `npm run build --if-present` en `back/`
  - Publicación de artefacto del back → **`back_bundle`**

  **Razonamiento de diseño:**

- **YAML**: versionado junto al código, visible en PRs, auditable y portable.
- **Jobs independientes**: front y back compilan/validan en paralelo (si el pool tiene más de un agente) o secuencial según disponibilidad.
- **Artefactos**: facilitan el paso a CD (deploys) y la verificación del resultado del build.

## 3) Agente Self-Hosted: por qué y cómo

**Por qué Self-Hosted (vs Microsoft-Hosted):**

- Control total del entorno (versiones, dependencias, herramientas preinstaladas)
- Cache local → builds más rápidos
- Acceso a red interna (si fuera necesario)
- Sin límites de minutos del hosted, sujeto a la capacidad de mi equipo

**Cómo lo registré (Windows):**

- Creé un **Agent Pool** `SelfHosted`
- Generé un **PAT** con permisos de Agent Pools
- Descargué el agente, corrí `config.cmd` y **lo instalé como servicio**
- Verifiqué en **Agent pools** que el **Agent-Local** esté **Online**
