/// <reference types="@react-three/fiber" />
import React, { useRef, Suspense, useState, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Stars, Float, MeshDistortMaterial, Cloud, Sky } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Briefcase, GraduationCap, User, Cpu, Sun, Moon, Sparkles, Download } from 'lucide-react';
import * as THREE from 'three';

// --- Componentes 3D ---

const Bird = ({ position, speed }: { position: [number, number, number], speed: number }) => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.x += speed;
      mesh.current.position.y += Math.sin(state.clock.elapsedTime * 2 + position[1]) * 0.01;
      if (mesh.current.position.x > 15) mesh.current.position.x = -15;
    }
  });
  return (
    <mesh ref={mesh} position={position} rotation={[0, Math.PI / 2, 0]}>
      <tetrahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial color="#475569" />
    </mesh>
  );
};

const Flock = () => {
  const birds = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      pos: [Math.random() * 30 - 15, Math.random() * 5 + 3, Math.random() * 10 - 15] as [number, number, number],
      speed: 0.01 + Math.random() * 0.03
    }));
  }, []);
  return <>{birds.map((bird) => <Bird key={bird.id} position={bird.pos} speed={bird.speed} />)}</>;
};

const AnimatedSphere = ({ color }: { color: string }) => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial color={color} attach="material" distort={0.4} speed={2} roughness={0} />
      </mesh>
    </Float>
  );
};

// --- Componentes de Interfaz ---

const Section = ({ children, title, icon: Icon, index }: { children: React.ReactNode, title: string, icon: any, index: number }) => (
  <motion.section 
    initial={{ opacity: 0, y: 50, x: index % 2 === 0 ? -20 : 20 }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="section-container"
  >
    <div className="section-header">
      <Icon size={32} className="section-icon" />
      <h2>{title}</h2>
    </div>
    {children}
  </motion.section>
);

const Particle = ({ color }: { color: string }) => {
  const x = Math.random() * 100 - 50;
  const y = Math.random() * 100 - 50;
  return (
    <motion.span
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ position: 'absolute', width: '4px', height: '4px', backgroundColor: color, borderRadius: '50%', pointerEvents: 'none', zIndex: -1 }}
    />
  );
};

const Char = ({ char, isDarkMode, index, activeIndex, onHover }: { 
  char: string, isDarkMode: boolean, index: number, activeIndex: number | null, onHover: (idx: number | null) => void 
}) => {
  const glowColor = isDarkMode ? "#22d3ee" : "#0369a1";
  const baseColor = isDarkMode ? "#fff" : "#0f172a"; 

  const distance = activeIndex !== null ? Math.abs(index - activeIndex) : null;
  let yMove = 0;
  let scale = 1;
  
  if (distance !== null) {
    if (distance === 0) { yMove = -25; scale = 1.2; }
    else if (distance === 1) { yMove = -12; scale = 1.1; }
    else if (distance === 2) { yMove = -5; scale = 1.05; }
  }

  return (
    <span style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={() => onHover(index)} onMouseLeave={() => onHover(null)}>
      <motion.span
        style={{ display: 'inline-block', cursor: 'default' }}
        animate={{ 
          y: yMove, scale: scale, 
          color: activeIndex === index ? (isDarkMode ? '#fff' : '#0ea5e9') : baseColor,
          textShadow: activeIndex === index ? `0 0 20px ${glowColor}` : 'none'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
      {activeIndex === index && [1, 2, 3].map(i => <Particle key={i} color={glowColor} />)}
    </span>
  );
};

const ParticleText = ({ text, isDarkMode }: { text: string, isDarkMode: boolean }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  let globalCharIndex = 0;
  return (
    <div style={{ display: 'inline-block' }}>
      {text.split(" ").map((word, wordIdx) => (
        <span key={wordIdx} style={{ whiteSpace: 'nowrap', display: 'inline-block', marginRight: '0.3em' }}>
          {word.split("").map((char) => {
            const currentIdx = globalCharIndex++;
            return <Char key={currentIdx} char={char} isDarkMode={isDarkMode} index={currentIdx} activeIndex={activeIndex} onHover={setActiveIndex} />;
          })}
        </span>
      ))}
    </div>
  );
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const handleDownloadCV = () => alert("Descarga de CV deshabilitada por motivos de seguridad.");

  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            {isDarkMode ? (
              <>
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.5} />
              </>
            ) : (
              <>
                <Sky sunPosition={[100, 20, 100]} />
                <Cloud position={[-6, 2, -12]} speed={0.2} opacity={0.4} />
                <Cloud position={[6, -1, -15]} speed={0.15} opacity={0.3} />
                <Cloud position={[0, 4, -20]} speed={0.1} opacity={0.2} />
                <Flock />
                <ambientLight intensity={1.5} />
              </>
            )}
            <pointLight position={[10, 10, 10]} intensity={1} color={isDarkMode ? "#22d3ee" : "#38bdf8"} />
            <AnimatedSphere color={isDarkMode ? "#22d3ee" : "#0ea5e9"} />
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <main className="content">
        <header className="hero">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <h1><ParticleText text="ÁNGEL [CONFIDENCIAL]" isDarkMode={isDarkMode} /></h1>
            <p className="subtitle">ING. TECNOLOGÍAS DE LA INFORMACIÓN</p>
            <div className="hero-tags">
              <span>Desarrollador Full Stack</span>
              <span>Innovador</span>
              <span>Proactivo</span>
            </div>
            <motion.button className="download-btn" onClick={handleDownloadCV} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Download size={20} />
              <span>Solicitar CV</span>
            </motion.button>
          </motion.div>
        </header>

        <Section title="Sobre Mí" icon={User} index={0}>
          <p className="about-text">
            Profesional proactivo y organizado, con una profunda pasión por la tecnología y la innovación digital. 
            Me caracterizo por mi responsabilidad y mi interés constante en actualizarme con las últimas tendencias del sector. 
          </p>
        </Section>

        <Section title="Conocimientos Técnicos" icon={Cpu} index={1}>
          <div className="skills-grid">
            {["Vite & React", "TypeScript", "C# (.NET)", "HTML5", "CSS", "PHP", "JavaScript", "Node.js", "SQL Server", "MySQL", "Android Studio", "WordPress", "AppSheet", "Redes", "Microsoft Office"].map(skill => (
              <motion.div key={skill} whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? "rgba(34, 211, 238, 0.1)" : "rgba(14, 165, 233, 0.05)" }} className="skill-tag">{skill}</motion.div>
            ))}
          </div>
        </Section>

        <Section title="Habilidades" icon={Sparkles} index={2}>
          <div className="skills-grid">
            {["Trabajo con IA", "Pensamiento crítico", "Solución de problemas", "Buena comunicación", "Trabajo en colaboración", "Buen aprendiz"].map(skill => (
              <motion.div key={skill} className="skill-tag skill-highlight">{skill}</motion.div>
            ))}
          </div>
        </Section>

        <Section title="Experiencia Laboral" icon={Briefcase} index={3}>
          <div className="timeline">
            <div className="timeline-item">
              <div className="time">Dic 2025 - Actual</div>
              <h3>[Empresa del Sector Industrial]</h3>
              <p className="role">Desarrollador</p>
              <ul>
                <li>Actualizaciones del sistema interino (ERP).</li>
                <li>Consultas y reportes en SQL Server.</li>
                <li>Creación, modificación de Tablas y Stored Procedures en SQL Server.</li>
                <li>Mantenimiento a la infraestructura de la red y reacomodo del Site.</li>
                <li>Administración de usuarios, configuración de equipos e instalación de programas.</li>
                <li>Auditor de inventario.</li>
              </ul>
            </div>

            <div className="timeline-item">
              <div className="time">Ago 2024 - Dic 2024</div>
              <h3>[Agencia de Desarrollo Web]</h3>
              <p className="role">Desarrollador Web</p>
              <p>Desarrollé un proyecto de Estadías Profesionales creando una plataforma web para mejorar la experiencia de compra. Desarrollé una página web con catálogo de productos para facilitar cotizaciones y agilizar procesos de compra.</p>
            </div>

            <div className="timeline-item">
              <div className="time">Ago 2023 - Dic 2023</div>
              <h3>[Institución de Educación Superior]</h3>
              <p className="role">Auxiliar de sistemas computacionales</p>
              <p>Desarrollo de geolocalización cartográfica de escuelas en la región. Realicé inventario de escuelas para proyecto de rutas accesibles. Colaboré en trazado de rutas para escuelas rurales en la región.</p>
            </div>

            <div className="timeline-item">
              <div className="time">Ago 2022 - Dic 2022</div>
              <h3>[Institución de Educación Superior]</h3>
              <p className="role">Auxiliar de sistemas computacionales</p>
              <p>Elaboré manuales de soporte y mantenimiento para equipos de cómputo. Brindé atención al personal interno.</p>
            </div>
          </div>
        </Section>

        <Section title="Educación" icon={GraduationCap} index={4}>
          <div className="edu-card">
            <h3>[Universidad Tecnológica]</h3>
            <p>Ingeniería en Tecnologías de la Información (2021 - 2024)</p>
          </div>
          <div className="edu-card">
            <h3>[Bachillerato Técnico]</h3>
            <p>Bachiller en Auxiliar Educativo (2018)</p>
          </div>
        </Section>

        <Section title="Contacto" icon={Mail} index={5}>
          <div className="contact-grid">
            <div className="contact-item"><Phone size={24} /><span>[Teléfono Confidencial]</span></div>
            <div className="contact-item"><Mail size={24} /><span>[Correo Confidencial]</span></div>
          </div>
        </Section>

        <footer className="footer">
          <p>© 2026 [Confidencial] | Ing. en Tecnologías de la Información</p>
        </footer>
      </main>

      <style>{`
        .app-wrapper { width: 100%; transition: background-color 0.8s ease, color 0.5s; min-height: 100vh; overflow-x: hidden; }
        .app-wrapper.dark { color: white; background: #050505; }
        .app-wrapper.light { color: #1e293b; background: #f0f9ff; }
        .canvas-container { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 0; pointer-events: none; }
        .content { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; padding: 0 20px; }
        .hero { height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; flex-direction: column; }
        h1 { font-size: clamp(2.5rem, 8vw, 5rem); margin: 0; color: #0f172a; letter-spacing: -2px; font-weight: 800; }
        .dark h1 { color: #fff; }
        .subtitle { font-size: 1.5rem; color: #475569; margin-top: 10px; letter-spacing: 4px; }
        .dark .subtitle { color: #888; }
        .hero-tags { display: flex; gap: 15px; justify-content: center; margin-top: 20px; margin-bottom: 30px; }
        .hero-tags span { padding: 5px 15px; border: 1px solid rgba(15, 23, 42, 0.1); border-radius: 20px; font-size: 0.9rem; color: #475569; }
        .dark .hero-tags span { border-color: #333; color: #aaa; }
        .download-btn { display: flex; align-items: center; gap: 10px; padding: 12px 24px; background: rgba(15, 23, 42, 0.05); border: 1.5px solid #0f172a; color: #0f172a; border-radius: 50px; cursor: pointer; font-weight: 600; backdrop-filter: blur(10px); transition: all 0.3s; margin: 0 auto; position: relative; overflow: hidden; }
        .dark .download-btn { background: rgba(34, 211, 238, 0.1); border-color: #22d3ee; color: #22d3ee; }
        .download-btn::before { content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.5), transparent); transition: all 0.6s; }
        .download-btn:hover::before { left: 100%; }
        .section-container { margin-bottom: 150px; padding: 40px; background: rgba(255,255,255,0.8); backdrop-filter: blur(25px); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05); }
        .dark .section-container { background: rgba(10,10,10,0.7); border-color: rgba(255,255,255,0.05); box-shadow: none; }
        .section-header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; }
        .section-header h2 { font-size: 2rem; margin: 0; }
        .section-icon { color: #0ea5e9; }
        .dark .section-icon { color: #22d3ee; }
        .about-text { font-size: 1.1rem; line-height: 1.8; color: #334155; }
        .dark .about-text { color: #ccc; }
        .skills-grid { display: flex; flex-wrap: wrap; gap: 12px; }
        .skill-tag { padding: 8px 16px; background: rgba(15, 23, 42, 0.03); border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease; color: #1e293b; }
        .dark .skill-tag { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: #fff; }
        .skill-highlight { border-color: rgba(14, 165, 233, 0.4); background: rgba(14, 165, 233, 0.05); }
        .timeline-item { padding-left: 20px; border-left: 2px solid #0ea5e9; margin-bottom: 40px; position: relative; }
        .dark .timeline-item { border-left-color: #22d3ee; }
        .timeline-item::before { content: ''; position: absolute; left: -7px; top: 0; width: 12px; height: 12px; background: #0ea5e9; border-radius: 50%; }
        .dark .timeline-item::before { background: #22d3ee; }
        .time { font-size: 0.9rem; color: #0284c7; margin-bottom: 5px; font-weight: 600; }
        .dark .time { color: #22d3ee; }
        .role { font-weight: bold; color: inherit; margin-bottom: 10px; }
        .contact-item { display: flex; align-items: center; gap: 10px; color: inherit; text-decoration: none; padding: 15px 25px; background: rgba(255, 255, 255, 0.6); border-radius: 12px; transition: transform 0.2s, color 0.2s; border: 1px solid rgba(0,0,0,0.03); }
        .dark .contact-item { background: rgba(255, 255, 255, 0.03); }
        .contact-item:hover { transform: translateY(-5px); color: #0ea5e9; border-color: #0ea5e9; }
        .dark .contact-item:hover { color: #22d3ee; border-color: #22d3ee; }
        .theme-toggle { position: fixed; top: 20px; right: 20px; z-index: 100; background: rgba(255, 255, 255, 0.5); border: 1.5px solid rgba(15, 23, 42, 0.1); color: #1e293b; padding: 10px; border-radius: 50%; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
        .dark .theme-toggle { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); color: #fff; }
        .footer { padding: 50px 0; text-align: center; color: #475569; font-size: 0.9rem; }
        .dark .footer { color: #888; }
        @media (max-width: 600px) { .section-container { padding: 25px; margin-bottom: 80px; } .hero-tags { flex-direction: column; gap: 10px; align-items: center; } .content { padding: 0 15px; } h1 { font-size: 2.5rem; } }
      `}</style>
    </div>
  );
};

export default App;
