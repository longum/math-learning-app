# 数学学习应用 - 设计文档

**项目名称**: 小学数学加减法可视化学习应用
**创建日期**: 2026-03-02
**目标用户**: 5-8岁小学生
**教学方法**: Concrete-Pictorial-Abstract (CPA) - 新加坡数学Base-10 Blocks

---

## 一、项目概述

### 1.1 项目目标
创建一个网页应用，帮助5-8岁儿童理解数字概念和加减法运算。通过可视化、动画化的Base-10 Blocks展示，让抽象的数学概念变得具体可感。

### 1.2 核心功能
1. **数字可视化** - 理解数字的构成（如37 = 3个十 + 7个一）
2. **加法可视化** - 逐步展示加法运算过程和结果
3. **减法可视化** - 逐步展示减法运算过程和结果

### 1.3 难度分级
- **Level 1**: 1-100以内的数字和运算
- **Level 2**: 1-1000以内的数字和运算

---

## 二、技术架构

### 2.1 技术栈
```
前端框架：React 18 + Vite
路由管理：React Router v6
UI样式：Tailwind CSS
动画库：Framer Motion
状态管理：React Context + useState
数据存储：localStorage
类型检查：TypeScript（可选）
部署方式：静态托管（Vercel/Netlify）
```

### 2.2 项目结构
```
math-learning-app/
├── src/
│   ├── pages/              # 页面组件
│   │   ├── LoginPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── NumberPage.tsx
│   │   ├── AdditionPage.tsx
│   │   └── SubtractionPage.tsx
│   ├── components/         # 可复用组件
│   │   ├── BaseTenBlock.tsx
│   │   ├── OneBlock.tsx
│   │   ├── HundredBlock.tsx
│   │   ├── NumberInput.tsx
│   │   ├── EquationInput.tsx
│   │   └── AnimationStage.tsx
│   ├── hooks/              # 自定义Hooks
│   │   ├── useAuth.tsx
│   │   ├── useAnimation.tsx
│   │   └── useLevelSelector.tsx
│   ├── utils/              # 工具函数
│   │   ├── numberParser.ts
│   │   └── validator.ts
│   ├── contexts/           # Context
│   │   ├── AuthContext.tsx
│   │   └── AppContext.tsx
│   └── App.tsx
```

### 2.3 路由设计
```
/login          - 登录页
/home           - 主菜单（选择难度和功能）
/number/:level  - 数字可视化（level1或level2）
/addition/:level - 加法可视化
/subtraction/:level - 减法可视化
```

---

## 三、功能详细设计

### 3.1 登录功能

**界面设计**：
```
┌─────────────────────────┐
│   数学学习乐园          │
│                         │
│   用户名: [_______]     │
│   密码:   [_______]     │
│                         │
│    [登录]               │
└─────────────────────────┘
```

**预设凭证**：
- `student1 / math123`
- `student2 / learn456`

**实现要点**：
- 凭证存储在配置文件中
- 登录状态保存在localStorage，30分钟过期
- 错误提示在输入框下方显示，不使用alert

### 3.2 主页（导航中心）

**界面设计**：
```
┌─────────────────────────────────┐
│  欢迎，同学！                    │
│                                 │
│  选择难度：                      │
│  [ 1-100 ]  [ 1-1000 ]          │
│                                 │
│  选择功能：                      │
│  ┌─────────┐ ┌─────────┐        │
│  │ 🔢 数字 │  │ ➕ 加法 │        │
│  │ 可视化  │  │ 可视化  │        │
│  └─────────┘ └─────────┘        │
│  ┌─────────┐                    │
│  │ ➖ 减法  │                    │
│  │ 可视化  │                    │
│  └─────────┘                    │
│                                 │
│  [退出登录]                     │
└─────────────────────────────────┘
```

### 3.3 数字可视化

**Level 1（1-100）示例：37**
```
输入：37

展示：
┌─────────────────────────────────────┐
│  37 = 3个十 + 7个一                 │
│                                     │
│  [██][██][██]  [█][█][█][█][█][█][█]│
│   十          一                    │
│                                     │
│  [▶ 开始演示] [↺ 重新开始]          │
└─────────────────────────────────────┘
```

**Level 2（1-1000）示例：345**
```
输入：345

展示：
┌───────────────────────────────────────────┐
│  345 = 3个百 + 4个十 + 5个一              │
│                                           │
│  [███████] [██][██][██][██] [█][█][█][█][█]│
│   百          十           一              │
│                                           │
└───────────────────────────────────────────┘
```

**动画步骤**：
1. 整体显示数字
2. 动画拆解成各位数
3. 各位数转换成对应的blocks
4. 最终展示完整的blocks组合

### 3.4 加法可视化

**示例：27 + 15 = 42**

**界面**：
```
┌─────────────────────────────────────┐
│  加法可视化（1-100）                 │
│                                     │
│  算式输入: [___] + [___]            │
│                                     │
│  展示区域：                          │
│                                     │
│     27: [██][██][██][█][█][█][█]    │
│                                     │
│  +  15: [██][█][█][█][█][█]         │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  步骤1: 合并个位 7 + 5 = 12         │
│  步骤2: 12个一 = 1个十 + 2个一       │
│  步骤3: 合并十位 2 + 1 + 1 = 4      │
│  结果: 42                           │
│                                     │
│  [▶ 演示动画] [↺ 重新开始]          │
└─────────────────────────────────────┘
```

**动画步骤**：
1. 显示两个加数的blocks
2. 个位blocks移动到一起并高亮
3. 如果需要进位，演示10个一合并成1个十
4. 十位blocks移动到一起
5. 显示最终结果

### 3.5 减法可视化

**示例：52 - 27 = 25**

**动画步骤**：
1. 显示被减数的blocks（52）
2. 显示减数的blocks（27）
3. 如果个位不够减，演示"拆十"（1个十拆成10个一）
4. 从个位开始减
5. 从十位减
6. 显示最终结果

---

## 四、UI/UX设计

### 4.1 配色方案（清新自然）

```css
/* 主色调 */
--primary-green: #4CAF50;      /* 主按钮、选中状态 */
--primary-blue: #2196F3;       /* 次要按钮、链接 */
--light-green: #81C784;        /* 背景装饰 */
--light-blue: #64B5F6;         /* 输入框边框 */
--white: #FFFFFF;
--gray-bg: #F5F5F5;            /* 页面背景 */
--text-dark: #333333;          /* 主要文字 */
--text-light: #666666;         /* 次要文字 */
--error-red: #E57373;          /* 错误提示 */
--success-green: #66BB6A;      /* 成功提示 */
```

### 4.2 Base-10 Blocks设计

| 块类型 | 尺寸 | 颜色 | 用途 |
|--------|------|------|------|
| 百位块 | 100×100px | 橙色 #FF9800 | Level 2使用 |
| 十位块 | 100×40px | 绿色 #4CAF50 | 所有级别 |
| 个位块 | 10×40px | 蓝色 #2196F3 | 所有级别 |

### 4.3 字体设计

```css
font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;

--font-title: 28px;      /* 标题 */
--font-large: 24px;      /* 数字显示 */
--font-body: 18px;       /* 正文 */
--font-small: 16px;      /* 辅助文字 */
```

### 4.4 动画参数

```javascript
淡入淡出：800ms
移动动画：1500ms（慢速，适合儿童）
变形动画：1000ms
步骤间隔：500ms
缓动函数：easeInOutCubic
```

### 4.5 响应式设计

- **桌面端（>768px）**：最大宽度1024px，居中布局
- **平板端（768-1024px）**：100%宽度，适度缩小间距
- **移动端（<768px）**：单列布局，增大按钮（最小44px）

---

## 五、数据流与状态管理

### 5.1 全局状态（Context）

**AuthContext**：
```typescript
{
  isAuthenticated: boolean,
  user: string | null,
  login: (username, password) => Promise<boolean>,
  logout: () => void
}
```

**AppContext**：
```typescript
{
  difficulty: 'level1' | 'level2',
  setDifficulty: (level) => void
}
```

### 5.2 页面级状态

**NumberPage**：
```typescript
{
  inputNumber: string,
  blocks: Block[],
  animationStep: number,
  isAnimating: boolean
}
```

**AdditionPage/SubtractionPage**：
```typescript
{
  equation: { num1, num2, operator },
  steps: AnimationStep[],
  currentStep: number,
  isAnimating: boolean,
  showResult: boolean
}
```

### 5.3 本地存储

```typescript
'math-app-auth': '登录状态（30分钟过期）'
'math-app-preferences': '用户偏好设置'
```

---

## 六、核心算法

### 6.1 数字解析算法

```typescript
function parseNumberToBlocks(num: number, difficulty: string): Block[] {
  const blocks: Block[] = [];

  if (difficulty === 'level1') {
    const tens = Math.floor(num / 10);
    const ones = num % 10;

    if (tens > 0) blocks.push({ type: 'ten', value: 10, count: tens });
    if (ones > 0) blocks.push({ type: 'one', value: 1, count: ones });
  } else {
    const hundreds = Math.floor(num / 100);
    const tens = Math.floor((num % 100) / 10);
    const ones = num % 10;

    if (hundreds > 0) blocks.push({ type: 'hundred', value: 100, count: hundreds });
    if (tens > 0) blocks.push({ type: 'ten', value: 10, count: tens });
    if (ones > 0) blocks.push({ type: 'one', value: 1, count: ones });
  }

  return blocks;
}
```

### 6.2 加法步骤生成算法

```typescript
function generateAdditionSteps(num1: number, num2: number, difficulty: string): AnimationStep[] {
  const steps: AnimationStep[] = [];

  // 1. 显示两个数字
  steps.push({ description: `展示 ${num1} 和 ${num2}`, blocks: [...] });

  // 2. 合并个位
  const ones1 = num1 % 10;
  const ones2 = num2 % 10;
  const totalOnes = ones1 + ones2;
  steps.push({ description: `合并个位：${ones1} + ${ones2} = ${totalOnes}`, action: 'merge_ones' });

  // 3. 处理进位
  if (totalOnes >= 10) {
    const tensToAdd = Math.floor(totalOnes / 10);
    const remainingOnes = totalOnes % 10;
    steps.push({ description: `${totalOnes}个一 = ${tensToAdd}个十 + ${remainingOnes}个一`, action: 'carry_over' });
  }

  // 4. 合并十位
  const tens1 = Math.floor(num1 / 10) % 10;
  const tens2 = Math.floor(num2 / 10) % 10;
  const totalTens = tens1 + tens2 + (totalOnes >= 10 ? Math.floor(totalOnes / 10) : 0);
  steps.push({ description: `合并十位：${tens1} + ${tens2} = ${totalTens}`, action: 'merge_tens' });

  // 5. 显示结果
  steps.push({ description: `结果：${num1 + num2}`, showResult: true });

  return steps;
}
```

---

## 七、错误处理

### 7.1 输入验证

**登录**：
- 用户名和密码不能为空
- 凭证不匹配显示错误

**数字输入**：
- 必须为数字
- Level 1: 1-100
- Level 2: 1-1000

**算式输入**：
- 格式：数字 + 运算符 + 数字
- 范围验证
- 结果验证（加法不超上限，减法不小于1）

### 7.2 错误提示方式

- 输入框下方红色文字
- 输入框边框变红
- 3秒后自动消失
- 不使用alert()

---

## 八、测试策略

### 8.1 功能测试清单

```
□ 登录功能
□ 难度选择和切换
□ 数字可视化（两个级别）
□ 加法可视化（含进位）
□ 减法可视化（含借位）
□ 动画播放控制
□ 输入验证
□ 响应式设计
```

### 8.2 测试用例

1. **简单加法**: 23 + 45 = 68（无进位）
2. **进位加法**: 37 + 15 = 52（个位进位）
3. **边界加法**: 99 + 1 = 100（进位到百位）
4. **简单减法**: 58 - 23 = 35（无借位）
5. **借位减法**: 52 - 27 = 25（个位借位）
6. **百位运算**: 345 + 234 = 579
7. **输入验证**: abc + 15（错误提示）
8. **范围验证**: 150 + 50（超出范围）

---

## 九、未来扩展（可选）

- [ ] 学习进度追踪
- [ ] 练习题模式
- [ ] 成就系统
- [ ] 家长管理端
- [ ] 乘法和除法可视化
- [ ] 打印练习题功能
- [ ] 多语言支持

---

## 十、总结

本设计方案采用现代化的技术栈（React + Vite），通过直观的可视化和流畅的动画，帮助5-8岁儿童理解数学概念。应用架构清晰，易于维护和扩展，适合作为教育类Web应用的基础。

**关键特性**：
✅ 单页应用架构，流畅的用户体验
✅ Base-10 Blocks经典教学法
✅ 两个难度级别，延长使用周期
✅ 慢速动画，易于理解
✅ 简单登录验证，无需后端
✅ 清新配色，护眼舒适
✅ 响应式设计，支持多种设备
