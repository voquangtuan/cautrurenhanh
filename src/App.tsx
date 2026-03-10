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
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---
type GameMode = 'intro' | 'traffic' | 'cat' | 'quiz';

interface LogicBlock {
  id: string;
  type: 'if' | 'condition' | 'then' | 'action' | 'else' | 'action2';
  text: string;
  color: string;
}

// --- Components ---

const Header = ({ onHome }: { onHome: () => void }) => (
  <header className="w-full py-6 px-8 flex justify-between items-center bg-white border-b border-slate-100 sticky top-0 z-50">
    <div 
      className="flex items-center gap-3 cursor-pointer group"
      onClick={onHome}
    >
      <div className="bg-emerald-500 p-2 rounded-xl text-white group-hover:scale-110 transition-transform">
        <BookOpen size={24} />
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-900 leading-tight">Tin học 5</h1>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Bài 13: Cấu trúc rẽ nhánh</p>
      </div>
    </div>
    <nav className="hidden md:flex items-center gap-6">
      <button onClick={onHome} className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Trang chủ</button>
      <div className="h-4 w-px bg-slate-200" />
      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Học vui - Hiểu nhanh</span>
    </nav>
  </header>
);

const TrafficGame = () => {
  const [light, setLight] = useState<'red' | 'green'>('red');
  const [isWalking, setIsWalking] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleAction = () => {
    if (light === 'green') {
      setIsWalking(true);
      setFeedback({ type: 'success', message: 'Chính xác! Đèn xanh thì chúng ta đi bộ qua đường.' });
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

const CatGame = () => {
  const [isHovering, setIsHovering] = useState(false);

  // Reliable URLs for Scratch Cat and Logo
  // Using direct links from Scratch's official assets or reliable mirrors
  const scratchCatUrl = "https://cdn.jsdelivr.net/gh/LLK/scratch-gui@develop/src/lib/assets/default-costumes/cat-a.svg";
  const scratchLogoUrl = "https://cdn.jsdelivr.net/gh/LLK/scratch-gui@develop/src/lib/assets/scratch-logo.svg";

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
              // Fallback if logo fails
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
              // Fallback to a simpler representation if the image fails to load
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

const QuizGame = () => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
      // Reset or finish
      setStep(0);
      setSelected(null);
      setIsCorrect(null);
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
  const [mode, setMode] = useState<GameMode>('intro');

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Header onHome={() => setMode('intro')} />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {mode === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center gap-12"
            >
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900">
                  Cấu trúc <span className="text-emerald-600">Rẽ nhánh</span>
                </h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                  Chào mừng các em đến với bài học tương tác! Hãy chọn một hoạt động bên dưới để bắt đầu khám phá sức mạnh của câu lệnh "Nếu... Thì...".
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 w-full">
                <button 
                  onClick={() => setMode('traffic')}
                  className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100 transition-all text-left flex flex-col gap-6"
                >
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Signal size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Đèn Giao Thông</h4>
                    <p className="text-slate-500 text-sm">Học cấu trúc rẽ nhánh dạng thiếu qua tình huống thực tế.</p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    Bắt đầu <ArrowRight size={16} />
                  </div>
                </button>

                <button 
                  onClick={() => setMode('cat')}
                  className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-100 transition-all text-left flex flex-col gap-6"
                >
                  <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Mèo Ma Thuật</h4>
                    <p className="text-slate-500 text-sm">Khám phá cấu trúc rẽ nhánh dạng đủ với chú mèo Scratch.</p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-orange-600 font-bold text-sm">
                    Bắt đầu <ArrowRight size={16} />
                  </div>
                </button>

                <button 
                  onClick={() => setMode('quiz')}
                  className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100 transition-all text-left flex flex-col gap-6"
                >
                  <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Gamepad2 size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Thử Thách Tư Duy</h4>
                    <p className="text-slate-500 text-sm">Kiểm tra kiến thức qua các câu đố logic thú vị.</p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-indigo-600 font-bold text-sm">
                    Bắt đầu <ArrowRight size={16} />
                  </div>
                </button>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 max-w-3xl w-full text-left">
                <h5 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-emerald-600" /> Tóm tắt kiến thức:
                </h5>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dạng thiếu</p>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-sm">
                      <span className="text-emerald-600 font-bold">Nếu</span> &lt;điều kiện&gt; <span className="text-emerald-600 font-bold">thì</span> &lt;công việc&gt;
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dạng đủ</p>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-sm">
                    <span className="text-emerald-600 font-bold">Nếu</span> &lt;điều kiện&gt; <span className="text-emerald-600 font-bold">thì</span> &lt;việc 1&gt; <span className="text-emerald-600 font-bold">nếu không thì</span> &lt;việc 2&gt;
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
              <TrafficGame />
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
              <CatGame />
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
              <QuizGame />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm">© 2026 Học liệu số Tin học 5 - Kết nối tri thức</p>
      </footer>
    </div>
  );
}
