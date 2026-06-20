# Multi-Tenancy Research for SkillLink

## What Is Multi-Tenancy?

Multi-tenancy is an architecture where a single instance of software serves multiple distinct groups of users (tenants), with each tenant's data logically or physically separated from others. Each tenant experiences the platform as if it were their own private instance.

**For SkillLink, a tenant = a university or institution.**

Instead of one big pool where every student from every university sees everything, each university gets its own isolated space — their own resources, channels, students, and activity feed — while running on the same codebase, same database, and same server.

---

## Why SkillLink Needs Multi-Tenancy

### The Current Problem

Right now, SkillLink is a **single-tenant flat system**:

- A student at University of Lagos sees resources uploaded by a student at MIT
- Channels mix students from completely unrelated institutions
- The "Students" page shows everyone globally — not useful for finding classmates
- Resources have no institutional context — "Calculus 101 Notes" could be from any curriculum
- No university can adopt SkillLink as "their" platform because there's no boundary

### What Multi-Tenancy Solves

| Problem | Current State | With Multi-Tenancy |
|---------|--------------|-------------------|
| Resource relevance | A nursing student in Lagos sees a law paper from Accra | Students see their own university's resources first |
| Channel usefulness | Channels mix students who will never meet | Channels are scoped to the university — real classmates |
| Student discovery | "Find Students" shows the entire planet | Shows your campus peers, with option to explore globally |
| Institutional adoption | No university would endorse a platform they can't control | Universities can manage their own space, moderate content |
| Data privacy | Everyone sees everything | A university's internal past papers stay within that university |
| Admin control | Only the platform owner can moderate | Each university can have its own admins |
| Scalability | One feed gets noisier as users grow | Each tenant is a clean, focused environment |

---

## Multi-Tenancy Models — Which One Fits SkillLink

There are three standard approaches. Here's how each maps to SkillLink:

### Model 1: Separate Database Per Tenant

```
MongoDB Atlas
├── skilllink_unilag      (University of Lagos)
├── skilllink_mit          (MIT)
├── skilllink_oxford       (Oxford)
└── skilllink_ucc          (University of Cape Coast)
```

**How it works:** Each university gets its own MongoDB database. The app reads the tenant ID from the request (subdomain, header, or URL) and connects to the corresponding database.

| Pros | Cons |
|------|------|
| Strongest data isolation — impossible to leak across tenants | Connection management nightmare at scale (100 universities = 100 DB connections) |
| Easy to back up / delete a single university's data | Expensive — MongoDB Atlas charges per cluster |
| Best compliance story | Schema migrations must run on every database separately |
| | Cross-tenant features (global discover) become very complex |

**Verdict for SkillLink: Overkill.** SkillLink is a student platform, not a healthcare system. The operational cost and complexity aren't justified.

### Model 2: Separate Schema/Collection Per Tenant

```
skilllink database
├── unilag_resources, unilag_users, unilag_channels
├── mit_resources, mit_users, mit_channels
└── oxford_resources, oxford_users, oxford_channels
```

**How it works:** One database, but each tenant gets prefixed collections.

| Pros | Cons |
|------|------|
| Good isolation without multiple databases | Collection sprawl — 100 universities × 5 collections = 500 collections |
| Simpler than separate DBs | Mongoose doesn't handle dynamic collection names well |
| | Cross-tenant queries are painful |
| | Adding a new model means creating it for every tenant |

**Verdict for SkillLink: Poor fit.** MongoDB/Mongoose doesn't work well with dynamic collection names, and SkillLink benefits from cross-tenant discovery.

### Model 3: Shared Database with Filter-Based Isolation (RECOMMENDED)

```
skilllink database
├── users         → each user has a `tenant` field ("unilag", "mit", etc.)
├── resources     → each resource has a `tenant` field
├── channels      → each channel has a `tenant` field
├── posts         → inherits tenant from its channel
├── notifications → inherits tenant from context
```

**How it works:** All data lives in the same collections. Every document has a `tenant` field. Every query automatically filters by the current user's tenant. A middleware layer enforces this.

| Pros | Cons |
|------|------|
| Simplest to implement — add one field + one middleware | Isolation depends on correct query filtering (bugs can leak data) |
| Works perfectly with Mongoose | Slightly more complex queries (every find() needs tenant filter) |
| Cross-tenant features are trivial (just remove the filter) | Single large collection (indexing handles this well) |
| No infrastructure changes | |
| One schema migration affects all tenants | |
| Cheapest to operate — single database | |
| Supports a "global" mode for cross-university discovery | |

**Verdict for SkillLink: Perfect fit.** Simple, cheap, works with existing stack, and supports both isolated AND global views — which is exactly what a student platform needs.

---

## How Filter-Based Isolation Works in SkillLink

### The Tenant Concept

```
Tenant = University/Institution identifier

Examples:
  "unilag"     → University of Lagos
  "mit"        → Massachusetts Institute of Technology
  "ucc"        → University of Cape Coast
  "global"     → Special: no filter, sees everything
```

### Data Flow

```
1. Student signs up → selects their university → tenant assigned
2. Student uploads a resource → resource.tenant = user.tenant
3. Student browses Discover → query filters: { tenant: user.tenant }
4. Student clicks "Global" toggle → query runs without tenant filter
5. Student creates a channel → channel.tenant = user.tenant
6. Admin views dashboard → filtered to their university only
```

### Implementation Blueprint

#### Step 1: Add `tenant` field to all models

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  // ... existing fields ...
  tenant: { type: String, required: true, index: true },
  role:   { type: String, default: 'student', enum: ['student', 'admin', 'superadmin'] }
});

// models/Resource.js
const resourceSchema = new mongoose.Schema({
  // ... existing fields ...
  tenant:     { type: String, required: true, index: true },
  visibility: { type: String, default: 'tenant', enum: ['tenant', 'global'] }
});

// models/Channel.js
const channelSchema = new mongoose.Schema({
  // ... existing fields ...
  tenant: { type: String, required: true, index: true }
});
```

#### Step 2: Tenant middleware (automatic filtering)

```javascript
// middleware/tenant.js
function tenantScope(req, res, next) {
  if (!req.user) return next();
  
  // Attach tenant to request for use in routes
  req.tenant = req.user.tenant;
  
  // If ?global=true is passed and allowed, skip tenant filtering
  req.tenantFilter = req.query.global === 'true' 
    ? {}                           // No filter — global view
    : { tenant: req.tenant };      // Scoped to user's university
  
  next();
}
```

#### Step 3: Apply to routes

```javascript
// Before (current)
router.get('/', async (req, res) => {
  var resources = await Resource.find(query);
});

// After (tenant-aware)
router.get('/', tenantScope, async (req, res) => {
  var resources = await Resource.find({ ...query, ...req.tenantFilter });
});
```

#### Step 4: Compound indexes for performance

```javascript
// Every query now filters by tenant first, so compound indexes are critical
resourceSchema.index({ tenant: 1, createdAt: -1 });
resourceSchema.index({ tenant: 1, subject: 1, createdAt: -1 });
resourceSchema.index({ tenant: 1, downloads: -1 });
channelSchema.index({ tenant: 1, createdAt: -1 });
userSchema.index({ tenant: 1, name: 1 });
```

---

## The Tenant Registration Flow

### How Universities Get On SkillLink

```
Option A: Self-Service (Recommended to start)
──────────────────────────────────────────────
1. Student signs up
2. Types their university name (e.g., "University of Lagos")
3. System normalizes to slug: "university-of-lagos"
4. If slug exists → student joins that tenant
5. If slug is new → new tenant auto-created
6. First student at a university becomes that tenant's admin

Option B: Admin-Provisioned (Later, for partnerships)
──────────────────────────────────────────────────────
1. University contacts SkillLink
2. Superadmin creates tenant with custom slug, branding, settings
3. Students sign up with university email domain (@unilag.edu.ng)
4. Email domain auto-assigns tenant
```

### Email Domain Matching (Smart Tenant Assignment)

```javascript
// Auto-assign tenant based on email domain
const DOMAIN_MAP = {
  'unilag.edu.ng':    'university-of-lagos',
  'students.mit.edu': 'mit',
  'ox.ac.uk':         'oxford',
};

function getTenantFromEmail(email) {
  var domain = email.split('@')[1];
  return DOMAIN_MAP[domain] || null; // null = manual selection
}
```

---

## Tenant-Level Features Unlocked

### 1. University Dashboard (Tenant Admin Panel)

Each university admin gets:
- **Stats**: Total resources, active students, most downloaded, most active channels
- **Moderation**: Flag/remove inappropriate resources or posts
- **Announcements**: Pin messages to all channels in the university
- **Branding**: Custom university logo, accent color, welcome message

### 2. Scoped Discovery with Global Toggle

```
┌─────────────────────────────────────────────┐
│  Discover Resources                         │
│                                             │
│  [🏛 My University]  [🌍 All Universities]  │  ← Toggle
│                                             │
│  Showing 142 resources from Uni of Lagos    │
│  ┌──────┐ ┌──────┐ ┌──────┐               │
│  │ PDF  │ │ PPT  │ │ DOC  │               │
│  └──────┘ └──────┘ └──────┘               │
└─────────────────────────────────────────────┘
```

### 3. University-Scoped Channels

- Channels default to the creator's university
- "General" channel auto-created for each new tenant
- Cross-university channels possible (flagged as "global")

### 4. University Leaderboard

```
Top Contributors at University of Lagos
1. 🥇 Adebayo O.    — 47 resources, 312 downloads
2. 🥈 Chioma N.     — 38 resources, 285 downloads
3. 🥉 Tunde A.      — 31 resources, 198 downloads
```

### 5. Inter-University Resource Sharing

A student can publish a resource as:
- **Tenant-only** (default) — only their university sees it
- **Global** — all universities can discover it

This creates a two-tier system: private institutional knowledge + public academic commons.

---

## Advantages for SkillLink — The Business Case

### 1. University Adoption Becomes Possible

**Without multi-tenancy:** No university will officially adopt a platform where their internal past papers and study guides are visible to everyone globally.

**With multi-tenancy:** A dean can say "Use SkillLink for our department" knowing the content stays within their institution. This is how platforms like Canvas, Blackboard, and Google Workspace for Education work — each university is a tenant.

### 2. Network Effects Per University

**Without:** 50 students from 50 different universities = no value for anyone.

**With:** 50 students from the SAME university = high value. They share relevant resources, know each other's courses, and create useful channels. Growth becomes viral within each campus: "Join SkillLink, that's where our class notes are."

### 3. Relevance and Signal-to-Noise

**Without:** A student searching "calculus" gets results from 200 universities with different curricula, different lecturers, different exam formats. Noise.

**With:** They get calculus resources from their own university first — same lecturer, same syllabus, same exam format. Signal.

### 4. Data Governance and Compliance

Different countries have different data residency and privacy laws:
- **GDPR** (Europe) — data processing must be documented per organization
- **NDPR** (Nigeria) — organizations must consent to data sharing
- **FERPA** (US) — educational records have strict access rules

Multi-tenancy with filter isolation gives you a clean audit trail: "University X's data is only accessible by University X's members."

### 5. Monetization Path

Multi-tenancy opens revenue models:

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Up to 100 students, 1GB storage, basic channels |
| **Campus** | $X/month | Unlimited students, 50GB storage, admin dashboard, analytics |
| **Enterprise** | Custom | SSO integration, API access, priority support, custom branding |

Without multi-tenancy, there's nothing to charge for — it's just a free global dump. With it, each university is a manageable, valuable unit.

### 6. Scalability Without Noise

**Without:** 10,000 users = 10,000 users in one feed. Performance degrades, relevance drops.

**With:** 10,000 users across 50 universities = 200 users per tenant. Each tenant's queries are fast (indexed by tenant), feeds are relevant, and the platform feels personal.

### 7. Content Moderation Scales

**Without:** One global moderation team must review everything.

**With:** Each university has its own admins who moderate their own content. The people closest to the content (students and faculty at that university) handle quality. Platform-level superadmins only intervene for cross-tenant issues.

---

## Implementation Effort Estimate

### Phase 1 — Foundation (1-2 weeks)

- [ ] Create `Tenant` model (name, slug, domain, settings, createdAt)
- [ ] Add `tenant` field to User, Resource, Channel schemas
- [ ] Create tenant middleware for automatic query scoping
- [ ] Update signup flow: university selection → tenant assignment
- [ ] Add compound indexes (tenant + existing indexes)
- [ ] Migrate existing data: assign a default tenant to all existing records

### Phase 2 — Scoped UI (1 week)

- [ ] Add "My University / Global" toggle to Discover page
- [ ] Scope Channels list to tenant (with "Global Channels" section)
- [ ] Scope Students page to tenant
- [ ] Show university name/badge in topbar when logged in
- [ ] Resource upload: default visibility = tenant-only

### Phase 3 — Admin Features (1-2 weeks)

- [ ] Role system: student, admin, superadmin
- [ ] Tenant admin dashboard: stats, user list, moderation tools
- [ ] Superadmin panel: create/manage tenants, global stats
- [ ] Tenant settings: description, welcome message, icon

### Phase 4 — Smart Features (Future)

- [ ] Email domain auto-matching for tenant assignment
- [ ] University leaderboard
- [ ] Cross-university resource sharing (tenant-only vs global toggle)
- [ ] University-branded login pages (custom colors, logo)
- [ ] SSO integration for universities with existing identity providers

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Forgot tenant filter in a query → data leak | High | Mongoose middleware that auto-applies tenant filter; code review checklist |
| User changes university → tenant mismatch | Medium | Allow tenant transfer with admin approval; resources stay in original tenant |
| Small university = empty platform feel | Medium | Global toggle lets students browse all content; suggest popular resources cross-tenant |
| Tenant slug collisions | Low | Normalize slugs, check uniqueness on creation |
| Performance with large tenants | Low | Compound indexes on (tenant + sort field) cover all query patterns |

---

## Conclusion

Filter-based multi-tenancy with university-as-tenant is the single highest-leverage architectural change SkillLink can make. It transforms the platform from "another Google Drive alternative" into "the resource platform for YOUR university" — which is what drives real adoption.

The implementation is straightforward: one new field on existing models, one middleware function, and UI toggles. No infrastructure changes, no new databases, no new servers. The existing MongoDB Atlas + Mongoose + Express stack handles it natively.

**Recommended next step:** Implement Phase 1 (foundation) and Phase 2 (scoped UI) together. This gives you a working multi-tenant system in 2-3 weeks that you can pilot with two real universities.
