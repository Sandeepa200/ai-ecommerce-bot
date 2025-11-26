# Unity E-commerce Customer Support Chatbot — Technical Specification

## 1. Overview

- Purpose: Migrate the existing AI chatbot into a customer support chatbot for an e‑commerce platform, implemented in Unity.
- Scope: Replace the current Next.js client with a Unity client; preserve or refactor server integrations; add authentication, customer support flows, image generation, data/AI pipelines, testing, and CI/CD.
- Target Platforms: Windows, macOS, iOS, Android, WebGL.
- Primary Integrations: Clerk (authentication), Google AI Studio (LLM + image generation), optional Vertex AI (Imagen) when AI Studio image generation requires Vertex.

## 2. Current Codebase Audit

- Replace React UI and Gemini chat logic with Unity C# equivalents.
- Remove personal portfolio context and data.
- Key files to deprecate or migrate:
  - `app/api/chat/route.ts:1` — Gemini chat route tied to portfolio assistant.
  - `utils/AI-Model.js:1` — client-side Gemini chat session bootstrap.
  - `components/ChatInterface.tsx:1` — React chat UI.
  - `components/ChatInput.tsx:1` — React input UI.
  - `components/MarkdownRenderer.tsx:1` — React markdown rendering.
  - `components/HeaderBar.tsx:1` — portfolio header.
  - `components/MiniFooter.tsx:1` — portfolio footer.
  - `data/personalData.js:1` and `data/personalData.json:1` — personal profile data.

## 3. Architecture

- Client (Unity):
  - Scene: `ChatSupportScene` with UI (UGUI/UIToolkit), chat list, input, login/register views.
  - Managers: `AuthManager` (Clerk), `ChatManager` (LLM), `OrderService`, `ReturnsService`, `RecommendationService`, `ImageGenService`.
  - Storage: Secure local storage for session tokens; lightweight cache for conversation snippets.
- Backend (Server or Serverless, recommended):
  - `Auth Proxy`: Verifies Clerk JWTs server-side and issues short-lived app tokens for Unity.
  - `E‑commerce API`: Integration layer to your order database, catalog, and returns policy content.
  - `Chat Orchestrator`: Adds domain system prompt, calls Google AI Studio (Gemini) for text responses.
  - `Image Gen Adapter`: Calls AI Studio text‑to‑image or Vertex AI Imagen; returns URLs.
  - Observability: Central logging + error reporting; rate limiting and abuse protection.
- Data/AI:
  - Product catalog index for retrieval‑augmented generation (RAG) using embeddings.
  - Synthetic dataset generation for conversation flows where no labeled data exists.

### Component Diagram (textual)

- Unity Client → Auth Proxy → Clerk
- Unity Client → Chat Orchestrator → Google AI Studio (Gemini)
- Unity Client → Image Gen Adapter → Google AI Studio / Vertex Imagen
- Unity Client → Order Service → E‑commerce Order API
- Unity Client → Returns Service → Policy Store (CMS/JSON)
- Unity Client → Recommendation Service → Catalog Index + Gemini

## 4. Project Setup & Migration Plan

- Archive or remove old repo folder safely:
  - Option A (rename/archive): `git remote rename origin old-origin`; archive code; new repo `unity-ecommerce-support-chatbot`.
  - Option B (delete local Git folder): Windows PowerShell `Remove-Item -Recurse -Force .git`; then `git init`.
- Rename all files/components to reflect e‑commerce support purpose:
  - Unity project name: `UnityEcomSupportChatbot`.
  - Namespace: `Company.Ecom.SupportChatbot`.
- Initialize new Git repository:
  - `git init`
  - `git branch -M main`
  - `git add .` and `git commit -m "chore: initialize Unity e‑commerce support chatbot"`
  - `git remote add origin <new_repo_url>`
- Bug audit (pre‑reuse):
  - Run lint: `npm run lint` in current project to surface pre‑migration issues.
  - Remove portfolio‑specific prompts and hardcoded content in `app/api/chat/route.ts:17` and `utils/AI-Model.js:20`.
  - Check environment usage (`NEXT_PUBLIC_GEMINI_API_KEY`) to prevent client‑side key exposure.

## 5. Core Functionality Requirements

### 5.1 Order Status Inquiries

- Inputs: Order ID, user identity (Clerk session), optional email.
- Flow:
  - Unity → `OrderService.GetStatus(orderId, userToken)` → Backend verifies ownership → returns status timeline.
- Response Schema:
  - `status` (enum), `estimated_delivery`, `items[]`, `tracking_url`, `latest_event`.
- Security: Only owners or admins may query; enforce via Clerk session and server‑side checks.

### 5.2 Return Policy Explanations

- Source: CMS or JSON policy store with versioning.
- Flow: Unity → `ReturnsService.GetPolicy(query)` → Chat Orchestrator → Gemini summarizes and cites policy.
- UX: Provide structured answer + deep links to policy sections.

### 5.3 Product Recommendations (NLP)

- Inputs: Natural language intent, preferences, constraints.
- Pipeline:
  - Extract intent/entities (Gemini), search catalog index (embeddings/RAG), rank by relevance and business rules, summarize.
- Output: Top N products with title, image, price, key attributes, buy link.

### 5.4 Image Generation (Google AI Studio)

- Use AI Studio image generation where available; otherwise call Vertex AI Imagen.
- API abstraction: `ImageGenService.Generate(prompt)` → returns URL/base64 with content safety checks.

### 5.5 Authentication (Clerk API)

- User account creation: Unity registration form → Clerk API.
- Login: Unity login → Clerk API → session token.
- Session management: Persist token securely; refresh; server verifies JWT on each protected call.
- Backend verifies Clerk session via `Authorization: Bearer <token>` on every endpoint.

## 6. Data & AI Components

- Dataset Strategy:
  - Evaluate existing customer chat logs; if unavailable, generate synthetic dialogs guided by real return policies and product catalog.
  - Label intents (order_status, return_policy, recommendation) and entities (order_id, product_name, preference).
- Model Integration:
  - Text: Gemini via AI Studio for intent recognition and response generation.
  - Image: AI Studio/Vertex Imagen for visuals in recommendations or promotional content.
- Freshness:
  - Nightly job updates catalog embeddings and policy snapshots.

## 7. Unity Implementation Outline

- Scenes:
  - `AuthScene` — login/register.
  - `ChatSupportScene` — chat stream, context panels.
- Scripts:
  - `AuthManager` — Clerk REST calls; token storage.
  - `ChatManager` — message queue; calls Chat Orchestrator.
  - `OrderService` — GET `/orders/:id` with JWT.
  - `ReturnsService` — GET `/policy` and summarization.
  - `RecommendationService` — POST `/recommendations` with query.
  - `ImageGenService` — POST `/images:generate`.
- UI:
  - Chat list, composer, suggestions (chips), loading states, error toasts.
- Config:
  - `Resources/appconfig.json` — API base URLs, timeouts.

## 8. Security & Compliance

- Never embed API keys in Unity client; use server‑side proxy for privileged calls.
- Store tokens in secure OS keystore or encrypted PlayerPrefs.
- Rate limit image generation and LLM calls.
- PII safeguards for order data; audit logs for admin access.

## 9. Testing Plan

- Accuracy:
  - Unit: prompt templates produce expected intents.
  - Integration: end‑to‑end chat returns correct order status and policy text.
- Authentication:
  - Unity Test Framework: login/register/session refresh path tests.
  - Negative tests: invalid credentials, expired tokens, revoked sessions.
- Error Handling:
  - Network failures, API 4xx/5xx, model timeouts; user‑friendly messages.
- Performance:
  - Latency budgets: 
    - First token < 2s on broadband.
    - Order status lookup < 1s median.
  - Memory and FPS on mobile.
- Cross‑platform:
  - Build and run tests on Windows, macOS, iOS, Android, WebGL.

## 10. Build Configurations

- Player Settings per platform (scripting backend IL2CPP for mobile; .NET for desktop).
- Linker settings to preserve JSON serializers.
- Network timeouts and retries tuned for mobile.
- Environment config by `appconfig.json` + platform overrides.

## 11. CI/CD Pipeline

- GitHub Actions:
  - Jobs: `lint`, `unity-build-windows`, `unity-build-macos`, `unity-build-android`, `unity-build-ios`, `webgl-build`.
  - Cache Unity Library and Gradle.
  - Secrets: `CLERK_SECRET_KEY`, `GOOGLE_API_KEY`, `ECOM_API_KEY` stored in repo secrets.
- Release:
  - Build artifacts per platform; upload to releases or stores.

## 12. Deployment Procedures

- Prerequisites:
  - Provision Clerk app and keys; configure redirect URIs.
  - Provision Google AI Studio key; enable Vertex if using Imagen.
  - Set `E_COMMERCE_API_BASE_URL` and keys.
- Steps:
  - Configure `Resources/appconfig.json` with endpoints.
  - Verify CI builds succeed for target platforms.
  - Rollout by platform (stores or direct distribution).

## 13. Implementation Roadmap

- Phase 0: Planning & repo setup
  - Initialize Unity project, namespaces, CI skeleton.
- Phase 1: Auth
  - Implement Clerk flows; secure token storage.
- Phase 2: Chat core
  - Chat UI, Chat Orchestrator integration, domain prompts.
- Phase 3: Order status & returns
  - Backend endpoints; client services; end‑to‑end tests.
- Phase 4: Recommendations
  - Catalog embeddings, RAG, ranking.
- Phase 5: Image generation
  - AI Studio/Vertex integration; safety filters.
- Phase 6: QA & performance
  - Cross‑platform testing; optimization.
- Phase 7: Release
  - Build configs finalized; CI/CD releases.

## 14. Risks & Mitigations

- Clerk SDK availability for Unity: use REST APIs and server verification.
- AI Studio image generation limits: fallback to Vertex Imagen.
- Mobile performance: optimize allocations and batching in chat UI.
- Data privacy: strict access control on order endpoints; audit logging.

## 15. Configuration & Secrets

- Environment variables (server‑side):
  - `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
  - `GOOGLE_API_KEY`
  - `E_COMMERCE_API_BASE_URL`, `E_COMMERCE_API_KEY`
  - `APP_ENV`, `SENTRY_DSN`
- Client config: only non‑secret endpoints; session tokens from Clerk.

## 16. Items to Remove/Modify in Current Repo

- Remove portfolio prompt and history:
  - `app/api/chat/route.ts:17` history seed for personal assistant.
  - `utils/AI-Model.js:20` history seed and client chat session.
- Remove portfolio UI components:
  - `components/ChatInterface.tsx:1`, `components/ChatInput.tsx:1`, `components/HeaderBar.tsx:1`, `components/MiniFooter.tsx:1`, `components/MarkdownRenderer.tsx:1`.
- Remove personal data:
  - `data/personalData.js:1`, `data/personalData.json:1`.

## 17. Acceptance Criteria

- Unity app builds and runs across target platforms.
- Clerk authentication fully operational; sessions verified server‑side.
- Chatbot provides accurate order status, policy explanations, and recommendations.
- Image generation works with AI Studio or Vertex Imagen.
- CI/CD builds artifacts for each platform; tests pass.

---

This document defines the migration and implementation plan. At this stage, only documentation is produced; code changes will follow in the next phase.