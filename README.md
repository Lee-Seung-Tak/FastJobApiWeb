# FastJobAPI - WEB

## Stack

* **Framework**: React
* **Build Tool**: Vite

---

## Docs

* React: [https://ko.react.dev/reference/react](https://ko.react.dev/reference/react)
* Vite: [https://ko.vite.dev/guide/](https://ko.vite.dev/guide/)

---

## Quick Start

### 1. 프로젝트 생성

```bash
yarn create vite@latest
# or
npm create vite@latest
```

* Framework: React
* Variant: JavaScript 또는 TypeScript 선택

### 2. 의존성 설치

```bash
cd ProjectName
yarn
```

### 3. 기본 라우팅 라이브러리 설치

```bash
yarn add react-router-dom
```

### 4. 개발 서버 실행

```bash
yarn dev
```

---

## 🎨 TailwindCSS 설치 및 설정

### 1. 설치

```bash
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

> 위 명령어에서 오류가 발생한다면 아래 방법으로 수동 생성

```bash
touch tailwind.config.js
```

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 2. PostCSS 설정이 없는 경우

```bash
yarn add -D @tailwindcss/postcss
```

```bash
touch postcss.config.js
```

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

---

## shadcn-ui 설치 및 컴포넌트 추가

### 1. 초기화

```bash
npx shadcn@latest init
```

### 2. button 컴포넌트 추가

```bash
npx shadcn@latest add button
```

> components.json 파일 자동 생성됨. 프로젝트 루트에 위치해야 함

### 3. alias 설정 (vite.config.js)

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
```

> `@/components/ui/button`와 같은 import가 가능해짐

---

## 📝 기타 주의사항

* `components.json`은 반드시 프로젝트 루트 경로에 위치해야 함 (`src` 폴더 안 X)
* `src/components/ui/` 경로에 실제 컴포넌트가 존재하는지 확인 (src/components/ui도 수동 생성 필요한 경우 수동생성)
* 파일명이 `?button.jsx`처럼 비정상적인 경우 `mv '?button.jsx' button.jsx`로 변경
