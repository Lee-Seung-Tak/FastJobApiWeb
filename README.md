# FastJobAPI - WEB

## Stack

* **Framework**: React
* **Build Tool**: Vite
* **css** : Tailwind
---

## Docs

* React: [https://ko.react.dev/reference/react](https://ko.react.dev/reference/react)
* Vite: [https://ko.vite.dev/guide/](https://ko.vite.dev/guide/)
* Tailwind : [https://tailwindcss.com/docs/installation/using-vite](https://tailwindcss.com/docs/installation/using-vite)
---

## Quick Start

### 1. 프로젝트 생성

```bash
npm create vite@latest
```

* Framework: React
* Variant: TypeScript 선택

### 2. 의존성 설치

```bash
cd ProjectName
yarn
```

### 3. 기본 라우팅 라이브러리 설치

```bash
yarn add react-router-dom
```

### 4. Tailwind CSS 설치
```bash
npm install tailwindcss @tailwindcss/vite
```

### 5. Configure the Vite plugin
#### [ vite.config.ts ]
```
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

### 6. Import Tailwind CSS
```bash
@import "tailwindcss";
```

### 6. 개발 서버 실행

```bash
yarn dev
```

---


