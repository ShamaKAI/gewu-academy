# Gewu Academy — Mentor Portal (格物讲堂) Design

**Date:** 2026-07-29 | **Status:** Approved | **Sub-project:** A (基础框架 + 首页 + 导航)

---

## 1. Overview

Build the mentor portal (`/mentor`) for 师者 (mentors). This is a standalone subsystem parallel to the scholar portal (`/scholar`).

Mentors log in, select their identity from 5 financial mentors, and access their teaching dashboard.

### Sub-projects

| Project | Content | Status |
|---------|---------|--------|
| A. 基础框架 | Login flow + routes + home layout + nav + mentor card | ← **This spec** |
| B. 讲义 | Course management (published + create) | Future |
| C. 雅集 | Event management (published + create) | Future |
| D. 书录 | Teaching analytics dashboard | Future |

---

## 2. Sub-Project A: Foundation

### 2.1 Login Flow

1. User clicks "师者" on landing page → login modal (same credentials: gwxy2026 / 2026gwxy)
2. After login → Mentor Selector screen: 5 financial mentors in a grid
3. Select a mentor → redirect to `/mentor`

### 2.2 Routes

```
/mentor                        → Home (先生书斋) — greeting + mentor card + course list
/mentor/select                 → Mentor selector (after login, before home)
```

### 2.3 Layout (2-column)

```
┌─ Left Nav 220px ──┬── Main Content ────────────────────┐
│ 格物讲堂            │  Top: Time-based greeting          │
│                    │  Mentor card (collapses in detail)  │
│ ▸ 讲义（课程）       │  ┌─ Content ────────────────────┐ │
│   藏经阁            │  │                                │ │
│   著书              │  │                                │ │
│ ▸ 雅集（活动）       │  │                                │ │
│   雅集录            │  │                                │ │
│   发起雅集           │  │                                │ │
│ ▸ 书录（数据）       │  │                                │ │
│                    │  └────────────────────────────────┘ │
│ ← 返回书院           │                                     │
│ 退出登录             │                                     │
└────────────────────┴─────────────────────────────────────┘
```

### 2.4 Greeting

Time-based:
- 0-6: 晚安
- 6-12: 早安 / 晨安
- 12-14: 午安
- 14-18: 午后安
- 18-24: 晚安

Format: "{greeting}，{name}，欢迎来到格物讲堂。"

### 2.5 Mentor Card

Shown on home + main list pages, collapses when entering detail views.

```
┌─────────────────────────────────────────────────────┐
│  🧑 栖云先生          Jason Lim               [编辑] │
│                                                     │
│  MDRT 8届 · 500+高净值家庭 · 资产逾4亿              │
│                                                     │
│  "财富不止于积累，更在于有序传承。" — 座右铭        │
└─────────────────────────────────────────────────────┘
```

### 2.6 Navigation

| 宋名 | 现代名 | 路由 | 
|------|--------|------|
| 讲义 | 课程 | `/mentor` (default) |
| └ 藏经阁 | 已发布课程 | `/mentor` |
| └ 著书 | 新建课程 | `/mentor/courses/new` |
| 雅集 | 活动 | `/mentor/events` |
| └ 雅集录 | 已举办 | `/mentor/events` |
| └ 发起雅集 | 创建 | `/mentor/events/new` |
| 书录 | 数据 | `/mentor/analytics` |

### 2.7 Mentor Data

```typescript
interface MentorProfile {
  id: string;
  name: string;        // 栖云先生
  nameEn: string;      // Jason Lim
  avatar: string;
  motto: string;
  achievements: string[];
  specialties: string[];
  experience: string;
  courseIds: string[]; // real course IDs
}
```

5 pre-loaded mentor profiles matching existing `courses.ts` data.

### 2.8 Files to Create/Modify

```
New:
  src/app/[locale]/mentor/layout.tsx
  src/app/[locale]/mentor/page.tsx
  src/app/[locale]/mentor/select/page.tsx
  src/app/[locale]/mentor/courses/new/page.tsx     (stub)
  src/app/[locale]/mentor/courses/[id]/page.tsx    (stub)
  src/app/[locale]/mentor/events/page.tsx           (stub)
  src/app/[locale]/mentor/analytics/page.tsx        (stub)
  src/components/mentor/Sidebar.tsx
  src/components/mentor/MentorCard.tsx
  src/components/mentor/MentorSelector.tsx
  src/data/mentors.ts

Modify:
  src/components/landing/LoginModal.tsx  (route to /mentor/select for "mentor" role)
  src/i18n/messages/zh.json              (add mentor keys)
  src/i18n/messages/en.json
  src/i18n/messages/ms.json
```

### 2.9 i18n Keys

```json
"mentor_greeting_chen": "晨安，{name}，欢迎来到格物讲堂。",
"mentor_greeting_wu": "午安，{name}，欢迎来到格物讲堂。",
"mentor_greeting_afternoon": "午后安，{name}，欢迎来到格物讲堂。",
"mentor_greeting_wan": "晚安，{name}，欢迎来到格物讲堂。",
"mentor_nav_lectures": "讲义",
"mentor_nav_library": "藏经阁",
"mentor_nav_new_course": "著书",
"mentor_nav_events": "雅集",
"mentor_nav_event_log": "雅集录",
"mentor_nav_new_event": "发起雅集",
"mentor_nav_analytics": "书录",
"mentor_nav_back": "返回书院",
"mentor_nav_logout": "退出登录",
"mentor_select_title": "选择先生身份",
"mentor_edit_profile": "编辑资料",
"mentor_motto_label": "座右铭",
"mentor_courses_published": "已刊行典籍",
"mentor_students_count": "门下学子"
```

---

## 3. Style

- All black `#000` text
- KaiTi for Chinese, Times New Roman for English/numbers
- B&W borders `border-[#000]`
- Framer Motion entrance animations
- Ancient scroll/ink aesthetic, plenty of whitespace
