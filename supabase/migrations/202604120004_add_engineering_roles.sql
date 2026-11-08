-- Migration: Add 20 Engineering Job Templates to public.jobs

insert into public.jobs (title, company_name, category, difficulty, description, job_description, interview_focus)
values
  ('Distributed Systems Engineer', 'Google', 'Engineering', 'Senior', 
   'Design low-latency distributed coordination services and master consensus algorithms.', 
   'Design fault-tolerant distributed systems, implement Raft/Paxos consensus protocols, manage data partitioning and replication, and eliminate single points of failure across planetary-scale infrastructure.', 
   'Consensus protocols, high-throughput replication, split-brain mitigation, and failure recovery under network partitions.'),

  ('Frontend Architecture Lead', 'Vercel', 'Engineering', 'Senior', 
   'Architect high-performance web platforms and design system foundations.', 
   'Lead web architecture across complex Next.js applications, optimize Core Web Vitals (LCP, INP, CLS), architect design system tokens, and design streaming SSR and micro-frontend patterns.', 
   'Server Components vs Client Components, hydration overhead, bundle size optimization, and modern accessibility standards.'),

  ('Backend Core Services Engineer', 'Stripe', 'Engineering', 'Mid', 
   'Build mission-critical payment processing APIs and transactional ledger pipelines.', 
   'Build high-throughput, ACID-compliant ledger and payment processing services with zero data loss, guaranteed idempotency keys, and sub-50ms p99 latency SLAs.', 
   'Database transaction isolation levels, indexing strategies, distributed locking, and idempotent API execution.'),

  ('Site Reliability & Platform Engineer (SRE)', 'Netflix', 'Engineering', 'Senior', 
   'Ensure 99.999% platform availability across multi-region cloud systems.', 
   'Scale Kubernetes multi-tenant clusters, configure automated canary deployments, define precise SLIs/SLOs, lead high-severity incident responses, and practice chaos engineering to proactively uncover systemic weaknesses.', 
   'Incident triage, graceful degradation, circuit breaker design, and multi-region automated failover.'),

  ('Machine Learning Systems Engineer', 'OpenAI', 'Engineering', 'Senior', 
   'Deploy scalable LLM inference engines and GPU orchestration backends.', 
   'Build low-latency inference runtimes for large language models, manage KV-cache memory allocation with PagedAttention, implement continuous batching, and scale multi-node training clusters with Ray.', 
   'GPU memory management, tensor vs pipeline parallelism, continuous batching, and inference throughput vs latency tradeoffs.'),

  ('Cloud Infrastructure & DevOps Engineer', 'Amazon Web Services', 'Engineering', 'Mid', 
   'Automate zero-downtime continuous deployment pipelines and cloud infrastructure.', 
   'Manage elastic AWS infrastructure using Terraform, build resilient GitHub Actions deployment pipelines, enforce least-privilege IAM policies, and optimize cloud infrastructure costs.', 
   'Infrastructure as Code drift management, blue/green deployments, secrets rotation, and automated rollback triggers.'),

  ('iOS Platform Engineer', 'Apple', 'Engineering', 'Mid', 
   'Engineer 120Hz native iOS applications with resilient offline synchronization.', 
   'Design native iOS user experiences in SwiftUI, optimize memory footprint and retain cycles with Xcode Instruments, implement offline-first synchronization, and structure modular Swift packages.', 
   'Swift modern concurrency, ARC retain cycles, app launch time optimization, and offline conflict resolution.'),

  ('Android Systems & UI Engineer', 'Spotify', 'Engineering', 'Mid', 
   'Craft modern Android audio streaming applications using Jetpack Compose.', 
   'Build fluid Jetpack Compose user interfaces, manage background service lifecycles with WorkManager, optimize reactive state flows using Kotlin Coroutines, and prevent Application Not Responding (ANR) warnings.', 
   'Compose recomposition lifecycle, Kotlin flow backpressure, dependency injection scoping, and battery-conscious background processing.'),

  ('Security & Application Defense Engineer', 'Cloudflare', 'Engineering', 'Senior', 
   'Harden production web platforms against injection, auth bypass, and zero-day vulnerabilities.', 
   'Perform architectural threat modeling, harden authentication and authorization flows (OAuth2/PKCE), audit code for OWASP Top 10 vulnerabilities, and establish automated DAST/SAST pipelines in CI/CD.', 
   'Broken object-level authorization (BOLA), cryptographic key management, CSRF/SSRF prevention, and zero-trust network architectures.'),

  ('Database Internals & Storage Engine Engineer', 'Snowflake', 'Engineering', 'Senior', 
   'Build custom disk-backed transactional storage engines and query execution pipelines.', 
   'Implement low-level storage engines using Log-Structured Merge (LSM) trees, manage memory-mapped page buffers, optimize write-ahead log recovery times, and eliminate multi-version concurrency control (MVCC) lock contention.', 
   'Disk I/O amplification, latch contention, crash recovery with ARIES/WAL, and lock-free concurrency control.'),

  ('Data Platform & Streaming Engineer', 'Confluent', 'Engineering', 'Mid', 
   'Process real-time event streams with millions of messages per second and exactly-once guarantees.', 
   'Architect low-latency streaming pipelines with Apache Kafka and Flink, handle out-of-order data using event watermarking, optimize Apache Iceberg lakehouse tables, and prevent pipeline backpressure.', 
   'Exactly-once stream processing semantics, windowing strategies, Kafka consumer group rebalances, and schema evolution.'),

  ('Full Stack Product Engineer', 'Eightfold AI', 'Engineering', 'Mid', 
   'Rapidly ship end-to-end customer-facing product features from concept to production.', 
   'Ship high-impact features end-to-end: designing relational schemas, building type-safe GraphQL/REST APIs, creating polished accessible user interfaces, and ensuring test coverage with end-to-end integration suites.', 
   'Full-stack feature trade-offs, database query efficiency, optimistic UI updates, and clean modular code separation.'),

  ('Embedded Systems & Firmware Engineer', 'Tesla', 'Engineering', 'Senior', 
   'Develop safety-critical real-time control firmware with microsecond deterministic guarantees.', 
   'Develop hard real-time firmware for ARM Cortex microcontrollers, manage bare-metal peripherals over CAN/SPI/I2C buses, implement RTOS task prioritization, and resolve hard-fault memory corruptions.', 
   'Interrupt service routine (ISR) latency, priority inversion mitigation, DMA transfers, and watchdog timer safety.'),

  ('QA & Test Automation Architect', 'Microsoft', 'Engineering', 'Mid', 
   'Design comprehensive automated testing frameworks and eliminate test suite flakiness.', 
   'Architect fast, deterministic end-to-end test suites using Playwright, implement contract testing across microservices, measure synthetic real-user monitoring, and achieve resilient 95%+ regression coverage.', 
   'Flaky test diagnosis, parallelization strategies, API mocking vs real integration, and performance benchmarking with k6.'),

  ('Computer Vision & Perception Engineer', 'Waymo', 'Engineering', 'Senior', 
   'Develop perception and tracking algorithms for autonomous vehicles and robotics.', 
   'Build real-time 3D object detection models, fuse multi-modal sensor inputs (LiDAR, camera, radar) using extended Kalman filters, and optimize inference runtimes on embedded vehicle hardware accelerators.', 
   'Sensor calibration and synchronization, camera matrix projections, object tracking occlusion handling, and edge latency optimization.'),

  ('Networking & WebRTC Media Engineer', 'Discord', 'Engineering', 'Senior', 
   'Engineer ultra-low-latency peer-to-peer and selective forwarding unit (SFU) audio/video engines.', 
   'Design real-time voice and video engines using WebRTC, implement jitter buffers and forward error correction (FEC) to withstand 25% packet loss, and architect horizontally scalable SFU media servers.', 
   'Congestion control algorithms (GCC/BBR), adaptive bitrate streaming, ICE negotiation, and glass-to-glass latency minimization.'),

  ('High-Frequency / Low-Latency Systems Engineer', 'Citadel Securities', 'Engineering', 'Senior', 
   'Build sub-microsecond financial order execution engines with zero heap allocations.', 
   'Engineer ultra-low latency execution engines in modern C++, optimize CPU cache line alignment, implement lock-free ring buffers, bypass OS networking stacks with Solarflare OpenOnload, and eliminate jitter.', 
   'Memory barriers, cache line false sharing, branch prediction optimization, and zero-allocation hot paths.'),

  ('AI Agent & LLM Application Architect', 'Scale AI', 'Engineering', 'Mid', 
   'Design autonomous AI agents with structured tool invocation and semantic search.', 
   'Architect production LLM agent pipelines with deterministic JSON schema function calling, implement hybrid sparse/dense vector retrieval (RAG) over unstructured docs, and build automated LLM evaluation benchmarks.', 
   'Hallucination mitigation, context window prompt budgeting, vector similarity thresholds, and multi-agent debate coordination.'),

  ('API Platform & Microservices Architect', 'Twilio', 'Engineering', 'Senior', 
   'Standardize microservice communication and design resilient edge API gateways.', 
   'Define enterprise API governance, implement Envoy-based edge gateways with distributed token-bucket rate limiting, manage protocol buffer contract evolution, and enable end-to-end OpenTelemetry distributed tracing.', 
   'Backward-compatible API versioning, cascading failure prevention, service mesh overhead, and distributed circuit breaking.'),

  ('Junior Software Engineer (Foundations)', 'General Benchmark', 'Engineering', 'Junior', 
   'Demonstrate strong core problem-solving fundamentals and clean modular code.', 
   'Solve algorithmic and data structure problems, write clean well-documented functions, communicate reasoning clearly out loud, write comprehensive unit tests, and analyze time and space complexity tradeoffs.', 
   'Big-O time and space complexity, recursion vs iteration, edge case identification, and collaborative problem-solving communication.')
on conflict do nothing;
