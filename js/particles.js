/**
 * Animated Network Particles Background
 * Created for Abrar Ahmed's Portfolio Website
 * 
 * This script creates an interactive animated background with particles
 * representing a network/cloud infrastructure theme.
 */

class ParticlesNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.connections = [];
    this.mouse = {
      x: null,
      y: null,
      radius: 150
    };
    
    // Color scheme from website
    this.colors = {
      primary: '#2563eb',      // Primary blue
      primaryLight: '#60a5fa', // Light blue
      secondary: '#10b981',    // Secondary green
      dark: '#1f2937',         // Dark background
      light: '#f9fafb'         // Light color
    };
    
    // Particle settings
    this.particleCount = 80;
    this.particleMinRadius = 1;
    this.particleMaxRadius = 5;
    this.particleMaxSpeed = 0.5;
    this.connectionDistance = 150;
    this.isDarkTheme = document.body.classList.contains('dark-theme');
    
    // Initialize
    this.init();
    this.animate();
    this.setupEventListeners();
  }
  
  init() {
    // Set canvas to full window size
    this.resizeCanvas();
    
    // Create particles
    for (let i = 0; i < this.particleCount; i++) {
      const radius = Math.random() * (this.particleMaxRadius - this.particleMinRadius) + this.particleMinRadius;
      const x = Math.random() * (this.canvas.width - radius * 2) + radius;
      const y = Math.random() * (this.canvas.height - radius * 2) + radius;
      const directionX = (Math.random() - 0.5) * this.particleMaxSpeed;
      const directionY = (Math.random() - 0.5) * this.particleMaxSpeed;
      
      // Randomly assign colors with higher probability for primary
      const colorRand = Math.random();
      let color;
      if (colorRand < 0.7) {
        color = this.colors.primary;
      } else if (colorRand < 0.9) {
        color = this.colors.primaryLight;
      } else {
        color = this.colors.secondary;
      }
      
      this.particles.push({
        x,
        y,
        radius,
        directionX,
        directionY,
        color,
        originalRadius: radius,
        opacity: Math.random() * 0.5 + 0.5
      });
    }
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  setupEventListeners() {
    // Resize event
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
    
    // Mouse move event for interactive effect
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = event.x;
      this.mouse.y = event.y;
    });
    
    // Mouse leave event
    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
    
    // Theme change event
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      setTimeout(() => {
        this.isDarkTheme = document.body.classList.contains('dark-theme');
      }, 100);
    });
  }
  
  // Draw individual particle
  drawParticle(particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = particle.color;
    this.ctx.globalAlpha = particle.opacity;
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }
  
  // Draw connections between particles
  drawConnections() {
    this.connections = [];
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.connectionDistance) {
          // Calculate opacity based on distance
          const opacity = 1 - (distance / this.connectionDistance);
          
          this.connections.push({
            x1: this.particles[i].x,
            y1: this.particles[i].y,
            x2: this.particles[j].x,
            y2: this.particles[j].y,
            opacity: opacity * 0.5
          });
        }
      }
    }
    
    // Draw all connections
    for (const connection of this.connections) {
      this.ctx.beginPath();
      this.ctx.moveTo(connection.x1, connection.y1);
      this.ctx.lineTo(connection.x2, connection.y2);
      this.ctx.strokeStyle = this.isDarkTheme ? this.colors.primaryLight : this.colors.primary;
      this.ctx.globalAlpha = connection.opacity;
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;
    }
  }
  
  // Update particle positions and handle interactions
  updateParticles() {
    for (const particle of this.particles) {
      // Boundary collision detection
      if (particle.x + particle.radius > this.canvas.width || particle.x - particle.radius < 0) {
        particle.directionX = -particle.directionX;
      }
      
      if (particle.y + particle.radius > this.canvas.height || particle.y - particle.radius < 0) {
        particle.directionY = -particle.directionY;
      }
      
      // Move particles
      particle.x += particle.directionX;
      particle.y += particle.directionY;
      
      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          // Increase particle size when mouse is near
          const targetRadius = particle.originalRadius * 2;
          particle.radius += (targetRadius - particle.radius) * 0.1;
          
          // Add slight repulsion effect
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          const forceDirectionX = Math.cos(angle) * force * 0.5;
          const forceDirectionY = Math.sin(angle) * force * 0.5;
          
          particle.x += forceDirectionX;
          particle.y += forceDirectionY;
        } else {
          // Return to original size
          particle.radius += (particle.originalRadius - particle.radius) * 0.1;
        }
      } else {
        // Return to original size when mouse leaves
        particle.radius += (particle.originalRadius - particle.radius) * 0.1;
      }
      
      // Draw the particle
      this.drawParticle(particle);
    }
  }
  
  // Main animation loop
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawConnections();
    this.updateParticles();
  }
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  // Create canvas element for particles
  const particlesCanvas = document.createElement('canvas');
  particlesCanvas.id = 'particles-canvas';
  particlesCanvas.style.position = 'absolute';
  particlesCanvas.style.top = '0';
  particlesCanvas.style.left = '0';
  particlesCanvas.style.width = '100%';
  particlesCanvas.style.height = '100%';
  particlesCanvas.style.zIndex = '1';
  particlesCanvas.style.pointerEvents = 'none'; // Allow clicks to pass through
  
  // Add canvas to hero section
  const heroSection = document.querySelector('.hero .section-bg');
  heroSection.appendChild(particlesCanvas);
  
  // Initialize particles
  new ParticlesNetwork('particles-canvas');
});
