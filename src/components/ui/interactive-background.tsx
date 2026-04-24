'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

class TouchTexture {
  private size: number;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private trail: Array<{ x: number; y: number; age: number; force: number }>;
  private maxAge: number;

  constructor(size: number = 512) {
    this.size = size;
    this.maxAge = 120;
    this.trail = [];

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = this.size;
    this.ctx = this.canvas.getContext('2d')!;

    // Create texture
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.format = THREE.RGBAFormat;

    this.clear();
  }

  clear() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.size, this.size);
  }

  addTouch(point: { x: number; y: number }) {
    let force = 0;
    const last = this.trail[this.trail.length - 1];
    
    if (last) {
      const dx = point.x - last.x;
      const dy = point.y - last.y;
      force = Math.min(Math.hypot(dx, dy) * 0.01, 1);
    }

    this.trail.push({ x: point.x, y: point.y, age: 0, force });
  }

  update() {
    this.clear();

    // Age trail points
    this.trail.forEach((point) => {
      point.age++;
    });

    // Remove old points
    this.trail = this.trail.filter((point) => point.age < this.maxAge);

    // Draw trail
    this.trail.forEach((point, i) => {
      const f = point.force * (1 - point.age / this.maxAge);
      const x = point.x * this.size;
      const y = point.y * this.size;
      const radius = f * 50;

      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${f * 0.8})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.globalCompositeOperation = 'screen';
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.texture.needsUpdate = true;
  }

  getTexture() {
    return this.texture;
  }
}

class GradientBackground {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private touchTexture: TouchTexture;
  private material: THREE.ShaderMaterial;
  private mouse: THREE.Vector2;
  private time: number;

  constructor(container: HTMLElement) {
    this.mouse = new THREE.Vector2(-1, -1);
    this.time = 0;

    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Touch texture
    this.touchTexture = new TouchTexture();

    // Shader material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: this.mouse },
        uTexture: { value: this.touchTexture.getTexture() },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        varying vec2 vUv;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187,
                              0.366025403784439,
                             -0.577350269189626,
                              0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 st = gl_FragCoord.xy / uResolution;
          vec2 uv = vUv;
          
          // Sample touch texture
          vec4 touchColor = texture2D(uTexture, uv);
          
          // Create base gradient
          vec3 color1 = vec3(0.02, 0.05, 0.2);   // slate-950
          vec3 color2 = vec3(0.1, 0.2, 0.4);     // blue-950
          vec3 color3 = vec3(0.02, 0.05, 0.2);   // slate-950
          
          // Gradient mixing
          float gradientFactor = uv.x + uv.y * 0.5;
          gradientFactor += snoise(uv * 2.0 + uTime * 0.1) * 0.3;
          gradientFactor += snoise(uv * 4.0 + uTime * 0.05) * 0.1;
          
          vec3 gradient = mix(color1, color2, smoothstep(0.2, 0.8, gradientFactor));
          gradient = mix(gradient, color3, smoothstep(0.6, 1.2, gradientFactor));
          
          // Add mouse interaction
          float mouseDistance = distance(uv, uMouse);
          float mouseEffect = 1.0 - smoothstep(0.0, 0.3, mouseDistance);
          gradient += vec3(0.1, 0.2, 0.4) * mouseEffect * 0.5;
          
          // Add touch interaction
          gradient += touchColor.rgb * 0.8;
          
          // Add subtle animation
          float wave = sin(uTime * 0.5 + uv.x * 10.0) * 0.02;
          gradient += wave;
          
          gl_FragColor = vec4(gradient, 1.0);
        }
      `,
      transparent: true,
    });

    // Create plane
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(mesh);

    // Event listeners
    this.setupEventListeners(container);
    this.animate();
  }

  private setupEventListeners(container: HTMLElement) {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      this.mouse.x = (event.clientX - rect.left) / rect.width;
      this.mouse.y = 1 - (event.clientY - rect.top) / rect.height;
      
      this.touchTexture.addTouch(this.mouse);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const touch = event.touches[0];
      this.mouse.x = (touch.clientX - rect.left) / rect.width;
      this.mouse.y = 1 - (touch.clientY - rect.top) / rect.height;
      
      this.touchTexture.addTouch(this.mouse);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
  }

  private animate = () => {
    this.time += 0.016;
    this.material.uniforms.uTime.value = this.time;
    this.material.uniforms.uMouse.value = this.mouse;
    
    this.touchTexture.update();
    
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  };

  resize(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.material.uniforms.uResolution.value.set(width, height);
  }

  dispose() {
    this.renderer.dispose();
    this.material.dispose();
    this.touchTexture.getTexture().dispose();
  }
}

interface InteractiveBackgroundProps {
  className?: string;
}

export function InteractiveBackground({ className = '' }: InteractiveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<GradientBackground | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize background
    backgroundRef.current = new GradientBackground(containerRef.current);

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && backgroundRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        backgroundRef.current.resize(clientWidth, clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (backgroundRef.current) {
        backgroundRef.current.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 ${className}`}
      style={{ 
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}