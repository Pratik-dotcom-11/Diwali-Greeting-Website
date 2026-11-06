"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export default function DiwaliPage() {
  // State for greeting card builder
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [cardStyle, setCardStyle] = useState<"wine" | "rose" | "blue" | "amber">("wine");
  const [previewTo, setPreviewTo] = useState("May your life shine brighter with every diya.");
  const [previewFrom, setPreviewFrom] = useState("With warm wishes");

  // State for Diya lighting
  const [litDiyas, setLitDiyas] = useState<boolean[]>(() => Array(10).fill(false));

  // State for Music
  const [musicOn, setMusicOn] = useState(false);

  // State for Rangoli
  const [currentPattern, setCurrentPattern] = useState<"mandala" | "lotus" | "flower" | "diamond">("mandala");
  const [brushSize, setBrushSize] = useState(10);
  const [activeColour, setActiveColour] = useState("#ffd34f");
  const [isEraser, setIsEraser] = useState(false);

  // State for Toast & Modal
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Refs
  const fxCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rangoliCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const greetingCardRef = useRef<HTMLDivElement | null>(null);
  const fireworkAreaRef = useRef<HTMLDivElement | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicLoopRef = useRef<NodeJS.Timeout | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const colours = [
    "#ffd34f", "#ff6b6b", "#ff8bc2", "#b69cff", "#69d8c5",
    "#fff4d0", "#f28b35", "#ffffff", "#7dd3fc", "#a3e635"
  ];

  const patterns: [("mandala" | "lotus" | "flower" | "diamond"), string][] = [
    ["mandala", "Mandala"],
    ["lotus", "Lotus"],
    ["flower", "Flower"],
    ["diamond", "Diamond"],
  ];

  const showToastNotification = useCallback((msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2300);
  }, []);

  // Music Synth
  const toggleMusic = () => {
    if (musicOn) {
      setMusicOn(false);
      if (musicLoopRef.current) clearTimeout(musicLoopRef.current);
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      setMusicOn(true);

      const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];
      let i = 0;
      const playNextNote = () => {
        if (!audioCtxRef.current) return;
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = "sine";
        osc.frequency.value = notes[i % notes.length];
        gain.gain.setValueAtTime(0.0001, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.045, audioCtxRef.current.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.32);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.34);
        i++;
        musicLoopRef.current = setTimeout(playNextNote, 390);
      };
      playNextNote();
    } catch {
      showToastNotification("Audio is not supported in this browser");
    }
  };

  // Greeting logic
  const handleSetWish = (text: string) => {
    setMessage(text);
  };

  const handleGenerateGreeting = () => {
    const trimmedSender = sender.trim();
    const trimmedReceiver = receiver.trim();
    const finalMsg = message.trim() || "May your home be filled with light, laughter and love this Diwali.";

    setPreviewTo((trimmedReceiver ? `Dear ${trimmedReceiver}, ` : "") + finalMsg);
    setPreviewFrom(trimmedSender ? `With love, ${trimmedSender}` : "With warm wishes");

    if (greetingCardRef.current) {
      greetingCardRef.current.animate(
        [
          { transform: "scale(.98)", opacity: 0.7 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration: 350 }
      );
    }
    showToastNotification("Your greeting is ready!");
  };

  const handleResetGreeting = () => {
    setSender("");
    setReceiver("");
    setMessage("");
    setPreviewTo("May your life shine brighter with every diya.");
    setPreviewFrom("With warm wishes");
  };

  const getShareUrl = () => {
    const deployedUrl = "https://diwali-greeting-website.vercel.app";
    return /^localhost|^127\./.test(window.location.hostname) ? deployedUrl : window.location.origin;
  };

  const getShareText = () => {
    const trimmedSender = sender.trim();
    const trimmedReceiver = receiver.trim();
    const finalMsg = message.trim() || "May your home be filled with light, laughter and love this Diwali.";
    const url = getShareUrl();

    return `🪔 Happy Diwali${trimmedReceiver ? ", " + trimmedReceiver : ""}! ✨\n\n${finalMsg}\n\n${
      trimmedSender ? "With love, " + trimmedSender : "With warm wishes"
    }\n\nShare your greetings on - ${url}`;
  };

  const wrapShareText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(" ");
    let line = "";
    for (const word of words) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, y);
  };

  const createGreetingCardBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1500;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);

      const trimmedSender = sender.trim();
      const trimmedReceiver = receiver.trim();
      const finalMsg = message.trim() || "May your home be filled with light, laughter and love.";

      const palette =
        cardStyle === "rose"
          ? ["#7c1647", "#f4a3c1"]
          : cardStyle === "blue"
          ? ["#122d72", "#8ab4ff"]
          : cardStyle === "amber"
          ? ["#6e2d08", "#ffc04d"]
          : ["#580d2d", "#ffd96b"];

      const bg = ctx.createLinearGradient(0, 0, 0, 1500);
      bg.addColorStop(0, palette[0]);
      bg.addColorStop(0.58, palette[0]);
      bg.addColorStop(1, "#260716");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1200, 1500);

      ctx.strokeStyle = palette[1];
      ctx.lineWidth = 4;
      ctx.strokeRect(28, 28, 1144, 1444);

      ctx.strokeStyle = "rgba(255,217,107,.55)";
      ctx.lineWidth = 1;
      ctx.strokeRect(46, 46, 1108, 1408);

      ctx.fillStyle = palette[1];
      ctx.font = "700 26px Arial";
      ctx.textAlign = "center";
      ctx.fillText("A WISH FOR YOU", 600, 230);

      ctx.font = "700 92px Georgia";
      ctx.fillText("Happy Diwali!", 600, 360);

      ctx.font = "italic 34px Georgia";
      wrapShareText(ctx, finalMsg, 600, 445, 900, 48);

      ctx.font = "700 34px Arial";
      ctx.fillText(trimmedReceiver ? "To " + trimmedReceiver : "With warm wishes", 600, 650);

      ctx.font = "italic 30px Georgia";
      ctx.fillText(trimmedSender ? "With love, " + trimmedSender : "Happy Diwali", 600, 730);

      ctx.font = "700 22px Arial";
      ctx.letterSpacing = "6px";
      ctx.fillText("DIWALI DIGITAL GREETING", 600, 1375);

      canvas.toBlob(resolve, "image/png");
    });
  };

  const handleShare = async (channel = "whatsapp") => {
    const url = getShareUrl();
    const text = getShareText();
    const blob = await createGreetingCardBlob();
    const file = blob && new File([blob], "diwali-greeting.png", { type: "image/png" });
    const canShareFile =
      file &&
      navigator.share &&
      (!navigator.canShare || navigator.canShare({ files: [file] }));

    if ((channel === "native" || channel === "whatsapp") && canShareFile) {
      try {
        await navigator.share({ title: "Happy Diwali!", text, files: [file] });
        setShareOpen(false);
        return;
      } catch (e: unknown) {
        if (e instanceof Error && e.name === "AbortError") return;
      }
    }

    if (channel === "instagram") {
      try {
        if (canShareFile) {
          await navigator.share({ title: "Happy Diwali!", text, files: [file] });
          setShareOpen(false);
          return;
        }
        await navigator.clipboard.writeText(text);
        showToastNotification("Greeting copied. Paste it in Instagram Direct!");
      } catch {
        showToastNotification("Copy the greeting, then share it on Instagram");
      }
      window.open("https://www.instagram.com/direct/new/", "_blank", "noopener");
      setShareOpen(false);
      return;
    }

    const targets: Record<string, string> = {
      whatsapp: "https://wa.me/?text=",
      facebook: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url) + "&quote=" + encodeURIComponent(text),
      telegram: "https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(text),
    };

    const target = targets[channel] || targets.whatsapp;
    window.open(channel === "facebook" ? target : target + encodeURIComponent(text), "_blank", "noopener");
    setShareOpen(false);
  };

  const handleCopyGreeting = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      showToastNotification("Greeting copied!");
    } catch {
      showToastNotification("Copy not available in this browser");
    }
  };

  // Diya lighting logic
  const handleToggleDiya = (index: number) => {
    setLitDiyas((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      const count = next.filter(Boolean).length;
      if (count === 10) {
        showToastNotification("A beautiful circle of light!");
        const fxShow = (window as unknown as { fxShow?: (n: number) => void }).fxShow;
        if (fxShow) fxShow(5);
      }
      return next;
    });
  };

  const handleLightAllDiyas = () => {
    litDiyas.forEach((_, i) => {
      setTimeout(() => {
        setLitDiyas((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        if (i === 9) {
          showToastNotification("A beautiful circle of light!");
          const fxShow = (window as unknown as { fxShow?: (n: number) => void }).fxShow;
          if (fxShow) fxShow(5);
        }
      }, i * 140);
    });
  };

  const handleResetDiyas = () => {
    setLitDiyas(Array(10).fill(false));
  };

  // Rangoli drawing logic
  const drawRangoliPattern = useCallback((pat: "mandala" | "lotus" | "flower" | "diamond") => {
    const canvas = rangoliCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 500, 500);
    ctx.save();
    ctx.translate(250, 250);
    ctx.strokeStyle = "rgba(255,216,120,.3)";
    ctx.lineWidth = 2;

    if (pat === "lotus" || pat === "flower") {
      const petals = pat === "lotus" ? 8 : 12;
      for (let i = 0; i < petals; i++) {
        ctx.rotate((Math.PI * 2) / petals);
        ctx.beginPath();
        ctx.ellipse(0, -110, pat === "lotus" ? 28 : 17, 75, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    if (pat === "diamond") {
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.moveTo(0, -145);
        ctx.lineTo(24, -105);
        ctx.lineTo(0, -65);
        ctx.lineTo(-24, -105);
        ctx.closePath();
        ctx.stroke();
      }
    }
    if (pat === "mandala" || pat === "flower") {
      for (let r = 0; r < 12; r++) {
        ctx.rotate(Math.PI / 6);
        for (let j = 0; j < 8; j++) {
          ctx.beginPath();
          ctx.ellipse(0, -115, 15, 70, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }, []);

  const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = rangoliCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * canvas.width) / r.width,
      y: ((e.clientY - r.top) * canvas.height) / r.height,
    };
  };

  const drawDot = (p: { x: number; y: number }) => {
    const canvas = rangoliCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.arc(p.x, p.y, brushSize, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? "#000" : activeColour;
    ctx.shadowColor = isEraser ? "transparent" : activeColour;
    ctx.shadowBlur = isEraser ? 0 : 12;
    ctx.fill();
    ctx.restore();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const p = getCanvasPos(e);
    lastPosRef.current = p;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drawDot(p);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPosRef.current) return;
    e.preventDefault();
    const canvas = rangoliCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const p = getCanvasPos(e);
    ctx.save();
    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = isEraser ? "#000" : activeColour;
    ctx.lineWidth = brushSize * 1.6;
    ctx.lineCap = "round";
    ctx.shadowColor = isEraser ? "transparent" : activeColour;
    ctx.shadowBlur = isEraser ? 0 : 10;
    ctx.stroke();
    ctx.restore();

    drawDot(p);
    lastPosRef.current = p;
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const handleClearRangoli = () => {
    drawRangoliPattern(currentPattern);
    setIsEraser(false);
  };

  const handleSaveRangoli = () => {
    const canvas = rangoliCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "my-digital-rangoli.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    showToastNotification("Your rangoli is downloaded!");
  };

  // Fireworks launcher in section
  const handleLaunchFireworks = () => {
    const area = fireworkAreaRef.current;
    if (!area) return;
    const isLite = (window as unknown as { __lite?: boolean }).__lite;
    const N = isLite ? 12 : 28;
    const rect = area.getBoundingClientRect();

    for (let k = 0; k < 5; k++) {
      const x = 30 + Math.random() * (rect.width - 60);
      const y = 25 + Math.random() * 100;
      const rocket = document.createElement("i");
      rocket.className = "rocket";
      rocket.style.left = x + "px";
      area.appendChild(rocket);

      setTimeout(() => {
        rocket.remove();
        for (let i = 0; i < N; i++) {
          const b = document.createElement("i");
          b.className = "burst";
          b.style.left = x + "px";
          b.style.top = y + "px";
          const a = (Math.PI * 2 * i) / N;
          const dist = 35 + Math.random() * 65;
          b.style.setProperty("--x", Math.cos(a) * dist + "px");
          b.style.setProperty("--y", Math.sin(a) * dist + "px");
          b.style.background = ["#ffe28b", "#ff75a8", "#ff9b42", "#b6a0ff", "#fff"][
            Math.floor(Math.random() * 5)
          ];
          area.appendChild(b);
          setTimeout(() => b.remove(), 1300);
        }
      }, 1200 + k * 520);
    }
    showToastNotification("Happy Diwali! 🎆");
    const fxShow = (window as unknown as { fxShow?: (n: number) => void }).fxShow;
    if (fxShow) fxShow(6);
  };

  // Initialize Canvas Fireworks & Animation Observer on mount
  useEffect(() => {
    drawRangoliPattern(currentPattern);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const isLite = () => !!(window as unknown as { __lite?: boolean }).__lite;

    const cv = fxCanvasRef.current;
    if (!cv) return;
    const c = cv.getContext("2d");
    if (!c) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let dpr = 1;
    let parts: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      max: number;
      g: number;
      col: string;
      s: number;
    }> = [];
    let rockets: Array<{
      x: number;
      y: number;
      vy: number;
      ty: number;
      p: string[];
    }> = [];
    let running = false;
    let lw = 0;

    const size = (force?: boolean) => {
      if (!force && lw && Math.abs(window.innerWidth - lw) < 2 && Math.abs(window.innerHeight - H) < 140)
        return;
      lw = window.innerWidth;
      dpr = isLite() ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    size(true);
    cv.style.display = "none";

    const pal = [
      ["#fff2bd", "#ffb52e"],
      ["#ff9ec4", "#e42c76"],
      ["#ffb36b", "#ff5a1f"],
      ["#cbbcff", "#7a5cff"],
      ["#ffffff", "#ffe99a"],
      ["#a5e8ff", "#38bdf8"],
    ];

    const burst = (x: number, y: number, p?: string[]) => {
      if (parts.length > (isLite() ? 200 : 520)) return;
      p = p || pal[Math.floor(rnd(0, pal.length))];
      const t = Math.floor(rnd(0, 3));
      const n = (((t === 2 ? 70 : 100) * (isLite() ? 0.45 : 1)) | 0);
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + rnd(-0.05, 0.05);
        const v = t === 1 ? 5 : rnd(1.2, 6.2);
        parts.push({
          x,
          y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          life: 0,
          max: t === 2 ? rnd(80, 115) : rnd(45, 75),
          g: t === 2 ? 0.045 : 0.03,
          col: Math.random() < 0.35 ? p[0] : p[1],
          s: rnd(1.4, 2.8),
        });
      }
      for (let i = 0; i < (isLite() ? 4 : 14); i++) {
        parts.push({
          x,
          y,
          vx: rnd(-1, 1),
          vy: rnd(-1, 1),
          life: 0,
          max: 14,
          g: 0,
          col: "#fff",
          s: 3.5,
        });
      }
      go();
    };

    const loop = () => {
      c.globalCompositeOperation = "destination-out";
      c.fillStyle = "rgba(0,0,0,.2)";
      c.fillRect(0, 0, W, H);
      c.globalCompositeOperation = "lighter";

      rockets = rockets.filter((r) => {
        r.y += r.vy;
        if (!isLite() || r.y % 2 < 1) {
          parts.push({
            x: r.x + rnd(-1, 1),
            y: r.y,
            vx: rnd(-0.3, 0.3),
            vy: rnd(0.3, 1.2),
            life: 0,
            max: 22,
            g: 0,
            col: "#ffd66b",
            s: 2,
          });
        }
        c.globalAlpha = 1;
        c.fillStyle = "#fff7cc";
        c.beginPath();
        c.arc(r.x, r.y, 2.4, 0, 7);
        c.fill();
        if (r.y <= r.ty) {
          burst(r.x, r.y, r.p);
          return false;
        }
        return true;
      });

      parts = parts.filter((q) => {
        q.life++;
        q.vx *= 0.985;
        q.vy = q.vy * 0.985 + q.g;
        q.x += q.vx;
        q.y += q.vy;
        const k = 1 - q.life / q.max;
        if (k <= 0) return false;
        c.globalAlpha = Math.min(1, k * 1.4);
        c.fillStyle = q.col;
        const rr = q.s * (0.4 + k * 0.6);
        if (isLite()) {
          c.fillRect(q.x - rr, q.y - rr, rr * 2, rr * 2);
        } else {
          c.beginPath();
          c.arc(q.x, q.y, rr, 0, 7);
          c.fill();
        }
        return true;
      });

      c.globalAlpha = 1;
      if (parts.length || rockets.length) {
        requestAnimationFrame(loop);
      } else {
        running = false;
        c.clearRect(0, 0, W, H);
        cv.style.display = "none";
      }
    };

    const go = () => {
      if (running) return;
      running = true;
      cv.style.display = "block";
      requestAnimationFrame(loop);
    };

    const launch = (x: number, ty: number) => {
      rockets.push({
        x,
        y: H + 10,
        vy: -(H * 0.012 + rnd(0, 2.5)),
        ty,
        p: pal[Math.floor(rnd(0, pal.length))],
      });
      go();
    };

    const fxShow = (n: number) => {
      if (reduce) return;
      if (isLite()) n = Math.ceil(n / 2);
      if (rockets.length > 10) return;
      for (let i = 0; i < n; i++) {
        setTimeout(() => launch(rnd(W * 0.12, W * 0.88), rnd(H * 0.12, H * 0.46)), i * 320);
      }
    };

    const fxBurst = (x: number, y: number) => {
      if (!reduce) burst(x, y);
    };

    // Attach to window
    (window as unknown as { fxShow?: typeof fxShow; fxBurst?: typeof fxBurst }).fxShow = fxShow;
    (window as unknown as { fxShow?: typeof fxShow; fxBurst?: typeof fxBurst }).fxBurst = fxBurst;

    // Opening show
    if (!reduce) {
      setTimeout(() => {
        fxShow(9);
        setTimeout(() => fxShow(6), 5200);
      }, 350);

      const tap = (e: PointerEvent) => {
        if (rockets.length < 6) launch(e.clientX, Math.max(60, e.clientY * 0.7));
      };
      document.addEventListener("pointerdown", tap);
      setTimeout(() => document.removeEventListener("pointerdown", tap), 6500);
    }

    // Floating particles
    if (!reduce) {
      for (let i = 0; i < (isLite() ? 0 : 10); i++) {
        const f = document.createElement("i");
        f.className = "floater";
        f.style.cssText = `left:${rnd(2, 98)}%;--sway:${rnd(-60, 60)}px;animation-duration:${rnd(
          9,
          18
        )}s;animation-delay:${rnd(0, 12)}s;width:${rnd(3, 6)}px;height:${rnd(3, 6)}px`;
        document.body.appendChild(f);
      }
    }

    // Entrance animations observer
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (!e.isIntersecting && e.boundingClientRect.bottom < 0) {
            io.unobserve(e.target);
            clean(e.target as HTMLElement);
          }
        });
        es.filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((x, y) => (x.compareDocumentPosition(y) & 2 ? 1 : -1))
          .forEach((el, i) => {
            io.unobserve(el);
            const d = +(el.dataset.b || 0) + Math.min(i * +(el.dataset.st || 0), 0.9);
            el.style.setProperty("--d", d + "s");
            if (el.dataset.a) el.classList.add("in", el.dataset.a);
            setTimeout(() => clean(el), (d + 2.2) * 1000);
            if (el.classList.contains("celebrate") || el.classList.contains("nexora")) {
              setTimeout(() => fxShow(4), 500);
            }
          });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );

    const cfg: [string, string, number, number][] = [
      [".hero>div:first-child>*", "a-slide", 0.2, 0.06],
      [".hero-art", "a-zspin", 0.25, 0],
      ["#experience .section-head", "a-drop", 0, 0],
      ["#experience .feature", "a-pop", 0, 0.11],
      ["#greeting .section-head", "a-zoom", 0, 0],
      ["#greeting .two-col>.panel:not(.preview)", "a-left", 0.1, 0],
      ["#greeting .preview", "a-flip", 0.25, 0],
      ["#diya .section-head", "a-glow", 0, 0],
      ["#diya .panel", "a-unroll", 0.1, 0],
      ["#diya .diya-card", "a-rise", 0.45, 0.1],
      ["#rangoli .section-head", "a-tilt", 0, 0],
      ["#rangoli .rangoli-layout", "a-unroll", 0.1, 0],
      ["#rangoli .rangoli-wrap", "a-spin", 0.55, 0],
      ["#rangoli .rangoli-layout>div:last-child", "a-right", 0.75, 0],
      ["#rangoli .swatch", "a-pop", 1, 0.06],
      [".panel.celebrate", "a-bounce", 0, 0],
      [".marquee", "a-slide", 0.4, 0],
      [".ribbons", "a-slide", 0, 0],
      [".team .section-head", "a-glow", 0, 0],
      [".nexora", "a-zoom", 0.15, 0],
      [".team-card", "a-flip", 0.35, 0.22],
      ["footer", "a-slide", 0, 0],
    ];

    const clean = (el: HTMLElement) => {
      el.classList.remove("rv", "in");
      if (el.dataset.a) el.classList.remove(el.dataset.a);
      el.style.removeProperty("--d");
    };

    cfg.forEach(([sel, a, base, st]) => {
      document.querySelectorAll(sel).forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.classList.contains("rv")) return;
        htmlEl.classList.add("rv");
        htmlEl.dataset.a = a;
        htmlEl.dataset.b = String(base);
        htmlEl.dataset.st = String(st);
        htmlEl.addEventListener("animationend", (e) => {
          if (e.target === htmlEl && htmlEl.classList.contains("in")) clean(htmlEl);
        });
        io.observe(htmlEl);
      });
    });

    // Ribbons scroll reaction
    const ribbonsBox = document.querySelector(".ribbons");
    let cancelRibbonTick = false;
    if (ribbonsBox && !reduce) {
      const tracks = [...ribbonsBox.querySelectorAll(".rb-track")].map((el) => {
        const htmlEl = el as HTMLElement;
        return {
          el: htmlEl,
          dir: +(htmlEl.dataset.dir || 1),
          sp: +(htmlEl.dataset.speed || 1),
          x: 0,
          hover: 1,
          half: htmlEl.scrollWidth / 2,
        };
      });

      tracks.forEach((t) => {
        const parent = t.el.parentNode as HTMLElement | null;
        if (parent) {
          parent.addEventListener("mouseenter", () => (t.hover = 0.2));
          parent.addEventListener("mouseleave", () => (t.hover = 1));
        }
      });

      const measureTracks = () => {
        tracks.forEach((t) => (t.half = t.el.scrollWidth / 2));
      };
      measureTracks();
      window.addEventListener("resize", measureTracks);

      let lastY = window.scrollY;
      let vel = 0;
      let on = false;

      const ribbonObserver = new IntersectionObserver((entries) => {
        on = entries[0].isIntersecting;
        if (on) requestAnimationFrame(tickRibbons);
      });
      ribbonObserver.observe(ribbonsBox);

      const tickRibbons = () => {
        if (!on || cancelRibbonTick) return;
        vel = vel * 0.9 + (window.scrollY - lastY) * 0.1;
        lastY = window.scrollY;
        const boost = Math.min(Math.abs(vel), 45);
        const sk = isLite() ? 0 : Math.max(-14, Math.min(14, -vel * 0.35));

        tracks.forEach((t) => {
          const half = t.half;
          if (!half) return;
          t.x += t.dir * (t.sp + boost * 0.55) * t.hover;
          if (t.x <= -half) t.x += half;
          if (t.x > 0) t.x -= half;
          t.el.style.transform = `translate3d(${t.x}px,0,0) skewX(${sk}deg)`;
        });
        requestAnimationFrame(tickRibbons);
      };
    }

    // Auto removal of intro veil after timeout
    const introTimer = setTimeout(() => {
      document.querySelectorAll(".intro-veil,.intro-greet").forEach((e) => e.remove());
    }, 6800);

    return () => {
      cancelRibbonTick = true;
      clearTimeout(introTimer);
      document.querySelectorAll(".floater").forEach((f) => f.remove());
    };
  }, [currentPattern, drawRangoliPattern]);

  const litCount = litDiyas.filter(Boolean).length;

  return (
    <>
      <canvas id="fxCanvas" ref={fxCanvasRef} aria-hidden="true" />
      <div className="intro-veil" aria-hidden="true" />
      <div className="intro-greet" id="introGreet" aria-hidden="true">
        <div className="lamp">🪔</div>
        <h2>Shubh Deepavali</h2>
        <p>Happy Diwali</p>
        <p className="by">✦ A Nexora creation ✦</p>
      </div>
      <div className="ambient" />
      <div className="orb one" />
      <div className="orb two" />

      {/* Navigation */}
      <nav>
        <div className="brand">
          <div className="brand-mark">🪔</div>
          <div>
            Digital Diya
            <small>Festival of Lights</small>
          </div>
        </div>
        <div className="navlinks">
          <a href="#experience">Experience</a>
          <a href="#greeting">Create greeting</a>
          <a href="#rangoli">Rangoli</a>
          <a href="#team">Team</a>
        </div>
        <button
          className="nav-cta"
          onClick={() => document.querySelector("#greeting")?.scrollIntoView({ behavior: "smooth" })}
        >
          Create a wish ↗
        </button>
      </nav>

      {/* Music Toggle */}
      <button className="music-toggle" id="musicBtn" onClick={toggleMusic}>
        ♫ Music: {musicOn ? "On" : "Off"}
      </button>

      {/* Hero Section */}
      <header className="hero" id="top">
        <div>
          <div className="eyebrow">
            <span className="pulse" /> A little light goes a long way
          </div>
          <h1>
            Let your
            <br />
            <span className="goldtext">light shine.</span>
          </h1>
          <p>
            Celebrate the festival of lights with a joyful digital experience. Light a diya, design a
            rangoli, create a personal greeting and send a little happiness to someone special.
          </p>
          <div className="hero-actions">
            <button
              className="btn"
              onClick={() => document.querySelector("#experience")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore the magic ✨
            </button>
            <button
              className="btn secondary"
              onClick={() => document.querySelector("#greeting")?.scrollIntoView({ behavior: "smooth" })}
            >
              Create your greeting
            </button>
          </div>
          <p className="hero-note">Made to share warmth, happiness and festive moments.</p>
        </div>
        <div className="hero-art" aria-label="An animated glowing diya">
          <div className="halo" />
          <div className="ring">
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
            <span>✧</span>
          </div>
          <span className="spark s1">✧</span>
          <span className="spark s2">✦</span>
          <span className="spark s3">✧</span>
          <div className="main-diya">
            <div className="flame" />
            <div className="wick" />
            <div className="bowl" />
          </div>
        </div>
      </header>

      {/* Marquee Banner */}
      <div className="marquee" aria-label="Nexora — Pratik Ghosh and Samragnyi Bhowmick">
        <div className="mq-row" aria-hidden="true">
          <div className="mq-track">
            <span className="mq-brand">NEXORA</span>
            <i className="mq-sep">🪔</i>
            <span className="mq-name">Pratik Ghosh</span>
            <i className="mq-sep">✦</i>
            <span className="mq-name">Samragnyi Bhowmick</span>
            <i className="mq-sep">✦</i>
            <span className="mq-name">Shubh Deepavali</span>
            <i className="mq-sep">🎆</i>
            <span className="mq-brand">NEXORA</span>
            <i className="mq-sep">🪔</i>
            <span className="mq-name">Pratik Ghosh</span>
            <i className="mq-sep">✦</i>
            <span className="mq-name">Samragnyi Bhowmick</span>
            <i className="mq-sep">✦</i>
            <span className="mq-name">Shubh Deepavali</span>
            <i className="mq-sep">🎆</i>
            <span className="mq-brand">NEXORA</span>
            <i className="mq-sep">🪔</i>
            <span className="mq-name">Pratik Ghosh</span>
            <i className="mq-sep">✦</i>
            <span className="mq-name">Samragnyi Bhowmick</span>
            <i className="mq-sep">✦</i>
            <span className="mq-name">Shubh Deepavali</span>
            <i className="mq-sep">🎆</i>
            <span className="mq-brand">NEXORA</span>
            <i className="mq-sep">🪔</i>
            <span className="mq-name">Pratik Ghosh</span>
            <i className="mq-sep">✦</i>
            <span className="mq-name">Samragnyi Bhowmick</span>
            <i className="mq-sep">✦</i>
            <span className="mq-name">Shubh Deepavali</span>
            <i className="mq-sep">🎆</i>
          </div>
        </div>
        <div className="mq-row rev" aria-hidden="true">
          <div className="mq-track">
            <span className="mq-small">Nexora</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Happy Diwali</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Pratik Ghosh</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Samragnyi Bhowmick</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Festival of Lights</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Nexora</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Happy Diwali</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Pratik Ghosh</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Samragnyi Bhowmick</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Festival of Lights</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Nexora</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Happy Diwali</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Pratik Ghosh</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Samragnyi Bhowmick</span>
            <i className="mq-sep">✧</i>
            <span className="mq-small">Festival of Lights</span>
            <i className="mq-sep">✧</i>
          </div>
        </div>
      </div>

      {/* Experience Features */}
      <section className="content" id="experience">
        <div className="section-head">
          <div className="kicker">The festive experience</div>
          <h2>More than a greeting.</h2>
          <p>A playful celebration with little moments you can interact with, personalise and share.</p>
        </div>
        <div className="feature-grid">
          <article className="feature">
            <div className="icon">🪔</div>
            <h3>Light a diya</h3>
            <p>Tap the lamps and watch their warm flames glow. Each light adds to the celebration.</p>
          </article>
          <article className="feature">
            <div className="icon">💌</div>
            <h3>Personal greetings</h3>
            <p>Write a wish for someone special and create a greeting card with their name.</p>
          </article>
          <article className="feature">
            <div className="icon">🌸</div>
            <h3>Digital rangoli</h3>
            <p>Choose colours and draw your own festive pattern on an interactive canvas.</p>
          </article>
          <article className="feature">
            <div className="icon">🎆</div>
            <h3>Fireworks</h3>
            <p>Launch a burst of colourful celebration with a click of the button.</p>
          </article>
          <article className="feature">
            <div className="icon">🎵</div>
            <h3>Festive sounds</h3>
            <p>Turn on a gentle generated melody while you explore the celebration.</p>
          </article>
          <article className="feature">
            <div className="icon">📲</div>
            <h3>Share the joy</h3>
            <p>Copy your greeting or share it through WhatsApp with friends and family.</p>
          </article>
        </div>
      </section>

      {/* Multilingual Ribbons */}
      <div
        className="ribbons"
        aria-label="Happy Diwali in many languages"
        onClick={(e) => {
          const fxBurst = (window as unknown as { fxBurst?: (x: number, y: number) => void }).fxBurst;
          if (fxBurst) fxBurst(e.clientX, e.clientY);
        }}
      >
        <div className="rb rb-a" aria-hidden="true">
          <div className="rb-track" data-dir="-1" data-speed="1.1">
            <span className="rb-big">
              Happy <em>Diwali</em>
            </span>
            <i className="rb-ic">🪔</i>
            <span className="rb-big">
              Happy <em>Diwali</em>
            </span>
            <i className="rb-ic sp">✦</i>
            <span className="rb-big">
              Shubh <em>Deepavali</em>
            </span>
            <i className="rb-ic">🎆</i>
            <span className="rb-big">
              Happy <em>Diwali</em>
            </span>
            <i className="rb-ic">🪔</i>
            <span className="rb-big">
              Happy <em>Diwali</em>
            </span>
            <i className="rb-ic sp">✦</i>
            <span className="rb-big">
              Shubh <em>Deepavali</em>
            </span>
            <i className="rb-ic">🎆</i>
            <span className="rb-big">
              Happy <em>Diwali</em>
            </span>
            <i className="rb-ic">🪔</i>
            <span className="rb-big">
              Happy <em>Diwali</em>
            </span>
            <i className="rb-ic sp">✦</i>
            <span className="rb-big">
              Shubh <em>Deepavali</em>
            </span>
            <i className="rb-ic">🎆</i>
          </div>
        </div>
        <div className="rb rb-b" aria-hidden="true">
          <div className="rb-track" data-dir="1" data-speed="0.8">
            <span className="rb-lang">शुभ दीपावली</span>
            <i className="rb-dot">✧</i>
            <span className="rb-lang">শুভ দীপাবলি</span>
            <i className="rb-dot">✧</i>
            <span className="rb-lang f">Happy Diwali</span>
            <i className="rb-dot">✧</i>
            <span className="rb-lang">தீபாவளி நல்வாழ்த்துக்கள்</span>
            <i className="rb-dot">✧</i>
            <span className="rb-lang">દિવાળીની શુભકામનાઓ</span>
            <i className="rb-dot">✧</i>
            <span className="rb-lang f">దీపావళి శుభాకాంక్షలు</span>
            <i className="rb-dot">✧</i>
            <span className="rb-lang">ਦੀਵਾਲੀ ਦੀਆਂ ਵਧਾਈਆਂ</span>
            <i className="rb-dot">✧</i>
            <span className="rb-lang">ദീപാവലി ആശംസകൾ</span>
            <i className="rb-dot">✧</i>
            <span className="rb-lang f">ದೀಪಾವಳಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು</span>
            <i className="rb-dot">✧</i>
            <span className="rb-lang">शुभ दीपावली</span>
            <i className="rb-dot">✧</i>
            <span className="rb-lang">শুভ দীপাবলি</span>
            <i className="rb-dot">✧</i>
            <span className="rb-lang f">Happy Diwali</span>
            <i className="rb-dot">✧</i>
          </div>
        </div>
      </div>

      {/* Greeting Builder */}
      <section className="content" id="greeting">
        <div className="section-head">
          <div className="kicker">Made with love</div>
          <h2>Create a personal Diwali wish</h2>
          <p>A name, a thoughtful message and a little golden glow. Make a greeting that feels like yours.</p>
        </div>
        <div className="two-col">
          <div className="panel wish-builder">
            <div className="step-heading">
              <span>1</span>
              <h3>Who is it from &amp; for?</h3>
            </div>
            <div className="name-grid">
              <div>
                <label className="field" htmlFor="sender">
                  Your name
                </label>
                <input
                  className="input"
                  id="sender"
                  placeholder="e.g. Sam"
                  maxLength={35}
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />
              </div>
              <div>
                <label className="field" htmlFor="receiver">
                  Send this wish to
                </label>
                <input
                  className="input"
                  id="receiver"
                  placeholder="e.g. My best friend"
                  maxLength={45}
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                />
              </div>
            </div>

            <div className="step-heading">
              <span>2</span>
              <h3>Write your wish</h3>
            </div>
            <div className="wish-presets" aria-label="Wish presets">
              <button
                type="button"
                onClick={() => handleSetWish("May your home be filled with light, laughter and love this Diwali.")}
              >
                Warm
              </button>
              <button
                type="button"
                onClick={() => handleSetWish("Wishing your family a joyful Diwali filled with light and togetherness.")}
              >
                Family
              </button>
              <button
                type="button"
                onClick={() => handleSetWish("Sending you bright wishes, good vibes and a sparkling Diwali!")}
              >
                Friends
              </button>
              <button
                type="button"
                onClick={() => handleSetWish("May this Diwali bring prosperity, peace and success to you.")}
              >
                Formal
              </button>
              <button
                type="button"
                onClick={() => handleSetWish("Wishing you a bright and beautiful Diwali!")}
              >
                Short
              </button>
            </div>
            <label className="field sr-only" htmlFor="message">
              Your message
            </label>
            <textarea
              id="message"
              placeholder="May your home be filled with light, laughter and love..."
              maxLength={240}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="char-count">
              <span id="messageCount">{message.length}</span>/240
            </div>

            <div className="step-heading style-heading">
              <span>3</span>
              <h3>Pick a card style</h3>
            </div>
            <div className="style-swatches" role="group" aria-label="Card styles">
              <button
                type="button"
                className={`style-swatch ${cardStyle === "wine" ? "active" : ""}`}
                aria-label="Wine style"
                onClick={() => setCardStyle("wine")}
              />
              <button
                type="button"
                className={`style-swatch rose ${cardStyle === "rose" ? "active" : ""}`}
                aria-label="Rose style"
                onClick={() => setCardStyle("rose")}
              />
              <button
                type="button"
                className={`style-swatch blue ${cardStyle === "blue" ? "active" : ""}`}
                aria-label="Blue style"
                onClick={() => setCardStyle("blue")}
              />
              <button
                type="button"
                className={`style-swatch amber ${cardStyle === "amber" ? "active" : ""}`}
                aria-label="Amber style"
                onClick={() => setCardStyle("amber")}
              />
            </div>

            <div className="actions">
              <button className="btn" onClick={handleGenerateGreeting}>
                Preview with sparkle
              </button>
              <button className="small-btn" onClick={handleResetGreeting}>
                Reset
              </button>
            </div>
            <button
              className="share-launch"
              onClick={() => setShareOpen(true)}
              aria-haspopup="dialog"
              aria-controls="sharePopup"
            >
              <span className="share-launch-icon" aria-hidden="true">
                ↗
              </span>
              <span>
                <strong>Send this greeting</strong>
                <small>Choose where to share it</small>
              </span>
              <span className="share-launch-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>

          {/* Card Preview */}
          <div className={`panel preview style-${cardStyle}`} id="greetingCard" ref={greetingCardRef}>
            <div className="mini">🪔 ✨ 🪔</div>
            <div className="kicker">A wish for you</div>
            <h3>Happy Diwali!</h3>
            <p id="previewTo">{previewTo}</p>
            <p className="from" id="previewFrom">
              {previewFrom}
            </p>
          </div>
        </div>
      </section>

      {/* Diya Lighting Section */}
      <section className="content" id="diya">
        <div className="section-head">
          <div className="kicker">A thousand little lights</div>
          <h2>Light up the diyas</h2>
          <p>Tap each diya to light it. Make the whole screen glow with festive warmth.</p>
        </div>
        <div className="panel">
          <div className="diya-grid" id="diyaGrid">
            {litDiyas.map((isLit, idx) => (
              <button
                key={idx}
                type="button"
                className={`diya-card ${isLit ? "lit" : ""}`}
                aria-label={`Light diya ${idx + 1}`}
                onClick={() => handleToggleDiya(idx)}
              >
                <div className="tiny-diya">
                  <div className="tiny-flame" />
                  <div className="tiny-bowl" />
                </div>
                <p>Diya {idx + 1}</p>
              </button>
            ))}
          </div>
          <div className="counter" id="diyaCount">
            {litCount} of 10 diyas glowing
          </div>
          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <button className="small-btn" onClick={handleLightAllDiyas}>
              Light all diyas ✨
            </button>{" "}
            <button className="small-btn" onClick={handleResetDiyas}>
              Start again
            </button>
          </div>
        </div>
      </section>

      {/* Rangoli Canvas Section */}
      <section className="content" id="rangoli">
        <div className="section-head">
          <div className="kicker">Your digital art corner</div>
          <h2>Create a little rangoli</h2>
          <p>Pick a colour, then tap or drag on the canvas to make your own festive design.</p>
        </div>
        <div className="panel rangoli-layout">
          <div className="rangoli-wrap">
            <canvas
              id="rangoliCanvas"
              ref={rangoliCanvasRef}
              width={500}
              height={500}
              aria-label="Interactive rangoli drawing canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
          </div>
          <div>
            <div className="field">Choose a rangoli pattern</div>
            <div className="pattern-picker" id="patternPicker" role="group" aria-label="Choose a rangoli pattern">
              {patterns.map(([patId, label]) => (
                <button
                  key={patId}
                  type="button"
                  className={`pattern-btn ${currentPattern === patId ? "active" : ""}`}
                  aria-pressed={currentPattern === patId}
                  onClick={() => {
                    setCurrentPattern(patId);
                    drawRangoliPattern(patId);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="field">Choose a colour</div>
            <div className="palette" id="palette">
              {colours.map((col, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`swatch ${activeColour === col && !isEraser ? "active" : ""}`}
                  style={{ background: col }}
                  aria-label={`Choose ${col}`}
                  onClick={() => {
                    setActiveColour(col);
                    setIsEraser(false);
                  }}
                />
              ))}
            </div>

            <label className="field" htmlFor="brush">
              Brush size
            </label>
            <input
              id="brush"
              type="range"
              min={3}
              max={28}
              value={brushSize}
              onChange={(e) => setBrushSize(+e.target.value)}
              style={{ width: "100%", accentColor: "#ffd66b" }}
            />

            <div className="tool-row">
              <button
                type="button"
                className={`tool-btn eraser-btn ${isEraser ? "active" : ""}`}
                id="eraserBtn"
                onClick={() => setIsEraser(!isEraser)}
                aria-pressed={isEraser}
              >
                {isEraser ? "Eraser on" : "Eraser"}
              </button>
              <button type="button" className="tool-btn" onClick={handleClearRangoli}>
                Reset pattern
              </button>
            </div>

            <button type="button" className="tool-btn primary" onClick={handleSaveRangoli}>
              Download my rangoli ↓
            </button>
            <p style={{ fontSize: "11px", color: "#e7c6d1", lineHeight: 1.6 }}>
              Choose a pattern, then draw with your finger. Use the eraser to remove small mistakes.
            </p>
          </div>
        </div>
      </section>

      {/* Fireworks Section */}
      <section className="content">
        <div className="panel celebrate">
          <div className="kicker">Ready for a little magic?</div>
          <h2>Let the sky sparkle!</h2>
          <p>Press the button and send a burst of Diwali joy across the screen.</p>
          <div className="firework-area" id="fireworkArea" ref={fireworkAreaRef} />
          <button className="btn" onClick={handleLaunchFireworks}>
            Celebrate with fireworks 🎆
          </button>
        </div>
      </section>

      {/* Team Section */}
      <section className="content team" id="team">
        <div className="section-head">
          <div className="kicker">Crafted with light by</div>
        </div>
        <div className="nexora" aria-label="Nexora">
          <span style={{ "--i": 0 } as React.CSSProperties}>N</span>
          <span style={{ "--i": 1 } as React.CSSProperties}>E</span>
          <span style={{ "--i": 2 } as React.CSSProperties}>X</span>
          <span style={{ "--i": 3 } as React.CSSProperties}>O</span>
          <span style={{ "--i": 4 } as React.CSSProperties}>R</span>
          <span style={{ "--i": 5 } as React.CSSProperties}>A</span>
        </div>
        <p className="tagline">A duo team · Two minds, one light</p>
        <div className="team-grid">
          <div className="team-card">
            <div className="avatar">PG</div>
            <h3>Pratik Ghosh</h3>
            <p>Co-creator</p>
          </div>
          <div className="team-card">
            <div className="avatar">SB</div>
            <h3>Samragnyi Bhowmick</h3>
            <p>Co-creator</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <strong>🪔 Diwali Digital Diya</strong>
        <br />
        May your days be bright and your celebrations be beautiful.
        <br />
        <span className="credit">Crafted by Nexora · Pratik Ghosh &amp; Samragnyi Bhowmick</span>
        <br />
        <span style={{ opacity: 0.7 }}>A festive website concept · Built with Next.js, React &amp; TypeScript</span>
      </footer>

      {/* Back to top button */}
      <button
        type="button"
        className="backtop"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>

      {/* Toast popup */}
      <div className={`toast ${showToast ? "show" : ""}`} id="toast">
        {toastMsg}
      </div>

      {/* Share Modal Dialog */}
      <div
        className={`share-backdrop ${shareOpen ? "open" : ""}`}
        id="sharePopup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sharePopupTitle"
        aria-hidden={!shareOpen}
        onClick={(e) => {
          if ((e.target as HTMLElement).id === "sharePopup") setShareOpen(false);
        }}
      >
        <div className="share-modal">
          <button
            type="button"
            className="share-close"
            onClick={() => setShareOpen(false)}
            aria-label="Close share options"
          >
            ×
          </button>
          <div className="share-modal-orbit" aria-hidden="true">
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
          </div>
          <div className="share-modal-kicker">Pass the light along</div>
          <h2 id="sharePopupTitle">Share your Diwali wish</h2>
          <p className="share-modal-copy">Your personal greeting is ready. Pick a place to send it.</p>
          <div className="share-choice-grid">
            <button
              type="button"
              className="share-choice whatsapp-choice"
              onClick={() => handleShare("whatsapp")}
            >
              <span className="choice-mark">W</span>
              <span>
                <strong>WhatsApp</strong>
                <small>Send to a chat</small>
              </span>
              <b aria-hidden="true">↗</b>
            </button>
            <button
              type="button"
              className="share-choice instagram-choice"
              onClick={() => handleShare("instagram")}
            >
              <span className="choice-mark">I</span>
              <span>
                <strong>Instagram</strong>
                <small>Copy and open Direct</small>
              </span>
              <b aria-hidden="true">↗</b>
            </button>
            <button
              type="button"
              className="share-choice"
              onClick={() => handleShare("facebook")}
            >
              <span className="choice-mark">F</span>
              <span>
                <strong>Facebook</strong>
                <small>Share with friends</small>
              </span>
              <b aria-hidden="true">↗</b>
            </button>
            <button
              type="button"
              className="share-choice"
              onClick={() => handleShare("native")}
            >
              <span className="choice-mark">•••</span>
              <span>
                <strong>More ways</strong>
                <small>Use your device share sheet</small>
              </span>
              <b aria-hidden="true">↗</b>
            </button>
          </div>
          <button type="button" className="copy-choice" onClick={handleCopyGreeting}>
            Copy greeting text
          </button>
          <p className="share-modal-note">
            Your message includes the website link so your recipient can open the greeting.
          </p>
        </div>
      </div>
    </>
  );
}
