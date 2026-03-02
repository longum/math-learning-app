# Math Learning Application

A React-based web application that helps children aged 5-8 understand numbers and arithmetic using the Concrete-Pictorial-Abstract (CPA) method with Base-10 Blocks visualization.

## 🎯 Features

- **Number Visualization**: Convert numbers to base-10 blocks
- **Addition**: Interactive addition with step-by-step animations
- **Subtraction**: Interactive subtraction with borrowing visualization
- **Two Difficulty Levels**:
  - Level 1: Numbers 0-99 (Tens and Ones)
  - Level 2: Numbers 100-999 (Hundreds, Tens, Ones)
- **Responsive Design**: Works on mobile and desktop
- **Input Validation**: Ensures valid number inputs
- **Authentication**: Simple login system with session management

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: Ready for Framer Motion integration
- **Testing**: Vitest
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd math-learning-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📝 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── OneBlock.tsx    # Single unit block
│   ├── TenBlock.tsx    # Ten units block
│   ├── HundredBlock.tsx # Hundred units block
│   └── BlocksDisplay.tsx # Container for displaying blocks
├── pages/             # Page components
│   ├── LoginPage.tsx   # Authentication page
│   ├── HomePage.tsx    # Main navigation page
│   ├── NumberPage.tsx  # Number visualization page
│   ├── AdditionPage.tsx # Addition with animations
│   └── SubtractionPage.tsx # Subtraction with animations
├── utils/             # Utility functions
│   ├── numberParser.ts # Parse numbers to blocks
│   ├── additionGenerator.ts # Generate addition steps
│   ├── subtractionGenerator.ts # Generate subtraction steps
│   ├── validator.ts   # Input validation
│   └── auth.ts        # Authentication helpers
├── hooks/             # Custom React hooks
│   └── useAnimation.ts # Animation control hook
├── contexts/          # React contexts
│   └── AuthContext.tsx # Authentication context
├── types/             # TypeScript type definitions
│   └── index.ts       # All type definitions
└── config/            # Configuration files
    └── auth.ts        # Authentication configuration
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 🏗️ Build

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🎨 Usage Guide

### Login
- Use the default credentials:
  - Username: `student1`, Password: `math123`
  - Username: `student2`, Password: `learn456`

### Number Visualization
1. Navigate to the Numbers page
2. Enter a number (0-999)
3. Select difficulty level
4. View the base-10 block representation

### Addition
1. Navigate to the Addition page
2. Enter two numbers
3. Click "Generate Animation"
4. Use Previous/Next buttons to step through the animation
5. Watch how blocks are regrouped when needed

### Subtraction
1. Navigate to the Subtraction page
2. Enter two numbers (first must be larger)
3. Click "Generate Animation"
4. Step through the borrowing process
5. Understand how blocks are removed and regrouped

## 🎓 Educational Approach

### Concrete-Pictorial-Abstract (CPA) Method
The application follows the CPA approach to help children understand mathematical concepts:

1. **Concrete**: Physical manipulation of base-10 blocks
2. **Pictorial**: Visual representation of the blocks
3. **Abstract**: Numerical symbols and operations

### Key Learning Points
- **Place Value**: Understanding ones, tens, and hundreds
- **Regrouping**: Trading ten ones for one ten, etc.
- **Number Sense**: Visualizing quantities
- **Problem Solving**: Step-by-step breakdown of operations

## 🔧 Configuration

### Authentication
- Session duration: 30 minutes
- Storage: localStorage
- Users defined in `src/config/auth.ts`

### Difficulty Levels
- **Level 1**: Focuses on tens and ones (0-99)
- **Level 2**: Includes hundreds (100-999)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Future Enhancements

- [ ] Integration with Framer Motion for smooth animations
- [ ] Sound effects for positive reinforcement
- [ ] Progress tracking and achievements
- [ ] Multiple languages support
- [ ] Parent/teacher dashboard
- [ ] Printable worksheets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Based on the Concrete-Pictorial-Abstract (CPA) method for mathematics education
- Inspired by Montessori learning materials
- Designed for young learners to build number sense foundation