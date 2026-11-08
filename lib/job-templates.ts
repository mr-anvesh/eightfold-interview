import { JobRecord } from "./types";

export const ENGINEERING_TEMPLATES: JobRecord[] = [
  {
    id: "eng-template-01",
    title: "Distributed Systems Engineer",
    company_name: "Google",
    category: "Engineering",
    difficulty: "Senior",
    skills: "Go, Raft Consensus, gRPC, Distributed Storage, Fault Tolerance, Kafka",
    description: "Design low-latency distributed coordination services and master consensus algorithms.",
    job_description:
      "Design fault-tolerant distributed systems, implement Raft/Paxos consensus protocols, manage data partitioning and replication, and eliminate single points of failure across planetary-scale infrastructure.",
    interview_focus: "Consensus protocols, high-throughput replication, split-brain mitigation, and failure recovery under network partitions.",
  },
  {
    id: "eng-template-02",
    title: "Frontend Architecture Lead",
    company_name: "Vercel",
    category: "Engineering",
    difficulty: "Senior",
    skills: "TypeScript, React 19, Next.js App Router, Web Performance, State Architecture, CSS Systems",
    description: "Architect high-performance web platforms and design system foundations.",
    job_description:
      "Lead web architecture across complex Next.js applications, optimize Core Web Vitals (LCP, INP, CLS), architect design system tokens, and design streaming SSR and micro-frontend patterns.",
    interview_focus: "Server Components vs Client Components, hydration overhead, bundle size optimization, and modern accessibility standards.",
  },
  {
    id: "eng-template-03",
    title: "Backend Core Services Engineer",
    company_name: "Stripe",
    category: "Engineering",
    difficulty: "Mid",
    skills: "Go, PostgreSQL, Redis, Event-Driven Architecture, REST/gRPC, Idempotency",
    description: "Build mission-critical payment processing APIs and transactional ledger pipelines.",
    job_description:
      "Build high-throughput, ACID-compliant ledger and payment processing services with zero data loss, guaranteed idempotency keys, and sub-50ms p99 latency SLAs.",
    interview_focus: "Database transaction isolation levels, indexing strategies, distributed locking, and idempotent API execution.",
  },
  {
    id: "eng-template-04",
    title: "Site Reliability & Platform Engineer (SRE)",
    company_name: "Netflix",
    category: "Engineering",
    difficulty: "Senior",
    skills: "Kubernetes, Terraform, Prometheus, Incident Response, Linux Internals, Chaos Engineering",
    description: "Ensure 99.999% platform availability across multi-region cloud systems.",
    job_description:
      "Scale Kubernetes multi-tenant clusters, configure automated canary deployments, define precise SLIs/SLOs, lead high-severity incident responses, and practice chaos engineering to proactively uncover systemic weaknesses.",
    interview_focus: "Incident triage, graceful degradation, circuit breaker design, and multi-region automated failover.",
  },
  {
    id: "eng-template-05",
    title: "Machine Learning Systems Engineer",
    company_name: "OpenAI",
    category: "Engineering",
    difficulty: "Senior",
    skills: "Python, PyTorch, CUDA, vLLM, Distributed Training, Tensor Parallelism",
    description: "Deploy scalable LLM inference engines and GPU orchestration backends.",
    job_description:
      "Build low-latency inference runtimes for large language models, manage KV-cache memory allocation with PagedAttention, implement continuous batching, and scale multi-node training clusters with Ray.",
    interview_focus: "GPU memory management, tensor vs pipeline parallelism, continuous batching, and inference throughput vs latency tradeoffs.",
  },
  {
    id: "eng-template-06",
    title: "Cloud Infrastructure & DevOps Engineer",
    company_name: "Amazon Web Services",
    category: "Engineering",
    difficulty: "Mid",
    skills: "AWS, Docker, CI/CD, GitHub Actions, Terraform, Bash Scripting",
    description: "Automate zero-downtime continuous deployment pipelines and cloud infrastructure.",
    job_description:
      "Manage elastic AWS infrastructure using Terraform, build resilient GitHub Actions deployment pipelines, enforce least-privilege IAM policies, and optimize cloud infrastructure costs.",
    interview_focus: "Infrastructure as Code drift management, blue/green deployments, secrets rotation, and automated rollback triggers.",
  },
  {
    id: "eng-template-07",
    title: "iOS Platform Engineer",
    company_name: "Apple",
    category: "Engineering",
    difficulty: "Mid",
    skills: "Swift, SwiftUI, Combine, Modern Concurrency (async/await), CoreData, Instruments",
    description: "Engineer 120Hz native iOS applications with resilient offline synchronization.",
    job_description:
      "Design native iOS user experiences in SwiftUI, optimize memory footprint and retain cycles with Xcode Instruments, implement offline-first synchronization, and structure modular Swift packages.",
    interview_focus: "Swift modern concurrency, ARC retain cycles, app launch time optimization, and offline conflict resolution.",
  },
  {
    id: "eng-template-08",
    title: "Android Systems & UI Engineer",
    company_name: "Spotify",
    category: "Engineering",
    difficulty: "Mid",
    skills: "Kotlin, Jetpack Compose, Coroutines, Flow, Hilt/Dagger, WorkManager",
    description: "Craft modern Android audio streaming applications using Jetpack Compose.",
    job_description:
      "Build fluid Jetpack Compose user interfaces, manage background service lifecycles with WorkManager, optimize reactive state flows using Kotlin Coroutines, and prevent Application Not Responding (ANR) warnings.",
    interview_focus: "Compose recomposition lifecycle, Kotlin flow backpressure, dependency injection scoping, and battery-conscious background processing.",
  },
  {
    id: "eng-template-09",
    title: "Security & Application Defense Engineer",
    company_name: "Cloudflare",
    category: "Engineering",
    difficulty: "Senior",
    skills: "AppSec, OAuth2/OIDC, OWASP Top 10, Cryptography, Threat Modeling, Pen Testing",
    description: "Harden production web platforms against injection, auth bypass, and zero-day vulnerabilities.",
    job_description:
      "Perform architectural threat modeling, harden authentication and authorization flows (OAuth2/PKCE), audit code for OWASP Top 10 vulnerabilities, and establish automated DAST/SAST pipelines in CI/CD.",
    interview_focus: "Broken object-level authorization (BOLA), cryptographic key management, CSRF/SSRF prevention, and zero-trust network architectures.",
  },
  {
    id: "eng-template-10",
    title: "Database Internals & Storage Engine Engineer",
    company_name: "Snowflake",
    category: "Engineering",
    difficulty: "Senior",
    skills: "C++, LSM Trees, B-Trees, Write-Ahead Logging (WAL), Storage Engines, Concurrency",
    description: "Build custom disk-backed transactional storage engines and query execution pipelines.",
    job_description:
      "Implement low-level storage engines using Log-Structured Merge (LSM) trees, manage memory-mapped page buffers, optimize write-ahead log recovery times, and eliminate multi-version concurrency control (MVCC) lock contention.",
    interview_focus: "Disk I/O amplification, latch contention, crash recovery with ARIES/WAL, and lock-free concurrency control.",
  },
  {
    id: "eng-template-11",
    title: "Data Platform & Streaming Engineer",
    company_name: "Confluent",
    category: "Engineering",
    difficulty: "Mid",
    skills: "Apache Kafka, Apache Flink, Apache Spark, Parquet, Iceberg, Python",
    description: "Process real-time event streams with millions of messages per second and exactly-once guarantees.",
    job_description:
      "Architect low-latency streaming pipelines with Apache Kafka and Flink, handle out-of-order data using event watermarking, optimize Apache Iceberg lakehouse tables, and prevent pipeline backpressure.",
    interview_focus: "Exactly-once stream processing semantics, windowing strategies, Kafka consumer group rebalances, and schema evolution.",
  },
  {
    id: "eng-template-12",
    title: "Full Stack Product Engineer",
    company_name: "Eightfold AI",
    category: "Engineering",
    difficulty: "Mid",
    skills: "TypeScript, React, Node.js, GraphQL, PostgreSQL, TailwindCSS",
    description: "Rapidly ship end-to-end customer-facing product features from concept to production.",
    job_description:
      "Ship high-impact features end-to-end: designing relational schemas, building type-safe GraphQL/REST APIs, creating polished accessible user interfaces, and ensuring test coverage with end-to-end integration suites.",
    interview_focus: "Full-stack feature trade-offs, database query efficiency, optimistic UI updates, and clean modular code separation.",
  },
  {
    id: "eng-template-13",
    title: "Embedded Systems & Firmware Engineer",
    company_name: "Tesla",
    category: "Engineering",
    difficulty: "Senior",
    skills: "Embedded C, FreeRTOS, ARM Cortex, I2C/SPI/CAN, Memory Constraints, JTAG",
    description: "Develop safety-critical real-time control firmware with microsecond deterministic guarantees.",
    job_description:
      "Develop hard real-time firmware for ARM Cortex microcontrollers, manage bare-metal peripherals over CAN/SPI/I2C buses, implement RTOS task prioritization, and resolve hard-fault memory corruptions.",
    interview_focus: "Interrupt service routine (ISR) latency, priority inversion mitigation, DMA transfers, and watchdog timer safety.",
  },
  {
    id: "eng-template-14",
    title: "QA & Test Automation Architect",
    company_name: "Microsoft",
    category: "Engineering",
    difficulty: "Mid",
    skills: "Playwright, Cypress, TypeScript, Jest, Performance Testing, Contract Testing",
    description: "Design comprehensive automated testing frameworks and eliminate test suite flakiness.",
    job_description:
      "Architect fast, deterministic end-to-end test suites using Playwright, implement contract testing across microservices, measure synthetic real-user monitoring, and achieve resilient 95%+ regression coverage.",
    interview_focus: "Flaky test diagnosis, parallelization strategies, API mocking vs real integration, and performance benchmarking with k6.",
  },
  {
    id: "eng-template-15",
    title: "Computer Vision & Perception Engineer",
    company_name: "Waymo",
    category: "Engineering",
    difficulty: "Senior",
    skills: "Python, C++, OpenCV, PyTorch, Kalman Filters, SLAM, Point Clouds",
    description: "Develop perception and tracking algorithms for autonomous vehicles and robotics.",
    job_description:
      "Build real-time 3D object detection models, fuse multi-modal sensor inputs (LiDAR, camera, radar) using extended Kalman filters, and optimize inference runtimes on embedded vehicle hardware accelerators.",
    interview_focus: "Sensor calibration and synchronization, camera matrix projections, object tracking occlusion handling, and edge latency optimization.",
  },
  {
    id: "eng-template-16",
    title: "Networking & WebRTC Media Engineer",
    company_name: "Discord",
    category: "Engineering",
    difficulty: "Senior",
    skills: "C++, WebRTC, QUIC, TCP/IP, UDP, NAT Traversal (STUN/TURN), RTP/RTCP",
    description: "Engineer ultra-low-latency peer-to-peer and selective forwarding unit (SFU) audio/video engines.",
    job_description:
      "Design real-time voice and video engines using WebRTC, implement jitter buffers and forward error correction (FEC) to withstand 25% packet loss, and architect horizontally scalable SFU media servers.",
    interview_focus: "Congestion control algorithms (GCC/BBR), adaptive bitrate streaming, ICE negotiation, and glass-to-glass latency minimization.",
  },
  {
    id: "eng-template-17",
    title: "High-Frequency / Low-Latency Systems Engineer",
    company_name: "Citadel Securities",
    category: "Engineering",
    difficulty: "Senior",
    skills: "Modern C++ (20/23), Lock-Free Structures, Cache Line Coherency, Kernel Bypass, Memory Barriers",
    description: "Build sub-microsecond financial order execution engines with zero heap allocations.",
    job_description:
      "Engineer ultra-low latency execution engines in modern C++, optimize CPU cache line alignment, implement lock-free ring buffers, bypass OS networking stacks with Solarflare OpenOnload, and eliminate jitter.",
    interview_focus: "Memory barriers, cache line false sharing, branch prediction optimization, and zero-allocation hot paths.",
  },
  {
    id: "eng-template-18",
    title: "AI Agent & LLM Application Architect",
    company_name: "Scale AI",
    category: "Engineering",
    difficulty: "Mid",
    skills: "TypeScript, Python, LangChain, RAG Architecture, Vector DBs (pgvector), Tool Calling",
    description: "Design autonomous AI agents with structured tool invocation and semantic search.",
    job_description:
      "Architect production LLM agent pipelines with deterministic JSON schema function calling, implement hybrid sparse/dense vector retrieval (RAG) over unstructured docs, and build automated LLM evaluation benchmarks.",
    interview_focus: "Hallucination mitigation, context window prompt budgeting, vector similarity thresholds, and multi-agent debate coordination.",
  },
  {
    id: "eng-template-19",
    title: "API Platform & Microservices Architect",
    company_name: "Twilio",
    category: "Engineering",
    difficulty: "Senior",
    skills: "Go, Envoy Gateway, Protocol Buffers, Distributed Tracing, Rate Limiting, OpenAPI",
    description: "Standardize microservice communication and design resilient edge API gateways.",
    job_description:
      "Define enterprise API governance, implement Envoy-based edge gateways with distributed token-bucket rate limiting, manage protocol buffer contract evolution, and enable end-to-end OpenTelemetry distributed tracing.",
    interview_focus: "Backward-compatible API versioning, cascading failure prevention, service mesh overhead, and distributed circuit breaking.",
  },
  {
    id: "eng-template-20",
    title: "Junior Software Engineer (Foundations)",
    company_name: "General Benchmark",
    category: "Engineering",
    difficulty: "Junior",
    skills: "JavaScript, Python, Data Structures, Algorithms, Git, Unit Testing, SQL Basics",
    description: "Demonstrate strong core problem-solving fundamentals and clean modular code.",
    job_description:
      "Solve algorithmic and data structure problems, write clean well-documented functions, communicate reasoning clearly out loud, write comprehensive unit tests, and analyze time and space complexity tradeoffs.",
    interview_focus: "Big-O time and space complexity, recursion vs iteration, edge case identification, and collaborative problem-solving communication.",
  },
];

export const OTHER_ROLE_TEMPLATES: JobRecord[] = [
  {
    id: "role-pm-01",
    title: "Product Manager",
    company_name: "Meta",
    category: "Product",
    difficulty: "Mid",
    skills: "Product Discovery, Prioritization, Roadmap Strategy, Metrics & KPIs, A/B Testing",
    description: "Define product roadmap and lead execution across cross-functional teams.",
    job_description:
      "Lead product discovery, build quantitative roadmaps, define north-star metrics, communicate with executive stakeholders, and design rigorous A/B experiments to maximize user retention and monetization.",
    interview_focus: "Product sense, stakeholder trade-off prioritization, metric degradation root-cause analysis, and user journey design.",
  },
  {
    id: "role-data-01",
    title: "Data Analyst & Analytics Engineer",
    company_name: "Uber",
    category: "Data",
    difficulty: "Junior",
    skills: "SQL, Python, dbt, Data Modeling, Tableau, Cohort Analysis",
    description: "Transform raw behavioral telemetry into strategic business intelligence.",
    job_description:
      "Write advanced analytical SQL (window functions, CTEs), model dimensional schemas in dbt, build executive performance dashboards, and run cohort retention analyses to guide business investments.",
    interview_focus: "Complex SQL query optimization, funnel drop-off analysis, KPI anomaly detection, and data storytelling.",
  },
  {
    id: "role-design-01",
    title: "Product Designer (UI/UX)",
    company_name: "Figma",
    category: "Design",
    difficulty: "Mid",
    skills: "Figma, User Research, Wireframing, Design Systems, Accessibility (WCAG), Prototyping",
    description: "Design intuitive user-centered digital interfaces and scalable component libraries.",
    job_description:
      "Conduct user research interviews, synthesize insights into high-fidelity interactive Figma prototypes, define responsive component specs for engineers, and ensure adherence to WCAG 2.1 AA accessibility guidelines.",
    interview_focus: "Design critique rationales, accessibility contrast standards, usability friction discovery, and engineering handoff precision.",
  },
  {
    id: "role-growth-01",
    title: "Growth & Lifecycle Marketer",
    company_name: "Substack",
    category: "Marketing",
    difficulty: "Senior",
    skills: "Acquisition Funnels, Retention Loops, A/B Testing, Email Automation, SEO, CAC/LTV",
    description: "Design acquisition and viral referral loops to scale organic subscriber growth.",
    job_description:
      "Build multi-channel acquisition funnels, analyze user churn inflection points, implement automated lifecycle drip campaigns, and optimize the ratio of customer acquisition cost (CAC) to lifetime value (LTV).",
    interview_focus: "Experimentation velocity, funnel bottleneck diagnosis, viral loop mechanics, and paid vs organic attribution modeling.",
  },
];

export const ALL_DEFAULT_TEMPLATES: JobRecord[] = [
  ...ENGINEERING_TEMPLATES,
  ...OTHER_ROLE_TEMPLATES,
];

/**
 * Merges database jobs with our comprehensive templates so that
 * all 20+ roles are always available in the UI.
 */
export function getMergedJobTemplates(dbJobs: JobRecord[]): JobRecord[] {
  const merged: JobRecord[] = [];
  const seenTitles = new Set<string>();

  // Add DB jobs first if available
  for (const job of dbJobs) {
    if (job.title && !seenTitles.has(job.title.toLowerCase().trim())) {
      seenTitles.add(job.title.toLowerCase().trim());
      merged.push(job);
    }
  }

  // Then add all engineering & default templates that aren't already in DB
  for (const template of ALL_DEFAULT_TEMPLATES) {
    if (!seenTitles.has(template.title.toLowerCase().trim())) {
      seenTitles.add(template.title.toLowerCase().trim());
      merged.push(template);
    }
  }

  return merged;
}

/**
 * Extracts a comma-separated skills string for any job record
 */
export function getSkillsForJob(job: JobRecord): string {
  if (job.skills) {
    return Array.isArray(job.skills) ? job.skills.join(", ") : job.skills;
  }

  // Fallback heuristic based on title / category
  const titleLower = job.title.toLowerCase();
  if (titleLower.includes("frontend")) {
    return "TypeScript, React, Next.js, CSS Architecture, Web Performance";
  }
  if (titleLower.includes("distributed") || titleLower.includes("system")) {
    return "Go, Raft Consensus, gRPC, Distributed Storage, Kafka";
  }
  if (titleLower.includes("backend") || titleLower.includes("software engineer")) {
    return "Go, PostgreSQL, Redis, REST APIs, Microservices, Concurrency";
  }
  if (titleLower.includes("machine learning") || titleLower.includes("ml")) {
    return "Python, PyTorch, CUDA, Distributed Training, vLLM";
  }
  if (titleLower.includes("sre") || titleLower.includes("reliability") || titleLower.includes("devops")) {
    return "Kubernetes, Terraform, Prometheus, Linux, Incident Response";
  }
  if (titleLower.includes("ios") || titleLower.includes("swift")) {
    return "Swift, SwiftUI, Combine, Modern Concurrency, Instruments";
  }
  if (titleLower.includes("android") || titleLower.includes("kotlin")) {
    return "Kotlin, Jetpack Compose, Coroutines, Flow, Hilt";
  }
  if (titleLower.includes("product")) {
    return "Product Discovery, Prioritization, Roadmap Strategy, A/B Testing";
  }
  if (titleLower.includes("data")) {
    return "SQL, Python, dbt, Data Modeling, Tableau";
  }
  if (titleLower.includes("design") || titleLower.includes("ux")) {
    return "Figma, User Research, Wireframing, Design Systems, WCAG";
  }

  return "Problem Solving, System Architecture, Code Design, Communication";
}
