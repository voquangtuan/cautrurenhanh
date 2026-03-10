/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Signal, 
  MousePointer2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  RotateCcw,
  BookOpen,
  Gamepad2,
  Sparkles,
  Home,
  User,
  Trophy,
  Users,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---
type GameMode = 'login' | 'intro' | 'traffic' | 'cat' | 'quiz' | 'leaderboard';

interface StudentData {
  name: string;
  scores: {
    traffic: number;
    cat: number;
    quiz: number;
  };
  completedAt?: string;
}

// --- Components ---

const LoginScreen = ({ onLogin }: { onLogin: (name: string) => void }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center"
    >
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <User size={40} />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Chào mừng em!</h2>
      <p className="text-slate-500 mb-8">Hãy nhập họ và tên của mình để bắt đầu khám phá bài học nhé.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ví dụ: Nguyễn Văn A"
          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-lg font-medium"
          autoFocus
        />
        <button 
          type="submit"
          disabled={!name.trim()}
          className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-red-100"
        >
          Bắt đầu học ngay
        </button>
      </form>
    </motion.div>
  );
};

const AchievementBoard = ({ students, onBack }: { students: StudentData[], onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Trophy className="text-yellow-500" /> Bảng Thành Tích
        </h2>
        <button onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2">
          <ArrowRight size={16} className="rotate-180" /> Quay lại
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Học sinh</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Đèn Giao Thông</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Mèo Ma Thuật</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Trắc Nghiệm</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Tổng Điểm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic">Chưa có học sinh nào tham gia.</td>
              </tr>
            ) : (
              students.sort((a, b) => {
                const totalA = a.scores.traffic + a.scores.cat + a.scores.quiz;
                const totalB = b.scores.traffic + b.scores.cat + b.scores.quiz;
                return totalB - totalA;
              }).map((student, idx) => {
                const total = student.scores.traffic + student.scores.cat + student.scores.quiz;
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                          {idx + 1}
                        </div>
                        <span className="font-bold text-slate-700">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center font-mono font-bold text-emerald-600">{student.scores.traffic}</td>
                    <td className="px-8 py-5 text-center font-mono font-bold text-orange-600">{student.scores.cat}</td>
                    <td className="px-8 py-5 text-center font-mono font-bold text-indigo-600">{student.scores.quiz}</td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full font-bold text-sm">
                        {total}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const Header = ({ onHome, currentStudent, onLogout, onShowLeaderboard }: { 
  onHome: () => void, 
  currentStudent: StudentData | null,
  onLogout: () => void,
  onShowLeaderboard: () => void
}) => (
  <header className="w-full py-6 px-8 flex justify-between items-center bg-white border-b border-slate-100 sticky top-0 z-50">
    <div 
      className="flex items-center gap-3 cursor-pointer group"
      onClick={onHome}
    >
      <div className="bg-red-500 p-2 rounded-xl text-white group-hover:scale-110 transition-transform">
        <Home size={24} />
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-900 leading-tight">Tin học 5</h1>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Bài 13: Cấu trúc rẽ nhánh</p>
      </div>
    </div>
    <nav className="hidden md:flex items-center gap-6">
      {currentStudent && (
        <>
          <button onClick={onHome} className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors flex items-center gap-2">
            <Home size={16} /> Trang chủ
          </button>
          <button onClick={onShowLeaderboard} className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors flex items-center gap-2">
            <Trophy size={16} /> Thành tích
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase">Học sinh</p>
              <p className="text-sm font-bold text-slate-700">{currentStudent.name}</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Đăng xuất"
            >
              <LogOut size={18} />
            </button>
          </div>
        </>
      )}
      {!currentStudent && (
        <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">Học vui - Hiểu nhanh</span>
      )}
    </nav>
  </header>
);

const TrafficGame = ({ onComplete }: { onComplete: (points: number) => void }) => {
  const [light, setLight] = useState<'red' | 'green'>('red');
  const [isWalking, setIsWalking] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleAction = () => {
    if (light === 'green') {
      setIsWalking(true);
      setFeedback({ type: 'success', message: 'Chính xác! Đèn xanh thì chúng ta đi bộ qua đường.' });
      onComplete(10);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setFeedback({ type: 'error', message: 'Ôi không! Đèn đỏ thì chúng ta phải dừng lại.' });
    }
  };

  const reset = () => {
    setIsWalking(false);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-slate-50 rounded-3xl border border-slate-200">
      <div className="text-center max-w-md">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Thử thách Đèn Giao Thông</h3>
        <p className="text-slate-600">Sử dụng cấu trúc rẽ nhánh: <span className="font-mono font-bold text-emerald-600">Nếu</span> đèn xanh <span className="font-mono font-bold text-emerald-600">thì</span> đi bộ qua đường.</p>
      </div>

      <div className="relative w-full h-64 bg-slate-200 rounded-2xl overflow-hidden flex items-end justify-center">
        {/* Road */}
        <div className="absolute bottom-0 w-full h-20 bg-slate-700 flex items-center justify-around px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-12 h-2 bg-white/30 rounded-full" />
          ))}
        </div>

        {/* Traffic Light */}
        <div className="absolute top-4 right-8 w-12 h-28 bg-slate-800 rounded-xl p-2 flex flex-col gap-2 border-2 border-slate-700">
          <div 
            className={`w-full h-1/2 rounded-full transition-all duration-300 ${light === 'red' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-red-900/50'}`}
            onClick={() => setLight('red')}
          />
          <div 
            className={`w-full h-1/2 rounded-full transition-all duration-300 ${light === 'green' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-emerald-900/50'}`}
            onClick={() => setLight('green')}
          />
        </div>

        {/* Character */}
        <motion.div 
          animate={isWalking ? { x: 300, opacity: 0 } : { x: -100, opacity: 1 }}
          transition={{ duration: 2 }}
          className="mb-4 z-10"
        >
          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <span className="text-xl">🚶</span>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleAction}
          disabled={isWalking}
          className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          <Play size={18} /> Qua đường
        </button>
        <button 
          onClick={() => {
            setLight(light === 'red' ? 'green' : 'red');
            reset();
          }}
          className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
        >
          <RotateCcw size={18} /> Đổi đèn
        </button>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl flex items-center gap-3 ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="font-medium">{feedback.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CatGame = ({ onComplete }: { onComplete: (points: number) => void }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [hasScored, setHasScored] = useState(false);

  // URLs for Scratch Cat and Logo
  const scratchCatUrl = "https://cdn.jsdelivr.net/gh/LLK/scratch-gui@develop/src/lib/assets/default-costumes/cat-a.svg";
  const scratchLogoUrl = "https://cdn.jsdelivr.net/gh/LLK/scratch-gui@develop/src/lib/assets/scratch-logo.svg";

  useEffect(() => {
    if (isHovering && !hasScored) {
      onComplete(10);
      setHasScored(true);
    }
  }, [isHovering, hasScored, onComplete]);

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-slate-50 rounded-3xl border border-slate-200">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <img 
            src={scratchLogoUrl} 
            alt="Scratch Logo" 
            className="h-12 opacity-80"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Chú Mèo Ma Thuật</h3>
        <p className="text-slate-600">Cấu trúc rẽ nhánh dạng đủ:</p>
        <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200 text-sm font-mono text-left">
          <p><span className="text-emerald-600 font-bold">Nếu</span> chạm chuột <span className="text-emerald-600 font-bold">thì</span> đổi màu xanh</p>
          <p><span className="text-emerald-600 font-bold">Nếu không thì</span> màu cam ban đầu</p>
        </div>
      </div>

      <div className="relative w-full h-80 bg-white rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
        {/* Background grid to look like Scratch stage */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
        />

        <motion.div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          animate={{ 
            scale: isHovering ? 1.15 : 1,
            y: isHovering ? -5 : 0
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 400,
            damping: 10
          }}
          className="relative cursor-pointer z-10"
        >
          <img 
            src={scratchCatUrl}
            alt="Scratch Cat"
            referrerPolicy="no-referrer"
            className={`w-56 h-56 transition-all duration-300 ease-in-out ${isHovering ? 'filter hue-rotate-[150deg] saturate-[1.8] brightness-[1.1]' : ''}`}
            onError={(e) => {
              console.error("Failed to load Scratch Cat image");
            }}
          />
          
          <AnimatePresence>
            {isHovering && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border-2 border-indigo-500 text-indigo-600 px-4 py-2 rounded-2xl shadow-xl text-sm font-black whitespace-nowrap"
              >
                <div className="relative">
                  Meo! Đã rẽ nhánh! 🐾
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-indigo-500 rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="absolute bottom-4 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-tighter">
          <MousePointer2 size={14} /> Di chuột vào mèo Scratch để kiểm tra điều kiện
        </div>
      </div>
    </div>
  );
};

const QuizGame = ({ onComplete }: { onComplete: (points: number) => void }) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalScore, setTotalScore] = useState(0);

  const questions = [
    {
      title: "Hoàn thành câu lệnh (Dạng thiếu)",
      scenario: "Nếu trời mưa...",
      options: [
        { id: 'a', text: "thì em đi đá bóng", correct: false },
        { id: 'b', text: "thì em mang theo ô", correct: true },
        { id: 'c', text: "nếu không thì em ngủ", correct: false }
      ],
      logic: "Nếu <điều kiện> thì <công việc>"
    },
    {
      title: "Hoàn thành câu lệnh (Dạng đủ)",
      scenario: "Nếu em học bài xong...",
      options: [
        { id: 'a', text: "thì em đi chơi, nếu không thì em tiếp tục học", correct: true },
        { id: 'b', text: "thì em đi ngủ luôn", correct: false },
        { id: 'c', text: "nếu không thì em đi chơi", correct: false }
      ],
      logic: "Nếu <điều kiện> thì <việc 1> nếu không thì <việc 2>"
    }
  ];

  const handleCheck = () => {
    const correct = questions[step].options.find(o => o.id === selected)?.correct;
    setIsCorrect(!!correct);
    if (correct) {
      setTotalScore(prev => prev + 10);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  const next = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
      setSelected(null);
      setIsCorrect(null);
    } else {
      onComplete(totalScore);
      setStep(0);
      setSelected(null);
      setIsCorrect(null);
      setTotalScore(0);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-slate-50 rounded-3xl border border-slate-200 w-full max-w-2xl mx-auto">
      <div className="w-full flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Câu hỏi {step + 1}/{questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 w-8 rounded-full ${i <= step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{questions[step].title}</h3>
        <p className="text-lg text-indigo-600 font-medium italic">"{questions[step].scenario}"</p>
      </div>

      <div className="grid gap-3 w-full">
        {questions[step].options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`p-4 rounded-xl text-left transition-all border-2 ${
              selected === opt.id 
                ? 'bg-indigo-50 border-indigo-500 text-indigo-900' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
            }`}
          >
            <span className="font-bold mr-3">{opt.id.toUpperCase()}.</span>
            {opt.text}
          </button>
        ))}
      </div>

      <div className="flex gap-4 w-full">
        {!isCorrect ? (
          <button 
            disabled={!selected}
            onClick={handleCheck}
            className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95"
          >
            Kiểm tra kết quả
          </button>
        ) : (
          <button 
            onClick={next}
            className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {step === questions.length - 1 ? 'Làm lại từ đầu' : 'Câu tiếp theo'} <ArrowRight size={18} />
          </button>
        )}
      </div>

      {isCorrect === false && (
        <div className="flex items-center gap-2 text-red-500 font-medium animate-bounce">
          <AlertCircle size={18} /> Thử lại nhé, bạn chọn chưa đúng rồi!
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [mode, setMode] = useState<GameMode>('login');
  const [currentStudent, setCurrentStudent] = useState<StudentData | null>(null);
  const [allStudents, setAllStudents] = useState<StudentData[]>([]);

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('scratch_students');
    if (saved) {
      try {
        setAllStudents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved students");
      }
    }
  }, []);

  // Save leaderboard to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('scratch_students', JSON.stringify(allStudents));
  }, [allStudents]);

  const handleLogin = (name: string) => {
    // Check if student already exists
    const existing = allStudents.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      setCurrentStudent(existing);
    } else {
      const newStudent: StudentData = {
        name,
        scores: { traffic: 0, cat: 0, quiz: 0 }
      };
      setCurrentStudent(newStudent);
      setAllStudents(prev => [...prev, newStudent]);
    }
    setMode('intro');
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    setMode('login');
  };

  const updateScore = (type: keyof StudentData['scores'], points: number) => {
    if (!currentStudent) return;
    
    // Only update if the new score is higher (to prevent repeating same activity for infinite points)
    if (currentStudent.scores[type] >= points) return;

    const updatedStudent = {
      ...currentStudent,
      scores: {
        ...currentStudent.scores,
        [type]: points
      }
    };

    setCurrentStudent(updatedStudent);
    setAllStudents(prev => prev.map(s => s.name === currentStudent.name ? updatedStudent : s));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-red-100 selection:text-red-900">
      <Header 
        onHome={() => setMode('intro')} 
        currentStudent={currentStudent}
        onLogout={handleLogout}
        onShowLeaderboard={() => setMode('leaderboard')}
      />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <LoginScreen key="login" onLogin={handleLogin} />
          )}

          {mode === 'leaderboard' && (
            <AchievementBoard 
              key="leaderboard" 
              students={allStudents} 
              onBack={() => setMode('intro')} 
            />
          )}

          {mode === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center gap-12"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold mb-4">
                  <Sparkles size={16} /> Chào mừng {currentStudent?.name}!
                </div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900">
                  Cấu trúc <span className="text-red-600">Rẽ nhánh</span>
                </h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                  Hãy chọn một hoạt động bên dưới để bắt đầu khám phá sức mạnh của câu lệnh "Nếu... Thì...".
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 w-full">
                <button 
                  onClick={() => setMode('traffic')}
                  className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100 transition-all text-left flex flex-col gap-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Signal size={32} />
                    </div>
                    {currentStudent?.scores.traffic ? (
                      <div className="bg-emerald-500 text-white p-1 rounded-full"><CheckCircle2 size={16} /></div>
                    ) : null}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Đèn Giao Thông</h4>
                    <p className="text-slate-500 text-sm">Học cấu trúc rẽ nhánh dạng thiếu qua tình huống thực tế.</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      Bắt đầu <ArrowRight size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-400">Điểm: {currentStudent?.scores.traffic || 0}</span>
                  </div>
                </button>

                <button 
                  onClick={() => setMode('cat')}
                  className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-100 transition-all text-left flex flex-col gap-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles size={32} />
                    </div>
                    {currentStudent?.scores.cat ? (
                      <div className="bg-orange-500 text-white p-1 rounded-full"><CheckCircle2 size={16} /></div>
                    ) : null}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Mèo Ma Thuật</h4>
                    <p className="text-slate-500 text-sm">Khám phá cấu trúc rẽ nhánh dạng đủ với chú mèo Scratch.</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                      Bắt đầu <ArrowRight size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-400">Điểm: {currentStudent?.scores.cat || 0}</span>
                  </div>
                </button>

                <button 
                  onClick={() => setMode('quiz')}
                  className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100 transition-all text-left flex flex-col gap-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Gamepad2 size={32} />
                    </div>
                    {currentStudent?.scores.quiz ? (
                      <div className="bg-indigo-500 text-white p-1 rounded-full"><CheckCircle2 size={16} /></div>
                    ) : null}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Thử Thách Tư Duy</h4>
                    <p className="text-slate-500 text-sm">Kiểm tra kiến thức qua các câu đố logic thú vị.</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                      Bắt đầu <ArrowRight size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-400">Điểm: {currentStudent?.scores.quiz || 0}</span>
                  </div>
                </button>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 max-w-3xl w-full text-left">
                <h5 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-red-600" /> Tóm tắt kiến thức:
                </h5>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dạng thiếu</p>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-sm">
                      <span className="text-red-600 font-bold">Nếu</span> &lt;điều kiện&gt; <span className="text-red-600 font-bold">thì</span> &lt;công việc&gt;
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dạng đủ</p>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-sm">
                    <span className="text-red-600 font-bold">Nếu</span> &lt;điều kiện&gt; <span className="text-red-600 font-bold">thì</span> &lt;việc 1&gt; <span className="text-red-600 font-bold">nếu không thì</span> &lt;việc 2&gt;
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'traffic' && (
            <motion.div 
              key="traffic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button onClick={() => setMode('intro')} className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2 transition-colors">
                <ArrowRight size={16} className="rotate-180" /> Quay lại trang chủ
              </button>
              <TrafficGame onComplete={(pts) => updateScore('traffic', pts)} />
            </motion.div>
          )}

          {mode === 'cat' && (
            <motion.div 
              key="cat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button onClick={() => setMode('intro')} className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2 transition-colors">
                <ArrowRight size={16} className="rotate-180" /> Quay lại trang chủ
              </button>
              <CatGame onComplete={(pts) => updateScore('cat', pts)} />
            </motion.div>
          )}

          {mode === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button onClick={() => setMode('intro')} className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2 transition-colors">
                <ArrowRight size={16} className="rotate-180" /> Quay lại trang chủ
              </button>
              <QuizGame onComplete={(pts) => updateScore('quiz', pts)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center">
        <div className="flex justify-center gap-4 mb-4">
          <button 
            onClick={() => setMode('leaderboard')}
            className="text-xs font-bold text-slate-400 hover:text-red-600 flex items-center gap-1 uppercase tracking-widest"
          >
            <Users size={14} /> Xem tất cả học sinh
          </button>
        </div>
        <p className="text-slate-400 text-sm">© 2026 Học liệu số Tin học 5 - Kết nối tri thức</p>
      </footer>
    </div>
  );
}
