<img width="1232" height="876" alt="image" src="https://github.com/user-attachments/assets/603b7772-92fc-4fb5-858c-1c8463d8c3e1" /># Candidate Management Dashboard

A full-stack web application for managing job candidates with real-time updates, advanced filtering, and modern UI/UX.

## 🌐 Live Demo

**Frontend:** https://test-task-for-jot-solutions.vercel.app  
**Backend API:** https://candidate-api-mj3z.onrender.com/api

> ⚠️ **Note:** Hosted on free tier (Render + Vercel). First load may take 30-50 seconds as the backend spins up from sleep mode. Please be patient!

## 📸 Preview

<img width="1886" height="875" alt="image" src="https://github.com/user-attachments/assets/8c942a47-39a3-488d-ac69-6ea43deea8c7" />
<img width="1874" height="871" alt="image" src="https://github.com/user-attachments/assets/97c80eb0-1b74-46cb-9a09-4d56e6a001f5" />
<img width="1250" height="874" alt="image" src="https://github.com/user-attachments/assets/302ff5a1-a809-45b2-af88-57f8267996dc" />
<img width="1232" height="876" alt="image" src="https://github.com/user-attachments/assets/dfaeafa8-9831-475f-a5f7-b7d4b9d1bdc8" />
<img width="1270" height="874" alt="image" src="https://github.com/user-attachments/assets/f25008f1-ebb4-48c1-b656-5b464b561005" />
<img width="643" height="782" alt="image" src="https://github.com/user-attachments/assets/87760a33-8479-447d-b200-c1d672aa368f" />
<img width="641" height="786" alt="image" src="https://github.com/user-attachments/assets/9b340336-7f7c-4f1d-b544-47502b534378" />




---

## ✨ What's Implemented

### Core Features
- **Full CRUD operations** for candidate management
- **Advanced filtering system** - search by name, filter by status (Active/Interview/Rejected) and skills
- **Real-time status updates** with optimistic UI updates
- **Multi-skill management** - candidates can have multiple skills with autocomplete suggestions
- **Responsive design** - works seamlessly on mobile, tablet, and desktop
- **Statistics dashboard** - real-time counts of total, active, interviewing, and rejected candidates
- **Data persistence** - all changes saved to PostgreSQL database

### User Experience
- **Instant feedback** - toast notifications for all actions
- **Loading states** - skeleton screens and spinners where appropriate
- **Confetti animations** on successful candidate creation
- **Smooth transitions** - hover effects, scale animations, gradient backgrounds
- **Keyboard shortcuts** - ESC to close modals, Enter to submit forms
- **Error handling** - graceful error messages and fallback states

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with **TypeScript** - latest stable version, full type safety
- **Vite** - blazing fast development and optimized production builds
- **Tailwind CSS** - utility-first styling with custom animations
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - elegant notifications
- **Canvas Confetti** - celebration animations

### Backend
- **Node.js** + **Express** - REST API server
- **TypeScript** - type-safe backend code
- **Prisma ORM** - type-safe database queries and migrations
- **PostgreSQL** - production-grade relational database
- **CORS** - configured for cross-origin requests

### DevOps & Deployment
- **Vercel** - frontend deployment with automatic CI/CD
- **Render** - backend and database hosting
- **Git** - version control

---

## 🎯 Technical Highlights

### 1. Optimistic UI Updates
```typescript
// Update UI immediately, rollback on error
const updateStatus = async (id: number, status: CandidateStatus) => {
    const previousCandidates = [...candidates];

    setCandidates(prev =>
        prev.map(c => c.id === id ? { ...c, status } : c)
    );

    try {
        await candidatesAPI.updateStatus(id, status);
    } catch (err) {
        setCandidates(previousCandidates); // Rollback
        toast.error('Failed to update');
    }
};
```

### 2. Custom Hook with State Management
```typescript
export const useCandidates = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);

    // Centralized API logic with error handling
    // Optimistic updates for better UX
    // Toast notifications for user feedback

    return { candidates, loading, updateStatus, createCandidate, ... };
};
```

### 3. Advanced Filtering with useMemo
```typescript
const filteredAndSortedCandidates = useMemo(() => {
    let result = candidates.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
        const matchesSkill = !skillFilter || candidate.skills.includes(skillFilter);
        return matchesSearch && matchesStatus && matchesSkill;
    });

    // Sorting logic
    result.sort((a, b) => { /* ... */ });

    return result;
}, [candidates, searchTerm, statusFilter, skillFilter, sortOption]);
```

### 4. Database Schema with Relations
```prisma
model Candidate {
  id          Int       @id @default(autoincrement())
  name        String
  position    String
  status      String
  email       String    @unique
  phone       String
  description String
  skills      CandidateSkill[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Skill {
  id         Int       @id @default(autoincrement())
  name       String    @unique
  candidates CandidateSkill[]
}

model CandidateSkill {
  candidateId Int
  skillId     Int
  candidate   Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  skill       Skill     @relation(fields: [skillId], references: [id], onDelete: Cascade)
  @@id([candidateId, skillId])
}
```

### 5. DTO Validation Layer
```typescript
export function validateCreateCandidateDTO(body: any) {
    if (!body.name || typeof body.name !== 'string') {
        return { valid: false, error: 'Name is required' };
    }

    if (!body.email || !body.email.includes('@')) {
        return { valid: false, error: 'Valid email is required' };
    }

    if (!Array.isArray(body.skills) || body.skills.length === 0) {
        return { valid: false, error: 'At least one skill required' };
    }

    return { valid: true, data: { /* sanitized data */ } };
}
```

---

## 📡 API Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/candidates` | Get all candidates with skills |
| `GET` | `/api/candidates/:id` | Get single candidate by ID |
| `GET` | `/api/candidates/all-skills` | Get list of all available skills |
| `POST` | `/api/candidates` | Create new candidate |
| `PUT` | `/api/candidates/:id` | Update candidate info |
| `PATCH` | `/api/candidates/:id/status` | Update candidate status only |
| `DELETE` | `/api/candidates/:id` | Delete candidate |

**Example Request:**
```bash
POST /api/candidates
Content-Type: application/json

{
  "name": "John Doe",
  "position": "Frontend Developer",
  "status": "active",
  "email": "john@example.com",
  "phone": "+1234567890",
  "description": "Experienced React developer",
  "skills": ["React", "TypeScript", "Node.js"]
}
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or use free tier from Render/Supabase)

### Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "DATABASE_URL=your_postgresql_url" > .env
echo "PORT=5000" >> .env

# Apply database schema
npx prisma db push

# (Optional) Seed with sample data
npx ts-node src/seed.ts

# Start server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Update API URL in src/api/candidates.ts to http://localhost:5000/api

# Start dev server
npm run dev
```

Open http://localhost:5173

---

## 🎨 Key Features Breakdown

### Candidate Card Component
- Color-coded avatars with initials
- Status badges with pulse animation
- Skill chips (first 3 visible + counter)
- Hover effects and smooth transitions
- Fully accessible (keyboard navigation, ARIA labels)

### Modal System
- Backdrop with blur effect
- Escape key to close
- Click outside to dismiss
- Gradient headers matching status color
- Form validation with real-time feedback

### Skills Management
- Autocomplete from existing skills
- Add custom skills on the fly
- Visual selection indicators
- Deduplication logic

---

## ✅ Requirements Checklist

- ✅ React 18+ with TypeScript
- ✅ Functional components and hooks
- ✅ REST API with Express + TypeScript
- ✅ PostgreSQL database with Prisma ORM
- ✅ Candidate list with card layout
- ✅ Details modal with all info
- ✅ Status change persisted to DB
- ✅ Client-side filtering (status, skills, name)
- ✅ Responsive grid (1/2/3/4 columns)
- ✅ Validation and error handling
- ✅ Loading states
- ✅ Many-to-many relationship (Skills)
- ✅ Seed data
- ✅ Production deployment

**Bonus implementations:**
- ✅ Optimistic UI updates
- ✅ Custom hooks (`useCandidates`)
- ✅ Memoization (`useMemo`, `memo`)
- ✅ Toast notifications
- ✅ Confetti animations
- ✅ Advanced sorting
- ✅ Statistics dashboard
- ✅ Full CRUD (not just read/update)
- ✅ TypeScript throughout entire stack
- ✅ Transaction support on status updates

---

## 🔧 Development Notes

### Why These Choices?

**Vite over CRA:** Faster dev server, smaller bundle, better DX

**Prisma over raw SQL:** Type safety, automatic migrations, great DX

**Optimistic updates:** Better perceived performance, instant feedback

**Tailwind CSS:** Rapid development, consistent design system, tiny bundle with PurgeCSS

**TypeScript everywhere:** Catch bugs at compile time, better IDE support, self-documenting code

### Performance Optimizations
- Component memoization with `React.memo`
- Computed values with `useMemo`
- Debounced search (could be added)
- Lazy loading modals (could be added)

---

## 📝 License

MIT

---

## 👨‍💻 Author

Developed as a test task for JotSolutions

---

---

# 🇺🇦 README Українською

## Candidate Management Dashboard

Повнофункціональний веб-застосунок для управління кандидатами з оновленнями в реальному часі, розширеною фільтрацією та сучасним UI/UX.

## 🌐 Демо

**Frontend:** https://test-task-for-jot-solutions.vercel.app  
**Backend API:** https://candidate-api-mj3z.onrender.com/api

> ⚠️ **Увага:** Розміщено на безкоштовних серверах. Перше завантаження може зайняти 30-50 секунд, оскільки backend "засинає" після 15 хвилин неактивності.

## ✨ Що реалізовано

### Основний функціонал
- **Повний CRUD** для управління кандидатами
- **Розширена система фільтрації** - пошук по імені, фільтр по статусу та навичках
- **Оновлення статусу в реальному часі** з оптимістичними оновленнями UI
- **Управління навичками** - кандидати можуть мати декілька навичок з автодоповненням
- **Адаптивний дизайн** - працює на мобільних, планшетах і десктопах
- **Панель статистики** - підрахунок кандидатів в реальному часі
- **Збереження даних** - всі зміни зберігаються в PostgreSQL

### Користувацький досвід
- **Миттєвий зворотний зв'язок** - toast сповіщення для всіх дій
- **Стани завантаження** - скелетони та спінери
- **Конфеті анімації** при успішному додаванні кандидата
- **Плавні переходи** - hover ефекти, анімації, градієнти
- **Гарячі клавіші** - ESC для закриття модалок, Enter для підтвердження
- **Обробка помилок** - коректні повідомлення про помилки

## 🛠️ Стек технологій

### Frontend
- **React 19** + **TypeScript**
- **Vite** - швидка розробка та оптимізовані білди
- **Tailwind CSS** - utility-first стилізація
- **Axios** - HTTP клієнт
- **React Hot Toast** - сповіщення

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM** - type-safe запити до БД
- **PostgreSQL**

### Deployment
- **Vercel** - frontend
- **Render** - backend та база даних

## 🎯 Технічні особливості

### Optimistic UI Updates
Інтерфейс оновлюється миттєво, навіть до відповіді сервера. Якщо запит не вдається - автоматичний rollback до попереднього стану.

### Custom Hook для State Management
Вся логіка роботи з API винесена в кастомний хук `useCandidates`, що забезпечує чистоту компонентів та перевикористання коду.

### Advanced Filtering з useMemo
Фільтрація та сортування оптимізовані через `useMemo` - перераховуються тільки при зміні залежностей.

### DTO Validation Layer
Серверна валідація даних з детальними повідомленнями про помилки.

### Many-to-Many Relations
Коректна реалізація зв'язку багато-до-багатьох між кандидатами та навичками через проміжну таблицю.

## 📡 API

| Метод | Endpoint | Опис |
|-------|----------|------|
| `GET` | `/api/candidates` | Отримати всіх кандидатів |
| `GET` | `/api/candidates/:id` | Отримати одного кандидата |
| `GET` | `/api/candidates/all-skills` | Список всіх навичок |
| `POST` | `/api/candidates` | Створити кандидата |
| `PUT` | `/api/candidates/:id` | Оновити кандидата |
| `PATCH` | `/api/candidates/:id/status` | Змінити статус |
| `DELETE` | `/api/candidates/:id` | Видалити кандидата |

## ✅ Виконані вимоги

- ✅ React 18+ з TypeScript
- ✅ Функціональні компоненти та хуки
- ✅ REST API на Express + TypeScript
- ✅ PostgreSQL + Prisma ORM
- ✅ Список кандидатів з карточками
- ✅ Модальне вікно з деталями
- ✅ Зміна статусу зі збереженням в БД
- ✅ Фільтрація (статус, навички, ім'я)
- ✅ Адаптивна сітка
- ✅ Валідація та обробка помилок
- ✅ Loading states
- ✅ Many-to-many зв'язок
- ✅ Seed дані
- ✅ Production deployment

**Додаткові фічі:**
- ✅ Optimistic UI updates
- ✅ Кастомні хуки
- ✅ Мемоізація
- ✅ Toast сповіщення
- ✅ Анімації
- ✅ Розширене сортування
- ✅ Статистика
- ✅ Повний CRUD
- ✅ TypeScript на всьому стеку

## 📝 Ліцензія

MIT

## 👨‍💻 Автор

Розроблено як тестове завдання для JotSolutions
