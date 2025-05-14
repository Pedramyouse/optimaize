# راهنمای بهینه‌سازی GSAP

این پروژه از یک سیستم بهینه‌سازی متمرکز برای انیمیشن‌های GSAP استفاده می‌کند که در `src/utils/gsapUtils.ts` تعریف شده است. استفاده از این سیستم به شما کمک می‌کند تا:

1. از نشت حافظه جلوگیری کنید
2. عملکرد و کارایی انیمیشن‌ها را بهبود بخشید
3. پاکسازی انیمیشن‌ها و ScrollTriggerها را ساده کنید
4. از ثبت چندباره پلاگین‌ها جلوگیری کنید

## نحوه استفاده

### 1. واردسازی ابزارهای مورد نیاز

```typescript
import { 
  createScrollTrigger, 
  createScrollTimeline, 
  cleanupScrollTriggers, 
  performanceDefaults 
} from '../utils/gsapUtils';
```

### 2. تعریف یک شناسه منحصر به فرد برای کامپوننت

هر کامپوننت باید یک شناسه منحصر به فرد داشته باشد تا بتوان انیمیشن‌های آن را ردیابی و پاکسازی کرد:

```typescript
const COMPONENT_ID = 'my-component-name';
```

### 3. استفاده از `createScrollTrigger` به جای `ScrollTrigger.create`

```typescript
// به جای:
// ScrollTrigger.create({...});

// از این استفاده کنید:
createScrollTrigger(COMPONENT_ID, {
  trigger: element,
  start: 'top center',
  // سایر تنظیمات...
});
```

### 4. استفاده از `createScrollTimeline` برای ایجاد تایم‌لاین‌ها

```typescript
const tl = createScrollTimeline(COMPONENT_ID, {
  trigger: element,
  start: 'top 80%'
});

tl.fromTo(element, 
  { opacity: 0, y: 50 },
  { opacity: 1, y: 0, ...performanceDefaults }
);
```

### 5. پاکسازی در useEffect

```typescript
useEffect(() => {
  // منطق انیمیشن...
  
  return () => {
    cleanupScrollTriggers(COMPONENT_ID);
  };
}, []);
```

### 6. استفاده از تنظیمات پیش‌فرض عملکرد

```typescript
gsap.to(element, {
  x: 100,
  ...performanceDefaults,
  // تنظیمات خاص خود را اضافه کنید
  duration: 0.8 // این مقدار پیش‌فرض را بازنویسی می‌کند
});
```

## نکات بهینه‌سازی بیشتر

1. **از `force3D: true` استفاده کنید**: این گزینه شتاب‌دهی سخت‌افزاری را فعال می‌کند.

2. **مدت زمان انیمیشن‌ها را کوتاه کنید**: انیمیشن‌های کوتاه‌تر، CPU کمتری مصرف می‌کنند.

3. **از نوع‌های آسان ساده‌تر استفاده کنید**: `power2.out` یا `power3.out` نسبت به `elastic` یا `bounce` منابع کمتری مصرف می‌کنند.

4. **از حداقل تعداد ScrollTrigger استفاده کنید**: هر ScrollTrigger منابع سیستم را مصرف می‌کند.

5. **استفاده از `overwrite: 'auto'`**: برای جلوگیری از همپوشانی انیمیشن‌ها و مشکلات عملکرد.

6. **از `willChange` در CSS استفاده کنید**: برای عناصری که مکرراً انیمیشن می‌شوند.

```css
.animated-element {
  will-change: transform, opacity;
}
```

## نمونه کد

```typescript
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { createScrollTimeline, cleanupScrollTriggers, performanceDefaults } from '../utils/gsapUtils';

const COMPONENT_ID = 'my-animated-component';

const MyComponent = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const tl = createScrollTimeline(COMPONENT_ID, {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none none'
    });
    
    tl.fromTo(element,
      { 
        opacity: 0, 
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        force3D: true
      }
    );
    
    return () => {
      cleanupScrollTriggers(COMPONENT_ID);
    };
  }, []);
  
  return <div ref={elementRef}>محتوای من</div>;
};

export default MyComponent;
```

با استفاده از این رویکرد، سایت شما با انیمیشن‌های روان‌تر و مصرف منابع کمتر اجرا خواهد شد. 