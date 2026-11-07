"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const INTRO_DURATION_MS = 8200;
const BACKGROUND_MUSIC_VOLUME = 0.22;
const BACKGROUND_MUSIC_SRC = "/assets/aistudio/Music_diwali_55395a56.mp4";

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

  // State for Music & Ambient Light
  const [musicOn, setMusicOn] = useState(true);
  const [ambientDim, setAmbientDim] = useState(false);

  // State for Team Member Profile Modal
  const [selectedMember, setSelectedMember] = useState<"pratik" | "samragnyi" | null>(null);

  const teamMembers = {
    pratik: {
      name: "Pratik Ghosh",
      role: "Co-creator & Developer",
      avatar: "PG",
      bio: "Passionate developer, creative builder & tech enthusiast behind Nexora, crafting immersive web experiences.",
      gmail: "pratikghosh161@gmail.com",
      instagram: "https://www.instagram.com/_prytk__?exln=emVlZnFtMmRibms3",
      github: "https://github.com/Pratik-dotcom-11",
      linkedin: "https://www.linkedin.com/in/pratik-ghosh-255b0a32b?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    },
    samragnyi: {
      name: "Samragnyi Bhowmick",
      role: "Co-creator & Designer",
      avatar: "SB",
      bio: "Creative artist, UI craftsman and co-creator of Nexora, bringing soulful aesthetics and interactive beauty to digital art.",
      gmail: "bhowmicksamragnyee@gmail.com",
      instagram: "https://www.instagram.com/_littlechillbaby_?srtk=MWlmOGdhdGRrcTI5dw==",
      github: "https://github.com/Samragnyi",
      linkedin: "https://www.linkedin.com/in/samragnyi?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    },
  };

  // State for Rangoli
  const [currentPattern, setCurrentPattern] = useState<
    "mandala" | "lotus" | "diya" | "star" | "peacock" | "sunburst" | "flower" | "diamond" | "chakra"
  >("mandala");
  const [brushSize, setBrushSize] = useState(10);
  const [activeColour, setActiveColour] = useState("#ffd34f");
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawingActive, setIsDrawingActive] = useState(false);

  // State for Toast & Modal
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [isCopiedBlessing, setIsCopiedBlessing] = useState(false);
  const [confettiMode, setConfettiMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const confettiModeRef = useRef(false);
  useEffect(() => {
    confettiModeRef.current = confettiMode;
  }, [confettiMode]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("ambient-dimmed", ambientDim);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("ambient-dimmed");
      }
    };
  }, [ambientDim]);

  // Ensure website always opens at the top hero section and disable browser scroll restoration
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Play opening firecrackers sound in sync with the slower intro sequence
  useEffect(() => {
    const t = setTimeout(() => {
      playCrackersSound(INTRO_DURATION_MS);
    }, 250);
    return () => {
      clearTimeout(t);
      stopCrackersSound();
    };
  }, []);

  // Global button click sound effect listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const btn = target.closest(
        "button, [role='button'], .btn, .small-btn, .nav-cta, .feature-btn, .swatch, .style-swatch, .pattern-btn, .action-btn, .rangoli-start-btn, .done-draw-btn, .surprise-btn"
      );
      if (btn) {
        playButtonPopSound();
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

  // Auto-play background music on website entry with smooth fade-in and interaction recovery
  useEffect(() => {
    const audio = bgMusicRef.current;
    if (!audio) return;

    const playMusic = () => {
      if (!bgMusicRef.current) return;
      bgMusicRef.current.volume = 0;
      const playPromise = bgMusicRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setMusicOn(true);
            let vol = 0;
            const targetVol = BACKGROUND_MUSIC_VOLUME;
            const fadeIn = setInterval(() => {
              if (bgMusicRef.current) {
                vol = Math.min(targetVol, vol + 0.035);
                bgMusicRef.current.volume = vol;
                if (vol >= targetVol) clearInterval(fadeIn);
              } else {
                clearInterval(fadeIn);
              }
            }, 60);
          })
          .catch(() => {
            // Browser restricted unprompted autoplay - start on any user interaction gesture
            const events = ["pointerdown", "click", "touchstart", "keydown", "scroll", "mousemove"];
            const startOnInteraction = () => {
              if (bgMusicRef.current && bgMusicRef.current.paused) {
                bgMusicRef.current.volume = 0;
                bgMusicRef.current
                  .play()
                  .then(() => {
                    setMusicOn(true);
                    let vol = 0;
                    const targetVol = BACKGROUND_MUSIC_VOLUME;
                    const fadeIn = setInterval(() => {
                      if (bgMusicRef.current) {
                        vol = Math.min(targetVol, vol + 0.035);
                        bgMusicRef.current.volume = vol;
                        if (vol >= targetVol) clearInterval(fadeIn);
                      } else {
                        clearInterval(fadeIn);
                      }
                    }, 60);
                  })
                  .catch(() => {});
              }
              events.forEach((evt) =>
                window.removeEventListener(evt, startOnInteraction, { capture: true })
              );
            };

            events.forEach((evt) =>
              window.addEventListener(evt, startOnInteraction, { capture: true, once: true })
            );
          });
      }
    };

    playMusic();
  }, []);

  // Refs
  const fxCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const patternCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyStackRef = useRef<ImageData[]>([]);
  const greetingCardRef = useRef<HTMLDivElement | null>(null);
  const fireworkAreaRef = useRef<HTMLDivElement | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientCrackleRef = useRef<{
    source: AudioBufferSourceNode;
    gain: GainNode;
    timeoutId: NodeJS.Timeout;
  } | null>(null);
  const crackersAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const fadeOutIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const colours = [
    "#ffd34f", "#ff6b6b", "#ff8bc2", "#b69cff", "#69d8c5",
    "#fff4d0", "#f28b35", "#ffffff", "#7dd3fc", "#a3e635"
  ];

  type RangoliPatternId =
    | "mandala"
    | "lotus"
    | "diya"
    | "star"
    | "peacock"
    | "sunburst"
    | "flower"
    | "diamond"
    | "chakra";

  const patterns: [RangoliPatternId, string][] = [
    ["mandala", "Mandala"],
    ["lotus", "Lotus"],
    ["diya", "Diya Light"],
    ["star", "Lakshmi Star"],
    ["peacock", "Peacock"],
    ["sunburst", "Surya Sun"],
    ["flower", "Flower Bloom"],
    ["diamond", "Diamond Kolam"],
    ["chakra", "Sacred Chakra"],
  ];

  const showToastNotification = useCallback((msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2300);
  }, []);

  // Ambient Light Toggle (Night mode)
  const toggleAmbientLight = () => {
    setAmbientDim((prev) => {
      const next = !prev;
      showToastNotification(
        next
          ? "🌙 Night mode on: Diyas glowing brighter!"
          : "✨ Ambient light: Normal"
      );
      return next;
    });
  };

  // Background Music Controller with smooth fade-in/out transition and balanced volume
  const toggleMusic = () => {
    const audio = bgMusicRef.current;
    if (!audio) return;

    if (musicOn) {
      setMusicOn(false);
      let vol = audio.volume;
      const fadeInterval = setInterval(() => {
        vol = Math.max(0, vol - 0.05);
        audio.volume = vol;
        if (vol <= 0.01) {
          clearInterval(fadeInterval);
          audio.pause();
        }
      }, 50);
      showToastNotification("♫ Music: Off");
    } else {
      setMusicOn(true);
      audio.volume = 0;
      audio.play().then(() => {
        let vol = 0;
        const targetVol = BACKGROUND_MUSIC_VOLUME;
        const fadeInterval = setInterval(() => {
          vol = Math.min(targetVol, vol + 0.04);
          audio.volume = vol;
          if (vol >= targetVol) {
            clearInterval(fadeInterval);
          }
        }, 50);
      }).catch(() => {
        showToastNotification("Audio playback failed");
      });
      showToastNotification("♫ Music: On");
    }
  };

  // Stop continuous fireworks ambient crackling sound with a smooth fade-out
  const stopAmbientCrackle = () => {
    if (!ambientCrackleRef.current) return;
    const currentCrackle = ambientCrackleRef.current;
    ambientCrackleRef.current = null;
    clearTimeout(currentCrackle.timeoutId);

    try {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        const now = audioCtxRef.current.currentTime;
        currentCrackle.gain.gain.cancelScheduledValues(now);
        currentCrackle.gain.gain.setValueAtTime(currentCrackle.gain.gain.value, now);
        currentCrackle.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
        setTimeout(() => {
          try {
            currentCrackle.source.stop();
            currentCrackle.source.disconnect();
          } catch {
            // Safe cleanup fallback
          }
        }, 600);
      } else {
        currentCrackle.source.stop();
        currentCrackle.source.disconnect();
      }
    } catch {
      // Safe cleanup fallback
    }
  };

  // Continuous low-volume ambient crackling sound playing throughout the active fireworks display
  const startAmbientCrackle = (durationMs = 6800) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "closed") return;

      // If ambient crackling is already active, extend the countdown without creating redundant overlapping nodes
      if (ambientCrackleRef.current) {
        clearTimeout(ambientCrackleRef.current.timeoutId);
        ambientCrackleRef.current.timeoutId = setTimeout(() => {
          stopAmbientCrackle();
        }, durationMs);
        return;
      }

      // Procedural 2.5s looping sparkler crackle buffer: subtle pink noise bed with irregular micro-impulses
      const bufferLength = Math.floor(ctx.sampleRate * 2.5);
      const crackleBuffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
      const channel = crackleBuffer.getChannelData(0);

      let lastOut = 0;
      for (let i = 0; i < bufferLength; i++) {
        const white = Math.random() * 2 - 1;
        const pink = lastOut * 0.94 + white * 0.06;
        lastOut = pink;

        let spark = 0;
        const rand = Math.random();
        if (rand < 0.009) {
          // Sharp sparkler ember pop
          spark = (Math.random() * 2 - 1) * (0.5 + Math.random() * 0.5);
        } else if (rand < 0.024) {
          // Delicate sizzle grain
          spark = (Math.random() * 2 - 1) * 0.22;
        }

        channel[i] = pink * 0.2 + spark * 0.8;
      }

      const source = ctx.createBufferSource();
      source.buffer = crackleBuffer;
      source.loop = true;

      // Bandpass filter to sculpt into crisp, airy sparkler sizzle (~2800 Hz)
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2800, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      // Low volume gain node with smooth fade-in
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.35);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(now);

      const timeoutId = setTimeout(() => {
        stopAmbientCrackle();
      }, durationMs);

      ambientCrackleRef.current = {
        source,
        gain,
        timeoutId,
      };
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Play uploaded firecrackers audio with professional fade-out transition
  const playCrackersSound = (durationMs = INTRO_DURATION_MS) => {
    try {
      const audio = crackersAudioRef.current;
      if (!audio) return;

      if (fadeOutIntervalRef.current) {
        clearInterval(fadeOutIntervalRef.current);
        fadeOutIntervalRef.current = null;
      }

      audio.currentTime = 0;
      audio.volume = 0.85;
      audio.play().catch(() => {
        // Autoplay policy fallback
      });

      if (durationMs > 0) {
        const fadeStart = Math.max(0, durationMs - 1100);
        setTimeout(() => {
          if (!crackersAudioRef.current) return;
          let vol = crackersAudioRef.current.volume;
          const steps = 14;
          const stepTime = 50;
          const volStep = vol / steps;

          fadeOutIntervalRef.current = setInterval(() => {
            if (!crackersAudioRef.current) {
              if (fadeOutIntervalRef.current) clearInterval(fadeOutIntervalRef.current);
              return;
            }
            vol = Math.max(0, vol - volStep);
            crackersAudioRef.current.volume = vol;
            if (vol <= 0.02) {
              if (fadeOutIntervalRef.current) clearInterval(fadeOutIntervalRef.current);
              crackersAudioRef.current.pause();
              crackersAudioRef.current.currentTime = 0;
            }
          }, stepTime);
        }, fadeStart);
      }
    } catch {
      // Audio playback safe fallback
    }
  };

  const stopCrackersSound = () => {
    try {
      const audio = crackersAudioRef.current;
      if (!audio) return;
      if (fadeOutIntervalRef.current) {
        clearInterval(fadeOutIntervalRef.current);
        fadeOutIntervalRef.current = null;
      }
      audio.pause();
      audio.currentTime = 0;
    } catch {
      // Safe fallback
    }
  };

  // Play smooth button click pop sound effect via Web Audio API
  const playButtonPopSound = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "closed") return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.042);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.007);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.048);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.052);
    } catch {
      // Audio fallback
    }
  };

  // Web Audio API gentle resonant chime for lighting an unlit diya
  const playDiyaLightChime = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "closed") return;

      const now = ctx.currentTime;
      [587.33, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.03);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.03);
        gain.gain.linearRampToValueAtTime(0.05 - idx * 0.012, now + idx * 0.03 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.03 + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.03);
        osc.stop(now + idx * 0.03 + 0.7);
      });
    } catch {
      // Audio fallback
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
  };

  const playSacredChime = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const notes = [440, 554.37, 659.25, 830.61, 880, 1108.73];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.9);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const handleOpenSurprise = () => {
    setSurpriseOpen(true);
    playSacredChime();
    const fxShow = (window as unknown as { fxShow?: (n: number) => void }).fxShow;
    if (fxShow) fxShow(4);
  };

  const handleCloseSurprise = () => {
    setSurpriseOpen(false);
  };

  const blessingText = `May the sacred flame of the diya illuminate every shadowed corner of your path.

In the gentle warmth of this festive night, may peace settle deep within your heart, may quiet hopes find their wings, and may eternal light guide your footsteps toward boundless grace, inner prosperity, and everlasting serenity.

Shubh Deepavali to you and everyone you hold dear.`;

  const handleCopyBlessing = async () => {
    try {
      await navigator.clipboard.writeText(blessingText);
      setIsCopiedBlessing(true);
      showToastNotification("Blessing copied to clipboard! 📜✨");
      setTimeout(() => setIsCopiedBlessing(false), 2600);
    } catch {
      showToastNotification("Blessing ready to be read.");
    }
  };

  const handleShareBlessing = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = encodeURIComponent(
      `🪔 *A Sacred Diwali Blessing for You* 📜✨\n\n"${blessingText}"\n\nCelebrate with Diwali Digital Diya: ${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleToggleConfettiMode = () => {
    const next = !confettiMode;
    setConfettiMode(next);
    if (next) {
      showToastNotification("🎉 Golden Confetti Mode ON! Shower will cascade during fireworks ✨");
      playSacredChime();
      const startShower = (window as unknown as { startConfettiShower?: (d?: number) => void }).startConfettiShower;
      if (startShower) startShower(3500);
    } else {
      showToastNotification("Confetti Mode turned off.");
      const stopShower = (window as unknown as { stopConfettiShower?: () => void }).stopConfettiShower;
      if (stopShower) stopShower();
    }
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



  const handleShare = async (channel = "whatsapp") => {
    const url = getShareUrl();
    const text = getShareText();

    if (channel === "native" && navigator.share) {
      try {
        await navigator.share({ title: "Happy Diwali!", text, url });
        setShareOpen(false);
        return;
      } catch (e: unknown) {
        if (e instanceof Error && e.name === "AbortError") return;
      }
    }

    if (channel === "instagram") {
      try {
        await navigator.clipboard.writeText(text);
        showToastNotification("Greeting copied! Paste it in Instagram Direct ✨");
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
      const willBeLit = !next[index];
      next[index] = willBeLit;
      if (willBeLit) {
        playDiyaLightChime();
      }
      const count = next.filter(Boolean).length;
      if (count === 10) {
        showToastNotification("A beautiful circle of light!");
        const fxShow = (window as unknown as { fxShow?: (n: number) => void }).fxShow;
        if (fxShow) fxShow(5);
        startAmbientCrackle(6000);
        playCrackersSound(6000);
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
          startAmbientCrackle(6000);
          playCrackersSound(6000);
        }
      }, i * 140);
    });
  };

  const handleResetDiyas = () => {
    setLitDiyas(Array(10).fill(false));
  };

  // Rangoli drawing logic - Draw guide pattern onto patternCanvas
  const drawRangoliPattern = useCallback((pat: string) => {
    const canvas = patternCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 500, 500);
    ctx.save();
    ctx.translate(250, 250);
    ctx.strokeStyle = "rgba(255, 218, 120, 0.44)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ffb52e";
    ctx.shadowBlur = 4;

    if (pat === "mandala") {
      ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 54, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 102, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 160, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 210, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.ellipse(0, -78, 16, 26, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.moveTo(-22, -160);
        ctx.quadraticCurveTo(0, -210, 0, -210);
        ctx.quadraticCurveTo(0, -210, 22, -160);
        ctx.stroke();
      }
    } else if (pat === "lotus") {
      ctx.beginPath(); ctx.arc(0, 0, 36, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 8; i++) {
        ctx.rotate((Math.PI * 2) / 8);
        ctx.beginPath();
        ctx.moveTo(0, -36);
        ctx.bezierCurveTo(-45, -95, -42, -185, 0, -218);
        ctx.bezierCurveTo(42, -185, 45, -95, 0, -36);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -36);
        ctx.lineTo(0, -200);
        ctx.stroke();
      }
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 8);
        ctx.beginPath();
        ctx.ellipse(0, -96, 18, 48, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.rotate(Math.PI / 8);
      }
    } else if (pat === "diya") {
      // Center Diya
      ctx.beginPath();
      ctx.ellipse(0, 12, 48, 24, 0, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-16, 12);
      ctx.quadraticCurveTo(0, -60, 0, -60);
      ctx.quadraticCurveTo(0, -60, 16, 12);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 85, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 135, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 8; i++) {
        ctx.rotate((Math.PI * 2) / 8);
        ctx.beginPath();
        ctx.ellipse(0, -155, 26, 13, 0, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-10, -155);
        ctx.quadraticCurveTo(0, -200, 0, -200);
        ctx.quadraticCurveTo(0, -200, 10, -155);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -85);
        ctx.lineTo(0, -140);
        ctx.stroke();
      }
    } else if (pat === "peacock") {
      ctx.beginPath(); ctx.arc(0, 0, 42, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 78, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 6; i++) {
        ctx.rotate((Math.PI * 2) / 6);
        ctx.beginPath();
        ctx.moveTo(0, -78);
        ctx.bezierCurveTo(-65, -120, -58, -200, 0, -220);
        ctx.bezierCurveTo(58, -200, 65, -120, 0, -78);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -165, 22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -165, 10, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (pat === "star") {
      ctx.beginPath(); ctx.arc(0, 0, 45, 0, Math.PI * 2); ctx.stroke();
      const s = 145;
      ctx.strokeRect(-s, -s, s * 2, s * 2);
      ctx.save();
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-s, -s, s * 2, s * 2);
      ctx.restore();
      ctx.beginPath(); ctx.arc(0, 0, 215, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 8; i++) {
        ctx.rotate((Math.PI * 2) / 8);
        ctx.beginPath();
        ctx.arc(0, -205, 12, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (pat === "sunburst") {
      ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 85, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 138, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 16; i++) {
        ctx.rotate((Math.PI * 2) / 16);
        ctx.beginPath();
        ctx.moveTo(-14, -138);
        ctx.lineTo(0, -220);
        ctx.lineTo(14, -138);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -110, 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (pat === "flower") {
      for (let i = 0; i < 12; i++) {
        ctx.rotate((Math.PI * 2) / 12);
        ctx.beginPath();
        ctx.ellipse(0, -115, 22, 85, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, -65, 12, 35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(0, 0, 42, 0, Math.PI * 2); ctx.stroke();
    } else if (pat === "diamond") {
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.moveTo(0, -195);
        ctx.lineTo(32, -140);
        ctx.lineTo(0, -85);
        ctx.lineTo(-32, -140);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -140);
        ctx.lineTo(18, -100);
        ctx.lineTo(0, -60);
        ctx.lineTo(-18, -100);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(0, 0, 45, 0, Math.PI * 2); ctx.stroke();
    } else if (pat === "chakra") {
      ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 68, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 160, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 215, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 16; i++) {
        ctx.rotate((Math.PI * 2) / 16);
        ctx.beginPath();
        ctx.moveTo(0, -68);
        ctx.lineTo(0, -160);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -188, 16, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();
      }
    }

    ctx.restore();
  }, []);

  const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * canvas.width) / r.width,
      y: ((e.clientY - r.top) * canvas.height) / r.height,
    };
  };

  const saveHistorySnapshot = () => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyStackRef.current.push(data);
      if (historyStackRef.current.length > 20) {
        historyStackRef.current.shift();
      }
    } catch {
      // Ignore if image data reading fails
    }
  };

  const handleUndo = () => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (historyStackRef.current.length > 0) {
      const prev = historyStackRef.current.pop();
      if (prev) {
        ctx.putImageData(prev, 0, 0);
        showToastNotification("Undid last stroke");
        return;
      }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showToastNotification("Canvas cleared");
  };

  const drawDot = (p: { x: number; y: number }) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.arc(p.x, p.y, brushSize, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? "rgba(0,0,0,1)" : activeColour;
    ctx.shadowColor = isEraser ? "transparent" : activeColour;
    ctx.shadowBlur = isEraser ? 0 : 12;
    ctx.fill();
    ctx.restore();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingActive) return;
    e.preventDefault();
    isDrawingRef.current = true;
    saveHistorySnapshot();
    const p = getCanvasPos(e);
    lastPosRef.current = p;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drawDot(p);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingActive || !isDrawingRef.current || !lastPosRef.current) return;
    e.preventDefault();
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const p = getCanvasPos(e);
    ctx.save();
    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = isEraser ? "rgba(0,0,0,1)" : activeColour;
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

  const handleClearDrawing = () => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    saveHistorySnapshot();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEraser(false);
    showToastNotification("Paint cleared! Pattern preserved.");
  };

  const handleSaveRangoli = () => {
    const patCanvas = patternCanvasRef.current;
    const drawCanvas = drawingCanvasRef.current;
    if (!patCanvas || !drawCanvas) return;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 500;
    exportCanvas.height = 500;
    const expCtx = exportCanvas.getContext("2d");
    if (!expCtx) return;

    // Dark festive background
    expCtx.fillStyle = "#250514";
    expCtx.fillRect(0, 0, 500, 500);

    // Decorative border
    expCtx.strokeStyle = "rgba(255, 218, 120, 0.6)";
    expCtx.lineWidth = 3;
    expCtx.strokeRect(14, 14, 472, 472);
    expCtx.strokeStyle = "rgba(255, 218, 120, 0.3)";
    expCtx.lineWidth = 1;
    expCtx.strokeRect(22, 22, 456, 456);

    // Composite pattern underneath
    expCtx.drawImage(patCanvas, 0, 0);

    // Composite user paint on top
    expCtx.drawImage(drawCanvas, 0, 0);

    // Watermark
    expCtx.font = "700 12px Arial";
    expCtx.fillStyle = "rgba(255, 218, 120, 0.75)";
    expCtx.textAlign = "center";
    expCtx.fillText("SHUBH DEEPAVALI • DIGITAL RANGOLI", 250, 486);

    const a = document.createElement("a");
    a.download = `my-diwali-rangoli-${currentPattern}.png`;
    a.href = exportCanvas.toDataURL("image/png");
    a.click();
    showToastNotification("Your rangoli is downloaded!");
  };

  // Web Audio API Festive Fireworks Sound Synthesizer
  const playFireworkRocketSound = (detonationDelayMs: number) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // 1. Ascending Rocket Whistle / Whoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      const startFreq = 380 + Math.random() * 80;
      const endFreq = 1200 + Math.random() * 200;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.95);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.1);

      // 2. Detonation Boom & Crackle at explosion point
      setTimeout(() => {
        try {
          if (ctx.state === "closed") return;
          const burstNow = ctx.currentTime;

          // Low-frequency deep resonant boom
          const boom = ctx.createOscillator();
          const boomGain = ctx.createGain();
          boom.type = "sine";
          boom.frequency.setValueAtTime(160 + Math.random() * 40, burstNow);
          boom.frequency.exponentialRampToValueAtTime(28, burstNow + 0.35);

          boomGain.gain.setValueAtTime(0.22, burstNow);
          boomGain.gain.exponentialRampToValueAtTime(0.001, burstNow + 0.38);

          boom.connect(boomGain);
          boomGain.connect(ctx.destination);
          boom.start(burstNow);
          boom.stop(burstNow + 0.4);

          // Sparkling crackle flurry (filtered noise)
          const bufferSize = Math.floor(ctx.sampleRate * 0.4);
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
          }

          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(2200 + Math.random() * 600, burstNow);
          filter.Q.setValueAtTime(2.5, burstNow);

          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.18, burstNow);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, burstNow + 0.36);

          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(ctx.destination);

          noise.start(burstNow);
          noise.stop(burstNow + 0.4);
        } catch {
          // Audio cleanup safe fallback
        }
      }, detonationDelayMs);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Fireworks launcher in section
  const handleLaunchFireworks = () => {
    const area = fireworkAreaRef.current;
    if (!area) return;

    // Start continuous low-volume ambient crackling sound throughout active fireworks display
    startAmbientCrackle(6800);
    playCrackersSound(6800);

    // Trigger persistent golden confetti shower if Confetti Mode is active
    if (confettiModeRef.current) {
      const startShower = (window as unknown as { startConfettiShower?: (d?: number) => void }).startConfettiShower;
      if (startShower) startShower(14000);
    }

    // Celebratory initial fanfare chime
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      [587.33, 739.99, 880, 1174.66].forEach((f, idx) => {
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = "sine";
        chime.frequency.setValueAtTime(f, now + idx * 0.06);
        chimeGain.gain.setValueAtTime(0.001, now + idx * 0.06);
        chimeGain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.06 + 0.02);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.5);
        chime.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chime.start(now + idx * 0.06);
        chime.stop(now + idx * 0.06 + 0.55);
      });
    } catch {
      // Audio fallback
    }

    const isLite = (window as unknown as { __lite?: boolean }).__lite;
    const N = isLite ? 12 : 28;
    const rect = area.getBoundingClientRect();

    for (let k = 0; k < 5; k++) {
      const delay = 1200 + k * 520;
      playFireworkRocketSound(delay);

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
      }, delay);
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
    let confettis: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      rot: number;
      rotSpeed: number;
      w: number;
      h: number;
      col: string;
      wobble: number;
      wobbleSpeed: number;
      opacity: number;
    }> = [];
    let confettiShowerActive = false;
    let confettiShowerTimer: NodeJS.Timeout | null = null;
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
      if (typeof document !== "undefined" && document.hidden) {
        requestAnimationFrame(loop);
        return;
      }
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

      // Persistent Golden Confetti Particle Shower
      if (confettiShowerActive && confettis.length < (isLite() ? 65 : 155)) {
        for (let i = 0; i < (isLite() ? 2 : 5); i++) {
          confettis.push({
            x: rnd(0, W),
            y: rnd(-40, -10),
            vx: rnd(-0.9, 0.9),
            vy: rnd(1.8, 3.8),
            rot: rnd(0, Math.PI * 2),
            rotSpeed: rnd(-0.08, 0.08),
            w: rnd(8, 14),
            h: rnd(5, 10),
            col: ["#ffe885", "#ffd23f", "#f59e0b", "#fff8db", "#fcd34d", "#fef08a"][
              Math.floor(rnd(0, 6))
            ],
            wobble: rnd(0, 10),
            wobbleSpeed: rnd(0.04, 0.08),
            opacity: 1,
          });
        }
      }

      if (confettis.length) {
        c.globalCompositeOperation = "source-over";
        confettis = confettis.filter((cf) => {
          cf.y += cf.vy;
          cf.wobble += cf.wobbleSpeed;
          cf.x += cf.vx + Math.sin(cf.wobble) * 1.1;
          cf.rot += cf.rotSpeed;

          if (cf.y > H + 25) {
            if (confettiShowerActive) {
              cf.y = rnd(-35, -10);
              cf.x = rnd(0, W);
              return true;
            }
            return false;
          }

          c.save();
          c.translate(cf.x, cf.y);
          c.rotate(cf.rot);
          c.scale(Math.cos(cf.rot * 1.3), 1);
          c.fillStyle = cf.col;
          c.globalAlpha = Math.max(0, Math.min(1, cf.opacity));
          c.fillRect(-cf.w / 2, -cf.h / 2, cf.w, cf.h);
          c.restore();

          return true;
        });
        c.globalCompositeOperation = "lighter";
      }

      c.globalAlpha = 1;
      if (parts.length || rockets.length || confettis.length || confettiShowerActive) {
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

    const startConfettiShower = (durationMs = 14000) => {
      if (reduce) return;
      confettiShowerActive = true;
      go();
      if (confettiShowerTimer) clearTimeout(confettiShowerTimer);
      confettiShowerTimer = setTimeout(() => {
        confettiShowerActive = false;
      }, durationMs);
    };

    const stopConfettiShower = () => {
      confettiShowerActive = false;
      if (confettiShowerTimer) clearTimeout(confettiShowerTimer);
      confettis = [];
    };

    // Attach to window
    (window as unknown as {
      fxShow?: typeof fxShow;
      fxBurst?: typeof fxBurst;
      startConfettiShower?: typeof startConfettiShower;
      stopConfettiShower?: typeof stopConfettiShower;
    }).fxShow = fxShow;
    (window as unknown as {
      fxShow?: typeof fxShow;
      fxBurst?: typeof fxBurst;
      startConfettiShower?: typeof startConfettiShower;
      stopConfettiShower?: typeof stopConfettiShower;
    }).fxBurst = fxBurst;
    (window as unknown as {
      fxShow?: typeof fxShow;
      fxBurst?: typeof fxBurst;
      startConfettiShower?: typeof startConfettiShower;
      stopConfettiShower?: typeof stopConfettiShower;
    }).startConfettiShower = startConfettiShower;
    (window as unknown as {
      fxShow?: typeof fxShow;
      fxBurst?: typeof fxBurst;
      startConfettiShower?: typeof startConfettiShower;
      stopConfettiShower?: typeof stopConfettiShower;
    }).stopConfettiShower = stopConfettiShower;

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

      let ribbonFrameSkip = false;
      const tickRibbons = () => {
        if (!on || cancelRibbonTick) return;
        if (typeof document !== "undefined" && document.hidden) {
          requestAnimationFrame(tickRibbons);
          return;
        }
        if (isLite()) {
          ribbonFrameSkip = !ribbonFrameSkip;
          if (ribbonFrameSkip) {
            requestAnimationFrame(tickRibbons);
            return;
          }
        }
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
      setShowIntro(false);
    }, INTRO_DURATION_MS);

    return () => {
      cancelRibbonTick = true;
      clearTimeout(introTimer);
      stopAmbientCrackle();
      document.querySelectorAll(".floater").forEach((f) => f.remove());
    };
  }, [currentPattern, drawRangoliPattern]);

  const litCount = litDiyas.filter(Boolean).length;

  return (
    <>
      <audio
        ref={crackersAudioRef}
        src="/assets/aistudio/Crackers_1f4b6b0f.mpeg"
        preload="auto"
      />
  <audio
    ref={bgMusicRef}
    src={BACKGROUND_MUSIC_SRC}
    autoPlay
    loop
    preload="auto"
    playsInline
    aria-hidden="true"
  />
      <canvas id="fxCanvas" ref={fxCanvasRef} aria-hidden="true" />
      {showIntro && (
        <>
          <div className="intro-veil" aria-hidden="true" />
          <div className="intro-greet" id="introGreet" aria-hidden="true">
            <div className="lamp">🪔</div>
            <h2>Shubh Deepavali</h2>
            <p>Happy Diwali</p>
            <p className="by">✦ A Nexora creation ✦</p>
          </div>
        </>
      )}
      <div className={`ambient ${ambientDim ? "dimmed" : ""}`} />
      <div className={`orb one ${ambientDim ? "dimmed" : ""}`} />
      <div className={`orb two ${ambientDim ? "dimmed" : ""}`} />

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
          <a href="#diya">Diyas</a>
          <a href="#greeting">Create greeting</a>
          <a href="#rangoli">Rangoli</a>
          <a href="#blessing">Blessing</a>
          <a href="#celebrate">Fireworks</a>
          <a href="#team">Team</a>
        </div>
        <button
          className="nav-cta"
          onClick={() => document.querySelector("#greeting")?.scrollIntoView({ behavior: "smooth" })}
        >
          Create a wish ↗
        </button>
      </nav>

      {/* Quick Controls: Ambient Light */}
      <div className="quick-toggles" aria-label="Festive controls">
        <button
          className={`ambient-toggle ${ambientDim ? "active" : ""}`}
          id="ambientBtn"
          onClick={toggleAmbientLight}
          aria-pressed={ambientDim}
          title="Toggle night-time ambient lighting"
        >
          {ambientDim ? "🌙 Ambient light: Night" : "✨ Ambient light: Normal"}
        </button>
      </div>

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
          <article
            className="feature"
            role="button"
            tabIndex={0}
            onClick={() => {
              document.querySelector("#diya")?.scrollIntoView({ behavior: "smooth" });
              showToastNotification("Tap any diya to light it! ✨");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document.querySelector("#diya")?.scrollIntoView({ behavior: "smooth" });
                showToastNotification("Tap any diya to light it! ✨");
              }
            }}
            aria-label="Go to Diya lighting section"
          >
            <div className="icon">🪔</div>
            <h3>Light a diya</h3>
            <p>Tap the lamps and watch their warm flames glow. Each light adds to the celebration.</p>
            <button
              type="button"
              className="feature-btn"
              onClick={(e) => {
                e.stopPropagation();
                document.querySelector("#diya")?.scrollIntoView({ behavior: "smooth" });
                showToastNotification("Tap any diya to light it! ✨");
              }}
            >
              Light diyas ↗
            </button>
          </article>

          <article
            className="feature"
            role="button"
            tabIndex={0}
            onClick={() => document.querySelector("#greeting")?.scrollIntoView({ behavior: "smooth" })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document.querySelector("#greeting")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            aria-label="Go to greeting card builder section"
          >
            <div className="icon">💌</div>
            <h3>Personal greetings</h3>
            <p>Write a wish for someone special and create a greeting card with their name.</p>
            <button
              type="button"
              className="feature-btn"
              onClick={(e) => {
                e.stopPropagation();
                document.querySelector("#greeting")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Create wish ↗
            </button>
          </article>

          <article
            className="feature"
            role="button"
            tabIndex={0}
            onClick={() => document.querySelector("#rangoli")?.scrollIntoView({ behavior: "smooth" })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document.querySelector("#rangoli")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            aria-label="Go to digital rangoli canvas section"
          >
            <div className="icon">🌸</div>
            <h3>Digital rangoli</h3>
            <p>Choose colours and draw your own festive pattern on an interactive canvas.</p>
            <button
              type="button"
              className="feature-btn"
              onClick={(e) => {
                e.stopPropagation();
                document.querySelector("#rangoli")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Draw rangoli ↗
            </button>
          </article>

          <article
            className="feature"
            role="button"
            tabIndex={0}
            onClick={() => document.querySelector("#celebrate")?.scrollIntoView({ behavior: "smooth" })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document.querySelector("#celebrate")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            aria-label="Go to fireworks celebration section"
          >
            <div className="icon">🎆</div>
            <h3>Fireworks</h3>
            <p>Launch a burst of colourful celebration with a click of the button.</p>
            <button
              type="button"
              className="feature-btn"
              onClick={(e) => {
                e.stopPropagation();
                document.querySelector("#celebrate")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Launch fireworks ↗
            </button>
          </article>

          <article
            className="feature"
            role="button"
            tabIndex={0}
            onClick={toggleMusic}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMusic();
              }
            }}
            aria-label="Toggle festive background melody"
          >
            <div className="icon">🎵</div>
            <h3>Festive sounds</h3>
            <p>Turn on a gentle generated melody while you explore the celebration.</p>
            <button
              type="button"
              className="feature-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleMusic();
              }}
            >
              {musicOn ? "♫ Stop melody" : "♫ Play melody"}
            </button>
          </article>

          <article
            className="feature"
            role="button"
            tabIndex={0}
            onClick={() => {
              document.querySelector("#greeting")?.scrollIntoView({ behavior: "smooth" });
              setShareOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document.querySelector("#greeting")?.scrollIntoView({ behavior: "smooth" });
                setShareOpen(true);
              }
            }}
            aria-label="Open greeting share sheet"
          >
            <div className="icon">📲</div>
            <h3>Share the joy</h3>
            <p>Copy your greeting or share it through WhatsApp with friends and family.</p>
            <button
              type="button"
              className="feature-btn"
              onClick={(e) => {
                e.stopPropagation();
                document.querySelector("#greeting")?.scrollIntoView({ behavior: "smooth" });
                setShareOpen(true);
              }}
            >
              Share wish ↗
            </button>
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
          <p>
            Choose a festive traditional pattern, pick your gulal colors, and draw your masterpiece.
          </p>
        </div>
        <div className="panel rangoli-layout">
          <div className="rangoli-wrap">
            <div className="rangoli-stack">
              {/* Pattern Guide Layer (Always preserved underneath, never erased) */}
              <canvas
                ref={patternCanvasRef}
                width={500}
                height={500}
                className="rangoli-pattern-canvas"
                aria-hidden="true"
              />

              {/* User Drawing Layer (On top, erased without affecting the guide pattern) */}
              <canvas
                id="rangoliCanvas"
                ref={drawingCanvasRef}
                width={500}
                height={500}
                className={`rangoli-draw-canvas ${
                  isDrawingActive ? (isEraser ? "eraser-enabled" : "drawing-enabled") : ""
                }`}
                aria-label="Interactive rangoli drawing canvas"
                style={{
                  touchAction: isDrawingActive ? "none" : "pan-y",
                  cursor: isDrawingActive ? (isEraser ? "cell" : "crosshair") : "default",
                }}
                onPointerDown={isDrawingActive ? handlePointerDown : undefined}
                onPointerMove={isDrawingActive ? handlePointerMove : undefined}
                onPointerUp={isDrawingActive ? handlePointerUp : undefined}
                onPointerCancel={isDrawingActive ? handlePointerUp : undefined}
                onPointerLeave={isDrawingActive ? handlePointerUp : undefined}
              />

              {/* Active drawing status bar with quick exit/scroll toggle */}
              {isDrawingActive && (
                <div className="rangoli-status-bar">
                  <span className="status-pill">
                    <span className="status-dot" />
                    {isEraser ? "🧹 Eraser Active" : "🖌️ Drawing Mode"}
                  </span>
                  <button
                    type="button"
                    className="done-draw-btn"
                    onClick={() => {
                      setIsDrawingActive(false);
                      showToastNotification("Drawing paused. Page scroll enabled!");
                    }}
                  >
                    ✓ Done / Enable Scroll
                  </button>
                </div>
              )}

              {/* Mobile Scroll Protection Overlay */}
              {!isDrawingActive && (
                <div className="rangoli-overlay">
                  <div className="overlay-icon">🎨</div>
                  <h4>Rangoli Studio</h4>
                  <p>
                    Tap the button below to start drawing. This prevents accidental marks while scrolling on touchscreens!
                  </p>
                  <button
                    type="button"
                    className="rangoli-start-btn"
                    onClick={() => {
                      setIsDrawingActive(true);
                      showToastNotification("Drawing mode unlocked! Touch and drag to draw.");
                    }}
                  >
                    ✨ Start Drawing Rangoli
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="field">Choose a festive rangoli pattern</div>
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
                    showToastNotification(`Pattern switched to ${label}`);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="field">
              Choose gulal colour
              <span
                className="brush-indicator"
                style={{
                  width: Math.max(10, brushSize),
                  height: Math.max(10, brushSize),
                  background: isEraser ? "rgba(255,255,255,0.25)" : activeColour,
                }}
              />
            </div>
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
              Brush size ({brushSize}px)
            </label>
            <input
              id="brush"
              type="range"
              min={3}
              max={32}
              value={brushSize}
              onChange={(e) => setBrushSize(+e.target.value)}
              style={{ width: "100%", accentColor: "#ffd66b" }}
            />

            <div className="tool-row-3">
              <button
                type="button"
                className={`tool-btn eraser-btn ${isEraser ? "active" : ""}`}
                id="eraserBtn"
                onClick={() => {
                  if (!isDrawingActive) setIsDrawingActive(true);
                  setIsEraser(!isEraser);
                }}
                aria-pressed={isEraser}
              >
                {isEraser ? "Eraser On" : "Eraser"}
              </button>
              <button
                type="button"
                className="tool-btn"
                onClick={handleUndo}
                title="Undo last stroke"
              >
                ↩ Undo
              </button>
              <button
                type="button"
                className="tool-btn"
                onClick={handleClearDrawing}
                title="Clear user paint while keeping pattern"
              >
                Clear Paint
              </button>
            </div>

            <button
              type="button"
              className="tool-btn"
              style={{
                background: isDrawingActive ? "rgba(255, 233, 154, 0.16)" : "rgba(255, 255, 255, 0.08)",
                border: isDrawingActive ? "1px solid #ffd46c" : "1px solid rgba(247, 209, 123, 0.35)",
                color: isDrawingActive ? "#ffd46c" : "#ffedc0",
              }}
              onClick={() => {
                const nextState = !isDrawingActive;
                setIsDrawingActive(nextState);
                showToastNotification(
                  nextState ? "Drawing mode active!" : "Drawing paused — page scroll enabled"
                );
              }}
            >
              {isDrawingActive ? "✓ Done Drawing (Scroll Mode)" : "🎨 Enter Drawing Mode"}
            </button>

            <button type="button" className="tool-btn primary" onClick={handleSaveRangoli}>
              Download my rangoli ↓
            </button>
            <p style={{ fontSize: "11px", color: "#e7c6d1", lineHeight: 1.6, marginTop: "8px" }}>
              ✨ The golden pattern lines will never be erased! Use the eraser to clean up strokes freely. Tap &quot;Done / Enable Scroll&quot; whenever you want to scroll smoothly on mobile.
            </p>
          </div>
        </div>
      </section>

      {/* Surprise Blessing Section */}
      <section className="content" id="blessing">
        <div className="panel surprise-panel">
          <div className="surprise-kicker">✦ A Special Diwali Gift ✦</div>
          <h2>An Untold Blessing Awaits</h2>
          <p>
            Beyond the gleaming lamps and festive sweets lies a personal prayer written especially for your journey ahead. Tap to unfurl your sacred Diwali blessing.
          </p>

          <div className="surprise-btn-wrap">
            <div className="surprise-pulse-glow" aria-hidden="true" />
            <button
              type="button"
              className="surprise-btn"
              onClick={handleOpenSurprise}
              aria-label="Open surprise emotional Diwali blessing scroll"
            >
              <span className="surprise-btn-icon" aria-hidden="true">🪔</span>
              <span>Open Surprise Blessing ✨</span>
            </button>
          </div>

          {/* Confetti Mode Toggle */}
          <div className="confetti-toggle-container">
            <button
              type="button"
              className={`confetti-toggle-btn ${confettiMode ? "active" : ""}`}
              onClick={handleToggleConfettiMode}
              aria-pressed={confettiMode}
              aria-label="Toggle Golden Confetti Shower during fireworks"
            >
              <span className="confetti-toggle-icon" aria-hidden="true">
                {confettiMode ? "🎊" : "✨"}
              </span>
              <span className="confetti-toggle-text">
                Confetti Mode: <strong>{confettiMode ? "ON" : "OFF"}</strong>
              </span>
              <span className={`confetti-pill-switch ${confettiMode ? "active" : ""}`} aria-hidden="true">
                <span className="confetti-switch-knob" />
              </span>
            </button>
            <p className="confetti-toggle-hint">
              {confettiMode
                ? "🌟 Enabled! When you launch fireworks, a persistent shower of golden confetti cascades across the screen."
                : "💡 Turn ON to cascade continuous golden foil confetti across the screen during the fireworks celebration."}
            </p>
          </div>
        </div>
      </section>

      {/* Vintage Yellowish Parchment Scroll Modal */}
      <div
        className={`scroll-backdrop ${surpriseOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Special Diwali Blessing Parchment Scroll"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleCloseSurprise();
        }}
      >
        {surpriseOpen && (
          <div className="scroll-modal">
            {/* Top Wooden Spindle with Turned Gold Finials */}
            <div className="scroll-spindle top" aria-hidden="true" />

            {/* Antique Yellowish Parchment Paper Sheet */}
            <div className="parchment-sheet">
              {/* Close Button Top Corner */}
              <button
                type="button"
                className="parchment-close-top"
                onClick={handleCloseSurprise}
                aria-label="Close blessing scroll"
              >
                ✕
              </button>

              {/* Ornate Corner Filigree */}
              <span className="parchment-corner tl" aria-hidden="true">❦</span>
              <span className="parchment-corner tr" aria-hidden="true">❧</span>
              <span className="parchment-corner bl" aria-hidden="true">❧</span>
              <span className="parchment-corner br" aria-hidden="true">❦</span>

              {/* Wax Seal with Gold Diya Insignia */}
              <div className="wax-seal-wrapper">
                <div className="wax-seal" title="Sacred Diwali Wax Seal" aria-hidden="true">
                  <div className="wax-seal-inner">🪔</div>
                </div>
              </div>

              <div className="parchment-kicker">Shubh Deepavali · Sacred Whispers</div>
              <h3 className="parchment-heading">A Blessing of Light &amp; Serenity</h3>

              <div className="parchment-divider" aria-hidden="true">
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
              </div>

              {/* Revealing Emotional Cursive Calligraphy */}
              <div className="blessing-cursive">
                <p>
                  <span className="drop-first">M</span>ay the sacred flame of the diya illuminate every shadowed corner of your path.
                </p>
                <p>
                  In the gentle warmth of this festive night, may peace settle deep within your heart, may quiet hopes find their wings, and may eternal light guide your footsteps toward boundless grace, inner prosperity, and everlasting serenity.
                </p>
                <div className="closing">
                  Shubh Deepavali to you and everyone you hold dear. 🪔
                </div>
              </div>

              {/* Scroll Actions */}
              <div className="parchment-actions">
                <button
                  type="button"
                  className="parchment-btn primary"
                  onClick={handleCopyBlessing}
                >
                  {isCopiedBlessing ? "✓ Blessing Copied!" : "📋 Copy Blessing"}
                </button>
                <button
                  type="button"
                  className="parchment-btn secondary"
                  onClick={handleShareBlessing}
                >
                  💬 Share on WhatsApp
                </button>
                <button
                  type="button"
                  className={`parchment-btn ${confettiMode ? "primary" : "secondary"}`}
                  onClick={handleToggleConfettiMode}
                  title="Toggle persistent golden confetti shower during fireworks"
                >
                  {confettiMode ? "🎊 Confetti Mode: ON" : "✨ Confetti Mode: OFF"}
                </button>
                <button
                  type="button"
                  className="parchment-btn secondary"
                  onClick={handleCloseSurprise}
                >
                  📜 Fold Scroll
                </button>
              </div>
            </div>

            {/* Bottom Wooden Spindle with Turned Gold Finials */}
            <div className="scroll-spindle bottom" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Fireworks Section */}
      <section className="content" id="celebrate">
        <div className="panel celebrate">
          <div className="firework-area" id="fireworkArea" ref={fireworkAreaRef} aria-hidden="true" />
          <div className="kicker">Ready for a little magic?</div>
          <h2>Let the sky sparkle!</h2>
          <p>Press the button and send a burst of Diwali joy across the screen.</p>
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
          <span style={{ "--i": "0" } as React.CSSProperties}>N</span>
          <span style={{ "--i": "1" } as React.CSSProperties}>E</span>
          <span style={{ "--i": "2" } as React.CSSProperties}>X</span>
          <span style={{ "--i": "3" } as React.CSSProperties}>O</span>
          <span style={{ "--i": "4" } as React.CSSProperties}>R</span>
          <span style={{ "--i": "5" } as React.CSSProperties}>A</span>
        </div>
        <p className="tagline">A duo team · Two minds, one light</p>
        <div className="team-grid">
          <div
            className="team-card clickable"
            onClick={() => setSelectedMember("pratik")}
            role="button"
            tabIndex={0}
            aria-label="View Pratik Ghosh profile and connection links"
          >
            <div className="avatar">PG</div>
            <button
              type="button"
              className="team-name-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMember("pratik");
              }}
            >
              Pratik Ghosh
            </button>
            <p>Co-creator</p>
          </div>
          <div
            className="team-card clickable"
            onClick={() => setSelectedMember("samragnyi")}
            role="button"
            tabIndex={0}
            aria-label="View Samragnyi Bhowmick profile and connection links"
          >
            <div className="avatar">SB</div>
            <button
              type="button"
              className="team-name-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMember("samragnyi");
              }}
            >
              Samragnyi Bhowmick
            </button>
            <p>Co-creator</p>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: "12px", color: "#ffd46c", marginTop: "18px", letterSpacing: "1.2px", fontWeight: 700 }}>
          💡 Click on the names for contacts
        </p>
      </section>

      {/* Team Member Profile Modal Dialog */}
      <div
        className={`team-modal-backdrop ${selectedMember ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Team member profile details"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedMember(null);
        }}
      >
        {selectedMember && (
          <div className="team-modal">
            <button
              type="button"
              className="team-modal-close"
              onClick={() => setSelectedMember(null)}
              aria-label="Close profile modal"
            >
              ✕
            </button>
            <div className="team-modal-avatar">
              {teamMembers[selectedMember].avatar}
            </div>
            <h3>{teamMembers[selectedMember].name}</h3>
            <div className="role">{teamMembers[selectedMember].role}</div>
            <p className="bio">{teamMembers[selectedMember].bio}</p>

            <div className="team-links-grid">
              <a
                href={`mailto:${teamMembers[selectedMember].gmail}`}
                className="team-link-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="team-link-icon">
                  <GmailIcon size={18} />
                </div>
                <div className="team-link-info">
                  <strong>Gmail</strong>
                  <small>{teamMembers[selectedMember].gmail}</small>
                </div>
                <ExternalIcon size={16} className="team-link-arrow" />
              </a>

              <a
                href={teamMembers[selectedMember].instagram}
                className="team-link-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="team-link-icon">
                  <InstagramIcon size={18} />
                </div>
                <div className="team-link-info">
                  <strong>Instagram</strong>
                  <small>View Profile</small>
                </div>
                <ExternalIcon size={16} className="team-link-arrow" />
              </a>

              <a
                href={teamMembers[selectedMember].github}
                className="team-link-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="team-link-icon">
                  <GithubIcon size={18} />
                </div>
                <div className="team-link-info">
                  <strong>GitHub</strong>
                  <small>{teamMembers[selectedMember].github.replace("https://github.com/", "")}</small>
                </div>
                <ExternalIcon size={16} className="team-link-arrow" />
              </a>

              <a
                href={teamMembers[selectedMember].linkedin}
                className="team-link-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="team-link-icon">
                  <LinkedinIcon size={18} />
                </div>
                <div className="team-link-info">
                  <strong>LinkedIn</strong>
                  <small>View Professional Profile</small>
                </div>
                <ExternalIcon size={16} className="team-link-arrow" />
              </a>
            </div>
          </div>
        )}
      </div>

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

      {/* Floating Music Button & Pop-Up Badge */}
      <div className="floating-music-widget">
        <button
          type="button"
          className="floating-music-pop-badge"
          onClick={toggleMusic}
          aria-label={musicOn ? "Pause festive music" : "Play festive music"}
        >
          {musicOn ? "♫ Music Playing" : "♫ Turn Music On"}
        </button>
        <button
          type="button"
          className={`floating-music-btn ${musicOn ? "playing" : ""}`}
          onClick={toggleMusic}
          aria-label={musicOn ? "Pause festive music" : "Play festive music"}
          title={musicOn ? "Pause festive music" : "Turn on music"}
        >
          {musicOn && <span className="floating-note-sparkle" aria-hidden="true">🎵</span>}
          {musicOn ? (
            <div className="sound-wave-bars" aria-hidden="true">
              <span className="sound-bar" />
              <span className="sound-bar" />
              <span className="sound-bar" />
              <span className="sound-bar" />
            </div>
          ) : (
            <span className="music-icon-note" aria-hidden="true">♫</span>
          )}
        </button>
      </div>

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

function GmailIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function InstagramIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function GithubIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function ExternalIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  );
}

