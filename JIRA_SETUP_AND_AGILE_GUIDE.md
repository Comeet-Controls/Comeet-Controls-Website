# Comeet Controls — Jira Agile Setup & Project Management Guide

> **Project:** Comeet Controls Pvt. Ltd. Website Overhaul  
> **Repository:** [GitHub - Comeet Controls Website](https://github.com/VIT-TY-CS-L10/Comeet-Controls-Website)  
> **Jira Import File:** [`JIRA_SPRINT_BACKLOG.csv`](./JIRA_SPRINT_BACKLOG.csv)  

---

## 1. Why Use Jira for This Project?

Using Jira Software elevates this project from a standard student/freelance build to an **enterprise-grade, industry-standard delivery**:
1. **Client Trust & Professionalism:** You can invite company stakeholders to track live progress or share clean burndown reports.
2. **GitHub Integration:** Commit messages like `git commit -m "CCW-12 Add WhatsApp chat #done"` automatically move cards on your Jira board and link code changes to tickets.
3. **Traceability:** Every machine photo, client request, and bug fix is tracked with clear ownership, priority, and deadlines.
4. **100% Free:** Jira Cloud is completely free for up to 10 team members.

---

## 2. Setting Up Jira (Step-by-Step in 3 Minutes)

### Step 1: Create a Free Jira Account
1. Go to [https://www.atlassian.com/software/jira](https://www.atlassian.com/software/jira).
2. Click **"Get it free"** and sign in with your Google or GitHub account.
3. Choose your site URL (e.g. `comeet-controls.atlassian.net` or `yourteam.atlassian.net`).

### Step 2: Create the Project
1. Choose **"Scrum"** template (recommended for sprint-based delivery).
2. Select **"Company-managed"** or **"Team-managed"**.
3. Set:
   - **Project Name:** `Comeet Controls Website`
   - **Project Key:** `CCW` (all tickets will be formatted like `CCW-1`, `CCW-2`, etc.)

---

## 3. Importing All Sprints & Stories in 1 Click (Using CSV)

Instead of manually typing 20 tickets into Jira, use our pre-built [`JIRA_SPRINT_BACKLOG.csv`](./JIRA_SPRINT_BACKLOG.csv):

1. In your Jira dashboard, click **Settings (⚙️ Gear icon in top right)** → **System**.
2. In the left sidebar under *Import and Export*, click **External System Import**.
3. Select **CSV**.
4. Choose the file: `c:\Users\HP\OneDrive\Desktop\Projects\Comeet-Controls-website\JIRA_SPRINT_BACKLOG.csv`.
5. Map the fields (Jira auto-detects them):
   - `Summary` → **Summary**
   - `Issue Type` → **Issue Type**
   - `Description` → **Description**
   - `Priority` → **Priority**
   - `Story Points` → **Story Points**
   - `Sprint` → **Sprint**
   - `Epic Name` → **Epic Name**
   - `Epic Link` → **Epic Link**
6. Click **Begin Import**.

Your entire backlog with **4 Epics, 4 Sprints, and 14 Stories/Tasks** will appear populated instantly!

---

## 4. Connecting Jira to Your GitHub Repository

Connect Jira to your repository (`VIT-TY-CS-L10/Comeet-Controls-Website`):

1. In Jira, go to **Apps** → **Explore more apps** → Search for **"GitHub for Jira"** (Official Atlassian app, free).
2. Click **Get app** → Connect your GitHub account and organization `VIT-TY-CS-L10`.
3. Select the repository **`Comeet-Controls-Website`**.

### ⚡ Smart Commits (Automate Jira from Git!)
Once connected, every Git commit with the ticket key updates Jira automatically:

```bash
# Link a commit to ticket CCW-8:
git commit -m "CCW-8 Optimize machine photos to WebP format"

# Move ticket CCW-12 to Done automatically:
git commit -m "CCW-12 Integrate WhatsApp button #done"

# Log 2 hours of work on ticket CCW-5:
git commit -m "CCW-5 Conduct client discovery meeting #time 2h"
```

---

## 5. Agile Sprint Structure & Breakdown

### 🏆 Epics Overview
- **`CCW-EPIC-1` [Sprint 1]: Discovery & Asset Management**
- **`CCW-EPIC-2` [Sprint 2]: Visual Media & Content Refinement**
- **`CCW-EPIC-3` [Sprint 3]: Backend Security & Lead Workflows**
- **`CCW-EPIC-4` [Sprint 4]: QA, Domain Deployment & Handover**

---

### Detailed Sprint Breakdown

#### 🔹 Sprint 1: Discovery & Asset Management (Days 1 – 3)
| Ticket | Type | Summary | Story Points |
|---|---|---|---|
| `CCW-1` | Story | Conduct Stakeholder Discovery Meeting with Comeet Controls | 3 |
| `CCW-2` | Task | Collect High-Res Logo and Brand Guidelines | 2 |
| `CCW-3` | Task | Gather Real Machine Photos & Case Studies from Factory | 3 |

**Sprint Goal:** Freeze technical scope, lock client preferences, and acquire authentic media assets.

---

#### 🔹 Sprint 2: Visual Media & Content Refinement (Days 4 – 8)
| Ticket | Type | Summary | Story Points |
|---|---|---|---|
| `CCW-4` | Story | Optimize & Integrate Real Machine Photography (WebP Next/Image) | 5 |
| `CCW-5` | Story | Add Downloadable PDF Product Brochure & Line Sheets | 3 |
| `CCW-6` | Story | Integrate Floating WhatsApp Quick-Connect Widget | 2 |
| `CCW-7` | Story | Embed Interactive Google Map for Chinchwad Works | 3 |

**Sprint Goal:** Transform template visuals into authentic factory imagery and enable instant mobile contact.

---

#### 🔹 Sprint 3: Backend Security & Lead Workflows (Days 9 – 13)
| Ticket | Type | Summary | Story Points |
|---|---|---|---|
| `CCW-8` | Story | Connect Production SMTP Credentials (`sales@comeetindia.com`) | 5 |
| `CCW-9` | Story | Verify Anti-Spam Honeypot & IP Rate Limiting Defenses | 3 |
| `CCW-10` | Task | Configure Pune Local Business JSON-LD SEO Schema | 3 |

**Sprint Goal:** Production-grade email transmission, anti-spam validation, and local Google search optimization.

---

#### 🔹 Sprint 4: QA, Domain Deployment & Handover (Days 14 – 18)
| Ticket | Type | Summary | Story Points |
|---|---|---|---|
| `CCW-11` | Story | Comprehensive Cross-Device & Mobile Browser QA Audit | 3 |
| `CCW-12` | Task | Configure Domain DNS Records (`comeetindia.com` → Vercel) | 3 |
| `CCW-13` | Task | Verify Auto-SSL / HTTPS Certificate Issuance | 1 |
| `CCW-14` | Story | Deliver Final Documentation & Client Training Handover | 1 |

**Sprint Goal:** Live cutover on custom domain with 100% uptime and client sign-off.

---

## 6. How to Share Progress with the Client

1. **Client Guest Access:** You can invite the client's email as a "Customer" or "Stakeholder" in Jira so they can view the active board without editing anything.
2. **Weekly Export:** Under **Reports** in Jira, click **"Sprint Report"** or **"Burndown Chart"** and export a clean 1-page PDF to email to the company directors.
3. **Staging Demos:** Pair every Sprint completion with a quick 5-minute video or live demo on the Vercel staging preview link (`https://comeet-controls.vercel.app`).