# Content Inventory (Phase 5 draft)

Working notes collecting the owner's real content before implementation. Every item cites its source. Nothing here is invented; open questions are marked **[DECIDE]**.

Sources:

- **CV**: `CV-AI.pdf` (owner-supplied)
- **Tracker**: `job-application-track` database, template `Base_2026`, resume line pools (owner's own project)

## Identity

| Field | Value | Source |
|---|---|---|
| Name | Michele Carbone | CV |
| Handle (consistent across web) | `michelecarb` | Owner |
| Website | https://michelecarb.one (custom domain for this site) | Owner |
| LinkedIn | https://www.linkedin.com/in/michelecarb | CV |
| GitHub | https://github.com/MicheleCarb | CV, repo remote |
| Email | Not shown on the site; contact via LinkedIn (email stays inside the PDF) | Owner |
| Phone | Excluded | Owner |
| Location | Currently based in Nice, France (relocation not mentioned for now) | Owner |
| Headline | Software Engineer · DevOps | Owner |
| Short introduction | Software engineer currently based in Nice, France, building and operating high-throughput backend systems in C++ and Java. I work across cloud infrastructure, CI/CD and observability, and bring hands-on Agile experience as a certified Scrum Master and Product Owner. | Draft A, owner-approved with edits |
| Photo | None for now | Owner |
| Spoken languages | Italian (native), English (fluent), French (B2) | CV |

## Pipeline stages (chronological)

### 1. Bachelor in Computer Engineering: SUCCESS

- Polytechnic of Turin, Turin, Italy · 2016 – 2019 (CV)

### Polytechnic of Turin (one station, owner decision 2026-10-28): both degrees below

### 2. MSc in Computer Engineering, Cybersecurity: SUCCESS

- Polytechnic of Turin, Turin, Italy · 2019 – 2022 (CV)
- Thesis: a cybersecurity-based approach to building blockchain systems compliant with data-protection regulations, applied to a Stellantis EV battery supply chain with embedded IoT sensors. (CV)
- Coursework: Data Analysis, Software Engineering, Operating Systems, Algorithms, Cybersecurity. (CV)

### 3. Stellantis: Master Thesis Researcher, then Engineering Specialist: SUCCESS

- Turin, Italy · Oct 2021 – Sep 2022 (CV). Overlaps with stage 2.
- Worked in Connectivity Engineering on connected-vehicle features, maintained specs and coordinated with external teams. (CV)
- Conducted thesis research as part of the EU "Concordia Horizon 2020" cybersecurity program. (CV)
- Designed a GDPR-compliant blockchain approach for EV battery supply-chain tracking integrating IoT sensor data. (CV)

### 4. Amadeus IT Group (Consultant via Groupe SII): Software Engineer · DevOps: SUCCESS

- Nice, France · Feb 2023 – May 2024 (CV)
- Implemented backend changes in C++ and Java to support new functional behaviors and improve message handling logic. (CV)
- Supported early cloud adoption for the application, preparing backend components for scalable deployment. (CV, internal name removed)
- Developed automation and monitoring improvements to enhance reliability and operational visibility. (CV)

### 5. Amadeus IT Group (Consultant via Groupe SII): Software Engineer · DevOps · Scrum Master: SUCCESS

- Nice, France · May 2024 – Dec 2024 (CV)
- Worked on C++ backend components, contributing to feature enhancements, bug fixes, and service stability. (CV)
- Assisted the gradual transition of the application into cloud-ready architecture ahead of large-scale migration. (CV, internal name removed)
- Facilitated Scrum processes to improve team velocity and delivery transparency. (CV)
- Contributed to infrastructure-as-code, automated deployments, and production readiness for cloud components. (CV)
- Configured Ansible for automated traffic management and integrated Jenkins jobs to automate HPA setups. (Tracker only)

### 6. Amadeus IT Group (Consultant via Groupe SII): Software Engineer · DevOps · Team Contributor: RUNNING

- Nice, France · Dec 2024 – Present (CV)
- Designed and operationalized AI knowledge assistants, refining agent orchestration and retrieval strategies. (CV)
- Owned features end-to-end, from technical design and implementation to production deployment and post-release fixes. (CV, Tracker)
- Designed, deployed, and optimized cloud infrastructure for mission-critical systems (Azure, OpenShift). (CV, Tracker)
- Implemented CI/CD pipelines, environment automation, and observability tooling (Jenkins, Grafana, Splunk). (CV, Tracker)
- Decreased cloud cost by more than 200k€/year (over 20%) implementing cost-optimization initiatives (e.g., HPA rollouts). (CV, Tracker; owner corrected to "more than", 2026-10-29)
- Supported the deployment and stability of our application across five European cloud landing zones. (CV, Tracker)
- Led a team of 15 engineers as Scrum Master and Product Owner across two major applications. (CV, Tracker, internal names removed)
- Implemented and extended backend functionalities in C++ for high-performance services, supporting new message types. (Tracker only)
- Contributed to real-time backend services used by airline customers in production environments. (Tracker only)
- Developed backend components in Java and built Python tools and automation scripts used daily by the team. (Tracker only)
- Supported the team as Scrum Master and Product Owner, aligning delivery priorities with technical execution. (Tracker only)
- Supported the cloud migration of high-throughput backend systems processing 150k TPS in production. (Tracker; chosen figure)
- Built Jenkins automation for HPA freeze/unfreeze with automated production approvals for fast recovery. (Tracker only, reworded)

#### Selected for the site (owner: the CV lines, with earlier decisions applied)

1. Designed and operationalized AI knowledge assistants, refining agent orchestration and retrieval strategies.
2. Owned features end-to-end, from technical design and implementation to production deployment and post-release fixes.
3. Supported the cloud migration of high-throughput backend systems processing 150k TPS in production.
4. Designed, deployed, and optimized cloud infrastructure for mission-critical systems (Azure, OpenShift).
5. Implemented CI/CD pipelines, environment automation, and observability tooling (Jenkins, Grafana, Splunk).
6. Decreased cloud cost by more than 200k€/year (over 20%) through cost-optimization initiatives (e.g., HPA rollouts).
7. Supported the deployment and stability of our application across five European cloud landing zones.
8. Led a team of 15 engineers as Scrum Master and Product Owner across two major applications.

### 7. Next build: PENDING

- Neutral wording: "Pipeline continues". No future employer, role, or job-seeking claim. (Owner)

## Skills (CV)

- Programming: C, C++, Java; Python and Bash (automation and tooling) ("production" dropped, owner 2026-10-29)
- Cloud & platforms: Azure, OpenShift, Kubernetes
- DevOps: high-throughput distributed systems (150k TPS), CI/CD, Infrastructure as Code, Git, ArgoCD, Kafka
- Tools: Linux (daily CLI, Ubuntu), Jenkins, Grafana, Splunk
- Agile: Scrum, SAFe, Product Ownership, Scrum Master
- ~~AI: Cursor, GitHub Copilot, supporting AI-augmented development workflows~~ replaced by (owner, 2026-10-28):
  - Agent orchestration: multi-agent workflows, AI knowledge assistants, context engineering
  - Agentic development: Claude Code, Cursor, GitHub Copilot, Claude Skills, MCP
- Also mentioned in tracker lines: Ansible

## Certifications (CV)

- SAFe 6.0 Certified AI-Empowered Product Owner/Product Manager
- SAFe 6.0 Certified Scrum Master

## Owner decisions

- **Throughput:** state 150k TPS; the "over one million TPS" line is dropped.
- **Disclosure:** internal application names are generalized; the more-than-200k€/year (over 20%) saving and the 150k TPS figure are published.
- **Email:** not on the site; contact through LinkedIn.
- **Structure:** Amadeus is one stage with three role steps; stages are ordered newest first; the next stage reads "Pipeline continues".
- **Italian:** Claude drafts translations from the English; the owner reviews and approves before publishing.

## Still open

1. **Gap Sep 2022 – Feb 2023.** Not covered by any stage; left as is so the pipeline doesn't imply continuity that isn't there.
2. **Stellantis overlaps the MSc** (Oct 2021 – 2022): it began as the thesis and became full-time employment after graduation. Shown as the stage after the MSc, ordered by start date (owner decision).
3. **Final resume PDF**: English only, linked from both language versions; file to be supplied.
